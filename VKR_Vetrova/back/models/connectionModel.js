import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ConnectionInfoModel = model(
  "ConnectionInfo",
  new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    downloadSpeed: { type: String, required: true },
    uploadSpeed: { type: String, required: true },
    ping: { type: String, required: true },
  })
);

export { ConnectionInfoModel };
