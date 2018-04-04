'use strict';

var main = (function () {

	var
		history = [],
		orgImages = ['Tasks', 'Calendar', 'Inbox', 'Teams', 'Search', 'Settings'],
		teamImages = ['Pages', 'Chat', 'Tasks', 'Calendar', 'Files', 'Page', 'Settings'],
		currentTeam = 'Everyone',
		on = false,
		firstTime = 1,
		contextMenuOn = false;

	function init() {

		addMenuItem('#org-items', 'Inbox', images.inbox, onOrgItemsSelection)
		addMenuItem('#org-items', 'Teams', images.teams, onOrgItemsSelection)
		addMenuItem('#org-items', 'Tasks', images.task, onOrgItemsSelection)
		addMenuItem('#org-items', 'Calendar', images.calendar, onOrgItemsSelection)
		addMenuItem('#org-items', 'Search', images.search, onOrgItemsSelection);

		addMenuItem('#team-items', 'Pages', images.pages, onTeamTab);
		addMenuItem('#team-items', 'Chat', images.chat, onTeamTab);
		addMenuItem('#team-items', 'Tasks', images.task, onTeamTab);
		addMenuItem('#team-items', 'Calendar', images.calendar, onTeamTab);
		addMenuItem('#team-items', 'Files', images.files, onTeamTab);

		addSettings('org');
		addSettings('team');

		$('#nav-more-button').html(images.more);
		$('#nav-button').html('@');
		$('#back-button').html(images.back);

		initImages('org', orgImages);
		initImages('team', teamImages);
		initImages('user', ['Chat']);

		addOrg('#org-selector', '3cf0d79a7817f0ebb73cff0dfa3528e67b01f941');
		addOrg('#org-selector', '96f3e48aca9b1dae12140439c63717cac7741b49');
		addOrg('#org-selector', '5f3d8bd9a3f8a175899ba5a6c423e29a1411b224');
		addOrg('#org-selector', '1bf1f2de6d0cebba757f346b567c0307651686fb');

		users.result.fullMembers.forEach(function(user) {
			if (user.enabled) {
				addUser('#org-users', user);
			}
		});

		addUser('#team-members', findUser('fa204227aad932d98d6d140fd0a9a3a3be16518a'));
		addUser('#team-members', findUser('45667677b034e232ce4d1b15fb22f2de804b20e5'));
		addUser('#team-members', findUser('1554e36ec91698534373e42a708b87bb0cee17f4'));

		addUser('#fav-users', findUser('1554e36ec91698534373e42a708b87bb0cee17f4'));
		addUser('#fav-users', findUserByName('Markéta'));
		addUser('#fav-users', findUserByName('Jiří Praus'));
		addUser('#fav-users', findUserByName('Jiří Nohavec'));

		$('#nav-button').on('click', function() {
			if (on) {
				hideHomeScreen();
			}
			else {
				showHomeScreen();
			}
		});

		$('#back-button').on('touchend', function() {
			if (history.length < 2) {
				return
			};
			history.pop();
			var
				lastItem = history.pop();
			navigateTo(lastItem.section, lastItem.title);
		});

		$('#nav-more-button').on('touchend', function() {
			$('#context-menu').addClass('show-context-menu');
			contextMenuOn = !contextMenuOn;
		});

		$('#context-menu').on('touchend', function() {
			$('#context-menu').removeClass('show-context-menu');
		});

		$('#pinned-pages').on('click', function() {
			navigateTo('team', 'Page');
		});

		$('#horizvert').on('click', function() {
			$('#app-frame').toggleClass('vertical');
		});

		navigateTo('team', 'Page');

		//setScrollPos();
	}

	function showHomeScreen() {
		on = true;
		$('#app-frame').addClass('show-menu');
		if (firstTime) {
			firstTime = 0;
			setScrollPos();
		}
	}

	function hideHomeScreen() {
		on = false;
		$('#app-frame').removeClass('show-menu');
	}

	function addSettings(section) {
		$(`#nav-menu-${section} .settings`).html(images.more16px).on('click', function() {
			navigateTo(section, 'Settings');
		});
	}

	function addMenuItem(parentEl, title, icon, handler) {
		var
			el = $(`<div>
				<div class="menu-item-icon">${icon}</div>
				<div class="label">${title}</div>
			</div>
		`).on('click', function() {
			handler(title);
		});
		$(parentEl).append(el);
	}

	function navigateTo(section, title) {
		history.push({
			section: section,
			title: title
		});
		setBackButtonState();
		setMoreButtonState(section, title);
		hideHomeScreen();
		if (section === 'org') {
			setOrgHeading('Samepage labs', title)
			setContent('org', title);
		}
		else if (section === 'team'){
			setTeamHeading('Customer Support Team', title)
			setContent('team', title);
		}
		else if (section === 'user') {
			setOrgHeading('Samepage labs', title)
			setContent('user', 'Chat');
		}
	}

	function onOrgItemsSelection(title) {
		navigateTo('org', title);
	}

	function onTeamTab(title) {
		navigateTo('team', title);
	}

	function setTeamHeading(teamName, teamItem) {
		$('#heading').html(`
			<div class="heading-team">
				<div style="display: inline-block">
					<div class="team-name">
						<div class="team-avatar team-avatar-small">${teamName[0]}</div>
						<div>${teamName}</div>
						</div>
				</div>
				<div class="team-item">${teamItem}</div>
			</div>
		`);
	}

	function setOrgHeading(orgName, itemName) {
		$('#heading').html(`
			<div class="heading-team">
				<div style="display: inline-block">
					<div class="team-name">
						<img src="logo.png" class="tiny-logo">
						<div>${orgName}</div>
					</div>
				</div>
				<div class="team-item">${itemName}</div>
			</div>
		`);
	}

	function setContent(section, title) {
		$('#content > img').removeClass('show-image');
		$(`#${section}-${title}`).addClass('show-image');
	}

	function initImages(section, images) {
		images.forEach(function(name) {
			$('#content').append(`<img id="${section}-${name}" src="img/${section}/${name}.png" />`);
		});
	}

	function addUser(parentEl, user) {
		var el = $(`<img style="min-width: 36px; height: 36px; border-radius: 50%; background: #f0f0f0;margin-right:7px;border: 1px solid #fafafa"
				src="https://samepage.io/api/app/rest/userpicture/user-${user.guid}-large.png"/>
		`).on('click', function() {
			navigateTo('user', user.fullName);
		});
		$(parentEl).append(el);
	}

	function addOrg(parentEl, orgId) {
		var el = $(`<img style="min-width: 36px; height: 36px; border-radius: 50%; background: #f0f0f0;margin-right:7px;border: 1px solid #fafafa"
				src="https://samepage.io/api/app/rest/companypicture/${orgId}-small.png"/>
		`).on('click', function() {
			navigateTo('user', user.fullName);
		});
		$(parentEl).append(el);
	}

	function setBackButtonState() {
		if (history.length < 2) {
			$('#back-button').addClass('disabled');
		}
		else {
			$('#back-button').removeClass('disabled');
		}
	}

	function setMoreButtonState(section, title) {
		if (title === 'Settings') {
			$('#nav-more-button').css({visibility: 'hidden'});
		}
		else {
			$('#nav-more-button').css({visibility: 'visible'});
		}
	}

	function findUser(guid) {
		return users.result.fullMembers.find(function(user) {
			return user.guid === guid;
		});
	}

	function findUserByName(fullName) {
		return users.result.fullMembers.find(function(user) {
			return user.fullName.indexOf(fullName) !== -1;
		});
	}

	function setScrollPos() {
		var
			x = $('#main-section').height() - $('#app-frame').height() + 120;
		$('#overlay')[0].scrollTop = x;
	}

	return {
		init: init
	};

}());
