var miniDetailObj = '';
// 打开tab窗口
function createTab (id, title, url) {
    try {
        top.CatalogShowTab(id, title, url); // OA门户tab页面
    } catch (e) {
        var obj = {};
	    	obj.name = title;
	    	obj.url = url;
	    	obj.id = id;
	    	obj.scrolling = 'auto';
        top.Fix.Manager.createTabInMainTab(obj, function () {}, this); // 方正门户tab页面
    }
}

// 打开窗口
function createDialog (id, title, width, height, url, callbackfunc) {
        	if (url.indexOf('http://') == -1) {
        		url = 'http://' + window.location.host + url;
        	}

        	var tabCfg = {
        		id: id,
        		title: title,
        		width: width,
        		height: height,
        		url: url,
        		ondestroy: callbackfunc
        	};
        	// top.Fix.Manager.createDialog(tabCfg, function(){Fix.Uniform.refresh();}, parent);
        	Fix.Util.getTopWin().Fix.Manager.createDialog(tabCfg, function () {
        		try {
        			if (typeof callbackfunc === 'undefined') {
        				Fix.Uniform.refresh();
        			} else // add by chenmin 20150626 关窗执行回调函数
        			{
        			  var myfunc = eval(callbackfunc);
				       myfunc(); // 执行回调函数
        			}
        		} catch (e) {}
    }, parent);
}

/*
 * CreateWin 例子:
 		var urlParams = {
			obj: 'test'
		};
		var dialogCfg = {
			showMask: false,
			resourceUrl: '',
			title: '',
			height: '700px',
			width: '1000px'
		};
   createWin(dialogCfg, urlParams)
 */
