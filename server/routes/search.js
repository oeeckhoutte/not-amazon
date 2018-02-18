const router = require('express').Router();

const algoliasearch = require('algoliasearch');
const client = algoliasearch(process.env.ALGOLIA_ID, process.env.ALGOLIA_KEY);
const index = client.initIndex(process.env.ALGOLIA_INDEX);

router.get('/', (req, res) => {
	if (req.query.query) {
		index.search(
			{
				query: req.query.query,
				page: req.query.page
			},
			(err, content) => {
				res.json({
					success: true,
					message: 'Search results',
					status: 200,
					content,
					search_result: req.query.query
				});
			}
		);
	}
});

module.exports = router;
