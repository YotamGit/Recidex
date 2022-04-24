import { MongoClient } from "mongodb";
// Connection URI
const uri = "mongodb://localhost:27017/Recipes";
// Create a new MongoClient

const client = new MongoClient(uri);
async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    const collection = await client.db("Recipes").collection("recipes");
    console.log(
      await collection.find({}).forEach((recipe) => console.log(recipe))
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
