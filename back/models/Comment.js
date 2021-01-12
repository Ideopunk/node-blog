const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const { Schema } = mongoose;

const CommentSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User" },
		post: { type: Schema.Types.ObjectId, ref: "Post" },
		text: { type: String, required: true, maxlength: 500 },
	},
	{ timestamps: true }
);

CommentSchema.set("toObject", { virtuals: true });
CommentSchema.set("toJSON", { virtuals: true });

CommentSchema.virtual("create_date_formatted").get(function () {
	return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATETIME_MED);
});

module.exports = mongoose.model("Comment", CommentSchema);
