'use strict';

mini.define('TeamCard', {

  events: ['tab'],

	css: `
  .team-card {
    font-size: 12px;
    xbackground: #eaeaea;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .team-tabs {
    padding: 1px 0px;
    background: #d0d0d0;
		padding-bottom: 0;
  }

  .team-card .tab-row {
    display: flex;
    margin-bottom: 1px;
  }

  .team-card .tab-row > .team-tab {
    flex-grow: 1;
    min-height: 45px;
    line-height: 45px;
    text-align: center;
    background: #fff;
    display: inline-block;
    color: #444;
    border: 1px solid rgba(255,255,255,.4);
		margin-left: 1px;
		width: 33%;
		font-size: 13px;
  }
	.team-card .tab-row > .team-tab:first-child {
		margin-left: 0;
	}

	.team-card .tab-row > .team-tab.selected-tab {
		font-weight: bold;
		color: #297dbd;
	}

  .team-card .users {
    background: #fff;
    overflow-x: auto;
    white-space: nowrap;
    padding: 0px 10px;
		padding-top: 0;
		padding-bottom: 10px;
  }

  .team-card .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-left: 5px;
    display: inline-block;
    border: 1px solid rgba(255,255,255,.4);
  }
  .team-card .user-avatar:first-child {
    margin-left: 0;
  }

  .team-card .team-info {
    padding: 13px;
    color: #444;
    background: #fff;
  }

  .team-card .team-info .team-name {
    font-size: 16px;
    font-weight: bold;
  }

  .team-card .team-info .pill {
    border-radius: 12px;
    background: #eaeaea;
    padding: 4px 9px;
  }

  .team-card .team-tab svg {
    width: 40px;
    fill: #999;
  }

  .team-card .team-tab svg {
    width: 40px;
    fill: #999;
  }

	.team-card .tab-switcher {
		height: 26px;
		display: flex;
		align-items: center;
		background: #f5f5f5;
	}

	.team-card .tab-switcher > .dot {
		width: 7px;
		height: 7px;
		background: #bbb;
		margin: 0 10px;
		border-radius: 50%;

	}

	.team-card .tab-switcher .selected-dot {
		background: #297dbd;
	}

	`,

	 tpl:
   `<div ui="buttonsEl" class="team-card">
      <div class="team-info">
        <div class="team-name" ui="teamNameEl">Customer Support Team</div>
        <div style="display: flex;padding-top: 13px;">
          <div class="pill">Open team</div>
          <div style="width:13px"></div>
          <div class="pill">34 subteams</div>
          <div style="flex-grow:1"></div>
          <div class="pill">12</div>
        </div>
      </div>

      <div class="users">
        <div style="width: 100%;overflow:auto">
          <div ui="usersEl">
          </div>
        </div>
      </div>

      <div class="team-tabs">
        <div class="tab-row">
          <div id="teamChat" class="team-tab">Chat</div>
          <div id="teamPages" class="team-tab">Pages</div>
          <div id="teamTasks" class="team-tab">Tasks</div>
         </div>
         <div class="tab-row">
           <div id="teamCalendar" class="team-tab">Events</div>
           <div id="teamFiles" class="team-tab">Files</div>
           <div id="teamSettings" class="team-tab">Settings</div>
        </div>
      </div>

			<div style="flex-grow: 1;background: #fff"></div>

			<div ui="dotsEl" class="tab-switcher">
				<div style="flex-grow: 1"></div>
				<div id="teamPageDot" class="dot"></div>
				<div id="teamChatDot" class="dot"></div>
				<div id="teamPagesDot" class="dot"></div>
				<div id="teamTasksDot" class="dot"></div>
				<div id="teamCalendarDot" class="dot"></div>
				<div id="teamFilesDot" class="dot"></div>
				<div style="flex-grow: 1"></div>
			</div>

    </div>
  `,

		tabs: ['teamChat', 'teamPages', 'teamTasks', 'teamCalendar', 'teamFiles'],

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
	  teamFiles: 'Team files',
		teamSettings: 'Team settings'
	},

	init: function(config) {

		this.el = mini.createElement(this.tpl, this);

    this.addListener(this.el, 'touchend', function(event) {
      if (event.target.classList.contains("team-tab")) {
				this.selectTab(event.target.id);
        this.fireEvent('tab', {
					id: event.target.id,
					title: this.texts[event.target.id]
				});
      }
    }, this);

    this.getUsers(this.orgUserNames).forEach(function(user) {
			mini.createElement(this.userTpl(user), null, this.usersEl);
		}.bind(this));
;
  },

  getEl: function() {
    return this.el;
  },

	selectTab: function(tabId) {
		if (this.selectedTab) {
			mini.removeClass(this.selectedTab, 'selected-tab');
		}
		if (this.dotEl) {
			mini.removeClass(this.dotEl, 'selected-dot');
		}
		this.selectedTab = mini.get(tabId);
		if (this.selectedTab) {
			mini.addClass(this.selectedTab, 'selected-tab');
		}

		this.dotEl = mini.get(tabId + 'Dot');
		if (this.dotEl) {
			mini.addClass(this.dotEl, 'selected-dot');
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
