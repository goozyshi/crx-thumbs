export const actionMixin = {
  data () {
    return {
      gestureActionSets: {
        'L': {
          name: '',
          act: 'chrome_totop'
        }
      },
      action: {
        chrome_totop: () => {
          $("body,html").animate({
            scrollTop: 0
          }, 500)
        },
        chrome_tobottom: () => {
          $("body,html").animate({
            scrollTop: $(document).height(),
          }, 500)
        },
        chrome_toback: () => {
          history.back()
        },
        chrome_forward: () => {
          history.forward()
        },
        chrome_close: () => {
          // window.location.href="about:blank"; //有一定概率打开这个空白页面后并没有关闭
          // window.close(); 使用下面的方法，可以解决上述bug
          chrome.extension.sendRequest({action:"close"}, d => {
            console.log("close.back:",d);
          })
        }
      }
    }
  }
}