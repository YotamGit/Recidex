import Jimp from "jimp";
import Buffer from "buffer";

export function reduceImgQuality(image) {
  var buffer = Buffer.from(image, "base64");
  console.log(buffer);
  // Jimp.read(buffer)
  //   .then((image) => {
  //     // console.log(image);
  //     // Do stuff with the image.
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     // Handle an exception.
  //   });
}

// exports.convertBase64 = (image) => {};
