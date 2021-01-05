const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        name: { type: String, default: "Anonymous" }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = model("User", userSchema);
