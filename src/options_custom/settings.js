window.addEvent("domready", function () {
    const build_menu = () => {
      chrome.storage.sync.get("Prrr", function(items){
        console.log(items)
        const {Prrr} = items
        if (!items.Prrr) {
          return chrome.storage.sync.set({"Prrr": {"Fundbox/backend": [""]}}, build_menu)
        }
        console.log({Prrr})
        const settings = new FancySettings("Prrr", "icon.png");
        window.temp = settings
        const store = new Store("settings")
        for (repo in Prrr) {
          for (let i=0; i <= Prrr[repo].length; i++) {
            let reviewer, element, name
            if (i < Prrr[repo].length) {
              reviewer = Prrr[repo][i]
              name =`reviewer${(i+1)}`
              store.set(name, reviewer)
              element = settings.create({
                name,
                "tab": repo,
                "type": "text",
              })
            } else {
              reviewer = ""
              element = settings.create({
                "tab": repo,
                "type": "text",
                "text": "Insert new user"
              })
            }
            element.element.addEvent("change", function(e,v){
              if (i==Prrr[repo].length) Prrr[repo].push({})
              if (this.value=="") {
                Prrr[repo].splice(i, 1)
                this.destroy()
              } else {
                Prrr[repo][i] = this.value
              }
              chrome.storage.sync.set({Prrr}, () => {
                if (i==Prrr[repo].length) Prrr[repo].push({})
                document.querySelector('.tab.active').destroy()
                build_menu()
              })
            })
          }
        }
      }); 
    }
    document.querySelector('#new_repo_add').addEvent('click', () => {
      chrome.storage.sync.get("Prrr", function(items){
        const {Prrr} = items
        const value = document.querySelector('#new_repo_name').value
        if (value != "") Prrr[value] = []
        chrome.storage.sync.set({Prrr}, () => {
          document.querySelector('.tab.active').destroy()
          build_menu()
        })
      })
    })
    build_menu()
});
