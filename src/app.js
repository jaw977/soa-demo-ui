import Vue from 'vue';
import VueRouter from 'vue-router';
import ajaxPromise from './ajax_promise.js';
import VueBidHistory from './bid_history.vue';

Vue.use(VueRouter);

const router = new VueRouter({ routes: [
	{ path: '/listing/:listingId/bidHistory', component: VueBidHistory, props: true, },
]});

var vue = new Vue({
	el: '#app',
	router: router,
	data: {
		user: false,
		username: '',
		password: '',
		registeredUsername: '',
		mode: 'listings',
		error: '',
		token: false,
		category: '',
		seller: '',
		page: 1,
		searchResults: {
			pages: 0,
			count: 0,
			fromNumber: 0,
			toNumber: 0,
			listings: [],
		},
		listingId: false,
		newListing:{
			category:'',
			title:'',
			amount:'',
		},
		bidAmount: '',
		status: false,
	},
	mounted: function() {
		this.search();
	},
	computed: {
		hasPrevPage: function() { return this.page > 1; },
		hasNextPage: function() { return this.page < this.searchResults.pages; },
		prevPageClass: function() { return this.hasPrevPage ? '' : 'disabledLink' },
		nextPageClass: function() { return this.hasNextPage ? '' : 'disabledLink' },
	},
	methods: {
		submit: function() {
			var cmd = this.mode == 'login' ? 'authn' : 'add';
			ajaxPromise({role:'user', cmd:cmd, username:this.username, password:this.password})
				.then( function(response) {
					if (cmd == 'add') {
						if (response.user) {
							vue.registeredUsername = response.user.username;
							vue.password = vue.error = '';
							vue.mode = 'login';
						}
						if (response.error) {
							vue.error = response.error;
						}
					} else {
						if (response.token) {
							vue.token = response.token;
							vue.user = {userId:response.userId, username:vue.username};
							vue.password = '';
							vue.mode = 'listings';
						} else {
							vue.error = 'Invalid username or password.';
						}
					}
				});
		},
		logout: function() {
			this.user = this.token = this.status = false;
		},
		clickSearch: function() {
			this.page = 1;
			this.search();
		},
		clickPrevPage: function() {
			if (! this.hasPrevPage) return;
			this.page = this.page - 1;
			this.status = false;
			this.search();
		},
		clickNextPage: function() {
			if (! this.hasNextPage) return;
			this.page = this.page + 1;
			this.status = false;
			this.search();
		},
		search: function() {
			ajaxPromise({role:'listing', cmd:'search', category:this.category, seller:this.seller, page:this.page})
				.then( function(searchResults) {
					vue.searchResults = searchResults;
				});
		},
		addListingDisplay: function() {
			this.error = '';
			this.listingId = false;
			this.mode = 'submitAssets';
			this.setRootRoute();
		},
		addListingSubmit: function() {
			const message = {role:'listing', cmd:'add', token:this.token, category:this.newListing.category, title:this.newListing.title, amount:+this.newListing.amount};
			ajaxPromise(message).then( function(response) {
				if (response.error) vue.error = response.error;
				if (response.listing) {
					vue.listingId = response.listing.listingId;
					vue.newListing.category = vue.newListing.title = vue.newListing.amount = '';
				}
			});
		},
		clickPlaceBid: function(listing) {
			this.listingId = listing.listingId;
			this.bidAmount = listing.nextBidAmount;
		},
		clickConfirmBid: function() {
			const message = {role:'bid', cmd:'add', token:this.token, listingId:this.listingId, amount:+this.bidAmount};
			ajaxPromise(message).then( function(response) {
				if (response.error) vue.status = {type:'error', message:response.error};
				if (response.winningBid) {
					if (response.winningBid.userId == vue.user.userId) {
						vue.status = {type:'success', message:'Placed bid.  You are now the winning bidder!'};
					}
					else vue.status = {type:'success', message:'Placed bid.  You were outbid by another proxy bid!'};
					vue.listingId = false;
					setTimeout( () => vue.search(), 100);
				}
			});
		},
		isRootRoute: function() { 
			return this.$route.path == '/';
		},
		setRootRoute: function() {
			this.$router.push('/');
		},
	},
});
