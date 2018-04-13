'use strict';

mini.define('Navigation', {

	events: ['select'],

	css: `
		.navigation-menu {
			position: absolute;
			-webkit-user-select: none;
			left: 0;
			top: 0;
			height: 100%;
			right: 0;
			background-color: rgba(50,50,50,.5);
			xbackground-color: #F0EFF5;
			transition: top .2s;
			display: none;
			flex-direction: column;
		}
		.navigation-menu.show {
			display: flex;
		}

		.navigation-section {
			margin: 0 9px;
		}

		.navigation-menu .navigation-section .name-wrapper {
			border-top-right-radius: 9px;
			border-top-left-radius: 9px;
			background-color: rgba(240,240,240,.8);
			display: flex;
			align-items: center;
			padding: 13px 17px;
		}
		.navigation-menu .navigation-section .name-wrapper .name {
			font-size: 15px;
			font-weight: bold;
			margin-left: 7px;
		}

		.user-avatar {
			min-width: 32px;
			height: 32px;
			border-radius: 50%;
			background: #f0f0f0;
			margin-left: 5px;
			border: 1px solid rgba(100,100,100,.2);
		}

		.navigation-section .users {
			background-color: rgba(210,210,210,.8);
			white-space: nowrap;
			overflow: auto;
			-webkit-overflow-scrolling: touch;
			padding: 9px 13px;
		}

		.navigation-section .buttons {
			background-color: rgba(240,240,240,.8);
			border-bottom-right-radius: 9px;
			border-bottom-left-radius: 9px;
			padding: 7px 0;
		}

		.navigation-section .button {
			display: inline-block;
			padding: 3px 0px;
			width: 33%;
			text-align: center;
		}
		.navigation-section .button .icon {
			height: 34px;
		}
		.navigation-section .button .title {
			color: #333;
			font-size: 14px;
		}
		.team-wrapper {
			margin-top: 30px;
		}

		.navigation-blur {
			filter: blur(8px);
		}

		.navigation-section .team-avatar {
			border-radius: 3px;
			border: 1px solid #999;
			line-height: 20px;
			font-weight: bold;
			height: 20px;
			width: 20px;
			text-align: center;
			color: #999;
			font-size: 15px;
		}

		.navigation-section .org-icon {
			width: 24px;
			height: 24px;
			border-radius: 50%;
			border: 1px solid #eee;
		}


	`,

	tpl: `
		<div class="navigation-menu">
			<div style="flex-grow:1;width:0"></div>
			<div ui="orgWrapperEl" class="org-wrapper"></div>
			<div ui="teamWrapperEl" class="team-wrapper"></div>
			<div style="min-height: 100px;width:0"></div>
		</div>
	`,

	sectionTpl: function(config) {
		return `
			<div ui="el" class="navigation-section">
				<div class="name-wrapper">
					<div class="avatar">${config.avatar}</div>
					<div class="name">${config.name}</div>
				</div>
				<div class="users" ui="usersEl"></div>
				<div class="buttons" ui="buttonsEl"></div>
			</div>
		`;
	},

	avatarTpl: function(user) {
		return `<img class="user-avatar" src="https://samepage.io/api/app/rest/userpicture/user-${user.guid}-large.png"/>`
	},

	buttonTpl: function(button) {
		return `<div class="button">
			<div class="icon">${button.icon}</div>
			<div class="title">${button.title}</div>
		</div>`
	},

	init: function(config) {

		this.blurEl = config.blurEl;

		this.el = mini.createElement(this.tpl, this, document.body);

		this._addSection(this.orgWrapperEl,
			config.orgName,
			`<img class="org-icon" src="img/logo.png"/>`,
			config.orgUsers, [
			{id: 'Inbox', section: 'org', title: 'Inbox', icon: images.inbox},
			{id: 'Teams', section: 'org', title: 'Teams', icon: images.teams},
			{id: 'Tasks', section: 'org', title: 'Tasks', icon: images.task},
			{id: 'Calendar', section: 'org', title: 'Calendar', icon: images.calendar},
			{id: 'Search', section: 'org', title: 'Search', icon: images.search}
		]);

		this._addSection(this.teamWrapperEl,
			config.teamName,
			`<div class="team-avatar">${config.teamName[0]}</div>`,
			config.teamUsers,
			[
			{id: 'Chat', section: 'team', title: 'Chat', icon: images.chat},
			{id: 'Pages', section: 'team', title: 'Pages', icon: images.pages},
			{id: 'Tasks', section: 'team', title: 'Tasks', icon: images.task},
			{id: 'Calendar', section: 'team', title: 'Calendar', icon: images.calendar},
			{id: 'Files', section: 'team', title: 'Files', icon: images.files}
		]);

		this.addListener(this.el, 'touchend', function(event) {
			console.log(event.target)
			if (event.target === this.el) {
				this.hide();
				event.preventDefault();
			}
		}, this);

		this.addListener(this.el, 'touchmove', function(event) {
			event.stopPropagation();
		}, this);

	},

	_addSection: function(parentEl, name, avatar, users, buttons) {
		var
			ui = {}

		mini.createElement(this.sectionTpl({
			name: name,
			avatar: avatar
		}), ui, parentEl);

		users.forEach(function(user) {
			var
				el = mini.createElement(this.avatarTpl(user), null, ui.usersEl);
			mini.addListener(el, 'click', function() {
				this.fireEvent('select', {item: user});
				this.hide();
			}, this);
		}.bind(this));

		buttons.forEach(function(button) {
			var
				el = mini.createElement(this.buttonTpl(button), null, ui.buttonsEl);
			mini.addListener(el, 'click', function() {
				this.fireEvent('select', {item: button});
				this.hide();
			}, this);
		}.bind(this));

		return ui;
	},

	show: function() {
		mini.addClass(this.el, 'show');
		mini.addClass(this.blurEl, 'navigation-blur');
	},

	hide: function() {
		mini.removeClass(this.el, 'show');
		mini.removeClass(this.blurEl, 'navigation-blur');
	},

	getEl: function() {
		return this.el;
	}

});
