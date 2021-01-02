const mongoose = require("mongoose");

const { Schema } = mongoose;

const CommentSchema = new Schema(
	{
		post: { type: Schema.Types.ObjectId, ref: "Post" },
		text: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
