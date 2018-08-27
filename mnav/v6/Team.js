'use strict';

mini.define('Team', {

	events: ['select', 'endNavMode', 'contentClick'],

	animationTiming:  '.4s ease-in-out',

	css: `

		.team {
			position: absolute;
			top: 0px;
			width: 100%;
			height: calc(100% - 53px);
			overflow: auto;
			-webkit-overflow-scrolling: touch;
			transition: all .4s ease-in-out;
		}

		.team.teamx > .heading {
			background-color: #65ba4c;
		}
		.team.teamx .team-tabs {
			background-color: #f5f5f5;
			border-top: 1px solid #6DA451;
		}



		.team.org .heading {
			background-color: #55A8DD;
		}
		.team.org .team-tabs {
			background-color:#f5f5f5;
			border-top:1px solid #5E94C1;
		}

		.team .heading {
			display: flex;
			min-height: 56px;
			color: #fff;
			align-items: center;
		}

		.team .heading .title {
			font-size: 14px;
		}

		.team .heading .sub-title {
			margin-top: 3px;
		}

		.team .team-tabs {
			position: absolute;
			display: flex;
			top: 56px;
			width: 100%;
			align-items: center;
			border-bottom: 1px solid #eee;
		}

		.team .team-tabs > .team-tab {
			flex-grow: 1;
			text-align: center;
			height: 46px;
		}
		.team .team-tabs > .team-tab:first-child {
			border: none;
		}
		.team .team-tabs > .team-tab svg {
			margin-top: 11px;
		}
		.team .team-tabs > .team-tab.selected {
			background-color: #ddd;
		}

		.team .content {
			position: absolute;
			top: 104px;
			bottom: 0;
			width: 100%;
			transition: top .4s ease-in-out;
			overflow: auto;
		}

		.team .content img {
			display: none;
			width: 100%;
		}

		.team .content img.show-image {
			display: block;
		}

		.team.slide-in {

			box-shadow: 0 0 23px #555;
		}

		.team .team-avatar {
			border-color: #fff !important;
			color: #fff !important;
		}

		.team svg {
			path {
				fill: #fff !important;
				stroke: #fff !important;
			}
		}

		.team .avatar-wrapper {
			padding: 0 13px;
		}

		.team .heading .team-avatar {
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

	`,

	tpl: `

		<div class="team">
			<div ui="headingEl" class="heading">
				<div class="avatar-wrapper" ui="headingIconEl"></div>
				<div style="flex-grow: 1; text-align: center">
					<div class="title" ui="headingTitleEl"></div>
					<div class="sub-title" ui="subHeadingTitleEl"></div>
				</div>
				<div style="min-width: 46px"></div>
			</div>
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

	init: function(config) {

		this.el = mini.createElement(this.tpl, this);
		this._preloadImages(config.org ? 'org' : 'team', config.content);

		config.tabs.forEach(function(tabName) {
			var tab = {
				name: tabName
			};
			tab.el = mini.createElement(this.tabTpl(images[tabName]), null, this.tabsEl);
			mini.addListener(tab.el, 'touchend', function() {
				this._onSelectTab(tab);
			}, this);
		}.bind(this));

		mini.addListener(this.el, {
			touchstart: function(event) {
				this.touchStart = event.touches[0];
			},
			touchmove: function(event) {
				this.touchEnd = event.touches[0];
				if (this.asCard) {
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
		mini.addListener(this.contentEl, 'touchend', function() {
			this.fireEvent('contentClick');
		}, this);

		if (config.icon) {
			mini.html(this.headingIconEl,  config.icon);
		}
		else {
			mini.html(this.headingIconEl,  this.teamAvatarTpl(config.title));
		}

		this._setHeading(config.title, config.subtitle);

		if (config.org) {
			mini.addClass(this.el, 'org');
			this._setContent('Inbox');
		}
		else {
			mini.addClass(this.el, 'teamx');
			this._setContent('Page');
		}
	},

	getEl: function() {
		return this.el;
	},

	showAsCard: function(asCard) {
		var
			scale = 0.95 - this.order / 50;
		this.asCard = asCard;
		if (asCard) {
			mini.addClass(this.el, 'slide-in');
			mini.css(this.el, {transform: `matrix(${scale}, 0, 0, ${scale}, 0, 0)`});
			mini.css(this.el, {
			//	left: `${this.order * 5}px`,
				top: `calc(60% - ${this.order * 110}px`
			});
		}
		else {
			mini.removeClass(this.el, 'slide-in');
			mini.css(this.el, {transform: 'matrix(1, 0, 0, 1, 0, 0)'});
			mini.css(this.el, {top: 0});
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
		mini.html(this.subHeadingTitleEl, tab.name);
	},

	_setHeading: function(titleText, subtitleText) {
		mini.html(this.headingTitleEl, titleText);
		mini.html(this.subHeadingTitleEl, subtitleText);
	},

	_setContent: function(tabName) {
		if (this.currentImgEl) {
			mini.removeClass(this.currentImgEl, 'show-image');
		}
		this.currentImgEl = this.images[tabName];
		mini.addClass(this.currentImgEl, 'show-image');
	},

});
