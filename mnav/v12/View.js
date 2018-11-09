'use strict';

mini.define('View', {

  events: ['content'],

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
			transition: opacity 0.2s ease-out;
			background: #f5f5f5;
		}

    .view .heading {

    }

		.view .heading .title {
			margin-top: 4px;
			height: 22px;
			line-height: 22px;
			display: flex;
			align-items: center;
		}


		.view .team-avatar {
			border: 1px solid #999;
			border-radius: 3px;
			width: 20px;
			height: 20px;
		}

		.view .heading .sub-title {
			font-weight: bold;
			height: 25px;
			line-height: 25px;
			font-size: 16px;
		}

		.view > .content {
			position: absolute;
			top: 52px;
			left: 0;
			width: 100%;
			bottom: 0px;
			overflow: auto;
			-webkit-overflow-scrolling: touch;
      background-color: #fff;
		}

		.view .content {
			white-space: nowrap;
			transition: scroll .4s;
			-webkit-overflow-scrolling: touch;
	 scroll-behavior: smooth; // Added in from answer from Felix
	 overflow-x: scroll;
		}

		.view .content .tab-content {
			width: 100%;
	    height: 100%;
	    display: inline-block;
	    overflow: auto;
		}

		.view .content .tab-content img {
			width: 100%;
		}


	`,

	tpl: `
		<div class="view">
			<div ui="headingWrapperEl" class="heading-wrapper">
        <div class="heading">
    			<div style="display: inline-block">
    				<div class="title">
    					<div ui="headingTitleEl"></div>
    				</div>
    			</div>
    			<div ui="subHeadingTitleEl" class="sub-title"></div>
    		</div>
      </div>
			<div ui="contentEl" class="content">
				<div id="_teamPage" class="tab-content"><img src="img/views/teamPage.png"></div>
				<div id="_teamChat" class="tab-content"><img src="img/views/teamChat.png"></div>
				<div id="_teamPages" class="tab-content"><img src="img/views/teamPages.png"></div>
				<div id="_teamCalendar" class="tab-content"><img src="img/views/teamCalendar.png"></div>
				<div id="_teamTasks" class="tab-content"><img src="img/views/teamTasks.png"></div>
				<div id="_teamFiles" class="tab-content"><img src="img/views/teamFiles.png"></div>
      </div>

    </div>


	`,

	init: function(config) {

		this.el = mini.createElement(this.tpl, this);

    this.addListener(this.contentEl, 'click', function(event) {
      this.fireEvent('content', {});
    }, this);

  },

  getEl: function() {
    return this.el;
  },

	setHeading: function(heading, subHeading, iconHtml) {
		mini.html(this.headingTitleEl, heading);
		mini.html(this.subHeadingTitleEl, subHeading);
		//mini.html(this.headingIconEl, iconHtml);
	},

	setContent: function(id, title) {
		var
			el = document.getElementById('_' + id);

		if (el) {
			this.contentEl.scrollLeft = el.offsetLeft;
		}
		//this.infoEl.src = `img/views/${id}.png`
	}

});
