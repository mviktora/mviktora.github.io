'use strict';

mini.define('Team', {

	events: ['select'],

	animationTiming:  '.4s ease-in-out',

	css: `

		.card {
			position: absolute;
			top: 0px;
			width: 100%;
			height: calc(100% - 53px);
			overflow: auto;
			-webkit-overflow-scrolling: touch;
			transition: all .5s ease-out;
			display: flex;
			flex-direction: column;
			box-shadow: 0 0 23px #555;
		}

		.card .team-tabs {
			background-color: #fff;
		}

		.card.team > .heading {
			background-color: ${colors.green};
		}
		.card.team .team-tabs {
			border-top: 1px solid #6DA451;
			border-bottom: 1px solid ${colors.green};
		}
		.card.team .team-tabs .tab-icon path {
			stroke: ${colors.green};
		}

		.card.org .heading {
			background-color: ${colors.blue};
		}
		.card.org .team-tabs {
			border-bottom: 1px solid ${colors.blue};
		}
		.card.org .team-tabs .tab-icon path {
			stroke: ${colors.blue};
		}

		.card.user .heading {
			background-color: #A44592;
		}

		.card .heading {
			display: flex;
			min-height: 56px;
			color: #fff;
			align-items: center;
		}

		.card .heading .title {
			font-size: 14px;
		}

		.card .heading .sub-title {
			margin-top: 3px;
		}

		.card .team-tabs {
			display: flex;
			width: 100%;
			min-height: 46px;
			align-items: center;
			border-bottom: 1px solid #eee;
		}
		.card .team-tabs > .team-tab {
			flex-grow: 1;
			text-align: center;
			min-height: 46px;
		}

		.card .team-tabs > .team-tab svg {
			margin-top: 11px;
		}
		.card .team-tabs > .team-tab.selected path {
			stroke-width: 2px;
		}

		.card .content {
			flex-grow: 1;
			overflow: auto;
		}

		.card .content img {
			display: none;
			width: 100%;
		}

		.card .content img.show-image {
			display: block;
		}

		.team.slide-in {

		}

		.card .team-avatar {
			background-color: #fff !important;
			color: ${colors.green} !important;
		}

		.card .avatar-wrapper {
			padding: 0 13px;
		}

		.card .heading .team-avatar {
			width: 28px;
			height: 28px;
			border-radius: 3px;
			text-align: center;
			line-height: 28px;
			display: inline-block;
			font-size: 16px;
			font-weight: bold;
			border: 1px solid #fff;
		}

		.card .users {
			background: #53a2d4;
			overflow-x: auto;
			white-space: nowrap;
			min-height: 54px;
		}

		.card .user-avatar {
			margin-top: 10px;
			width: 36px;
			height: 36px;
			border-radius: 50%;
			margin-left: 7px;
			display: inline-block;
		}

	`,

	tpl: `

		<div class="card">
			<div ui="headingEl" class="heading">
				<div class="avatar-wrapper" ui="headingIconEl"></div>
				<div style="flex-grow: 1; text-align: center">
					<div class="title" ui="headingTitleEl"></div>
					<div class="sub-title" ui="subHeadingTitleEl"></div>
				</div>
				<div style="min-width: 46px"></div>
			</div>
			<div ui="usersEl" class="users"></div>
			<div ui="tabsEl" class="team-tabs"></div>
			<div ui="contentEl" class="content"></div>
		</div>

	`,

	tabTpl: function(image) {
		return `
			<div class="team-tab">${image}</div>
		`;
	},

	teamAvatarTpl: function(name) {
		return `<div class="team-avatar">${name[0]}</div>`;
	},

	userTpl: function(user) {
		return `<img class="user-avatar" src="https://samepage.io/api/app/rest/userpicture/user-${user.guid}-large.png"/>`
	},

	init: function(config) {

		this.mainCard = config.mainCard;
		this.el = mini.createElement(this.tpl, this);
		this._preloadImages(config.type, config.content);
		this.users = config.users || [];

		if (config.tabs) {
			config.tabs.forEach(function(tabName) {
				var tab = {
					name: tabName
				};
				tab.el = mini.createElement(this.tabTpl(images[tabName]), null, this.tabsEl);
				mini.addListener(tab.el, 'touchend', function() {
					this._onSelectTab(tab);
				}, this);
				if (config.selectTab && config.selectTab === tabName) {
					this._onSelectTab(tab);
				}
			}.bind(this));
		}
		else {
			mini.css(this.tabsEl, {display: 'none'});
		}

		if (this.users.length === 0) {
			mini.css(this.usersEl, {display: 'none'});
		}
		this.users.forEach(function(user) {
			mini.createElement(this.userTpl(user), null, this.usersEl);
		}.bind(this));

		mini.addListener(this.el, {
			touchstart: function(event) {
				this.touchStart = event.touches[0];
			},
			touchmove: function(event) {
				this.touchEnd = event.touches[0];

				if (this.asCard && event.target !== this.usersEl && event.target.parentElement !== this.usersEl) {
					event.stopPropagation();
					event.preventDefault();
				}
			},
				// if (this.touchEnd.clientY < this.touchStart.clientY) {
				// 	this._endNavigationMode('up');
				// }
				// else {
				// 	this._endNavigationMode('down');
				// }
			touchend: function(event) {
				if (!this.touchEnd) {
					this.fireEvent('select');
				}
				delete this.touchEnd;
				event.stopPropagation();
				event.preventDefault();
			},
			scope: this
		});

		if (config.icon) {
			mini.html(this.headingIconEl,  config.icon);
		}
		else {
			mini.html(this.headingIconEl,  this.teamAvatarTpl(config.title));
		}

		this._setTitle(config.title);

		mini.addClass(this.el, config.type);

		if (config.subtitle) {
			this._setSubtitle(config.subtitle);
			this._setContent('Page');
		}

		if (config.selectContent) {
			this._setContent(config.selectContent);
		}
	},

	getEl: function() {
		return this.el;
	},

	showAsCard: function(asCard) {
		var
			scale = .95,
			rotation = 0;

		this.asCard = asCard;
		if (asCard) {
			mini.addClass(this.el, 'slide-in');
			//mini.css(this.el, {matrix3d: `matrix(${scale}, 0, 0, ${scale}, 0, 0)`});
			//matrix3d(a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, a4, b4, c4, d4)
			if (this.mainCard) {
				mini.css(this.el, {
					transform: `scale(${scale}, ${scale}) rotateX(${rotation}deg)`,
					top: `calc(100% - 220px)`
				});
			}
			else {
				scale -= (this.order)/50;
				mini.css(this.el, {
					transform: `scale(${scale}, ${scale}) rotateX(${rotation}deg)`,
					top: `calc(60% - ${this.order * 100}px`
				});
			}
		}
		else {
			mini.removeClass(this.el, 'slide-in');
			mini.css(this.el, {transform: `scale(1, 1) rotateX(0deg)`});
			if (this.mainCard && this.order !== 0) {
				mini.css(this.el, {top: '100%'});
			}
			else {
				if (this.order === 0) {
					mini.css(this.el, {top: '0'});
				}
				else {
					mini.css(this.el, {top: `${this.order * 10}px`});
				}
			}
		}
	},

	setOrder: function(order) {
		this.order = order;
		mini.css(this.el, {'z-index': 100-this.order});
	},

	_preloadImages: function(section, images) {
		this.images = {};
		images.forEach(function(name) {
			this.images[name] = mini.createElement(`<img id="${name}" src="img/${section}/${name}.png" />`, {}, this.contentEl);
		}.bind(this));
	},

	_onSelectTab: function(tab) {
		if (this.selectedTab) {
			mini.removeClass(this.selectedTab.el, 'selected');
		}
		this.selectedTab = tab;
		this._setContent(tab.name);
		mini.addClass(tab.el, 'selected');
		this._setSubtitle(tab.name, true);
	},

	_setTitle: function(text) {
		mini.html(this.headingTitleEl, text);
	},

	_setSubtitle: function(text, bold) {
		mini.html(this.subHeadingTitleEl, text);
		mini.css(this.subHeadingTitleEl, {'font-weight' : bold ? 'normal' : 'normal'});
	},

	_setContent: function(tabName) {
		if (this.currentImgEl) {
			mini.removeClass(this.currentImgEl, 'show-image');
		}
		this.currentImgEl = this.images[tabName];
		mini.addClass(this.currentImgEl, 'show-image');
	},

});
