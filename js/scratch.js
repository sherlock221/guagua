/**
 * 刮刮卡 canvas应用
 * @param ctx
 * @param imgUrl
 * @param isStopNav
 * @constructor
 * @version 1.1.0
 * @author sherlock
 * 大小等同于图片大小
 * 调整背景颜色
 * 绘制方式是圆形
 * 背景只能是图片?
 */
function Scratch(ctx, imgUrl, isStopNav) {
    this.ctx = ctx;
    this.imgUrl = imgUrl;
    this.isStopNav = isStopNav || true;
    this.isSupportTouch = "ontouchend" in document ? true : false;


    var bodyStyle = document.body.style;
    var mousedown = false;
    var ctx = this.ctx;
    var ctx2d = ctx.getContext('2d');

    /**
     * 阻止原生应用事件
     * @param bodyStyle
     */
    var stopNative = function (bodyStyle) {
        //禁止用户选择
        bodyStyle.mozUserSelect = 'none';
        bodyStyle.webkitUserSelect = 'none';
        //禁止长按弹窗(ios?)
        bodyStyle.webkitTouchCallout = 'none';
    };

    /**
     * 绑定事件
     * @param ctx
     * @param fns
     */
    var eventBind = function (ctx, fns) {
        for (var i = 0; i < fns.length; i++) {
            var obj = fns[i];
            ctx.addEventListener(obj.name, obj.fn);
        }

    };

    function layer(ctx, w, h) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(0, 0, w, h);
    }

    function eventDown(e) {
        e.preventDefault();
        mousedown = true;
    }

    function eventUp(e) {
        e.preventDefault();
        mousedown = false;
        var w = ctx.width;
        var h = ctx.height;

        var data=ctx2d.getImageData(0,0,w,h).data;
        for(var i=0,j=0;i< data.length;i+=4){
            if(data[i] && data[i+1] && data[i+2] && data[i+3]){
                j++;
            }
        }

        //0.7,在涂层的面积小于等于70%时,就弹出窗口,表示刮完了
        var temp  = w*h*0.7;
        console.log(temp);
        console.log(j);
        if(j<=temp){
            alert('您中奖了!');
        }
    }

    function eventMove(e) {
        e.preventDefault();
        if (mousedown) {
            if (e.changedTouches) {
                e = e.changedTouches[e.changedTouches.length - 1];
            }
            var x = (e.clientX + document.body.scrollLeft || e.pageX) - ctx.offsetLeft || 0,
                y = (e.clientY + document.body.scrollTop || e.pageY) - ctx.offsetTop || 0;
            with (ctx2d) {
                beginPath()
                arc(x, y, 5, 0, Math.PI * 2);
                fill();
            }
        }
    }

    var touch = function (_this) {
        if (_this.isSupportTouch)
            return  [
                {name: "touchstart", fn: eventDown},
                {name: "touchend", fn: eventUp},
                {name: "touchmove", fn: eventMove}
            ];
        else
            return [
                {name: "mousedown", fn: eventDown},
                {name: "mouseup", fn: eventUp},
                {name: "mousemove", fn: eventMove}
            ];
    };


    //阻止原生
    if (this.isStopNav != false)
        stopNative(bodyStyle);


    //绑定事件
    eventBind(this.ctx, touch(this));


    var ctx = this.ctx;
    var ctx2d = ctx.getContext('2d');
    var img = new Image();

    ctx.style.backgroundColor = 'transparent';
    ctx.style.position = 'relative';
    img.addEventListener('load', function (e) {
        var w = img.width,
            h = img.height;
        ctx.width = w;
        ctx.height = h;
        ctx.style.backgroundImage = 'url(' + img.src + ')';

        ctx2d.fillStyle = 'transparent';
        ctx2d.fillRect(0, 0, w, h);
        layer(ctx2d, w, h);
        ctx2d.globalCompositeOperation = 'destination-out';

    });
    //加载图片
    img.src = this.imgUrl;
};



Scratch.prototype.changeBg =  function(imgUrl){
   this.ctx.style.backgroundImage = 'url('+imgUrl+')';
};