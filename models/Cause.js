var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var causeSchema = Schema({
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
  children: [{ type: Schema.Types.ObjectId, ref: "Action" }],
  created_by: { type: Schema.Types.ObjectId, ref: "User" }
});
causeSchema.index({ actions: 1 });
module.exports = mongoose.model("Cause", causeSchema);
