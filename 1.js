import { baseURL, POSTDATA } from "@/js/request";

export const mixins =  {

data () { 
    return {
        element: null,
        canvas: null,
        canvasDiv:null,
        container: null,
        canvasHeight:null,
        data:[{
            type: 'circle',
            fillStyle: 'pink',
            x: 400,
            y: 300,
            r: 50
          },
          {
            type: 'rect',
            fillStyle: "#0f00ff",
            data: [350, 400, 100, 100]
          }
        ],
      myCanvas: null,
      ctx: null,
      baseURL:baseURL,

       filesJson:[{
        "Index": 419,
        "Column": 16,
        "Row": 13,
        "FiledState": "Scanned",
        "PlatFormPositionX": 64320,
        "PlatFormPositionY": 28564,
        "HasColorImage": true,
        "HasGrayImage": false,
        "ImageWidth": 2448.0,
        "ImageHeight": 2048.0,
        "CImageOverViewPositionX": 35281,
        "CImageOverViewPositionY": 23643,
        "HasScaned": true,
        "ImageName": "F001A3C.jpg",
        "FieldOffsetX": 0.0,
        "FieldOffsetY": 0.0
      },
      {
        "Index": 420,
        "Column": 17,
        "Row": 13,
        "FiledState": "Scanned",
        "PlatFormPositionX": 64914,
        "PlatFormPositionY": 28564,
        "HasColorImage": true,
        "HasGrayImage": false,
        "ImageWidth": 2448.0,
        "ImageHeight": 2048.0,
        "CImageOverViewPositionX": 37489,
        "CImageOverViewPositionY": 23638,
        "HasScaned": true,
        "ImageName": "F001A4C.jpg",
        "FieldOffsetX": 0.0,
        "FieldOffsetY": 0.0
      },
      {
        "Index": 421,
        "Column": 18,
        "Row": 13,
        "FiledState": "Scanned",
        "PlatFormPositionX": 65508,
        "PlatFormPositionY": 28564,
        "HasColorImage": true,
        "HasGrayImage": false,
        "ImageWidth": 2448.0,
        "ImageHeight": 2048.0,
        "CImageOverViewPositionX": 39682,
        "CImageOverViewPositionY": 23634,
        "HasScaned": true,
        "ImageName": "F001A5C.jpg",
        "FieldOffsetX": 0.0,
        "FieldOffsetY": 0.0
      },
      {
        "Index": 422,
        "Column": 19,
        "Row": 13,
        "FiledState": "Scanned",
        "PlatFormPositionX": 66102,
        "PlatFormPositionY": 28564,
        "HasColorImage": true,
        "HasGrayImage": false,
        "ImageWidth": 2448.0,
        "ImageHeight": 2048.0,
        "CImageOverViewPositionX": 41871,
        "CImageOverViewPositionY": 23630,
        "HasScaned": true,
        "ImageName": "F001A6C.jpg",
        "FieldOffsetX": 0.0,
        "FieldOffsetY": 0.0
      },
    ],

      imgX:692, // 图片在画布中渲染的起点x坐标
      imgY:420,
      MINIMUM_SCALE: 0.2,
      imgScale: 0.2, // 图片启示的缩放大小
      extraImg: {url:  this.baseURL +
        "/getImage?image_path=" +
        this.viewData.samplePath +
        "\\Thumbs\\Result.jpg"},
      loadImgObj: null,

      img: null,
      flag: false,
      pos: {},
      posl: {},
      
      flagPC: true,
    }
  },
  watch: {
    
  },
  mounted() {


    this.element              = document.getElementById('viewContent');
    this.canvasDiv               = this.makeNeutralElement( "div" );

    this.canvasDiv.className = "openseadragon-canvas";
    (function( style ){
        style.width    = "100%";
        style.height   = "100%";
        style.overflow = "hidden";
        style.position = "absolute";
        style.top      = "0px";
        style.left     = "0px";
    }(this.canvasDiv.style));
    this.setElementTouchActionNone( this.canvasDiv );
    this.container= this.makeNeutralElement( "div" );

    //the container is created through applying the ControlDock constructor above
    this.container.className = "openseadragon-container";
    (function( style ){
        style.width     = "100%";
        style.height    = "100%";
        style.position  = "relative";
        style.overflow  = "hidden";
        style.left      = "0px";
        style.top       = "0px";
        style.textAlign = "left";  // needed to protect against
    }( this.container.style ));
    this.setElementTouchActionNone( this.container );

    this.container.insertBefore( this.canvasDiv, this.container.firstChild );
    this.element.appendChild( this.container );


    // this.canvasHeight = document.body.clientHeight;
    this.flagPC = this.IsPC()
    // this.myCanvas = this.$refs.bargraphCanvas;

    let _this = this;
        
         let   outputCanvas = this.canvasDiv; //output canvas

        
                    let canvas = document.createElement('canvas');
                    (function( style ){
                        style.background   = "none transparent";
                        style.border   = "none";
                        style.margin  = "0";
                        style.padding  = "0";
                        style.position   = "absolute";
                        style.width   = "100%";
                        style.height = "100%";  // needed to protect against
                    }( canvas.style ));

                    let Context = canvas.getContext('2d');
                    canvas.width =  outputCanvas.offsetWidth;
                    canvas.height =  outputCanvas.offsetHeight;



             this.canvas=canvas
                    outputCanvas.appendChild(canvas);
                    this.myCanvas =canvas;
                    this.ctx = this.myCanvas.getContext('2d');

    this.loadImg();
    this.canvasEventsInit();


  },
  destroyed() {
      
  },
  methods: {
    makeNeutralElement( tagName ) {
        var element = document.createElement( tagName ),
        style   = element.style;
    
        style.background = "transparent none";
        style.border     = "none";
        style.margin     = "0px";
        style.padding    = "0px";
        style.position   = "static";
    
        return element;
    },
    setElementTouchActionNone( element ) {
        element =this.getElement( element );
        if ( typeof element.style.touchAction !== 'undefined' ) {
            element.style.touchAction = 'none';
        } else if ( typeof element.style.msTouchAction !== 'undefined' ) {
            element.style.msTouchAction = 'none';
        }
    },
    getElement( element ) {
        if ( typeof ( element ) === "string" ) {
            element = document.getElementById( element );
        }
        return element;
    },
    loadImg() {
          //   overViewSizeHeight
    //   : 
    //   68672
    //   overViewSizeWidth
    //   : 
    //   68506

    this.  imgScale=0.2;
      let _this = this;

      _this.pos= {},
      _this.posl= {},
      _this.img = new Image();
      _this.img.src =  this.baseURL +
      "/getImage?image_path=" +
      this.viewData.samplePath +
      "\\Thumbs\\Result.jpg"
      _this.img.width=68506;
      _this.img.height=68672;



      _this.img.onload = function () {
        _this.imgX =(_this.myCanvas.width*0.5)- (_this.img.naturalWidth*_this.imgScale*0.5)
        _this.imgY =(_this.myCanvas.height*0.5)- (_this.img.naturalHeight*_this.imgScale*0.5)
          _this.drawImage();
      }

      console.log(this.myCanvas.getBoundingClientRect())

      console.log(this)
    //   naturalHeight
    //   : 
    //   2135
    //   naturalWidth
    //   : 
    //   2132
   




    },

    drawImage() {
      let _this = this;
      this.ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
      // // 保证  imgX  在  [img.width*(1-imgScale),0]   区间内
    //   if(_this.imgX<_this.img.width*(1-_this.imgScale)) {
    //       _this.imgX = _this.img.width*(1-_this.imgScale);
    //   }
    //   else if(_this.imgX>0) {
    //       _this.imgX=0
    //   }
    //   // // 保证  imgY   在  [img.height*(1-imgScale),0]   区间内
    //   if(_this.imgY<_this.img.height*(1-_this.imgScale)) {
    //       _this.imgY = _this.img.height*(1-_this.imgScale);
    //   }else if(_this.imgY>0) {
    //       _this.imgY=0
    //   }
    //   overViewSizeHeight
    //   : 
    //   68672
    //   overViewSizeWidth
    //   : 
    //   68506

      this.ctx.drawImage(
          _this.img, //规定要使用的图像、画布或视频。
          0, 0, //开始剪切的 x 坐标位置。

          _this.img.width, _this.img.height,  //被剪切图像的高度。
          _this.imgX, _this.imgY,//在画布上放置图像的 x 、y坐标位置。
          _this.img.width * _this.imgScale, _this.img.height * _this.imgScale  //要使用的图像的宽度、高度
      );
      _this.render()

    //   this.filesJson.forEach(item => {
    //     let img = new Image();
    //    img.src =   _this.baseURL +
    //    "/getImage?image_path=" +
    //    _this.viewData.samplePath +
    //    "\\Fields\\" +
    //    item.ImageName;

    // //    left: `${item.CImageOverViewPositionX}px`,
    // //    top: `${item.CImageOverViewPositionY}px`,
    
    //     img.width=item.ImageWidth;
    //     img.height=item.ImageHeight;
  

  
    //     img.onload = function () {
    //         _this.ctx.drawImage(
    //             img, //规定要使用的图像、画布或视频。
    //             0, 0, //开始剪切的 x 坐标位置。
      
    //             _this.img.width, _this.img.height,  //被剪切图像的高度。
    //             item.CImageOverViewPositionX* _this.imgScale,item.CImageOverViewPositionY*_this.imgScale,//在画布上放置图像的 x 、y坐标位置。
    //             img.width * _this.imgScale,img.height * _this.imgScale  //要使用的图像的宽度、高度
    //         );


    //     }

        
    //   });
    //   const imgData = this.ctx.createImageData(100, 100); // 创建一个 100x100 的 ImageData 对象
    //   this.ctx.putImageData(imgData, 0, 0);
    //   context.drawImage(image, 0, 0, canvas.width, canvas.height);
    },

    canvasEventsInit() {
      var pageX, pageY, initX, initY;
      var start = [];
      let _this = this;
      console.log(this.flagPC)
      if(this.flagPC) {
        //PC
        this.myCanvas.onmousedown = function (event) {
          _this.flag = true;
          _this.pos = _this.windowToCanvas(event.clientX, event.clientY);  //坐标转换，将窗口坐标转换成canvas的坐标

        };
        this.myCanvas.onmousemove = function (evt) {  //移动
            if(_this.flag ){
                // console.log(evt)
                _this.posl = _this.windowToCanvas(evt.clientX, evt.clientY);
                var x = _this.posl.x - _this.pos.x, y = _this.posl.y - _this.pos.y;
                _this.imgX  += x;
                _this.imgY  += y;
                _this.pos = JSON.parse(JSON.stringify(_this.posl));
                _this.drawImage();  //重新绘制图片
            }

        };
        this.myCanvas.onmouseup = function () {
            _this.flag  = false;
        };
        this.myCanvas.onmousewheel = this.myCanvas.onwheel = function (event) {    //滚轮放大缩小
            var pos = _this.windowToCanvas (event.clientX, event.clientY);
            // event.wheelDelta = event.wheelDelta ? event.wheelDelta : (event.deltalY * (-40));  //获取当前鼠标的滚动情况
            var newPos = {x:((pos.x-_this.imgX)/_this.imgScale).toFixed(2) , y:((pos.y-_this.imgY)/_this.imgScale).toFixed(2)};
            if (event.wheelDelta > 0) {// 放大
                    _this.imgScale +=_this.imgScale/10;
                    _this.imgX = (1-_this.imgScale)*newPos.x+(pos.x-newPos.x);
                    _this.imgY = (1-_this.imgScale)*newPos.y+(pos.y-newPos.y);
            } else {//  缩小
                _this.imgScale -=_this.imgScale/10;
                if(_this.imgScale<_this.MINIMUM_SCALE) {//最小缩放1
                    _this.imgScale = _this.MINIMUM_SCALE;
                }
                _this.imgX = (1-_this.imgScale)*newPos.x+(pos.x-newPos.x);
                _this.imgY = (1-_this.imgScale)*newPos.y+(pos.y-newPos.y);
                // console.log(_this.imgX,_this.imgY);
            }
            _this.drawImage();   //重新绘制图片
    
        };
      } else {
        //Phone
        this.myCanvas.ontouchstart = function (event) {
          _this.flag = true;
          if(event.touches && event.touches.length < 2) {
            let touch = event.touches[0];
            _this.pos = _this.windowToCanvas(touch.clientX, touch.clientY);  //坐标转换，将窗口坐标转换成canvas的坐标
          }else{
            let touches = event.touches;
            //手指按下时的手指所在的X，Y坐标  
            pageX = touches[0].pageX;
            pageY = touches[0].pageY;
            //初始位置的X，Y 坐标  
            initX = event.target.offsetLeft;
            initY = event.target.offsetTop;
            //记录初始 一组数据 作为缩放使用
            if (touches.length >= 2) { //判断是否有两个点在屏幕上
              start = touches; //得到第一组两个点
            };
          }
        };
        this.myCanvas.ontouchmove = function (evt) {  //移动
            if(_this.flag ){
              if(evt.touches && evt.touches.length < 2) {
                // console.log(evt)
                let touch = evt.touches[0];
                _this.posl = _this.windowToCanvas(touch.clientX, touch.clientY);
                var x = _this.posl.x - _this.pos.x, y = _this.posl.y - _this.pos.y;
                _this.imgX  += x;
                _this.imgY  += y;
                _this.pos = JSON.parse(JSON.stringify(_this.posl));
              }else{
                let touches = evt.touches;
                // 2 根 手指执行 目标元素放大操作
                //得到第二组两个点
                var now = touches;
                var pos = _this.windowToCanvas (now[0].clientX, now[0].clientY);
                var newPos = {x:((pos.x-_this.imgX)/_this.imgScale).toFixed(2) , y:((pos.y-_this.imgY)/_this.imgScale).toFixed(2)};
                // Math.abs(touches[0].pageX-touches[1].pageX)
                //当前距离变小， getDistance 是勾股定理的一个方法
                if(_this.getDistance(now[0], now[1]) < _this.getDistance(start[0], start[1])){
                  // 缩小
                  _this.imgScale -=0.03;
                  if(_this.imgScale<_this.MINIMUM_SCALE) {//最小缩放1
                      _this.imgScale = _this.MINIMUM_SCALE;
                  }
                  _this.imgX = (1-_this.imgScale)*newPos.x+(pos.x-newPos.x);
                  _this.imgY = (1-_this.imgScale)*newPos.y+(pos.y-newPos.y);
                  // console.log(_this.imgX,_this.imgY);
                }else if(_this.getDistance(now[0], now[1]) > _this.getDistance(start[0], start[1])){
                  // 放大
                  if(_this.imgScale < 1) {
                    _this.imgScale +=0.03;
                      _this.imgX = (1-_this.imgScale)*newPos.x+(pos.x-newPos.x);
                      _this.imgY = (1-_this.imgScale)*newPos.y+(pos.y-newPos.y);
                  }
                }
                start = now;
              }
              _this.drawImage();  //重新绘制图片
            
            }

        };
        this.myCanvas.ontouchend = function () {
            _this.flag  = false;
        };
      }
    },

    /*坐标转换*/
    windowToCanvas(x,y) {
        var box = this.myCanvas.getBoundingClientRect();  //这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离
        return {
            x: x - box.left - (box.width - this.myCanvas.width) / 2,
            y: y - box.top - (box.height - this.myCanvas.height) / 2
        };
    },

    //缩放 勾股定理方法-求两点之间的距离
    getDistance(p1, p2) {
        var x = p2.pageX - p1.pageX,
        y = p2.pageY - p1.pageY;
        return Math.sqrt((x * x) + (y * y));
    },

    IsPC() {
      var userAgentInfo = navigator.userAgent;
      var Agents = ["Android", "iPhone",
                  "SymbianOS", "Windows Phone",
                  "iPad", "iPod"];
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
          if (userAgentInfo.indexOf(Agents[v]) > 0) {
              flag = false;
              break;
          }
      }
      return flag;
    },
      // 渲染整个 图形画布
  render() {


    this.data.forEach(item => {
      this.draw(item);
    })
  },

      // 绘制圆形
  drawCircle(data) {
    this.ctx.beginPath();
    this.ctx.fillStyle = data.fillStyle;
    this.ctx.arc(data.x, data.y, data.r, 0, 2 * Math.PI);
    this.ctx.fill();
  },
  
  // 绘制线条方法 
  drawLine(data) {
    var arr = data.data.concat()
    var ctx = ctx || this.ctx;  

    ctx.beginPath()
    ctx.moveTo(arr.shift(), arr.shift())
    ctx.lineWidth = data.lineWidth || 1
    do{
      ctx.lineTo(arr.shift(), arr.shift());
    } while (arr.length)

    ctx.stroke();
  },
  
  //  绘制矩形方法 
  drawRect(data) {
    this.ctx.beginPath();
    this.ctx.fillStyle = data.fillStyle;
    this.ctx.fillRect(...data.data);
  },



  // 判断类型绘制的方法 
  draw(item) {
    this.ctx.setTransform(this.scale,0, 0, this.scale, this.offsetX, this.offsetY);
    switch(item.type){
      case 'line':
        this.drawLine(item)
        break;
      case 'rect':
        this.drawRect(item)
        break;
      case 'circle':
        this.drawCircle(item)
        break;
    }
  },
  
  // 添加形状
  push(data) {
    this.data.push(data);
    this.draw(data);
  }
  }}
