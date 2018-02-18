const mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate')(mongoose),
	algolia = require('mongoose-algolia');
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
ProductSchema.plugin(algolia, {
	appId: process.env.ALGOLIA_ID,
	apiKey: process.env.ALGOLIA_KEY,
	indexName: process.env.ALGOLIA_INDEX,
	selector: '_id title image reviews description price owner created',
	populate: {
		path: 'owner reviews',
		select: 'name rating'
	},
	defaults: { author: 'unknown' },
	mappings: value => `${value}`,
	virtuals: doc => {
		let rating = 0;
		if (doc.reviews.length === 0) return 0;
		doc.reviews.map(review => (rating += review.rating));
		rating = rating / doc.reviews.length;
		return rating;
	},
	debug: true
});

const Model = mongoose.model('Product', ProductSchema);
Model.SyncToAlgolia();
Model.SetAlgoliaSettings({ searchableAttributes: ['title'] });

module.exports = Model;
