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
    maxlength: [200, "Title cannot be more than 2000 characters"],
  },
});

module.exports = mongoose.models.Bill || mongoose.model("Bill", BillSchema);
