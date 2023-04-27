import mongoose from "mongoose";
const { Schema, model } = mongoose;

const IpInfoModel = model("IpInfo", new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  ipAddress: { type: String, required: true },
  city: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
}));

export { IpInfoModel };
