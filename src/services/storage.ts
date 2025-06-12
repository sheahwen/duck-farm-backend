import { Storage } from "@google-cloud/storage";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS || "{}"),
});

if (!process.env.GOOGLE_CLOUD_BUCKET_NAME) {
  throw new Error("GOOGLE_CLOUD_BUCKET_NAME environment variable is not set");
}

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

export const uploadImageFromUrl = async (imageUrl: string): Promise<string> => {
  try {
    // Download the image
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    // Generate a unique filename
    const fileExtension = imageUrl.split(".").pop()?.split("?")[0] || "jpg";
    const fileName = `ducks/${uuidv4()}.${fileExtension}`;

    // Upload to Google Cloud Storage
    const file = bucket.file(fileName);
    await file.save(buffer, {
      metadata: {
        contentType: response.headers["content-type"],
      },
    });

    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image to storage");
  }
};
