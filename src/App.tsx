//@ts-nocheck

import React, { useEffect, useState } from 'react';
import './App.css';

const AddRepoComponent = ({setReload}) => {
  const [repoName, setRepoName] = useState("")
  const new_repo = () => {
    chrome.storage.sync.get("Prrr", ({Prrr}) => {
      if (repoName.length === 0) return
      Prrr[repoName] = []
      chrome.storage.sync.set({Prrr}, () => {
        setRepoName("")
        setReload(true)
      })
    })
  }
  return <div>
    <input
      value={repoName}
      onBlur={new_repo}
      onChange={e => setRepoName(e.target.value)}
      type="text"
      placeholder="new repo" />
  </div>
}

const RepoMember = ({name, member, setRepoMembers, index}) => {
  const [memberName, setMemberName] = useState(member)
  console.log("repo member",memberName,"rendering")
  const save_member_edit = () => {
    chrome.storage.sync.get("Prrr", ({Prrr}) => {
      if (memberName.length === 0) {
        Prrr[name].splice(index, 1)
      } else {
        Prrr[name][index] = memberName
      }
      chrome.storage.sync.set({Prrr}, () => {
        setRepoMembers(Prrr[name])
      })
    })
  }

  return <input 
    value={memberName} 
    onChange={(e) => setMemberName(e.target.value)}
    onBlur={save_member_edit}
    type="text"
    placeholder="Leave empty to remove"
  />
}

const RepoMembers = ({name, members}) => {
  const [newMemberName, setNewMemberName] = useState("")
  const [repoMembers, setRepoMembers] = useState(members)
  console.log("repo members rendering")
  const new_repo = () => {
    if (newMemberName.length === 0) return
    chrome.storage.sync.get("Prrr", ({Prrr}) => {
      Prrr[name].push(newMemberName)
      chrome.storage.sync.set({Prrr}, () => {
        setRepoMembers(Prrr[name])
        setNewMemberName("")
      })
    })
  }
  const member = (member_name: String, index) => {
    return <RepoMember 
      key = {`${name}_${index}`}
      name = {name}
      index = {index}
      member = {member_name}
      setRepoMembers = {setRepoMembers}
    />
  }
  return <div className="block_container member_list">
    {repoMembers.map(member)}
    <input 
      value={newMemberName} 
      onChange={(e) => setNewMemberName(e.target.value)}
      onBlur={new_repo}
      type="text"
      placeholder="Add new reviewers here"
    />
  </div>
}

const Repo = ({name, members, delete_repo}) => {
  const [open, setOpen] = useState(false)
  return <div className={`repo ${open && "open"}`}>
    <div
      onClick={e => setOpen(!open)}
      className="title"
      >
      {name}
      <div
        onClick={e => delete_repo(name)}
        className="delete"
        >Delete</div>
    </div>
    <RepoMembers
      name={name}
      members={members}
    />
  </div>
}


const RepoList = ({reloadFlag, setReload}) => {
  const [repoList, setRepoList] = useState({})
  const delete_repo = (name) => {
    chrome.storage.sync.get("Prrr", ({Prrr}) => {
      if (Prrr[name].length > 0){
        alert("not empty!")
        return
      } 
      delete Prrr[name]
      chrome.storage.sync.set({Prrr}, () => {
        setRepoList(Prrr)
      })
    })
  }
  useEffect(() => {
    console.log('reload triggered')
    chrome.storage.sync.get("Prrr", ({Prrr}) => {
      if (!Prrr) return chrome.storage.sync.set({"Prrr": {}}, () => setRepoList({"Prrr":{}}))
      else {
        setRepoList(Prrr)
      }
    })
  }, [reloadFlag])
  console.log({repoList})
  return <div className="repos">
    {Object.keys(repoList).map((repo) => {
      return <Repo delete_repo={delete_repo} key={repo} members={repoList[repo]} name={repo} />
    })}
  </div>
}

const App = () => {
  const [reloadFlag, setReload] = useState(false)
  useEffect(() => {
    if (reloadFlag) setReload(false)
  }, [reloadFlag])
  return (
    <div className="App">
      <div className="h2">Edit your repos:</div>
      <RepoList reloadFlag={reloadFlag} setReload={setReload} />
      <div className="h2">Or add a new one:</div>
      <AddRepoComponent setReload={setReload} />
    </div>
  );
}

export default App;
