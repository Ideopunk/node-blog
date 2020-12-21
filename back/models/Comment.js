const mongoose = require("mongoose");

const { Schema } = mongoose;

const CommentSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User" },
		post: { type: Schema.Types.ObjectId, ref: "Post" },
		text: { type: String, required: true },
		password: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
