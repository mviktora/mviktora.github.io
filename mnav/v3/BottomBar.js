'use strict';

mini.define('BottomBar', {

	css: `
		.team-users {
			border-radius: 7px;
			background: #ddd;
			display: inline-block;
			padding: 4px 7px;
		}
		.team-users img {
			min-width: 24px;
			height: 24px;
			border-radius: 50%;
			background: #f0f0f0;
			margin-left: -10px;
			border: 2px solid #fff;
		}
		.team-users img:first-child {
			margin-left: 0 !Important;
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
				<div ui="teamUsersEl" class="team-users"></div>
			</div>
			<div id="nav-more-button" class="bottom-button"></div>
		</div>
	`,

	avatarTpl: function(user) {
		return `<img src="https://samepage.io/api/app/rest/userpicture/user-${user.guid}-large.png"/>`
	},

	init: function() {
		this.el = mini.createElement(this.tpl, this);

		this._addUser(findUserByName('Scott'));
		this._addUser(findUserByName('Praus'));
		this._addUser(findUserByName('Markéta'));
	},

	getEl: function() {
		return this.el;
	},

	_addUser: function(user) {
		var
			ui = {};

		mini.createElement(this.avatarTpl(user), ui, this.teamUsersEl);
	}

});
