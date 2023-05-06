import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SettingsModel = model("SettingsModel", new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    upload : { type: String, required: true },
    download: { type: String, required: true },
    ping: { type: String, required: true },
    mb: { type: String, required: true },

}));

export { SettingsModel };
