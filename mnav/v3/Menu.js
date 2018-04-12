'use strict';

mini.define('Menu', {

	events: ['select'],

	css: `
		.context-menu {
			position: absolute;
			-webkit-user-select: none;
			left: 0;
			top: 0;
			height: 100%;
			right: 0;
			background-color: rgba(0,0,0,.3);
			transition: top .2s;
			display: none;
		}

		.context-menu .context-menu-items {
			position: absolute;
			bottom: 120px;
			left: 0;
			right: 0;
		}

		.context-menu .context-menu-item {
			margin: 0 13px;
			background: #fff;
			padding: 12px 20px;
			font-size: 18px;
			color: #999;
			border-bottom: 1px solid #f0f0f0;
		}

		.context-menu.show-context-menu {
			display: block;
		}

		.context-menu .context-menu-item:first-child {
			border-top-left-radius: 13px;
			border-top-right-radius: 13px;
		}

		.context-menu .context-menu-item:last-child {
			border-bottom-left-radius: 13px;
			border-bottom-right-radius: 13px;
			border: none;
		}

		.context-menu .context-submenu {
			white-space: nowrap;
			overflow: auto;
		}
	`,

	tpl: `
		<div class="context-menu">
			<div style="flex-grow: 1"></div>
			<div ui="itemsEl" class="context-menu-items"></div>
			<div style="min-height: 100px"></div>
		</div>
	`,

	submenuTpl:`
		<div class="context-menu-item context-submenu"></div>
	`,

	itemTpl: function(item) {
		return `
			<div class="context-menu-item">${item ? item.name: ''}</div>
		`;
	},

	init: function(config) {

		this.el = mini.createElement(this.tpl, this, document.body);

		config.items = config.items || [];

		config.items.forEach(function(item) {
			var
				itemEl,
				ui = {};

			if (item.id) {
				itemEl = mini.createElement(this.itemTpl(item), ui, this.itemsEl);
				this.addListener(itemEl, 'click', function(event) {
					event.preventDefault();
					this.hide();
					this.fireEvent('select', {item: item});
				}, this);
			}

			if (item.tpl) {
				itemEl = mini.createElement(this.itemTpl(), ui, this.itemsEl);
				mini.createElement(item.tpl, {}, itemEl);
			}

			if (item.items) {
				itemEl = mini.createElement(this.submenuTpl, {}, this.itemsEl);
				mini.addClass(itemEl, item.cls);
				item.items.forEach(function(subitem) {
					mini.createElement(item.itemTpl(subitem, item.itemCls), {}, itemEl);
				}.bind(this));
			}

		}.bind(this));

		this.addListener(this.el, 'touchend', function(event) {
			if (event.target === this.el) {
				this.hide();
				event.preventDefault();
			}
		}, this);

		this.addListener(this.el, 'touchmove', function(event) {
			event.stopPropagation();
		}, this);

	},

	show: function() {
		mini.addClass(this.el, 'show-context-menu');
	},

	hide: function() {
		mini.removeClass(this.el, 'show-context-menu');
	},

	getEl: function() {
		return this.el;
	}

});
