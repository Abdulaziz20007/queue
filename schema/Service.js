const { model, Schema } = require("mongoose");

const ServiceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    average_service_time: {
      type: Number,
      default: 5,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    current: {
      type: Schema.Types.ObjectId,
      ref: "Queue",
      default: null,
    },
    current_number: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Service", ServiceSchema);
