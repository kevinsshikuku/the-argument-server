const dotenv = require( 'dotenv');
const cloudinary = require('cloudinary');
const { uuid } = require('uuidv4');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 *  Uploads file to Cloudinary CDN
 *
 *  @param {stream} object, image streaming content
 *  @param {folder} string, folder name, where to save image
 *  @param {string} imagePublicId
 */
const uploadToCloudinary = async (stream, folder, imagePublicId) => {
  // if imagePublicId param is presented we should overwrite the image
  const options = imagePublicId
    ? { public_id: imagePublicId, overwrite: true }
    : { public_id: `${folder}/${uuid()}` };

  return new Promise((resolve, reject) => {
    const streamLoad = cloudinary.v2.uploader.upload_stream(
      options,
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    stream.pipe(streamLoad);
  });
};


/** Uploads image */
  const upLoadResponse = async (image) =>{
    const response =  await cloudinary.uploader.upload(image, {upload_preset:"post"})
    return response

  }



/**
 *  Deletes file from Cloudinary CDN
 *
 *  @param {string} publicId id for deleting the image
 */
const deleteFromCloudinary = async publicId => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.destroy(publicId, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};


module.exports = { uploadToCloudinary,  upLoadResponse,  deleteFromCloudinary}