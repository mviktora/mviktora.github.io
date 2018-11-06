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

		.view-wrapper {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			bottom: 0px;
			overflow: hidden;
			transition: transform .2s ease-out;
			box-shadow: 0 0 10px rgba(0,0,0,.3);
		}

		.bottom-bar-wrapper {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 52px;
			box-shadow: 0 0 10px rgba(0,0,0,.3);
		}

		.app.show-blur .blur {
			xbackground-color: rgba(0,0,0,.3);
		}

		.app .blur {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 52px;
			transition: background-color .2s;
			background-color: transparent;
		}

	`,
//<img style="display:block; position: absolute;left:0;top:0;bottom:0;right:0;filter: blur(2px);" src="img/bg.png">
	tpl: `
		<div ui="appEl" class="app">
			<div ui="viewWrapperEl" class="view-wrapper"></div>
		</div>
	`,
	//<div ui="blurEl" class="blur"></div>

	leftDockButtons: [
		//{id: 'Inbox', section: 'org', title: '', icon: `<img style="width:38px;border-radius:50%" src="img/logo.png"/>`},
		{id: '-'},
		{id: 'Search', section: 'org', title: 'Search', icon: images.search},
		{id: 'Inbox', section: 'org', title: 'Inbox', icon: images.inbox},
		{id: 'Teams', section: 'org', title: 'Teams', icon: images.teams},
		{id: 'Chats', section: 'org', title: 'Chats', icon: images.chats},
		{id: 'Tasks', section: 'org', title: 'Tasks', icon: images.task},
		{id: 'Calendar', section: 'org', title: 'Calendar', icon: images.calendar},
		{id: 'Bookmarks', section: 'org', title: 'Bookmarks', icon: images.bookmark},
		{id: 'SharedPages', section: 'org', title: 'Shared Pages', icon: images.sharedPages},
		{id: '-'}
	],

	teamAvatarTpl: function(name) {
		return `<div class="team-avatar team-avatar-small">${name[0]}</div>`;
	},

	smallSpLogo: `<img style="width: 24px;height:24px;border-radius: 50%;border: 1px solid #eee;margin-right: 5px" src="img/logo.png">`,

	init: function(config) {

		this.history = [];
		this.currentTeam = 'Everyone';

		this.el = mini.createElement(this.tpl, this, document.body);

		this.view = new View({});
		this.viewWrapperEl.appendChild(this.view.getEl());

		mini.addListener(this.view, 'navButton', function(event) {
			this.showDock(this.leftDock, true);
		}, this);

		mini.addListener(this.view, 'tab', function(event) {
			this.showDock(this.leftDock, false);
		}, this);

		mini.addListener(this.view, 'content', function(event) {
			this.showDock(this.leftDock, false);
		}, this);

		mini.addListener(this.el, 'touchend', function(event) {
			if (event.target === this.el) {
				this.showDock(this.leftDock, false);
				this.view.showNavButton();

			}
		}, this);


		//this.bottomBar = new BottomBar({});
		//this.bottomBarWrapperEl.appendChild(this.bottomBar.getEl());

		/*
		mini.addListener(this.bottomBar, {
			navButton: function(event) {
				this.showDock(this.leftDock, !this.showMenu);
			},
			backButton: function(event) {
				this.navigateBack();
			},
			moreButton: function(event) {
				//this.moreMenu.show();
				this.showDock(this.rightDock, !this.showMenu);
			},
			scope: this
		});
		*/

		this.leftDock = new Dock({
			position: 'left',
			buttons: this.leftDockButtons,
			shiftEl: this.viewWrapperEl
		});

		mini.addListener(this.leftDock, 'select', function(event) {
			this.showDock(this.leftDock, false);
			if (event.item) {
				this.navigateTo(event.item.section, event.item.id, event.item.title);
			}
		}, this);

		this.moreMenu = new Menu({
			items: [
				{name: 'Action 1', id: 'item1'},
				{name: 'Action 2', id: 'item2'}
			]
		});

		// this.addListener(this.blurEl, 'touchend', function(event) {
		// 	this.showDock(this.opendedDock, false);
		// }, this);

		this.navigateTo('team', 'Page', 'Page');
	},

	showDock: function(dock, show) {
		if (this.opendedDock) {
			show = false;
		}
		if (show) {
			this.opendedDock = dock;
			this.opendedDock.show();
		}
		else {
			this.opendedDock.hide();
			this.opendedDock = null;
		}
		this.showMenu = show;
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

	navigateTo: function(section, id, title) {
		this.history.push({
			section: section,
			title: title
		});
		this.setBackButtonState();
		this.setMoreButtonState(section, title);

		if (section === 'org') {
			this.view.setHeading('Samepage Labs', title, this.smallSpLogo);
			this.view.setContent('org', title);
		}
		else if (section === 'team'){
			this.view.setHeading('Customer Support Team', title, this.teamAvatarTpl(title));
			this.view.setContent('team', title);
		}
		else if (section === 'user') {
			this.view.setHeading('Samepage labs', title, this.smallSpLogo);
			this.view.setContent('user', 'Chat');
		}
		this.view.showNavButton();
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
