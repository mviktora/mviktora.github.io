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
    padding-top: 13px;
    padding-bottom: 7px;
    background: #d0d0d0;
    background: rgba(240,240,240,0.6);
  }

  .team-card .tab-row {
    display: flex;
    margin-bottom: 7px;
  }

  .team-card .tab-row > .team-tab {
    min-width: 28%;
    min-height: 45px;
    line-height: 45px;
    border-radius: 10px;
    text-align: center;
    background: #fff;
    display: inline-block;
    color: #444;
    border: 1px solid rgba(255,255,255,.4);
  }

  .team-card .users {
    background: #fafafa;
    overflow-x: auto;
    white-space: nowrap;
    padding: 6px 10px;
  }

  .team-card .users .label {
    color: #444;
    margin-bottom: 13px;
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
          <div style="flex-grow: 1"></div>
            <div id="teamChat" class="team-tab">Chat</div>
          <div style="flex-grow: 1"></div>
            <div id="teamPages" class="team-tab">Pages</div>
           <div style="flex-grow: 1"></div>
          <div id="teamTasks" class="team-tab">Tasks</div>
          <div style="flex-grow: 1"></div>
         </div>
         <div class="tab-row">
          <div style="flex-grow: 1"></div>
            <div id="teamCalendar" class="team-tab">Calendar</div>
           <div style="flex-grow: 1"></div>
            <div id="teamFiles" class="team-tab">Files</div>
           <div style="flex-grow: 1"></div>
            <div id="teamSettings" class="team-tab">...</div>
           <div style="flex-grow: 1"></div>
        </div>
      </div>

			<div style="flex-grow: 1;background: #fff"></div>

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
	  teamFiles: 'Team files',
		teamSettings: 'Team settings'
	},

	init: function(config) {

		this.el = mini.createElement(this.tpl, this);

    this.addListener(this.el, 'touchend', function(event) {
      if (event.target.classList.contains("team-tab")) {
        this.fireEvent('tab', {
					id: event.target.id,
					title: this.texts[event.target.id]
				});
      }
    }, this);


    this.getUsers(this.orgUserNames).forEach(function(user) {
			mini.createElement(this.userTpl(user), null, this.usersEl);
		}.bind(this));

  },

  getEl: function() {
    return this.el;
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
