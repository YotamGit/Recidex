const Jimp = require("jimp");

exports.reduceImgQuality = (buffer) => {
  Jimp.read(buffer)
    .then((image) => {
      // console.log(image);
      // Do stuff with the image.
    })
    .catch((err) => {
      console.log(err);
      // Handle an exception.
    });
};

exports.convertBase64 = (image) => {};
