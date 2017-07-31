<script>
import ajaxPromise from './ajax_promise.js';

export default {
	props: ['listingId'],
	data: () => ({ bids:[] }),
	mounted: function() {
		this.getBids();
	},
	methods: {
		getBids: function() {
			ajaxPromise({role:'bid', cmd:'list', listingId:this.listingId}).then( bids => {
				this.bids = bids;
			});
		},
	},
};
</script>

<template>
<div>
	<p style="text-align: center;">
		Bid History for listing {{listingId}}
		&nbsp; &nbsp; &nbsp;
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
						<td>${{bid.amount}}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>
</template>
