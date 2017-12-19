Fix = window['Fix'] || {};
Fix.Utils = {
	/**
	 * @author char
	 * @description 将json字符串转换为对象
	 * @param {String} strJson json字符串
	 * @return 返回object,array,string等对象
	 */
	decode : function(strJson) {
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
		if(typeof(JSON) != "undefined")
			return JSON.Mystringify(object);
		
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
	cjkEncode : function(str) {     
		if (str == null) {     
			return "";     
		}     
		var newText = "";     
		for (var i = 0; i < str.length; i++) {     
			var code = str.charCodeAt (i);      
			if (code >= 128 || code == 91 || code == 93) {//91 is "[", 93 is "]".     
				newText += "[" + code.toString(16) + "]";     
			} else {     
				newText += str.charAt(i);     
			}     
		}     
		return newText;     
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
		return urlParam;
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
	getURLPath:function(url){
		var paraString = url.substring(0, url.lastIndexOf("?") + 1);
		paraString = paraString.substring(0, paraString.lastIndexOf("/") + 1);
		return paraString;
	},
	getURLParams: function(url) {
		var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
		var paraObj = {};
		for (var i = 0; j = paraString[i]; i++) {
			var paramVal = j.substring(j.indexOf("=") + 1, j.length);
			
			paraObj[j.substring(0, j.indexOf("="))] = this.urlDecode(paramVal);
		}
		return paraObj;
	},
	appendParams: function(url, params) {
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
	},
	rtrim: function(str)  
	{
		return String(str).replace(/(\s*$)/g, "");  
	},
	fn_extraction : function(str_argument, str_left, str_right) {
		var regex = new RegExp(str_left + "(.*?)" + str_right, "ig");
		var arr_matched = str_argument.match(regex);

		if (arr_matched != null)
			return arr_matched;
		else
			return [];
	}
};