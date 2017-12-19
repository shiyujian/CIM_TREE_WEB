Fix = window['Fix'] || {};
Fix.Exception = Fix.Exception || {};
Fix.Exception.Const = {
	FieldsNotSet:"{0}组件,Fields属性没有设置",
	DataStoreNotSet:"{0}组件,DataStore没有设置",
	COMNotSet:"{0}组件配置没有设置,无法使用",
	DataAdapterConfigJSONNotSet:"数据访问组件配置没有设置,无法使用",
	AjaxConfigNotSet:"{0}组件,Ajax访问属性没有配置,无法使用",
	
	TriggerFactory_001: "组件触发器中没有设置tagName属性",
	TriggerFactory_002: "组件触发器中没有设置content属性",
	TriggerFactory_101: "组件触发器不支持该tagName值:{0}",
	
	AliasAdapter_001: "目标别名没有设置",
	
	GetStore_001: "{0}组件,需要做数据访问时既没有找到DataStore属性，又没有找到TreeStore属性，无法继续交互",
	
	DataVirtualProxy_001: "没有设置Method属性",
	DataVirtualProxy_002: "没有设置Param属性",
	
	DataAdapter_001: "没有设置BizObj属性",
	DataAdapter_011: "没有设置Fields属性",
	DataAdapter_012: "没有设置Filter属性",
	DataAdapter_021: "没有设置Parent属性",
	DataAdapter_022: "没有设置Child属性",
	DataAdapter_023: "没有设置ShowField属性",
	DataAdapter_024: "没有设置ParentValue属性",
	
	fn_calculate_501: "获取数据源字段值表达式不正确:{0},正确的格式应该如下：{1}",
	
	Runtime_001: "值不是数字:{0}",
	Runtime_002: "主键重复,最后重复在{0}行",
	Runtime_003: "没有找到别名:{0}",
	FormatIsInvalid: "格式化无效,输入项目如下：{0},{1},{2}。预期格式化字符串格式为:{类型:表达式}，如：{date:yyyy-MM-dd}",
	
	VaildationNotFoundTableFields:"表单中没有找到验证中设置的tableFields对应的组件：{0}",
	VaildationNotFoundControlId:"表单中没有找到验证中设置的controlId对应的组件：{0}",
	
	ElementNotFound: "数据默认绑定时没有找到元素:{0}",
	Start:"开始",
	Cancel:"取消",
	Delete:"删除",
	CMP_JQFileUpload_Error:"错误",
	CMP_JQFileUpload_ToBig:"文件太大",
	CMP_JQFileUpload_ToSmall:"文件太小",
	CMP_JQFileUpload_TypeNotAllowed:"文件类型不允许",
	CMP_JQFileUpload_MaxFiles:"超出文件最大个数",
	CMP_JQFileUpload_MaxFileSizeServer:"超出文件最大限制(服务端限制)",
	CMP_JQFileUpload_MaxFileHTML:"超出文件最大限制(HTML表单限制)",
	CMP_JQFileUpload_Partially:"文件仅部分上传",
	CMP_JQFileUpload_NoFile:"没有文件上传",
	CMP_JQFileUpload_MissingTempFolder:"缺少临时文件",
	CMP_JQFileUpload_FailedWrite:"写磁盘失败",
	CMP_JQFileUpload_Stop:"文件上传停止",
	CMP_JQFileUpload_UploadedBytes:"上传超出最大限制",
	CMP_JQFileUpload_EmptyResult:"没有文件上传反馈",
	URL_IS_REQUIRED:"必须设置URL参数"
};

Fix.Exception.Const.enUS = {
	Start:"Start",
	Cancel:"Cancel",
	Delete:"Delete",
	CMP_JQFileUpload_Error:"Error",
	CMP_JQFileUpload_ToBig:"File is too big",
	CMP_JQFileUpload_ToSmall:"File is too small",
	CMP_JQFileUpload_TypeNotAllowed:"Filetype not allowed",
	CMP_JQFileUpload_MaxFiles:"Max number of files exceeded",
	CMP_JQFileUpload_MaxFileSizeServer:"File exceeds upload_max_filesize(php.ini directive)",
	CMP_JQFileUpload_MaxFileHTML:"File exceeds MAX_FILE_SIZE(HTML form directive)",
	CMP_JQFileUpload_Partially:"File was only partially uploaded",
	CMP_JQFileUpload_NoFile:"No File was uploaded",
	CMP_JQFileUpload_MissingTempFolder:"Missing a temporary folder",
	CMP_JQFileUpload_FailedWrite:"Failed to write file to disk",
	CMP_JQFileUpload_Stop:"File upload stopped by extension",
	CMP_JQFileUpload_UploadedBytes:"Uploaded bytes exceed file size",
	CMP_JQFileUpload_EmptyResult:"Empty file upload result"
};

