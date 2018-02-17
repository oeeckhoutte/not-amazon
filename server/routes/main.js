const router = require('express').Router(),
	async = require('async'),
	auth = require('../middleware/auth'),
	db = require('../models');

router
	.route('/categories')
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

router.get('/categories/:id', (req, res, next) => {
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

router.get('/products', (req, res, next) => {
	const paginate = 10;
	const page = req.query.page;
	async.parallel(
		[
			callback => {
				db.Product.count({}, (err, count) => {
					callback(err, count);
				});
			},
			callback => {
				db.Product.find({})
					.skip(paginate * page)
					.limit(paginate)
					.populate('category')
					.populate('owner')
					.exec((err, products) => {
						if (err) return next(err);
						callback(err, products);
					});
			}
		],
		(err, results) => {
			const totalProducts = results[0];
			const products = results[1];

			res.json({
				success: true,
				message: 'category',
				products,
				totalProducts,
				pages: Math.floor(totalProducts / paginate)
			});
		}
	);
});

router.get('/product/:id', (req, res) => {
	db.Product.findById(req.params.id)
		.populate('category')
		.populate('owner')
		.exec((err, product) => {
			if (err) {
				res.json({
					success: false,
					message: 'Product not found'
				});
			} else {
				res.json({
					success: true,
					product
				});
			}
		});
});

router.post('/review', auth, (req, res) => {
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
