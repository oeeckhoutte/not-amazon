const router = require('express').Router(),
	async = require('async'),
	auth = require('../middleware/auth'),
	db = require('../models');

router.post('/', auth, (req, res) => {
	async.waterfall([
		callback => {
			db.Product.findById(req.body.id, (err, product) => {
				if (product) callback(err, product);
			});
		},
		product => {
			const { title, description, rating } = req.body;
			const review = new db.Review({ owner: req.decoded.user._id });
			if (title) review.title = title;
			if (description) review.description = description;
			review.rating = rating;

			product.reviews.push(review._id);
			product.save();
			review.save();
			res.json({
				success: true,
				message: 'Successfully added review'
			});
		}
	]);
});

module.exports = router;
