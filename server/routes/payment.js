const router = require('express').Router(),
	stripe = require('stripe')(process.env.STRIPE_SECRET),
	auth = require('../middleware/auth'),
	db = require('../models');

router.post('/', auth, (req, res) => {
	const stripeToken = req.body.stripeToken;
	const currentCharges = Math.round(req.body.totalPrice * 100);

	stripe.customers
		.create({ source: stripeToken.id })
		.then(customer =>
			stripe.charges.create({
				amount: currentCharges,
				currency: 'usd',
				customer: customer.id
			})
		)
		.then(charge => {
			const products = req.body.products;
			const order = new db.Order({
				owner: req.decoded._id,
				totalPrice: currentCharges
			});
			products.map(product =>
				order.products.push({
					product: product.product,
					quantity: product.quantity
				})
			);
			order.save();
			res.json({
				success: true,
				message: 'Successfully made payment'
			});
		});
});

module.exports = router;
