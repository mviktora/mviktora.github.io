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

		.team-menu-heading {
			font-weight: bold;
			background: #fff;
			color: #444;
			font-size: 16px;
			padding: 13px 13px;
			border-bottom: 1px solid #f0f0f0;
		}

		.heading .team-avatar {
			width: 24px;
			height: 24px;
			border-radius: 3px;
			border: 1px solid #999;
			color: #999;
			text-align: center;
			line-height: 24px;
			margin-right: 7px;
			margin-left: 7px;
			display: inline-block;
		}

		.heading .team-avatar-small {
			font-size: 11px;
			height: 16px;
			width: 16px;
			line-height: 16px;
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

	teamAvatarTpl: function(name) {
		return `<div class="team-avatar team-avatar-small">${name[0]}</div>`;
	},

	smallSpLogo: `<img style="width: 24px;height:24px;border-radius: 50%;border: 1px solid #eee;margin-right: 5px" src="img/logo.png">`,

	init: function(config) {

		this.history = [];
		this.currentTeam = 'Everyone';
		this.didScroll = false;
		this.lastScrollTop = 0;

		this.el = mini.createElement(this.tpl, this, 'app-frame');

		mini.createElement(this.headingTpl, this, this.headingWrapperEl);

		this.bottomBar = new BottomBar({
		});
		mini.addListener(this.bottomBar, {
			navButton: function(event) {
				if (this.showMenu) {
					this.teamMenu.hide();
					this.showMenu = false;
				}
				else {
					this.showMenu = true;
					this.teamMenu.show();
				}
			},
			backButton: function(event) {
				this.navigateBack();
			},
			moreButton: function(event) {
				this.moreMenu.show();
			},
			scope: this
		});

		this.teamMenu = new Navigation({
			blurEl: this.el,
			orgName: 'Samepage Labs',
			teamName: 'Currently opened team',
			orgUsers: this.getUsers(this.orgUserNames),
			teamUsers: this.getUsers(this.teamUserNames)
		});

		mini.addListener(this.teamMenu, 'select', function(event) {
			if (event.item.section) {
				this.navigateTo(event.item.section, event.item.id);
			}
			else {
				this.navigateTo('user', event.item.fullName);
			}
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
		/*

		if (!this.teamMenuHeight) {
			this.teamMenuHeight = $('#nav-menu-team').outerHeight();
		}

		if (this.lastScrollTop - st > 0){
			$('#nav-menu-team').css({bottom: 0});
		} else {
			$('#nav-menu-team').css({bottom: `${-this.teamMenuHeight}px`});
		}
		*/

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
			this.setHeading('Samepage labs', title, this.smallSpLogo);
			this.setContent('user', 'Chat');
		}
	},

	setHeading: function(heading, subHeading, iconHtml) {
		mini.html(this.headingTitleEl, heading);
		mini.html(this.subHeadingTitleEl, subHeading);
		mini.html(this.headingIconEl, iconHtml);
	},

	setContent: function(section, title) {
		if (this.currentImgEl) {
			mini.removeClass(this.currentImgEl, 'show-image');
		}
		this.currentImgEl = mini.get(`${section}-${title}`);
		mini.addClass(this.currentImgEl, 'show-image');
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
			this.bottomBar.enableMoreButton(false);
		}
		else {
			this.bottomBar.enableMoreButton(true);
		}
	},

	setScrollPos: function() {
		var
			x = $('#main-section').height() - $('#app-frame').height() + 120;
		$('#overlay')[0].scrollTop = x;
	},

	getUsers: function(userNames) {
		var
			users = [];
		userNames.forEach(function(userName) {
			users.push(findUserByName(userName));
		});
		return users;
	}

});
