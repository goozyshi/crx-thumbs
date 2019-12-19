// 基于 https://github.com/JChehe/simple_browser_gesture
// 根据需要，作部分修改

export default function BrowserGesture ()  {
  // canvas设置
  this.tempCanvas = null
  this.lineWidth = 5
  this.fillStyle = 'red'
  this.isShowPath = true

  this.TOLERANCE = 10 // 生成指令的阈值
  this.instructionSet = []
  this.isMouseDown = false
  this._init()
}
var ARROW_ICON = {
  U: chrome.extension.getURL('up.png'),
  R: chrome.extension.getURL('right.png'),
  D: chrome.extension.getURL('down.png'),
  L: chrome.extension.getURL('left.png')
}
BrowserGesture.prototype = {
  // 获取点击位置
  _windowToCanvas: (canvas, clientX, clientY) =>  {
    const bbox = canvas.getBoundingClientRect()
    const position = {
      x: clientX - bbox.left * (canvas.width / bbox.width),
      y: clientY - bbox.top * (canvas.height / bbox.height)
    }
    return position
  },
  // 初始化
  _init: function () {
    this._bindEvent()
  }, 
  // 绑定鼠标事件
  _bindEvent: function () {
    document.body.addEventListener('mousedown', (e) => {
      this.handleMouseDown(e)
    }, false)
    document.body.addEventListener('mousemove', (e) => {
      this.handleMouseMove(e)
    }, false)
    document.body.addEventListener('mouseup', (e) => {
      this.handleMouseUp(e)
    }, false)
  },
  // 事件监听
  handleMouseDown: function (e) {
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
  handleMouseMove: function (e) {
    let tempCanvas, ctx, direction, canvasMouse, curX, curY, dx, dy, lastDirection

    if (this.isMouseDown) {
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
        var img = document.createElement('img');
        img.src = ARROW_ICON[direction];
        img.style = "background: '#072'"
        this.tempCanvas.appendChild(img);
      }
      this.lastX = curX
      this.lastY = curY
    }
  },
  handleMouseUp: function (e) {
    (this.instructionSet.length !== 0) && this._performAction(e)
    this.isMouseDown = false
    this.instructionSet = []
    
    if (this.tempCanvas) {
      try {
        document.body.removeChild(this.tempCanvas)
        this.tempCanvas = null
      } catch (e) {
        console.log(e)
      }
    }
  },
  // 指令事件绑定
  _performAction: function (e) {
    const gesture  = this.instructionSet.join("")
    console.log(gesture)
    let _action = true
    switch (gesture) {
      case 'L':
        this._ACTION.chrome_toback()
        break;
      case 'R':
        this._ACTION.chrome_forward()
        break;
      case 'U':
        this._ACTION.chrome_totop()
        break;
      case 'D':
        this._ACTION.chrome_tobottom()
        break;
      case 'DR':
        this._ACTION.chrome_close()
        break;
      default: {
        _action = false
        console.log(`未定义的指令执行操作:${this.instructionSet}`)
      }
    }
    if(_action){
      document.body.addEventListener("contextmenu",function(e){
        e.returnValue = false
      })
    }
  }
}