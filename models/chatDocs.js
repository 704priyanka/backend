const mongoose = require("mongoose");

const chatDocSchema = new mongoose.Schema({
	chatId: {
		type: String,
		required: true,
	},

	chatDoc: {
		type: Array,
		default: [],
	},
});

module.exports = mongoose.model("chatDoc", chatDocSchema);
