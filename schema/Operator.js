const { model, Schema } = require("mongoose");
const OperatorSchema = new Schema(
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
      trim: true,
      unique: true,
    },
    password: String,
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Operator", OperatorSchema);
