const express = require('express');
const mongoose = require('mongoose');

const hbs = require('hbs');
const bodyParser = require('body-parser');

const path = require('path');

const { mainRouter, articlesRouter } = require('./routes');

const { extraOptionsManager } = require('./libs/extra_options');

const PORT = 3030;
const URI = 'mongodb://localhost/app_db';
const PARAMS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};

const app = express();

hbs.registerPartials(path.join(__dirname, "/views/partials"));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', mainRouter);
app.use('/articles', articlesRouter);

app.use((err, req, res, next) => {
    if (err) {
        console.log(err);

        res.send(err);
    }
});

async function start() {
    try {
        await mongoose.connect(URI, PARAMS);

        if (!extraOptionsManager.isInit()) {
            await extraOptionsManager.init();
        }

        app.listen(PORT, () => {
            console.log('...server has been started...');
        });
    } catch (err) {
        console.log(err);
    }
}

start();