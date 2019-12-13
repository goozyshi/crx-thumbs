export default function BrowserGesture() {
  this.TOLERANCE = 10 // 生成指令的阈值
  this.instructionSet = []
  this.isMouseDown = false
  this.temCanvas = null
  this.lineWidth = 3
  this.fillStyle = 'red'
  this.isShowPath = true

  this._init()
}

BrowserGesture.prototype = {
  _init: function() {
    this._bindEvent()
  },

  _bindEvent: function() {
    var self = this
    document.body.addEventListener('mousedown', function(e) {
      e.preventDefault()
      self._clickDownHandle(e)
    }, false)

    document.body.addEventListener('mousemove', function(e) {
      e.preventDefault()
      self._mouseMoveHandle(e)
    }, false)

    document.body.addEventListener('mouseup', function(e) {
      e.preventDefault()
      self._mouseUpHandle(e)
    }, false)
  },

  _clickDownHandle: function(e) {
    var temCanvas, ctx

    // 右键时
    if (e.which === 3) {
      if (this.temCanvas !== null) {
        try {
          document.body.removeChild(this.temCanvas)
          temCanvas = null
        } catch (e) {
          console.log(e)
        }
      }

      document.oncontextmenu = function() {
        return false }
      temCanvas = this.temCanvas = document.createElement('canvas')
      ctx = this.ctx = temCanvas.getContext('2d')
      temCanvas.width = Math.max(document.documentElement.scrollWidth, window.innerWidth);
      temCanvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      temCanvas.style = 'position: fixed; left: 0; right: 0; top: 0; bottom: 0;'
      document.body.appendChild(temCanvas)


      var canvasMouse = this._windowToCanvas(temCanvas, e.pageX, e.pageY)

      this.lastX = canvasMouse.x
      this.lastY = canvasMouse.y

      this.isMouseDown = true

      if (this.isShowPath) {
        ctx.moveTo(this.lastX, this.lastY)
      }
    }
  },

  _mouseMoveHandle: function(e) {
    var temCanvas, ctx, direction, canvasMouse, curX, curY, dx, dy, lastDirection

    if (this.isMouseDown) {
      temCanvas = this.temCanvas
      ctx = this.ctx

      canvasMouse = this._windowToCanvas(temCanvas, e.pageX, e.pageY)
      curX = canvasMouse.x
      curY = canvasMouse.y

      if (this.isShowPath) {
        ctx.lineTo(curX, curY)
        ctx.lineWidth = this.lineWidth
        ctx.strokeStyle = this.fillStyle
          // ctx.lineCap = 'round'
          // ctx.lineJoin = 'round'
        ctx.stroke()
      }

      dx = Math.abs(curX - this.lastX)
      dy = Math.abs(curY - this.lastY)

      if (dx < this.TOLERANCE && dy < this.TOLERANCE) return;


      if (dx > dy) {
        direction = curX > this.lastX ? 'R' : 'L'
      } else {
        direction = curY > this.lastY ? 'D' : 'U'
      }

      lastDirection = this.instructionSet[this.instructionSet.length - 1]

      if (lastDirection !== direction) {
        this.instructionSet.push(direction)
      }

      this.lastX = curX
      this.lastY = curY
    }
  },

  _mouseUpHandle: function(e) {
    if (this.instructionSet.length !== 0) {
      this._performAction(e)
    }
    this.isMouseDown = false
    this.instructionSet.length = 0

    if (this.temCanvas) {
      try {
        document.body.removeChild(this.temCanvas)
        this.temCanvas = null
      } catch (e) {
        console.log(e)
      }
    }
  },

  _performAction: function(e) {
    switch (this.instructionSet.join()) {
      case 'L':
        console.log('左');
        break;
      case 'R':
        console.log('右');
        break;
      case 'U':
        console.log('上');
        break;
      case 'D':
        console.log('下');
        break;
      default:
        {
          console.log('未指定该指令的执行操作：', this.instructionSet)
        }
    }
  },
  _windowToCanvas: function(canvas, x, y) {
    var bbox = canvas.getBoundingClientRect();

    return {
      x: x - bbox.left * (canvas.width / bbox.width),
      y: y - bbox.top * (canvas.height / bbox.height)
    }
  }
}
