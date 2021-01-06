const { Schema, model } = require('mongoose')

const schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
});

const Article = model('Article', schema);

module.exports = Article;
