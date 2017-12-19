Request = { QueryString: function(item) {
    var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
    var t = svalue ? svalue[1] : svalue;
    t = decodeURIComponent(t);//非IE需要换码
    return t;
}
}
var UrlParam = mini.getParams();
var QueryString = GetSelfUrl();
//1、注册一个属性
mini.regHtmlAttr("hiddentext", "string");//弹出框控件
mini.regHtmlAttr("hiddenText", "string");//弹出框控件
mini.regHtmlAttr("relateDateId", "string");//日期控件专业
mini.regHtmlAttr("dataType", "string");//日期控件专业 Start 或者End
mini.regHtmlAttr("errorTitle", "string"); //错误提示
mini.regHtmlAttr("urlParms", "string"); //弹出框控件,增加url 参数
//mini.regHtmlAttr("textasValue", "string"); //combox的Text 做为 value

//2.注册属性兼容方正平台
mini.regHtmlAttr("fixdata", "string"); 
//mini.regHtmlAttr("OriginalValue", "string"); 
//mini.regHtmlAttr("PK", "bool");
//mini.regHtmlAttr("DataType", "string"); 
//data-options="{PK: true,OriginalValue:'test'}"  var obj = mini.get('a'); alert(obj.PK);



//2、统一的错误页面
function ShowError(msg) {

     if (msg.indexOf("11从客户端(")>=0)
	 {
	     msg="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您所提交的信息包含以下一个或多个特殊字符:<br>"+"•!@#$%^&*()_+=-{}|\][:';<>?/.,~`<!<?<%[]{}\\//--~`、\n \t \p?"+""
	 }

    var s = msg;
	
	var s="<strong>错误信息如下：</strong><br>"+s;
    var win = window.open('', "", 'height=400,width=600,top=200,left=400,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no, titlebar=no');
    win.document.open('text/html', 'replace');
    win.document.write(s);
    win.document.close();
   }
   
//信息校验窗口
function ShowValidate(msg) {
/*
var s = msg;
var win = window.open('', "", 'height=400,width=400,top=200,left=400,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no, titlebar=no');
win.document.open('text/html', 'replace');
win.document.write(s);
win.document.close();
*/
	
		window.showModalDialog("/systemcenter/lib/miniui/ValidteError.htm",msg,
			"dialogHeight:360px;dialogWidth:500px;edge:Sunken;center:Yes;help:No;resizable:Yes;status:No;scroll:no");
		return false;


}

function AllowInputValidation(e) {
    var combo = e.sender;
    var data = combo.getData();
    var text = combo.getText();
    for (var i = 0, l = data.length; i < l; i++) {
        var item = data[i];
        if (item.Name == text) {
            return;
        }
    }
    e.isValid = false;
    e.errorText = "必须与下拉框中的数据一致"
}

//3、自己的form
mini.MyForm = function(el) {
    mini.MyForm.superclass.constructor.call(this, el);

}
mini.extend(mini.MyForm, mini.Form, {

    getErrorTexts: function() {
        var errorTexts = [];
        var errors = this.getErrors();
        for (var i = 0, l = errors.length; i < l; i++) {
            var control = errors[i];
            var strno = i + 1;
            if (control.errorText == "不能为空") {
                control.errorText = "不允许输入空值";
            }
            control.errorText = control.errorText.replace("字符数", "字符数(1个中文为2个字符数)");
            if (control.errorTitle)   //自定义属性
                errorTexts.push(strno + ")   [" + control.errorTitle + "]" + control.errorText + "！\n");
            else
                errorTexts.push(strno + ")   " + control.errorText + "\n");
        }
        return errorTexts;
    },
    getErrors: function() {
        var errors = [];
        var controls = this.getFields();
        for (var i = 0, l = controls.length; i < l; i++) {
            var control = controls[i];
            if (!control.isValid) continue;
            if (control.isValid() == false) {
                errors.push(control);
            }
        }
        return errors;
    },
    getData: function(formatted) {
        var valueFn = formatted ? "getFormValue" : "getValue";
        var controls = this.getFields();
        var data = {};
        for (var i = 0, l = controls.length; i < l; i++) {
            var control = controls[i];
            var fn = control[valueFn];
            if (!fn) continue;
            //data[control.name] = fn.call(control);
			
			var strValue=control.getValue();
			if (typeof(strValue)=="string")
			{
			strValue=strValue.replace(/</g,"＜");
			strValue=strValue.replace(/>/g,"＞");
			}

			data[control.name] = strValue;
        }

        //额外处理Text(buttonedit 和 combox)属性代码 add by chenmin 20120529
        for (var i = 0, l = controls.length; i < l; i++) {
            var control = controls[i];

			
			
			
			
            //buttonedit
            if (control.hiddentext)
            {
				var strText=control.getText();
				if (typeof(strText)=="string")
			    {
				strText=strText.replace(/</g,"＜");
				strText=strText.replace(/>/g,"＞");
   			    data[control.hiddentext] = strText;
			    }
			}

            //combobox
            if (control.cls == "mini-combobox" && control.getValueField() == control.getTextField()) {
			   
			   var strText=control.getText();
				if (typeof(strText)=="string")
			    {
				strText=strText.replace(/</g,"＜");
				strText=strText.replace(/>/g,"＞");
   			    data[control.hiddentext] = strText;
			    }
				var strValue=control.getValue();
				if (typeof(strValue)=="string")
			    {
				strValue=strValue.replace(/</g,"＜");
				strValue=strValue.replace(/>/g,"＞");
				}
				
                if (control.getText() == "") {
                    data[control.name] = strText;
                }
                else {
                    control.setText(strValue);

                }

            }
        }

        return data;
    },
    setData: function(options) {
        if (typeof options != "object") return;
        var map = this.getFieldsMap();
        for (var name in options) {

            var control = map[name];
            if (!control || !control.setValue) continue;

            control.setValue(options[name]);

            //额外处理Text(buttonedit 和 combox)属性代码 add by chenmin 20120416
            if (control.hiddentext)
                control.setText(options[control.hiddentext]);
            
            
            if(control.fixdata)
        	{
            	control.OriginalValue=options[name];
            	//control.OriginalValue="111111111111111111111";
        	}
        }
    }
});

