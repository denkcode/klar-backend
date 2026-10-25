import { Schema, model } from "mongoose";

const TransactionSchema = new Schema({
  category: {
    type: String,
    required: true,
  },

  title: {
    trim: true,
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
    min: 1,
  },

  type: {
    required: true,
    type: String,
    enum: ["income", "expense"],
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export const Transaction = model("Transaction", TransactionSchema);
