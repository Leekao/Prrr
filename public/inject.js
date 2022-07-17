chrome.runtime.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
    chrome.storage.sync.get("Prrr", function(items){
      if (!items.Prrr) return
      const {Prrr} = items
      let foundRepo = false
      for (repo in Prrr) {
        if (document.title.endsWith(repo)) foundRepo = repo
      }
      if (!foundRepo) return
      console.log("Repo detected");
      const txtElem = $("#review-filter-field")
      const txtInput = document.getElementById("review-filter-field")
      let run_once_flag = false
      const event_focus = new Event('focus', { bubbles: true });
      const add_reviewers = (r) => {
        txtInput.value = r.shift()
        txtInput.dispatchEvent(event_focus)
        setTimeout(() => {
          const labels = document.querySelector('.js-issue-sidebar-form .select-menu-list .filterable-active').children
          visible_labels = [...labels].filter(v => {
            return !v.hidden
          })
          visible_labels.pop().click()
          if (r.length) add_reviewers(r)
          else {
            txtInput.value = ""
            txtInput.dispatchEvent(event_focus)
          }
        }, 5)
      }
      txtElem.click(e => {
        if (!run_once_flag) {
          console.log('adding reviewers')
          add_reviewers(Prrr[repo])
          run_once_flag = true
        }
      })
    })
  }
	}, 10);
});