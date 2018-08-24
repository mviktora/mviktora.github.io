'use strict';

mini.define('Team', {

	events: ['endNavMode', 'contentClick'],

	animationTiming:  '.4s ease-in-out',

	css: `

		.team {
			position: absolute;
			top: 0px;
			left: 0;
			right: 0;
			height: 100%;
			overflow: auto;
			-webkit-overflow-scrolling: touch;
			box-shadow: 0 0 23px #555;
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

		.team.org .content {
			top: 114px;
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
			height: 56px;
			width: 100%;
			align-items: center;
			border-bottom: 1px solid #eee;
		}

		.team .team-tabs > .team-tab {
			flex-grow: 1;
			text-align: center;
			height: 50px;
		}
		.team .team-tabs > .team-tab:first-child {
			border: none;
		}
		.team .team-tabs > .team-tab svg {
			margin-top: 11px;
		}

		.team .content {
			position: absolute;
			top: 56px;
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
			border-radius: 7px;
		}

		.team.slide-in .content {
			top: 114px;
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

		config.tabs.forEach(function(tab) {
			var el;
			el = mini.createElement(this.tabTpl(images[tab]), null, this.tabsEl);
			mini.addListener(el, 'touchend', function() {
				this._onSelectTab(tab);
			//	this._endNavigationMode();
			}, this);
		}.bind(this));

		mini.addListener(this.headingEl, {
			touchstart: function(event) {
				this.touchStart = event.touches[0];
			},
			touchmove: function(event) {
				this.touchEnd = event.touches[0];
				event.stopPropagation();
				event.preventDefault();
			},
			touchend: function(event) {
				if (!this.touchEnd) {
					return;
				}
				if (this.touchEnd.clientY < this.touchStart.clientY) {
					this._endNavigationMode('up');
				}
				else {
					this._endNavigationMode('down');
				}
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

	_endNavigationMode: function(direction) {
		this.fireEvent('endNavMode', {direction: direction});
	},

	transform: function(tr) {

		if (tr === 'halfscale') {
			mini.addClass(this.el, 'slide-in');
			mini.css(this.el, {transform: 'matrix(0.95, 0, 0, 0.95, 0, 0)'});
			mini.css(this.el, {top: '50%'});
		}
		else if (tr === 'scale') {
			mini.addClass(this.el, 'slide-in');
			mini.css(this.el, {transform: 'matrix(0.95, 0, 0, 0.95, 0, 0)'});
		}
		else if (tr === 'up') {
			mini.css(this.el, {top: '-100%'});
		}
		else if (tr === 'down') {
			mini.css(this.el, {top: '100%'});
		}
		else if (tr === 'none') {
			mini.removeClass(this.el, 'slide-in');
			mini.css(this.el, {top: 0});
			mini.css(this.el, {transform: 'matrix(1, 0, 0, 1, 0, 0)'});
		}
	},

	_preloadImages: function(section, images) {
		this.images = {};
		images.forEach(function(name) {
			this.images[name] = mini.createElement(`<img id="${name}" src="img/${section}/${name}.png" />`, {}, this.contentEl);
		}.bind(this));
	},

	_onSelectTab: function(tab) {
		this._setContent(tab);
		mini.html(this.subHeadingTitleEl, tab);
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
