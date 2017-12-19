SetJsDomain(window.location.host);//动态设置跨域 edit by chenmin 20131120
var _isDomain=1;//跨域
var _Domain=document.domain;
var _ShowPicSignature="true";//是否采用图片签字
// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.
//
//字段唯性检验
//表名、主键字段（添加时不填）、主键值（添加时不填）、判断字段、判断值、类型（添加ADD,其他默认为修改）、返回内容
function uniquelyVerify(table_Id,guid_Id,guid_Value,filed_Id,filed_Value,operate_Type,return_value){
	//table_Id='FIX_DOC_PRINT';
	//guid_Id='GUID';
	//guid_Value='05723a06bc5ac989194dad0f6e0b89dd';
	//filed_Id='DOC_ID';
	//filed_Value='DFDF';
	//operate_Type='ADD';
	var returnInfo='';
	Fix.ajax({
		action:{
				_method:'userDefinedVerifyService.uniquelyVerify'
		},
		data:{
			'TABLEID':table_Id,
			'GUIDID':guid_Id,
			'GUIDVALUE':guid_Value,
			'FILEDID':filed_Id,
			'FILEDVALUE':filed_Value,
			'OPERATETYPE':operate_Type},
		async:false,
		success:function(response){
			 returnInfo=response.info;	
		}				
	});
	
	return returnInfo;
}

