'use strict';

mini.define('Application', {


	orgUserNames: ['Martin', 'Scott', 'Jan Je', 'Markéta', 'Jiří Praus',
		'Martin Hošna', 'Pořádek', 'Tracy', 'Matt', 'Nohavec', 'Zdeněk'
	],
	teamUserNames: ['Martin', 'Scott', 'Jiří Praus', 'Martin Hošna', 'Tracy', 'Matt'],

	css: `

		.app {
			position: relative;width:100%;height:100%;
			background: #616161;
			overflow: hidden;
			-webkit-overflow-scrolling: touch;
			-webkit-user-select: none;
		}

		.app .view-wrapper, .app .dock-wrapper {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			bottom: 0px;
			overflow: hidden;
			transition: transform .2s ease-out;
		}

		.app .bottom-bar-wrapper {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 60px;
			box-shadow: 0 0 10px rgba(0,0,0,.3);
			transition: transform 0.2s ease-out;
		}

		.app .team-card-wrapper {
			position: absolute;
			left: 90px;
			top: 60px;
			right: 13px;
			bottom: 20px;
			overflow: hidden;
			border-radius: 10px;
			box-shadow: 0 0 10px rgba(0,0,0,.3);
			transform: scale(1.63);
			transition: transform 0.2s ease-out;
		}

		.app .dock-wrapper {
			background-color: #506b42;
		}

		.app .org-info {
			position: absolute;
			left: 100px;
			top: 22px;
			color: #fff;
		}


		.app.overview .team-card-wrapper {
			transform: scale(1);
		}

		.app.overview .view-wrapper {
			transform: scale(0.68) translate(60px, 260px);
		}

		.app.overview .bottom-bar-wrapper {
			box-shadow: none;
			transform: translate(0px, 60px);
		}

		.app.overview .view .heading-wrapper {
      opacity: 0;
    }

		.app.overview .view .content {
      height: 410px;
    }

	`,

	tpl: `
		<div ui="appEl" class="app">
			<div ui="dockWrapperEl" class="dock-wrapper"></div>
			<div ui="teamCardWrapperEl" class="team-card-wrapper"></div>
			<div class="org-info">Samepage Labs</div>
			<div ui="viewWrapperEl" class="view-wrapper"></div>
			<div ui="bottomBarWrapperEl" class="bottom-bar-wrapper"></div>
		</div>
	`,

	leftDockButtons: [
		{id: '-'},
		{id: 'mySearch', section: 'org', title: 'Search', icon: images.search},
		{id: 'myInbox', section: 'org', title: 'Inbox', icon: images.inbox},
		{id: 'myTeams', section: 'org', title: 'Teams', icon: images.teams},
		{id: 'myChats', section: 'org', title: 'Chats', icon: images.chats},
		{id: 'myCalendar', section: 'org', title: 'Calendar', icon: images.calendar},
		{id: 'myTasks', section: 'org', title: 'Tasks', icon: images.task},
		{id: 'myBookmarks', section: 'org', title: 'Bookmarks', icon: images.bookmark},
		{id: 'mySharedPages', section: 'org', title: 'Shared Pages', icon: images.sharedPages}
	],

	teamAvatarTpl: function(name) {
		return `<div class="team-avatar team-avatar-small">${name[0]}</div>`;
	},

	smallSpLogo: `<img style="width: 24px;height:24px;border-radius: 50%;border: 1px solid #eee;margin-right: 5px" src="img/logo.png">`,

	init: function(config) {

		this.history = [];

		this.el = mini.createElement(this.tpl, this, document.body);

		this.leftDock = new Dock({
			buttons: this.leftDockButtons
		});
		this.dockWrapperEl.appendChild(this.leftDock.getEl());

		this.teamCard = new TeamCard({});
		this.teamCardWrapperEl.appendChild(this.teamCard.getEl());

		this.view = new View({});
		this.viewWrapperEl.appendChild(this.view.getEl());

		this.bottomBar = new BottomBar({});
		this.bottomBarWrapperEl.appendChild(this.bottomBar.getEl());

		mini.addListener(this.bottomBar, 'navButton', function(event) {
			this.showDock(true);
		}, this);

		mini.addListener(this.teamCard, 'tab', function(event) {
			this.showDock(false);
			this.navigateTo(event.id, event.title);
		}, this);

		mini.addListener(this.view, 'content', function(event) {
			this.showDock(false);
		}, this);

		mini.addListener(this.el, 'touchend', function(event) {
			if (event.target === this.el) {
				this.showDock(false);
			}
		}, this);

		mini.addListener(this.leftDock, 'select', function(event) {
			this.showDock(false);
			if (event.item) {
				this.navigateTo(event.item.id, event.item.title);
			}
		}, this);

		this.moreMenu = new Menu({
			items: [
				{name: 'Action 1', id: 'item1'},
				{name: 'Action 2', id: 'item2'}
			]
		});


		this.navigateTo('teamPage', 'Page');
	},

	showDock: function(show) {
		if (show) {
			mini.addClass(this.el, 'overview');
		}
		else {
			mini.removeClass(this.el, 'overview');
		}
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

	navigateTo: function(id, title) {
		this.history.push({
			title: title
		});

		var section = id.substring(0, 2);

		if (section === 'my') {
			this.view.setHeading('Samepage Labs', title, this.smallSpLogo);
		}
		else {
			this.view.setHeading('Customer Support Team', title, this.teamAvatarTpl(title));
		}
		this.view.setContent(id, title);
	},

	setBackButtonState: function() {
		//this.bottomBar.enableBackButton(this.history.length < 2);
	},

	setMoreButtonState: function(section, title) {
		return;
		if (title === 'Settings') {
			this.bottomBar.enableMoreButton(false);
		}
		else {
			this.bottomBar.enableMoreButton(true);
		}
	}



});
