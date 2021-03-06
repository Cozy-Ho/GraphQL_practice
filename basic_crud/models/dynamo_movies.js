import dynamoose from "dynamoose";

export const movieSchema = new dynamoose.Schema(
    {
        dumy: {
            type: Number,
            required: true,
            hashKey: true,
        },
        id: {
            type: String,
            required: true,
            rangeKey: true,
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
        lang: {
            type: String,
        },
        subtitle: {
            type: String,
        },
        dubbing: {
            type: String,
        },
        s_title: {
            type: String,
            required: true,
        },
        s_score: {
            type: Number,
            required: false,
        },
        s_desc: {
            type: String,
            required: false,
        },
    },
    {
        useDocumentTypes: true,
        saveUnknown: true,
    }
);
