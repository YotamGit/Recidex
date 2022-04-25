import { MongoClient } from "mongodb";
import sharp from "sharp";

async function reduceImgQuality(base64Image, id, title) {
  try {
    console.log(title);
    var parts = base64Image.split(";");
    let mimType = parts[0].split(":")[1];
    let imageData = parts[1].split(",")[1];
    var img = new Buffer.from(imageData, "base64");
    var resizedImageBuffer = await sharp(img)
      .resize(1000)
      .toFormat("webp")
      .toBuffer();

    console.log(
      `Converted image. ${typeof base64Image} -> ${typeof resizedImageBuffer} `,
      id,
      title
    );
    console.log(resizedImageBuffer);
    return resizedImageBuffer;
  } catch (err) {
    // console.log(err);
    console.log(parts);
    console.log("cant convert image, type: ", typeof base64Image, id, title);
    return null;
  }
}

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
          image: await reduceImgQuality(recipe.image, recipe._id, recipe.title),
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
