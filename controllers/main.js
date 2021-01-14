class MainController {

    get(req, res, next) {
        try {
            res.render("main.hbs", {
                isMainPage: true,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = MainController;