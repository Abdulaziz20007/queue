const { model, Schema } = require("mongoose");

const QueueSchema = new Schema(
  {
    service: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Service",
    },
    customer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    ticket_number: {
      type: String,
      match: /^[A-Z]\d+$/,
      required: true,
    },
    status: {
      type: String,
      enum: ["waiting", "in_progress", "completed", "cancelled"],
      default: "waiting",
    },
    called_at: {
      type: Date,
      default: null,
    },
    finished_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Queue", QueueSchema);
