import mongoose from "mongoose";
const { Schema, model } = mongoose;

const IpSettingSchema = new Schema({
  index: { type: Boolean, required: true },
  provider: { type: Boolean, required: true },
  utc: { type: Boolean, required: true },
  connectionVersion: { type: Boolean, required: true },
});


const BrowserSettingSchema = new Schema({
  appCodeName: { type: Boolean, required: true },
  appName: { type: Boolean, required: true },
  appVersion: { type: Boolean, required: true },
  cookieEnabled: { type: Boolean, required: true },
  platform: { type: Boolean, required: true },
  product: { type: Boolean, required: true },
  userAgent: { type: Boolean, required: true },
});

const SettingsModel = model(
  "SettingsModel",
  new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    upload: { type: String, required: true },
    download: { type: String, required: true },
    ping: { type: String, required: true },
    mb: { type: String, required: true },
    ipSettings: { type: IpSettingSchema, required: true },
    browserSettings: { type: BrowserSettingSchema, required: true },
  })
);

export { SettingsModel };
