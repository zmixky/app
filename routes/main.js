const { Router } = require('express');

const router = Router();

router.get('/', (req, res, next) => {
    try {
        res.render("main.hbs", {
            isMainPage: true,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;

