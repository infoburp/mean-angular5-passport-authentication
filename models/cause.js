var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var deepPopulate = require("mongoose-deep-populate")(mongoose);
var Action = require("./action");
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
  created_by: { type: Schema.Types.ObjectId, ref: "User" },
  effect: { type: Schema.Types.ObjectId, ref: "Effect" }
});
var options = {
  /*whitelist: [],
  populate: {},
  rewrite: {}*/
};
causeSchema.plugin(deepPopulate, options /* more on options below */ );
causeSchema.index({ actions: 1 });
module.exports = mongoose.model("Cause", causeSchema);
