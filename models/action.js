var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var actionSchema = Schema({
  name: {
    type: String,
    required: true
  },
  sentiment: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    required: true
  },
  created_by: { type: Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Action", actionSchema);
