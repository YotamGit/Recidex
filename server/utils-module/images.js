import sharp from "sharp";

export async function reduceImgQuality(base64Image) {
  let parts = base64Image.split(";");
  let mimType = parts[0].split(":")[1];
  let imageData = parts[1].split(",")[1];
  let img = new Buffer.from(imageData, "base64");
  let resizedImageBuffer = await sharp(img)
    .resize(1000)
    .toFormat("webp")
    .toBuffer();
  return resizedImageBuffer;
}
