const router = require('express').Router(),
	async = require('async'),
	db = require('../models');

router
	.route('/')
	.get((req, res) => {
		db.Category.find({}, (err, categories) => {
			res.json({
				success: true,
				message: 'Success',
				categories
			});
		});
	})
	.post((req, res) => {
		let category = new db.Category({ name: req.body.category });
		category.save();
		res.json({
			success: true,
			message: 'Successful'
		});
	});

router.get('/:id', (req, res, next) => {
	const paginate = 10;
	const category = req.params.id;
	const page = req.query.page;

	async.parallel(
		[
			callback => {
				db.Product.count({ category }, (err, count) => {
					callback(err, count);
				});
			},
			callback => {
				db.Product.find({ category })
					.skip(paginate * page)
					.limit(paginate)
					.populate('category')
					.populate('owner')
					.populate('reviews')
					.exec((err, products) => {
						if (err) return next(err);
						callback(err, products);
					});
			},
			callback => {
				db.Category.findById(category, (err, category) => {
					callback(err, category);
				});
			}
		],
		(err, results) => {
			const totalProducts = results[0];
			const products = results[1];
			const category = results[2];

			res.json({
				success: true,
				message: 'category',
				products,
				totalProducts,
				categoryName: category.name,
				pages: Math.floor(totalProducts / paginate)
			});
		}
	);
});

module.exports = router;
