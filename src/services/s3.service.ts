// import AWS from 'aws-sdk';
// import { v4 as uuidv4 } from 'uuid';
// import dotenv from 'dotenv';

// dotenv.config();

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const BUCKET_NAME = process.env.AWS_BUCKET_NAME as string;

// export const uploadFile = async (file: Express.Multer.File) => {
//   const key = `${uuidv4()}-${file.originalname}`;

//   const params = {
//     Bucket: BUCKET_NAME,
//     Key: key,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//     ACL:"public-read",
//   };

//   await s3.upload(params).promise();
//   return key;
// };

// export const getFileUrl = (key: string) => {
//   return s3.getSignedUrl('getObject', {
//     Bucket: BUCKET_NAME,
//     Key: key,
//     Expires: 60 * 60, // 1 hour expiry
//   });
// };

// export const deleteFile = async (key: string) => {
//   await s3.deleteObject({
//     Bucket: BUCKET_NAME,
//     Key: key,
//   }).promise();
// };

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'; // Importing getSignedUrl
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME as string;

export const uploadFile = async (file: Express.Multer.File) => {
  const key = `${uuidv4()}-${file.originalname}`;

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  // No ACL specified here, just uploading the file
  await s3.send(new PutObjectCommand(params));
  return key;
};

export const getFileUrl = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
};

export const deleteFile = async (key: string) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  await s3.send(new DeleteObjectCommand(params));
};
