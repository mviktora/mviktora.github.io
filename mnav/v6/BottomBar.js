'use strict';

mini.define('BottomBar', {

	events: ['backButton', 'navButton', 'moreButton'],

	css: `
		.bottom-bar {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 53px;
			background: #f5f5f5;
			display: flex;
			align-items: center;
			padding: 0 20px;
			height: 53px;
			border-top: 1px solid #ccc;
			z-index: 1000
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
			fill: #ddd;
		}

	`,

	tpl:
		`<div class="bottom-bar">
			<div ui="backButtonEl" class="bar-button back-button">${images.back}</div>
			<div class="center">
				<div ui="navButtonEl" class="team-buttom">${images.logo}</div>
			</div>
			<div ui="moreButtonEl" class="bar-button">${images.more}</div>
		</div>
	`,

	avatarTpl: function(user) {
		return `<img src="https://samepage.io/api/app/rest/userpicture/user-${user.guid}-large.png"/>`
	},

	init: function() {
		this.el = mini.createElement(this.tpl, this);

		this.addListener(this.backButtonEl, 'touchend', function(event) {
			this.fireEvent('backButton', {});
			event.preventDefault();
		}, this);

		this.addListener(this.navButtonEl, 'click', function(event) {
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
	},

	show: function() {
		mini.css(this.el, {display: 'flex'});
	},

	hide: function() {
		mini.css(this.el, {display: 'none'});
	}

});
