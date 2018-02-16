const router = require('express').Router(),
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

module.exports = router;
