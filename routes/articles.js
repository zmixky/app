const { ArticlesController } = require('../controllers');

const { Router } = require('express');

const router = Router();

router.get('/all/:p', ArticlesController.getAllArticles);

router.get('/best', ArticlesController.getBestArticles);

router.get('/', ArticlesController.getArticleForm);
router.post('/', ArticlesController.postArticle);

router.get('/:id', ArticlesController.getArticle);

module.exports = router;