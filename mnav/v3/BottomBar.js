'use strict';

mini.define('BottomBar', {

	events: ['select'],

	css: `
		.team-buttom {
			border-radius: 7px;
			background: #ddd;
			display: inline-block;
			padding: 5px 13px;
		}
		.team-button {
			text-align: center;
			flex-grow: 1;
		}
	`,

	tpl:
		`<div id="main-navigation">
			<div id="nav-button" class="bottom-button"></div>
			<div class="team-button">
				<div ui="teamButtonEl" class="team-buttom"></div>
			</div>
			<div id="nav-more-button" class="bottom-button"></div>
		</div>
	`,

	avatarTpl: function(user) {
		return `<img src="https://samepage.io/api/app/rest/userpicture/user-${user.guid}-large.png"/>`
	},

	init: function() {
		this.el = mini.createElement(this.tpl, this);

		this.addListener(this.el, 'touchend', function(event) {
			this.fireEvent('select', {});
			event.preventDefault();
		}, this);
	},

	getEl: function() {
		return this.el;
	},

	selectItem: function(item) {
		this.teamButtonEl.innerHTML = item.name;
	}

});