/* 4.
为了快速生成有超链接的Tree。
对节点数据，要求有：url、target

*/

LinkTree = function() {
    LinkTree.superclass.constructor.call(this);
}
mini.extend(LinkTree, mini.Tree, {
    textField: "text",
    urlField: "url",
    targetField: "target",

    uiCls: "mini-linktree",

    //初始化事件
    _initEvents: function() {
        LinkTree.superclass._initEvents.call(this);

        this.on("drawnode", this.__OnDrawNode, this);
    },
    __OnDrawNode: function(e) {
        var tree = e.sender;
        var node = e.node;

        var text = node[this.textField];
        var url = node[this.urlField];
        var target = node[this.targetField];

        var hasChildren = tree.hasChildren(node);
        //所有子节点加上超链接
        if (hasChildren == false) {
            e.nodeHtml = '<a href=' + url + ' target="' + target + '">' + text + '</a>';
        }
    },
    setUrlField: function(value) {
        this.urlField = value;
    },
    setTargetField: function(value) {
        this.targetField = value;
    },
    getAttrs: function(el) {
        var attrs = LinkTree.superclass.getAttrs.call(this, el);

        mini._ParseString(el, attrs,
            ["urlField", "targetField"
             ]
        );
        return attrs;
    }

});
mini.regClass(LinkTree, "linktree");



//人员选择功能
function mini_UserChoose(e, callbackfunc) {

	
	var buttonEdit = e.sender; // e.sender是指绑定事件的控件
   
    var buttonEditHidden = mini.get(buttonEdit.hiddentext);
    var UserName = buttonEdit.getValue();
    var UserFullName = buttonEditHidden.getValue();
    var data = { action: "SetDefaultInput", UserInputField: buttonEdit.id, UserInputHiddenField: buttonEditHidden.id, UserName: UserName, UserFullName: UserFullName };
    var urlParms = "";
    var url="http://web.ecidi.com/ProductionSubSysWeb/ProductReport/UserChoose.aspx";
    
     urlParms = buttonEdit.urlParms;
    if( urlParms)
       url += "?" + urlParms



      mini.openTop({
      	url: url,
      	title: "人员选择", width: 660, height: 480,
      	onload: function() {
      		var iframe = this.getIFrameEl(); //获取iframe对象
      		iframe.contentWindow.SetData(data, callbackfunc);
      	},
      	ondestroy: function(action) {
      		if (action == "ok") {
      			var iframe = this.getIFrameEl();
      			var data = iframe.contentWindow.GetData();
      			data = mini.clone(data);
      			//可以自定义赋值
      			buttonEdit.setValue(data.id);
      			buttonEdit.setText(data.text);
      			buttonEditHidden.setValue(data.text);
      			buttonEdit.validate();

      			iframe.contentWindow.CallBackFunc(); //执行回调函数

      		}
      	}
      });
}

