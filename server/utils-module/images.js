import sharp from "sharp";

export async function reduceImgQuality(base64Image) {
  let parts = base64Image.split(";");
  let mimType = parts[0].split(":")[1];
  let imageData = parts[1].split(",")[1];
  var img = new Buffer.from(imageData, "base64");
  var resizedImageBuffer = await sharp(img)
    .resize(1000)
    .toFormat("webp")
    .toBuffer();
  return resizedImageBuffer;
  // let resizedImageData = resizedImageBuffer.toString("base64");
  // let resizedBase64 = `data:${mimType};base64,${resizedImageData}`;
  // return resizedBase64;
}
