import { MongoClient } from "mongodb";
import sharp from "sharp";

async function reduceImgQuality(base64Image, id, title) {
  try {
    let parts = base64Image.split(";");
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
    return resizedImageBuffer;
  } catch (err) {
    console.log("cant convert image, type: ", typeof base64Image, id, title);
  }
}

// Connection URI
const uri = "mongodb://localhost:27017/Recipes";
// Create a new MongoClient

async function run() {
  const client = await MongoClient.connect(uri);
  try {
    // Connect the client to the server
    // Establish and verify connection
    const collection = await client.db("Recipes").collection("recipes");

    await collection.find({}).forEach(
      async (recipe) =>
        await collection.updateOne(
          { _id: recipe._id },
          {
            $set: {
              image: await reduceImgQuality(
                recipe.image,
                recipe._id,
                recipe.title
              ),
            },
          }
        )
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
