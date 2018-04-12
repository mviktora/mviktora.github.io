'use strict';

var mini = (function () {

	function define(className, prototype) {
		var
			scope = window;

		scope[className] = function(config) {

			this.addListener = function(obj, eventName, callback, scope) {
				addListener(obj, eventName, callback, scope);
			}

			this.fireEvent = function(eventName, eventData) {
				this._eventHelperEl.dispatchEvent(new CustomEvent(eventName, {detail: eventData}));
			}

			this.registerEl = function(el) {
			}

			this.register = function(obj) {
			}

			if (prototype.events) {
				this._eventHelperEl = document.createElement('DIV');
			}

			this.init.apply(this, arguments);
		};

		if (prototype.static) {
			var key;
			for (key in prototype.static) {
				scope[className][key] = prototype.static[key];
			}
			delete prototype.static;
		}
		scope[className].prototype = prototype;

		if (prototype.css) {
			addCSS(prototype.css);
		}

		if (prototype.resources) {
			prototype.resources.forEach(function(name) {
				if (!resources[name]) {
					loadResource(name);
				}
			});
		}
	}

	function createElement(html, obj, parent, insertFirst) {
		var
			el = document.createElement('div');

		if (parent && typeof parent === 'string') {
			parent = document.getElementById(parent);
		}

		el.innerHTML = html;

		if (el.children.length === 1) {
			el = el.children[0];
			el.remove();
		}
		if (obj) {
			ui(el, obj);
		}
		applyResources(el);
		if (parent) {
			if (insertFirst) {
				parent.insertBefore(el, parent.firstChild);
			}
			else {
				parent.appendChild(el);
			}
		}
		return el;
	}

	function ui(el, obj) {
		el.querySelectorAll('[ui]').forEach(function(el) {
			obj[el.getAttribute('ui')] = el;
		});
	}

	function applyResources(el) {
		var i, name,
			resourceElements = $(el).find('resource');

		for (i = 0; i < resourceElements.length; i++) {
			name = $(resourceElements[i]).attr('name');
			resourceElements[i].outerHTML = resources[name];
		}

	}

	function addCSS(rules) {
		var
			styleEl = document.getElementById('main-styles');

		if (!styleEl) {
			styleEl = document.createElement('style');
			styleEl.id = 'main-styles';
			document.head.appendChild(styleEl);
		}

		styleEl.sheet.insertRule(`@media all { ${rules} }`, 0);
	}

	function loadResource(name) {
		$.ajax({url: '/resources/' + name, method: 'GET', dataType: 'xml'}).done(function(data) {
			resources[name] = data.getElementsByTagName('svg')[0].outerHTML;
		}.bind(this)).fail(function(error) {
			console(error);
		});
	}

	function addClass(el, cls) {
		el.classList.add(cls);
	}

	function removeClass(el, cls) {
		el.classList.remove(cls);
	}

	function addListenerMain(obj, eventName, callback, scope) {
		if (!(obj instanceof Element)) {
			obj = obj._eventHelperEl;
		}
		obj.addEventListener(eventName, function(event) {
			var
				key;
			if (event.detail) {
				for (var key in event.detail) {
					if (event.detail.hasOwnProperty(key)) {
						event[key] = event.detail[key];
					}
				}
			}
			callback.call(scope, event);
		});
	}

	function addListener(obj, eventName, callback, scope) {
		var
			events, key;
		if (typeof eventName === 'string') {
			addListenerMain(obj, eventName, callback, scope);
		}
		else {
			events = eventName;
			for (key in events) {
				if (events.hasOwnProperty(key) && key !== 'scope') {
					addListenerMain(obj, key, eventName[key], events.scope);
				}
			}
		}
	}

	function css(el, styles) {
		var
			key;
		for (var key in styles) {
			if (styles.hasOwnProperty(key)) {
				el.style[key] = styles[key];
			}
		}
	}

	function html(el, html) {
		el.innerHTML = html;
	}

	return {
		define: define,
		createElement, createElement,
		ui: ui,
		addClass: addClass,
		removeClass: removeClass,
		addListener: addListener,
		css: css,
		html: html
	};

}());
