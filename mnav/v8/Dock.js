'use strict';

mini.define('Dock', {

	events: ['select'],

	css: `
		.dock {
			display: flex;
			position: absolute;
			flex-direction: column;
			top: 0px;
			width: 67px;
			bottom: 0px;
			background: #4f9cd0;
			xbackground-color: rgba(62, 142, 196, .8);
			background-color: rgba(0,0,0, .2);
			background-color: #609345;
			transition: transform .2s ease-out;
			xborder-top-right-radius: 8px;
			xborder-bottom-right-radius: 8px;
			xborder-radius: 8px;
			box-shadow: 0 0 10px rgba(0,0,0,.3);
		}

		.dock.left-position {
			left: -80px;
		}
		.dock.right-position {
			right: -80px;
			left: inherit;
			background-color: #707070;
		}

		.dock.left-position.show {
			transform: translate(80px, 0px);
		}
		.dock.right-position.show {
			right: 0;
		}

		.dock .dock-button {
			text-align: center;
			color: #fff;
			width: 100%;
			height: 70px;
			font-size: 12px;
		}

		.dock .dock-button .title {
			margin-top: 3px;
		}

		.dock .dock-button:first-child {
			margin-top: 30px;
		}

		.left-shift {
			transform: scale(.75) translate(45px, -30px);
			border-radius: 10px;
		}
		.right-shift {
			left: -80px !important;
		}

		.dock-button svg {
			width: 32px;
			height: 32px;
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

		this.position = config.position;
		this.shiftEl = config.shiftEl;

		this.el = mini.createElement(this.tpl, this, document.body);

		if (this.position === 'left') {
			mini.addClass(this.el, 'left-position');
		}
		if (this.position === 'right') {
			mini.addClass(this.el, 'right-position');
		}

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

	show: function() {
		mini.addClass(this.el, 'show');
		mini.addClass(this.shiftEl, this.position + '-shift');
	},

	hide: function() {
		mini.removeClass(this.el, 'show');
		mini.removeClass(this.shiftEl, this.position + '-shift');
	},

	getEl: function() {
		return this.el;
	}

});
