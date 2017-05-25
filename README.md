## SOA Demo:  Front End Marketplace

Serves the static files in the /htdocs directory, which is a simple marketplace app implemented as a single page application using https://vuejs.org/

It demonstrates the features of services:
* https://github.com/jaw977/soa-demo-user
* https://github.com/jaw977/soa-demo-listing
* https://github.com/jaw977/soa-demo-bid 
* https://github.com/jaw977/soa-demo-api

It is not intended to be a realistic marketplace (which would need specific URLs, server side rendering, etc.).  It should also be broken up into separate Vue.js components instead of all the features being in the same files.

### Configuration environment variables

* `PORT`: The port the app listens on
* `API_URL`: The URL that the app sends Ajax requests to
