
/////////////////全局变量
var Config = {
    fileCachePath: "C:\\Gvitech\\CM3DGIS\\",
    runtime: ""
}
var __g;
var __rootId;
var layer_index;
var cacheManager;
var project;
var projectTree;
var objectManager;
var camera;
var htmlWindow;
var highlightHelper;
var geometryFactory;
var viewport;
var dataSourceFactory;
///**********************************************************************************三维数据加载*************************************************************
// window.onload = function () {
//     //设置三维初始化
//     setTimeout(function () {
//         initAndLoad();
//     }, 100);
// }
function getSamplesRelatePath(pathName){
    if(window.location.port) {
        return window.location.protocol + '\/\/'+ window.location.hostname + ':' + window.location.port +'/' + pathName;
    }
    return window.location.protocol + '\/\/'+ window.location.hostname +'/' + pathName;
}
//加载cep
function initAndLoad(connecStr, startDate) {
    __g = document.getElementById("__g");
    try {

        var bInit = __g.initialize(true, null);
        //全局变量赋值
        project = __g.project;
        __g.pauseRendering(false)
        cacheManager = __g.cacheManager;
        projectTree = __g.projectTree;
        objectManager = __g.objectManager;
        camera = __g.camera;
        htmlWindow = __g.htmlWindow;
        __rootId = projectTree.rootID;
        highlightHelper = __g.highlightHelper;
        geometryFactory = __g.geometryFactory;
        viewport = __g.viewport;
        dataSourceFactory = __g.dataSourceFactory;
        if (!bInit) {
            alert("三维控件初始化失败!");
            return false;
        }
        
        loadFromConnectString(connecStr, startDate);

        var skyboxPath = getSamplesRelatePath('assets/Media/skybox');
        window.parent.console.log("skeyboxPath",skyboxPath);
        var skyboxObj = __g.objectManager.getSkyBox(0);
        skyboxObj.setImagePath(gviSkyboxImageIndex.gviSkyboxImageBack, skyboxPath + "/2_BK.jpg");
        skyboxObj.setImagePath(gviSkyboxImageIndex.gviSkyboxImageBottom, skyboxPath + "/2_DN.jpg");
        skyboxObj.setImagePath(gviSkyboxImageIndex.gviSkyboxImageFront, skyboxPath + "/2_FR.jpg");
        skyboxObj.setImagePath(gviSkyboxImageIndex.gviSkyboxImageLeft, skyboxPath + "/2_LF.jpg");
        skyboxObj.setImagePath(gviSkyboxImageIndex.gviSkyboxImageRight, skyboxPath + "/2_RT.jpg");
        skyboxObj.setImagePath(gviSkyboxImageIndex.gviSkyboxImageTop, skyboxPath + "/2_UP.jpg");
        
    }
    catch (err) {
        
        if (__g) {
            if (!__g.runtimeInfo || __g.runtimeInfo.installPath === "") {
                alert("没有安装runtime, 请下载安装runtime");
                if (window.parent.config != undefined) {
                    window.location.href = Config.runtime;
                }
                else {
                    window.location.href = Config.runtime;
                }
            } else {
                alert("初始化失败");
                alert(err);
            }
        }
        else {
            alert("缺失__g");
        }
        return false;        
    }
    //绑定三维事件
    initControlEvents(__g);
    //设置缓存
    cacheManager.fileCacheEnabled = true;
    cacheManager.fileCachePath = Config.fileCachePath;
    cacheManager.fileCacheSize = -1;
    setTimeout(function () {
        $("#__g").width($(window).width());
        __g.resumeRendering();
    }, 100);
    window.terminateRender = function terminateRender() {
        __g.terminate()
    };
    //恢复渲染
    window.resumeRender = function resumeRender() {
        __g.resumeRendering();
    };
    //暂停渲染
    window.pauseRender = function pauseRender() {
        __g.pauseRendering(false);
    };
}
var FLS = new Array();
var _propertySet;
//加载数据
function loadFromConnectString(connectStr, startDate) {
    var ds = dataSourceFactory.openDataSourceByString(connectStr);
    var setnames = ds.getFeatureDatasetNames();
    if (setnames.length == 0)
        return;
    var geometryRender = getGeometryRender("PlanStartDate", "PlanFinishDate", 0x00ffffff, 0xddff0000);
    _propertySet = __g.new_PropertySet;//比较条件
    _propertySet.setProperty("compare", startDate);
    for (var i = 0; i < setnames.length; i++) {
        var fs = ds.openFeatureDataset(setnames[i]);
        var fcnames = fs.getNamesByType(gviDataSetType.gviDataSetFeatureClassTable);
        if (fcnames.length == 0)
            continue;
        for (var j = 0; j < fcnames.length; j++) {
            var fc = fs.openFeatureClass(fcnames[j]);
            featureLayer = __g.objectManager.createFeatureLayer(fc, "Geometry", null, geometryRender, __g.projectTree.rootID);
            featureLayer.name = fc.name;
            featureLayer.minVisiblePixels=10;
            featureLayer.maxVisibleDistance = 300000000;
            if (featureLayer == null)
                continue;
            featureLayer.setGeometryRender(geometryRender);
            featureLayer.compareRenderRuleVariants = _propertySet;
            FLS.push(featureLayer);
            if (FLS.length == 1) {
                __g.camera.flyTime = 0;
                __g.camera.flyToObject(featureLayer.guid, 0);
            }
        }
    }
}
function getGeometryRender(startDate,finishDate,color1,color2) {
    var valueMapGeometryRender = __g.new_ValueMapGeometryRender; //多规则渲染器

        // 第一种方案
        {
            var geometryRenderScheme = __g.new_GeometryRenderScheme;
            // 规则 1  ，StartDate > compare

            var comparedRenderRule = __g.new_ComparedRenderRule;
            comparedRenderRule.lookUpField = startDate; //设置字段，左操作数
            comparedRenderRule.compareVariant = "compare"; //设置比较的变量，右操作数
            comparedRenderRule.compareOperator = gviCompareType.gviCompareGreater; //比较方式
            geometryRenderScheme.addRule(comparedRenderRule); //添加规则

            var modelPointSymbol = __g.new_ModelPointSymbol;
            modelPointSymbol.enableColor = true;
            modelPointSymbol.color = color1;
            geometryRenderScheme.symbol = modelPointSymbol;

            //添加渲染方案
            valueMapGeometryRender.addScheme(geometryRenderScheme);
        }
        // 第二种方案
        {//1 StartTime <= compare &&  EndDate >= compare  绿色显示
            var geometryRenderScheme = __g.new_GeometryRenderScheme;

            // 1
            var comparedRenderRule = __g.new_ComparedRenderRule;
            comparedRenderRule.lookUpField = startDate; //设置字段，左操作数
            comparedRenderRule.compareVariant = "compare"; //设置比较的变量，右操作数
            comparedRenderRule.compareOperator = gviCompareType.gviCompareLessOrEqual; //比较方式
            geometryRenderScheme.addRule(comparedRenderRule); //添加规则

            // 2
            var comparedRenderRule1 = __g.new_ComparedRenderRule;
            comparedRenderRule1.lookUpField = finishDate; //设置字段，左操作数
            comparedRenderRule1.compareVariant = "compare"; //设置比较的变量，右操作数
            comparedRenderRule1.compareOperator = gviCompareType.gviCompareGreater; //比较方式
            geometryRenderScheme.addRule(comparedRenderRule1); //添加规则

            var modelPointSymbol = __g.new_ModelPointSymbol;
            modelPointSymbol.enableColor = true;
            modelPointSymbol.color = color2;
            geometryRenderScheme.symbol = modelPointSymbol;

            //添加渲染方案
            valueMapGeometryRender.addScheme(geometryRenderScheme);
        }
        // 第三种方案
        {//1 EndDate > compare 正常显示
            var geometryRenderScheme = __g.new_GeometryRenderScheme;

            var comparedRenderRule1 = __g.new_ComparedRenderRule;
            comparedRenderRule1.lookUpField = finishDate; //设置字段，左操作数
            comparedRenderRule1.compareVariant = "compare"; //设置比较的变量，右操作数
            comparedRenderRule1.compareOperator = gviCompareType.gviCompareLessOrEqual; //比较方式
            geometryRenderScheme.addRule(comparedRenderRule1); //添加规则

            var modelPointSymbol = __g.new_ModelPointSymbol;
            modelPointSymbol.enableColor = true;
            modelPointSymbol.color = 0xffffffff;
            //modelPointSymbol.enableTexture = true;
            geometryRenderScheme.symbol = modelPointSymbol;
            //添加渲染方案
            valueMapGeometryRender.addScheme(geometryRenderScheme);
        }
        return valueMapGeometryRender;
}
function setTime(val){
    _propertySet.setProperty("compare", val);
    for(var i=0;i<FLS.length;i++){
        FLS[i].compareRenderRuleVariants = _propertySet;//设置图层比较的变量
    }
}
// var currentDate;
// var current = 0;
// setInterval(function () {
//     current++;
//     currentDate = dateAddDay(new Date('2017-10-25'), current);
//     document.title = currentDate;
//     set_time(currentDate);
// }, 2000);
//  function dateAddDay(time,n){
//     var d=new Date(time);
//     d.setDate(d.getDate()+n);
//     return d;
// }