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
			overflow: hidden;
      background-color: #fff;
		}

		.view .content .tab-content {
			width: 370px;
	    height: 100%;
		}

		.view .content .tab-content img {
			width: 100%;
		}

		.view .content .scroll-helper {
			position: absolute;
			left: 0;
			top: 0;
			height: 100%;
			display: flex;
	    overflow: hidden;
			white-space: nowrap;
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
			<div class="content">
				<div ui="contentEl" class="scroll-helper"></div>
			</div>

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
			this.scrollX = this.contentEl.offsetLeft;
			this.deltaX = null;
			this.contentEl.style.transition = '';
			e.preventDefault();
		}, this);

		this.addListener(this.contentEl, 'touchmove', function(e) {
			this.deltaX = e.touches[0].clientX - this.clientX;
			this.contentEl.style.left = this.scrollX + 2 * this.deltaX + 'px';
			e.preventDefault();
		}, this);

		this.addListener(this.contentEl, 'touchend', function(e) {
			var
				index = Math.floor((-this.contentEl.offsetLeft + 370 / 2) / 370);

			if (index < 0) {
				index = 0;
			}
			if (index >= this.tabsList.length) {
				index = this.tabsList.length -1;
			}
			e.preventDefault();
			this.contentEl.style.transition = 'left 0.2s ease-out';
			this.contentEl.style.left = - index * 370 + 'px';
			this.fireEvent('tab', {tabId: this.tabsList[index].id});
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

	setContent: function(id) {
		var
			index = this.tabsDef.indexOf(id);

		this.contentEl.style.left = - index * 370 + 'px';
	}

});
