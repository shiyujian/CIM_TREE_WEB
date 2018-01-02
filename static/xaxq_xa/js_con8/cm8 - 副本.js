
/////////////////全局变量
var Config = {
    localPath: "http://192.168.3.33/xaxq/", //http://127.0.0.1:3000/xaxq/
    fileCachePath: "C:\\Gvitech\\CM3DGIS\\",
    GHMX: "规划模型\\地面建筑",
    initLocation: "场景组\\雄安新区",
    port: "8080",
    selectLayerName: "规划矢量\\规划地块",
    fieldIndex: 5,
    runtime: "http://192.168.3.94:8000/download/CityMaker_IE_Plugin_vConnect.exe",
    //cep:"http://192.168.3.94:8000/download/Package_总装/总装.cep"
    //cep: "C:\\Users\\Administrator\\Desktop\\123.cep"
    cep: "http://192.168.3.94:8000/download/Package_xa0906/xa0906.cep",
    // cep: "D:\\ECIDI\\CityMaker SDK\\CityMakerServerData\\xa0906.cep",
    // cep: "http://192.168.3.94:8000/download/Package_1013/1013.cep",

    // 历史回溯
    //历史数据
    historyLayer:"总装\\倾斜数据\\容城县",
    // 新数据
    newLayer:"总装\\倾斜数据\\容城县",

    // 地块信息
    massifName : ["Export_Output5"],//地块fl名称
    treeMassifPath : "总装\\项目数据\\植树造林\\现状要素\\FDB植树区小班SHP\\小班",//地块分组路径
    treeLayerPath : "总装\\项目数据\\植树造林\\植树造林（绿）",//树分组路径
    massifFieldNames:["RefName","植物名称","面积","棵树_1"],//featureclass列名
    massifShowNames:["编号:","种类:","亩数:","株数:"],//显示名称，与列名一一对应

    // BIM查询信息
    bimGroupPath : ["总装\\项目数据\\市民服务中心\\中国建筑设计院"],

    // 建筑与多边形配置
    buildingConnect:{
        connectionType:gviConnectionType.gviConnectionCms7Http,
        server: "192.168.3.94",
        port:"8040",
        database:"FDB房屋单体化",//FDB房屋单体化,植树造林区地面要素04FDB
        userName:"",
        password:"",
        fdsName: "房屋单体化",//房屋单体化,植树造林区地面要素
        fcName: "Building",//Building,居民地
        geometryFieldName: "Geometry"
    },
    buildingInfo:{
        fieldNames:["oid","Layer","RefName","属性","面积_1"],//featureclass列名
        showNames:["oid","Layer","RefName","属性","面积"],//显示名称，与列名一一对应
        width:300,
        height:230//230
    },
    // POI信息
    poiGroupPath:"总装\\现状数据\\POI兴趣点",//poi分组路径
    poiColName:"Name",//poi查询列名
    // 属性查询信息
    propertyInfo:{
        type:1,
        connectionType:gviConnectionType.gviConnectionCms7Http,
        server: "192.168.3.94",
        port:"8040",
        database:"FDB房屋单体化",//FDB房屋单体化,植树造林区地面要素04FDB
        userName:"",
        password:"",
        fdsName: "房屋单体化",//房屋单体化,植树造林区地面要素
        fcName: "Building",//Building,居民地
        geometryFieldName: "Geometry",
        propertyColName:"OID",//属性查询查询列名
        // propertyColName:"NAME",//属性查询查询列名
        // type==2
        propertyGroupPath:"总装\\现状数据\\POI兴趣点"//属性查询分组路径
    },
    
    // propertyColName:"Name"//属性查询查询列名

    htmlWinWidth: 350,   // htmlWindow With
    htmlWinHeight: -160 //
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

var initCameraInfo;

//********************init Config */
if(window.location) {
    console.log(window.location);
    var subDir = '/xaxq/';
    if(window.__gTextDev) {
        subDir = '/';
        // Config.cep = "D:\\ECIDI\\CityMaker SDK\\CityMakerServerData\\test.cep";
    }
    if(window.location.port) {
        Config.localPath =  window.location.protocol + '\/\/'+ window.location.hostname + ':' + window.location.port + subDir;
    } else {
        Config.localPath = window.location.protocol + '\/\/'+ window.location.hostname + subDir;
    }
    console.log(Config.localPath);
}

///**********************************************************************************三维数据加载*************************************************************
$(document).ready(function () {
    layer_index = layer.load(2, {
        shade: true,
        content: '数据加载中，请稍后'
    });
    //设置三维初始化
    setTimeout(function () {
        initAndLoad();
    }, 100);
});

function testForActiveX(){
    try {
        return new ActiveXObject('BrowserBuddy.ProcessHelper.1');
    }
    catch (e) {
        // catch the exception
        return null;
    }
}

//加载cep
function initAndLoad() {
    $("#my_layout").layout('hidden', 'east');
    __g = document.getElementById("__g");
    try {
        //全局变量赋值
        project = __g.project;
        __g.pauseRendering(false)
        
        if(!Config.cep) {
            alert("未设置Cep");
            return;
        }

        var isOpenSuccess = project.open(Config.cep, false, "");
        
        if(!isOpenSuccess){
            alert("Cep文件错误");
            return;
        }

        cacheManager = __g.cacheManager;
        projectTree = __g.projectTree;
        objectManager = __g.objectManager;
        camera = __g.camera;
        if(camera)
            initCameraInfo = camera.getCamera();

        htmlWindow = __g.htmlWindow;
        __rootId = projectTree.rootID;
        projectTree.showSlide = true;
        highlightHelper = __g.highlightHelper;
        geometryFactory = __g.geometryFactory;
        viewport = __g.viewport;
        dataSourceFactory=__g.dataSourceFactory;

        // set Camera Flytime
        // camera.flyTime = 3;
    }
    catch (err) {

        var isInstalled = testForActiveX();
        if (isInstalled) {
            alert("初始化失败");
            alert(err);
            // window.location.href = Config.runtime;
        }
        else {
            if (window.parent.config != undefined) {
                window.location.href = window.parent.config.WJH_CITY_MARKER;
            }
            else {
                window.location.href = Config.runtime;
            }
            alert("请下载安装runtime");
            setTimeout(function () { layer.close(layer_index); }, 100);
            return;
        }
    }
    //绑定三维事件
    initControlEvents(__g);
    //设置缓存
    cacheManager.fileCacheEnabled = true;
    cacheManager.fileCachePath = Config.fileCachePath;
    cacheManager.fileCacheSize = -1;
    setTimeout(function () {
        layer.close(layer_index);
        // $("#__g").width($(window).width());
        // $("#__g").height($(window).height());
        __g.resumeRendering();
        loadButtons();
    }, 100);
    //布局窗口，加载uiimagebutton

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

var isSpatialQuery = false;
var wpSpatialQuery;
var _spatialQueryFLMap=[];
var _spatialQueryConn;
function querySpatial(){
    var height = $("#__g").height();
    if(!wpSpatialQuery){
        wpSpatialQuery = htmlWindow.createWindowParam();
        wpSpatialQuery.filePath = Config.localPath + "html/search/searcher.html" + new Date().getTime();
        wpSpatialQuery.sizeX = Config.htmlWinWidth;
        wpSpatialQuery.sizeY = Number(height) + Config.htmlWinHeight;
        wpSpatialQuery.hastitle = false;
        wpSpatialQuery.position = gviHTMLWindowPosition.gviWinPosParentRightTop;
        wpSpatialQuery.round = -1;
        wpSpatialQuery.hideOnClick = false;
        wpSpatialQuery.winId = 7;
        wpSpatialQuery.transparence = 200;
        wpSpatialQuery.isPopupWindow = false;
        wpSpatialQuery.resizable = false;
        wpSpatialQuery.resetOnHide="";
    }
    if(isSpatialQuery){//取消查询
        htmlWindow.hideWindow(wpSpatialQuery.winId);
        isSpatialQuery = false;
        __g.featureManager.unhighlightAll();
        initControlEvents(__g);
    }else{//执行查询
        wpSpatialQuery.filePath = Config.localPath + "html/search/searcher.html?" + new Date().getTime();
        htmlWindow.setWindowParam(wpSpatialQuery);
        isSpatialQuery = true;
    }
}

///**********************************************************************************UIImageButton布局*************************************************************
//UIImageButton 事件
var isWeather=false;
function onUIWindowEvent(args, type) {
    if (args.uiWindow == null)
        return;
    if (type == gviUIEventType.gviUIMouseClick) {
        if (args.uiWindow.type == gviUIWindowType.gviUIImageButton) {
            // 恢复上次按钮事件
            recoveryButton(args.uiWindow.name);
            oldButtonName=args.uiWindow.name;
            switch (args.uiWindow.name) {
                case "恢复": {
                    resetView();
                }
                break;
                case "顶视角": {
                    view2Top();
                }
                break;
                // 天气
                case "天气":
                    for (var i = 0; i < weatherButtons.length; i++) {
                        var button = weatherButtons[i];
                        if (i == 0 && button.isVisible) {
                            changeWeather("晴天");
                        }
                        button.isVisible = !button.isVisible;
                    }
                break;
                case "晴天":
                    changeWeather("晴天");
                break;
                case "小雨":
                    changeWeather("小雨");
                break;
                case "中雨":
                    changeWeather("中雨");
                break;
                case "大雨":
                    changeWeather("大雨");
                break;
                case "小雪":
                    changeWeather("小雪");
                break;
                case "中雪":
                    changeWeather("中雪");
                break;
                case "大雪":
                    changeWeather("大雪");
                break;
                // 测量
                case "测量":
                    for (var i = 0; i < measureButtons.length; i++) {
                        var button = measureButtons[i];
                        if (i == 0 && button.isVisible) {
                            __g.interactMode = gviInteractMode.gviInteractNormal;
                        }
                        button.isVisible = !button.isVisible;
                    }
                break;
                case "坐标测量":
                    __g.interactMode = gviInteractMode.gviInteractMeasurement;
                    __g.measurementMode = gviMeasurementMode.gviMeasureCoordinate;
                break;
                case "水平测量":
                    __g.interactMode = gviInteractMode.gviInteractMeasurement;
                    __g.measurementMode = gviMeasurementMode.gviMeasureHorizontalDistance;
                break;
                case "直线测量":
                    __g.interactMode = gviInteractMode.gviInteractMeasurement;
                    __g.measurementMode = gviMeasurementMode.gviMeasureAerialDistance;
                break;
                case "垂直测量":
                    __g.interactMode = gviInteractMode.gviInteractMeasurement;
                    __g.measurementMode = gviMeasurementMode.gviMeasureVerticalDistance;
                break;
                case "投影面积测量":
                    __g.interactMode = gviInteractMode.gviInteractMeasurement;
                    __g.measurementMode = gviMeasurementMode.gviMeasureArea;
                break;
                case "地表面积测量":
                    __g.interactMode = gviInteractMode.gviInteractMeasurement;
                    __g.measurementMode = gviMeasurementMode.gviMeasureGroundArea;
                break;
                // 幻灯片
                case "幻灯片":
                    {
                        var tree = objectManager.getProjectTree();
                        tree.showSlide = !tree.showSlide;
                    }
                break;
                // 出图
                case "出图":
                    {
                        var higquality = true;
                        var b = __g.exportManager.exportImage("", 2048, 2048, higquality);
                        if (!b) {
                            return;
                        }
                    }
                break;
                // 漫游
                case "漫游":
                    __g.interactMode = gviInteractMode.gviInteractNormal;
                    __g.featureManager.unhighlightAll();
                break;
                // 拾取
                case "拾取":
                    {
                        if(selectButtons[0].isVisible){
                            hideButtons("拾取");
                        }else{//显示
                            for (var i = 0; i < selectButtons.length; i++) {
                                var button = selectButtons[i];
                                button.isVisible = !button.isVisible;
                            }
                        }
                    }
                break;
                case "树木信息":
                    {
                        recovery2Evn("拾取","树木信息");
                        showProperty();
                    }
                break;
                case "地块查询":
                    {
                        recovery2Evn("拾取","地块查询");
                        massifQueryClick();
                    }
                break;
                case "BIM查询":
                    {
                        recovery2Evn("拾取","BIM查询");
                        bimQueryClick();
                    }
                break;
                case "建筑查询":
                    {
                        recovery2Evn("拾取","建筑查询");
                        buildingQuery();
                    }
                break;
                case "多边形查询":
                    {
                        recovery2Evn("拾取","多边形查询");
                        selectMore();
                    }
                break;
                // 查询
                case "查询":
                    {
                        querySpatial();
                        // if(queryButtons[0].isVisible){
                        //     hideButtons("查询");
                        // }else{//显示
                        //     for (var i = 0; i < queryButtons.length; i++) {
                        //         var button = queryButtons[i];
                        //         button.isVisible = !button.isVisible;
                        //     }
                        // }
                    }
                break;
                case "POI查询":
                    {
                        recovery2Evn("查询","POI查询");
                        poiQuery();
                    }
                break;
                case "属性查询":
                    {
                        recovery2Evn("查询","属性查询");
                        propertyQuery();
                    }
                break;
                // 分析
                case "分析":
                    {
                        if(analyseButtons[0].isVisible){
                            hideButtons("分析");
                        }else{//显示
                            for (var i = 0; i < analyseButtons.length; i++) {
                                var button = analyseButtons[i];
                                button.isVisible = !button.isVisible;
                            }
                        }
                    }
                break;
                case "视域分析":
                    {
                        recovery2Evn("分析","视域分析");
                        showViewshedPop();
                    }
                break;
                case "日照分析":
                    {
                        recovery2Evn("分析","日照分析");
                        shadowShow();
                    }
                break;
                case "立体剖切":
                    {
                        recovery2Evn("分析","立体剖切");
                        if (__g.interactMode != gviInteractMode.gviInteractClipPlane || __g.clipMode != gviClipMode.gviClipBox) {
                            __g.interactMode = gviInteractMode.gviInteractClipPlane;
                            __g.clipMode = gviClipMode.gviClipBox;
                        } else {
                            __g.interactMode = gviInteractMode.gviInteractNormal;
                        }
                    }
                break;
                case "历史回溯":
                    {
                        recovery2Evn("分析","历史回溯");
                        historyShow();
                    }
                break;
                case "视频投影":
                    {
                        recovery2Evn("分析","视频投影");
                        showTerrainVideo();
                    }
                break;
                case "分屏模式":
                    {
                        recovery2Evn("分析","分屏模式");
                        viewportShow();
                    }
                break;
                case "高程开关":
                    {
                        recovery2Evn("分析","高程开关");
                        __g.terrain.demAvailable = !__g.terrain.demAvailable;
                    }
                break;
                case "地形显隐":
                    {
                        recovery2Evn("分析","地形显隐");
                        if (__g.terrain.visibleMask == gviViewportMask.gviViewAllNormalView)
                            __g.terrain.visibleMask = gviViewportMask.gviViewNone;
                        else
                            __g.terrain.visibleMask = gviViewportMask.gviViewAllNormalView;
                    }
                break;
                // 图层
                case "图层树":
                    {
                        showLayerTree();
                    }
                break;
            }
        }
    }
}
//2017年9月25日
var basicButtons = new Array();
var measureButtons = new Array();
var weatherButtons = new Array();
var selectButtons = new Array();
var queryButtons = new Array();
var analyseButtons = new Array();
var offsetTop = 100+50;
function loadButtons() {
    var width = $("#__g").width();
    var height = $("#__g").height();
    var arr_weatherButtons = ["晴天", "小雨", "中雨", "大雨", "小雪", "中雪", "大雪"];
    var arr_measureButtons = ["坐标测量", "水平测量", "垂直测量", "直线测量", "投影面积测量", "地表面积测量"];
    var arr_selectButtons = ["树木信息","地块查询","BIM查询","建筑查询","多边形查询"];
    var arr_queryButtons = ["POI查询","属性查询"];
    var arr_analyseButtons = ["视域分析","日照分析","立体剖切","历史回溯","视频投影", "分屏模式","高程开关", "地形显隐"];
    var arr_basicButtons = ["恢复","顶视角","天气", "测量", "幻灯片", "出图", "漫游", "拾取","查询", "分析", "图层树"];
    var manager = __g.uiWindowManager;
    var rect = __g.new_UIRect;
    //第一级按钮
    for (var i = 0; i < arr_basicButtons.length; i++) {
        rect.init(0, 10, 0, offsetTop + 50 * i, 0, 50, 0, offsetTop + 40 + 50 * i);
        var button1 = manager.createImageButton();
        button1.setArea(rect);
        button1.name = arr_basicButtons[i];
        button1.isVisible = true;
        if (arr_basicButtons[i] == "恢复") {           
            button1.normalImage = Config.localPath + "images/menu/reset.png";
            button1.hoverImage = Config.localPath + "images/menu/reset.png";
            button1.pushedImage = Config.localPath + "images/menu/reset.png";

        } else if (arr_basicButtons[i] == "顶视角") {
            button1.normalImage = Config.localPath + "images/menu/top.png";
            button1.hoverImage = Config.localPath + "images/menu/top.png";
            button1.pushedImage = Config.localPath + "images/menu/top.png";

        } else if (arr_basicButtons[i] == "天气") {
            button1.normalImage = Config.localPath + "images/weather/sun.png";
            button1.hoverImage = Config.localPath + "images/weather/sun.png";
            button1.pushedImage = Config.localPath + "images/weather/sun.png";
        }
        else if (arr_basicButtons[i] == "测量") {

            button1.normalImage = Config.localPath + "images/measurement/measurelinedistance.png";
            button1.hoverImage = Config.localPath + "images/measurement/measurelinedistance.png";
            button1.pushedImage = Config.localPath + "images/measurement/measurelinedistance.png";
        }
        else if (arr_basicButtons[i] == "幻灯片") {

            button1.normalImage = Config.localPath + "images/ppt.png";
            button1.hoverImage = Config.localPath + "images/ppt.png";
            button1.pushedImage = Config.localPath + "images/ppt.png";
        }
        else if (arr_basicButtons[i] == "出图") {

            button1.normalImage = Config.localPath + "images/exportmap.png";
            button1.hoverImage = Config.localPath + "images/exportmap.png";
            button1.pushedImage = Config.localPath + "images/exportmap.png";
        }
        else if (arr_basicButtons[i] == "漫游") {

            button1.normalImage = Config.localPath + "images/normal.png";
            button1.hoverImage = Config.localPath + "images/normal.png";
            button1.pushedImage = Config.localPath + "images/normal.png";
        }
        else if (arr_basicButtons[i] == "拾取") {

            button1.normalImage = Config.localPath + "images/menu/selectobject.png";
            button1.hoverImage = Config.localPath + "images/menu/selectobject.png";
            button1.pushedImage = Config.localPath + "images/menu/selectobject.png";
        }
        else if (arr_basicButtons[i] == "查询") {
            
            button1.normalImage = Config.localPath + "images/menu/chaxun.png";
            button1.hoverImage = Config.localPath + "images/menu/chaxun.png";
            button1.pushedImage = Config.localPath + "images/menu/chaxun.png";
        }
        else if (arr_basicButtons[i] == "分析") {
            
            button1.normalImage = Config.localPath + "images/menu/fenxi.png";
            button1.hoverImage = Config.localPath + "images/menu/fenxi.png";
            button1.pushedImage = Config.localPath + "images/menu/fenxi.png";
        }
        else if (arr_basicButtons[i] == "图层树") {
            
            button1.normalImage = Config.localPath + "images/layerTree.png";
            button1.hoverImage = Config.localPath + "images/layerTree.png";
            button1.pushedImage = Config.localPath + "images/layerTree.png";
        }
        button1.toolTipText = arr_basicButtons[i];
        button1.subscribeEvent(gviUIEventType.gviUIMouseClick);
        basicButtons.push(button1);
    }
    // 天气按钮
    for (var i = 0; i < arr_weatherButtons.length; i++) {
        rect.init(0, 50, 0, offsetTop + 50 * i, 0, 90, 0, offsetTop + 40 + 50 * i);
        var button1 = manager.createImageButton();
        button1.setArea(rect);
        button1.name = arr_weatherButtons[i];
        button1.isVisible = false;
        if (arr_weatherButtons[i] == "晴天") {

            button1.normalImage = Config.localPath + "images/weather/sun.png";
            button1.hoverImage = Config.localPath + "images/weather/sun.png";
            button1.pushedImage = Config.localPath + "images/weather/sun.png";
        } else if (arr_weatherButtons[i] == "小雨") {

            button1.normalImage = Config.localPath + "images/weather/smallrain.png";
            button1.hoverImage = Config.localPath + "images/weather/smallrain.png";
            button1.pushedImage = Config.localPath + "images/weather/smallrain.png";
        }
        else if (arr_weatherButtons[i] == "中雨") {

            button1.normalImage = Config.localPath + "images/weather/middlerain.png";
            button1.hoverImage = Config.localPath + "images/weather/middlerain.png";
            button1.pushedImage = Config.localPath + "images/weather/middlerain.png";
        }
        else if (arr_weatherButtons[i] == "大雨") {

            button1.normalImage = Config.localPath + "images/weather/heavyrain.png";
            button1.hoverImage = Config.localPath + "images/weather/heavyrain.png";
            button1.pushedImage = Config.localPath + "images/weather/heavyrain.png";
        } else if (arr_weatherButtons[i] == "小雪") {

            button1.normalImage = Config.localPath + "images/weather/smallsnow.png";
            button1.hoverImage = Config.localPath + "images/weather/smallsnow.png";
            button1.pushedImage = Config.localPath + "images/weather/smallsnow.png";
        }
        else if (arr_weatherButtons[i] == "中雪") {

            button1.normalImage = Config.localPath + "images/weather/middlesnow.png";
            button1.hoverImage = Config.localPath + "images/weather/middlesnow.png";
            button1.pushedImage = Config.localPath + "images/weather/middlesnow.png";
        }
        else if (arr_weatherButtons[i] == "大雪") {

            button1.normalImage = Config.localPath + "images/weather/heavysnow.png";
            button1.hoverImage = Config.localPath + "images/weather/heavysnow.png";
            button1.pushedImage = Config.localPath + "images/weather/heavysnow.png";
        }
        button1.toolTipText = arr_weatherButtons[i];
        button1.subscribeEvent(gviUIEventType.gviUIMouseClick);
        weatherButtons.push(button1);
    }
    // 测量按钮
    for (var i = 0; i < arr_measureButtons.length; i++) {
        rect.init(0, 50, 0, offsetTop + 50 + 50 * i, 0, 90, 0, offsetTop + 90 + 50 * i);
        var button1 = manager.createImageButton();
        button1.setArea(rect);
        button1.name = arr_measureButtons[i];
        button1.isVisible = false;
        if (arr_measureButtons[i] == "坐标测量") {

            button1.normalImage = Config.localPath + "images/measurement/measurelocation.png";
            button1.hoverImage = Config.localPath + "images/measurement/measurelocation.png";
            button1.pushedImage = Config.localPath + "images/measurement/measurelocation.png";
        }
        else if (arr_measureButtons[i] == "水平测量") {

            button1.normalImage = Config.localPath + "images/measurement/measurehdistance.png";
            button1.hoverImage = Config.localPath + "images/measurement/measurehdistance.png";
            button1.pushedImage = Config.localPath + "images/measurement/measurehdistance.png";
        }
        else if (arr_measureButtons[i] == "垂直测量") {

            button1.normalImage = Config.localPath + "images/measurement/measurevdistance.png";
            button1.hoverImage = Config.localPath + "images/measurement/measurevdistance.png";
            button1.pushedImage = Config.localPath + "images/measurement/measurevdistance.png";
        }
        else if (arr_measureButtons[i] == "直线测量") {

            button1.normalImage = Config.localPath + "images/measurement/measurelinedistance.png";
            button1.hoverImage = Config.localPath + "images/measurement/measurelinedistance.png";
            button1.pushedImage = Config.localPath + "images/measurement/measurelinedistance.png";
        }
        else if (arr_measureButtons[i] == "投影面积测量") {

            button1.normalImage = Config.localPath + "images/measurement/measureprojectarea.png";
            button1.hoverImage = Config.localPath + "images/measurement/measureprojectarea.png";
            button1.pushedImage = Config.localPath + "images/measurement/measureprojectarea.png";
        }
        else if (arr_measureButtons[i] == "地表面积测量") {

            button1.normalImage = Config.localPath + "images/measurement/GroundArea.png";
            button1.hoverImage = Config.localPath + "images/measurement/GroundArea.png";
            button1.pushedImage = Config.localPath + "images/measurement/GroundArea.png";
        }
        button1.toolTipText = arr_measureButtons[i];
        button1.subscribeEvent(gviUIEventType.gviUIMouseClick);
        measureButtons.push(button1);
    }
    // 拾取按钮
    var selectBtnIndex=arr_basicButtons.indexOf("拾取");
    var selectBtnOffset = 50*2;
    for (var i = 0; i < arr_selectButtons.length; i++) {
        rect.init(0, 50, 0, offsetTop + 50*selectBtnIndex + 50 * i-selectBtnOffset, 0, 90, 0, offsetTop + 40 + 50*selectBtnIndex + 50 * i-selectBtnOffset);
        var button1 = manager.createImageButton();
        button1.setArea(rect);
        button1.name = arr_selectButtons[i];
        button1.isVisible = false;
        if (arr_selectButtons[i] == "树木信息") {

            button1.normalImage = Config.localPath + "images/menu/selectobject_1.png";
            button1.hoverImage = Config.localPath + "images/menu/selectobject_1.png";
            button1.pushedImage = Config.localPath + "images/menu/selectobject_1.png";
        }
        else if (arr_selectButtons[i] == "地块查询") {
            
            button1.normalImage = Config.localPath + "images/menu/massif.png";
            button1.hoverImage = Config.localPath + "images/menu/massif.png";
            button1.pushedImage = Config.localPath + "images/menu/massif.png";
        }
        else if (arr_selectButtons[i] == "BIM查询") {
            
            button1.normalImage = Config.localPath + "images/menu/bim.png";
            button1.hoverImage = Config.localPath + "images/menu/bim.png";
            button1.pushedImage = Config.localPath + "images/menu/bim.png";
        }
        else if (arr_selectButtons[i] == "建筑查询") {
            
            button1.normalImage = Config.localPath + "images/menu/jianzhu.png";
            button1.hoverImage = Config.localPath + "images/menu/jianzhu.png";
            button1.pushedImage = Config.localPath + "images/menu/jianzhu.png";
        }
        else if (arr_selectButtons[i] == "多边形查询") {
            
            button1.normalImage = Config.localPath + "images/menu/duobianxing.png";
            button1.hoverImage = Config.localPath + "images/menu/duobianxing.png";
            button1.pushedImage = Config.localPath + "images/menu/duobianxing.png";
        }
        button1.toolTipText = arr_selectButtons[i];
        button1.subscribeEvent(gviUIEventType.gviUIMouseClick);
        selectButtons.push(button1);
    }
    // 查询按钮
    var queryBtnIndex=arr_basicButtons.indexOf("查询");
    for (var i = 0; i < arr_queryButtons.length; i++) {
        rect.init(0, 50, 0, offsetTop + 50*queryBtnIndex + 50 * i, 0, 90, 0, offsetTop + 40 + 50*queryBtnIndex + 50 * i);
        var button1 = manager.createImageButton();
        button1.setArea(rect);
        button1.name = arr_queryButtons[i];
        button1.isVisible = false;
        if (arr_queryButtons[i] == "POI查询") {

            button1.normalImage = Config.localPath + "images/menu/poi.png";
            button1.hoverImage = Config.localPath + "images/menu/poi.png";
            button1.pushedImage = Config.localPath + "images/menu/poi.png";
        }
        else if (arr_queryButtons[i] == "属性查询") {
            
            button1.normalImage = Config.localPath + "images/menu/shuxingchaxun.png";
            button1.hoverImage = Config.localPath + "images/menu/shuxingchaxun.png";
            button1.pushedImage = Config.localPath + "images/menu/shuxingchaxun.png";
        }
        button1.toolTipText = arr_queryButtons[i];
        button1.subscribeEvent(gviUIEventType.gviUIMouseClick);
        queryButtons.push(button1);
    }
    // 分析按钮
    var analyseBtnIndex=arr_basicButtons.indexOf("分析");
    var analyseBtnOffset = 50*3;
    for (var i = 0; i < arr_analyseButtons.length; i++) {
        rect.init(0, 50, 0, offsetTop + 50*analyseBtnIndex + 50 * i-analyseBtnOffset, 0, 90, 0, offsetTop + 40 + 50*analyseBtnIndex + 50 * i-analyseBtnOffset);
        var button1 = manager.createImageButton();
        button1.setArea(rect);
        button1.name = arr_analyseButtons[i];
        button1.isVisible = false;
        if (arr_analyseButtons[i] == "视域分析") {

            button1.normalImage = Config.localPath + "images/menu/viewshed.png";
            button1.hoverImage = Config.localPath + "images/menu/viewshed.png";
            button1.pushedImage = Config.localPath + "images/menu/viewshed.png";
        }
        else if (arr_analyseButtons[i] == "日照分析") {
            
            button1.normalImage = Config.localPath + "images/menu/shadow.png";
            button1.hoverImage = Config.localPath + "images/menu/shadow.png";
            button1.pushedImage = Config.localPath + "images/menu/shadow.png";
        }
        else if (arr_analyseButtons[i] == "立体剖切") {
            
            button1.normalImage = Config.localPath + "images/menu/pq.png";
            button1.hoverImage = Config.localPath + "images/menu/pq.png";
            button1.pushedImage = Config.localPath + "images/menu/pq.png";
        }
        else if (arr_analyseButtons[i] == "历史回溯") {
            
            button1.normalImage = Config.localPath + "images/menu/history.png";
            button1.hoverImage = Config.localPath + "images/menu/history.png";
            button1.pushedImage = Config.localPath + "images/menu/history.png";
        }
        else if (arr_analyseButtons[i] == "视频投影") {
            
            button1.normalImage = Config.localPath + "images/menu/terrainVideo.png";
            button1.hoverImage = Config.localPath + "images/menu/terrainVideo.png";
            button1.pushedImage = Config.localPath + "images/menu/terrainVideo.png";
        }
        else if (arr_analyseButtons[i] == "分屏模式") {
            
            button1.normalImage = Config.localPath + "images/menu/viewport.png";
            button1.hoverImage = Config.localPath + "images/menu/viewport.png";
            button1.pushedImage = Config.localPath + "images/menu/viewport.png";
        }
        else if (arr_analyseButtons[i] == "高程开关") {
            
            button1.normalImage = Config.localPath + "images/menu/gaocheng.png";
            button1.hoverImage = Config.localPath + "images/menu/gaocheng.png";
            button1.pushedImage = Config.localPath + "images/menu/gaocheng.png";
        }
        else if (arr_analyseButtons[i] == "地形显隐") {
            
            button1.normalImage = Config.localPath + "images/menu/dixing.png";
            button1.hoverImage = Config.localPath + "images/menu/dixing.png";
            button1.pushedImage = Config.localPath + "images/menu/dixing.png";
        }
        button1.toolTipText = arr_analyseButtons[i];
        button1.subscribeEvent(gviUIEventType.gviUIMouseClick);
        analyseButtons.push(button1);
    }
}
//还原按钮事件
var oldButtonName;
function recoveryButton(name){
    if(oldButtonName){
        if(oldButtonName!=name){
            switch(name){
                case "天气":
                    hideButtons("测量");
                    hideButtons("拾取");
                    hideButtons("查询");
                    hideButtons("分析");
                    recoveryEvn("图层树");
                break;
                case "测量":
                    hideButtons("天气");
                    hideButtons("拾取");
                    hideButtons("查询");
                    hideButtons("分析");
                break;
                case "拾取":
                    hideButtons("天气");
                    hideButtons("测量");
                    hideButtons("查询");
                    hideButtons("分析");
                    recoveryEvn("图层树");
                break;
                case "查询":
                    hideButtons("天气");
                    hideButtons("测量");
                    hideButtons("拾取");
                    hideButtons("分析");
                    recoveryEvn("图层树");
                break;
                case "分析":
                    hideButtons("天气");
                    hideButtons("测量");
                    hideButtons("拾取");
                    hideButtons("查询");
                    recoveryEvn("图层树");
                break;
                case "幻灯片":
                case "出图":
                case "漫游":
                case "图层树":
                    hideButtons("天气");
                    hideButtons("测量");
                    hideButtons("拾取");
                    hideButtons("查询");
                    hideButtons("分析");
                break;
            }
        }
    }
}
function hideButtons(name){
    switch(name){
        case "天气":
            {
                for (var i = 0; i < weatherButtons.length; i++) {
                    var button = weatherButtons[i];
                    if (i == 0 && button.isVisible) {
                        changeWeather("晴天");
                    }
                    button.isVisible = false;
                }
            }
        break;
        case "测量":
            {
                for (var i = 0; i < measureButtons.length; i++) {
                    var button = measureButtons[i];
                    if (i == 0 && button.isVisible) {
                        __g.interactMode = gviInteractMode.gviInteractNormal;
                    }
                    button.isVisible = false;
                }
            }
        break;
        case "拾取":
            {
                recoveryEvn("拾取");
                for (var i = 0; i < selectButtons.length; i++) {
                    var button = selectButtons[i];
                    if (i == 0 && button.isVisible) {
                        __g.interactMode = gviInteractMode.gviInteractNormal;
                    }
                    button.isVisible = false;
                }
            }
        break;
        case "查询":
            {
                recoveryEvn("查询");
                for (var i = 0; i < queryButtons.length; i++) {
                    var button = queryButtons[i];
                    if (i == 0 && button.isVisible) {
                        __g.interactMode = gviInteractMode.gviInteractNormal;
                    }
                    button.isVisible = false;
                }
            }
        break;
        case "分析":
            {
                recoveryEvn("分析");
                for (var i = 0; i < analyseButtons.length; i++) {
                    var button = analyseButtons[i];
                    if (i == 0 && button.isVisible) {
                        __g.interactMode = gviInteractMode.gviInteractNormal;
                    }
                    button.isVisible = false;
                }
            }
        break;
    }
}
function recovery2Evn(type,btnName){
    switch (type){
        case "拾取":
            {
                switch (btnName){
                    case "树木信息":
                        {
                            
                            // 恢复地块查询
                            if(isMassif){massifQueryClick()};
                            // 恢复建筑查询
                            if(isBuilding){buildingQuery()};
                            // 恢复多边形查询
                            if(isSelectMore){selectMore()};
                            //恢复BIM查询
                            if(isBIM){bimQueryClick()};
                        }
                    break;
                    case "地块查询":
                        {
                            // 恢复树木信息
                            if(isTreeClick){showProperty()};
                            // 恢复建筑查询
                            if(isBuilding){buildingQuery()};
                            // 恢复多边形查询
                            if(isSelectMore){selectMore()};
                            //恢复BIM查询
                            if(isBIM){bimQueryClick()};
                        }
                    break;
                    case "BIM查询":
                        {
                            // 恢复树木信息
                            if(isTreeClick){showProperty()};
                            // 恢复地块查询
                            if(isMassif){massifQueryClick()};
                            // 恢复建筑查询
                            if(isBuilding){buildingQuery()};
                            // 恢复多边形查询
                            if(isSelectMore){selectMore()};
                        }
                    break;
                    case "建筑查询":
                        {
                            // 恢复树木信息
                            if(isTreeClick){showProperty()};
                            // 恢复地块查询
                            if(isMassif){massifQueryClick()};
                            // 恢复多边形查询
                            if(isSelectMore){selectMore()};
                            //恢复BIM查询
                            if(isBIM){bimQueryClick()};
                        }
                    break;
                    case "多边形查询":
                        {
                            // 恢复树木信息
                            if(isTreeClick){showProperty()};
                            // 恢复地块查询
                            if(isMassif){massifQueryClick()};
                            // 恢复建筑查询
                            if(isBuilding){buildingQuery()};
                            //恢复BIM查询
                            if(isBIM){bimQueryClick()};
                        }
                    break;
                    case "all":
                    {
                        // 恢复树木信息
                        if(isTreeClick){showProperty()};
                        // 恢复地块查询
                        if(isMassif){massifQueryClick()};
                        // 恢复建筑查询
                        if(isBuilding){buildingQuery()};
                        // 恢复多边形查询
                        if(isSelectMore){selectMore()};
                        //恢复BIM查询
                        if(isBIM){bimQueryClick()};
                    }
                break;
                }
            }
        break;
        case "查询":
            {
                switch (btnName){
                    case "POI查询":
                        {
                            // 属性查询
                            if(isPropertyQuery){propertyQuery()};
                        }
                    break;
                    case "属性查询":
                        {
                            // POI查询
                            if(isPoiQuery){poiQuery()};
                        }
                    break;
                    case "all":
                        {
                            // 属性查询
                            if(isPropertyQuery){propertyQuery()};
                            // POI查询
                            if(isPoiQuery){poiQuery()};
                        }
                    break;
                }
            }
        break;
        case "分析":
            {
                switch (btnName){
                    case "视域分析":
                        {
                            // 恢复历史回溯
                            if(isHistoryShow){historyShow()};
                            // 恢复视频投影
                            if(isTerrainVideo){showTerrainVideo()};
                            // 恢复分屏模式
                            if(isShowEast){viewportShow()};
                            // 恢复立体剖切
                            if (__g.interactMode == gviInteractMode.gviInteractClipPlane && __g.clipMode == gviClipMode.gviClipBox) {
                                __g.interactMode = gviInteractMode.gviInteractNormal;
                            }
                        }
                    break;
                    case "日照分析":
                        {
                            // 恢复视域分析
                            if(isViewshedPopShow){showViewshedPop()};
                            // 恢复历史回溯
                            if(isHistoryShow){historyShow()};
                            // 恢复视频投影
                            if(isTerrainVideo){showTerrainVideo()};
                            // 恢复分屏模式
                            if(isShowEast){viewportShow()};
                            // 恢复立体剖切
                            if (__g.interactMode == gviInteractMode.gviInteractClipPlane && __g.clipMode == gviClipMode.gviClipBox) {
                                __g.interactMode = gviInteractMode.gviInteractNormal;
                            }
                        }
                    break;
                    case "立体剖切":
                        {
                            // 恢复视域分析
                            if(isViewshedPopShow){showViewshedPop()};
                            // 恢复历史回溯
                            if(isHistoryShow){historyShow()};
                            // 恢复视频投影
                            if(isTerrainVideo){showTerrainVideo()};
                            // 恢复分屏模式
                            if(isShowEast){viewportShow()};
                            // 恢复立体剖切
                            // if (__g.interactMode == gviInteractMode.gviInteractClipPlane && __g.clipMode == gviClipMode.gviClipBox) {
                            //     __g.interactMode = gviInteractMode.gviInteractNormal;
                            // }
                        }
                    break;
                    case "历史回溯":
                        {
                            // 恢复视域分析
                            if(isViewshedPopShow){showViewshedPop()};
                            // 恢复视频投影
                            if(isTerrainVideo){showTerrainVideo()};
                            // 恢复分屏模式
                            if(isShowEast){viewportShow()};
                            // 恢复立体剖切
                            if (__g.interactMode == gviInteractMode.gviInteractClipPlane && __g.clipMode == gviClipMode.gviClipBox) {
                                __g.interactMode = gviInteractMode.gviInteractNormal;
                            }
                        }
                    break;
                    case "视频投影":
                        {
                            // 恢复视域分析
                            if(isViewshedPopShow){showViewshedPop()};
                            // 恢复历史回溯
                            if(isHistoryShow){historyShow()};
                            // 恢复分屏模式
                            if(isShowEast){viewportShow()};
                            // 恢复立体剖切
                            if (__g.interactMode == gviInteractMode.gviInteractClipPlane && __g.clipMode == gviClipMode.gviClipBox) {
                                __g.interactMode = gviInteractMode.gviInteractNormal;
                            }
                        }
                    break;
                    case "分屏模式":
                        {
                            // 恢复视域分析
                            if(isViewshedPopShow){showViewshedPop()};
                            // 恢复历史回溯
                            if(isHistoryShow){historyShow()};
                            // 恢复视频投影
                            if(isTerrainVideo){showTerrainVideo()};
                            // 恢复立体剖切
                            if (__g.interactMode == gviInteractMode.gviInteractClipPlane && __g.clipMode == gviClipMode.gviClipBox) {
                                __g.interactMode = gviInteractMode.gviInteractNormal;
                            }
                        }
                    break;
                    case "高程开关":
                    case "地形显隐":
                    case "all":
                        {
                            // 恢复视域分析
                            if(isViewshedPopShow){showViewshedPop()};
                            // 恢复历史回溯
                            if(isHistoryShow){historyShow()};
                            // 恢复视频投影
                            if(isTerrainVideo){showTerrainVideo()};
                            // 恢复分屏模式
                            if(isShowEast){viewportShow()};
                            // 恢复立体剖切
                            if (__g.interactMode == gviInteractMode.gviInteractClipPlane && __g.clipMode == gviClipMode.gviClipBox) {
                                __g.interactMode = gviInteractMode.gviInteractNormal;
                            }
                        }
                    break;
                }
            }
        break;
    }
}
function recoveryEvn(btnName){
    switch (btnName){
        case "拾取":
            {
                recovery2Evn("拾取","all");
            }
        break;
        case "查询":
            {
                recovery2Evn("查询","all");
            }
        break;
        case "分析":
            {
                recovery2Evn("分析","all");
            }
        break;
        case "图层树":
            {
                // 恢复图层树
                if(islayerTreeShow){showLayerTree();}
            }
        break;
    }
}
//天气特效
function changeWeather(item) {
    var skybox = objectManager.getSkyBox(0);
    switch (item) {
        case "晴天":
            skybox.weather = gviWeatherType.gviWeatherSunShine;
            break;
        case "小雨":
            skybox.weather = gviWeatherType.gviWeatherLightRain;
            break;
        case "中雨":
            skybox.weather = gviWeatherType.gviWeatherModerateRain;
            break;
        case "大雨":
            skybox.weather = gviWeatherType.gviWeatherHeavyRain;
            break;
        case "小雪":
            skybox.weather = gviWeatherType.gviWeatherLightSnow;
            break;
        case "中雪":
            skybox.weather = gviWeatherType.gviWeatherModerateSnow;
            break;
        case "大雪":
            skybox.weather = gviWeatherType.gviWeatherHeavySnow;
            break;
    }
}
////////////////
//图层树
////////////////
var islayerTreeShow = false;
var wpLayerTree;
function showLayerTree() {
    if (!wpLayerTree) {
        var width = $("#__g").width();
        var height = $("#__g").height();
        console.log("height", height);
        wpLayerTree = htmlWindow.createWindowParam();
        wpLayerTree.filePath = Config.localPath + "html/layerTree/tree.html";
        wpLayerTree.sizeX = Config.htmlWinWidth;//Number(width) * 0.20;
        wpLayerTree.sizeY = Number(height) + Config.htmlWinHeight;
        wpLayerTree.hastitle = false;
        wpLayerTree.position = gviHTMLWindowPosition.gviWinPosParentRightTop;
        wpLayerTree.round = -1;
        wpLayerTree.hideOnClick = false;
        wpLayerTree.winId = 1;
        wpLayerTree.transparence = 200;
        wpLayerTree.isPopupWindow = false;
        wpLayerTree.resizable = true;
        wpLayerTree.resetOnHide="";
    }
    if (!islayerTreeShow) {
        htmlWindow.setWindowParam(wpLayerTree);
        islayerTreeShow = true;
    }
    else {
        htmlWindow.hideWindow(wpLayerTree.winId);
        islayerTreeShow = false;
    }
}
////////////////
//属性面板
////////////////
// var treeLayerName = ["1标段树木","缺省"];
var isTreeClick = false;
var wpTree;
var treePropertyObj = {id:null, name:null};
function showProperty() {
    //点击树事件
    if (isTreeClick) {
        isTreeClick = false;
        hideTreeWP();
        __g.interactMode = gviInteractMode.gviInteractNormal;
    } else {
        isTreeClick = true;
        __g.interactMode = gviInteractMode.gviInteractSelect;
        __g.mouseSelectMode = gviMouseSelectMode.gviMouseSelectClick;
    }
}
function onTreeClick(pickResult) {
    hideTreeWP();
    var width = $("#__g").width();
    var height = $("#__g").height();
    if (pickResult != null && pickResult.type == gviObjectType.gviObjectFeatureLayer) {
        var fid = pickResult.featureId;
        var fl = pickResult.featureLayer;
        console.log(fl.guid,fid);
        // tree layer
        if(/\d标段树木/.test(fl.name)){
            if (!wpTree) {
                wpTree = htmlWindow.createWindowParam();
                wpTree.filePath = Config.localPath + 'html/treeSlider/slider.html?t=' + new Date().getTime();
                wpTree.sizeX = Config.htmlWinWidth;
                wpTree.sizeY = Number(height) + Config.htmlWinHeight;
                wpTree.hastitle = false;
                wpTree.position = gviHTMLWindowPosition.gviWinPosParentRightTop;
                wpTree.round = -1;
                wpTree.hideOnClick = false;
                wpTree.winId = 2;
                wpTree.transparence = 200;
                wpTree.isPopupWindow = false;
                wpTree.resizable = false;
            }
            {
                fl.highlightFeature(fid,0xffff0000);
                    

                var fl_conn = fl.featureClassInfo.dataSourceConnectionString;
                var fl_ds = dataSourceFactory.openDataSourceByString(fl_conn);
                var fl_fdsName = fl.featureClassInfo.dataSetName;
                var fl_fds = fl_ds.openFeatureDataset(fl_fdsName);
                var fl_fcName = fl.featureClassInfo.featureClassName;
                var fl_fc = fl_fds.openFeatureClass(fl_fcName);
                var fl_row = fl_fc.getRow(fid);
                var id_index = fl_row.fieldIndex("Code");
                var name_index = fl_row.fieldIndex("Type");
                if (id_index > -1 && name_index > -1) {
                    treePropertyObj.id = fl_row.getValue(id_index);
                    treePropertyObj.name = fl_row.getValue(name_index);
                } else {
                    alert("数据未查询到。");
                    treePropertyObj.id = "1";
                    treePropertyObj.name = "银杏";
                }
                fl_row = null;
                fl_fc = null;
                fl_fds = null;
                fl_ds = null;
                CollectGarbage();
            }
            if (treePropertyObj.id && treePropertyObj.name) {
                wpTree.filePath = Config.localPath + 'html/treeSlider/slider.html?t=' + new Date().getTime();
                htmlWindow.setWindowParam(wpTree);
            }
        }
        // treeLayerName.map(function (name, i) {
        //     if (fl.name == name) {
                
        //     }
        // });
    }
}
//隐藏树属性框并清除树高亮
function hideTreeWP() {
    if (wpTree) {
        __g.featureManager.unhighlightAll();
        treePropertyObj.id = null;
        treePropertyObj.name = null;
        htmlWindow.hideWindow(wpTree.winId);
    }
}
////////////////
//地块查询
////////////////
var isMassif = false;
var treeLayerFLMap = [];//智慧森林fl数组
var massifInfoMap = [];//地块信息
function massifQueryClick() {
    //点击地块事件
    if (isMassif) {//取消
        //设置树fl参与拾取
        if (treeLayerFLMap.length > 0) {
            treeLayerFLMap.map(function (item, i) {
                item.mouseSelectMask = gviViewportMask.gviViewAllNormalView;
            });
        }
        //地块分组隐藏
        setMassifDisplay(false);

        hideTableLabel();
        isMassif = false;
        __g.interactMode = gviInteractMode.gviInteractNormal;
        __g.mouseSelectMode = gviMouseSelectMode.gviMouseSelectClick;
    } else {//触发
        if (treeLayerFLMap.length == 0) {
            loadThreeFL();
        }
        //设置树fl不参与拾取
        if (treeLayerFLMap.length > 0) {
            treeLayerFLMap.map(function (item, i) {
                item.mouseSelectMask = gviViewportMask.gviViewNone;
            });
        }
        //地块分组显示
        setMassifDisplay(true);

        isMassif = true;
        __g.interactMode = gviInteractMode.gviInteractSelect;
    }
}
//循环树图层
function loadThreeFL() {
    var treeGroupGuid = __g.projectTree.findItem(Config.treeLayerPath);
    if (treeGroupGuid != "00000000-0000-0000-0000-000000000000") {
        setThreeFL(treeGroupGuid);
    } else {
        console.log("citymaker error:", "树木分组路径找不到");
    }
}
//递归取树图层并加入树图层数组
function setThreeFL(guid) {
    if (__g.projectTree.isGroup(guid)) {
        var childGuid = __g.projectTree.getNextItem(guid, 11);
        while (childGuid != "00000000-0000-0000-0000-000000000000") {
            setThreeFL(childGuid);
            childGuid = __g.projectTree.getNextItem(childGuid, 13);
        }
    } else {
        var obj = __g.objectManager.getObjectById(guid);
        if (obj.type == gviObjectType.gviObjectFeatureLayer) {
            treeLayerFLMap.push(obj);
        }
    }
}
//地块点击事件
function onMassifQuery(pickResult, intersectPoint) {
    hideTableLabel();
    if (pickResult != null && pickResult.type == gviObjectType.gviObjectFeatureLayer) {
        var fid = pickResult.featureId;
        var fl = pickResult.featureLayer;

        Config.massifName.map(function (name, i) {
            if (fl.name == name) {
                {//查询
                    fl.highlightFeature(fid, 0xffff0000); 
                    var fl_conn = fl.featureClassInfo.dataSourceConnectionString;
                    var fl_ds = dataSourceFactory.openDataSourceByString(fl_conn);
                    var fl_fdsName = fl.featureClassInfo.dataSetName;
                    var fl_fds = fl_ds.openFeatureDataset(fl_fdsName);
                    var fl_fcName = fl.featureClassInfo.featureClassName;
                    var fl_fc = fl_fds.openFeatureClass(fl_fcName);
                    var fl_row = fl_fc.getRow(fid);
                    // 查询数据
                    {
                        Config.massifFieldNames.map(function(item){
                            var massif_index = fl_row.fieldIndex(item);
                            if(massif_index>-1){
                                massifInfoMap.push(fl_row.getValue(massif_index));
                            }else{
                                massifInfoMap.push("暂无");
                            }
                        });
                    }
                    fl_row = null;
                    fl_fc = null;
                    fl_fds = null;
                    fl_ds = null;
                    CollectGarbage();
                }
                {
                    //创建
                    drawTableLabel(intersectPoint);
                }
            }
        });
    }
}
//创建tablelabel
var tableLabel;
function drawTableLabel(point) {
    var rowCount = Config.massifShowNames.length, columnCount = 2;
    var objManager = __g.objectManager;
    if (!tableLabel) {
        tableLabel = objManager.createTableLabel(rowCount, columnCount, __rootId);

        tableLabel.titleText = "地块信息";

        Config.massifShowNames.map(function(item,i){
            tableLabel.setRecord(i, 0, item);
        });

        tableLabel.borderColor = 4285098345;
        tableLabel.borderWidth = 2;
        // tableLabel.tableBackgroundColor = 2531320032;

        // 内容标题样式
        var columeCapitalTextAttribute = __g.new_TextAttribute;
        columeCapitalTextAttribute.textColor = 4278190080;
        columeCapitalTextAttribute.outlineColor = 4294967295;
        columeCapitalTextAttribute.font = "宋体";
        columeCapitalTextAttribute.textSize = 14;
        columeCapitalTextAttribute.bold = true;
        columeCapitalTextAttribute.multilineJustification = gviMultilineJustification.gviMultilineCenter;
        tableLabel.setColumnTextAttribute(0, columeCapitalTextAttribute);

        // 内容值样式
        var columeValueTextAttribute = __g.new_TextAttribute;
        columeValueTextAttribute.textColor = 4278190080;
        columeValueTextAttribute.outlineColor = 16777215;
        columeValueTextAttribute.font = "宋体";
        columeValueTextAttribute.textSize = 14;
        columeValueTextAttribute.bold = true;
        columeValueTextAttribute.multilineJustification = gviMultilineJustification.gviMultilineLeft;
        tableLabel.setColumnTextAttribute(1, columeValueTextAttribute);

        // 标题样式
        tableLabel.titleBackgroundColor = 2531320032;
        var titleTextAttribute = __g.new_TextAttribute;
        titleTextAttribute.textColor = 4278190080;
        titleTextAttribute.outlineColor = 4294967295;
        titleTextAttribute.font = "宋体";
        titleTextAttribute.textSize = 16;
        titleTextAttribute.multilineJustification = gviMultilineJustification.gviMultilineCenter;
        titleTextAttribute.bold = true;
        titleTextAttribute.backgroundColor = 2531320032;
        tableLabel.titleTextAttribute = titleTextAttribute;
        // 设置深度检测
        tableLabel.depthTestMode = gviDepthTestMode.gviDepthTestDisable;
    }
    tableLabel.position = point;

    massifInfoMap.map(function(item,i){
        tableLabel.setRecord(i, 1, item || "暂无");
    });

    tableLabel.visibleMask = gviViewportMask.gviViewAllNormalView;
}
//设置地块fl是否显示
function setMassifDisplay(isShow) {
    var guid = __g.projectTree.findItem(Config.treeMassifPath);
    if (guid != "00000000-0000-0000-0000-000000000000") {
        if (isShow) {
            __g.projectTree.setVisibility(guid, gviViewportMask.gviViewAllNormalView);
        } else {
            __g.projectTree.setVisibility(guid, gviViewportMask.gviViewNone);
        }
    } else {
        console.log("citymaker error:","地块分组路径找不到");
    }
}
//隐藏tablelabel
function hideTableLabel() {
    __g.featureManager.unhighlightAll();
    if (tableLabel) {
        tableLabel.visibleMask = gviViewportMask.gviViewNone;
    }
    if(massifInfoMap.length>0){
        massifInfoMap.splice(0,massifInfoMap.length);
    }
}
////////////////
//BIM查询
////////////////
var isBIM = false;
var wpBIM;
var bimFLMap=[];
var bimObj={fl:null,fid:null};
function bimQueryClick(){
    var height = $("#__g").height();
    if (isBIM) {//取消
        isBIM = false;
        __g.featureManager.unhighlightAll();
        if(wpBIM){htmlWindow.hideWindow(wpBIM.winId);}
        __g.interactMode = gviInteractMode.gviInteractNormal;
        __g.mouseSelectMode = gviMouseSelectMode.gviMouseSelectClick;
    } else {//触发
        isBIM = true;
        if(bimFLMap.length<1){
            for(var i=0; i<Config.bimGroupPath.length; i++){
                loadFL(Config.bimGroupPath[i],bimFLMap);
            }
        }
        if(!wpBIM){
            wpBIM = htmlWindow.createWindowParam();
            wpBIM.filePath = Config.localPath + 'html/bim/BIM.html?t=' + new Date().getTime();
            wpBIM.sizeX = Config.htmlWinWidth;
            wpBIM.sizeY = Number(height) + Config.htmlWinHeight;
            wpBIM.hastitle = false;
            wpBIM.position = gviHTMLWindowPosition.gviWinPosParentRightTop;
            wpBIM.round = -1;
            wpBIM.hideOnClick = false;
            wpBIM.winId = 8;
            wpBIM.transparence = 200;
            wpBIM.isPopupWindow = false;
            wpBIM.resizable = false;
        }
        __g.interactMode = gviInteractMode.gviInteractSelect;
    }
}
function onBIMQueryClick(pickResult, intersectPoint){
    __g.featureManager.unhighlightAll();
    if (pickResult != null && pickResult.type == gviObjectType.gviObjectFeatureLayer) {
        var fid = pickResult.featureId;
        var fl = pickResult.featureLayer;
        if(bimFLMap.length>1){
            for(var i=0; i<bimFLMap.length; i++){
                if(bimFLMap[i].guid==fl.guid){
                    fl.highlightFeature(fid, 0xffff0000);
                    if(wpBIM){
                        bimObj.fid=fid;
                        bimObj.fl=fl;
                        wpBIM.filePath = Config.localPath + 'html/bim/BIM.html?t=' + new Date().getTime();
                        htmlWindow.setWindowParam(wpBIM);
                    }
                }
            }
        }
    }
}
//循环图层
function loadFL(path,objMap) {
    var GroupGuid = __g.projectTree.findItem(path);
    if (GroupGuid != "00000000-0000-0000-0000-000000000000") {
        setFL(GroupGuid,objMap);
    } else {
        console.log("citymaker error:", "分组路径找不到");
    }
}
//递归取树图层并加入树图层数组
function setFL(guid,objMap) {
    if (__g.projectTree.isGroup(guid)) {
        var childGuid = __g.projectTree.getNextItem(guid, 11);
        while (childGuid != "00000000-0000-0000-0000-000000000000") {
            setFL(childGuid,objMap);
            childGuid = __g.projectTree.getNextItem(childGuid, 13);
        }
    } else {
        var obj = __g.objectManager.getObjectById(guid);
        if (obj.type == gviObjectType.gviObjectFeatureLayer) {
            objMap.push(obj);
        }
    }
}
////////////////
//POI查询
////////////////
var isPoiQuery = false;
var wpPoiQuery;
function poiQuery(){
    var height = $('#__g').height();
    if(!wpPoiQuery){
        wpPoiQuery = htmlWindow.createWindowParam();
        wpPoiQuery.filePath = Config.localPath + "html/poi/POI.html";
        wpPoiQuery.sizeX = Config.htmlWinWidth;
        wpPoiQuery.sizeY = Number(height) + Config.htmlWinHeight;
        wpPoiQuery.hastitle = false;
        wpPoiQuery.position = gviHTMLWindowPosition.gviWinPosParentRightTop;
        wpPoiQuery.round = -1;
        wpPoiQuery.hideOnClick = false;
        wpPoiQuery.winId = 4;
        wpPoiQuery.transparence = 200;
        wpPoiQuery.isPopupWindow = false;
        wpPoiQuery.resizable = false;
        wpPoiQuery.resetOnHide="";
    }
    if(isPoiQuery){//取消poi查询
        htmlWindow.hideWindow(wpPoiQuery.winId);
        __g.featureManager.unhighlightAll();
        isPoiQuery = false;
    }else{//执行查询
        htmlWindow.setWindowParam(wpPoiQuery);
        isPoiQuery = true;
    }
}
////////////////
//属性查询
////////////////
var isPropertyQuery = false;
var wpPropertyQuery;
var _propertyFLMap=[];
var _propertyconn;
function propertyQuery(){
    var height = $("#__g").height();
    if(!wpPropertyQuery){
        wpPropertyQuery = htmlWindow.createWindowParam();
        wpPropertyQuery.filePath = Config.localPath + "html/property/property.html";
        wpPropertyQuery.sizeX = Config.htmlWinWidth;
        wpPropertyQuery.sizeY = Number(height) + Config.htmlWinHeight;
        wpPropertyQuery.hastitle = false;
        wpPropertyQuery.position = gviHTMLWindowPosition.gviWinPosParentRightTop;
        wpPropertyQuery.round = -1;
        wpPropertyQuery.hideOnClick = false;
        wpPropertyQuery.winId = 7;
        wpPropertyQuery.transparence = 200;
        wpPropertyQuery.isPopupWindow = false;
        wpPropertyQuery.resizable = false;
        wpPropertyQuery.resetOnHide="";
    }
    if(isPropertyQuery){//取消查询
        htmlWindow.hideWindow(wpPropertyQuery.winId);
        highlightHelper.setRegion(null);
        __g.featureManager.unhighlightAll();
        isPropertyQuery = false;
    }else{//执行查询
        if(_propertyFLMap.length<1){
            try{
                var c = __g.new_ConnectionInfo;
                c.connectionType = Config.propertyInfo.connectionType;
                c.server = Config.propertyInfo.server;
                c.port = Config.propertyInfo.port;
                c.database = Config.propertyInfo.database;
                c.userName = Config.propertyInfo.userName;
                c.password = Config.propertyInfo.password;
                _propertyconn = c.toConnectionString();
                var ds = dataSourceFactory.openDataSourceByString(c.toConnectionString());
                var fds = ds.openFeatureDataset(Config.propertyInfo.fdsName);
                var fc = fds.openFeatureClass(Config.propertyInfo.fcName);
                if(fc){
                    _propertyFLMap.push(fc);
                }
            }catch(e){
                console.log("citymaker error:", e);
            }
            
        }
        htmlWindow.setWindowParam(wpPropertyQuery);
        isPropertyQuery = true;
    }
}
////////////////
//建筑查询
////////////////
var isBuilding = false;
var wpBuilding;
var _buildingInfoVals=[];
var _fieldIndexMap = [];
var _buildingFC;
function buildingQuery(){
    if(isBuilding){//取消拾取
        isBuilding=false;
        highlightHelper.setRegion(null);
        if(wpBuilding){
            htmlWindow.hideWindow(wpBuilding.winId);
        }
        __g.interactMode = gviInteractMode.gviInteractNormal;
    }else{//添加拾取 
        isBuilding=true;
        __g.interactMode = gviInteractMode.gviInteractSelect;
        __g.mouseSelectObjectMask = gviMouseSelectObjectMask.gviSelectTileLayer;
        __g.mouseSelectMode = gviMouseSelectMode.gviMouseSelectClick;
        highlightHelper.color = 0xa0ff00ff;
        highlightHelper.visibleMask = 255;
    }
}
function onBuildingQuery(pickResult, intersectPoint){
    {
        highlightHelper.setRegion(null);
        if(_fieldIndexMap.length>0){
            _fieldIndexMap.splice(0,_fieldIndexMap.length);
        }
        if(_buildingInfoVals.length>0){
            _buildingInfoVals.splice(0,_buildingInfoVals.length);
        }
        if(wpBuilding){
            htmlWindow.hideWindow(wpBuilding.winId);
        }
    }
    if(!_buildingFC){
        var c = __g.new_ConnectionInfo;
        c.connectionType = Config.buildingConnect.connectionType;
        c.server = Config.buildingConnect.server;
        c.port = Config.buildingConnect.port;
        c.database = Config.buildingConnect.database;
        c.userName = Config.buildingConnect.userName;
        c.password = Config.buildingConnect.password;
        try{
            var ds = dataSourceFactory.openDataSourceByString(c.toConnectionString());
            var fds = ds.openFeatureDataset(Config.buildingConnect.fdsName);
            _buildingFC = fds.openFeatureClass(Config.buildingConnect.fcName);
        }catch(e){
            console.log("CityMakerError:","打开数据源出错");
        }
    }
    if(!wpBuilding){
        wpBuilding = htmlWindow.createWindowParam();
        wpBuilding.filePath = Config.localPath + 'html/building/building.html?t=' + new Date().getTime();
        wpBuilding.sizeX = Config.buildingInfo.width;
        wpBuilding.sizeY = Config.buildingInfo.height;//135
        wpBuilding.hastitle = false;
        wpBuilding.position = gviHTMLWindowPosition.gviWinPosParentRightTop;
        wpBuilding.round = -1;
        wpBuilding.hideOnClick = false;
        wpBuilding.winId = 5;
        wpBuilding.transparence = 200;
        wpBuilding.isPopupWindow = false;
        wpBuilding.resizable = false;
    }
    try{
        var fc = _buildingFC;
        var relation = intersectPoint;
        var cursor = null;
        var row = null;
        var filter = __g.new_SpatialFilter;
        filter.geometry = intersectPoint;
        filter.spatialRel = gviSpatialRel.gviSpatialRelEnvelope;
        filter.geometryField = Config.buildingConnect.geometryFieldName;
        try{
            cursor = fc.search(filter, false);
            var geometryIndex = cursor.findField(Config.buildingConnect.geometryFieldName);
            
            Config.buildingInfo.fieldNames.map(function(field){
                _fieldIndexMap.push(cursor.findField(field));
            });
            var list = new Array();
            while ((row = cursor.nextRow()) != null) {
                list.push(row);
            }
            //开始遍历
            for (var i = 0; i < list.length; i++) {
                var r= list[i];
                var polygon =r.getValue(geometryIndex);
                if(polygon.geometryType==gviGeometryType.gviGeometryPolygon){
                    if (relation.within2D(polygon)) {
                        highlightHelper.setRegion(polygon);
                        _fieldIndexMap.map(function(item){
                            if(item<0){
                                _buildingInfoVals.push("暂无");
                            }else{
                                _buildingInfoVals.push(r.getValue(item));
                            }
                        });
                    }
                }
            }
            // 弹窗
            if(wpBuilding&&list.length>0){
                wpBuilding.filePath = Config.localPath + 'html/building/building.html?t=' + new Date().getTime();
                htmlWindow.setWindowParam(wpBuilding);
            }
        }catch(e){
            console.log("CityMakerError:","查询出错");
        }
        // fc = null;
        // fds = null;
        // ds = null;
        // CollectGarbage();
    }catch(e){
        console.log("CityMakerError:","打开数据源出错");
    }
}
////////////////
//多边形查询
////////////////
var isSelectMore = false;
var wpSelectMore;
var _tempGeometry;
var _tempRenderGeometry;
var _selectMoreObj={area:0,count:0}
function selectMore(){
    if(isSelectMore){//取消
        isSelectMore=false;
        highlightHelper.setRegion(null);
        if(wpSelectMore){
            htmlWindow.hideWindow(wpSelectMore.winId);
        }
        if(_tempRenderGeometry){
            objectManager.deleteObject(_tempRenderGeometry.guid);
            _tempRenderGeometry = null;
        }
        __g.interactMode = gviInteractMode.gviInteractNormal;
    }else{//添加多边形
        __g.interactMode = gviInteractMode.gviInteractEdit;
        isSelectMore=true;
        var surfaceSymbol = __g.new_SurfaceSymbol;
        surfaceSymbol.color = 0x770000FF;
        this._tempGeometry = geometryFactory.createGeometry(gviGeometryType.gviGeometryPolygon, gviVertexAttribute.gviVertexAttributeZ);
        this._tempRenderGeometry = objectManager.createRenderPolygon(this._tempGeometry, surfaceSymbol, __rootId);
        this._tempRenderGeometry.heightStyle = gviHeightStyle.gviHeightOnEverything;
        __g.objectEditor.startEditRenderGeometry(this._tempRenderGeometry, gviGeoEditType.gviGeoEditCreator);
    }
}
function onObjectEditing(geometry) {
    _tempGeometry = geometry;
}

function onObjectEditFinish() {
    if (_tempGeometry) {
        if(!_buildingFC){
            var c = __g.new_ConnectionInfo;
            c.connectionType = Config.buildingConnect.connectionType;
            c.server = Config.buildingConnect.server;
            c.port = Config.buildingConnect.port;
            c.database = Config.buildingConnect.database;
            c.userName = Config.buildingConnect.userName;
            c.password = Config.buildingConnect.password;
            try{
                var ds = dataSourceFactory.openDataSourceByString(c.toConnectionString());
                var fds = ds.openFeatureDataset(Config.buildingConnect.fdsName);
                _buildingFC = fds.openFeatureClass(Config.buildingConnect.fcName);
            }catch(e){
                console.log("CityMakerError:","打开数据源出错");
            }
        }
        if(!wpSelectMore){
            wpSelectMore = htmlWindow.createWindowParam();
            wpSelectMore.filePath = Config.localPath + 'html/selectmore/selectmore.html?t=' + new Date().getTime();
            wpSelectMore.sizeX = Config.htmlWinWidth;
            wpSelectMore.sizeY = 135;
            wpSelectMore.hastitle = false;
            wpSelectMore.position = gviHTMLWindowPosition.gviWinPosParentRightTop;
            wpSelectMore.round = -1;
            wpSelectMore.hideOnClick = false;
            wpSelectMore.winId = 6;
            wpSelectMore.transparence = 200;
            wpSelectMore.isPopupWindow = false;
            wpSelectMore.resizable = false;
        }
        try{
            var fc = _buildingFC;
            var cursor = null;
            var row = null;
            var filter = __g.new_SpatialFilter;
            filter.geometry = _tempGeometry;
            filter.spatialRel = gviSpatialRel.gviSpatialRelEnvelope;
            filter.geometryField = Config.buildingConnect.geometryFieldName;
            cursor = fc.search(filter, false);
            var oidIndex = cursor.findField("oid");
            var list = new Array();
            if (oidIndex != -1) {
                while ((row = cursor.nextRow()) != null) {
                    list.push(row.getValue(oidIndex));
                }
            }
            _selectMoreObj.count = list.length;
            _selectMoreObj.area = _tempGeometry.area();
            if(wpSelectMore&&_selectMoreObj.area>0){
                wpSelectMore.filePath = Config.localPath + 'html/selectmore/selectmore.html?t=' + new Date().getTime();
                htmlWindow.setWindowParam(wpSelectMore);
            }
        }catch(e){
            console.log("CityMakerError:","查询出错");
        }
    }
    __g.interactMode = gviInteractMode.gviInteractNormal;
}
////////////////
//视域分析面板
////////////////
var isViewshedPopShow = false;
var wpViewshedPop;
function showViewshedPop() {
    if (!isViewshedPopShow) {
        mouseClickNum = 0;
        point1 = null;
        point2 = null;
        __g.interactMode = gviInteractMode.gviInteractSelect;
        __g.mouseSelectObjectMask = gviMouseSelectObjectMask.gviSelectAll;
        __g.mouseSelectMode = gviMouseSelectMode.gviMouseSelectClick;
        highlightHelper.setRegion(null);
        highlightHelper.visibleMask = 255;
        /*
        htmlWindow.setWindowParam(wpViewshedPop);
        */
        isViewshedPopShow = true;
    }
    else {
        /*
        htmlWindow.hideWindow(wpViewshedPop.winId);
        */
        isViewshedPopShow = false;
        __g.interactMode = gviInteractMode.gviInteractNormal;
        highlightHelper.visibleMask = 0;
        if (viewshed)
            objectManager.deleteObject(viewshed.guid);

    }
}
var viewshed;
function showViewshed(point1, point2, heading) {
    var angle = camera.getAimingAngles2(point1, point2);
    if (viewshed)
        objectManager.deleteObject(viewshed.guid);
    viewshed = objectManager.createViewshed(point1, __rootId);
    viewshed.angle = angle;
    var x1 = point1.x;
    var y1 = point1.y;
    var z1 = point1.z;
    var x2 = point2.x;
    var y2 = point2.y;
    var z2 = point2.z;
    var calx = x2 - x1;
    var caly = y2 - y1;
    var calz = z2 - z1;
    var dis = Math.pow((calx * calx + caly * caly + calz * calz), 0.5);
    viewshed.farClip = Math.abs(dis);
    viewshed.fieldOfView = heading;
    viewshed.displayMode = 34;

}
var mouseClickNum = 0;
var point1, point2;
var heading = 90;
// 拾取事件
function onMouseClickSelect(pickResult, intersectPoint, mask, eventSender) {

    if (!intersectPoint) return;
    if (isViewshedPopShow) {
        if (eventSender == gviMouseSelectMode.gviMouseSelectClick) {
            if (mouseClickNum == 0) {
                mouseClickNum++;
                point1 = intersectPoint;
                point1.z += 1.7;
                __g.mouseSelectMode = gviMouseSelectMode.gviMouseSelectClick | gviMouseSelectMode.gviMouseSelectMove;
            }
            else {
                point2 = intersectPoint;
                showViewshed(point1, point2, heading);
                __g.interactMode = gviInteractMode.gviInteractNormal;
                highlightHelper.visibleMask = 0;
            }
        }
        else if (eventSender == gviMouseSelectMode.gviMouseSelectMove) {
            if (point1)
                highlightHelper.setSectorRegion(point1, intersectPoint, heading);
        }
    }
    else if (isTerrainVideo) {
        if (eventSender == gviMouseSelectMode.gviMouseSelectClick) {
            var res = camera.getCamera();
            var v1 = res.position;
            var v2 = intersectPoint.position;
            var angle = camera.getAimingAngles(v2, v1);
            var v3 = camera.getAimingPoint(v2, angle, terrainVideoDis);
            if (cVideo)
                objectManager.deleteObject(cVideo.guid);
            var point = geometryFactory.createPoint(gviVertexAttribute.gviVertexAttributeZ);
            point.setCoords(v3.x, v3.y, v3.z, 0, 0);
            cVideo = objectManager.createTerrainVideo(point, __rootId);
            cVideo.displayMode = gviTVDisplayMode.gviTVShowAll;

            cVideo.aspectRatio = 1.36777;
            cVideo.farClip = 200.0;
            cVideo.fieldOfView = 45.0;
            cVideo.playbackRate = 1.0;
            cVideo.playVideoOnStartup = true;
            cVideo.playLoop = true;
            cVideo.videoPosition = 0;
            cVideo.angle = res.angle;
            cVideo.videoOpacity = 1.0;
            cVideo.videoFileName = "http://192.168.3.83/video/ambulance.AVI";
            //camera.setCamera(v3, res.angle, gviSetCameraFlags.gviSetCameraNoFlags);
        }
    }
    else if (isTreeClick) {//拾取
        if (eventSender == gviMouseSelectMode.gviMouseSelectClick) {
            onTreeClick(pickResult);
        }
    }
    else if (isMassif) {//地块查询
        if (eventSender == gviMouseSelectMode.gviMouseSelectClick) {
            onMassifQuery(pickResult, intersectPoint);
        }
    }
    else if(isBuilding){//建筑查询
        if (eventSender == gviMouseSelectMode.gviMouseSelectClick) {
            onBuildingQuery(pickResult, intersectPoint);
        }
    }
    else if(isBIM){//BIM查询
        if (eventSender == gviMouseSelectMode.gviMouseSelectClick) {
            onBIMQueryClick(pickResult, intersectPoint);
        }
    }
}
//视频投影
var isTerrainVideo = false;
var terrainVideoDis = 30;
var cVideo;
function showTerrainVideo() {
    if (!isTerrainVideo) {
        isTerrainVideo = true;
        __g.interactMode = gviInteractMode.gviInteractSelect;
        __g.mouseSelectMode = gviMouseSelectMode.gviMouseSelectClick;
    } else {
        isTerrainVideo = false;
        if (cVideo)
            objectManager.deleteObject(cVideo.guid);
        __g.interactMode = gviInteractMode.gviInteractNormal;
    }
}
//日照分析
var logoLabel;
function shadowShow() {
    if (logoLabel) {
        objectManager.deleteObject(logoLabel.guid);
        logoLabel = null;
    }
    logoLabel = objectManager.createOverlayLabel(__rootId);
    logoLabel.setWidth(168, 0, 0);
    logoLabel.setHeight(61, 0, 0);
    logoLabel.setX(-logoLabel.getWidth() / 2, 1.0, 0);
    logoLabel.setY(logoLabel.getHeight() / 2, 0, 0);

    var sunConfig = __g.sunConfig;
    sunConfig.enableShadow(0, true);
    sunConfig.sunCalculateMode = gviSunCalculateMode.gviSunModeAccordingToGMT;
    var i = 0;
    __g.visualAnalysis.startShadowAnalyse();
    var time1 = setInterval(function () {
        var date = new Date();
        date.setHours(date.getHours() - 8);
        date.setMinutes(date.getMinutes() + i * 6);
        var s = "";
        s += date.getFullYear() + "-";
        s += date.getMonth() + "-";
        s += date.getDate() + " ";
        s += date.getHours() + ":";
        s += date.getMinutes() + ":";
        s += date.getSeconds();

        var ss = "";
        date = new Date();
        date.setMinutes(date.getMinutes() + i * 6);
        ss += date.getFullYear() + "-";
        ss += date.getMonth() + "-";
        ss += date.getDate() + " ";
        ss += date.getHours() + ":";
        ss += date.getMinutes() + ":";
        ss += date.getSeconds();
        logoLabel.text = ss;
        sunConfig.setGMT(s);
        i++;
    }, 100);
    setTimeout(function () {
        sunConfig.enableShadow(0, false);
        clearTimeout(time1); __g.visualAnalysis.stopAnalyse();
        if (logoLabel) {
            objectManager.deleteObject(logoLabel.guid);
            logoLabel = null;
        }
    }, 24000);
}
//************************************************分屏模块
var isShowEast = false;
var _jsonTree;
function viewportShow() {
    if (isShowEast) {
        $("#my_layout").layout('hidden', 'east');
        // 还原为初始状态
        viewport.viewportMode = gviViewportMode.gviViewportSinglePerspective;
        $(".t_list").html("");
        $(".d_measure").removeClass("d_measure_sel");
        RObjectRecovery(_jsonTree);
        isShowEast = false;
    } else {
        $("#my_layout").layout('show', 'east');
        isShowEast = true;
    }
}
// 设置分屏
function SetViewPort(e, num) {
    var jsonObj = eval('(' + projectTree.traverse() + ')');
    _jsonTree = jsonObj;
    // 清空选择
    {
        $(e).siblings().removeClass("d_measure_sel");
        $(e).addClass("d_measure_sel");
    }
    switch (num) {
        case 1://左一右一
            {
                SetViewPortData(2, jsonObj);
                viewport.viewportMode = gviViewportMode.gviViewportL1R1;
                viewport.cameraViewBindMask = gviViewportMask.gviView0 | gviViewportMask.gviView1;
            }
            break;
        case 2://上一下一
            {
                SetViewPortData(2, jsonObj);
                viewport.ViewportMode = gviViewportMode.gviViewportT1B1;
                viewport.cameraViewBindMask = gviViewportMask.gviView0 | gviViewportMask.gviView1;
            }
            break;
        case 3://左一中一右一
            {

                SetViewPortData(3, jsonObj);
                viewport.ViewportMode = gviViewportMode.gviViewportL1M1R1;
                viewport.cameraViewBindMask = gviViewportMask.gviView0 | gviViewportMask.gviView1 | gviViewportMask.gviView2;
            }
            break;
        case 4://上一中一下一
            {

                SetViewPortData(3, jsonObj);
                viewport.ViewportMode = gviViewportMode.gviViewportT1M1B1;
                viewport.cameraViewBindMask = gviViewportMask.gviView0 | gviViewportMask.gviView1 | gviViewportMask.gviView2;
            }
            break;
        case 5://左边两个视口，右边一个
            {
                SetViewPortData(3, jsonObj);
                viewport.ViewportMode = gviViewportMode.gviViewportL2R1;
                viewport.cameraViewBindMask = gviViewportMask.gviView0 | gviViewportMask.gviView1 | gviViewportMask.gviView2;
            }
            break;
        case 6://左一右二
            {
                SetViewPortData(3, jsonObj);
                viewport.ViewportMode = gviViewportMode.gviViewportL1R2;
                viewport.cameraViewBindMask = gviViewportMask.gviView0 | gviViewportMask.gviView1 | gviViewportMask.gviView2;
            }
            break;
        case 7://四视口
            {
                SetViewPortData(4, jsonObj);
                viewport.ViewportMode = gviViewportMode.gviViewportQuad;
                viewport.cameraViewBindMask = gviViewportMask.gviViewAllNormalView;
            }
            break;
        case 8://水平四视口        
            {
                SetViewPortData(4, jsonObj);
                viewport.ViewportMode = gviViewportMode.gviViewportQuadH;
                viewport.cameraViewBindMask = gviViewportMask.gviViewAllNormalView;
            }
            break;
    }
}
// 设置视口数据
function SetViewPortData(num, treeJson) {
    if (num) {
        var tableHtml = "<tr><th>可视对象</th>";
        for (var i = 0; i < num; i++) {
            tableHtml += "<th>" + (i + 1) + "</th>";
        }
        tableHtml += "</tr>";

        _tableHtml = tableHtml;
        // 遍历tree
        if (treeJson) {
            AppendTreeNode(treeJson, num);
        }
        $(".t_list").html(_tableHtml);
    }
}
// 遍历绑定树
function AppendTreeNode(jsonobj, num) {
    if (jsonobj.children == undefined) {
        return;
    }
    var childs = jsonobj.children;
    for (var i = 0; i < childs.length; i++) {
        LoopSubNode(childs[i], num);
    }
}
function LoopSubNode(child, num) {
    var curId = child.id;
    var nodeName = child.name;

    if (child.children && child.children.length > 0) {
        AppendTreeNode(child, num);
    }
    else {
        var rObject = objectManager.getObjectById(curId);
        if (rObject) {
            if (rObject.type == gviObjectType.gviObjectFeatureLayer ||
                    rObject.type == gviObjectType.gviObject3DTileLayer) {
                
                _tableHtml += "<tr><td style='text-align:left'>" + child.name + "</td>";
                for (var i = 0; i < num; i++) {
                    if (i == 0) {
                        if (child.visibility == 0) {
                            _tableHtml += "<td><input type='checkbox' value='" + (i + 1) + "' name='" + child.id + "' onclick='SetFLShow(this)'></td>";
                        } else {
                            _tableHtml += "<td><input type='checkbox' value='" + (i + 1) + "' name='" + child.id + "' checked onclick='SetFLShow(this)'></td>";
                            rObject.visibleMask = gviViewportMask.gviView0;
                        }
                    } else {
                        _tableHtml += "<td><input type='checkbox' value='" + (i + 1) + "' name='" + child.id + "' onclick='SetFLShow(this)'></td>";
                    }
                }
                _tableHtml += "</tr>";
            }
        }
    }
}
// 设置fl在哪个视口显示
function SetFLShow(obj) {
    var fGuid = $(obj)[0].name;
    var portNum = $(obj)[0].value;
    var rObject = objectManager.getObjectById(fGuid);
    if (rObject) {
        var cCount = 0;
        $('input:checkbox[name=' + fGuid + ']:checked').each(function (i) {
            cCount++;
            if (i == 0) {
                if (rObject.type == gviObjectType.gviObjectFeatureLayer ||
                    rObject.type == gviObjectType.gviObject3DTileLayer)
                    rObject.visibleMask = GetViewportMask($(this).val());
            } else {
                if (rObject.type == gviObjectType.gviObjectFeatureLayer ||
                    rObject.type == gviObjectType.gviObject3DTileLayer)
                    rObject.visibleMask |= GetViewportMask($(this).val());
            }
        });
        if (cCount == 0) {
            if (rObject.type == gviObjectType.gviObjectFeatureLayer ||
                    rObject.type == gviObjectType.gviObject3DTileLayer)
                rObject.visibleMask = gviViewportMask.gviViewNone;
        }
    }
}
// 返回视口编码
function GetViewportMask(num) {

    switch (num) {
        case '1': return gviViewportMask.gviView0; break;
        case '2': return gviViewportMask.gviView1; break;
        case '3': return gviViewportMask.gviView2; break;
        case '4': return gviViewportMask.gviView3; break;
    }
}
// 恢复fl初始显示
function RObjectRecovery(objJson) {
    if (objJson) {
        if (objJson.children) {
            var childs = objJson.children;
            for (var i = 0; i < childs.length; i++) {
                RObjectRecovery(childs[i]);
            }
        } else {
            var rObject = objectManager.getObjectById(objJson.id);
            if (rObject) {
                if (rObject.type == gviObjectType.gviObjectFeatureLayer ||
                    rObject.type == gviObjectType.gviObject3DTileLayer)
                    rObject.visibleMask = objJson.visibility == 0 ? gviViewportMask.gviViewNone : gviViewportMask.gviView0;
            }
        }
    }
}
//********************************************历史回溯
var isHistoryShow = false;
var wpHistory;
function historyShow() {
    if (!wpHistory) {
        var width = $("#__g").width();
        var height = $("#__g").height();
        wpHistory = htmlWindow.createWindowParam();
        wpHistory.filePath = Config.localPath + "html/history/historySlider.html";
        wpHistory.sizeX = Number(width)/2;
        wpHistory.sizeY = 100;
        wpHistory.hastitle = false;
        wpHistory.position = gviHTMLWindowPosition.gviWinPosParentRightTop;
        wpHistory.round = -1;
        wpHistory.hideOnClick = false;
        wpHistory.winId = 3;
        wpHistory.transparence = 200;
        wpHistory.isPopupWindow = true;
        wpHistory.resizable = false;
    }
    var layerID = projectTree.findItem(Config.historyLayer);
    var layerID2 = projectTree.findItem(Config.newLayer);

    if (!isHistoryShow) {
        projectTree.setVisibility(layerID, gviViewportMask.gviView1);
        projectTree.setVisibility(layerID2, gviViewportMask.gviView0);
        viewport.viewportMode = gviViewportMode.gviViewportL1R1SingleFrustum;
        viewport.cameraViewBindMask = gviViewportMask.gviView0 | gviViewportMask.gviView1;
        viewport.showBorderLine = true;
        htmlWindow.setWindowParam(wpHistory);
        isHistoryShow = true;
    }
    else {
        projectTree.setVisibility(layerID, gviViewportMask.gviViewAllNormalView);
        viewport.viewportMode = gviViewportMode.gviViewportSinglePerspective;
        htmlWindow.hideWindow(wpHistory.winId);
        isHistoryShow = false;
    }
    
}

// 顶视角
function view2Top() {
    var width = $("#__g").width();
    var height = $("#__g").height();

    var cameraInstance = camera.getCamera();

    __g.mouseSelectObjectMask=gviMouseSelectObjectMask.gviSelectAll;
    var centerPointPos = camera.screenToWorld(width * 0.5, height * 0.5).intersectPoint.position;
    __g.mouseSelectObjectMask=gviMouseSelectObjectMask.gviSelectNone;
    
    var oppCenterPoint = __g.new_Vector3;
    oppCenterPoint.x =centerPointPos.x;
    oppCenterPoint.set(-centerPointPos.x, -centerPointPos.y, -centerPointPos.z);

    var distance = cameraInstance.position.add(oppCenterPoint).length;

    cameraInstance.position.x = centerPointPos.x;
    cameraInstance.position.y = centerPointPos.y;
    cameraInstance.position.z = distance;

    cameraInstance.angle.tilt = -90;
    camera.setCamera(cameraInstance.position, cameraInstance.angle, gviSetCameraFlags.gviSetCameraNoFlags);
}

//恢复视图
function resetView(){
    //reset Camera Position  重置相机位置
    if(initCameraInfo) {
        camera.setCamera(initCameraInfo.position, initCameraInfo.angle, gviSetCameraFlags.gviSetCameraNoFlags);
    }

    //remove tempObject 删除临时对象，要素
    projectTree.deleteItem('22222222-2222-2222-2222-222222222222');

    //unhighlightFeature  取消高亮
    __g.featureManager.unhighlightAll();

    //reset interaction Mode 恢复交互模式
    __g.interactMode = gviInteractMode.gviInteractNormal;
    __g.mouseSelectObjectMask=gviMouseSelectObjectMask.gviSelectNone;

    //close htmlWindow 关闭htmlWindow

    //reset layers' visibility 图层显隐

    //reset viewpoet 恢复分屏
    $("#my_layout").layout('hidden', 'east');
    // 还原为初始状态
    viewport.viewportMode = gviViewportMode.gviViewportSinglePerspective;
    $(".t_list").html("");
    $(".d_measure").removeClass("d_measure_sel");
    RObjectRecovery(_jsonTree);
    isShowEast = false;
    

}
