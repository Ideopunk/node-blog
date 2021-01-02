const mongoose = require("mongoose");
const { DateTime } = require("luxon");

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

PostSchema.set("toObject", { virtuals: true });
PostSchema.set("toJSON", { virtuals: true });

PostSchema.virtual("create_date_formatted").get(function () {
	return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATETIME_MED);
});

PostSchema.virtual("update_date_formatted").get(function () {
	return DateTime.fromJSDate(this.updatedAt).toLocaleString(DateTime.DATETIME_MED);
});

module.exports = mongoose.model("Post", PostSchema);
