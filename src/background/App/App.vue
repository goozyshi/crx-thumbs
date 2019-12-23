<template>
  <div>
    背景页
  </div>
</template>

<script>
export default {
  name: 'background',
  data () {
    return {
    }
  },
  mounted () {
    this.G_baiduTab()
  },
  methods: {
    G_baiduTab () {
      chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
          chrome.extension.getBackgroundPage().console.log('resp.type');
          console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
          if (request.greeting == "hello") {
              chrome.tabs.create({url: 'https://www.baidu.com'});
              sendResponse({farewell: "goodbye"});
          }
        }
      )
    }
  }
}
</script>