function uniquelyVerify(table_Id,guid_Id,guid_Value,filed_Id,filed_Value,operate_Type,return_value,Sqlwhere){

	//table_Id='FIX_DOC_PRINT';
	//guid_Id='GUID';
	//guid_Value='05723a06bc5ac989194dad0f6e0b89dd';
	//filed_Id='DOC_ID';
	//filed_Value='DFDF';
	//operate_Type='ADD';
	var returnInfo='';
	Fix.ajax({
		action:{
				_method:'userDefinedVerifyService.uniquelyVerify'
		},
		data:{
			'TABLEID':table_Id,
			'GUIDID':guid_Id,
			'GUIDVALUE':guid_Value,
			'FILEDID':filed_Id,
			'FILEDVALUE':filed_Value,
			'OPERATETYPE':operate_Type,
			'SQLWHERE':Sqlwhere},
		async:false,
		success:function(response){
			 returnInfo=response.info;	
		}				
	});
	
	return returnInfo;
}
if (!this.JSON) {
    this.JSON = {};
    
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.Mystringify !== 'function') {
        JSON.Mystringify = function (value, replacer, space) {

// The Mystringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.Mystringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

isFixTop = true;
// 扩展jQuery对json字符串的转换

/** @namespace Fix 组件命名空间*/
Fix = window['Fix'] || {};

Fix.Performance = "low";
/** @namespace Fix.Flow 组件命名空间*/
Fix.Flow = {
	/**
	 * @author Rex
	 * @description 偏移流程图片，使图片靠左上方显示
	 */
	moveFlowGraphi : function(){
		var minhight = $("svg").attr("minhight");
		var minwidth = $("svg").attr("minwidth");
		//var height = $("svg").attr("height");
		var height = 0;
		if(minhight>20){
			height = minhight - 20;
		}
		var width =0;
		if(minwidth>10){
			width = minwidth-10;
		}
		$("#svg").css("margin-top","-"+height+"px");
		$("#svg").css("margin-left","-"+width+"px");
		$("#svg").css("margin-bottom","-"+50+"px");
	}
};

//窗口打开方式
Fix.openMethod = {
	open: function(s,obj){
		switch(s){
			case "slide":
				Fix.openMethod.slide(obj);
				break;
			case "openTabByToolbar":
				Fix.openMethod.openTabByToolbar(obj);
				break;
			case "dialog":
				Fix.openMethod.dialog(obj);
				break;
		}
	},
	slide: function(obj){
		var url = obj.url;
		var $slide = window.slide;
		if(!$slide){
			$slide = $("<div class='detailTable sl-shadow'></div>");
			$slideTab = $("<div id='slideTab' style='background-color:#F9F9F9;float:left;width:50px;height:100%;text-align:center'></div>");
			$slideBtn = $("<button type='button'>关闭</button>");
			$slideBtn.click(function(){
				$($slide,"#container").hide( "slide", {direction:"right"}, 500, function(){
					$($slide,"#container").remove();
				});
			});
			$slideTab.append($slideBtn);
			$slideIframe = $("<div style='margin-left:50px; background:#fff;height:100%'><iframe id='slideIframe' src='blank.html' width='100%' height='100%' border=0 frameborder=0 scrolling='no'></iframe></div>");
			$slide.append($slideTab);
			$slide.append($slideIframe);
			$("#container").append($slide);
		}
		$slide.show( "slide", {direction:"right"}, 500, function(){
			$("#slideIframe",$(this)).attr("src",url);
		});
	},
	openTabByToolbar: function(tabObj){
		var tab = tabObj.tabObj;
		var tabId = tab.getId();
		var tabsId = $(window.frameElement).parent("div").attr("id");
		tabObj.pId =  parent.MainTab.historyTabs[0].id;
		tabObj.id = tabsId + tabObj.id;
		tabObj.frontImg = "ui-icon ui-icon-document";
		parent.MainTab.add(tabObj);
	},
	dialog: function(obj){
		var url = obj.url;
		var height = obj.height||"280px";
		var width = obj.width||"500px";
		var title = obj.title||"";
		var draggableConfig = {
				containerType:"iframe"
		};
		$.extend(draggableConfig, obj);
		var JQDialog = new Fix.Component.JQDialog(draggableConfig);
		var $container = JQDialog.draw();
		$container.attr("src",url);
		JQDialog.show();
		return JQDialog;
		/*$dialog = $("<div></div>");
		$iframe = $("<iframe width='100%' height='100%' border=0 frameborder=0 scrolling='auto' src="+url+"></iframe>");
		$dialog.append($iframe);
		$("body").append($dialog);
		$dialog.dialog({
			autoOpen: false,
			modal: true,
			height: 500,
			width: 800
		});
		$dialog.dialog("open");*/
	},
	openExtWindow: function(int_width, int_height, str_title, str_url){
		Fix.Util.getTopWin().FormWindow.window = window;

		var config = {
		            width: Number(int_width),
		            height: Number(int_height),
		            title: str_title,
		            pm_url: str_url,
		            parent_url:window.location.href,
		            maintab_url:""
		};
		var popDiv = Fix.Util.getTopWin().FormWindow.createWindow(config);
		//popDiv.ResultEvent = "";

		//popDiv.show();
		return popDiv;
	}
};

Fix.Form = {
	fn_GetElement: function(obj, str_Type){
		switch(str_Type) {
			case "DataTarget":
			    if(typeof obj.field != "undefined" && obj.field != "")
					return obj;
				else
					return null;
				break;
			case "Alias":
				obj.getFunc = (function(){
					if(typeof this.refc == "undefined")
						return this.func;
					else
						return this.refc.func;
				});
				
				if(typeof obj.refc != "undefined")
					obj.refc["htmlID"] = str_htmlID;
				else
					obj["htmlID"] = str_htmlID;
				
			    return obj;
				break;
			default: 
				return null;
		}
	},
	resizeLayout: function(theme){
		switch(theme){
			case "FixCS":
				var height = $(document).height();
				var $formPanel = $(".tpl-form-border");
				$formPanel.css("height", (Number(height) - Number(32)));
				var $toolbarPanel = $(".tpl-toolbar");
				$toolbarPanel.css("height", (Number(height) - Number(48)));
				Fix.Util.getTopWin().Fix.Manager.clearError();
				break;
			case "FTKMS":
				var height = $(document).height();
				var $formPanel = $(".tpl-form-border");
				$formPanel.css("height", (Number(height) - Number(32)));
				var $toolbarPanel = $(".tpl-toolbar");
				$toolbarPanel.css("height", (Number(height) - Number(48)));
				//top.Fix.Manager.clearError();
				break;
			default:
				break;
		}
	}
};

/** @namespace Fix.Util 组件命名空间*/
Fix.Util = {
	baseHTML:'',
	getTopWin:function(win){
		
		if(this.baseHTML!=""){
			return this.baseHTML;
		}
		if(win==undefined){
			win = window;
		}
		try{
			//若在门户中，则默认取门户的window作为topwin。  shen_sn 20140725
			if(window.top&&window.top.Fix!=undefined){
				win=window.top;
			}
			if(win.parent.location.href&&win.parent!==win.self&&isFixTop){
				win = this.getTopWin(win.parent);
			}else{
				this.baseHTML = win;
			}
		}catch(e){
			this.baseHTML = win;
		}
		return win;
	},
	/**
	 * @author char
	 * @description 将json字符串转换为对象
	 * @param {String} strJson json字符串
	 * @return 返回object,array,string等对象
	 */
	decode : function(strJson) {
		if(strJson == "")
			strJson = "{}";
		return eval("(" + strJson + ")");
	},
	/**
	 * @author char
	 * @description 将javascript数据类型转换为json字符串
	 * @param {Object} object 待转换对象,支持object,array,string,function,number,boolean,regexp
	 * @return 返回json字符串
	 */
	encode : function(object) {
		var type = typeof object;
		
		if(typeof(JSON) != "undefined"){
			//return JSON.stringify(object);//WINXP ie8下面 该函数有bug,有时候会把"" 字符转成"null" edit by chenmin 20130406
			return JSON.Mystringify(object);//edit by chenmin 20130406
		}
		
		try {
			if ('object' == type) {
				//if (Array === object.constructor)
				//上面那种判断在做了 var jQuery = top.jQuery; 操作后，Array不被是被为Array
				if($.isArray(object))
					type = 'array';
				else if (RegExp == object.constructor)
					type = 'regexp';
				else
					type = 'object';
			}
		} catch (e) {
		}
		switch (type) {
		case 'undefined':
		case 'unknown':
			return;
			break;
		case 'function':
		case 'boolean':
		case 'regexp':
			return object.toString();
			break;
		case 'number':
			return isFinite(object) ? object.toString() : 'null';
			break;
			case 'string':
				return '"'
						+ object.replace(/(\\|\")/g, "\\$1").replace(
								/\n|\r|\t/g,
								function() {
									var a = arguments[0];
									return (a == '\n') ? '\\n'
											: (a == '\r') ? '\\r'
													: (a == '\t') ? '\\t' : "";
								}) + '"';
				break;
			case 'object':
				if (object === null)
					return 'null';
				var results = [];
				for ( var property in object) {
					var value = Fix.Util.encode(object[property]);
					if (value !== undefined)
						results.push(Fix.Util.encode(property) + ':' + value);
				}
				return '{' + results.join(',') + '}';
				break;
			case 'array':
				var results = [];
				for ( var i = 0; i < object.length; i++) {
					var value = Fix.Util.encode(object[i]);
					if (value !== undefined)
						results.push(value);
				}
				return '[' + results.join(',') + ']';
				break;
			}
		},
	/**
	 * @author char
	 * @description 用来给单个参数值编码
	 * @param {String} paramVal url字符串
	 * @return 编码后的url字符串
	 */
	urlEncode : function(paramVal) {
		return encodeURIComponent(encodeURIComponent(paramVal));
	},
	/**
	 * @author char
	 * @description 用来给完整的utl编码
	 * @param {String} url url字符串
	 * @return 编码后的url字符串
	 */
	urlEncodeFull : function(url) {
		var index = url.indexOf("?");
		var returnVal = "";
		var queryStr = "";
		if (index > -1) {
			queryStr = url.substring(index + 1);
			returnVal = url.substring(0, index) + "?";

			var params = queryStr.split('&');
			var firstParam = true;
			for ( var i = 0; i < params.length; i++) {
				var param = params[i];
				var tmpIndex = param.indexOf('=');

				if (!firstParam) {
					returnVal = returnVal + "&";
				} else {
					firstParam = false;
				}

				if (tmpIndex > -1) {
					var paramName = param.substring(0, tmpIndex);
					var paramVal = param.substring(tmpIndex + 1);
					paramVal = this.urlEncode(paramVal);
					returnVal = returnVal + paramName + "=" + paramVal;
				} else {
					returnVal = returnVal + param;
				}
			}
		} else {
			returnVal = url;
		}

		return returnVal;
	},
	/**
	 * @author char
	 * @description 用来给单个参数值解码
	 * @param {String} str url字符串
	 * @return 解码后的url字符串
	 */
	urlDecode : function(str) {
		var urlParam;
		try{
			urlParam = decodeURIComponent(decodeURIComponent(str));
		}catch(e){
			urlParam = unescape(unescape(str));
		}
		return urlParam
	},
	/**
	 * @author elvis
	 * @description 生成GUID
	 * @return GUID
	 */
	newGuid : function() {
		var guid = "";
		for ( var i = 1; i <= 32; i++) {
			var n = Math.floor(Math.random() * 16.0).toString(16);
			guid += n;
			if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
				guid += "-";
		}
		return guid;
	},
	/**
	 * @author elvis
	 * @description 获取字段名，用于配置列名时，给列重命名时，需要获取最终列名
	 * @example
	 * 输入可以是：A as ColumnA
	 * 得到的结果为ColumnA
	 * @param {String} fieldName可能带有重命名的SQL列字符串
	 * @return 返回重命名后的名字
	 */
	extractFieldName:function(fieldName){
		if(fieldName.lastIndexOf(" ") > -1){
			var extractName = fieldName.substring(fieldName.lastIndexOf(" ") + 1);
			return extractName;
		}else
			return fieldName;
	},
	extractOriginalFieldName:function(fieldName){
		if(fieldName.indexOf(" ") > -1){
			var extractName = fieldName.substr(0, fieldName.indexOf(" "));
			return extractName;
		}else
			return fieldName;
	},
	
	/**
	 * @author rex
	 * @description 将Json格式从ext变成ztree格式
	 * @param {TO list} _store从后台获取的数据TO list
	 * @return 符合ztree格式的TO list
	 */
	tranJsonExtToZtree : function(_store){
		var strJson = Fix.Util.encode(_store);
		var reg = new RegExp('"text"',"g");
		strJson = strJson.replace(reg,'"name"');
		var reg = new RegExp('"expanded"',"g");
		strJson = strJson.replace(reg,'"open"');
		var reg = new RegExp('"leaf":true',"g");
		strJson = strJson.replace(reg,'"isParent":false');
		var reg = new RegExp('"leaf":false',"g");
		strJson = strJson.replace(reg,'"isParent":true');
		var reg = new RegExp('"available":"0"',"g");
		strJson = strJson.replace(reg,'"nocheck":true');
		_store = Fix.Util.decode(strJson);
		return _store;
	}
};

/**
 * @author elvis
 * @description 全部替换
 * @param {String} s1 查找的字符或正则表达式
 * @param {String} s2 需要替换的字符串
 */
String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
};

/**
 * @author char
 * @description 平台封装的ajax交互功能
 * @param {JSON} opts 参数,{function} success:成功时的回调事件;{String} url:提交的服务端地址
 */
Fix.ajax = function(opts) {
	var json = {};
	if (opts && opts.action) {
		var tmp = {};
		//要执行的服务前面
		$.extend(tmp, opts.action);
		//用于前事件后事件的标识
		if(opts.requestEventData){
			tmp["requestEventData"] = opts.requestEventData;
		}
		
		//服务参数
		$.extend(tmp, opts.data);
		json['FixJSON'] = Fix.Util.encode(tmp);
		delete opts.data;
	}
	
	if(opts && opts.requestEventData){
		
	}
	
	var notify = {
		title: '错误',
		//text: str_msg,
		type: 'error',
		hide: false,
		shadow: true,
		sticker: false,
		width: '250px',
		history:false
	};

	
	var successFuc = function(response) {
		// 如果action返回用户未登录，则获取登录页面并跳转重新登录
		if (response && response.UserNotLogin) {
			var loginform = response.loginform;
			Fix.Util.getTopWin().location = loginform;
			return;
		}
		
		//如果后台输出了提示信息，则弹出提示信息
		if(response && response.fixPopMessage){
			var popMsgs = response.fixPopMessage.join("\n\n");
			//alert(popMsgs);
			notify.text = popMsgs;
			Fix.Util.getTopWin().$.pnotify_remove_all();
			Fix.Util.getTopWin().$.pnotify(notify);
		}
		
		//如果后台需要跳转到统一处理页面，则将top页面跳转
		if (response && response.msgPage) {
			var msgPage = response.msgPage;
			Fix.Util.getTopWin().location = msgPage;
			return;
		}
		
		//如果后台抛出了异常，则提示错误信息
		if(response && response.FixError){
			var errorInfo = response.FixError;
			//alert(errorInfo);
			notify.text = errorInfo;
			try{
				Fix.Util.getTopWin().$.pnotify_remove_all();
				Fix.Util.getTopWin().$.pnotify(notify);
				$.unblockUI();
			}catch(err){
				//alert("该页面有异常错误，但该页面未加载ponotify错误提示模块的相关JS，请检查！");
				//add by chenmin 20151215 针对miniui后台错误
				var s="<strong>错误信息如下：</strong><br>"+errorInfo;
			    var win = window.open('', "", 'height=400,width=600,top=200,left=400,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no, titlebar=no');
			    win.document.open('text/html', 'replace');
			    win.document.write(s);
			    win.document.close();
			    $.unblockUI();
			}
			return;
		}

		if (typeof (opts.success) == 'function') {
			opts.success(response);
		}
		if (setting.loading) {
			Fix.Helper.fn_LoadClose();
		}
	};

	var errorFuc = function(XMLHttpRequest, textStatus, errorThrown) {
		var status = XMLHttpRequest.status;
		if(status == 500){
			//alert("服务器端异常,请联系管理员");
			notify.text = "服务器端异常,请联系管理员";
			Fix.Util.getTopWin().$.pnotify_remove_all();
			Fix.Util.getTopWin().$.pnotify(notify);
		}else if(status == 400){
			alert("发生错误:所请求的页面不存在");
		}
		
	};
	var actionUrl = 'servlet/Action.cmd'+window.location.search;
	if(opts.url){
		actionUrl = opts.url;
		delete opts.url;
	}
	else{
		if(Fix.App.appHost == ''){
			Fix.App.getHost();
		}
		
		actionUrl = Fix.App.appHost + actionUrl;
	};
	
	var setting = {
		type : 'post',
		url : actionUrl,
		dataType : 'json',
		data : json,
		error : errorFuc,
		loading : false
	};

	$.extend(setting, opts);

	setting.success = successFuc;
	if (setting.loading) {
		Fix.Helper.fn_LoadOpen();
	}
	return $.ajax(setting);
};

/**
 * @author char
 * @description 获取URL问号之后的参数
 * @param {String} url url地址
 * @return {Object} 通过参数名：值的方式集合的JSON对象
 */
Fix.getURLParams = function(url) {
	var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
	var paraObj = {};
	for (var i = 0; j = paraString[i]; i++) {
		var paramVal = j.substring(j.indexOf("=") + 1, j.length);
		
		paraObj[j.substring(0, j.indexOf("="))] = Fix.Util.urlDecode(paramVal);
	}
	return paraObj;
};

/**
 * @author char
 * @description 在url后面再拼接参数
 * @param {String} url 可以是带?或是不带的
 * @param {String} params 可以是 a=1&b=2 或者 {a:1,b:2}
 * @return 返回新的URL
 */
Fix.appendParams = function(url, params) {
	var newUrl = url;
	var index = url.indexOf("?");
	if (index == -1) {
		newUrl = newUrl + "?";
	}else{
		if(index < newUrl.length -1){
			if(newUrl[newUrl.length -1] != "&")
				newUrl = newUrl + "&";
		}
	}

	if ($.isPlainObject(params)) {
		newUrl += $.param(params);
	} else {
		newUrl += params;
	}

	return newUrl;
};

/**
 * @author char
 * @description 获取表单名
 * @return 返回表单名
 */
Fix.getFormId = function(){
	//var url = window.location.href;
	//只截取路径部分，不包括后面的查询参数，否则可能参数里面会有“点”之类影响截取
	//modify by qj 2013-03-23
	var url = window.location.pathname;
	var lastSlash = url.lastIndexOf("\/");
	var lastDot = url.lastIndexOf(".");
	var formId = url.substring(lastSlash+1, lastDot);
	return formId;
};

/**
 * @author elvis
 * @description 创建Fix组件对象
 * @param {String} className 组件类全名
 * @return 返回创建好的组件对象
 */
Fix.create = function(className) {

	var evalStr = 'var newObj = new ' + className + '(';
	var args = [];
	for ( var i = 1; i < arguments.length; i++) {
		args.push('arguments[' + i + ']');
	}

	evalStr += args.join(',') + ')';
	try{
		eval(evalStr);
	}
	catch(e){
		alert("创建 "+className+"出错!\n错误信息:"+Fix.Helper.getErrMsg(e));
	}
	return newObj;
};

/** @namespace Fix.Helper 组件命名空间*/
Fix.Helper = {
	/** 
	 * @author Rex
     * @description 解释格式化模板 
	 * @param {Object} _colFormat 模板信息
     */ 
	explainStyleTpl : function(_colFormat){
		var arr_matched_ctl = [];
		var style = _colFormat.style;
		var type = _colFormat.styleType;
		if(type == "html")
			//arr_matched_ctl = Fix.Helper.fn_extraction(style, "{", "}");
			arr_matched_ctl[0] = style;
		else{
			var doubleMatched = Fix.Helper.fn_extraction(style, "\"{", "}\"");
			var singleMatched = Fix.Helper.fn_extraction(style, "'{", "}'");
			arr_matched_ctl = doubleMatched.concat(singleMatched);
		}
		var matches = [];
		for (var i=0; i < arr_matched_ctl.length; i++) {
			var match = {};
			var str_result = arr_matched_ctl[i];
			match.result = str_result;
			var str_express = "";
			if(type == "html")
				//str_express = str_result.replace("{", "").replace("}", "");
				str_express = str_result;
			else{
				str_express = str_result.replace("\"{", "").replace("}\"", "");
				str_express = str_express.replace("'{", "").replace("}'", "");
			}
			match.express = str_express;
			matches.push(match);
		}
		
		return matches;
	},
	/** 
     * @description {jQuery} 加载页面时的对话框 
     * @field 
     */ 
	jQy_loading : $("<div>载入中...</div>"),
	/** 
     * @description {jQuery} 加载页面时的进度条 
     * @field 
     */ 
	jQy_progressBar: $("<div id='progressbar'></div>"),
	/** 
     * @description {Array} 当前页面中所有的验证出错的对象 
     * @field 
     */ 
	CurrErrObj:[],
	/**
	 * @author elvis
	 * @description 在页面增加进度条
	 */
	init: function(){
		$(document).after(this.jQy_progressBar);
	},
	/**
	 * @author elvis
	 * @description 设置弹出对象的位置
	 * @param {jQuery} jQy_btn 参照对象
	 * @param {html} obj_container 弹出层对象
	 * @param {bool} OutOfFrame 是否跨层计算位置
	 */
	SetPosition : function(jQy_btn, obj_container, OutOfFrame) {
		var position;
		var $source;
		if(OutOfFrame){
			position = $E.getPosition(jQy_btn[0]);
			$source = $(jQy_btn);
			position.x += 8;
			position.y += 40;
		}else{
			var $source = jQy_btn;
			if(jQy_btn[0].el !== undefined && jQy_btn[0].el.dom !== undefined)
				$source = $(jQy_btn[0].el.dom);
			position = $source.offset();
			position.x = position.left;
			position.y = position.top;
			
			if ((obj_container.width() + position.x) > $(window).width())
				position.x = position.x - obj_container.width();
			if(position.top >= obj_container.height()){
				if ((obj_container.height() + position.y) > window.innerHeight)
					position.y = position.y - obj_container.height() - $source[0].clientHeight;
			}
		}
		
		var int_left = position.x;
		var int_top = position.y + $source[0].clientHeight;
		
		
		obj_container.css({
			left : int_left + 'px',
			top : int_top + 'px'
		});	
	},
	/**
	 * @author elvis
	 * @description 弹出对象的显示状态切换
	 * @param {html} obj_container 弹出层对象
	 */
	ShowHide : function(obj_container) {
		if (obj_container.is(':visible'))
			obj_container.hide();//.fadeOut('fast');
		else
			obj_container.show();// fadeIn('fast');
	},
	/**
	 * @author elvis
	 * @description 正则表达式获取特定匹配值
	 * @param {String} str_argument 需要萃取数据的字符串
	 * @param {String} str_left 左边界定符
	 * @param {String} str_right 右边界定符
	 */
	fn_extraction : function(str_argument, str_left, str_right) {
		var regex = new RegExp(str_left + "(.*?)" + str_right, "ig");
		var arr_matched = str_argument.match(regex);

		if (arr_matched != null)
			return arr_matched;
		else
			return [];
	},
	/**
	 * @author elvis
	 * @description 打开蒙板
	 */
	fn_LoadOpen : function() {
		$(document).after(this.jQy_loading);
		this.jQy_loading.dialog({
			dialogClass: "sl-shadow",
			modal : true
		});
	},
	/**
	 * @author elvis
	 * @description 关闭蒙板
	 */
	fn_LoadClose : function() {
		this.jQy_loading.dialog("close");
	},
	/**
	 * @author elvis
	 * @description 注册平台托管事件
	 * @param {Function} fn 需要监听的函数
	 * @param {Fix.Event} _fixEvent 事件处理对象
	 */
	fn_registerEvent : function(fn, _fixEvent) {
		if (typeof fn == "function")
			return fn.addListener(_fixEvent);
		else if(fn == "null"){
			_fixEvent.clear();
			return _fixEvent;
		}
		else
			return _fixEvent;
	},
	/**
	 * @author elvis
	 * @description 注册HTML事件
	 * @param {Object} obj_COMSelf 需要附加事件的对象
	 * @param {Array} obj_events 事件列表
	 */
	fn_registerCOMEvent: function(obj_COMSelf, obj_events){
		if(obj_COMSelf instanceof jQuery){
			for(var event in obj_events){
				obj_COMSelf.unbind(event);
			}
		}
		for(var event in obj_events){
			if(typeof obj_events[event] === "function"){
				var str_event = "obj_COMSelf." + event + "(obj_events[event])";
				eval(str_event);
			}else{
				var str_event = "obj_COMSelf." + event + "(eval(obj_events[event]))";
				eval(str_event);
			}
		}
	},
	/**
	 * @author elvis
	 * @description 对HTML控件赋值
	 * @param {html} html_ctl 需要赋值的HTML对象
	 * @param {String} str_value 值
	 */
	fn_SetValue: function(html_ctl, str_value) {
		if(html_ctl.nodeName == "INPUT" || html_ctl.nodeName == "TEXTAREA") {
			if(html_ctl.type == "checkbox")
				html_ctl.checked = str_value;
			else
				html_ctl.value = str_value;
		} else if(html_ctl.nodeName == "SELECT")
			html_ctl.value = str_value;
		else if(html_ctl.nodeName == "IMG")
			html_ctl.src = this.getFirstFile(str_value);//str_value;
		else
			html_ctl.innerHTML = str_value;
	},
	/**
	 * @author elvis
	 * @description 对HTML控件赋值
	 * @param {html} html_obj 验证目标
	 * @param {String} str_msg 错误提示信息
	 * @param {String} in_position 错误提示信息位置
	 * @param {String} displayMode 显示模式
	 * @param {String} errObjID 自定义错误提示的HTML控件ID
	 */
	setError: function(html_obj, str_msg, in_position, displayMode, errObjID){
		if($.pnotify){
			var jQy_source = $(html_obj);
			//var id = jQy_source.attr("id");
			var notify = {
					title: '错误',
					text: str_msg,
					type: 'error',
					hide: false,
					shadow: true,
					sticker: false,
					width: '250px'
				};
			
			var flg = false;
			for(var i = 0; i < this.CurrErrObj.length; i++){
				if(this.CurrErrObj[i].source[0] == jQy_source[0]){
					flg = true;
					break;
				}
			}
			if(!flg)
				this.CurrErrObj.push({source:jQy_source});
			
			var permanotice;
			for(var i = 0; i < Fix.Helper.CurrErrObj.length; i++){
				if(Fix.Helper.CurrErrObj[i].source[0] == jQy_source[0]){
					if(Fix.Helper.CurrErrObj[i].notice){
						Fix.Helper.CurrErrObj[i].notice.pnotify_display();
						break;
					}else{
						permanotice = Fix.Util.getTopWin().$.pnotify(notify);
						Fix.Util.getTopWin().Fix.Manager.CurrErrArray.push(permanotice);
						Fix.Helper.CurrErrObj[i].notice = permanotice;
						break;
					}
				}
			}
			jQy_source.addClass("failformcss");
			//permanotice = $.pnotify(notify);
			//this.CurrErrObj.push({source:jQy_source, notice:permanotice, orgClass:orgClass});
		}else{
			if(displayMode === undefined)
				displayMode = "icontext";
			var obj_position = $.extend({}, in_position);
			var jQy_source = $(html_obj);
			
			for(var i = 0; i < this.CurrErrObj.length; i++){
				if(this.CurrErrObj[i].source[0] == html_obj)
					return;
			}
			
			var position = jQy_source.offset();
			var left = position.left + 1;
			var _top = position.top + 1;
			
			var div_err = $("<span class='err_style'></span>");
			var img_err = $("<img src='../../../theme/current/images/verifyError.gif' style='vertical-align : text-top;width:16px;height:16px;'>");
			if(displayMode == "icontext"){
				div_err.append(img_err).append(str_msg);
			}else if(displayMode == "icon"){
				div_err.append(img_err);
			}else if(displayMode == "text"){
				div_err.append(str_msg);
			}
				

			if(errObjID === undefined || errObjID == ""){
				div_err.css({
					//float : 'left',
					position: "absolute",
					display: "block"
					//width:"auto"
					//lineHeight:jQy_source[0].style.height,
					//height:jQy_source[0].style.height
				}).attr("title",str_msg);
				div_err.attr("title",str_msg);
				
				jQy_source.after(div_err);
				
				var ua = $.browser;
				var str_offset = "-3 3";
				
				var obj_default_position = {of:jQy_source, my:"right top", at:"right top",offset: str_offset, collision:"flip flip"};
				$.extend(obj_default_position, obj_position);
				div_err.position(obj_default_position);
			}else{
				var $contain = jQy_source.closest(".row-status-default");
				if($contain.length == 0)
					$("[id='" + errObjID + "']").empty().append(div_err).attr("title",str_msg);
				else
					$("[id='" + errObjID + "']", $contain).empty().append(div_err).attr("title",str_msg);
			}
			
			div_err.click(function(){
				var that = $(this);
				for(var i = 0; i < Fix.Helper.CurrErrObj.length; i++){
					if(Fix.Helper.CurrErrObj[i].notice[0] == this)
						Fix.Helper.CurrErrObj.splice(i,1);
				}
				that.fadeOut("fast", function(){
					$(this).remove();
				});
			});
			
			//div_err.show().fadeOut(2500);
			
			this.CurrErrObj.push({source:jQy_source, notice:div_err});
			
			delete obj_position;
		}
	},
	/**
	 * @author elvis
	 * @description 清除错误提示
	 * @param {html} html_source 需要清除错误提示信息的对象
	 */
	clearError: function(html_source){
		if($.pnotify){
			var $btn = $(html_source);
			for(var i = 0; i < Fix.Helper.CurrErrObj.length; i++){
				if(Fix.Helper.CurrErrObj[i].source[0] == html_source){
					$btn.removeClass("failformcss");
					if(Fix.Helper.CurrErrObj[i].notice){
						Fix.Helper.CurrErrObj[i].notice.pnotify_remove();
						delete Fix.Helper.CurrErrObj[i].notice;
					}
					return;
				}
			}
			$btn.removeClass("failformcss");
			//this.CurrErrObj.push({source:$btn});
		}else{
			var $btn = $(html_source);
			for(var i = 0; i < Fix.Helper.CurrErrObj.length; i++){
				if(Fix.Helper.CurrErrObj[i].source[0] == html_source){
					var js_err = Fix.Helper.CurrErrObj.splice(i,1);
					js_err[0].notice.fadeOut("fast", function(){
						$(this).remove();
					});
				}
			}
		}
	},
	/** @class 延迟任务*/
	DelayedTask : function(fn, scope, args) {
	    var me = this,
	        id,
	        call = function() {
	            clearInterval(id);
	            id = null;
	            fn.apply(scope, args || []);
	        };

	    /**
	     * @description Cancels any pending timeout and queues a new one
	     * @param {Number} delay The milliseconds to delay
	     * @param {Function} newFn (optional) Overrides function passed to constructor
	     * @param {Object} newScope (optional) Overrides scope passed to constructor. Remember that if no scope
	     * is specified, <code>this</code> will refer to the browser window.
	     * @param {Array} newArgs (optional) Overrides args passed to constructor
	     */
	    this.delay = function(delay, newFn, newScope, newArgs) {
	        me.cancel();
	        fn = newFn || fn;
	        scope = newScope || scope;
	        args = newArgs || args;
	        id = setInterval(call, delay);
	    };

	    /**
	     * @description Cancel the last queued timeout
	     */
	    this.cancel = function(){
	        if (id) {
	            clearInterval(id);
	            id = null;
	        }
	    };
	},
	/**
	 * @author elvis
	 * @description 下载文件
	 * @example
	 * $("#button").click(function(){
	 *	Fix.Helper.download("streamSupportService.getImportModule", "fieldList:['TEST1','TEST2','TEST3'],hasCaption:'true',importService:'TESTTABLE50FIELD.insert',fieldSplit:',',rowSplit:';',importFileType:'excel'");
	 * });
	 * @param {String} _methodID 后台服务
	 * @param {String} _params 传递参数
	 */
	download: function(_methodID, _params){
		
		if(_params === undefined)
			_params = "";
		
		var $iframe_obj = $("#DownloadFile",$(document))||$("#DownloadFile",Fix.Util.getTopWin().document.body);//修改附件下载不同虚拟目录出错的问题 shensn 20130927
		//var $iframe_obj = $("#DownloadFile",Fix.Util.getTopWin().document.body);
		var $iframe_body = $($iframe_obj[0].contentWindow.document.body);
		
		var $form = $("form", $iframe_body);
		var $FixJSON = $("#FixJSON", $form);
		$FixJSON.val("{'_method':'" + _methodID + "','_param':{" + _params + "}}");
		//兼容W3C标准，兼容FF、IE、Chrome
		//$iframe_obj[0].contentDocument.getElementById("postform").submit();
		$form.submit();
	},
	/**
	 * @author elvis
	 * @description Uniform界面上导出文件
	 * @example
	 * $("#button").click(function(){
	 *	Fix.Helper.exportFile(Fix.DataGrid.postJson, This.setting);
	 * });
	 * @param {String} json_config Uniform的DataGrid的PostJSON
	 * @param {String} options 参数
	 */
	exportFile: function(json_config, options){
		if(options.exportType === undefined || options.exportType == "")
			options.exportType = "excel";
		options.exportType = options.exportType.toLowerCase();
		
		var innerJson = $.extend({},json_config);
		innerJson.start_Row = 0;
		innerJson.pageSize = 9999999;
		innerJson.currentPageIndex = 1;
		if(options.service === undefined)
			options.service = "";
		//innerJson.exp_service = options.service;
		innerJson.service = options.service;
		
		if(options.fields === undefined)
			options.fields = "";
		innerJson.fields = options.fields;
		var filter = json_config.filter;
		innerJson.filter = filter;
		//add by chenmin 20131123 增加一个表单查询FormData 数据 
		var QueryFormData = Fix.Uniform.uniform.Runtime.QueryFormData || "";
		innerJson.QueryFormData = QueryFormData;
		
		innerJson.orderList = options.orderList;//add by YT 20141124 导出支持排序
		
		if(options.fileName === undefined || options.fileName == "")
			options.fileName = "{sysLoginUser.userId}.xls";
		options.fileName = Fix.Format.expression(options.fileName);
		var nowDate = new Date();
		var formatName = Fix.Format.route(nowDate,options.fileName,"");
		if(formatName instanceof Date)
			innerJson.file_name = options.fileName;
		else
			innerJson.file_name = formatName;

		innerJson.export_Type = options.exportType;
		innerJson.sheet_name = options.sheetName;
		innerJson.show_org_value = options.show_org_value;
		innerJson.show_caption = true;//options.show_caption;//文件导出，标题支持中文 add by chenmin 
		if(options.showHiddenColumn !== undefined)
			innerJson.show_hidden_column = options.showHiddenColumn;
		else if(options.showHiddenColumn !== undefined)
			innerJson.show_hidden_column = options.showHiddenColumn;
		else
			innerJson.show_hidden_column = false;
		
		innerJson._method = "streamSupportService.exportInfo";
		var pj = Fix.Util.encode(innerJson);
		var $iframe_obj = $("#DownloadFile",$(document))||$("#DownloadFile",Fix.Util.getTopWin().document.body);//修改导出时不同虚拟目录出错的问题 shensn 20130927
		//var $iframe_obj = $("#DownloadFile",Fix.Util.getTopWin().document.body);
		var $iframe_body = $($iframe_obj[0].contentWindow.document.body);
		
		var $form = $("form", $iframe_body);
		var $FixJSON = $("#FixJSON", $form);
		$FixJSON.val(pj);
		//兼容W3C标准，兼容FF、IE、Chrome
		//$iframe_obj[0].contentDocument.getElementById("postform").submit();
		$form.submit();
	},
	/**
	 * @author elvis
	 * @description 生成平台提交服务的URL
	 * @param {String} _methodID 后台服务
	 * @param {String} _params 传递参数
	 */
	/*
	getURL: function(_methodID, _params){
		return Fix.App.getHost() + "servlet/StreamSupportAction.cmd?type=customerDownloadService&FixJSON={'_method':'" + _methodID + "','_param':{" + _params + "}}";
	},*/
	//支持跨服务器获取附件 add by chenmin 20140815
	getURL: function(_methodID, _params,_webName){
		var url="";
		if (typeof _webName=="undefined")
			url=Fix.App.getHost() + "servlet/StreamSupportAction.cmd?type=customerDownloadService&FixJSON={'_method':'" + _methodID + "','_param':{" + _params + "}}";
		else
		   url= hostMap[_webName] + "servlet/StreamSupportAction.cmd?type=customerDownloadService&FixJSON={'_method':'" + _methodID + "','_param':{" + _params + "}}";
		
		return url;
			
	},
	//附件预览地址 add by chenmin 20140928
	getFileViewURL: function(attachmentId,webName){
		 var url=hostMap["pm"] + "pageoffice/popdf/pdfview.jsp?attachmentId="+attachmentId+"&webName="+webName;
		// var url="http://b.simulate.com:8080/systemcenter/pageoffice/popdf/pdfview.jsp?attachmentId="+attachmentId;
		
		 return url
			
	},
	/**
	 * @author elvis
	 * @description 生成下载附件第一个文件的URL
	 * @example
	 * $("img").src = Fix.Helper.getFirstFile(_fieldToken);
	 * @param {String} _methodID 后台服务
	 * @param {String} _params 传递参数
	 */
	getFirstFile: function(fieldToken){
		return this.getURL("streamSupportService.getFirstAttachment", "params:{fieldToken:'" + fieldToken + "'}");
	},
	/**
	 * @author elvis
	 * @description 附加值
	 * @param {jQuery} $obj 目标对象
	 * @param {String} str_value 值
	 * @param {String} separating 分隔符
	 */
	appendValue: function($obj, str_value, separating){
		var org_value = $obj.val();
		var new_value = "";
		if(org_value == "")
			new_value = str_value;
		else
			new_value = org_value + separating + str_value;
		$obj.val(new_value);
	},
	/**
	 * @author elvis
	 * @description 处理try catch的异常详细信息 ie和chrome,FF对象的属性不用
	 * @param {Object} err 错误对象
	 */
	getErrMsg:function(err){
		//IE
		if(err.description){
			return err.description;
		}
		//Chrome, FF
		else if(err.message){
			return err.message;
		}
		else{
			return "";
		}
	},
	/**
	 * @author elvis
	 * @description 获取源对象所处在的范围，如果是明细表，则返回当前明细表行
	 * @param {jQuery} $source 源对象
	 */
	getScope:function($source){
		var $scope = $source.closest(".row-status-default");
		if($scope.length == 0)
			$scope = $(document);
		return $scope;
	},
	CleanSearch:function($panel){
    	$("input:text", $panel).val("");
    },
    /**
     * @author Rex
	 * @description 获取所在的tab容器
     */
    getThisTab: function(){
    	//var $tab = $(window.frameElement).parent("div").closest("div[fixType]");
    	//var tabsId = $tab.attr("id");
    	var tabObj = parent.MainTab;
    	return tabObj;
    },
    closeThisTab: function(){
    	var tabObj = this.getThisTab();
    	if(tabObj!=undefined){
    		tabObj.remove($(tabObj.historyTabs[0]));
    	}else{
			window.opener.location.reload();
			window.close();
    	}
    },
    refreshDataTable:function(){
    	if(this.getThisTab()!=undefined){
	    	var pId = this.getThisTab().historyTabs[0].pId;
			parent.$("iframe","#content_"+pId)[0].contentWindow.Fix.Uniform.reload("1=1");
    	}else{
    		return;
    	}
    }
};

/**
* @author elvis
* @class 动态脚本加载器
* @example
*	var loader = new Fix.Loader(arr_JsRef, Fix.Engine.BaseURL, function(){
*		return;
*	});
*	loader.load();
* @param {Array} arr_js 需要加载的JS文件路径
* @param {String} str_baseURL web站点跟路径
* @param {Function} fn_success 当全部加载完毕后，回调函数
*/ 
Fix.Loader = (function(arr_js, str_baseURL, fn_success){
	/** @lends Fix.Loader */
	var _arr_javascript_block = arr_js;
	var _current_index = 0;
	var _str_baseURL = str_baseURL;
	
	return {
		/**
		* @description 装在下一个脚本文件
		*/
		next:function(){
			if(_current_index >= _arr_javascript_block.length){
				fn_success();
				return "";
			}
			else
			{
				var str_script = _arr_javascript_block[_current_index];
				_current_index++;
				return str_script;
			}			
		},
		/**
		 * @description 开始动态加载JS
		 */
		load:function(){
			var that = this;
			var str_script = this.next();
			if(str_script == "")
				return;
			var obj_script = JsImport(_str_baseURL + str_script);
			if(obj_script === true){
				that.load();
			}else{
				if ($.browser.msie) {
					var loadEventTask = new Fix.Helper.DelayedTask(function(){
						if (obj_script.readyState == "complete" || obj_script.readyState == "loaded") {
							that.load();
							return;
						}
						loadEventTask.delay(1);
					});
					loadEventTask.delay(1);
				}else{
					obj_script.onload = function(){
						that.load();
					};
				}
			}
		},
		loadCSS: function(){
			if(_arr_javascript_block !== undefined && _arr_javascript_block != null && _arr_javascript_block.length > 0){
				var arr_FixCSSRef = _arr_javascript_block;
				//动态CSS装载
				for(var i = 0; i < arr_FixCSSRef.length; i++){
					var existsCSS = false;
					$("link[rel=stylesheet]").each(function(){
						if(this.href == Fix.App.getHost() + arr_FixCSSRef[i])
							existsCSS = true;
					});
					if(!existsCSS)
						$("head").append('<link rel="stylesheet" type="text/css" href="' + Fix.App.getHost() + arr_FixCSSRef[i] + '" />');
				}
			}
		}
	};
	
	/**@private*/
	function JsImport(path) {
		var i;
		var ss = document.getElementsByTagName("script");
		for (i = 0; i < ss.length; i++) {
			if (ss[i].src && ss[i].src.indexOf(path) != -1) {
				return true;
			}
		}
		var s = document.createElement("script");
		s.type = "text/javascript";
		s.src = path;
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(s);
		return s;
	}
});

/**
 * @author elvis
 * @class 类型格式化
 */ 
Fix.Format = (function(){
	/** @lends Fix.Format */
	var _className = "Fix.Format";
	return {
		/**
		 * @description 多格式判断器
		 * @param {String} str_in 需要格式化的字符串
		 * @param {String} fmt 格式化表达式
		 * @param {String} str_blankFmt 为空时，默认值
		 */
		route:function(str_in, fmt, str_blankFmt){
			
			if(str_blankFmt === undefined)
				str_blankFmt = "";
			if(str_in == null||str_in == "")
				return str_blankFmt;
			
			var regExp = /\{(.*?):(.*)\}/g;
			var matches = regExp.exec(fmt);
			if(matches == null){
				//alert((new Fix.Exception("FormatIsInvalid", _className, [str_in, fmt,str_blankFmt])).description);
				return str_in;
			}
				
			if(matches.length > 1){
				var str_type = matches[1];
				var str_format = matches[2];
				var str_source = "";
				switch(str_type){
					case "number":
						if(!isFinite(str_in))
							str_source = str_blankFmt;
						else
							str_source = this.formatNumber(str_in, str_format);
						break;
					case "date":
						str_source = this.StringToDate(str_in).format(str_format);
						if (str_source == "Na-Na-Na")
							str_source = str_blankFmt;
						break;
					case "size":
						str_source = this.formatSize(str_in);
						break;
					default:
						break;
				}
				
				return fmt.replace(regExp, str_source);
			}else{
				return str_in;
			}
			
		},
		/**
		 * @description 系统变量解释
		 * @param {String} str_in 需要解析的字符串
		 */
		expression: function(in_str){
			//系统变量解释
			var regex = new RegExp("(\{).*?(\})", "ig");
			var arr_match = in_str.match(regex);

			if(arr_match != null){
				for(var int_count = 0; int_count < arr_match.length; int_count++){
					var str_express = arr_match[int_count];
					if (str_express.indexOf(".") > -1){
						
						var regfmt = /\{(.*)\.(.*)\}/g;
						var matches = regfmt.exec(str_express);
						if(matches.length > 1){
							var str_type = matches[1];
							var str_property = matches[2];
							
							if(str_type == "sysLoginUser"){
								in_str = in_str.replace(str_express, Fix.Util.getTopWin().onlineUser[str_property]);
							}						
						}
					}
				}
			}
			//系统变量解释
			return in_str;
		},
		/**
		 * @description 字符串转日期类型
		 * @param {String} DateStr 需要解析的字符串
		 * @retrun 日期类型变量
		 */
		StringToDate:function(DateStr){
		    var converted = Date.parse(DateStr);
		    var myDate = new Date(converted);
		    if (isNaN(myDate)&&myDate!=undefined)
		    {
		    	var p; 
		        var re1 = /^(\d{4})[年.\/-](\d{1,2})[月.\/-](\d{1,2})[日]?/;
		        var re2 = /^(\d{4})(\d{1,2})(\d{1,2})/;
		        var re3 = /^(\d{1,2})[月.\/-](\d{1,2})[日.\/-](\d{4})[年]?/;
		        var timeArys = DateStr.substr(DateStr.indexOf(" ") + 1).split(":");
		        if(timeArys.length == 1 && timeArys[0] == DateStr)
		        	timeArys.pop();
		        if(timeArys.length < 3){
		        	for(var i = timeArys.length; i < 3; i++){
		        		timeArys.push(0);
		        	}
		        }
		        //标准月份，从0开始至11，表示12个月份，在IE中则是从1开始至12.
		        if(re1.test(DateStr)) { 
		            p = re1.exec(DateStr);
		            myDate = new Date(p[1],--p[2],p[3], timeArys[0], timeArys[1], timeArys[2]); 
		        }
		        if(re2.test(DateStr)) { 
		            p = re2.exec(DateStr);
		            myDate = new Date(p[1],--p[2],p[3], timeArys[0], timeArys[1], timeArys[2]); 
		        }
		        if(re3.test(DateStr)) { 
		            p = re3.exec(DateStr); 
		            myDate = new Date(p[3],--p[1],p[2], timeArys[0], timeArys[1], timeArys[2]);
		        }
		    }
		    return myDate;   
		},
		/**
		 * @description 格式化数字
		 * @param {Number} number 数字类型变量
		 * @param {String} pattern 格式化表达式
		 * @retrun 格式化完毕的字符串
		 */
		formatNumber:function(number,pattern){
		    var str = number.toString();
		    var strInt;
		    var strFloat;
		    var formatInt;
		    var formatFloat;
		    if(/\./g.test(pattern)){
		        formatInt = pattern.split('.')[0];
		        formatFloat = pattern.split('.')[1];
		    }else{
		        formatInt = pattern;
		        formatFloat = null;
		    }

		    if(/\./g.test(str)){
		        if(formatFloat!=null){
		            var tempFloat = Math.round(parseFloat('0.'+str.split('.')[1])*Math.pow(10,formatFloat.length))/Math.pow(10,formatFloat.length);
		            strInt = (Math.floor(number)+Math.floor(tempFloat)).toString();                
		            strFloat = /\./g.test(tempFloat.toString())?tempFloat.toString().split('.')[1]:'0';            
		        }else{
		            strInt = Math.round(number).toString();
		            strFloat = '0';
		        }
		    }else{
		        strInt = str;
		        strFloat = '0';
		    }
		    if(formatInt!=null){
		        var outputInt = '';
		        var zero = formatInt.match(/0*$/)[0].length;
		        var comma = null;
		        if(/,/g.test(formatInt)){
		            comma = formatInt.match(/,[^,]*/)[0].length-1;
		        }
		        var newReg = new RegExp('(\\d{'+comma+'})','g');

		        if(strInt.length<zero){
		            outputInt = new Array(zero+1).join('0')+strInt;
		            outputInt = outputInt.substr(outputInt.length-zero,zero);
		        }else{
		            outputInt = strInt;
		        }

		        var 
		        outputInt = outputInt.substr(0,outputInt.length%comma)+outputInt.substring(outputInt.length%comma).replace(newReg,(comma!=null?',':'')+'$1');
		        outputInt = outputInt.replace(/^,/,'');

		        strInt = outputInt;
		    }

		    if(formatFloat!=null){
		        var outputFloat = '';
		        var zero = formatFloat.match(/^0*/)[0].length;

		        if(strFloat.length<zero){
		            outputFloat = strFloat+new Array(zero+1).join('0');
		            //outputFloat        = outputFloat.substring(0,formatFloat.length);
		            var outputFloat1 = outputFloat.substring(0,zero);
		            var outputFloat2 = outputFloat.substring(zero,formatFloat.length);
		            outputFloat = outputFloat1+outputFloat2.replace(/0*$/,'');
		        }else{
		            outputFloat = strFloat.substring(0,formatFloat.length);
		        }

		        strFloat = outputFloat;
		    }else{
		        if(pattern!='' || (pattern=='' && strFloat=='0')){
		            strFloat = '';
		        }
		    }

		    return strInt+(strFloat==''?'':'.'+strFloat);
		},
		/**
		 * @description 文件大小格式化
		 * @param {Number} num_size 文件大小byte为单位
		 * @retrun 返回 大小 bytes/KB/MB/GB
		 */
		formatSize:function(num_size){
			if (num_size < 0)   
		    {   
		        
		    }   
		    else if (num_size >= 1024 * 1024 * 1024) //文件大小大于或等于1024MB   
		    {   
		        return this.formatNumber(num_size / (1024 * 1024 * 1024), "0.00") + " GB";   
		    }   
		    else if (num_size >= 1024 * 1024) //文件大小大于或等于1024KB   
		    {   
		        return this.formatNumber(num_size / (1024 * 1024), "0.00") + " MB";
		    }   
		    else if (num_size >= 1024) //文件大小大于等于1024bytes   
		    {   
		        return this.formatNumber(num_size / 1024, "0.00") + " KB";   
		    }   
		    else  
		    {   
		        return this.formatNumber(num_size, "0.00") + "bytes";   
		    }   
		}
	};
})();

/**
 * @description 日期类型格式化
 * @param {String} format 格式化字符串
 */
Date.prototype.format = function(format)   
{   
   var o = {   
     "M+" : this.getMonth()+1, //month   
     "d+" : this.getDate(),    //day   
     "h+" : this.getHours(),   //hour   
     "H+" : this.getHours(),   //hour
     "m+" : this.getMinutes(), //minute   
     "s+" : this.getSeconds(), //second   
     "q+" : Math.floor((this.getMonth()+3)/3), //quarter   
     "S" : this.getMilliseconds() //millisecond   
   };
   if(/(y+)/.test(format)) format=format.replace(RegExp.$1,   
     (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
   for(var k in o)if(new RegExp("("+ k +")").test(format))   
     format = format.replace(RegExp.$1,   
       RegExp.$1.length==1 ? o[k] :    
         ("00"+ o[k]).substr((""+ o[k]).length));   
   return format;   
};


/** @namespace Fix.App 组件命名空间*/
Fix.App = {
	/** 
     * @description {String} web站点根路径 
     * @field 
     */
	PageToken: Fix.Util.newGuid(),
	appHost:'',
	// 增加 getHostFull 获取全路径的方法  qj 2013-04-19
	appHostFull:'',
	/**
	 * @description 获取系统虚拟目录的全路径 
	 * @return 如：http://127.0.0.1:8080/irondino/
	 */
	getHost : function() {
		if(this.appHost != ''){
			return this.appHost;
		}
		var url = window.location.pathname + ".fix";
		var host = "";
		var ajaxParam = {
			url : url,
			async : false,
			type : "post",
			dataType : 'json',
			data : {
				cmd : 'getHost'
			},
			success : function(msg) {
				host = msg.host;
			}

		};
		$.ajax(ajaxParam);
		this.appHost = host;
		return host;
	},
	// 增加 getHostFull 获取全路径的方法  qj 2013-04-19
	getHostFull : function() {
		if(this.appHostFull != ''){
			return this.appHostFull;
		}
		var url = window.location.pathname + ".fix";
		var host = "";
		var ajaxParam = {
			url : url,
			async : false,
			type : "post",
			dataType : 'json',
			data : {
				cmd : 'getHostFull'
			},
			success : function(msg) {
				host = msg.host;
			}

		};
		$.ajax(ajaxParam);
		this.appHostFull = host;
		return host;
	},
	/**
	 * @description 获取授权错误信息 
	 * @return 错误信息
	 */
	getLicErr : function(){
		var url = window.location.pathname + ".fix";
		var licErr = "";
		var ajaxParam1 = {
			url : url,
			async : false,
			type : "post",
			dataType : 'json',
			data : {
				cmd : 'getLicErr'
			},
			success : function(msg) {
				licErr = msg.licErr;
			}

		};
		$.ajax(ajaxParam1);
		return licErr;
	}
};

/**
* @description 返回一个link的html
* @param {String} text 连接的文本
* @param {String} href 超链接
* @param {JSON} opts 参数
*/ 
Fix.linkFor = function(text, href, opts) {
	var link = "<a href='" + href + "' ";

	for ( var key in opts) {
		link += " " + key + "='" + opts[key] + "' ";
	}

	link += ">" + text + "</a>";

	return link;
};

/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.cookie = function (key, value, options) {

    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toGMTString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

/**
* @class
* @description Fix事件控制器，订阅模式
*/ 
Fix.Event = function() {
	var that = this;
	this.subscribers = [];
	this.clear = (function(){
		that.subscribers = [];
	});
};

/**
 * @function 激发事件
 * @author elvis
 */
Fix.Event.prototype.fire = function(){
	var args = arguments;
    this.subscribers.forEach(function(fn){
        fn.apply(this, args);
    });
    return this;
};

/**
 * @function 增加监听
 * @author elvis
 */
Function.prototype.addListener = function(publisher) {
	var that = this;
	var alreadyExists = publisher.subscribers.some(
		function(el) {
			if (el == that) {
				return true;
			}
		}
	);
	if (!alreadyExists) {
		publisher.subscribers.push(this);
	}
	return this;
};

/**
 * @function 移除监听
 * @author elvis
 */
Function.prototype.removeListener = function(publisher) {
	var that = this;
	publisher.subscribers = publisher.subscribers.filter(
		function(el) {
			if (el != that ) {
				return el;
			}
		}
	);
	return this;
};


//Production steps of ECMA-262, Edition 5, 15.4.4.18
if ( !Array.prototype.forEach ) {
 
  Array.prototype.forEach = function( callbackfn, thisArg ) {
 
    var T,
      O = Object(this),
      len = O.length >>> 0,
      k = 0;
 
    if ( !callbackfn || !callbackfn.call ) {
      throw new TypeError();
    }
 
    if ( thisArg ) {
      T = thisArg;
    }
 
    while( k < len ) {
 
      var Pk = String( k ),
        kPresent = O.hasOwnProperty( Pk ),
        kValue;
 
      if ( kPresent ) {
        kValue = O[ Pk ];
 
        callbackfn.call( T, kValue, k, O );
      }
 
      k++;
    }
  };
}

if (!Array.prototype.some)
{
  Array.prototype.some = function(fun /*, thisp */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t && fun.call(thisp, t[i], i, t))
        return true;
    }

    return false;
  };
}


if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this === void 0 || this === null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n !== n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
}

if(!String.prototype.trim) {  
  String.prototype.trim = function () {  
    return this.replace(/^\s+|\s+$/g,'');  
  };  
}

if(!String.prototype.rtrim) {  
	String.prototype.rtrim = function(){
		return this.replace(/(\s*$)/g, "");  
	};
}

$.extend($.expr[':'], {
    focusable: function(element) {
        var nodeName = element.nodeName.toLowerCase(),
            tabIndex = $.attr(element, 'tabindex');
        return (/input|select|textarea|button|object/.test(nodeName) ? !element.disabled : 'a' == nodeName || 'area' == nodeName ? element.href || !isNaN(tabIndex) : !isNaN(tabIndex))
        // the element and all of its ancestors must be visible
        // the browser may report that the area is hidden
        && !$(element)['area' == nodeName ? 'parents' : 'closest'](':hidden').length;
    }
});



//jquery阻止用户点Backspace返回上一页
$(document).keydown(function(e){  
	var target = e.target ;  
	var tag = e.target.tagName.toUpperCase();  
	if(e.keyCode == 8){  
		if((tag == 'INPUT' && !$(target).attr("readonly"))||(tag == 'TEXTAREA' && !$(target).attr("readonly"))){  
			if((target.type.toUpperCase() == "RADIO") || (target.type.toUpperCase() == "CHECKBOX"))
				return false ;  
			else
				return true ;
		}else{
			return false ;  
		}
	}
}); 




var isIE=navigator.userAgent.toLowerCase().indexOf("msie")!=-1;
var isIE6=navigator.userAgent.toLowerCase().indexOf("msie 6.0")!=-1;
var isIE7=navigator.userAgent.toLowerCase().indexOf("msie 7.0")!=-1&&!window.XDomainRequest;
var isIE8=!!window.XDomainRequest;
var isGecko=navigator.userAgent.toLowerCase().indexOf("gecko")!=-1;
var isQuirks=document.compatMode=="BackCompat";


 function getEventPosition(evt){
 	
	evt = window.event || evt;
	
	var f={x:evt.clientX, y:evt.clientY};
	var d, srcEle = (evt.srcElement ? evt.srcElement : evt.target);
	if(isGecko){
			d = srcEle.ownerDocument.defaultView;
	 }else{
			d = srcEle.ownerDocument.parentWindow;
	 }
	var a,c;
	while(d != d.parent){
		if(d.frameElement){
				pos2 = $E.getPosition(d.frameElement);
				f.x += pos2.x;
				f.y += pos2.y;
		 }
			a = Math.max(d.document.body.scrollLeft, d.document.documentElement.scrollLeft);
			c = Math.max(d.document.body.scrollTop, d.document.documentElement.scrollTop);
			f.x -= a;
			f.y -= c;
			d = d.parent;
	 }
	return f;
 }
 
 var $E = {};
 
 $E.getPosition=function(m){
		m=m||this;
		//$(m);
		var k=m.ownerDocument;
		if(m.parentNode===null||m.style.display=="none"){
			return false;
 		}
		var l=null;
		var j=[];
		var g;
		if(m.getBoundingClientRect){
			
			g=m.getBoundingClientRect();
			var c=Math.max(k.documentElement.scrollTop,k.body.scrollTop);
			var d=Math.max(k.documentElement.scrollLeft,k.body.scrollLeft);
			var b=g.left+d-k.documentElement.clientLeft;
			var a=g.top+c-k.documentElement.clientTop;
			if(isIE){
					b--;
					a--;
			 }
			return {x:b,y:a	};
	
 }else{
 	
	if(k.getBoxObjectFor){
				g=k.getBoxObjectFor(m);
				var h=(m.style.borderLeftWidth)?parseInt(m.style.borderLeftWidth):0;
				var f=(m.style.borderTopWidth)?parseInt(m.style.borderTopWidth):0;
				j=[g.x-h,g.y-f];
		 }
	
 }
	if(m.parentNode){
		l=m.parentNode;
 	}else{
		l=null;
 }
	while(l&&l.tagName!="BODY"&&l.tagName!="HTML"){
			j[0]-=l.scrollLeft;
			j[1]-=l.scrollTop;
		if(l.parentNode){
				l=l.parentNode;
		 }else{
				l=null;
		 }
	
 }
	return{x:j[0],y:j[1]};
	
 };
 
$E.getPositionEx=function(c){
	c=c||this;
	//c=$(c);
	var f=$E.getPosition(c);
	var d=window;
	var a,b;
	while(d!=d.parent){
		if(d.frameElement){
				pos2=$E.getPosition(d.frameElement);
				f.x+=pos2.x;
				f.y+=pos2.y;
		 }
		a=Math.max(d.document.body.scrollLeft,d.document.documentElement.scrollLeft);
		b=Math.max(d.document.body.scrollTop,d.document.documentElement.scrollTop);
		f.x-=a;
		f.y-=b;
		d=d.parent;
	 }
	return f;
 };
 
$E.getParent=function(a,b){
		b=b||this;
		//b=$(b);
		while(b){
				if(b.tagName.toLowerCase()==a.toLowerCase()){
						return $(b);
				 }
				b=b.parentElement;
		 }
		return null;
 };

$E.getParentByAttr= function(a,c,b){
		b=b||this;
		//b=$(b);
		while(b){
				if(b.getAttribute(a)==c){
						return $(b);
				 }
				b=b.parentElement;
		 }
		return null;
 };
 
$E.getTopLevelWindow= function(){
		var a=window;
		while(a!=a.parent){
				a=a.parent;
		 }
		return a;
};

//开窗 add by chenmin 20130830

function ShowDialog(options) {
    /*
    {
        url, data, width, height, left, top, resizable,
        modal, callback
    }
    */
    if (typeof options == 'string') options = { url: options };

    if (options.modal) {
        var sFeatures = "status=yes;location=yes;z-look=yes;";
        if (options.width) sFeatures += 'dialogWidth=' + options.width + "px;";
        if (options.height) sFeatures += 'dialogHeight=' + options.height + "px;";
        if (options.resizable) sFeatures += 'resizable=' + (options.resizable ? 'yes;' : 'no;');
        if (options.Maximize) sFeatures += 'Maximize=' + (options.Maximize ? 'yes;' : 'no;');


        var mask = document.createElement('div');
        mask.style.cssText = 'filter:alpha(opacity=50);opacity: 0.5;background:gray;position:fixed;left:0;top:0;width:100%;height:100%;';
        document.body.appendChild(mask);

        var returnValue = showModalDialog(options.url, options.data, sFeatures);       
         
        document.body.removeChild(mask);

        if (typeof options.callback == 'function') options.callback(returnValue);

        return returnValue;
    } else {
        var sFeatures = "status=yes,z-look=yes,";
        if (options.width) sFeatures += 'width=' + options.width + ",";
        if (options.height) sFeatures += 'height=' + options.height + ",";
        if (options.resizable)
        	 sFeatures += 'resizable=' + (options.resizable ? 'yes,' : 'no,');
        else
        	sFeatures += 'resizable=yes,';
       
        if (options.scrollbars)
        	sFeatures += 'scrollbars=' + (options.scrollbars ? 'yes,' : 'no,');
        else
        	sFeatures += 'scrollbars=yes,';
        
        if (options.location)
        	sFeatures += 'location=' + (options.location ? 'yes,' : 'no,');
        else
        	sFeatures += 'location=no,';
        
        var win = window.open(options.url, "", sFeatures);
        
        win.onload = function () {
            win.onunload = function () {                    
                if (typeof options.callback == 'function') options.callback(win.returnValue);
            }
        }
        return win;
    }
}

//获取查询表单对象 add by chenmin 20131021
function GetObjFormData()
{
	var FormData = {};
	try{
	var strFormData="";
	if(typeof Fix.Engine.Map.items != "undefined"){
		for(var i = 0; i < Fix.Engine.Map.items.length; i++){
					
				var strHtmlID = Fix.Engine.Map.items[i];
	            var strValue = Fix.getData(strHtmlID);
	            FormData[strHtmlID] = strValue;
			
		}
	}
	}catch(e){}
	return FormData;
}
function GetJsonFormData()
{
	 var objFormData=GetObjFormData();
	 strFormData = Fix.Util.encode(objFormData);

	return strFormData;
}
//刷新本页面 add by chenmin 20131120
function RefreshPage()
{	
  window.location.reload();	
}
//获取页面参数
function GetQueryString( prop ) 
{	// Edit By rong_hg20091014 
	//var re = new RegExp( prop + "=([^\\&]*)", "i" );
	var re = new RegExp( "[?&]"+prop + "=([^\\&]*)", "i" );
	var a = re.exec( document.location.search );
	if ( a == null )return null;
	return a[1];
}
///add by chenmin 20131120 根据服务器名，设置域名--跨域
function SetJsDomain(hostname) {
	
   if (hostname.indexOf(":")!=-1){
	   hostname=hostname.substring(0,hostname.indexOf(":"))
   }	
    if (hostname.indexOf(".")!=-1)
    {
        var NewDomain=hostname.substring(hostname.indexOf(".")+1)
       // alert("设置域名"+NewDomain)
        document.domain = NewDomain;  //二级域名不同，跨域处理 add by chenmin 20101206
       
    }
    
    //document.domain="simulate.com";  
   // alert(document.domain);
}
//单点登录时检查系统的常量配置 
function ChecklocalStorage()
{
	if (window.localStorage.length<10)
    {
		var url = window.location.pathname + ".fix";
		var host = "";
		var ajaxParam = {
			url : url,
			async : false,
			type : "post",
			dataType : 'json',
			data : {
				cmd : 'getTheme'
			},
			success : function(msg) {

				for(var item in msg)
				{	
					window.localStorage[item] = msg[item];
				}
			}

		};
		$.ajax(ajaxParam);
	}
}

$(document).ready(function(){

	var _theme = null;
	if(window.localStorage !== undefined)
		_theme = window.localStorage.FixTheme;
	
	if(_theme === undefined || _theme == null)
		_theme = "ecidi"; //原来默认是current, 现在修改为华东院皮肤

	if(window.localStorage !== undefined)
		window.localStorage.FixTheme = _theme;
		
	ChecklocalStorage();//单点登录时检查系统的常量配置 add by chenmin 20131205 解决单点登录时，按钮无法展示问题。
});
//流程相关-服务器配置地址
var hostMap={};
var SignImageURL="";
var hostport="";
var Signhostport="";

if (_Domain=="ccms.ecidi.com"){
	var hostMap= {
			pm:"http://"+window.location.host+"/eccms/",
			'':"http://"+window.location.host+"/eccms/",
		    reportServer:"http://"+window.location.host+"/webreport2/" //报表服务器"http://web.simulate.com:8080/"
		};
	//签章图片的绝对路径
	 SignImageURL="http://ccms.ecidi.com:8002/imageFile/";

	//签章服务器地址
	var hostport="";
	
}
else
{ 
	hostMap= { 
		pm:"http://"+window.location.host+"/eccms/",
		'':"http://"+window.location.host+"/eccms/",
	    reportServer:"http://web.simulate.com:8080/webreport2/" //报表服务器
	};
	//签章图片的绝对路径
	 SignImageURL="http://ccms.ecidi.com:8002/imageFile/";
	
	//签章服务器地址
	 hostport="";

	 
	
	
}






//miniui  mini.open()方法
/*
if (typeof(mini)=="undefined"&&(window.parent&&typeof(window.parent.mini)=="undefined")&&typeof(top.mini)=="undefined")
{//需要加载miniui框架
jsfile1="http://"+window.location.host+Fix.App.appHost+"lib/boot.js";
document.write('<script src="'+jsfile1+'" type="text/javascript" ></sc' + 'ript>');
}
*/

