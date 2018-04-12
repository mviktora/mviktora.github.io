'use strict';

mini.define('Application', {

	orgImages: ['Tasks', 'Calendar', 'Inbox', 'Teams', 'Search', 'Settings'],
	teamImages: ['Pages', 'Chat', 'Tasks', 'Calendar', 'Files', 'Page', 'Settings'],

	orgUserNames: ['Martin', 'Scott', 'Jan Je', 'Markéta', 'Jiří Praus',
		'Martin Hošna', 'Pořádek', 'Tracy', 'Matt', 'Nohavec', 'Zdeněk'
	],
	teamUserNames: ['Martin', 'Scott', 'Jiří Praus', 'Martin Hošna', 'Tracy', 'Matt'],

	css: `
		.view {
			position: absolute;left:0;top:0;right:0;bottom:0;
			overflow: hidden;
		}

		.view > .heading-wrapper {
			position: absolute;
			left: 0;
			top: 0;
			min-height: 52px;
			width: 100%;
			text-align: center;
			background-color: #fafafa;
			border-bottom: 1px solid #eee;
		}

		.view .heading .title {
			margin-top: 4px;
			height: 22px;
			line-height: 22px;
			display: flex;
			align-items: center;
		}

		.view .heading .sub-title {
			font-weight: bold;
			height: 25px;
			line-height: 25px;
			font-size: 16px;
		}

		.view > .content {
			position: absolute;
			top: 53px;
			left: 0;
			right: 0;
			bottom: 53px;
			overflow: auto;
			-webkit-overflow-scrolling: touch;
		}

		.view > .content > img {
			display: none;
			width: 100%;
		}

		.view > .content .show-image {
			display: block !important;
		}

		.view > .bottom-bar-wrapper {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 52px;
			border-top: 1px solid #ddd;
		}

		.team-menu-users {
			padding: 10px;
			background: #fff;
			white-space: nowrap;
			overflow: auto;
			-webkit-overflow-scrolling: touch;
			border-bottom: 1px solid #f0f0f0;
		}

		.user-avatar {
			min-width: 32px;
			height: 32px;
			border-radius: 50%;
			background: #f0f0f0;
			margin-left: 2px;
			border: 2px solid #fff;
		}

		.team-menu-heading {
			font-weight: bold;
			background: #fff;
			color: #444;
			font-size: 16px;
			padding: 13px 13px;
			border-bottom: 1px solid #f0f0f0;
		}

		.menu-horiz-items {

			background: #fff;
			padding: 5px 13px;
		}

		.menu-horiz-item {
			display: inline-block;
			padding: 3px 7px;
			width: 27%;
			text-align: center;
		}

		.menu-horiz-item .icon {
			height: 38px;
		}
		.menu-horiz-item .title {
			color: #777;
		}

	`,

	tpl: `
		<div class="view">
			<div ui="headingWrapperEl" class="heading-wrapper"></div>
			<div ui="contentEl" class="content"></div>
			<div ui="bottomBarWrapperEl" class="bottom-bar-wrapper"></div>
		</div>
	`,

	headingTpl: `
		<div class="heading">
			<div style="display: inline-block">
				<div class="title">
					<div ui="headingIconEl"></div>
					<div ui="headingTitleEl"></div>
				</div>
			</div>
			<div ui="subHeadingTitleEl" class="sub-title"></div>
		</div>
	`,

	teamMenuHeadingTpl:
		`<div class="team-menu-heading">Customer Support Team</div>`,

	orgMenuHeadingTpl:
		`<div class="team-menu-heading">Samepage Labs</div>`,

	teamAvatarTpl: function(name) {
		return `<div class="team-avatar team-avatar-small">${name[0]}</div>`;
	},

	avatarTpl: function(user, cls) {
		return `<img class="${cls}" src="https://samepage.io/api/app/rest/userpicture/user-${user.guid}-large.png"/>`
	},

	smallSpLogo: `<img style="width: 24px;height:24px;border-radius: 50%;border: 1px solid #eee;margin-right: 5px" src="img/logo.png">`,

	menuItemTpl: function(item) {
		return `<div class="menu-horiz-item">
			<div class="icon">${item.icon}</div>
			<div class="title">${item.title}</div>
		</div>`
	},

	init: function(config) {

		this.history = [];
		this.currentTeam = 'Everyone';
		this.didScroll = false;
		this.lastScrollTop = 0;

		mini.createElement(this.tpl, this, 'app-frame');

		mini.createElement(this.headingTpl, this, this.headingWrapperEl);

		this.bottomBar = new BottomBar();
		mini.addListener(this.bottomBar, {
			navButton: function(event) {
				this.teamMenu.show();
			},
			backButton: function(event) {
				this.navigateBack();
			},
			moreButton: function(event) {
				this.moreMenu.show();
			},
			scope: this
		});

		this.teamUsers = [];
		this.teamUserNames.forEach(function(userName) {
			this.teamUsers.push(findUserByName(userName));
		}.bind(this));
		this.orgUsers = [];
		this.orgUserNames.forEach(function(userName) {
			this.orgUsers.push(findUserByName(userName));
		}.bind(this));

		this.teamMenu = new Menu(
			{
			items: [
				{tpl: this.orgMenuHeadingTpl},
				{items: this.orgUsers, tpl: '<div class="team-menu-users"></div>', itemTpl: this.avatarTpl, itemCls: 'user-avatar'},
				{
					items: [
						{id: 'Inbox', section: 'org', title: 'Inbox', icon: images.inbox},
						{id: 'Teams', section: 'org', title: 'Teams', icon: images.teams},
						{id: 'Tasks', section: 'org', title: 'Tasks', icon: images.task},
						{id: 'Calendar', section: 'org', title: 'Calendar', icon: images.calendar},
						{id: 'Search', section: 'org', title: 'Search', icon: images.search}
					],
					tpl: '<div class="menu-horiz-items"></div>',
					itemTpl: this.menuItemTpl
				},
				{type: 'spacer'},
				{tpl: this.teamMenuHeadingTpl},
				{items: this.teamUsers, tpl: '<div class="team-menu-users"></div>', itemTpl: this.avatarTpl, itemCls: 'user-avatar'},
				{
					items: [
						{id: 'Chat', section: 'team', title: 'Chat', icon: images.chat},
						{id: 'Pages', section: 'team', title: 'Pages', icon: images.pages},
						{id: 'Tasks', section: 'team', title: 'Tasks', icon: images.task},
						{id: 'Calendar', section: 'team', title: 'Calendar', icon: images.calendar},
						{id: 'Files', section: 'team', title: 'Files', icon: images.files},
					],
					tpl: '<div class="menu-horiz-items"></div>',
					itemTpl: this.menuItemTpl
				}
			]
		});

		mini.addListener(this.teamMenu, 'select', function(event) {
			this.navigateTo(event.item.section, event.item.id);
		}, this);

		this.moreMenu = new Menu({
			items: [
				{name: 'Action 1', id: 'item1'},
				{name: 'Action 2', id: 'item2'}
			]
		});

		this.bottomBarWrapperEl.appendChild(this.bottomBar.getEl());

		this.preloadImages('org', this.orgImages);
		this.preloadImages('team', this.teamImages);
		this.preloadImages('user', ['Chat']);

		this.navigateTo('team', 'Page');

		mini.addListener(this.contentEl, 'scroll', function(event) {
			this.didScroll = true;
		}, this);

		setInterval(function() {
			if (this.didScroll) {
				this.hasScrolled();
				this.didScroll = false;
			}
		}.bind(this), 150);

		//setScrollPos();
	},

	hasScrolled: function() {
		var
			st = this.contentEl.scrollTop;

		if (Math.abs(this.lastScrollTop - st) < 25) {
			this.lastScrollTop = st;
			return;
		}

		if (!this.teamMenuHeight) {
			this.teamMenuHeight = $('#nav-menu-team').outerHeight();
		}

		if (this.lastScrollTop - st > 0){
			$('#nav-menu-team').css({bottom: 0});
		} else {
			$('#nav-menu-team').css({bottom: `${-this.teamMenuHeight}px`});
		}

		this.lastScrollTop = st;
	},

	navigateBack: function() {
		if (this.history.length < 2) {
			return;
		};
		this.history.pop();
		var
			lastItem = this.history.pop();
		this.navigateTo(lastItem.section, lastItem.title);
	},

	navigateTo: function(section, title) {
		this.history.push({
			section: section,
			title: title
		});
		this.setBackButtonState();
		this.setMoreButtonState(section, title);

		if (section === 'org') {
			this.setHeading('Samepage Labs', title, this.smallSpLogo);
			this.setContent('org', title);
		}
		else if (section === 'team'){
			this.setHeading('Customer Support Team', title, this.teamAvatarTpl(title));
			this.setContent('team', title);
		}
		else if (section === 'user') {
			this.setHeading('Samepage labs', title)
			this.setContent('user', 'Chat');
		}
	},

	setHeading: function(heading, subHeading, iconHtml) {
		mini.html(this.headingTitleEl, heading);
		mini.html(this.subHeadingTitleEl, subHeading);
		mini.html(this.headingIconEl, iconHtml);
	},

	setContent: function(section, title) {
		$('.content > img').removeClass('show-image');
		$(`#${section}-${title}`).addClass('show-image');
	},

	preloadImages: function(section, images) {
		images.forEach(function(name) {
			mini.createElement(`<img id="${section}-${name}" src="img/${section}/${name}.png" />`, {}, this.contentEl);
		}.bind(this));
	},

	setBackButtonState: function() {
		this.bottomBar.enableBackButton(this.history.length < 2);
	},

	setMoreButtonState: function(section, title) {
		if (title === 'Settings') {
			$('#nav-more-button').css({visibility: 'hidden'});
		}
		else {
			$('#nav-more-button').css({visibility: 'visible'});
		}
	},

	setScrollPos: function() {
		var
			x = $('#main-section').height() - $('#app-frame').height() + 120;
		$('#overlay')[0].scrollTop = x;
	}

});
