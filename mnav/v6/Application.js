'use strict';

mini.define('Application', {

	orgImages: ['Tasks', 'Calendar', 'Inbox', 'Teams', 'Search', 'Settings'],

	orgUserNames: ['Martin', 'Scott', 'Jan Je', 'Markéta', 'Jiří Praus',
		'Martin Hošna', 'Pořádek', 'Tracy', 'Matt', 'Nohavec', 'Zdeněk'
	],
	teamUserNames: ['Martin', 'Scott', 'Jiří Praus', 'Martin Hošna', 'Tracy', 'Matt'],

	css: `
		.view {
			position: absolute;left:0;top:0;right:0;bottom:0;
			overflow: hidden;
			background-color: #a8a9b1;
		}

	`,

	tpl: `
		<div class="view">
		</div>
	`,

	cardsDef: [{
			title: 'Samepage Labs',
			subtitle: 'Inbox',
			org: true,
			tabs: ['Inbox', 'Teams', 'Tasks', 'Calendar', 'Search'],
			content: ['Inbox', 'Teams', 'Calendar', 'Tasks', 'Search'],
			icon: `<img style="width: 34px;height:34px;border-radius: 50%;backgrond:#fff;" src="img/logo.png">`
		},
		{
			title: 'Customer Support Team',
			tabs: ['Chat', 'Pages', 'Tasks', 'Calendar', 'Files'],
			content: ['Pages', 'Chat', 'Tasks', 'Calendar', 'Files', 'Page', 'Settings'],
			subtitle: "Call didn't stop ringing after answering"
		},
		{
			title: 'Everyone',
			tabs: ['Chat', 'Pages', 'Tasks', 'Calendar', 'Files'],
			content: ['Pages', 'Chat', 'Tasks', 'Calendar', 'Files', 'Page', 'Settings'],
			subtitle: "Call didn't stop ringing after answering"
		},
		{
			title: 'BUGS',
			tabs: ['Chat', 'Pages', 'Tasks', 'Calendar', 'Files'],
			content: ['Pages', 'Chat', 'Tasks', 'Calendar', 'Files', 'Page', 'Settings'],
			subtitle: "Call didn't stop ringing after answering"
		}
	],

	init: function(config) {

		this.history = [];
		this.currentTeam = 'Everyone';
		this.didScroll = false;
		this.lastScrollTop = 0;
		this.cards = [];

		this.el = mini.createElement(this.tpl, this, 'app-frame');

		this.cardsDef.forEach(function(cardDef) {
			var
				card = new Team(cardDef);
			this.cards.push(card);
			mini.addListener(card, {
				select: function(event) {
					this.setCardsOrder(card);
					this.setNavMode(false);
				},
				scope: this
			});

			this.el.appendChild(card.getEl());
		}.bind(this));

		this.bottomBar = new BottomBar({});

		mini.addListener(this.bottomBar, {
			navButton: function(event) {
				this.setNavMode(true);
			},
			backButton: function(event) {
				this.navigateBack();
			},
			moreButton: function(event) {
				this.moreMenu.show();
			},
			scope: this
		});

		this.moreMenu = new Menu({
			items: [
				{name: 'Action 1', id: 'item1'},
				{name: 'Action 2', id: 'item2'}
			]
		});

		this.el.appendChild(this.bottomBar.getEl());

		this.setCardsOrder(this.cards[1]);
	},

	setCardsOrder: function(topCard) {
		var i;
		this.cards.splice(this.cards.indexOf(topCard), 1);
		this.cards.unshift(topCard);
		for (i = 0; i < this.cards.length; i++) {
			this.cards[i].setOrder(i);
		}
	},

	setNavMode: function(navMode) {
		var i;
		if (navMode) {
			this.bottomBar.hide();
		}
		else {
			this.bottomBar.show();
		}
		for (i = 0; i < this.cards.length; i++) {
			this.cards[i].showAsCard(navMode);
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