function createWin (dialogCfg, urlParams) {
    CreateWin(dialogCfg, urlParams);
}
function CreateWin (dialogCfg, urlParams) {
    var url = '';
    if (dialogCfg.resourceUrl.indexOf('http://') == -1) { url = 'http://' + window.location.host + Fix.App.appHost + dialogCfg.resourceUrl; } else { url = dialogCfg.resourceUrl; }

    url = url + (url.search(/\?/) === -1 ? '?' : '&');
    delete dialogCfg.resourceUrl;

    var param = {};
    if (urlParams.addBizObj == true) { // 打开表单
        param['_viewId'] = Fix.Uniform.config.ViewId;
        param['_menuId'] = Fix.Uniform.config.MenuId;
        param['objName'] = Fix.Uniform.config.BizObj;
        param['_treeNodeId'] = Fix.Uniform.treeNodeId;
        param['_useType'] = 'view';
        param['_pk'] = 'GUID';
    }
    delete urlParams.addBizObj;

    $.extend(param, urlParams);

    url += $.param(param); // 窗口地址

    var cfg = $.extend({
        title: '',
        url: url,
        height: '1000px',
        width: '700px'
    }, dialogCfg); // 窗口配置

    if (cfg.showMask === false) { // window.open, 居中
        var height = cfg.height,
            width = cfg.width,
		 	top = (window.screen.availHeight - parseFloat(height)) / 2,
		 	left = (window.screen.availWidth - parseFloat(width)) / 2;
        window.open(url, '',
            'height=' + height + ',width=' + width + ',top=' + top + ',left=' + left + ',toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
    } else {
        Fix.Util.getTopWin().Fix.Manager.createDialog(cfg,
            function (instObj) { Fix.Uniform.refresh(); }, parent);
    }
};

// 关闭弹出窗口
function CloseDialog (action) {
    if (typeof action === 'undefined') { action = 'cancel'; } // add by chenmin 20151123
    if (window.CloseOwnerWindow) { window.CloseOwnerWindow(action); } else { window.close(); }
}

// 关闭弹出窗口
function closeDialog (action) {
    if (typeof action === 'undefined') { action = 'cancel'; } // add by chenmin 20151123

    CloseDialog(action);
}

function sendpressmail (taskname, stepname, username, processkey, des) {
    if (confirm('确认发送催办通知吗？'))	{
        Fix.ajax({
	      action: {
	    	  _method: 'TASK.sendpressmail',
	          _param: {
	              taskname: taskname,
	              stepname: stepname,
	              username: username,
	              processkey: processkey,
	              des: des
	          }
	      },
	      async: false,
	      success: function (response) {
      	alert('已向该任务执行人发送催办短信！');
            }
        });
    }
}

// 默认保存按钮事件 edit by chen_l3
function DefaultSaveFunction (opts, btn, url_params) {
    // alert("hello world");
    Fix.Engine.PassedVerify = true;
    Fix.Engine.onVerify().fire(btn, opts);
    if (Fix.Engine.PassedVerify) {
        if (confirm(Fix.Global['{@confirmSave}'])) {
            Fix.Engine.formSubmit(btn, opts);
        }
    }
}
// add by chenmin 20140707 平台的主表+miniui的datagrid
// 默认保存按钮事件 主表是平台方法，明细表是miniui
Fix.doSave = function (opts, btn, url_params, detailObj) {
    Fix.Engine.PassedVerify = true;
    Fix.Engine.onVerify().fire(btn, opts);
    if (Fix.Engine.PassedVerify) {
        if (confirm(Fix.Global['{@confirmSave}'])) {
            Fix.Engine.formSubmit(btn, opts, detailObj);
        }
    }
};
// 获取明细表datagrid
Fix.miniCollect = function (detailObj, FormData) {
 	// 增加明细表===============================================
    for (var i = 0; i < detailObj.length; i++) {
        var objName = detailObj[i].bizObjId;
        var gridId = detailObj[i].gridId;

        // 明细表的数据结构
     	var childFormData1 = {
	 		objName: objName,
	 		pks: [],
	 		data: []
        };

     	FormData.data[0].children.push(childFormData1);// 增加一个明细表
     	var childFormData = FormData.data[0].children[i];// 获取明细表的一个对象

     	var grid = mini.get(gridId);
     	var rows = (detailObj[i].getChanges === false) ? grid.getData() : grid.getChanges();
     	childFormData.pks.push(grid.PKField);// 明细表的主键
        for (var j = 0; j < rows.length; j++) { // 遍历datagrid有改动的数据
		    var row = rows[j];
		    var columns = grid.getBottomColumns();// 获取所有列， grid.getVisibleColumns();获取可见列
		    childFormData.data.push({rowData: [], children: []}); // 明细表第一行

         	for (k = 0; k < columns.length; k++) {
                // row._state=="modified" "added" "removed"
                var RowData = {}; // 明细表的控件对象
                var col = columns[k]; // 列的属性
                if (row._state == 'added') {
                    if (typeof col.field !== 'undefined') {
				    	RowData.DataType = col.DataType;
				 		RowData.DataTarget = col.field;
				 		var colvalue = eval('row.' + col.field);
				 		RowData.Value = colvalue;
				        RowData.OriginalValue = null;
				 		RowData.PK = col.PK;
				 		childFormData.data[j].rowData.push(RowData);
				    }
                } else if (row._state == 'modified') {
				   if (typeof col.field !== 'undefined') {
				    	RowData.DataType = col.DataType;
				 		RowData.DataTarget = col.field;
				 		var colvalue = eval('row.' + col.field);
				 		RowData.Value = colvalue;
				        RowData.OriginalValue = colvalue;
				 		RowData.PK = col.PK;
				 		childFormData.data[j].rowData.push(RowData);
				    }
                } else if (row._state == 'removed') {
				  if (typeof col.field !== 'undefined' && col.field == grid.PKField) {
				    	RowData.DataType = col.DataType;
				 		RowData.DataTarget = col.field;
				 		var colvalue = eval('row.' + col.field);
				 		RowData.Value = null;
				        RowData.OriginalValue = colvalue;
				 		RowData.PK = col.PK;
				 		childFormData.data[j].rowData.push(RowData);
				 		break;
				    }
                }
            }
        }
    }
    // 增加明细表===============================================
};

// 新增
Fix.miniAddRow = function (grid) {
    var rows = grid.getData();
	 var newRow = {};
    // var newRow = { FIELD4: "陈敏1" };
    // grid.addRow(newRow, rows.length);//新记录加在最后
    grid.addRow(newRow);
    // grid.beginEditCell(newRow);
    grid.beginEditCell(newRow, 3);
};

Fix.miniRemoveRow = function (grid) {
    var rows = grid.getSelecteds();
    if (rows.length > 0) {
        grid.removeRows(rows, true);
    }
};
// 通用的选人 params 是url后面的参数,callback是回调函数
Fix.miniChooseUserWin = function (params, callback) {
    var SELECT_USER = location.protocol + '//' + location.host + Fix.App.appHost + 'components/ECIDISelect/selectPage_miniui.html';
    var url = Fix.appendParams(SELECT_USER, params);
    mini.open({
        url: url,
        title: '人员选择',
        width: 940,
        height: 540,
        ondestroy: function (action) {
            if (action == 'ok') {
                var iframe = this.getIFrameEl();
                var data = iframe.contentWindow.getReturnData();
                data = mini.clone(data);

                callback(data);// 回调函数
            }
        }
    });
};

//= ======end=========add by chenmin 20140707======================

// Fix.Runtime.closeThisPage=function(){
//	MiniOpenClose();
// };
/**
* @description 根据组件的ID，赋值
* @param {String} element 组件的ID
* @param {String} 赋值内容
* @param {String} 组件所属范围
*/
Fix.setData = function (htmlID, str_value, $scope) {
    if ($scope === undefined) { $scope = $(document); }
    var jQy_control = Fix.FindControl(htmlID, $scope);

    if (typeof jQy_control !== 'undefined') {
        var obj_COM = Fix.Engine.Controls[jQy_control.control.id];
        if (obj_COM !== undefined) {
            obj_COM.setValue(str_value);
        } else {
            obj_COM = jQy_control.obj_cmp;// 明细表高级控件对象 add by chenmin 20140630
            if (obj_COM != undefined) {
                obj_COM.setValue(str_value);
            } else {
			   Fix.Helper.fn_SetValue(jQy_control.control, str_value);
            }
        }
    }
};

/**
 * @description 根据组件ID获取控件
	 * @example
	 * var fixCOM = Fix.Engine.fn_FindAlias(str_alias, $(document));
	 * @param {HTML} obj_target 组件ID
	 * @param {jQuery} jQy_scope 查找范围
	 * @return {Object} htmlID,scope,control
 */
Fix.FindControl = function (htmlID, jQy_scope) {
    var obj_fixbody = Fix.Engine.PageElements;

    // 组件ID在页面级
    for (var j = 0; j < obj_fixbody.length; j++) {
        var str_htmlID = obj_fixbody[j];
        if (str_htmlID == htmlID) {
            return {
                scope: 'document',
                control: Fix.Engine.query('#' + str_htmlID, $(document))[0],
                htmlID: str_htmlID
            };
        }
    }

    // 组件ID在明细表中
    for (var table_id in Fix.Engine.DetailGrid) {
        var obj_detail = Fix.Engine.DetailGrid[table_id];
        // 找到一个出现匹配的明细表
        for (var k = 0; k < obj_detail.items.length; k++) {
            var str_htmlID = obj_detail.items[k];
            if (str_htmlID == htmlID) {
                if (jQy_scope.data('ctls') == undefined) {
    				return {
    					scope: table_id,
    					control: Fix.Engine.query('[id=' + str_htmlID + ']:last', jQy_scope)[0],
    					htmlID: str_htmlID
    				};
                } else {
    		        var obj_cmp = jQy_scope.data('ctls')[str_htmlID];// add by chenmin 20140630 获取明细表对象
    				return {
    					scope: table_id,
    					control: Fix.Engine.query('[id=' + str_htmlID + ']:last', jQy_scope)[0],
    					htmlID: str_htmlID,
    					obj_cmp: obj_cmp// add by chenmin 20140630 获取明细表对象
    				};
                }
            }
        }
    }
},

/**
* @description 组件是否必填接口
* @param {String} element 组件的ID
* @param {String} 是否必填的标识 "false" 为必填
*/
Fix.allowEmpty = function (htmlId, flag) {
    Fix.AllowEmpty(htmlId, flag);
};
Fix.AllowEmpty = function (htmlId, flag) {
    if (htmlId !== undefined && htmlId != '') {
        try {
            if (flag == false || flag == 'false') // 必填
            {
                if (!$('#' + htmlId).hasClass('required'))// 基本控件
                {
                    $('#' + htmlId).addClass('required');
                }
                if (!$('#' + htmlId + ' input,#' + htmlId + ' .uploadify-title,#' + htmlId + ' select').hasClass('required'))// 复合控件选人
                {
                    $('#' + htmlId + ' input,#' + htmlId + ' .uploadify-title,#' + htmlId + ' select').addClass('required');

                    // 日期控件 delete by chenmin 20150530
                    // if (Fix.get(htmlId).els.comType=="My97DatePicker")
                    //      $("#"+htmlId+" input").addClass("requiredWdate");
                }

                Fix.get(htmlId).cfg.validationgroup = '';// 需要js校验
            } else if (flag || flag == 'true' || flag === undefined)// 允许为空
            {
                if ($('#' + htmlId).hasClass('required'))// 基本控件
                {
                    $('#' + htmlId).removeClass('required');
                }

                if ($('#' + htmlId + ' input,#' + htmlId + ' .uploadify-title,#' + htmlId + ' select').hasClass('required'))// 复合控件选人
                {
                    $('#' + htmlId + ' input,#' + htmlId + ' .uploadify-title,#' + htmlId + ' select').removeClass('required');

                    // delete by chenmin 20150530
                    // if (Fix.get(htmlId).els.comType=="My97DatePicker")
                    //      $("#"+htmlId+" input").removeClass("requiredWdate");
                }

                Fix.get(htmlId).cfg.validationgroup = 'sysnone';	// 不需要js校验
            }
        } catch (e) {

        }
    }
};

Fix.setReadOnlyAndAllowEmpty = function (exceptionIds, isReadOnly) {
    Fix.setReadOnlyAndAllowEmply(exceptionIds, isReadOnly);
};
/**
 * @description 设置控件只读，同时允许为空
 * @param 逗号分隔的别名串
 */
Fix.setReadOnlyAndAllowEmply = function (exceptionIds, isReadOnly) {
    // 禁用带有disable函数的平台组件

    var exceptionIdArray = exceptionIds.split(',');
    for (var i = 0; i < exceptionIdArray.length; i++) {
        var htmlId = exceptionIdArray[i];
        if (isReadOnly == true || isReadOnly == 'true') {
            $('#' + htmlId).attr('readonly', true).addClass('disabledStyle');
            $('#' + htmlId + ' input').attr('readonly', true).addClass('disabledStyle');

            try {
				 Fix.get(htmlId).els.disable();
		    } catch (e) {}

            Fix.allowEmpty(htmlId, true);
        } else // 可编辑
        {
            $('#' + htmlId).attr('readonly', false).removeClass('disabledStyle');// Wdate required text disabledStyle
            $('#' + htmlId + ' input').attr('readonly', false).removeClass('disabledStyle');

            //  $('textarea').attr('readonly', false).removeAttr("disabledStyle");

            try {
                Fix.get(htmlId).els.enable();
				    } catch (e) {}

			     Fix.allowEmpty(htmlId, false);
        }
    }
};

/**
 * @description 禁用表单输入域
 * @param 逗号分隔的别名串
 */
Fix.setReadOnly = function (exceptionIds, isReadOnly) {
    // 禁用带有disable函数的平台组件

    var exceptionIdArray = exceptionIds.split(',');
    for (var i = 0; i < exceptionIdArray.length; i++) {
        var htmlId = exceptionIdArray[i];
        if (isReadOnly == true || isReadOnly == 'true') {
            $('#' + htmlId).attr('readonly', true).addClass('disabledStyle');
            $('#' + htmlId + ' input').attr('readonly', true).addClass('disabledStyle');

            try {
					 Fix.get(htmlId).els.disable();
			    } catch (e) {}
        } else {
            $('#' + htmlId).attr('readonly', false).removeClass('disabledStyle');
            $('#' + htmlId + ' input').attr('readonly', false).removeClass('disabledStyle');
            try {
                Fix.get(htmlId).els.enable();
				    } catch (e) {}
        }
    }
};

// 设置表单是否只读（禁用）
// 启用只读isreadOnly=true
// 去掉只读isreadOnly=false
Fix.setFormReadOnly = function (isreadOnly) {
    Fix.SetFormReadOnly(isreadOnly);
};

Fix.SetFormReadOnly = function (isreadOnly) {
    var FormData = {};
    var strFormData = '';
    if (isreadOnly || isreadOnly == 'true') // 启用只读
    {
        if (typeof Fix.Engine.Map.items !== 'undefined') {
            $('input').attr('readonly', true).addClass('disabledStyle');
            $('textarea').attr('readonly', true).addClass('disabledStyle');

            for (var i = 0; i < Fix.Engine.Map.items.length; i++) {
                try {
                    var strHtmlID = Fix.Engine.Map.items[i];

				     if (strHtmlID == '_taskComment') { // 意见输入框不只读
				    	 $('#_taskComment').attr('readonly', false).removeAttr('disabledStyle');
		             } else {
						 Fix.get(strHtmlID).els.disable();
				     }
                } catch (e) {}
            }

            // 遍历明细表
            for (var table_id in Fix.Engine.DetailGrid) {
                var obj_detail = Fix.Engine.DetailGrid[table_id];
                var rowlenth = $('#' + table_id).find('tr').length;
                /// /遍历某个明细表的行
                for (var j = 0; j < rowlenth; j++) {
                    // 遍历某行所有的控件
                    for (var k = 0; k < obj_detail.items.length; k++) {
                        try {
                            var str_htmlID = obj_detail.items[k];
							 Fix.get(str_htmlID, table_id, j).els.disable();
                        } catch (e) {}
                    }
                }
            }
            /// ///遍历明细表end
        }
    } else // 可编辑
    {
        if (typeof Fix.Engine.Map.items !== 'undefined') {
            /*
			   if (!$('input').hasClass("required"))
				{
				   $('input').addClass("required");
				}

			   if (!$('textarea').hasClass("required"))
				{
				   $('textarea').addClass("required");
				}
			  */

			  $('input').attr('readonly', false).removeAttr('disabledStyle');
			  $('textarea').attr('readonly', false).removeAttr('disabledStyle');

            for (var i = 0; i < Fix.Engine.Map.items.length; i++) {
                try {
					 var strHtmlID = Fix.Engine.Map.items[i];
					 Fix.get(strHtmlID).els.enable();
                } catch (e) {}
            }

            // 遍历明细表
            for (var table_id in Fix.Engine.DetailGrid) {
                var obj_detail = Fix.Engine.DetailGrid[table_id];
                var rowlenth = $('#' + table_id).find('tr').length;
                /// /遍历某个明细表的行
                for (var j = 0; j < rowlenth; j++) {
                    // 遍历某行所有的控件
                    for (var k = 0; k < obj_detail.items.length; k++) {
                        try {
                            var str_htmlID = obj_detail.items[k];
							 Fix.get(str_htmlID, table_id, j).els.enable();
                        } catch (e) {}
                    }
                }
            }
            /// ///遍历明细表end
        }
    }

    // 新任务消息提示，所有环节都可以修改 add by chenmin 20160308
    $('[name=_NOTIFYCHECK]').removeClass('CheckboxUncheckedDisabled').removeClass('CheckboxCheckedDisabled');
};

// 管控中心专用
// 流程相关-表单窗口大小 defKey :
var FormWinSizeMap = {
    216: {width: 800, height: 600},
    taskcommission: {width: 900, height: 700},
    1: {width: 800, height: 600},
    flow_3DModelSignOff: {width: 800, height: 600},
    flow_seal_Rudong: {width: 800, height: 600},
    projectApp: {width: 900, height: 500}
};

// 获取cookies add by chenmin 20131124
function getcookie (name) {
    var cookie_start = document.cookie.indexOf(name);
    var cookie_end = document.cookie.indexOf(';', cookie_start);
    return cookie_start == -1 ? '' : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
}

// 打开任务表单edit by chenmin 20130728
function OpenFormStart (WebServerUrl, FormUrl, FormTypeId, FormClassId, IsBE2Task, WebName, winStyle, Name) {
    WebName = ''; // 独立工程设置为空
    var url = WebServerUrl + FormUrl;

    var params = {
        X1: getcookie('X1'),
        X2: getcookie('X2')
    };

    if (IsBE2Task == '1') {
        WebName = 'taskcommission';
        params.FuncType = 'Start';
        params.FormTypeId = FormTypeId;
        params.FormClassId = FormClassId;
    }

    if (url !== undefined && url != '') {
        url = Fix.Utils.appendParams(url, params);
    }

    if (url.indexOf('http://') < 0) {
  	host = hostMap[WebName];
  	if (!host) {
  		alert('流程的描述信息需填入应用程序的工程名称，否则无法定位主机地址');
  		return;
  	}
        url = host + url;
    }
    if (url.indexOf('?') > 0) {
  	url = Fix.Util.urlEncodeFull(url); // 解决url存在中文#等特殊字符 add by chenmin 20141027
    }

    var width = 1000;
    var height = 700;
    var resizable = 'yes';
    var Maximize = 'yes';
    var scrollbars = 'yes';
    try {
	  // var  winsize=FormWinSizeMap[FormTypeId]; //获取窗口大小
	  var openWinStyle = Fix.Utils.decode(winStyle);
	  if (openWinStyle) {
	  	width = openWinStyle.width;
	  	height = openWinStyle.height;
	  	resizable = openWinStyle.resizable;
	  	Maximize = openWinStyle.Maximize;
	  	scrollbars = openWinStyle.scrollbars;
	  	}
    } catch (e) {

    }
    var title = Name;

    // createDialog('1', title, width, height, url);

 		var urlParams = {
        sysform: '1'
    };
    var dialogCfg = {
        showMask: false,
        resourceUrl: url,
        title: title,
        height: height,
        width: width
    };
    createWin(dialogCfg, urlParams); // 采用窗口模式 add by chenmin 20160604
}

// 打开任务表单edit by chenmin 20130728
function OpenTaskExec (formUrl, bizObjId, defKey, defId, instId, taskId, nodeId,
    nodeName, fKey, fValue, title, agent, ASSIGNEE, defDesc, winStyle) {
    defDesc = ''; // 独立工程设置为空
    var url = formUrl;
    var params = {
        _objName: bizObjId,
        _defKey: defKey,
        _defId: defId,
        _instId: instId,
        _taskId: taskId,
        _nodeId: nodeId,
        _nodeName: nodeName,
        _agent: agent
    };
    // 沒有处理人,则认为是共享任务
    if (ASSIGNEE != '') {
        if (fValue === undefined || fValue == '') {
            params._useType = 'add';
        } else {
            $.extend(params, {
                _pk: fKey,
                _pkValue: fValue
            });

            params._useType = 'modify';
        }
    } else {
        $.extend(params, {
            _pk: fKey,
            _pkValue: fValue
        });

        params._useType = 'modify';
    }

    if (url !== undefined && url != '') {
        url = Fix.Utils.appendParams(url, params);
    }

    // add by chenmin 20130727 任务待办整合
    if (url.indexOf('http://') < 0) {
        host = hostMap[defDesc];
        if (!host) {
            alert('流程的描述信息需填入应用程序的工程名称，否则无法定位主机地址');
            return;
        }
        url = host + url;
    } else {
        // debugger;

    }
    if (url.indexOf('?') > 0) {
        url = Fix.Util.urlEncodeFull(url); // 解决url存在中文#等特殊字符 add by chenmin 20141027
    }

    var width = 1000;
    var height = 700;
    var resizable = 'yes';
    var Maximize = 'yes';
    var scrollbars = 'yes';
    try {
        // var  winsize=FormWinSizeMap[FormTypeId]; //获取窗口大小
        var openWinStyle = Fix.Utils.decode(winStyle);
        if (openWinStyle) {
            width = openWinStyle.width;
            height = openWinStyle.height;
            resizable = openWinStyle.resizable;
            Maximize = openWinStyle.Maximize;
            scrollbars = openWinStyle.scrollbars;
        }
    } catch (e) {

    }

    /*
	  if(defKey == 'IncomingFile') { // 收文only
	  	 var
            top = (window.screen.availHeight - parseFloat(height))/2,
            left = (window.screen.availWidth - parseFloat(width))/2;
            window.open(url, '' ,
            'height='+height+',width='+width+',top='+top+',left='+left+',toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
	  } else {
	  	 createDialog('1', title, width, height, url);//
	  }

*/
 		var urlParams = {
        sysform: '1'
    };
    var dialogCfg = {
        showMask: false,
        resourceUrl: url,
        title: title,
        height: height,
        width: width
    };

    if (defKey == 'IncomingFile') { // 收文only
	  	 var
            top = (window.screen.availHeight - parseFloat(height)) / 2,
            left = (window.screen.availWidth - parseFloat(width)) / 2;
        window.open(url, '',
            'height=' + height + ',width=' + width + ',top=' + top + ',left=' + left + ',toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no');
	  } else {
	  	createWin(dialogCfg, urlParams); // 采用窗口模式 add by chenmin 20160604
	  }
}
// 打开表单查询  edit by chenmin 20131107
function OpenFormViewLink (formurl, bizObjId, defKey, defId, instId, fKey, fValue, title, defDesc, winStyle) {
    defDesc = '';
    var url = formurl;
    params = {
        _objName: bizObjId,
        _useType: 'view',
        _defKey: defKey,
        _defId: defId,
        _instId: instId,
        _pk: fKey,
        _pkValue: fValue
    };

    if (url !== undefined && url != '') {
        url = Fix.Utils.appendParams(url, params);
    }

    // add by chenmin 20130727 任务待办整合
    if (url.indexOf('http://') < 0) {
        host = hostMap[defDesc];
        // alert(defDesc + host)
        if (!host) {
            alert('流程的描述信息需填入应用程序的工程名称，否则无法定位主机地址');
            return;
        }

        url = host + url;
    }
    if (url.indexOf('?') > 0) {
        url = Fix.Util.urlEncodeFull(url); // 解决url存在中文#等特殊字符 add by chenmin 20141027
    }
    // alert(FormWinSizeMap['taskcommission'].width	);
    // alert(FormWinSizeMap[defKey].width	);

    var width = 1000;
    var height = 700;
    var resizable = 'yes';
    var Maximize = 'yes';
    var scrollbars = 'yes';
    try {
	  // var  winsize=FormWinSizeMap[FormTypeId]; //获取窗口大小
	  var openWinStyle = Fix.Utils.decode(winStyle);
	  if (openWinStyle) {
	  	width = openWinStyle.width;
	  	height = openWinStyle.height;
	  	resizable = openWinStyle.resizable;
	  	Maximize = openWinStyle.Maximize;
	  	scrollbars = openWinStyle.scrollbars;
	  	}
    } catch (e) {

    }

    var returnvalue = ShowDialog({
        url: url,
        data: { a: 1 },
        modal: false,
        width: width,
        height: height
    });
}

// add  by ouyangfan 20131126 委托确认按钮JS
function ensureConsign (opts, btn, url_params) {
    var newUserId = $('#newUserId').val();
    // alert(newUserId);
    var reason = $('#reason').val();
    // 取原执行人
    var orginUser = $('#originUser').val();
    if (newUserId != '' && reason != '') {
        if (confirm('确认委托吗？')) {
            doFlowTrans(url_params._defKey, url_params._taskId, url_params._instId, url_params._businessKey, newUserId, reason, orginUser, url_params._desc);
            Fix.Runtime.closeThisPage(btn);
        }
    }
    if (newUserId == '' || newUserId == null) {
        Fix.Runtime.setError('【新执行人】不能为空！');
    }
    if (reason == '' || reason == null) {
        Fix.Runtime.setError('【委托原因】不能为空！');
    }
}

// add by ouyangfan 20131122 打开任务委托页面
function openConsignPage (desc, name, defKey, taskId, instId, businessKey, assignName, WEBNAME, ISBE2TASK) {
    WEBNAME = '';
    // alert(WEBNAME);
    // alert(ISBE2TASK+"+"+businessKey+"+"+taskId+"+"+instId);
    var host = hostMap[WEBNAME];
    // alert(host);
    if (!host) {
        alert('流程的描述信息需填入应用程序的工程名称，否则无法定位主机地址');
        return;
    }
    if (taskId == '' || taskId == null) {
        alert('当前任务无法委托！');
        return;
    }
    var url;

    if (ISBE2TASK == 'true') {
		 url = host + 'ConsignPage.aspx';
		 url = url + '?_RelateId=' + businessKey + '&Id=' + taskId + '&FlowId=' + instId;
    } else {
        url = host + 'forms/system/TASK/newConsignPage.html';
        url = url + '?_defKey=' + defKey + '&_taskId=' + taskId + '&_instId=' + instId +
		'&_businessKey=' + businessKey + '&_assignName=' + assignName + '&_name=' + name + '&_desc=' + desc;
    }

    /*	var returnvalue = ShowDialog({
		url: url,
	    data: { a: 1 },
	    modal: false,
	    resizable:'no',
      Maximize:'no',
	    width: 450,
	    height: 300
	}); */

	  createDialog('1', '任务委托', '450', '320', url);

	  Fix.Uniform.refresh();
}

// 任务委托 add by chenmin 20130730
function doFlowTrans (defKey, taskId, instId, businessKey, AuditUserFullName, consignReason, orginUser, desc) {
//	var defKey = "";
//	var taskId = "";
//	var instId = "";
//	var businessKey = "";
    var userId = AuditUserFullName;

    var flowParam = {
        defKey: defKey,
        taskId: taskId,
        instId: instId,
        userCommandId: 'transfer',
        userCommandType: 'transfer',
        isAdmin: true,
        taskComment: '委托原因:' + consignReason + '<br/>原执行人：' + orginUser,
        // taskComment:taskComment1,
        businessKey: businessKey,
        userName: userId,
        description: desc
    };

    flowParam.extParam = {
        transferUserId: userId
    };

    Fix.ajax({
        action: {
            // _method: "formService.doFlowAction",
    	  _method: 'formflow.doConsignFlow',
            _param: {
                flowParam: flowParam
            }
        },
        async: false,
        success: function (response) {
      	alert('委托成功！');
        }
    });
}

// add by chenmin 20160806 打开任务委托页面
function openTaskConsign (desc, nodeName, defKey, taskId, instId, businessKey, originUserFullName, originUserName, webName, ISBE2TASK) {
    // alert(WEBNAME);
    // alert(ISBE2TASK+"+"+businessKey+"+"+taskId+"+"+instId);
    var host = hostMap[webName];
    // alert(host);
    if (!host) {
        alert('流程的描述信息需填入应用程序的工程名称，否则无法定位主机地址');
        return;
    }
    if (taskId == '' || taskId == null) {
        alert('当前任务无法委托！');
        return;
    }
    // 人员证书审批流程-劳动人事处负责人审批，不能委托  2017-3-12
    if (defKey == 'PersonnalCerticateFlow2' && nodeName == '劳动人事处负责人审批') {
        alert('当前任务无法委托，必须要流程指定审批人执行！');
        return;
    }

    var url;

    if (ISBE2TASK == 'true') {
		 url = host + 'ConsignPage.aspx';
		 url = url + '?_RelateId=' + businessKey + '&Id=' + taskId + '&FlowId=' + instId;
    } else {
        url = host + 'forms/system/TASK/taskConsign.html';
        url = url + '?_defKey=' + defKey + '&_taskId=' + taskId + '&_instId=' + instId +
		'&_businessKey=' + businessKey +
		'&_originUserFullName=' + originUserFullName +
		'&_originUserName=' + originUserName +
		'&_nodeName=' + nodeName + '&_desc=' + desc;
    }

	 url = Fix.Util.urlEncodeFull(url); // 解决url存在中文#等特殊字符 add by chenmin 20161213

	  createDialog('1', '任务委托', '450', '320', url);

	  Fix.Uniform.refresh();
}

// add  by chenmin 20160806  任务委托提交按钮
function submitTaskConsign (opts, btn, url_params) {
    var newUserName = $('#newUserName').val();

    var consignReason = $('#consignReason').val();
    // 取原执行人
    var originUserFullName = $('#originUserFullName').val();
    var originUserName = $('#originUserName').val();

   	if (newUserName == '') {
        Fix.Runtime.setError('【新执行人】不能为空！');
    }
    if (consignReason == '') {
        Fix.Runtime.setError('【委托原因】不能为空！');
    }

    if (newUserName == originUserName) {
        Fix.Runtime.setError('不能委托给原执行人！');
    }

    if (newUserName != '' && consignReason != '') {
        if (confirm('确认委托吗？')) {
            doFlowTrans(url_params._defKey, url_params._taskId, url_params._instId,
                url_params._businessKey, newUserName, consignReason, originUserFullName, originUserName, url_params._desc);

            Fix.Runtime.closeThisPage(btn);
        }
    }
}
// 任务委托 add by chenmin 20130730
function doFlowTrans (defKey, taskId, instId, businessKey, newUserName, consignReason, originUserFullName, originUserName, desc) {
    var flowParam = {
        defKey: defKey,
        taskId: taskId,
        instId: instId,
        userCommandId: 'transfer',
        userCommandType: 'transfer',
        isAdmin: true,
        taskComment: '委托原因:' + consignReason + '<br/>原执行人：' + originUserFullName,
        businessKey: businessKey,
        userName: newUserName,
        originUserName: originUserName,
        originUserFullName: originUserFullName,
        description: desc
    };

    flowParam.extParam = {
        transferUserId: newUserName
    };

    Fix.ajax({
        action: {
            // _method: "formService.doFlowAction",
    	  _method: 'formflow.doConsignFlow',
            _param: {
                flowParam: flowParam
            }
        },
        async: false,
        success: function (response) {
      	alert('委托成功！');
        }
    });
}
/**
* @description 控制按钮样式
*/
function ButtonStyle () {
    $("a[commandtype='general'] em").addClass('ui-icon-agree');
    $("a[commandtype='rollBackTaskByExpression'] em").addClass('ui-icon-refuse');
    $("a[commandtype='rollBackTaskPreviousStep'] em").addClass('ui-icon-refuse');
    $("a[commandtype='terminationProcess'] em").addClass('ui-icon-abandon');
}
Fix.ButtonStyle = function () {
    ButtonStyle();
};

/**
 * @description 禁用表单输入域
 * @param 逗号分隔的别名串
 */
function disableFields (exceptionIds) {
    // 禁用带有disable函数的平台组件
    var exceptionIdArray = exceptionIds.split(',');
    for (var i = 0; i < exceptionIdArray.length; i++) {
        Fix.get(exceptionIdArray[i]).els.disable();
    }
}

/**
 * 给指定jQuery对象加入非空边框样式
 *
 * @param $elements
 *            需要验证的元素集合
 */
function setEmptyBorderStyle ($elements) {
    if (!($elements instanceof jQuery)) { // 不是有效集合
        throw new Error('setEmptyBorderStyle():参数类型错误！');
    }
    $elements.each(function (index) {
        if (!$(this).hasClass('failformcss')) {
            $(this).addClass('failformcss');
        }
    });
}

Fix.setEmptyBorderStyle = function ($elements) {
    setEmptyBorderStyle($elements);
};

// 表单导出
Fix.exportPage = function (formName, width, height) {
    var search = window.location.search;
    var dWidth = width || '1000';
    var dHeight = height || '750';
    var url = formName + search;

    window.open(url, '', 'location=no,scrollbars=yes,resizable=yes,height=' + dHeight + ',width=' + dWidth);
};

// 通过业务主键获取流程实例
Fix.getInstIdbyBizId = function (bizId) {
    var instId = '';
    Fix.ajax({
        action: {
            _method: 'flow.getInstIdByBizKey',
            _param: [ bizId ]
        },
        async: false,
        loading: false,
        success: function (response) {
            instId = response.instId;
        }
    });
    return instId;
};

// 打开流程图
Fix.openFLowGraphiParam = function (instId) {
    var taskListEnd = '';
    var taskListIng = '';
    Fix.ajax({
        action: {
            _method: 'flow.getTaskProcess',
            _param: [ instId ]
        },
        async: false,
        loading: false,
        success: function (response) {
            var procData = response;
            taskListEnd = procData.taskListEnd;
            taskListIng = procData.taskListIng;
        }
    });

    var defId = taskListEnd[0].defId;
    var defKey = taskListEnd[0].defKey;

    var url = Fix.App.appHost + 'procList.html';
    ;
    // 检测IE

    if ($.browser.msie && $.browser.version == 8) {
        url = Fix.App.appHost + 'procList_image.html';
    }

    var params = {
        _defKey: defKey,
        _defId: defId,
        _instId: instId
        // _startEvent : This.setting.startEvent
    };

    for (var key in params) {
        if (params[key] === undefined) {
            delete params[key];
        }
    }

    url = Fix.Utils.appendParams(url, params);
    window.open(url);
};

// 按钮，打开流程图
Fix.FixFlowGraphiBtn = function () {
    var urlParam = Fix.getURLParams(window.location.href);
    var bizId = urlParam['_pkValue'];// 业务关联值
    var defKey = urlParam['_defKey'];// 流程key号
    var defId = urlParam['_defId'];// 流程定义
    var instId = urlParam['_instId'];// 流程实例

    if (instId == undefined) // 针对无流程信息
    {
        instId = Fix.getInstIdbyBizId(bizId);
        Fix.openFLowGraphiParam(instId);
    } else {
        var url = Fix.App.appHost + 'procList.html';
		   // 检测IE
	    if ($.browser.msie && $.browser.version == 8) {
            url = Fix.App.appHost + 'procList_image.html';
	    }
	    url = 'http://' + window.location.host + url;

        var params = {
            _defKey: defKey,
            _defId: defId,
            _instId: instId
            // _startEvent : This.setting.startEvent
        };

        for (var key in params) {
            if (params[key] === undefined) {
                delete params[key];
            }
        }

        url = Fix.Utils.appendParams(url, params);
        window.open(url);
    }
};
// 表单导出按钮
Fix.exportForm = function () {
    $('body').css({background: '#fff'});
    // $(".win_form").css({padding:'20px'})
    $('.win_form').find('hr').remove();
    $('.win_form').find('#titleName,#taskName').remove();
    $('.win_form').find('h1').addClass('h1title');
    $('.form_table').addClass('export-table');
    $('.export-table').find('input,select').removeAttr('disabled');
    $('.export-table tr.noreport').remove();
    $('.export-table td.noreport').html('');
    // 明细表
    $('.dltable1').addClass('export-table-detail');
    $('.dltable1 .table-top img').remove();
    $('.dltable1').find('tfoot').remove();
    $('.dltable1 thead td:eq(0)').remove();
    $('.dltable1 tbody tr').find('td:eq(0)').remove();

    $('.export-table td.td_txt,.row-status-default td').each(function () {
        var _this = $(this);
        var item = _this.children();
        if (item.length > 0) {
            for (var i = 0; i < item.length; i++) {
                var tagName = item[i].tagName;
                var obj = item[i];
                switch (tagName.toLowerCase()) {
                    case 'span':
                        if ($(obj).attr('componenttype') != 'undefined') {
                            try {
                                if (_this.hasClass('td_txt')) {
                                    var id = $(obj).attr('id');
                                    Fix.get(id).els.doExport();
                                } else {
                                    var table = _this.closest('.ui-table-Detail');
                                    if (table.length == 0) { table = _this.closest('.table'); }
                                    var tableid = table.attr('id');
                                    var rowindex = _this.parent().index();
                                    var id = $(obj).attr('id');
                                    Fix.get(id, tableid, rowindex).els.doExport(_this);
                                }
                            } catch (e) {

                            }
                        }
                        break;
                    case 'input':
                        if ($(obj).css('display') != 'none' && $(obj).attr('type') != 'hidden') {
                            var val = $(obj).val();
                            // _this.html(val);
                            $(obj).replaceWith(val);
                        }
                        break;
                    case 'textarea':
                        var val = $(obj).val();
                        _this.html(val);
                        _this.css({'text-align': 'left'});
                        break;
                }
            }
        }
    });
    try {
        var flowstate = $("span[componenttype='FormFlowState']");
        if (flowstate.length > 0) {
            var id = flowstate.attr('id');
            Fix.get(id).els.doExport();
        }
    } catch (e) {}
    $('#tool-box').hide();
};

Fix.printPage = function (obj, portrait) {
    Fix.PagePrint(obj, portrait);
};
// 打印 add by ouyangfan 20131111 页面打印
Fix.PagePrint = function (obj, portrait) {
    try {
        obj.style.display = 'none';
	    window.factory.printing.header = ''; // 设定页首的文字
        factory.printing.footer = ''; // 设定页尾的文字
        if (portrait == null) { factory.printing.portrait = true; } // 设定为横印
        else { factory.printing.portrait = portrait; } // 设定为横印

        factory.printing.leftMargin = 0.0; // 设定左边界
        factory.printing.topMargin = 20; // 设定上边界
        factory.printing.rightMargin = 0.0; // 设定友边界
        factory.printing.bottomMargin = 0.4; // 设定下边界
        factory.printing.paperSource = 'Manual feed';
      	factory.printing.print(true); // 打印其(true)为显示打印询问窗口若为false则不出现打印询问窗口
    } catch (e) {
        window.print();
    }
};
/**
 * 逻辑删除
 * 表名(可为空)、视图名(可为空)、状态字段、状态值、修改人、修改时间、查多方法(可为空)
 */
Fix.logicDelete = function (table_Id, view_Id, status_Name, status_Value, update_name, update_date, data_base, all_select, sqlcon) {
    // 业务对象
    table_Id = Fix.Uniform.config.BizObj;
    // 列表编号
    view_Id = Fix.Uniform.config.ViewId;
    // Fix.Uniform.config .MenuId(菜单编号)
    // 方法编号
    all_select = table_Id + '.' + Fix.Uniform.uniform.Store.baseDef.methodId;

    // true为跨页全选
    if (Fix.Uniform.isAllSelected) {
        var checkedTrs = Fix.Uniform.uniform.Runtime.complexFilter;

        if (confirm('确定要将这些数据删除？')) {
            Fix.ajax({
                action: {
                    _method: 'Eciditoolbar.allDeleteLogic'
                },
                data: {'TERMS': checkedTrs,
                    'ALLSELECT': all_select,
                    'DATA_BASE': data_base,
                    'TABLE': table_Id,
                    'STATUS': status_Name,
                    'STATUSVALUE': status_Value,
                    'UPDATENAME': update_name,
                    'UPDATEDATE': update_date,
                    'SQLCON': sqlcon},
                success: function (response) {
                    alert('删除成功');
                    // window.location.reload(true);
                    Fix.Uniform.refresh();
                }
            });
        }
    } else { // 跨页选择
        var bizObj = table_Id;
        var viewId = view_Id;
        var topWin = Fix.Util.getTopWin();
        var checkedTr = topWin[bizObj + '_' + viewId];
        var flag = $('#dataTable [name=checkedAll]:checkbox').attr('checked');
        if (flag == undefined) {

        } else {
            var i = 0;
            $('.row_selected').each(function (index) {
                checkedTr[i] = $(this).data('GUID');
                i++;
            });
        }
        if (confirm('确定要将这些数据删除？')) {
            Fix.ajax({
                action: {
                    _method: 'Eciditoolbar.deleteLogic'
                },
                data: {'GUID': checkedTr,
                    'DATA_BASE': data_base,
                    'TABLE': table_Id,
                    'STATUS': status_Name,
                    'STATUSVALUE': status_Value,
                    'UPDATENAME': update_name,
                    'UPDATEDATE': update_date,
                    'SQLCON': sqlcon},
                success: function (response) {
                    alert('删除成功');
                    // window.location.reload(true);
                    Fix.Uniform.refresh();
                }
            });
        }
    }
};
// 日期比较
// true:startdate<=endate
// false:startdate>endate
Fix.compareDate = function (checkStartDate, checkEndDate) {
	 var arys1 = new Array();
	 var arys2 = new Array();

    if (checkStartDate != null && checkEndDate != null) {
	    arys1 = checkStartDate.split('-');
	      var sdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
	    arys2 = checkEndDate.split('-');
	    var edate = new Date(arys2[0], parseInt(arys2[1] - 1), arys2[2]);
        if (sdate > edate) {
		    return false;
        } else {
		    return true;
        }
	 }
};
// 取cookies函数   chenmin  20140730
Fix.getCookie = function (name) {
    var arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
    if (arr != null) { return unescape(arr[2]); } else { return null; }
};
// 获取当前登录用户logid
Fix.getOnlineUser = function () {
    var onlineUser = '';
    Fix.ajax({
        action: {
            _method: 'systemService.getUserItems'
        },
        async: false,
        success: function (response) {
            onlineUser = response.userInfo;
        }
    });
    return onlineUser;
};

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function (mask) { // author: meizz
    var d = this;
    var zeroize = function (value, length) {
        if (!length) length = 2;
        value = String(value);
        for (var i = 0, zeros = ''; i < (length - value.length); i++) {
            zeros += '0';
        }
        return zeros + value;
    };

    return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0) {
        switch ($0) {
            case 'd': return d.getDate();
            case 'dd': return zeroize(d.getDate());
            case 'ddd': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
            case 'dddd': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
            case 'M': return d.getMonth() + 1;
            case 'MM': return zeroize(d.getMonth() + 1);
            case 'MMM': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
            case 'MMMM': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
            case 'yy': return String(d.getFullYear()).substr(2);
            case 'yyyy': return d.getFullYear();
            case 'h': return d.getHours() % 12 || 12;
            case 'hh': return zeroize(d.getHours() % 12 || 12);
            case 'H': return d.getHours();
            case 'HH': return zeroize(d.getHours());
            case 'm': return d.getMinutes();
            case 'mm': return zeroize(d.getMinutes());
            case 's': return d.getSeconds();
            case 'ss': return zeroize(d.getSeconds());
            case 'l': return zeroize(d.getMilliseconds(), 3);
            case 'L': var m = d.getMilliseconds();
                if (m > 99) m = Math.round(m / 10);
                return zeroize(m);
            case 'tt': return d.getHours() < 12 ? 'am' : 'pm';
            case 'TT': return d.getHours() < 12 ? 'AM' : 'PM';
            case 'Z': return d.toUTCString().match(/[A-Z]+$/);
            // Return quoted strings with the surrounding quotes removed
            default: return $0.substr(1, $0.length - 2);
        }
    });
};
// 日期相加、相减的扩展方法
Date.prototype.dateAdd = function (interval, number) {
    var d = this;
    var k = {'y': 'FullYear', 'q': 'Month', 'm': 'Month', 'w': 'Date', 'd': 'Date', 'h': 'Hours', 'n': 'Minutes', 's': 'Seconds', 'ms': 'MilliSeconds'};
    var n = {'q': 3, 'w': 7};
    eval('d.set' + k[interval] + '(d.get' + k[interval] + '()+' + ((n[interval] || 1) * number) + ')');
    return d;
};
Date.prototype.dateDiff = function (interval, objDate2) {
    var d = this, i = {}, t = d.getTime(), t2 = objDate2.getTime();
    i['y'] = objDate2.getFullYear() - d.getFullYear();
    i['q'] = i['y'] * 4 + Math.floor(objDate2.getMonth() / 4) - Math.floor(d.getMonth() / 4);
    i['m'] = i['y'] * 12 + objDate2.getMonth() - d.getMonth();
    i['ms'] = objDate2.getTime() - d.getTime();
    i['w'] = Math.floor((t2 + 345600000) / (604800000)) - Math.floor((t + 345600000) / (604800000));
    i['d'] = Math.floor(t2 / 86400000) - Math.floor(t / 86400000);
    i['h'] = Math.floor(t2 / 3600000) - Math.floor(t / 3600000);
    i['n'] = Math.floor(t2 / 60000) - Math.floor(t / 60000);
    i['s'] = Math.floor(t2 / 1000) - Math.floor(t / 1000);
    return i[interval];
};
// miniui下面的选人

