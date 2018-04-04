'use strict';

var main = (function () {

	var
		list,
		parentEl,
		totals = {
			open: 0, overdue: 0, duetoday: 0, finished: 0
		},
		view = {};

	function init() {
		list = tasks.all();

		parentEl = $('#summary-table')[0];

		addHeader();

		list.forEach(function(item) {

				view[item.pageId] = {};

				addPage(
					item.pageId,
					item.pageName,
					item.openCount,
					item.overdueCount,
					item.dueNowCount,
					item.finishedCount,
					item.assignedCount,
					item.unassignedCount
				);
		});

		var
			totalEls = $('.legend .value');

		$(totalEls[0]).html(totals.open || '-');
		$(totalEls[1]).html(totals.overdue || '-');
		$(totalEls[2]).html(totals.duetoday || '-');
		$(totalEls[3]).html(totals.finished || '-');
	}

	function classForValue(value) {
		return value ? '' : 'empty';
	}

	function selectCountEl(countEl) {
		if ($(countEl).find('.value').hasClass('empty')) {
			return;
		}

		if ($(countEl).hasClass('selected')) {
			$(countEl).siblings('div').removeClass('selected');
		}
		else {
			$(countEl).siblings('div').removeClass('selected');
			$(countEl).addClass('selected');
		}
	}

	function addHeader() {
		$(parentEl).append(`
			<div class="summary-caption">Team Tasks</div>
			<div class="legend">
				<div class="legent-text">Open</div><div class="count" column="open"><div class="value status-open-bg"></div></div>
				<div class="legent-text">Overdue</div><div class="count" column="overdue"><div class="value status-overdue-bg"></div></div>
				<div class="legent-text">Due Today</div><div class="count" column="duetoday"><div class="value status-duetoday-bg"></div></div>
				<div class="legent-text">Finished Recently</div><div class="count" column="finished"><div class="value status-finished-bg"></div></div>
			</div>
		`);

		$('.legend').find('.count').each(function(index, columnEl) {
			$(columnEl).click(function() {
				var
					column = $(columnEl).attr('column');
				list.forEach(function(item) {
					selectCountEl($(view[item.pageId].el).find(`.count[column='${column}']`)[0]);
					showPageTasks(column, item.pageId);
				});
			});
		});
	}

	function addPage(pageId, pageName, openCount, overdueCount, dueNowCount, finishedCount, assignedCount, unassignedCount) {
		var
			itemEl;

		totals.open += openCount;
		totals.overdue += overdueCount;
		totals.duenow += dueNowCount;
		totals.finished += finishedCount;

		$(parentEl).append(`
			<div class="summary-item desktop" id="page-${pageId}">
				<div class="row">
					<div class="page-name">
						<div class="page-icon"><img src="page.png" style="zoom:50%"></div>
						<div class="name">${pageName}</div>
					</div>
					<div class="page-item">
						<div column="open" class="count">
							<div class="status-open-bg value ${classForValue(openCount)}">${openCount ? openCount : '-'}</div>
						</div>
						<div column="overdue" class="count">
							<div class="status-overdue-bg value ${classForValue(overdueCount)}">${overdueCount ? overdueCount : '-'}</div>
						</div>
						<div column="duetoday" class="count">
							<div class="status-duetoday-bg value ${classForValue(dueNowCount)}">${dueNowCount ? dueNowCount : '-'}</div>
						</div>
						<div column="finished" class="count">
							<div class="status-finished-bg value ${classForValue(finishedCount)}">${finishedCount ? finishedCount : '-'}</div>
						</div>
					</div>
				</div>
				<div class="page-tasks"></div>
			</div>
		`);

		itemEl = $('#page-' + pageId)[0];

		view[pageId] = {
			expandedColumn: '',
			el: itemEl,
			tasksEl: $('#page-' + pageId + '> .page-tasks')[0]
		};

		$(itemEl).find('.count').each(function(index, el) {
			$(el).click(function() {
				selectCountEl(el);
				showPageTasks($(el).attr('column'), pageId);
			});
		});

	}

	function showPageTasks(column, pageId) {
		var
			pageTasks = tasks.page(pageId, column);

		if (view[pageId].expandedColumn === column) {
			$(view[pageId].el).removeClass('expanded');
			view[pageId].expandedColumn = '';
			return;
		}

		view[pageId].expandedColumn = column;

		$(view[pageId].el).addClass('expanded');

		$(view[pageId].tasksEl).html('');

		pageTasks.forEach(function(task) {

			$(view[pageId].tasksEl).append(`
				<div class="task-item">
					<div class="task">
						<div class="task-progress"><div>${task.progress || ''}</div></div>
						<div style="margin-left: 7px">${task.name}</div>
					</div>
					<div class="task-desc">
						${task.description || ''}
					</div>
				</div>
			`);

		});

	}

	return {
		init: init
	};

}());
