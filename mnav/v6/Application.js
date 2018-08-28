'use strict';

mini.define('Application', {

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
			type: 'org',
			mainCard: true,
			title: 'Samepage Labs',
			org: true,
			tabs: ['Inbox', 'Teams', 'Tasks', 'Calendar', 'Search'],
			content: ['Inbox', 'Teams', 'Calendar', 'Tasks', 'Search'],
			icon: `<img style="width: 34px;height:34px;border-radius: 50%;backgrond:#fff;" src="img/logo.png">`,
			selectTab: 'Inbox'
		},
		{
			type: 'team',
			title: 'Customer Support Team',
			tabs: ['Chat', 'Pages', 'Tasks', 'Calendar', 'Files'],
			content: ['Pages', 'Chat', 'Tasks', 'Calendar', 'Files', 'Page', 'Settings'],
			subtitle: "Call didn't stop ringing after answering"
		},
		{
			type: 'team',
			title: 'Everyone',
			tabs: ['Chat', 'Pages', 'Tasks', 'Calendar', 'Files'],
			content: ['Pages', 'Chat', 'Tasks', 'Calendar', 'Files', 'Page', 'Settings'],
			selectTab: 'Chat'
		},
		{
			type: 'user',
			title: 'Jan Jezek',
			content: ['Jezek'],
			icon: `<img style="width: 34px;height:34px;border-radius: 50%;backgrond:#fff;border: 1px solid #f5f5f5" src="https://samepage.io/api/app/rest/userpicture/user-fc5b5cc5a3a667139f21fe6bd596c9380ee2b017-large.png">`,
			selectContent: 'Jezek'
		},
		{
			type: 'team',
			title: 'BUGS',
			tabs: ['Chat', 'Pages', 'Tasks', 'Calendar', 'Files'],
			content: ['Pages', 'Chat', 'Tasks', 'Calendar', 'Files', 'Page', 'Settings'],
			selectTab: 'Tasks'
		}
	],

	init: function(config) {

		this.history = [];
		this.currentTeam = 'Everyone';
		this.didScroll = false;
		this.lastScrollTop = 0;
		this.cards = [];

		this.cardsDef[0].users = this.getUsers(this.orgUserNames);

		this.el = mini.createElement(this.tpl, this, 'app-frame');

		this.cardsDef.forEach(function(cardDef) {
			var
				card = new Team(cardDef);
			this.cards.push(card);
			mini.addListener(card, {
				select: function(event) {
					this._setTopCard(card);
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

		this._setTopCard(this.cards[1]);
	},

	_setTopCard: function(topCard) {
		this.cards.splice(this.cards.indexOf(topCard), 1);
		this.cards.unshift(topCard)
	},

	_setCardsOrder: function(cardMode) {
		var i,
			order = cardMode ? 1 : 0;

		for (i = 0; i < this.cards.length; i++) {
			if (cardMode && this.cards[i].mainCard) {
				this.cards[i].setOrder(0);
			}
			else {
				this.cards[i].setOrder(order++);
			}
		}
	},

	setNavMode: function(cardMode) {
		var i;

		if (cardMode) {
			this.bottomBar.hide();
			mini.css(this.el, {perspective: '1600px'});
		}
		else {
			this.bottomBar.show();
			mini.css(this.el, {perspective: '0px'});
		}
		this._setCardsOrder(cardMode);
		for (i = 0; i < this.cards.length; i++) {
			this.cards[i].showAsCard(cardMode);
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

	getUsers: function(userNames) {
		var
			users = [];
		userNames.forEach(function(userName) {
			users.push(findUserByName(userName));
		});
		return users;
	}

});
