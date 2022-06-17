import { MongoClient } from "mongodb";

// Connection URI
const uri = "mongodb://localhost:27017/Recipes";

async function getUsers() {
  const client = new MongoClient(uri);
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    const collection = await client.db("Recipes").collection("users");

    var users = await collection.find({}).toArray();
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
  return users;
}

async function modify(user) {
  const client = new MongoClient(uri);
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    const collection = await client.db("Recipes").collection("users");

    const res = await collection.updateOne(
      { _id: user._id },
      {
        $set: {
          notification_opt_in: true,
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
  var users = await getUsers();
  console.log(users.length);
} catch (err) {
  console.dir(err);
}

users.map((user) => modify(user));
