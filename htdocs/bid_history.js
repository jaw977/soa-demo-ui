VueBidHistory = {
	props: ['listingId'],
	data: () => ({ bids:[] }),
	mounted: function() {
		console.log(this);
		this.getBids();
	},
	methods: {
		getBids: function() {
			const vue = this;
			ajaxPromise({role:'bid', cmd:'list', listingId:this.listingId}).then( function (bids) {
				vue.bids = bids;
			});
		},
	},
	template: `

<div>
<p style="text-align: center;">
	Bid History for listing {{listingId}}
	&nbsp; &nbsp; &nbsp;
	<!--<a href='#' @click="mode='listings'; listingId = 0">Back to listings</a>-->
	<router-link to="/">Back to listings</router-link>
</p>
<div class="row">
	<div class="col-md-4">&nbsp;</div>
	<div class="col-md-4">
		<table class="table">
			<thead><tr><th>Bidder</th><th>Amount</th></tr></thead>
			<tbody>
				<tr v-for="bid in bids">
					<td>{{bid.user.username}}</td>
					<td>\${{bid.amount}}</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
</div>

`};