//部门选择功能
function mini_GroupChoose(e,buttonedit1, callbackfunc) {

	//var buttonEdit = this;
	var buttonEdit = e.sender; // e.sender是指绑定事件的控件
    if (!buttonEdit.id) {
        buttonEdit = buttonedit1;
    }
    var buttonEditHidden = mini.get(buttonEdit.hiddentext);

    var data = { action: "SetDefaultInput", UserInputField: buttonEdit.id, UserInputHiddenField: buttonEditHidden.id };

    mini.openTop({
        //url: "http://localhost/sharein/GroupChoose/GroupChoose.aspx?miniui=1&DptClassId=1&Checkbox=1&Description=&HasRightCheckbox=1&SonisCheck=0&Isexpand=1",
        url: "http://web.ecidi.com/ProductionSubSysWeb/ProductReport/GroupChoose.aspx",
        title: "部门选择", width: 320, height: 410,
        onload: function() {
            var iframe = this.getIFrameEl(); //获取iframe对象
            iframe.contentWindow.SetData(data, callbackfunc);
        },
        ondestroy: function(action) {
            if (action == "ok") {

                var iframe = this.getIFrameEl();

                var recData = iframe.contentWindow.GetData();

                recData = mini.clone(recData);

                //可以自定义赋值
                buttonEdit.setValue(recData.id);
                buttonEdit.setText(recData.text);
                buttonEditHidden.setValue(recData.text);
                buttonEdit.validate();
                
                iframe.contentWindow.CallBackFunc(); //执行回调函数


            }
        }
    });
   }

  //设置日期自动有效性校验
function mini_onDrawDate(e) {

	var datepicker1 = e.sender;
	var datepicker2 = mini.get(datepicker1.relateDateId);

	var date1 = e.date;
	var date2 = datepicker2.getValue();

	if (datepicker1.DataType == "Start" || datepicker1.DataType == "start") {
		if (date2 && date1.getTime() > date2.getTime()) {
			e.allowSelect = false;
		}
	}
	else {
		if (date2 && date1.getTime() < date2.getTime()) {
			e.allowSelect = false;
		}

	}

}

//加载数据
   function $loadJSON(url) {
   	var data = null;
   	$.ajax({
   		url: url,
   		async: false,
   		success: function(text) {
   			data = mini.decode(text);
   		}
   	});
   	return data;
}

//获取权限列表
function $GetRight(url) {
    var data = null;
    $.ajax({
        url: url,
        async: false,
        success: function(text) {
          data = text;
        }
    });
    return data;
}
   
   //下载导出文件
 function DownloadReport(url, action,fields) {
            
	//创建Form
	var submitfrm = document.createElement("form");
	submitfrm.action = url;
	submitfrm.method = "post";
	submitfrm.target = "_blank";
	document.body.appendChild(submitfrm);

	var input1 = mini.append(submitfrm, "<input type='hidden' name='RequestAction'>");
	input1.value = action;
	
	if (fields) {
	
		for (var p in fields) {
			var input = mini.append(submitfrm, "<input type='hidden' name='" + p + "'>");
			var v = fields[p];
			if (typeof v != "string") v = mini.encode(v);
			input.value = v;
		}
	}

	submitfrm.submit();
	setTimeout(function () {
		submitfrm.parentNode.removeChild(submitfrm);
	}, 1000);
 }
  
   
   
   //新开窗口，同时提交数据,--不用
 function Submit(url,action,method,datastore,target)
{	

   //创建Form
	var frmhtml="<form ";
	if(url!=null)
		frmhtml+= "action='"+url+"' ";
	if(method!=null)
		frmhtml+= " method='"+method+"'>";
	var submitfrm =  document.createElement(frmhtml);
	
	//新增对象RequestAction
	var actionfld = document.createElement("<Input type='hidden' name='RequestAction'>");
	actionfld.value = action;
	submitfrm.appendChild(actionfld);
	
   //新增对象DataStore
	var valuefld = document.createElement("<Input type='hidden' name='DataStore'>");
	if(typeof(datastore)=="string")
		valuefld.value = datastore;
	else if(typeof(datastore)=="object")
		valuefld.value = mini.encode(datastore);
	submitfrm.appendChild(valuefld);
	
	//遍历对象的所有属性
	if(typeof(datastore)=="object")
	{
		for (var prop in datastore)
		{
		  var propvalue=datastore[prop];
		  propvalue=mini.encode(propvalue);
		  var valuefld = document.createElement("<Input type='hidden' value='"+propvalue +"' name='"+ prop+"'>");
          submitfrm.appendChild(valuefld);
		}
	}
	document.appendChild(submitfrm);
	if(target)
		submitfrm.target = target;
	submitfrm.submit();
}

