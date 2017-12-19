Fix.Component = window.Fix.Component || {};

Fix.Manager = (function(){
	var that = this;
	var _currErrArray = new Array();
	var _obj_COMSelf;
	var _runtime;
	return{
		init:function(){
			_obj_COMSelf = this;
			_runtime = {};
		},
		createTabInMainTab: function(tabCfg, callback, win){
			var token = Fix.Utils.newGuid();
			
			var TabPanel;
			if(win !== undefined){
				TabPanel = win.MainTab;
				if(TabPanel==undefined){
					TabPanel = iframepage.MainTab;
				}
				
			}
			else{
				TabPanel = iframepage.MainTab;
			}
			tabCfg.pId =  TabPanel.historyTabs[0].id;
			tabCfg.frontImg = "ui-icon ui-icon-document";
			tabCfg.token = token;
			TabPanel.add(tabCfg);
			
			_runtime[token] = {
				func:"createTabInMainTab",
				close:function(){
					callback( TabPanel.historyTabs[0] );
					TabPanel.remove($(TabPanel.historyTabs[0]));
				},
				callback:callback,
				obj: TabPanel
			};
		},
		createDialog: function(dialogCfg, callback, win){
			var token = Fix.Utils.newGuid();
			
			dialogCfg.token = token;
			
			var dialogObj ;
			if(win == window)
				dialogObj =topDialog(dialogCfg);
			else
				dialogObj =topDialog(dialogCfg);//dialogObj =win.Fix.openMethod.dialog(dialogCfg);
			
			/*dialogObj.onRemoved(function(){
				//win.Fix.Runtime.clearAllError();
			});	*/		
			
			_runtime[token] = {
				func:"createDialog",
				close:function(){
					callback( dialogObj );
					dialogObj.remove();
					dialogObj = null;
					delete dialogObj;
				},
				callback:callback,
				obj: dialogObj
			};
		},
		createWindow: function(winCfg, callback){
			/*
			var token = Fix.Util.newGuid();
			
			var winHandler = window.open();
			//winHandler.token = token;
			winHandler.document.write("<html><body><div class='fixContainer fixWindow' style='width:100%;height:100%' token='" + token + "'><iframe width='100%' height='100%' border=0 frameborder=0 scrolling='auto' src='" + winCfg.url + "' /><\/div><\/body><\/html>");
			winHandler.opener = self;
			winHandler.title = "111";
			
			_runtime[token] = {
				func:"createWindow",
				close:function(){
					winHandler.close();
					callback();
				},
				callback:callback
			};
			*/
		},
		createSlide: function(slideCfg, callback, win){
			var token = Fix.Utils.newGuid();
			var SlideObj = win.Fix.openMethod.slide(slideCfg);
			
			_runtime[token] = {
				func:"createSlide",
				close:function(){
					callback(SlideObj);
					SlideObj.close();
				},
				callback:callback,
				obj: SlideObj
			};
			
			return SlideObj;
		},
		close: function(token){
			if(typeof(token)=="undefined")
			{
				try
				{
					top.closeTabWindow();
				}catch(e){
					window.close();
				}
			}
			else
			{
				_runtime[token].close();
				_runtime[token].obj = null;
				_runtime[token].callback = null;
				_runtime[token].close = null;
				_runtime[token].func = null;
				//_runtime.splice(token, 1);
				delete _runtime[token];		
			}
					
		},
		callback: function(token){
			if(_runtime[token].callback !== undefined)
				_runtime[token].callback();
		},
		getInst: function(token){
			if (typeof _runtime[token] !="undefined") //add by chenmin 20150907  针对有tab页面的通用列表
			    return _runtime[token].obj;
			else
				return "";
		},
		clearError: function(){
			for(var i=0;i<_currErrArray.length;i++){
				_currErrArray[i].pnotify_remove();
			}
			if(_obj_COMSelf.CurrErr){
				_obj_COMSelf.CurrErr.pnotify_remove();
			}
		},
		CurrErrArray: _currErrArray,
		CurrErr:null
	};
})();
Fix.Manager.init();

function topDialog(objCfg){

	if (objCfg.url == '' || objCfg.url == undefined)
		return;
	
	if(objCfg.height === undefined || objCfg.height == "")
		objCfg.height = "280px";
	if(objCfg.width === undefined || objCfg.width == "")
		objCfg.width = "500px";
	if(objCfg.title === undefined || objCfg.title == "")
		objCfg.title = "  ";
	objCfg.containerType = "iframe";
	var JQDialog = new Fix.Component.JQDialog(objCfg);
	var $container = JQDialog.draw();
	//$container.attr("src",objCfg.url);
	//JQDialog.show();
	JQDialog.onRemoved(function(){
		Fix.Util.getTopWin().Fix.Manager.clearError();
	});
	
	return JQDialog;
}




/*Fix.Runtime = {
	CurrErrObj:{},
	clearAllError: function(){
		for(var i = 0; i < this.CurrErrObj.length; i++){
			this.CurrErrObj[i].notice.pnotify_remove();
		}
	}
}
*/