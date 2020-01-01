
exports.index = function(req, res, next) {
    res.render('index', {
        pageTitle: 'Auction Online Website'
    });
}