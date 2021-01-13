const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const { Schema } = mongoose;
const { JSDOM } = require("jsdom");

const PostSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User" },
		title: { type: String, required: true, maxlength: 70 },
		text: { type: String, required: true, maxlength: 100000 },
		published: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

PostSchema.set("toObject", { virtuals: true });
PostSchema.set("toJSON", { virtuals: true });

PostSchema.virtual("create_date_formatted").get(function () {
	return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATETIME_MED);
});

PostSchema.virtual("create_date_formatted_short").get(function () {
	return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED);
});

PostSchema.virtual("update_date_formatted").get(function () {
	return DateTime.fromJSDate(this.updatedAt).toLocaleString(DateTime.DATETIME_MED);
});

PostSchema.virtual("preview").get(function () {
	const dom = new JSDOM(this.text);
	const substring = dom.window.document.body.textContent.substr(0, 140).trim();
	return substring + "...";
});

module.exports = mongoose.model("Post", PostSchema);