function  GetSelfUrl()
{
  var objUrlParams=mini.getParams();
  var urlParams = jQuery.param(objUrlParams);
  return urlParams;
}


//对mini.opentop进行扩展，自动加X1X2
mini._doOpen = function (options) {
    if (typeof options == "string") {
        options = { url: options };
    }

    options = mini.copyTo({
        width: 700,
        height: 400,
        allowResize: true,
        allowModal: true,

        title: "",
        titleIcon: "",
        iconCls: "",
        iconStyle: "",
        bodyStyle: "padding: 0",

        url: "",

        showCloseButton: true,
        showFooter: false
    }, options);

    options.closeAction = "destroy";

    var onload = options.onload;
    delete options.onload;
    var ondestroy = options.ondestroy;
    delete options.ondestroy;
    var url = options.url;
    delete options.url;
	
	//add by chenmin 20120615 //增加X1,X2
    /*
	var EcidiX1=_GetUrl("X1");
	var EcidiX2=_GetUrl("X2");
	var myurl=url;
	if (myurl.indexOf("?")>0)
	{
	  myurl=myurl+"&X1="+ EcidiX1 +"&X2="+EcidiX2;
	}
	else
	{
	 myurl=myurl+"?X1="+EcidiX1+"&X2="+EcidiX2;
	}
	
    
	url=myurl;*/

    var win = new mini.Window();
    win.set(options);
    win.load(url,
        onload,
        ondestroy
    );
    win.show();

    return win;
}

mini.open = function (options) {
    var ps = [];
    function getParents(me) {
        if (me.mini) ps.push(me);
        if (me.parent && me.parent != me) {
            getParents(me.parent);
        }
    }
    getParents(window);
    var win = ps[ps.length - 1];
    return win.mini._doOpen(options);
}
mini.openTop = mini.open;

// add by chenmin 20130624 构造页面数据给 方正后台处理
 //获取主表+明细表 add by chenmin 20140706
 function GetFixFormData(BizObj,UseType,detailObj)
 {

 	//定义表单数据
 	var FormData = {
 		objName:BizObj,
 		pks:[],
 		data : [{
 			rowData:[],
 			children:[]
 		}]
 	};
 	//定义纯表单数据
 	var ref_formInfo = {};
 	ref_formInfo=form.getData()
 	//PageData["formInfo"] = ref_formInfo;
 	
 	//定义页面数据
 	var PageData = {
 		_OBJ_NAME_:BizObj,
 		_FORM_ID_: Fix.getFormId(),
 		useType:UseType,
 		pageToken:Fix.Util.newGuid(),
 		formData:FormData,//表单
 		formInfo:ref_formInfo,//纯表单数据
 		_ATTACHMENT_DELETE_IDS_:$('#_ATTACHMENT_DELETE_IDS_').val()
 	};
 	

 	
 	
 	//收集主表
 	//Fix.Engine.Master.collectData(DataJson);
 	
 	//收集明细表名，目前只实现1层明细
 	//Fix.Engine.SecondDetail.collectData(DataJson);
 	

 	//Fix.Engine.Master.collectAliasData(ref_formInfo);
 	//Fix.Engine.SecondDetail.collectAliasData(ref_formInfo);

 	
    // 遍历 miniui控件，并构造符合fix方正平台的数据格式
    var form1 = new mini.Form(document.body);
    var controls = form1.getFields();;

     for (var i = 0, l = controls.length; i < l; i++) {
 	    
         var control = controls[i];
         var RowData={};  //控件对象 
         
 		RowData.DataType=control.DataType;
 		RowData.DataTarget=control.name;
 		RowData.Value=control.getValue();
        RowData.OriginalValue=control.OriginalValue;
 		RowData.PK=control.PK;
 		
 		
 		//主键
 	   if (RowData.PK)
 	       FormData.pks.push(RowData.DataTarget);
 		
 		//属于fix控件   
        if (control.fixdata) 
 	      FormData.data[0].rowData.push(RowData);

        
     }
     
    //获取明细表json add by chenin 20140707
    if ( typeof detailObj!="undefined"){
       Fix.miniCollect(detailObj,FormData);
    }
    
    var json = mini.encode(PageData);
     //alert(json);
 	return PageData;
   
 	
 }

 
 

   

