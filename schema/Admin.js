const { model, Schema } = require("mongoose");

const AdminSchema = new Schema(
  {
    name: {
      type: String,
      min: 3,
      max: 30,
      required: true,
      trim: true,
      match: /^[A-Za-z]+$/,
    },
    surname: {
      type: String,
      min: 3,
      max: 30,
      required: true,
      trim: true,
      match: /^[A-Za-z]+$/,
    },
    login: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: String,
    role: {
      type: String,
      enum: ["admin", "super_admin"],
      default: "admin",
    },
    refreshToken: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Admin", AdminSchema);
