const { Router } = require('express');

const { MainController } = require('../controllers');

const mainController = new MainController();

const router = Router();

router.get('/', mainController.get);

module.exports = router;

