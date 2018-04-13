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
			background-color: rgba(0,0,0,.4);
			transition: top .2s;
			display: none;
		}

		.context-menu .context-menu-items {
			position: absolute;
			bottom: 100px;
			left: 10px;
			right: 10px;
		}

		.context-menu .context-menu-item {
			background: #fff;
			padding: 12px 20px;
			font-size: 18px;
			color: #999;
			border-bottom: 1px solid #f0f0f0;
		}

		.context-menu.show-context-menu {
			display: block;
		}

		.context-menu .top-corners {
			border-top-left-radius: 13px;
			border-top-right-radius: 13px;
		}

		.context-menu .bottom-corners {
			border-bottom-left-radius: 13px;
			border-bottom-right-radius: 13px;
			border: none;
		}

		.context-menu .context-submenu {
			white-space: nowrap;
			overflow: auto;
		}

		.context-menu .context-menu-spacer {
			min-height: 30px;
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

	spacerTpl:`
		<div class="context-menu-spacer"></div>
	`,

	itemTpl: function(item) {
		return `
			<div class="context-menu-item">${item ? item.name: ''}</div>
		`;
	},

	_getTpl: function(tpl, item) {
		if (typeof tpl === 'function') {
			return tpl(item);
		}
		else {
			return tpl;
		}
	},

	init: function(config) {
		this.el = mini.createElement(this.tpl, this, document.body);

		config.items = config.items || [];

		config.items.forEach(function(item, index) {
			var
				itemEl, subitemEl;

			if (item.type === 'spacer') {
				mini.createElement(this.spacerTpl, null, this.itemsEl);
				return;
			}

			if (item.tpl) {
				itemEl = mini.createElement(this._getTpl(item.tpl, item), null, this.itemsEl);
			}
			else {
				if (item.items) {
					itemEl = mini.createElement(this.submenuTpl, null, this.itemsEl);
				}
				else {
					itemEl = mini.createElement(this._getTpl(this.itemTpl, item), null, this.itemsEl);
				}
				if (item.cls) {
					mini.addClass(itemEl, item.cls);
				}
			}

			if (item.id) {
				this.addListener(itemEl, 'click', function(event) {
					event.preventDefault();
					this.hide();
					this.fireEvent('select', {item: item});
				}, this);
			}
			if (item.items) {
				item.items.forEach(function(subitem) {
					subitemEl = mini.createElement(item.itemTpl(subitem, item.itemCls), {}, itemEl);
					if (subitem.id) {
						this.addListener(subitemEl, 'click', function(event) {
							event.preventDefault();
							this.hide();
							this.fireEvent('select', {item: subitem});
						}, this);
					}

				}.bind(this));
			}

			if (index === 0 || (index > 0 && config.items[index - 1].type === 'spacer')) {
				mini.addClass(itemEl, 'top-corners');
			}

			if (index === config.items.length - 1 || (index < config.items.length - 1 && config.items[index + 1].type === 'spacer')) {
				mini.addClass(itemEl, 'bottom-corners');
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
