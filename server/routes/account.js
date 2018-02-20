const router = require('express').Router(),
	jwt = require('jsonwebtoken');

const db = require('../models'),
	auth = require('../middleware/auth');

router.post('/signup', (req, res) => {
	const { email, name, password, isSeller } = req.body;
	user = new db.User({
		email,
		name,
		password,
		isSeller
	});
	user.picture = user.gravatar();

	db.User.findOne({ email }, (err, exists) => {
		if (exists) {
			res.json({
				success: false,
				message: 'Account with that email already exists'
			});
		} else {
			user.save();
			let token = jwt.sign({ user }, process.env.SECRET, { expiresIn: '7d' });
			res.json({
				success: true,
				message: 'Enjoy your stay',
				token
			});
		}
	});
});

router.post('/login', (req, res) => {
	const { email, password } = req.body;
	db.User.findOne({ email }, (err, user) => {
		if (err) throw err;

		if (!user) {
			res.json({
				success: false,
				message: 'db.User not found'
			});
		} else {
			let valid = user.comparePassword(password);
			if (!valid) {
				res.json({
					sucess: false,
					message: 'Wrong password'
				});
			} else {
				let token = jwt.sign({ user }, process.env.SECRET, {
					expiresIn: '7d'
				});
				res.json({
					success: true,
					message: 'Enjoy your stay',
					token
				});
			}
		}
	});
});

router
	.route('/profile')
	.get(auth, (req, res) => {
		db.User.findOne({ _id: req.decoded.user._id }, (err, user) => {
			res.json({
				success: true,
				user,
				message: 'Success'
			});
		});
	})
	.post(auth, (req, res, next) => {
		db.User.findOne({ _id: req.decoded.user._id }, (err, user) => {
			if (err) return next(err);

			const { email, password, name, isSeller } = req.body;
			if (email) user.email = email;
			if (name) user.name = name;
			if (password) user.password = password;

			user.isSeller = isSeller;

			user.save();
			res.json({
				success: true,
				message: 'Successfully edited your profile'
			});
		});
	});

router
	.route('/address')
	.get(auth, (req, res) => {
		db.User.findOne({ _id: req.decoded.user._id }, (err, user) => {
			res.json({
				success: true,
				address: user.address,
				message: 'Success'
			});
		});
	})
	.post(auth, (req, res, next) => {
		db.User.findOne({ _id: req.decoded.user._id }, (err, user) => {
			if (err) return next(err);

			const { addr1, addr2, city, state, country, postalCode } = req.body;
			const { address } = user;
			if (addr1) address.addr1 = addr1;
			if (addr2) address.addr2 = addr2;
			if (city) address.city = city;
			if (country) address.country = country;
			if (postalCode) address.postalCode = postalCode;

			user.save();
			res.json({
				success: true,
				message: 'Successfully edited your address'
			});
		});
	});

router.get('/orders', auth, (req, res) => {
	db.Order.find({ owner: req.decoded._id })
		.populate('products.product')
		.populate('owner')
		.exec((err, orders) => {
			if (err) {
				res.json({
					success: false,
					message: `Couldn't find your order`
				});
			} else {
				res.json({
					success: true,
					message: 'Your orders',
					orders
				});
			}
		});
});

router.get('/orders/:id', auth, (req, res) => {
	db.Order.findById(req.params.id)
		.deepPopulate('products.product.owner')
		.populate('owner')
		.exec((err, order) => {
			if (err) {
				res.json({
					success: false,
					message: `Couldn't find your order`
				});
			} else {
				res.json({
					success: true,
					message: 'Your orders',
					order
				});
			}
		});
});

module.exports = router;
