'use strict';

mini.define('Application', {

	orgImages: ['Tasks', 'Calendar', 'Inbox', 'Teams', 'Search', 'Settings'],
	teamImages: ['Pages', 'Chat', 'Tasks', 'Calendar', 'Files', 'Page', 'Settings'],

	teamUserNames: ['Martin', 'Scott', 'Jan Je', 'Markéta', 'Jiří Praus', 'Martin Hošna', 'Pořádek', 'Tracy', 'Matt', 'Nohavec', 'Zdeněk'],

	css: `
		.view {
			position: absolute;left:0;top:0;right:0;bottom:0;
			overflow: hidden;
		}

		.view > .heading {
			position: absolute;
			left: 0;
			top: 0;
			min-height: 52px;
			width: 100%;
			text-align: center;
			background-color: #fafafa;
			border-bottom: 1px solid #eee;
		}

		.view > .heading .heading-team .team-name {
			margin-top: 4px;
			height: 22px;
			line-height: 22px;
			display: flex;
			align-items: center;
		}

		.view > .heading .heading-team .team-item {
			font-weight: bold;
			height: 25px;
			line-height: 25px;
			font-size: 16px;
		}

		.view > .heading .heading-org {
			font-size: 20px;
			line-height: 52px;
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

		.view > #bottom-bar {
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
			-webkit-overflow-scrolling: touch;
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
			color: #444;
			font-size: 16px;
			padding: 2px 2px;
		}

	`,

	tpl: `
		<div class="view">
			<div ui="headingEl" class="heading"></div>
			<div ui="contentEl" class="content"></div>
			<div id="bottom-bar"></div>
		</div>
	`,

	teamHeadingTpl: `
		<div class="heading-team">
			<div style="display: inline-block">
				<div class="team-name">
					<div ui="teamAvatarEl" class="team-avatar team-avatar-small"></div>
					<div ui="teamNameEl"></div>
				</div>
			</div>
			<div ui="teamUsersEl" class="team-item"></div>
		</div>
	`,

	orgHeadingTpl: `
		<div class="heading-team">
			<div style="display: inline-block">
				<div class="team-name">
					<img src="img/logo.png" class="tiny-logo">
					<div ui="orgNameEl"></div>
				</div>
			</div>
			<div class="team-item">xxx</div>
		</div>
	`,

	teamMenuHeadingTpl:
		`<div class="team-menu-heading">Customer Support Team</div>`,

	avatarTpl: function(user, cls) {
		return `<img class="${cls}" src="https://samepage.io/api/app/rest/userpicture/user-${user.guid}-large.png"/>`
	},

	init: function(config) {

		this.history = [];
		this.currentTeam = 'Everyone';
		this.didScroll = false;
		this.lastScrollTop = 0;

		mini.createElement(this.tpl, this, 'app-frame');

		this.teamHeadingEl = mini.createElement(this.teamHeadingTpl, this, this.headingEl);
		this.orgHeadingEl = mini.createElement(this.orgHeadingTpl, this, this.headingEl);

		mini.css(this.teamHeadingEl, {display: 'none'});
		mini.css(this.orgHeadingEl, {display: 'none'});

		$('#nav-more-button').html(images.more);
		$('#nav-button').html(images.navbutton);
		$('#back-button').html(images.back);

		this.bottomBar = new BottomBar();
		mini.addListener(this.bottomBar, 'select', function(event) {
			this.teamMenu.show();
		}, this);

		this.bottomBar.selectItem({name: 'Pages'});

		this.teamUsers = [];
		this.teamUserNames.forEach(function(userName) {
			this.teamUsers.push(findUserByName(userName));
		}.bind(this));

		this.teamMenu = new Menu({
			items: [
				{tpl: this.teamMenuHeadingTpl},
				{items: this.teamUsers, cls: 'team-menu-users', itemTpl: this.avatarTpl, itemCls: 'user-avatar'},
				{id: 'Chat', name: 'Chat'},
				{id: 'Pages', name: 'Pages'},
				{id: 'Tasks', name: 'Tasks'},
				{id: 'Calendar', name: 'Calendar'},
				{id: 'Files', name: 'Files'},
				{id: 'Settings', name: 'Settings'}
			]
		});

		mini.addListener(this.teamMenu, 'select', function(event) {
			this.bottomBar.selectItem(event.item);
			this.navigateTo('team', event.item.id);
		}, this);

		this.moreMenu = new Menu({
			items: [
				{name: 'Action 1', id: 'item1'},
				{name: 'Action 2', id: 'item2'}
			]
		});

		$('#nav-more-button').on('touchend', function() {
			this.moreMenu.show();
		});

		$('#bottom-bar').append(this.bottomBar.getEl());

		this.preloadImages('org', this.orgImages);
		this.preloadImages('team', this.teamImages);
		this.preloadImages('user', ['Chat']);

		$('#back-button').on('touchend', function() {
			if (this.history.length < 2) {
				return
			};
			this.history.pop();
			var
				lastItem = this.history.pop();
			this.navigateTo(lastItem.section, lastItem.title);
		});

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

	navigateTo: function(section, title) {
		this.history.push({
			section: section,
			title: title
		});
		this.setBackButtonState();
		this.setMoreButtonState(section, title);

		if (section === 'org') {
			this.setOrgHeading('Samepage labs', title)
			this.setContent('org', title);
		}
		else if (section === 'team'){
			this.setTeamHeading('Customer Support Team', title)
			this.setContent('team', title);
		}
		else if (section === 'user') {
			this.setOrgHeading('Samepage labs', title)
			this.setContent('user', 'Chat');
		}
	},

	setTeamHeading: function(teamName, teamItem) {
		mini.css(this.teamHeadingEl, {display: 'block'});
		mini.css(this.orgHeadingEl, {display: 'none'});
		mini.html(this.teamNameEl, teamName);
		mini.html(this.teamAvatarEl, teamName[0]);
		// this.teamUsers.forEach(function(userName) {
		// 	mini.createElement(this.avatarTpl(findUserByName(userName), 'avatar-small'), {}, this.teamUsersEl);
		// }.bind(this));
	},

	setOrgHeading: function(orgName, itemName) {
		mini.css(this.teamHeadingEl, {display: 'none'});
		mini.css(this.orgHeadingEl, {display: 'block'});
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
		if (this.history.length < 2) {
			$('#back-button').addClass('disabled');
		}
		else {
			$('#back-button').removeClass('disabled');
		}
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
