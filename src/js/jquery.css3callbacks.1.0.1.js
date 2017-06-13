/*
*2015-12-26
* css3动画回调
* @yyman001
* */

;(function($, undefined) {
//方法一:-----浏览器前缀检测--- 缺点:虽然有时候浏览器支持前缀读出,但事件有事不生效,特别是在手机端,虽然有标准,但不支持标准,webkit就是这样
    //解决: 一般把特效前缀放前面遍历,标准放后
    var t;
    var el = document.createElement('fakeelement');   //用于下面判断用户当前的浏览器
    //重点是下面这个对象
    var transitions = {
        'OTransition': 'oTransitionEnd',                 //opera
        'MozTransition': 'transitionend',                //mozilla
        'WebkitTransition': 'webkitTransitionEnd',        //webkit
        'MsTransition': 'msTransitionEnd',
        'transition': 'transitionend'                  //standard
    };

    var animation = {
        'WebkitAnimation': 'webkitAnimationEnd',        //webkit
        'OAnimation': 'oTransitionEnd',                 //opera
        'MozTransition': 'AnimationEnd',                //mozilla
        'animation': 'AnimationEnd'                       //standard
    };
    var ANIMATION_EVENT, TRANSTION_EVEN;

    //遍历对象属性
    //检查前缀
    function ckA(){
        for (t in animation) {
            if (el.style[t] !== undefined) {
                ANIMATION_EVENT = animation[t];      //如果支持标准，则直接返回transitionend，否则将返回浏览器特定的标识
                //console && console.log(ANIMATION_EVENT);
                return true;
            }
        }
    }

    //检测前缀过渡
    function ckT(){
        for (t in transitions) {
            if (el.style[t] !== undefined) {
                TRANSTION_EVEN = transitions[t];      //如果支持标准，则直接返回transitionend，否则将返回浏览器特定的标识
                //console && console.log(TRANSTION_EVEN);
                return true;
            }
        }
    }

    ckA();
    ckT();
    //动画方法 one 为真的时候才绑定on,否则只执行一次 则 one
	/**
     *
     * @param _className
     * @param callback
     * @param _delClass
     * @param _one   为真的时候才绑定on,否则只执行一次 则 one
     * @returns {*}
     */
    $.fn.cssAnimationEnd = function(_className,callback,_delClass,_one) {
        return this.each(function(){
            var $this = $(this);
            var one = _one || false;
            var isdelClass = _delClass || false;
            //$this.addClass('testAni');
            $this.addClass(_className);
            $this.on(ANIMATION_EVENT, function(e){
                if(!one){$this.off(ANIMATION_EVENT);}
                //if($this.hasClass('testAni') && this == e.target && $.isFunction( callback ) ){
                if($this.hasClass(_className) && this == e.target && $.isFunction( callback ) ){
                    //console.log('----------------------3---真实触发-------------------');
                    //$this.removeClass('testAni');
                    //console.log(_className);
                    //console.log($this);
                    //console.log(isdelClass);
                    if(isdelClass){
                        $this.removeClass(_className);
                    }
                    return callback.call( this, e );
                }
            });
        });
    };

    //css3 callback
	/**
     *
     * @param callback
     * @param _one
     * @returns {*}
     */
    $.fn.css3cb = function(callback,_one) {
        return this.each(function(){
            var $this = $(this);
            var one = _one || false;
            $this.on(ANIMATION_EVENT, function(e){
                if(!one){$this.off(ANIMATION_EVENT);}
                if(this == e.target && $.isFunction( callback ) ){
                    return callback.call( this, e );
                }
            });
        });
    };




    //过渡方法
	/**
     *
     * @param callback
     * @param _one
     * @returns {*}
     */
    $.fn.cssTransitionEnd = function( callback ,_one ) {
        return this.each(function(){
            var $this = $(this);
            var one = _one || false;
            $this.addClass('testAni');
            $this.on(TRANSTION_EVEN, function(e){
                if(!one){$this.off(TRANSTION_EVEN);}
                if($this.hasClass('testAni') && this == e.target && $.isFunction( callback ) ){
                    //console.log('----------------------3---真实触发-------------------');
                    $this.removeClass('testAni');
                    return callback.call( this, e );
                }
            });
        });
    };
})(jQuery);
