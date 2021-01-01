const mongoose = require("mongoose");

const { Schema } = mongoose;

const PostSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User" },
		title: { type: String, required: true },
		text: { type: String, required: true },
		published: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
