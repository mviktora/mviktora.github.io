'use strict';

mini.define('BottomBar', {

	events: ['select'],

	css: `
		.bottom-bar {
			background: #f5f5f5;
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
			background: #ddd;
			display: inline-block;
			padding: 5px 13px;
		}

		.bottom-bar > .bar-button {

		}

	`,

	tpl:
		`<div class="bottom-bar">
			<div ui="orgButtonEl" class="bar-button">${images.navbutton}</div>
			<div class="center">
				<div ui="teamButtonEl" class="team-buttom"></div>
			</div>
			<div class="moreButtonEl" class="bar-button">${images.more}</div>
		</div>
	`,

	avatarTpl: function(user) {
		return `<img src="https://samepage.io/api/app/rest/userpicture/user-${user.guid}-large.png"/>`
	},

	init: function() {
		this.el = mini.createElement(this.tpl, this);

		this.addListener(this.teamButtonEl, 'touchend', function(event) {
			this.fireEvent('teamButton', {});
			event.preventDefault();
		}, this);

		this.addListener(this.orgButtonEl, 'touchend', function(event) {
			this.fireEvent('orgButton', {});
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
