import mongoose from "mongoose";
import { setTimeout } from "timers/promises";

import { logger } from "./logger.js";
import { syncIngredientData } from "./ingredientDataSync.js";

const DB_BASE_URL = "mongodb://mongodb:27017/Recipes";

// Connect to MongoDB with retry logic
const directConnect = async () => {
  logger.info("Connecting to DB in direct mode");
  while (true) {
    try {
      await mongoose.connect(`${DB_BASE_URL}?directConnection=true`);
      logger.info("Successfully connected to DB in direct mode");
      return;
    } catch (error) {
      logger.error(
        "Failed to connect to DB in direct mode, retrying in 5 seconds",
        error,
      );
      await setTimeout(5000);
      logger.warn("Retrying connection to DB in direct mode");
    }
  }
};

const replicaSetConnect = async () => {
  logger.info("Connecting to DB replica set");
  while (true) {
    try {
      await mongoose.connect(`${DB_BASE_URL}?replicaSet=rs0`);
      logger.info("Successfully connected to DB replica set");
      return;
    } catch (error) {
      logger.error(
        "Failed to connect to DB replica set, retrying in 5 seconds",
        error,
      );
      await setTimeout(5000);
      logger.warn("Retrying connection to DB replica set");
    }
  }
};

const waitForPrimary = async () => {
  const retryDurationSeconds = 20;
  for (let i = 0; i < retryDurationSeconds; i++) {
    try {
      const status = await mongoose.connection.db
        .admin()
        .command({ replSetGetStatus: 1 });

      const primary = status.members?.find(
        (member) => member.stateStr === "PRIMARY",
      );

      if (primary) {
        logger.info("DB replica set primary ready", {
          primary: primary.name,
        });
        return;
      }
    } catch (error) {
      logger.warn("Waiting for DB replica set primary", {
        error: error.message,
      });
    }

    await setTimeout(1000);
  }

  throw new Error("DB replica set primary was not elected in time");
};

// Initialize replica set if not already initialized
const initializeReplicaSet = async () => {
  try {
    const admin = mongoose.connection.db.admin();
    const result = await admin.command({ replSetGetStatus: 1 });
    logger.info("DB replica set already initialized", { set: result.set });
  } catch (error) {
    if (error.codeName !== "NotYetInitialized") {
      logger.error("DB replica set status check failed unexpectedly", error);
      throw error;
    }

    logger.info("Initializing DB replica set");
    try {
      const admin = mongoose.connection.db.admin();
      await admin.command({
        replSetInitiate: {
          _id: "rs0",
          members: [{ _id: 0, host: "mongodb:27017" }],
        },
      });
      logger.info("DB replica set initialized successfully");
    } catch (initError) {
      logger.error("Failed to initialize DB replica set", initError);
      throw initError;
    }
  }
};

// Sync ingredient data after DB connection
const syncData = async () => {
  try {
    await syncIngredientData();
    logger.info("Ingredient data sync completed successfully");
  } catch (error) {
    logger.error("Ingredient data sync failed", error);
  }
};

// Main function to handle DB connection, replica set, and data sync
export async function initializeDatabase() {
  try {
    logger.info("Attempting connection to DB");
    await directConnect();
    await initializeReplicaSet();
    await waitForPrimary();
    await mongoose.disconnect();
    logger.info("Disconnected from direct MongoDB connection");

    await replicaSetConnect();
    await syncData();
    logger.info("Database initialized successfully");
  } catch (error) {
    logger.error("Database initialization failed", error);
    await mongoose.disconnect().catch((disconnectError) => {
      logger.warn("Failed to disconnect after DB init error", disconnectError);
    });

    throw error;
  }
}
