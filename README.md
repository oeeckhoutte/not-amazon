# Not Amazon

A full stack web application clone of Amazon built on the MEAN stack.

![Screenshot](/media/screenshot.png)

### Features

Web API created by the mongoDB database and relayed through a node.js/express server. Authentication created using JSON web token. And the client-side view is rendered using the Angular 5 web framework.
The application allows new users to sign up/login as a seller to list products. Any user can purchase a product, but only sellers can list items.
Purchasing a product will bring up the stripe API for payment, and algolia was incorporated for searching through the database for products by name.

<!-- ### Installing -->

<!-- ## Deployment -->

## Built With

* [Angular 5](https://angular.io/) - JavaScript front end framework
* [node.js](https://nodejs.org/en/) - JavaScript server runtime engine
* [express](https://expressjs.com/) - Serverside web application framework for node.js
* [JSON Web Tokens](https://jwt.io/) - A tool to encode, decode and generate stateless authentication
* [mongoDB](https://www.mongodb.com/) - NoSQL/non-relational database
* [algolia](https://www.algolia.com/) - A real time search platform to search through a large data collection
* [stripe](https://stripe.com/) -Payment processing API for handling business transactions

## Authors

* **Kelvin Mai** - [kelvin-mai](https://github.com/kelvin-mai/)
