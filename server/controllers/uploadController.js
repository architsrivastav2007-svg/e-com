import { Readable } from 'node:stream';
import cloudinary from '../config/cloudinary.js';

const buildOptimizedUrl = (publicId) =>
  cloudinary.url(publicId, {
    secure: true,
    transformation: [
      {
        quality: 'auto',
        fetch_format: 'auto',
      },
    ],
  });

const getPublicIdFromUrl = (imageUrl) => {
  if (!imageUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(imageUrl);
    const uploadPath = parsedUrl.pathname.split('/upload/')[1];

    if (!uploadPath) {
      return null;
    }

    const pathSegments = uploadPath.split('/');
    const versionIndex = pathSegments.findIndex((segment) => /^v\d+$/.test(segment));
    const publicIdSegments = versionIndex >= 0 ? pathSegments.slice(versionIndex + 1) : pathSegments;

    if (!publicIdSegments.length) {
      return null;
    }

    return publicIdSegments.join('/').replace(/\.[^.]+$/, '');
  } catch {
    return null;
  }
};

const uploadBufferToCloudinary = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });

    Readable.from(buffer).pipe(stream);
  });

const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image file is required',
      });
    }

    const images = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadBufferToCloudinary(file.buffer, {
          folder: 'e-com/products',
          resource_type: 'image',
        });

        return {
          publicId: result.public_id,
          url: buildOptimizedUrl(result.public_id),
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        };
      }),
    );

    return res.status(201).json({
      success: true,
      message: 'Images uploaded successfully',
      images,
    });
  } catch (error) {
    const message = /must supply api_key/i.test(error.message)
      ? 'Cloudinary API key missing. Set CLOUDINARY_API_KEY in server .env'
      : error.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const imageUrl = req.body?.imageUrl || req.query?.imageUrl;
    const publicId = req.body?.publicId || req.query?.publicId || getPublicIdFromUrl(imageUrl);

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'imageUrl or publicId is required',
      });
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });

    return res.status(200).json({
      success: true,
      message: result.result === 'ok' ? 'Image deleted successfully' : 'Image not found in Cloudinary',
      result: result.result,
    });
  } catch (error) {
    const message = /must supply api_key/i.test(error.message)
      ? 'Cloudinary API key missing. Set CLOUDINARY_API_KEY in server .env'
      : error.message;

    return res.status(500).json({
      success: false,
      message,
    });
  }
};

export { deleteImage, uploadImages, getPublicIdFromUrl };