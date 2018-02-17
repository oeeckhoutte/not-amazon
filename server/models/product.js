const mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
	{
		category: {
			type: Schema.Types.ObjectId,
			ref: 'Category'
		},
		reviews: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Review'
			}
		],
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		image: String,
		title: String,
		description: String,
		price: Number,
		created: {
			type: Date,
			default: Date.now
		}
	},
	{ toObject: { virtuals: true } },
	{ toJSON: { virtuals: true } }
);

ProductSchema.virtual('averageRating').get(function() {
	let rating = 0;
	if (this.reviews.length === 0) return 0;
	this.reviews.map(review => (rating += review.rating));
	rating = rating / this.reviews.length;
	return rating;
});

ProductSchema.plugin(deepPopulate);

module.exports = mongoose.model('Product', ProductSchema);
