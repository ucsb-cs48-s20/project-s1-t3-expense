const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    unique: true,
    trim: true,
    maxlength: [40, "Title cannot be more than 40 characters"],
  },
  description: {
    type: String,
    required: true,
    maxlength: [200, "Description cannot be more than 200 characters"],
  },
  groupSize: {
    type: Number,
    required: true,
  },
  //In cents
  dollarAmount: {
    type: Number,
    required: true,
  },
  //In cents
  remainingAmount: {
    type: Number,
    required: true,
  },
  splitWay: {
    type: String,
    required: true,
  },
  paid: {
    type: Boolean,
    required: true,
  },
  unique: {
    type: String,
    required: true,
  },
  //members[i].cost is in cents
  members: [],
});

module.exports = mongoose.models.Bill || mongoose.model("Bill", BillSchema);