Fix.chooseUserWin = function (params, callback) {
    // var pageurl = location.protocol + "//" + location.host + Fix.App.appHost+"components/ECIDISelect/selectPage_miniui.html";
    var pageurl;
    if (_isDomain == 0) // 单机 add by chenmin 20151214
    {
        pageurl = 'http://' + window.location.host + Fix.App.appHost + 'components/ECIDISelect/selectPage_miniuiWeb.html';
    } else {
        pageurl = 'http://' + window.location.host + Fix.App.appHost + 'components/ECIDISelect/selectPage_miniui.html';
    }

    var url = Fix.appendParams(pageurl, params);
    mini.open({
        url: url,
        title: '人员选择',
        width: 940,
        height: 540,
        //        onload: function () {
        //            var iframe = this.getIFrameEl(); //获取iframe对象
        //            iframe.contentWindow.SetData(gridData, callbackfunc);
        //        },
        ondestroy: function (action) {
            if (action == 'ok') {
                var iframe = this.getIFrameEl();
                var data = iframe.contentWindow.getReturnData();
                data = mini.clone(data);

                callback(data);
            }
        }
    });
};

Fix.chooseRoleWin = function (params, callback) {
    // var pageurl = location.protocol + "//" + location.host + Fix.App.appHost+"components/MultipleSelect/selectPageRole_miniui.html";
    var pageurl;
    if (_isDomain == 0) // 单机 add by chenmin 20151214
    {
        pageurl = 'http://' + window.location.host + Fix.App.appHost + 'components/MultipleSelect/selectPageRole_miniuiWeb.html';
    } else {
        pageurl = 'http://' + window.location.host + Fix.App.appHost + 'components/MultipleSelect/selectPageRole_miniui.html';
    }

    var url = Fix.appendParams(pageurl, params);
    mini.open({
        url: url,
        title: '角色选择',
        width: 940,
        height: 540,
        //        onload: function () {
        //            var iframe = this.getIFrameEl(); //获取iframe对象
        //            iframe.contentWindow.SetData(gridData, callbackfunc);
        //        },
        ondestroy: function (action) {
            if (action == 'ok') {
                var iframe = this.getIFrameEl();
                var data = iframe.contentWindow.getReturnData();
                data = mini.clone(data);

                callback(data);
            }
        }
    });
};
// miniui下面选部门
Fix.chooseGroupWin = function (params, callback) {
    var pageurl;
    if (_isDomain == 0) // 单机 add by chenmin 20151214
    {
        pageurl = 'http://' + window.location.host + Fix.App.appHost + 'components/ECIDIGroupChoose/selectPage_miniuiWeb.html';
    } else {
        pageurl = 'http://' + window.location.host + Fix.App.appHost + 'components/ECIDIGroupChoose/selectPage_miniui.html';
    }

    var url = Fix.appendParams(pageurl, params);
    mini.open({
        url: url,
        title: '部门选择',
        width: 450,
        height: 620,
        //        onload: function () {
        //            var iframe = this.getIFrameEl(); //获取iframe对象
        //            iframe.contentWindow.SetData(gridData, callbackfunc);
        //        },
        ondestroy: function (action) {
            if (action == 'ok') {
                var iframe = this.getIFrameEl();
                var data = iframe.contentWindow.getReturnData();
                data = mini.clone(data);

                callback(data);
            }
        }
    });
};
Fix.showTips = function (msg, state, callback) {
    mini.showTips({
        content: msg || '',
        state: state || 'danger',
        x: 'center',
        y: 'top',
        timeout: 3000,
        callback: callback
    });
};

