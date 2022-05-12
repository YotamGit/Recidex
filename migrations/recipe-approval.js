import { MongoClient } from "mongodb";

// Connection URI
const uri = "mongodb://localhost:27017/Recipes";

async function getRecipes() {
  const client = new MongoClient(uri);
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    const collection = await client.db("Recipes").collection("recipes");

    var recipes = await collection.find({}).toArray();
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
  return recipes;
}

async function convertRecipe(recipe) {
  const client = new MongoClient(uri);
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    const collection = await client.db("Recipes").collection("recipes");

    const res = await collection.updateOne(
      { _id: recipe._id },
      {
        $set: {
          private: false,
          approved: true,
          approval_required: false,
        },
      }
    );
    console.log(res);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

try {
  var recipes = await getRecipes();
  console.log(recipes.length);
} catch (err) {
  console.dir(err);
}

recipes.map((recipe) => convertRecipe(recipe));
