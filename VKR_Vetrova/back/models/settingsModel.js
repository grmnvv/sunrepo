import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SettingSchema = new Schema({
  key: { type: String, required: true },
  display: { type: String, required: true },
  isChecked: { type: Boolean, required: true },
});

const SettingsModel = model(
"SettingsModel",
new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  upload: { type: String, required: true },
  download: { type: String, required: true },
  ping: { type: String, required: true },
  mb: { type: String, required: true },
  ipSettings: { type: [SettingSchema], required: true },
  browserSettings: { type: [SettingSchema], required: true },
})
);


export { SettingsModel };