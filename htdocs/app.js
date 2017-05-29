var vue = new Vue({
	el: '#app',
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
		bids: [],
		newListing:{
			category:'',
			title:'',
			amount:'',
		},
		bidAmount: '',
		status: false,
	},
	mounted: function() {
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
		bidHistory: function(listingId) {
			ajaxPromise({role:'bid', cmd:'list', listingId:listingId}).then( function (bids) {
				vue.status = false;
				vue.bids = bids;
				vue.listingId = listingId;
				vue.mode = 'bidHistory';
			});
		},
		addListingDisplay: function() {
			this.error = '';
			this.listingId = false;
			this.mode = 'submitAssets';
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
	},
});

function ajaxPromise (msg) {
	console.log("Req:",msg);
	return axios.post(soaDemoConfig.apiURL, msg).then( function(response) {
		console.log("Res:",response.data);
		if (response.data.error == 'Invalid Token.') {
			vue.user = false;
			vue.mode = 'login';
			response.data.error = 'Session expired.  Please login again.';
		}
		return response.data;
	})
	.catch( function(error) {
		console.log("Err:",error);
	});
}
