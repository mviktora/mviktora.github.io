var tasks = (function() {
  var
    pages = {},
    list = [],
    page,
    dayms = (24 * 1000 * 3600),
    now = Date.now() / dayms,
    x = finished2.result.tasks.concat(unfinished2.result.tasks);

  x.forEach(function(item) {
    // Filter out too old tasks -- more than 7 days old
    if (item.progress === 100 && now - item.lastUpdatedTime / dayms > 15) {
      return;
    }

	  if (!pages[item.pageId]) {
    	pages[item.pageId] = {
        tasks: [],
  			pageName: item.pageName,
        pageId: item.pageId,
        p0: 0,
        p25: 0,
        p50: 0,
        p75: 0,
        p100: 0,
        openCount: 0,
        unassignedCount: 0,
        assignedCount: 0,
        overdueCount: 0,
        dueNowCount: 0,
        finishedCount: 0,
        dueIn: 0
      };
  	}

    page = pages[item.pageId];
    pages[item.pageId].tasks.push(item);

    if (item.progress < 100) {
      page.openCount++;
      if (item.assignees.length) {
        pages[item.pageId].assignedCount++;
      }
      else {
        pages[item.pageId].unassignedCount++;
      }
      pages[item.pageId]['p'+item.progress]++;
      if (item.dueDate) {
        item.dueIn = Math.floor(item.dueDate / dayms - now);
        if (item.dueIn < 0) {
          pages[item.pageId].overdueCount++;
        }
        else if (item.dueIn === 1) {
          pages[item.pageId].dueNowCount++;
        }
      }
    }
    else {
      page.finishedCount++;
    }
  });

  for (var key in pages) {
    list.push(pages[key]);
  }

  return {
    all: function() {
      return list;
    },
    page: function(pageId, type) {
      var
        tasks = list.find(function(item) {
          return pageId === item.pageId;
        }).tasks;

      if (type === 'open') {
        return tasks.filter(function(task) {
          return task.progress < 100;
        });
      }
      else if (type === 'overdue') {
        return tasks.filter(function(task) {
          return task.progress < 100 && task.dueIn < 0;
        });
      }
      else if (type === 'duetoday') {
        return tasks.filter(function(task) {
          return task.progress < 100 && task.dueIn <= 1 && task.dueIn >= 0;
        });
      }
      else if (type === 'assigned') {
        return tasks.filter(function(task) {
          return task.progress < 100 && task.assignees.length > 0;
        });
      }
      else if (type === 'unassigned') {
        return tasks.filter(function(task) {
          return task.progress < 100 && task.assignees.length === 0;
        });
      }
      else if (type === 'finished') {
        return tasks.filter(function(task) {
          return task.progress === 100 && now - task.lastUpdatedTime / dayms <= 15;
        });
      }

      return [];
    }
  };



})();