// pageoffice通用代码
function checkChromeVersion () {
    // alert(navigator.userAgent);
    var nua = navigator.userAgent;
    var chromePos = nua.toLowerCase().indexOf('chrome/');
    if (chromePos > 0) {
        // alert(nua.substring(chromePos + 7, chromePos + 9));
        return Number(nua.substring(chromePos + 7, chromePos + 9));
    } else {
        return 0;
    }
}

function PO_checkPageOffice () {
    var bodyHtml = document.body.innerHTML;
    if (bodyHtml.indexOf('EC852C85-C2FC-4c86-8D6B-E4E97C92F821') < 0) {
        var poObjectStr = '';
        var explorer = window.navigator.userAgent;
        // alert(explorer)
        isIE11 = (explorer.toLowerCase().indexOf('trident') > -1 && explorer.indexOf('rv') > -1);
        // alert("isIE11:="+isIE11)
        // ie
        if (isIE11 || explorer.indexOf('MSIE') >= 0) {
            poObjectStr = '<div style="background-color:green;width:1px; height:1px;">' + '\r\n' +
			'<object id="PageOfficeCtrl1" height="100%" width="100%" classid="clsid:EC852C85-C2FC-4c86-8D6B-E4E97C92F821">' +
			'</object></div>';

            // alert(poObjectStr)
        } else {
            poObjectStr = '<div style="background-color:green;width:1px; height:1px;">' + '\r\n' +
			'<object id="PageOfficeCtrl1" height="100%" width="100%" type="application/x-pageoffice-plugin" clsid="{EC852C85-C2FC-4c86-8D6B-E4E97C92F821}">' +
			'</object></div>';
        }

        $(document.body).append(poObjectStr);
    }

    try {
        var sCap = document.getElementById('PageOfficeCtrl1').Caption;

        if (sCap == null) {
            // window.open("http://"+window.location.host+Fix.App.appHost+"/install.html",'','width=500,height=150,location=0,resizable=0,scrollbars=0');
            return false;
        } else {
            return true;
        }
    } catch (e) {
        // window.open("http://"+window.location.host+Fix.App.appHost+"/install.html",'','width=500,height=150,location=0,resizable=0,scrollbars=0');
        return false;
    }
}
// 在线编辑 add by chenmin 20160619
// 自定义代码,函数名必须是opennewwin
function opennewwin (field_token) {
	 Fix.ajax({
        action: {
            _method: 'systemService.getUserItems'
        },
        async: false,
        success: function (response) {
      	var username = escape(response.userInfo.userName);
      	var usernameurl = encodeURI(username);

            var url = 'http://' + window.location.host + Fix.App.appHost;
		   url = url + 'pageoffice/OpenWord/openword.jsp?field_token=' + field_token + '&username=' + usernameurl;

		    if (checkChromeVersion() > 41) { // chrome41以上的版本号，调用IE9浏览器
	         	url = 'PageOffice://|' + url + '|width=1200px;height=800px;||';
			     window.location.href = url;

                if (!PO_checkPageOffice()) {
                    var poCheck = document.getElementById('po_check'); // 显示信息，提示客户安装PageOffice
                    poCheck.innerHTML = "<span style='font-size:12px;color:red;'>chrome浏览器如果无法打开页面，请先安装<a href='/integratedsubsys/posetup.exe' style='border:solid 1px #0473b3; color:#0473b3; padding:1px;'>PageOffice客户端</a></span>";
                }
			 } else {
			 	window.open(url, '在线编辑', 'width=' + (window.screen.availWidth - 10) + ',height=' + (window.screen.availHeight - 30) + ',top=0,left=0,resizable=yes,status=yes,menubar=no,location=no,scrollbars=yes');
			 }
        }
    });
}

