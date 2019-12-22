export const actionMixin = {
  data () {
    return {
    }
  },
  methods: {
    G_totop () {
      $("body,html").animate({
        scrollTop: 0
      }, 500)
      // document.documentElement.scrollTop = document.body.scrollTop
    },
    G_tobottom () {
      $("body,html").animate({
        scrollTop: $(document).height(),
      }, 500)
    },
    G_back () {
      history.back()
    },
    G_forward () {
      history.forward()
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
      if (this.isMouseDown) {
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