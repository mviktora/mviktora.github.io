'use strict';

mini.define('View', {

  events: ['navButton'],

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

    .team-nav {
      position: absolute;
      bottom: 0px;
      left: 0;
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
			transition: opacity 0.2s ease-out;
    }

    .view .team-nav-bar {
      display: flex;
      align-items: center;
      position: absolute;
      background: #BBCAB0;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
    }

    .view.show-nav-buttons .heading-wrapper {
      opacity: 0;
    }

    .view.show-nav-buttons .team-nav {
      opacity: 0;
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

      <div class="team-nav">
        <div class="team-nav-bar">
          <div style="flex-grow: 1"></div>
            <div ui="navButtonEl">${images.logo}</div>
          <div style="flex-grow: 1"></div>
        </div>
      </div>
		</div>


	`,

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

	setContent: function(id, title) {
    this.infoEl.src = `img/views/${id}.png`
	}

});
