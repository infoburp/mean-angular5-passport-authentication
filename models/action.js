var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var deepPopulate = require("mongoose-deep-populate")(mongoose);

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
  created_by: { type: Schema.Types.ObjectId, ref: "User" },
  cause: { type: Schema.Types.ObjectId, ref: "Cause" },
  effect: { type: Schema.Types.ObjectId, ref: "Effect" },
});
var options = {
  /*whitelist: [],
  populate: {},
  rewrite: {}*/
};
actionSchema.plugin(deepPopulate, options /* more on options below */ );

module.exports = mongoose.model("Action", actionSchema);
