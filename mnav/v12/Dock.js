'use strict';

mini.define('Dock', {

	events: ['select'],

	css: `
		.dock {
			display: flex;
			position: absolute;
			flex-direction: column;
			top: 0px;
			width: 76px;
			bottom: 0px;
			background-color: #609345;
			padding-bottom: 30px;
		}

		.dock .dock-button {
			text-align: center;
			color: #fff;
			width: 100%;
			height: 56px;
			font-size: 12px;
		}

		.dock .dock-button .title {
			margin-top: 3px;
		}

		.dock .dock-button:first-child {
			margin-top: 30px;
		}

		.dock-button svg {
			width: 26px;
			height: 26px;
		}

	`,

	tpl: `
		<div class="dock"></div>
	`,

	buttonTpl: function(button) {
		return `<div class="dock-button">
			<div class="icon">${button.icon}</div>
			<div class="title">${button.title}</div>
		</div>`
	},

	init: function(config) {

		this.el = mini.createElement(this.tpl, this);

		config.buttons.forEach(function(button) {
			var
				el;
			if (button.id === '-') {
				mini.createElement('<div style="flex-grow: 1"></div>', null, this.el);
			}
			else {
				el = mini.createElement(this.buttonTpl(button), null, this.el);
				mini.addListener(el, 'click', function() {
					this.fireEvent('select', {item: button});
				}, this);
			}
		}.bind(this));

	},

	getEl: function() {
		return this.el;
	},

	getEl: function() {
		return this.el;
	}

});
