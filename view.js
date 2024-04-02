/*
 * @Author: error: git config user.name & please set dead value or install git
 * @Date: 2024-03-14 09:55:30
 * @LastEditors: error: git config user.name & please set dead value or install git
 * @LastEditTime: 2024-04-02 09:45:18
 * @FilePath: \local-web-view-bak20230816 - 副本\src\components\class.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// 创建一个 BankAccount 类
class LdLoaderView {
  constructor(config) {
    console.log("🚀 ~ constructor ~ config:", config);

    this.baseURL = config.baseURL;

    this.overViewSizeWidth = config.tileSources.width;
    this.overViewSizeHeight = config.tileSources.height;

    this.titleSource = config.tileSources;

    // this.filesJson=filesJson||[];

    // 初始化DOM相关属性
    this.element = null;
    this.canvasDiv = null;
    this.container = null;
    this.overLay = null;
    this.myCanvas = null;
    this.ctx = null;

    // 图像及缩放相关属性
    this.imgX = 692;
    this.imgY = 420;
    this.MINIMUM_SCALE = 0.2;
    this.imgScale = 0.2;
    this.img = null;
    this.flag = false;
    this.position = {};
    this.position_old = {};
    this.maxCacheSize = config.maxCacheSize || 50;
    this.tileCache = [];
    this.tileCacheId = [];
    this.inViewImg = []; //视野内的图片
    this.overLayElement = null;
    this.overLay = [];
    this.initDom();
  }

  static DEFAULT_STYLES = {
    NEUTRAL_ELEMENT: {
      background: "transparent none",
      border: "none",
      margin: "0px",
      padding: "0px",
      position: "static",
    },
    CANVAS_CONTAINER: {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      position: "absolute",
      top: "0px",
      left: "0px",
    },
    CONTAINER: {
      width: "100%",
      height: "100%",
      position: "relative",
      overflow: "hidden",
      left: "0px",
      top: "0px",
      textAlign: "left",
    },
    CANVAS: {
      background: "none transparent",
      border: "none",
      margin: "0",
      padding: "0",
      position: "absolute",
      width: "100%",
      height: "100%",
    },
  };
  //初始化dom
  initDom() {
    this.element = document.getElementById("viewContent");
    this.canvasDiv = this.createNeutralElement(
      "div",
      LdLoaderView.DEFAULT_STYLES.CANVAS_CONTAINER
    );
    this.canvasDiv.className = "loaderview-canvas";
    this.setElementTouchActionNone(this.canvasDiv);

    this.container = this.createNeutralElement(
      "div",
      LdLoaderView.DEFAULT_STYLES.CONTAINER
    );
    this.container.className = "loaderview-container";
    this.setElementTouchActionNone(this.container);

    this.container.insertBefore(this.canvasDiv, this.container.firstChild);
    this.element.appendChild(this.container);

    let outputCanvas = this.canvasDiv;
    let canvas = document.createElement("canvas");
    Object.assign(canvas.style, LdLoaderView.DEFAULT_STYLES.CANVAS);
    canvas.width = outputCanvas.offsetWidth;
    canvas.height = outputCanvas.offsetHeight;

    outputCanvas.appendChild(canvas);
    this.myCanvas = canvas;
    this.ctx = this.myCanvas.getContext("2d");

    this.overLayElement = this.createNeutralElement(
      "div",
      LdLoaderView.DEFAULT_STYLES.NEUTRAL_ELEMENT
    );
    outputCanvas.appendChild(this.overLayElement);

    this.loadBaseMap();
    this.canvasEventsInit();
  }
  //创建一个元素
  createNeutralElement(tagName, customStyles = {}) {
    const element = document.createElement(tagName);
    const style = element.style;
    Object.assign(
      style,
      LdLoaderView.DEFAULT_STYLES.NEUTRAL_ELEMENT,
      customStyles
    );
    return element;
  }
  //设置元素的touchAction属性为none
  setElementTouchActionNone(element) {
    element = this.getElement(element);
    if (typeof element.style.touchAction !== "undefined") {
      element.style.touchAction = "none";
    } else if (typeof element.style.msTouchAction !== "undefined") {
      element.style.msTouchAction = "none";
    }
  }
  //获取元素
  getElement(element) {
    if (typeof element === "string") {
      element = document.getElementById(element);
    }
    return element;
  }
  //加载磁贴图片
  async loadImageAsync(item) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = item.src;
      img.onload = () => {
        item.img = img;
        resolve(item);
      };

      img.onerror = (error) => {
        console.error("Failed to load image at", src, "with error", error);
        reject(error);
      };
    });
  }
  //加载底图
  async loadBaseMap() {
    this.imgScale = 0.2;
    let _this = this;

    _this.position = {};
    _this.position_old = {};
    _this.img = new Image();
    _this.img.src = this.baseURL;
    _this.img.onload = function () {
      _this.img.width = _this.overViewSizeWidth;
      _this.img.height = _this.overViewSizeHeight;

      _this.imgX =
        _this.myCanvas.width * 0.5 -
        _this.img.naturalWidth * _this.imgScale * 0.5;
      _this.imgY =
        _this.myCanvas.height * 0.5 -
        _this.img.naturalHeight * _this.imgScale * 0.5;

      _this.drawViewImage();
    };
  }

  //遮蔽层
  addOverlay(item) {
    this.overLay.push(item);
    this.drawViewImage();
  }
  removeOverlay(item) {
    let i = this.getOverlayIndex(this.overLay, item);

    if (i >= 0) {
      this.overLay[i].destroy();
      this.overLay.splice(i, 1);
    }
  }
  getOverlayIndex(overlays, element) {
    var i;
    for (i = overlays.length - 1; i >= 0; i--) {
      if (overlays[i].element === element) {
        return i;
      }
    }
    return -1;
  }

  loadOverlay(item) {
    let _this = this;

    let overLay = item.element;
    (function (style) {
      style.left =
        _this.imgX +
        (_this.img.naturalWidth / _this.img.width) * item.px * _this.imgScale +
        "px";
      style.top =
        _this.imgY +
        (_this.img.naturalHeight / _this.img.height) *
          item.py *
          _this.imgScale +
        "px";
      style.position = "absolute";
      style.width =
        item.width *
          (_this.img.naturalWidth / _this.img.width) *
          _this.imgScale +
        "px";
      style.height =
        item.height *
          (_this.img.naturalWidth / _this.img.width) *
          _this.imgScale +
        "px";
    })(overLay.style);
    _this.overLayElement.appendChild(overLay);
  }

  //canvas绘图
  async drawViewImage() {
    let _this = this;
    this.overLay.forEach(function (item) {
      _this.loadOverlay(item);
    });

    this.ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
    this.ctx.drawImage(
      _this.img, //规定要使用的图像、画布或视频。
      0,
      0, //开始剪切的 x 坐标位置。
      _this.img.width,
      _this.img.height, //被剪切图像的高度。
      _this.imgX,
      _this.imgY, //在画布上放置图像的 x 、y坐标位置。
      _this.img.width * _this.imgScale,
      _this.img.height * _this.imgScale //要使用的图像的宽度、高度
    );
    Object.values(_this.inViewImg).forEach((item) => {
      if (item.img) {
        let { x, y } = _this.getImageToElement(item.x, item.y);
        _this.ctx.drawImage(
          item.img, //规定要使用的图像、画布或视频。
          0,
          0, //开始剪切的 x 坐标位置。
          _this.titleSource.tileWidth /
            (_this.img.naturalWidth / _this.img.width),
          _this.titleSource.tileHeight /
            (_this.img.naturalHeight / _this.img.height), //被剪切图像的高度。
          x,
          y, //在画布上放置图像的 x 、y坐标位置。
          _this.titleSource.tileWidth * _this.imgScale,
          _this.titleSource.tileHeight * _this.imgScale //要使用的图像的宽度、高度);
        );
      }
    });
  }

  //计算视口宽高，
  getWordRect(x, y) {
    let x0 = x / (this.img.naturalWidth / this.img.width) / this.imgScale;
    let y0 = y / (this.img.naturalHeight / this.img.height) / this.imgScale;
    let width =
      this.myCanvas.width /
      (this.img.naturalWidth / this.img.width) /
      this.imgScale;
    let height =
      this.myCanvas.height /
      (this.img.naturalHeight / this.img.height) /
      this.imgScale;
    return {
      x: -x0,
      y: -y0,
      width: width,
      height: height,
    };
  }

  //图像坐标转视口坐标
  getImageToElement(x, y) {
    let x0 =
      this.imgX + (this.img.naturalWidth / this.img.width) * x * this.imgScale;

    let y0 =
      this.imgY +
      (this.img.naturalHeight / this.img.height) * y * this.imgScale;

    return {
      x: x0,
      y: y0,
    };
  }

  //加载磁贴对象
  loadTitleSource() {
    let _this = this;
    let scale =
      _this.myCanvas.width /
      (_this.img.naturalWidth / _this.img.width) /
      (6 * this.titleSource.tileWidth);
    let ImageShow = [];

    let inViewImg = {};
    if (this.imgScale >= scale) {
      let { x, y, width, height } = this.getWordRect(this.imgX, this.imgY);

      let newJson = this.titleSource.getTileJson(
        x - this.titleSource.tileWidth,
        y - this.titleSource.tileHeight,
        width + this.titleSource.tileWidth,
        height + this.titleSource.tileHeight
      );

      // 假设this.tileCache是一个对象，键为id，值为元素，这样可以快速查找和更新。
      // 在函数的开头，可以初始化这个缓存对象（如果它尚未被初始化）。
      if (!this.tileCache) {
        this.tileCache = {};
      }

      newJson.forEach((element) => {
        // 异常处理：确保element.x和element.y存在
        if (
          typeof element.x === "undefined" ||
          typeof element.y === "undefined"
        ) {
          console.warn("element.x or element.y is undefined", element);
          return; // 跳过当前元素的处理
        }
        element.id = element.x + "_" + element.y;
        element.url = element.src || element.url;
        // 使用对象缓存来检查id是否已存在，从而提高查找效率。
        if (!this.tileCache[element.id]) {
          ImageShow.push(element);
          // this.tileCache[element.id] = element; // 添加到缓存
        } else {
          inViewImg[element.id] = this.tileCache[element.id];
        }
      });

      // let column0 = Math.floor(x / this.titleSource.tileWidth);
      // let column1 = Math.ceil((x + width) / this.titleSource.tileWidth);
      // let row0 = Math.floor(y / this.titleSource.tileHeight);
      // let row1 = Math.ceil((y + height) / this.titleSource.tileHeight);
    }

    ImageShow.forEach((item) => {
      _this.loadImageAsync(item).then((res) => {
        let { x, y } = _this.getImageToElement(item.x, item.y);
        _this.ctx.drawImage(
          res.img, //规定要使用的图像、画布或视频。
          0,
          0, //开始剪切的 x 坐标位置。
          _this.titleSource.tileWidth /
            (_this.img.naturalWidth / _this.img.width),
          _this.titleSource.tileHeight /
            (_this.img.naturalHeight / _this.img.height), //被剪切图像的高度。
          x,
          y, //在画布上放置图像的 x 、y坐标位置。
          _this.titleSource.tileWidth * _this.imgScale,
          _this.titleSource.tileHeight * _this.imgScale //要使用的图像的宽度、高度);
        );

        item.img = res.img;
        _this.tileCache[item.id] = item;
        inViewImg[item.id] = item;
        _this.tileCacheId.push(item.id);
        if (_this.tileCacheId.length > _this.maxCacheSize) {
          const firstKey = _this.tileCacheId.splice(0, 1);
          delete _this.tileCache[firstKey];
        }
      });
    });

    this.inViewImg = inViewImg;
  }

  canvasEventsInit() {
    var pageX, pageY, initX, initY;
    var start = [];
    let _this = this;

    this.canvasDiv.onmousedown = function (event) {
      _this.flag = true;
      _this.position = _this.windowToCanvas(event.clientX, event.clientY); //坐标转换，将窗口坐标转换成canvas的坐标
    };
    this.canvasDiv.onmousemove = function (evt) {
      //移动
      if (_this.flag) {
        // console.log(evt)
        _this.position_old = _this.windowToCanvas(evt.clientX, evt.clientY);
        var x = _this.position_old.x - _this.position.x,
          y = _this.position_old.y - _this.position.y;
        _this.imgX += x;
        _this.imgY += y;
        _this.position = JSON.parse(JSON.stringify(_this.position_old));
        _this.drawViewImage(); //重新绘制图片
      }
    };
    this.canvasDiv.onmouseup = function () {
      // _this.drawViewImage(); //重新绘制图片
      _this.loadTitleSource();
      _this.flag = false;
    };
    this.canvasDiv.onmousewheel = this.canvasDiv.onwheel = function (event) {
      //滚轮放大缩小
      var position = _this.windowToCanvas(event.clientX, event.clientY);
      // event.wheelDelta = event.wheelDelta ? event.wheelDelta : (event.deltalY * (-40));  //获取当前鼠标的滚动情况
      var newPos = {
        x: (position.x - _this.imgX) / _this.imgScale,
        y: (position.y - _this.imgY) / _this.imgScale,
      };
      if (event.wheelDelta > 0) {
        // 放大
        _this.imgScale += _this.imgScale / 10;
        _this.imgX = (1 - _this.imgScale) * newPos.x + (position.x - newPos.x);
        _this.imgY = (1 - _this.imgScale) * newPos.y + (position.y - newPos.y);
      } else {
        //  缩小
        _this.imgScale -= _this.imgScale / 10;
        if (_this.imgScale < _this.MINIMUM_SCALE) {
          //最小缩放1
          _this.imgScale = _this.MINIMUM_SCALE;
        }
        _this.imgX = (1 - _this.imgScale) * newPos.x + (position.x - newPos.x);
        _this.imgY = (1 - _this.imgScale) * newPos.y + (position.y - newPos.y);
        // console.log(_this.imgX,_this.imgY);
      }
      _this.drawViewImage(); //重新绘制图片
      _this.loadTitleSource();
    };
    // } else {
    //Phone
    this.canvasDiv.ontouchstart = function (event) {
      _this.flag = true;
      if (event.touches && event.touches.length < 2) {
        let touch = event.touches[0];
        _this.position = _this.windowToCanvas(touch.clientX, touch.clientY); //坐标转换，将窗口坐标转换成canvas的坐标
      } else {
        let touches = event.touches;
        //手指按下时的手指所在的X，Y坐标
        pageX = touches[0].pageX;
        pageY = touches[0].pageY;
        //初始位置的X，Y 坐标
        initX = event.target.offsetLeft;
        initY = event.target.offsetTop;
        //记录初始 一组数据 作为缩放使用
        if (touches.length >= 2) {
          //判断是否有两个点在屏幕上
          start = touches; //得到第一组两个点
        }
      }
    };
    this.canvasDiv.ontouchmove = function (evt) {
      if (_this.flag) {
        if (evt.touches && evt.touches.length < 2) {
          let touch = evt.touches[0];
          _this.position_old = _this.windowToCanvas(touch.clientX, touch.clientY);
          var x = _this.position_old.x - _this.position.x,
            y = _this.position_old.y - _this.position.y;
          _this.imgX += x;
          _this.imgY += y;
          _this.position = JSON.parse(JSON.stringify(_this.position_old));
        } else {
          let touches = evt.touches;
          // 2 根 手指执行 目标元素放大操作
          //得到第二组两个点
          var now = touches;

          var position = _this.windowToCanvas(now[0].clientX, now[0].clientY);
          var newPos = {
            x: (position.x - _this.imgX) / _this.imgScale,
            y: (position.y - _this.imgY) / _this.imgScale,
          };
          // Math.abs(touches[0].pageX-touches[1].pageX)
          //当前距离变小， getDistance 是勾股定理的一个方法
          if (
            _this.getDistance(now[0], now[1]) <
            _this.getDistance(start[0], start[1])
          ) {
            // 缩小
            _this.imgScale -= _this.imgScale / 20;
            if (_this.imgScale < _this.MINIMUM_SCALE) {
              //最小缩放1
              _this.imgScale = _this.MINIMUM_SCALE;
            }
            _this.imgX = (1 - _this.imgScale) * newPos.x + (position.x - newPos.x);
            _this.imgY = (1 - _this.imgScale) * newPos.y + (position.y - newPos.y);
            // console.log(_this.imgX,_this.imgY);
          } else if (
            _this.getDistance(now[0], now[1]) >
            _this.getDistance(start[0], start[1])
          ) {
            // 放大
            if (_this.imgScale < 1) {
              _this.imgScale += _this.imgScale / 20;
              _this.imgX = (1 - _this.imgScale) * newPos.x + (position.x - newPos.x);
              _this.imgY = (1 - _this.imgScale) * newPos.y + (position.y - newPos.y);
            }
          }
          start = now;
        }

        _this.drawViewImage(); //重新绘制图片
      }
    };
    this.canvasDiv.ontouchend = function () {
      // _this.drawViewImage(); //重新绘制图片
      _this.loadTitleSource();
      _this.flag = false;
    };
  }
  /*坐标转换*/
  windowToCanvas(x, y) {
    var box = this.myCanvas.getBoundingClientRect(); //这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离
    // console.log(box,this.myCanvas.width,this.myCanvas.height)
    return {
      x: x - box.left - (box.width - this.myCanvas.width) / 2,
      y: y - box.top - (box.height - this.myCanvas.height) / 2,
    };
  }

  //缩放 勾股定理方法-求两点之间的距离
  getDistance(p1, p2) {
    var x = p2.pageX - p1.pageX,
      y = p2.pageY - p1.pageY;
    return Math.sqrt(x * x + y * y);
  }
}
export default LdLoaderView;
