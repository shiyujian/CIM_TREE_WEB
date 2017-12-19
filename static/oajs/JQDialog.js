/**
 * @fileOverview JQDialog组件
 * @author Rex
 * @version 1.0
 */

/** 
 * @class JQDialog组件类
 * @constructor JQDialog
 * @param {JSON} configJSON 组件配置属性
 */
Fix.Component.JQDialog = (function(configJSON){
	/** @lends Fix.Component.JQDialog */
	var _obj_COMSelf;
	var _regEvents = configJSON.event;
	var _containerType = configJSON.containerType;
	var _title = configJSON.title||"标题";
	var _height = configJSON.height||"100%";
	var _width = configJSON.width||"90%";
	var _token = configJSON.token;
	var _Type = "Feedbacker";
	var _BaseFramework = "jQuery";
	var $dialog;
	var $bgObj = $("<div></div>");
	var _initEvent = new Fix.Event();
	var _drawEvent = new Fix.Event();
	var _feedbackEvent = new Fix.Event();
	var _removedEvent = new Fix.Event();
		
	return{
		/**
		 * @description 组件ID，通过该ID可以获取到组件
		 * @field
		 */
		id: configJSON.htmlID,
		/**
		 * @description 可选，组件的引用容器
		 * @field
		 */
		obj: configJSON.obj,
		/**
		 * @description 组件类型
		 * @field
		 */
		Type: (function(){return _Type;})(),
		/**
		 * @description 组件所使用的基本框架（如JQuery、ExtJs等）
		 * @field
		 */
		BaseFramework: (function() {return _BaseFramework;})(),
		/**
		 * @description 是否异步请求数据
		 * @field
		 */
		async: true,
		
		/**
		 * @description 注册组件初始化事件
		 * @param {function} fn 组件初始化方法
		 */
		onInit: function(fn){return Fix.Helper.fn_registerEvent(fn, _initEvent);},
		/**
		 * @description 注册组件绘制事件
		 * @param {function} fn 组件绘制方法
		 */
		onDraw: function(fn){return Fix.Helper.fn_registerEvent(fn, _drawEvent);},
		/**
		 * @description 注册组件反馈事件
		 * @param {function} fn 反馈时调用的方法
		 */
		onFeedback: function(fn){return Fix.Helper.fn_registerEvent(fn, _feedbackEvent);},
		/**
		 * @description 注册单击触发器事件
		 * @param {function} fn 单击触发器时调用的方法
		 */
		onRemoved: function(fn){return Fix.Helper.fn_registerEvent(fn, _removedEvent);},
		/**
		 * @description 组件绘制方法
		 * @param {Object} jQy_scope 组件所在容器
		 */
		draw: function(jQy_scope){
			//by yuan_t 2015-6-8 尝试使用这种方法解决mini.open打开子页面，在子页面中获取父页面对象
			top["father"]=window;
			_obj_COMSelf = this;
			$dialog = $("<div class='popup-A sl-shadow' style='position:absolute;' fixType='jqDialog'></div> ");

			$dialog.addClass("fixContainer fixTabContent");
			
			//居中显示dialog
			var win_width = $(document).width();
			var win_height = $(document).height();
			var l,t;
			if(String(_width).indexOf("%")>0){
				l = "10px";
			}else{
				l = (win_width - _width)/2;
			}
			if(String(_height).indexOf("%")>0){t="10px";}else{t=(win_height - _height)/2;}
			$dialog.css({
				left: l,
				top: t,
				width: _width,
				height:_height
			});
			
			
			var $title = $("<div class='title'><a href='javascript:void(0)' class='close'></a><h4><em class='icon'></em>"+_title+"</h4></div>");
		    $("a",$title).click(function(){
		    	_obj_COMSelf.onRemoved().fire($dialog);
		    	$dialog.remove();
		    	$bgObj.remove();
		    });
		    var $content = $("<div class='content searchDialog'></div>");

		    $dialog.append($title);
			$dialog.append($content);
			if(_containerType=="iframe"){
				
//				var $ifr = $("<iframe width='100%' height='100%' border=0 frameborder=0 scrolling='auto'></iframe>");
//				if(configJSON.url != undefined&&configJSON.url!=""){
//					$ifr.attr("src",configJSON.url);
//				}
//				$content.append($ifr);
//				return $ifr;
				
				//add by chenmin shen_sn 20131220 采用minui方式开窗
				var miniobj;
				if(typeof(top.mini)!="undefined")
					miniobj=top.mini;
				
				if(window.parent && typeof(window.parent.mini)!="undefined")
					miniobj=window.parent.mini;
				
				if(typeof(mini)!="undefined")
					miniobj=mini;

				$dialog=miniobj.open({
			        url: configJSON.url,
			        title: _title, 
			        width: _width, 
			        height: _height,
			        showMaxButton:true,
			        onload:configJSON.onload,
			        ondestroy: configJSON.ondestroy
			    });
				//记录当前tab页的唯一标识
				if(_token !== undefined)
					$($dialog.getEl()).attr("token", _token);
				$dialog.setCls("fixContainer");
				return $dialog;
				
			}else if(_containerType=="div"){
			    $dialog.draggable({
			    	handle:"div.title"
			    });
				$dialog.css("height",_height);
				return $content;
			}
			

		},
		remove: function(){			
	    	_obj_COMSelf.onRemoved().fire($dialog);
	        if(_containerType=="div")
	    	 {
				$dialog.remove();
				$bgObj.remove();
	    	 }
	        else
	        {
	        	$dialog.destroy();
	        }

	    	
		},
		show: function(){
	        if(_containerType=="div")
	    	 {
				
				$bgObj.addClass("bg");
				$("body").append($bgObj);
				$("body").append($dialog);
	    	 }
	        else
			    $dialog.show();
		},
		hide: function(){
			if(_containerType=="div")
	    	 {
			$bgObj.addClass("bg");
			$("body").append($bgObj);
			$("body").append($dialog);
	    	 }
			else
				$dialog.hide();
		},
		setValue:function(val){
			if(_containerType=="div")
			   $dialog.data("returnValue", val);
			else
				$($dialog.getEl()).data("returnValue", val);
			
		
		},
		getData:function(){
			if(_containerType=="div")
			   return $dialog.data("returnValue");
			else
			   return $($dialog.getEl()).data("returnValue");
		}
	};
	
	/**
	 * @private
	 */
});