function openPageOffice (url) {
    var width = window.screen.availWidth - 10;
    var height = window.screen.availHeight - 50;

	    if (checkChromeVersion() > 41) { // chrome41以上的版本号，调用IE9浏览器
	    	url = 'PageOffice://|' + url + '|width=' + width + ';height=' + height + ';||';
		    window.location.href = url;
		 } else {
		 	window.open(url, '浏览文件', 'width=' + width + ',height=' + height + ',top=0,left=0,resizable=yes,status=yes,menubar=no,location=no,scrollbars=yes');
		 }
}

// add by chenmin 20161004 资源查询
function viewResourceResult (GROUP_ID, GROUP_TYPE, BIZOBJ_ID, BIZOBJ_NAME) {
    url = 'http://' + window.location.host + Fix.App.getHost() + 'theme/ecidi/StandardUniform.html?_objName=FIX_BIZ_RESOURCE_CONFIG&_viewId=resourceConfigList';
    url += "&formSql=OWNER_ID = '" + GROUP_ID + "' and OWNER_TYPE ='" + GROUP_TYPE + "' and BIZOBJ_ID ='" + BIZOBJ_ID + "'";

    createDialog('1', '查询资源', 900, 700, url);
}
function viewResourceResult2 (GROUP_ID, GROUP_TYPE, BIZOBJ_ID, BIZOBJ_NAME) {
    url = 'http://' + window.location.host + Fix.App.getHost() + 'theme/ecidi/StandardUniform.html?_objName=FIX_BIZ_RESOURCE_CONFIG&_viewId=resourceConfigList2';
    url += "&formSql=OWNER_ID = '" + GROUP_ID + "' and OWNER_TYPE ='" + GROUP_TYPE + "' and BIZOBJ_ID ='" + BIZOBJ_ID + "'";

    createDialog('1', '查询资源', 900, 700, url);
}

