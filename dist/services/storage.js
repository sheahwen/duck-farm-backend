"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageFromUrl = void 0;
const storage_1 = require("@google-cloud/storage");
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const storage = new storage_1.Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS || "{}"),
});
if (!process.env.GOOGLE_CLOUD_BUCKET_NAME) {
    throw new Error("GOOGLE_CLOUD_BUCKET_NAME environment variable is not set");
}
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);
const uploadImageFromUrl = async (imageUrl) => {
    var _a;
    try {
        // Download the image
        const response = await axios_1.default.get(imageUrl, { responseType: "arraybuffer" });
        const buffer = Buffer.from(response.data);
        // Generate a unique filename
        const fileExtension = ((_a = imageUrl.split(".").pop()) === null || _a === void 0 ? void 0 : _a.split("?")[0]) || "jpg";
        const fileName = `ducks/${(0, uuid_1.v4)()}.${fileExtension}`;
        // Upload to Google Cloud Storage
        const file = bucket.file(fileName);
        await file.save(buffer, {
            metadata: {
                contentType: response.headers["content-type"],
            },
        });
        return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }
    catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Failed to upload image to storage");
    }
};
exports.uploadImageFromUrl = uploadImageFromUrl;
