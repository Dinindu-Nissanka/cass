let { writeFile } = require("fs");
let { join } = require("path");
let { get } = require("request");
let blend = require("@mapbox/blend");

const argv = require("minimist")(process.argv.slice(2));

let {
  greeting = "Hello",
  who = "You",
  width = 400,
  height = 500,
  color = "Pink",
  size = 100,
} = argv;

const apiUrlPrefix = "https://cataas.com/cat/says/";
const ENCODING_TYPE = "binary";
const IMAGE_TYPE = "jpeg";
const IMAGE_NAME = "cat-card";

const firstRequest = {
  url: `${apiUrlPrefix}${greeting}?width=${width}&height=${height}&color${color}&s=${size}`,
  encoding: ENCODING_TYPE,
};

let secondRequest = {
  url: `${apiUrlPrefix}${who}?width=${width}&height=${height}&color${color}&s=${size}`,
  encoding: ENCODING_TYPE,
};

const fetchImage = async (request) => {
  return get(request);
};

const bindImages = async (firstImage, secondImage) => {
  return blend(
    [
      {
        buffer: new Buffer(firstImage, ENCODING_TYPE),
        x: 0,
        y: 0,
      },
      {
        buffer: new Buffer(secondImage, ENCODING_TYPE),
        x: 0,
        y: 0,
      },
    ],
    {
      width: width * 2,
      height: height,
      format: IMAGE_TYPE,
    }
  );
};

const saveImage = async (image) => {
  const fileOut = join(process.cwd(), `/${IMAGE_NAME}.${IMAGE_TYPE}`);
  writeFile(fileOut, image, ENCODING_TYPE);
};

const createCatCard = async () => {
  try {
    const [firstImage, secondImage] = await Promise.all(
      fetchImage(firstRequest),
      fetchImage(secondRequest)
    );
    if (
      firstImage &&
      !(firstImage instanceof Error) &&
      secondImage &&
      !(secondImage instanceof Error)
    ) {
      const combinedImage = await bindImages(firstImage, secondImage);
      await saveImage(combinedImage);
    }
  } catch (error) {
    console.log(error);
  }
};
