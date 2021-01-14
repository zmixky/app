const bestArticlesCount = 5; //!

const { Article } = require('../../models');

function isFull(list) {

    return list.length == bestArticlesCount;
}

function insert(list, article) {
    if (isFull(list) && article.views <= list[0].views) {
        return;
    }

    let index = -1;
    for (let i = list.length - 1; i >= 0; i--) {
        if (article.views > list[i].views) {
            index = i;
            break;
        }
    }

    if (isFull(list)) {
        for (let i = 0; i < index; i++) {
            list[i] = list[i + 1];
        }

        list[index] = article;
    } else {
        index += 1;

        list.push(null);

        for (let i = list.length - 1; i > index; i--) {
            list[i] = list[i - 1];
        }

        list[index] = article;
    }
}

class ExtraOptionsManager {
    constructor() {
        this.init_flag = false;

        this.articles_count = 0;
        this.best_articles_id = [];
        this.best_articles_min_views = 0;
    }

    getArticlesCount() {
        if (!this.init_flag) {
            return undefined;
        }

        return this.articles_count;
    }

    increaseArticlesCount() {
        this.articles_count += 1;
    }

    async getBestArticles() {
        if (!this.init_flag) {
            return undefined;
        }

        let best_articles = [];
        for (let id of this.best_articles_id) {
            let article = await Article.findById(id);

            insert(best_articles, article);
        }

        return best_articles;
    }

    isInit() {

        return this.init_flag;
    }

    async init() {
        this.init_flag = true;

        let articles = await Article.find();

        if (!articles || articles.length == 0) {
            return;
        }

        this.articles_count = articles.length;

        let best_articles = [];
        articles.forEach(article => insert(best_articles, article));

        this.best_articles_id = best_articles.map(article => article.id);
        this.best_articles_min_views = best_articles[0].views;
    }

    async update(article) {
        if (isFull(this.best_articles_id) && article.views <= this.best_articles_min_views) {
            return;
        }

        let best_articles = await this.getBestArticles();

        if (!this.best_articles_id.includes(article.id)) {
            insert(best_articles, article);
        }

        this.best_articles_id = best_articles.map(article => article.id);
        this.best_articles_min_views = best_articles[0].views;
    }
}

module.exports = ExtraOptionsManager;