'use strict';

mini.define('BottomBar', {

	events: ['backButton', 'navButton', 'moreButton'],

	css: `
		.bottom-bar {
			background: #f5f5f5;
			background: #609345;
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			right: 0;
			display: flex;
			align-items: center;
			padding: 0 20px;
		}

		.bottom-bar > .center {
			text-align: center;
			flex-grow: 1;
		}

		.bottom-bar .team-buttom {
			border-radius: 7px;
			display: inline-block;
			padding: 5px 13px;
		}

		.bottom-bar > .bar-button {

		}

		.bottom-bar .back-button.disabled #back-icon {
			fill: #fff;
		}

		.bottom-bar .back-button {
			display: none;
		}

		.bottom-bar .more-button {
			display: none;
		}

	`,

	tpl:
		`<div class="bottom-bar">
			<div ui="backButtonEl" class="bar-button back-button">${images.back}</div>
			<div class="center">
				<div ui="navButtonEl" class="team-buttom">${images.logo}</div>
			</div>
			<div ui="moreButtonEl" class="bar-button more-button">${images.more}</div>
		</div>
	`,

	init: function() {
		this.el = mini.createElement(this.tpl, this);

		this.addListener(this.backButtonEl, 'touchend', function(event) {
			this.fireEvent('backButton', {});
			event.preventDefault();
		}, this);

		this.addListener(this.navButtonEl, 'touchend', function(event) {
			this.fireEvent('navButton', {});
		}, this);

		this.addListener(this.moreButtonEl, 'touchend', function(event) {
			this.fireEvent('moreButton', {});
			event.preventDefault();
		}, this);

	},

	enableBackButton: function(enable) {
		if (enable) {
			mini.addClass(this.backButtonEl, 'disabled');
		}
		else {
			mini.removeClass(this.backButtonEl, 'disabled');
		}
	},

	enableMoreButton: function(enable) {
		if (enable) {
			mini.addClass(this.moreButtonEl, 'disabled');
		}
		else {
			mini.removeClass(this.moreButtonEl, 'disabled');
		}
	},

	getEl: function() {
		return this.el;
	}


});
