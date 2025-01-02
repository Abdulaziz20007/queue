const { model, Schema } = require("mongoose");

const CustomerSchema = new Schema(
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
      trim: true,
      match: /^[A-Za-z]+$/,
    },
    phone: {
      type: String,
      trim: true,
      match: /^(9[0-9]|3[3-7]|7[1-5]|88)\s?\d{3}\s?\d{2}\s?\d{2}$/,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      unique: true,
    },
    password: String,
    is_active: {
      type: Boolean,
      default: false,
    },
    verification: String,
    mail_sent_at: Date,
    refreshToken: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Customer", CustomerSchema);
