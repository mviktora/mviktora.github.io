'use strict';

mini.define('BottomBar', {

	events: ['navButton'],

	css: `
		.bottom-bar {
			display: flex;
			align-items: center;
			background: #609345;
			height: 100%;
		}
	`,

	tpl: `
		<div class="bottom-bar">
			<div style="flex-grow: 1"></div>
				<div ui="navButtonEl">${images.logo}</div>
			<div style="flex-grow: 1"></div>
		</div>
	`,

	init: function() {
		this.el = mini.createElement(this.tpl, this);

		this.addListener(this.navButtonEl, 'touchend', function(event) {
			this.fireEvent('navButton', {});
		}, this);

	},

	getEl: function() {
		return this.el;
	}

});
