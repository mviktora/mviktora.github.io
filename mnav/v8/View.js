'use strict';

mini.define('View', {

  events: ['navButton', 'tab'],

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
			width: 100%;
			bottom: 0;
			overflow: auto;
			-webkit-overflow-scrolling: touch;
      background-color: #fff;
		}

    .team-nav {
      position: absolute;
      bottom: 0px;
      left: 0;
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
    }

    .team-nav-button {
      flex-grow: 1;
      text-align: center;
      color: #333131;
      font-size: 19px;
      height: 100%;
      line-height: 60px;
    }

    .view .team-nav-buttons, .view .team-nav-bar {
      display: flex;
      align-items: center;
      position: absolute;
      background-color: #e0e0e0;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
    }

    .view.show-nav-buttons .team-nav-bar {
      display: none;
    }

    .view.show-nav-buttons .team-nav {

    }

    .view .info {
      margin-top: 30%;
      font-size: 40px;
      color: #aaa;
      text-align: center;
    }

    .view .team-avatar {
      border: 1px solid #999;
      border-radius: 3px;
      width: 20px;
      height: 20px;
    }


	`,

	tpl: `
		<div class="view">
			<div ui="headingWrapperEl" class="heading-wrapper">
        <div class="heading">
    			<div style="display: inline-block">
    				<div class="title">
    					<div ui="headingIconEl" class="team-avatar"></div>
    					<div ui="headingTitleEl"></div>
    				</div>
    			</div>
    			<div ui="subHeadingTitleEl" class="sub-title"></div>
    		</div>
      </div>
			<div ui="contentEl" class="content">
        <div ui="infoEl" class="info"></div>
      </div>
      <div class="team-nav">
        <div ui="buttonsEl" class="team-nav-buttons">
          <div id="teamChat" class="team-nav-button">Chat</div>
          <div id="teamPages" class="team-nav-button">Pages</div>
          <div id="teamTasks" class="team-nav-button">Tasks</div>
          <div id="teamCalendar" class="team-nav-button">Calendar</div>
          <div id="teamFiles" class="team-nav-button">Files</div>
        </div>
        <div class="team-nav-bar">
          <div style="flex-grow: 1"></div>
            <div ui="navButtonEl">${images.logo}</div>
          <div style="flex-grow: 1"></div>
        </div>
      </div>
		</div>
	`,

  texts: {
    teamChat: 'Team chat',
    teamPages: 'Team pages',
    teamTasks: 'Team tasks',
    teamCalendar: 'Team calendar',
    teamFiles: 'Team files'
  },

	init: function(config) {

		this.el = mini.createElement(this.tpl, this);

    this.addListener(this.navButtonEl, 'touchend', function(event) {
      mini.addClass(this.el, 'show-nav-buttons');
      this.fireEvent('navButton', {});
    }, this);

    this.addListener(this.contentEl, 'touchend', function(event) {
      mini.removeClass(this.el, 'show-nav-buttons');
      this.fireEvent('content', {});
    }, this);

    this.addListener(this.buttonsEl, 'touchend', function(event) {
      this.fireEvent('tab', {id: event.target.id});
      this.setContent('team', this.texts[event.target.id]);
      this.setHeading('Customer Support Team', this.texts[event.target.id], 'a');
      this.showNavButton();
    }, this);

  },

  getEl: function() {
    return this.el;
  },

  showNavButton: function() {
    mini.removeClass(this.el, 'show-nav-buttons');
  },

	setHeading: function(heading, subHeading, iconHtml) {
		mini.html(this.headingTitleEl, heading);
		mini.html(this.subHeadingTitleEl, subHeading);
		mini.html(this.headingIconEl, iconHtml);
	},

	setContent: function(section, title) {
    this.infoEl.innerHTML = title;
	}

});
