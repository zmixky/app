const { extraOptionsManager } = require('../libs/extra_options');

const articlesOnPageCount = 5; //!!

const { Article } = require('../models');

class ArticlesController {
    static async getArticle(req, res, next) {
        try {
            const id = req.params.id;
            const article = await Article.findById(id);

            article.views += 1;
            await article.save();

            await extraOptionsManager.update(article);

            res.render('article', {
                article,
            });
        } catch (err) {
            next(err);
        }
    }

    static getArticleForm(req, res, next) {
        try {
            res.render('article_form.hbs', {
                isCreatePage: true,
            });
        } catch (err) {
            next(err);
        }
    }

    static async postArticle(req, res, next) {
        try {
            const title = req.body.title;
            const text = req.body.text;

            const article = new Article({
                title: title,
                text: text,
            });

            await article.save();

            extraOptionsManager.increaseArticlesCount();
            await extraOptionsManager.update(article);

            res.redirect('/');
        } catch (err) {
            next(err);
        }
    }

    static async getAllArticles(req, res, next) {
        try {
            const p = Number(req.params.p);

            const articles = await Article.find(null, null, {
                skip: articlesOnPageCount * p,
                limit: articlesOnPageCount,
            });

            let articlesCount = extraOptionsManager.getArticlesCount();

            res.render('all_articles.hbs', {
                isAllListPage: true,
                isEmpty: articles.length == 0,
                isLeft: p != 0,
                left: p - 1,
                isRight: articlesCount > articlesOnPageCount * (1 + p),
                right: p + 1,
                articles,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getBestArticles(req, res, next) {
        try {
            let articles = await extraOptionsManager.getBestArticles();
            articles.reverse();

            res.render('best_articles.hbs', {
                isBestListPage: true,
                isEmpty: articles.length == 0,
                articles,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ArticlesController;