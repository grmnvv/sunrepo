import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ConnectionInfoModel = model(
  "ConnectionInfo",
  new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    downloadSpeed: { type: Number, required: true },
    uploadSpeed: { type: Number, required: true },
    ping: { type: Number, required: true },
  })
);

export { ConnectionInfoModel };
