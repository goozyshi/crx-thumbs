<template>
  <div>
    背景页
  </div>
</template>

<script>
export default {
  name: 'background',
  mounted () {
    const that = this
    chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
      console.log('sender', sender)
      if(message.action){
        that[message.action](sender)
        sendResponse(`done with ${message.action}`)
      }
    })
  },
  methods: {
    G_baiduTab (sender) {
      chrome.tabs.create({url: 'https://www.baidu.com'})
    },
    G_googleTab (sender) {
      let tabId = sender.tab.id
      chrome.tabs.update(tabId, {url: 'http://www.google.com'});
    },
    G_leftTab (sender) {
      let tabId = sender.tab.id,
          tabIndex = sender.tab.index
      chrome.tabs.query({currentWindow: true}, (tabs) => {
        const totalTabLength = tabs.length
        chrome.tabs.query({index: (tabIndex - 1) % totalTabLength}, (tabs) => {
          if (tabs.length) {
            let willActivateId = tabs[0].id
            chrome.tabs.update(willActivateId, {active: true});
          }
        })
      })
    },
    G_rightTab (sender) {
      let tabId = sender.tab.id,
          tabIndex = sender.tab.index
      chrome.tabs.query({currentWindow: true}, (tabs) => {
        const totalTabLength = tabs.length
        chrome.tabs.query({index: (tabIndex + 1) % totalTabLength}, (tabs) => {
          if (tabs.length) {
            let willActivateId = tabs[0].id
            chrome.tabs.update(willActivateId, {active: true});
          }
        })
      })
    },
    G_firstTab () {
      chrome.tabs.query({index: 0}, (tabs) => {
        if (tabs.length) {
          let willActivateId = tabs[0].id
          chrome.tabs.update(willActivateId, {active: true});
        }
      })
    },
    G_lastTab () {
      chrome.tabs.query({currentWindow: true}, (tabs) => {
        const totalTabLength = tabs.length
        chrome.tabs.query({index: totalTabLength -1 }, (tabs) => {
          if (tabs.length) {
            let willActivateId = tabs[0].id
            chrome.tabs.update(willActivateId, {active: true});
          }
        })
      })
    },
    G_closeTab (sender) {
      let tabId = sender.tab.id
      chrome.tabs.remove(tabId)
    },
    G_bookmark (sender) {
      // 只加不移谢谢
      chrome.bookmarks.create({
        parentId: '1',
        index: 0,
        title: sender.tab.title,
        url: sender.tab.url,
      }, (bookmark) => {
        this.bookmarkId = bookmark.id
      })
    }
  }
}
</script>
