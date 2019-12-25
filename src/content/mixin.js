export const actionMixin = {
  data () {
    return {
    }
  },
  methods: {
    // 滚动
    G_totop () {
      if (document.body.scrollTop != 0 || document.documentElement.scrollTop != 0) {
        window.scrollTo({top: 0, behavior: 'smooth'})
      }
    },
    G_tobottom () {
      window.scrollTo({top: document.body.offsetHeight, behavior: 'smooth'})
    },
    // 导航
    G_back () {
      history.back()
    },
    G_forward () {
      history.forward()
    },
    G_goparent () {
      if (location.hash) {
        location.href = location.pathname + (location.search ? '?' + location.search : '');
      } else {
        var paths = location.pathname.split('/');
        var path = paths.pop();
        if (!location.search && path === '') paths.pop();
        location.href = paths.join('/') + '/';
      }
    },
    G_homePage () {
      location.href = location.origin
    },
    G_stop () {
      window.stop()
    },
    // 加载
    G_reload () {
      location.reload()
    },
    G_reloadClear () {
      location.reload(true)
    },
    // 标签页导航
    G_baiduTab () {
      chrome.runtime.sendMessage({action: 'G_baiduTab'}, (res) => {
        console.log(res)
      })
    },
    G_googleTab () {
      chrome.runtime.sendMessage({action: 'G_googleTab'}, (res) => {
        console.log(res)
      })
    },
    G_leftTab () {
      chrome.runtime.sendMessage({action: 'G_leftTab'}, (res) => {
        console.log(res)
      })
    },
    G_rightTab () {
      console.log(`G_rightTab`)
      chrome.runtime.sendMessage({action: 'G_rightTab'}, (res) => {
        console.log(res)
      })
    },
    G_firstTab () {
      console.log(`G_firstTab`)
      chrome.runtime.sendMessage({action: 'G_firstTab'}, (res) => {
        console.log(res)
      })      
    },
    G_lastTab () {
      console.log(`G_lastTab`)
      chrome.runtime.sendMessage({action: 'G_lastTab'}, (res) => {
        console.log(res)
      })
    },
    G_closeTab () {
      chrome.runtime.sendMessage({action: 'G_closeTab'}, (res) => {
        console.log(res)
      })
    },
    G_bookmark () {
      chrome.runtime.sendMessage({action: 'G_bookmark'}, (res) => {
        console.log(res)
      })
    }
  }
}

export const canvasMixin = {
  data () {
    return {
      actionIcon: {
        U: 'assets/up.png',
        D: 'assets/down.png',
        L: 'assets/left.png',
        R: 'assets/right.png'
      },
      isEdit: false,
      tempCanvas: null,
      instructionSet: [],
      lineWidth: 5,
      fillStyle: 'red',
      isShowPath: true,
      TOLERANCE: 10, // 生成指令的阈值
      isMouseDown: false,
      ctx: null,
      lastX: null,
      lastY: null
    }
  },
  methods: {
    _windowToCanvas (canvas, clientX, clientY) {
      const bbox = canvas.getBoundingClientRect()
      const position = {
        x: clientX - bbox.left * (canvas.width / bbox.width),
        y: clientY - bbox.top * (canvas.height / bbox.height)
      }
      return position
    },
    // 事件监听
    handleMouseDown (e) {
      let tempCanvas, ctx
      // 右键处理
      const isRightClick = (e.which === 3)
      if (isRightClick) {     
        if (this.tempCanvas) {
          try {
            document.body.removeChild(this.tempCanvas)
            tempCanvas = null
          } catch (e) {
            console.log(e)
          }
        }
        document.oncontextmenu = () => true
        const selectedText = window.getSelection().toString()
        if (selectedText) {
          return
        }
    
        // 初始化画布
        tempCanvas = this.tempCanvas = document.createElement('canvas')
        ctx = this.ctx = tempCanvas.getContext('2d')
        tempCanvas.width = Math.max(document.documentElement.scrollWidth, window.innerWidth)
        tempCanvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight)
        tempCanvas.style = 'position: fixed; left: 0; right: 0; top: 0; bottom: 0;'
        document.body.appendChild(tempCanvas)
    
        const canvasMouse = this._windowToCanvas(tempCanvas, e.clientX, e.clientY)
        this.lastX = canvasMouse.x
        this.lastY = canvasMouse.y
        this.isMouseDown = true
        
        this.isShowPath && ctx.moveTo(this.lastX, this.lastY)
      }
    },
    handleMouseMove (e) {
      if (this.isMouseDown && !this.isEdit) {
        let tempCanvas, ctx, direction, canvasMouse, curX, curY, dx, dy, lastDirection
        tempCanvas = this.tempCanvas
        ctx = this.ctx

        // 画线处理
        canvasMouse = this._windowToCanvas(tempCanvas, e.clientX, e.clientY)
        curX = canvasMouse.x
        curY = canvasMouse.y
        if (this.isShowPath) {
          ctx.lineTo(curX, curY)
          ctx.lineWidth = this.lineWidth
          ctx.strokeStyle = this.fillStyle
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.stroke()
        }
        // 方向记录
        dx = Math.abs(curX - this.lastX)
        dy = Math.abs(curY - this.lastY)
        if (dx < this.TOLERANCE && dy < this.TOLERANCE) {
          return
        } else {
          if (dx > dy) {
            direction = curX > this.lastX ? 'R' : 'L'
          } else {
            direction = curY > this.lastY ? 'D' : 'U'
          }
        }
        lastDirection = this.instructionSet[this.instructionSet.length -1]
        if (lastDirection !== direction) {
          this.instructionSet.push(direction)
        }
        this.lastX = curX
        this.lastY = curY
      }
    },
    handleMouseUp (e, isOption = false) {
      if (!isOption) {
        (this.instructionSet.length !== 0) && this._performAction(e)
      }
      this.isMouseDown = false
      if (this.tempCanvas) {
        try {
          document.body.removeChild(this.tempCanvas)
          this.tempCanvas = null
          document.body.addEventListener('contextmenu',function(e){
            e.returnValue = false
          })
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
}

export const gestureMixin = {
  data () {
    return {
      gestureOptions: [{
        label: '滚动',
        options: [{
          value: 'G_totop',
          label: '回到顶部'
        }, {
          value: 'G_tobottom',
          label: '直达底部'
        }]
      }, {
        label: '导航',
        options: [{
          value: 'G_back',
          label: '后退'
        }, {
          value: 'G_forward',
          label: '前进'
        }, {
          value: 'G_goparent',
          label: '返回上一级目录'
        }, {
          value: 'G_homePage',
          label: '网站主页'
        }, {
          value: 'G_stop',
          label: '停止加载'
        }]
      }, {
        label: '加载',
        options: [{
          value: 'G_reload',
          label: '刷新'
        }, {
          value: 'G_reloadClear',
          label: '强制刷新(无缓存)'
        }]
      }, {
        label: '标签页导航',
        options: [{
          value: 'G_baiduTab',
          label: '新增百度标签页'
        }, {
          value: 'G_googleTab',
          label: '当前页打开google'
        }, {
          value: 'G_leftTab',
          label: '左侧标签页'
        }, {
          value: 'G_rightTab',
          label: '右侧标签页'
        }, {
          value: 'G_firstTab',
          label: '首标签页'
        }, {
          value: 'G_lastTab',
          label: '尾标签页'
        }, {
          value: 'G_closeTab',
          label: '关闭当前标签'
        }]
      }, {
        label: '其他',
        options: [{
          value: 'G_bookmark',
          label: '添加书签'
        }]
      }]
    }
  }
}