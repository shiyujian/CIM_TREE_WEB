
// window.onload = function(){
// 	debugger
// 	external.parentWindow.__fnSetPop = fnSetPop;
// }

// function fnSetPop() {

// }

// var fnGetPop = external.parentWindow.__fnGetPop;

(function(){

	var $target = $('#property');

	function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return decodeURIComponent(r[2]); return null; //返回参数值
    }

    var dataExample = {
    	name: "松树",
    	detail: "H3.0~4.0m",
    	age: 5,
    	price: 800
    }

	 // update line
    function getProperty(data) {

        var config = [
            {"name":"树种",field:'type',"value":data.name,"group":"基础信息"},
            {"name":"规格",field:'detail',"value":data.detail,"group":"基础信息"},
            {"name":"年龄",field:'age',"value":data.age,"group":"基础信息"},
            {"name":"价格",field:'price',"value":data.price,"group":"基础信息"},
        ]

        $target.propertygrid({
            columns:[
                [
                    {field:'name',title:'Name', width:50, sortable:true},
                    {field:'value',title:'Value',width:100, sortable:true},
                ]
            ],
            data:config,
            scrollbarSize:0,
            showGroup:true,
            showHeader:false
        });

    }

    // var data = fnGetPop();
    getProperty(dataExample);

}())
