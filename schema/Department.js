const { model, Schema } = require("mongoose");

const DepartmentSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    letter: {
      type: String,
      trim: true,
      required: true,
      match: /^[a-zA-Z]$/,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Department", DepartmentSchema);
