const fs = require('fs');

const { paramsPath } = require('../path');

const { Router } = require('express');
const { Article } = require('../models');

const router = Router();

router.get('/all_list/:p', async (req, res, next) => {
    try {
        const p = Number(req.params.p);

        const articles = await Article.find(null, null, { skip: 7 * p, limit: 7 });

        let params = JSON.parse(fs.readFileSync(paramsPath));

        res.render('all_list.hbs', {
            isEmpty: articles.length === 0,
            isAllListPage: true,
            isLeft: p != 0,
            left: p - 1,
            isRight: params.count > 7 * (1 + p),
            right: p + 1,
            articles,
        });
    } catch (err) {
        next(err);
    }
});

router.get('/best_list', async (req, res, next) => {
    try {
        let params = JSON.parse(fs.readFileSync(paramsPath));

        let articles = [];
        for (let i = 0; i < params.best_articles.length; ++i) {
            let article = await Article.findById(params.best_articles[i]);

            articles.push(article);
        }

        res.render('best_list.hbs', {
            isBestListPage: true,
            isEmpty: articles.length === 0,
            articles,
        });
    } catch (err) {
        next(err);
    }
});

router.get('/create', (req, res, next) => {
    try {
        res.render('create.hbs', {
            isCreatePage: true,
        });
    } catch (err) {
        next(err);
    }
});

router.post('/create', async (req, res, next) => {
    try {
        const title = req.body.title;
        const text = req.body.text;

        const article = new Article({
            title: title,
            text: text,
        });

        await article.save();

        let params = JSON.parse(fs.readFileSync(paramsPath));

        params.count += 1;

        fs.writeFileSync(paramsPath, JSON.stringify(params));

        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

router.get('/article/:id', async (req, res, next) => {
    try {
        const id = req.params.id;

        const article = await Article.findById(id);

        await Article.findByIdAndUpdate(id, { views: article.views + 1 });

        let params = JSON.parse(fs.readFileSync(paramsPath));

        if (article.views + 1 > params.min_views) {
            let flag = false;

            let indexes = [];

            for (let i = 0; i < params.best_articles.length; ++i) {
                if (id == params.best_articles[i]) {
                    flag = true;
                }

                let a = await Article.findById(params.best_articles[i]);

                if (a.views == params.min_views) {
                    indexes.push(i);
                }
            }

            if (!flag) {
                params.best_articles[indexes[0]] = id;
            }

            let min = article.views + 1;

            for (let i = 0; i < params.best_articles.length; ++i) {
                let a = await Article.findById(params.best_articles[i]);

                if (a.views < min) {
                    min = a.views;
                }
            }

            params.min_views = min;

            fs.writeFileSync(paramsPath, JSON.stringify(params));
        }

        res.render('article', {
            article,
        })

    } catch (err) {
        next(err);
    }
});

module.exports = router;