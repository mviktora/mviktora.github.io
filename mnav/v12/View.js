'use strict';

mini.define('View', {

  events: ['content', 'tab'],

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
			-webkit-overflow-scrolling: normal;
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
			<div ui="contentEl" class="content"></div>

    </div>
	`,

	tabTpl: function(id) {
		return `
			<div class="tab-content"><img src="img/views/${id}.png"></div>
		`;
	},

	tabsDef: [
		'teamPage', 'teamChat', 'teamPages', 'teamTasks', 'teamCalendar', 'teamFiles'
	],

	init: function(config) {

		this.el = mini.createElement(this.tpl, this);

		this.tabsList = [];
		this.tabsMap = {};

		this.tabsDef.forEach(function(tab) {
			var
				el = mini.createElement(this.tabTpl(tab), null, this.contentEl);
			this.tabsList.push({
				id: tab,
				el: el
			});
			this.tabsMap[tab] = el;
		}.bind(this));

    this.addListener(this.contentEl, 'click', function(event) {
      this.fireEvent('content', {});
    }, this);

		this.addListener(this.contentEl, 'touchstart', function(e) {
			this.clientX = e.touches[0].clientX;
			this.scrollX = this.contentEl.scrollLeft;
			this.deltaX = null;
			e.preventDefault();
		}, this);

		this.addListener(this.contentEl, 'touchmove', function(e) {
			this.deltaX = e.touches[0].clientX - this.clientX;
			e.preventDefault();
			this.contentEl.scrollLeft = this.scrollX - 2 * this.deltaX;
		}, this);

		this.addListener(this.contentEl, 'touchend', function(e) {
			var
				index = Math.floor((this.contentEl.scrollLeft + this.contentEl.clientWidth / 2) / this.contentEl.clientWidth),
				tab = this.tabsList[index];
			e.preventDefault();
			this.contentEl.scrollLeft = tab.el.offsetLeft;
			this.fireEvent('tab', {tabId: tab.id});
			if (!this.deltaX || Math.abs(this.deltaX) < 4) {
				this.fireEvent('content');
			}
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
			el = this.tabsMap[id];

		if (el) {
			this.contentEl.scrollLeft = el.offsetLeft;
		}
	}

});
