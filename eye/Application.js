'use strict';

mini.define('Application', {

	css: `
		.view {
			position: absolute;left:0;top:0;right:0;bottom:0;
			overflow: hidden;
			display: flex;
		}

		.view > div {
			flex-grow: 1;
			position: relative;
		}

		.view > .left-panel {
			border-right: 1px solid #ccc;
		}

		.view > div > * {
			position: absolute;
		}

		.view .ball {
			position: absolute;
			width: 40px;
			height: 40px;
			border-radius: 50%;
			background: red;
			left: 50%;
			top: 50%;
		}

		.view .shape {
			position: absolute;
			display: block;
			width: 50%;
			heigh: 100%;
			max-width: 100%;
			overflow: hidden;
			margin-left: 40px;
		}

		.container {
		  margin: auto;
		  width: 80%;
		  background-color: transparent;
		}

		@keyframes ani-1 {
		  0% {
		    top: 20%;
		  }
		  50% {
		    top: 40%;
		  }
		  100% {
		    top: 20%;
		  }
		}

		@keyframes ani-2 {
		  0% {
		    top: 40%;
		  }
		  50% {
		    top: 20%;
		  }
		  100% {
		    top: 40%;
		  }
		}


	`,

	tpl: `
		<div class="view">
			<div ui="leftEl" class="left-panel"></div>
			<div ui="rightEl" class="right-panel"></div>
		</div>
	`,

	ballTpl: '<div class="ball"></div>',

	init: function(config) {

		this.el = mini.createElement(this.tpl, this, document.body);

		// this.lSpaheEl = mini.createElement(`<img class="shape" src="img/shape2b.jpg">`, this, this.leftEl);
		// mini.createElement(`<img class="shape" src="img/shape2a.jpg">`, this, this.rightEl);

		this.leftBallEl = mini.createElement(this.ballTpl, null, this.leftEl);
		this.rightBallEl = mini.createElement(this.ballTpl, null, this.rightEl);


		mini.css(this.leftBallEl, {
			//background: 'blue',
			animation: 'ani-1 20s infinite'
		});

		mini.css(this.rightBallEl, {
		 	animation: 'ani-1 20s infinite'
		});

		// mini.css(this.lSpaheEl, {
		// 	top: '50px',
		// 	left: '25px'
		// });


	}

});
