'use strict';

mini.define('View', {

  orgImages: ['Tasks', 'Calendar', 'Inbox', 'Teams', 'Search', 'Settings'],
	teamImages: ['Pages', 'Chat', 'Tasks', 'Calendar', 'Files', 'Page', 'Settings'],

	css: `
		.view {
			position: absolute;left:0;top:0;right:0;bottom:0;
      box-shadow: 0 0 13px #aaa;
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
			width: 100%;
			bottom: 0;
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

    .team-nav {
      position: absolute;
      bottom: 0px;
      left: 0;
      width: 100%;
      height: 80px;
      background-color: #d4d4d4;
      display: flex;
      align-items: center;
    }

    .team-nav-button {
      flex-grow: 1;
      text-align: center;
      color: #333131;
      font-size: 19px;
    }

	`,

	tpl: `
		<div class="view">
			<div ui="headingWrapperEl" class="heading-wrapper">
        <div class="heading">
    			<div style="display: inline-block">
    				<div class="title">
    					<div ui="headingIconEl"></div>
    					<div ui="headingTitleEl"></div>
    				</div>
    			</div>
    			<div ui="subHeadingTitleEl" class="sub-title"></div>
    		</div>
      </div>
			<div ui="contentEl" class="content"></div>
      <div class="team-nav">
        <div class="team-nav-button">Chat</div>
        <div class="team-nav-button">Pages</div>
        <div class="team-nav-button">Tasks</div>
        <div class="team-nav-button">Calendar</div>
        <div class="team-nav-button">Files</div>
      </div>
		</div>
	`,

	init: function(config) {

		this.el = mini.createElement(this.tpl, this);

		this.preloadImages('org', this.orgImages);
		this.preloadImages('team', this.teamImages);
	//	this.preloadImages('user', ['Chat']);
	},

  getEl: function() {
    return this.el;
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
	}

});
