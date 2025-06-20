"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const duckSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: String,
        required: true,
    },
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    image_url: {
        type: String,
        required: true,
    },
});
exports.default = mongoose_1.default.model("Duck", duckSchema);