// 设置 默认值
Fix.setDefaultAudit = function (targetUserFullName, targetUserName, roleId, isSingle) {
    $.ajax({
        url: '../../../servlet/Action.cmd', // url是接口地址
        data: {
		 '_method': 'V_USER_SELECT.getDefaultRoleUser',
		 'roleId': roleId
        }, // 传入的参数
        async: false, // 设置是否异步
        dataType: 'jsonp', // 跨域必须这么设置
        success: function (response) {
            var userFullName = '';
            var userName = '';
		    var ids = [], names = [];
            if (response.data) {
                if (isSingle) { // 单人
                    userName = response.data[0].USER_NAME; // 用户名
				    userFullName = response.data[0].USER_FULLNAME; // 姓名
                } else // 多人
                {
                    for (var i = 0; i < response.data.length; i++) {
                        var row = response.data[i];
                        ids.push(row.USER_NAME);
                        names.push(row.USER_FULLNAME);
                    }
                    userName = ids.join(','); // 用户名
                    userFullName = names.join(','); // 姓名
                }
            }

		    Fix.set(targetUserFullName, userFullName);
		    Fix.set(targetUserName, userName);
        }
    });
};

// 获取附件HTTP路径
Fix.getFilePath = function (systemseq) {
    var file = '';
    var filePrefix = hostMap['file'];
    $.ajax({
        url: '../../../servlet/Action.cmd', // url是接口地址
        data: {
		 '_method': 'FIX_ACC_FILE_INFO.getSingleFile',
		 'ID': systemseq
        }, // 传入的参数
        async: false, // 设置是否异步
        dataType: 'jsonp', // 跨域必须这么设置
        success: function (response) {
            if (response.result.length > 0) {
                file = response.result[0].FILE_NAME;
            }
        }
    });
    if (file != '') {
        file = filePrefix + file;
    }
    file = file.replaceAll('\\\\', '\/');
    return file;
};
// 明细表排序方法 ,tableId:明细表htmlId, fieldId:需要排序的字段htmlId
Fix.detailTableSortBy = function (tableId, fieldId) {
    // 明细表排序
    var rtpx = function (first, last) {
        var flag = -1;
        if (parseFloat($('#' + fieldId, $(first)).val()) > parseFloat($('#' + fieldId, $(last)).val())) {
		    $(last).after($(first));
		    flag = 1;
        } else {
		   $(last).before($(first));
        }
		 return flag;
    };

	    $('#' + tableId).find('tr').sort(rtpx);
};
