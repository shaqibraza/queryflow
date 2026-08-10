import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.js";

export async function uploadAvatar(fileBuffer: Buffer, userId: string): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uplaodStream = cloudinary.uploader.upload_stream(
      {
        folder: "queryflow/avatars",
        public_id: userId,
        overwrite: true,
        resource_type: "image"
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      }
    );

    uplaodStream.end(fileBuffer);
  });
}
