import mongoose from "mongoose";
// const mongoose = require("mongoose");
const { Schema } = mongoose;

export const movieSchema = new Schema({
    dumy: {
        type: Number,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: false,
    },
    score: {
        type: Number,
        required: false,
    },
    watched: {
        type: Boolean,
        required: false,
    },
    info: {
        type: Object,
        required: false,
        lang: {
            type: String,
            required: false,
        },
        subtitle: {
            type: String,
            required: false,
        },
        dubbing: {
            type: String,
            required: false,
        },
    },
});
