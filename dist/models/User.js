"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    image_url: {
        type: String,
        required: false,
    },
    auth_id: {
        type: String,
        required: true,
        unique: true,
    },
    provider: {
        type: String,
        required: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: String,
        required: true,
    },
});
exports.default = mongoose_1.default.model("User", userSchema);
