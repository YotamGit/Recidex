import mongoose from "mongoose";

import {
  IngredientCategories,
  IngredientMeasurementUnits,
  IngredientPrepMethods,
  IngredientDimensionConversion,
  Ingredient,
} from "../models/Ingredient.js";

import { loadJsonFromData } from "./files.js";

export async function syncIngredientData() {
  const subFolder = "ingredients";
  const dataFiles = [
    {
      filename: "ingredient_categories",
      primaryKeys: ["category_id"],
      model: IngredientCategories,
    },
    {
      filename: "ingredient_dimension_conversion",
      primaryKeys: ["item_id", "from_unit_id", "to_unit_id"],
      model: IngredientDimensionConversion,
    },
    {
      filename: "ingredient_measurement_units",
      primaryKeys: ["unit_id"],
      model: IngredientMeasurementUnits,
    },
    {
      filename: "ingredient_prep_methods",
      primaryKeys: ["prep_id"],
      model: IngredientPrepMethods,
    },
    {
      filename: "ingredients",
      primaryKeys: ["item_id"],
      model: Ingredient,
    },
  ];

  const fileDataByName = Object.fromEntries(
    await Promise.all(
      dataFiles.map(async ({ filename }) => {
        const data = await loadJsonFromData(filename, subFolder);
        return [filename, data];
      }),
    ),
  );

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      for (const { filename, primaryKeys, model } of dataFiles) {
        const [recordsToInsert, recordsToUpdate, recordsToDelete] =
          await getRecordArraysForSync(
            session,
            fileDataByName[filename],
            model,
            primaryKeys,
          );

        const ops = getDbOpsArray(
          recordsToInsert,
          recordsToUpdate,
          recordsToDelete,
          primaryKeys,
        );

        if (ops.length) {
          const result = await model.bulkWrite(ops, {
            session,
            ordered: true,
          });
        }
      }
    });
  } finally {
    await session.endSession();
  }
}

async function getRecordArraysForSync(session, fileData, model, primaryKeys) {
  const dbData = await model.find({}, null, { session }).lean();

  const fileDataIdsSet = getCompositeRecordIdsSet(fileData, primaryKeys);
  const dbDataIdsSet = getCompositeRecordIdsSet(dbData, primaryKeys);

  const recordsToInsert = getRecordsNotIn(fileData, dbDataIdsSet, primaryKeys);
  const recordsToUpdate = getRecordsIn(fileData, dbDataIdsSet, primaryKeys);
  const recordsToDelete = getRecordsNotIn(dbData, fileDataIdsSet, primaryKeys);

  return [recordsToInsert, recordsToUpdate, recordsToDelete];
}

function getDbOpsArray(
  recordsToInsert,
  recordsToUpdate,
  recordsToDelete,
  primaryKeys,
) {
  const ops = [
    ...recordsToInsert.map((record) => ({
      insertOne: { document: record },
    })),

    ...recordsToUpdate.map((record) => ({
      updateOne: {
        filter: buildPrimaryKeyFilter(record, primaryKeys),
        update: { $set: omitKeys(record, primaryKeys) },
        runValidators: true,
      },
    })),

    ...recordsToDelete.map((record) => ({
      deleteOne: {
        filter: buildPrimaryKeyFilter(record, primaryKeys),
      },
    })),
  ];
  return ops;
}

function omitKeys(record, keysToOmit) {
  const omit = new Set(keysToOmit);
  return Object.fromEntries(
    Object.entries(record).filter(([key]) => !omit.has(key)),
  );
}

function buildPrimaryKeyFilter(record, primaryKeys) {
  return Object.fromEntries(primaryKeys.map((key) => [key, record[key]]));
}

function getRecordCompositeIdByList(record, keyList, keySeparator = "_") {
  return keyList.map((k) => record[k]).join(keySeparator);
}

function getCompositeRecordIdsSet(records, keys) {
  const recordIds = new Set(
    records.map((record) => {
      return getRecordCompositeIdByList(record, keys);
    }),
  );
  return recordIds;
}

//get records from the list with ids that do not appear in the ids set
function getRecordsNotIn(recordArray, recordIdSet, primaryKeys) {
  const records = recordArray.filter((record) => {
    return !recordIdSet.has(getRecordCompositeIdByList(record, primaryKeys));
  });

  return records;
}

function getRecordsIn(recordArray, recordIdSet, primaryKeys) {
  const records = recordArray.filter((record) => {
    return recordIdSet.has(getRecordCompositeIdByList(record, primaryKeys));
  });

  return records;
}
