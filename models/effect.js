var mongoose = require("mongoose");
var deepPopulate = require("mongoose-deep-populate")(mongoose);
var Cause = require("./cause");

var Schema = mongoose.Schema;

var effectSchema = Schema({
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
  children: [{ type: Schema.Types.ObjectId, ref: "Cause" }],
  created_by: { type: Schema.Types.ObjectId, ref: "User" }
});

var options = {
  /*whitelist: [],
  populate: {},
  rewrite: {}*/
};
effectSchema.plugin(deepPopulate, options /* more on options below */ );
module.exports = mongoose.model("Effect", effectSchema);
