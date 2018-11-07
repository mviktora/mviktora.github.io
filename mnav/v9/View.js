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
			background-color: #fff;
			border-bottom: 1px solid #eee;
		}

    .view .heading {
      background: #f5f5f5;
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

    .view .team-nav-bar {
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
      display: none;
    }

    .view.show-nav-buttons .heading {
      display: none;
    }

    .view .info {
      position: absolute;
      left: 0;
      width: 100%;
      bottom: 0;
      top: 0;
    }

    .view .team-avatar {
      border: 1px solid #999;
      border-radius: 3px;
      width: 20px;
      height: 20px;
    }

    .view .blur {
      display: none;
      position: absolute;
      top: 0px;
      left: 0;
      width: 100%;
      bottom: 0;
      background-color: rgba(0,0,0,.4);
    }

    .view.show-nav-buttons .content {

    }

    .view.show-nav-buttons .blur {
       display: flex;
       flex-direction: column;
    }

    .view .blur .team-tabs {
      display: flex;
      margin-bottom: 10px;
    }

    .view .blur .team-tabs > .team-tab {
      min-width: 30%;
      min-height: 85px;
      line-height: 85px;
      border-radius: 10px;
      text-align: center;
      background: rgba(255,255,255,.9);
      display: inline-block;
      color: #444;
      font-size: 18px;
    }
    .view .users {
			background: rgba(255,255,255,.9);
			overflow-x: auto;
			white-space: nowrap;
      margin: 10px;
      border-radius: 10px;
      padding: 13px;
		}

    .view .users .label {
      color: #444;
      font-size: 18px;
      margin-bottom: 13px;
    }

		.view .user-avatar {
			width: 45px;
			height: 45px;
			border-radius: 50%;
			margin-left: 7px;
			display: inline-block;
		}
    .view .user-avatar:first-child {
      margin-left: 0;
    }

    .view .team-info {
      border-radius: 10px;
      background: rgba(255,255,255,.9);
      margin: 10px;
      padding: 13px;
      padding-top: 20px;
      color: #444;
      font-size: 18px;
    }

    .view .team-info .team-name {
      font-size: 20px;
      font-weight: bold;
      margin-top: 7px;
    }

    .view .team-info .pill {
      border-radius: 12px;
      background: #ddd;
      margin-right: 10px;
      padding: 4px 9px;
    }

    .view .team-tab svg {
      width: 40px;
      fill: #999;
    }

    .view .team-tab svg {
      width: 40px;
      fill: #999;
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
        <img ui="infoEl" class="info">
      </div>
      <div ui="buttonsEl" class="blur">

        <div class="team-info">
          <div class="label">Team</div>
          <div class="team-name" ui="teamNameEl"></div>
          <div style="display: flex;padding-top: 13px;">
            <div class="pill">Open team</div>
            <div class="pill">34 subteams</div>
            <div style="flex-grow:1"></div>
            <div class="pill">12</div>
          </div>
        </div>

        <div style="flex-grow: 1"></div>

        <div class="users">
          <div class="label">Members</div>
          <div style="width: 100%;overflow:auto">
            <div ui="usersEl">
            </div>
          </div>
        </div>

        <div class="team-tabs">
          <div style="flex-grow: 1"></div>
            <div id="teamChat" class="team-tab">Chat</div>
          <div style="flex-grow: 1"></div>
            <div id="teamPages" class="team-tab">Pages</div>
           <div style="flex-grow: 1"></div>
          <div id="teamTasks" class="team-tab">Tasks</div>
          <div style="flex-grow: 1"></div>
         </div>
         <div class="team-tabs">
          <div style="flex-grow: 1"></div>
            <div id="teamCalendar" class="team-tab">Calendar</div>
           <div style="flex-grow: 1"></div>
            <div id="teamFiles" class="team-tab">Files</div>
           <div style="flex-grow: 1"></div>
            <div id="teamSettings" class="team-tab">...</div>
           <div style="flex-grow: 1"></div>
        </div>
        <div style="height: 10px;"></div>
      </div>
      <div class="team-nav">
        <div class="team-nav-bar">
          <div style="flex-grow: 1"></div>
            <div ui="navButtonEl">${images.logo}</div>
          <div style="flex-grow: 1"></div>
        </div>
      </div>
		</div>


	`,

  orgUserNames: ['Martin', 'Scott', 'Jan Je', 'Markéta', 'Jiří Praus',
		'Martin Hošna', 'Pořádek', 'Tracy', 'Matt', 'Nohavec', 'Zdeněk'
	],

  userTpl: function(user) {
		return `<img class="user-avatar" src="https://samepage.io/api/app/rest/userpicture/user-${user.guid}-large.png"/>`
	},

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
      if (event.target.classList.contains("team-tab")) {
        this.fireEvent('tab', {id: event.target.id});
        this.setContent(event.target.id, this.texts[event.target.id]);
        this.setHeading('Customer Support Team', this.texts[event.target.id], 'a');
        this.showNavButton();
      }
    }, this);


    this.getUsers(this.orgUserNames).forEach(function(user) {
			mini.createElement(this.userTpl(user), null, this.usersEl);
		}.bind(this));

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
    mini.html(this.teamNameEl, heading);

	},

	setContent: function(id, title) {
    this.infoEl.src = `img/views/${id}.png`
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
