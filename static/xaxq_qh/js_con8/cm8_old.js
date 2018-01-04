
/////////////////全局变量
var Config = {
    localPath: "http://192.168.3.33/",
    fileCachePath: "C:\\Gvitech\\CM3DGIS\\",
    GHMX: "规划模型\\地面建筑",
    initLocation: "场景组\\雄安新区",
    port: "8080",
    selectLayerName:"规划矢量\\规划地块",
    fieldIndex:5,
    cep: window.parent.config.WJH_CEP,
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
var flag_Presentation = false;
var SelectFC;


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

//加载cep
function initAndLoad() {
    __g = document.getElementById("__g");
    try {
        //全局变量赋值
        project = __g.project;
        __g.pauseRendering(false)
        project.open(Config.cep, false, "");
        cacheManager = __g.cacheManager;
        projectTree = __g.projectTree;
        objectManager = __g.objectManager;
        camera = __g.camera;
        htmlWindow = __g.htmlWindow;
        __rootId = projectTree.rootID;
        projectTree.showSlide=true;
    }
    catch (err) {
        if (__g.objectManager) { //fjm-2017-11-09
            alert("初始化失败");
        }
        else {
            if (window.parent.config != undefined) {
                window.location.href = window.parent.config.WJH_CITY_MARKER;
            }
            else {
                window.location.href = 'http://192.168.3.33:6512/media/documents/meta/CityMaker_IE_Plugin_vConnect0904.exe';
            }
            alert("请下载安装runtime");
            setTimeout(function () { layer.close(layer_index); }, 100);
            return;
        }
    }
    setToolBar();
    initControlEvents(__g);

    //设置缓存
    cacheManager.fileCacheEnabled = true;
    cacheManager.fileCachePath = Config.fileCachePath;
    cacheManager.fileCacheSize = -1;
    setTimeout(function () {
        layer.close(layer_index);
        $("#__g").width($(window).width() * 1);
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
//设置工具条及点击事件
function setToolBar() {
    //设置工具栏点击事件
    $("#toolBar div span").click(function () {
        $("#toolBar div span").css("background-color", "#ffffff");
        $(this).css("background-color", "#30b1d5");
    });
    $("#toolBar").width($(window).width());
    $("#cityMaker").height($(window).height() - 32);
    $("#btnLocation").click(function () {
        //回到初始位置
        var id = projectTree.findItem(Config.initLocation);
        var obj = objectManager.getObjectById(id);
        if (obj) {
            if (obj.type == gviObjectType.gviObjectPresentation) {
                obj.guid.play(0);
            }
        }
    });
    $("#btnSelect").click(function () {
        //选择查看属性文档
        if (__g.interactMode != gviInteractMode.gviInteractSelect) {
            __g.interactMode = gviInteractMode.gviInteractSelect;
        }
        __g.mouseSelectObjectMask = gviMouseSelectObjectMask.gviSelectAll;
    });
    $("#btnWalk").click(function () {
        if (__g.interactMode != gviInteractMode.gviInteractWalk) {
            __g.interactMode = gviInteractMode.gviInteractWalk;
        } else {
            __g.interactMode = gviInteractMode.gviInteractNormal;
        }
    });
    $("#btnMove").click(function () {
        __g.interactMode = gviInteractMode.gviInteractNormal;
    });
    $("#btnZoomIn").click(function () {
        camera.zoomOut(0);
    });
    $("#btnZoomOut").click(function () {
        camera.zoomIn(0);
    });
    $("#btnUnDo").click(function () {
        camera.undo();
    });
    $("#btnReDo").click(function () {
        camera.redo();
    });
    $("#btnMeasure").click(function () {
        if (__g.interactMode != gviInteractMode.gviInteractMeasurement) {
            __g.interactMode = gviInteractMode.gviInteractMeasurement;
            __g.measurementMode = gviMeasurementMode.gviMeasureAerialDistance;
        } else {
            __g.interactMode = gviInteractMode.gviInteractNormal;
        }
    });
    $("#btnWeather0").click(function () {
        var skyboxObj = objectManager.getSkyBox(0);
        skyboxObj.weather = gviWeatherType.gviWeatherSunShine;
    });
    $("#btnWeather1").click(function () {
        var skyboxObj = objectManager.getSkyBox(0);
        skyboxObj.weather = gviWeatherType.gviWeatherLightRain;
    });
    $("#btnWeather2").click(function () {
        var skyboxObj = objectManager.getSkyBox(0);
        skyboxObj.weather = gviWeatherType.gviWeatherHeavyRain;
    });
    $("#btnWeather3").click(function () {
        var skyboxObj = objectManager.getSkyBox(0);
        skyboxObj.weather = gviWeatherType.gviWeatherLightSnow;
    });
    $("#btnWeather4").click(function () {
        var skyboxObj = objectManager.getSkyBox(0);
        skyboxObj.weather = gviWeatherType.gviWeatherHeavySnow;
    });
    $("#btnClipPlane").click(function () {
        if (__g.interactMode != gviInteractMode.gviInteractClipPlane || __g.clipMode != gviClipMode.gviClipCustomePlane) {
            __g.interactMode = gviInteractMode.gviInteractClipPlane; //开启剖切模式
            __g.clipMode = gviClipMode.gviClipCustomePlane; //设置为面剖切模式
        } else {
            __g.interactMode = gviInteractMode.gviInteractNormal;
        }
    });
    $("#btnClipPlaneB").click(function () {
        if (__g.interactMode != gviInteractMode.gviInteractClipPlane || __g.clipMode != gviClipMode.gviClipBox) {
            __g.interactMode = gviInteractMode.gviInteractClipPlane;
            __g.clipMode = gviClipMode.gviClipBox; //设置为体剖切模式
        } else {
            __g.interactMode = gviInteractMode.gviInteractNormal;
        }
    });
    $("#btnPresentation").click(function () {
        __g.interactMode = gviInteractMode.gviInteractNormal;
        if (flag_Presentation) {
            projectTree.showSlide = !flag_Presentation;
        } else {
            projectTree.showSlide = !flag_Presentation;
        }
        flag_Presentation = !flag_Presentation;
    });
    $("#btnFullScreen").click(function () {
        __g.fullScreen = !__g.fullScreen;
        /*
        if (__g.fullScreen) {
            if (buttons.length == 0) {
                loadButtons();
            }
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].isVisible = true;
            }
        } else {
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].isVisible = false;
            }
        }
        */
    });
    //cep工程树
    $("#btnProjectTree").click(function () {
        $('#treepanle1').height($(window).height() - 32);
        $('#treepanle').height($(window).height() - 32);
        if ($("#treepanle").is(":hidden")) {
            if ($('#treepanle').html() == "") {
                loadProjectTreeEx();
                treeOperation();
            }
            $("#leftTree").width($(window).width() * 0.12 - 5);
            $("#__g").width($(window).width() * 0.88);
            $('#treepanle1').hide();
            $('#treepanle').show();
            $("#leftTree").show();
        } else {
            $("#__g").width($(window).width());
            $("#leftTree").hide();
        }
    });
    //业务树
    $("#btnTree").click(function () {
        $('#treepanle1').height($(window).height() - 32);
        $('#treepanle').height($(window).height() - 32);
        if ($("#treepanle1").is(":hidden")) {
            if (json_code == null) {
                $.ajax({
                    type: "GET",
                    url: "http://192.168.3.33:6530/service/construction/api/loc-tree/code/Q01G/?DEPTH=5",
                    dataType: 'json',
                    success: function (data) {
                        if (data) {
                            json_code = data;
                        }
                    },
                    error: function (e, x) {
                        console.log(e.responseText);
                    }
                });
            }
            if ($('#treepanle1').html() == "") {
                loadTree();
                treeOperation1()
            }
            $("#leftTree").width($(window).width() * 0.12 - 5);
            $("#__g").width($(window).width() * 0.88);
            $('#treepanle').hide();
            $('#treepanle1').show();
            $("#leftTree").show();
        } else {
            $("#__g").width($(window).width());
            $("#leftTree").hide();
        }
    });
    $("#btnCenterLocation").click(function () {
        __g.interactMode = gviInteractMode.gviInteractFocusPoint; //进入焦点模式
    });
}

/*
//全屏时按钮
var buttons = new Array();
function loadButtons() {
    var arr = ["图层树"];
    var rect = __g.new_UIRect;
    for (var i = 0; i < arr.length; i++) {
        rect.init(0, 10 + (42 * i), 0, 10, 0, 42 + (42 * i), 0, 42);
        var manager = __g.uiWindowManager;
        var button1 = manager.createImageButton();
        button1.setArea(rect);
        button1.name = arr[i];
        button1.isVisible = true;
        button1.normalImage = Config.localPath + "/images/高亮.png";
        button1.hoverImage = Config.localPath + "/images/高亮.png";
        button1.pushedImage = Config.localPath + "/images/高亮.png"; //服务器上路径要加/0518
        button1.subscribeEvent(gviUIEventType.gviUIMouseClick);
        button1.toolTipText = arr[i];
        buttons.push(button1);
    }
}
*/

var myJson_tree = null;
var wp_tree = null;
var flag_tree = false;
function onUIWindowEvent(args, type) {
    if (args.uiWindow == null) {
        return;
    }
    if (type == gviUIEventType.gviUIMouseClick) {
        if (args.uiWindow.type == gviUIWindowType.gviUIImageButton) {
            switch (args.uiWindow.name) {
                case "图层树":
                    var json_tree = projectTree.traverse();
                    json_tree = json_tree.replace(/\n/g, "").replace(/ /g, "");
                    myJson_tree = eval('([' + json_tree + '])');
                    if (flag_tree) {//生成树控件
                        htmlWindow.hideWindow(1);
                    }
                    else {
                        if (wp_tree == null) {
                            wp_tree = htmlWindow.createWindowParam();
                            wp_tree.filePath = Config.localPath + "index.html"; //path + "/0518/html/standardData1.html";
                            wp_tree.sizeX = 250;
                            wp_tree.sizeY = $("#cityMaker").height() - 120;
                            wp_tree.offsetX = 8;
                            wp_tree.offsetY = 130;
                            wp_tree.hastitle = false;
                            wp_tree.position = gviHTMLWindowPosition.gviWinPosUserDefined;
                            wp_tree.round = 10;
                            wp_tree.isPopupWindow = false;
                            wp_tree.winId = 1;
                            wp_tree.hideOnClick = false;
                            wp_tree.minButtonVisible = true;
                            wp_tree.closeButtonEnabled = true;
                            wp_tree.transparence = 200;
                            wp_tree.resetOnHide = false;
                            htmlWindow.setWindowParam(wp_tree);
                            flag_tree = true;
                        }
                        else {
                            htmlWindow.setWindowSize(-1, -1, 1);
                        }
                    }
                    flag_tree = !flag_tree;
                    break;
            }
        }
    }
}

var json_code = null;
function onMouseClickSelect(pickResult, intersectPoint, mask, eventSender) {
    return;
    if (__g.interactMode == gviInteractMode.gviInteractNormal) {
        unhighlightAll();
        return;
    }
    if (pickResult != null && pickResult.type == gviObjectType.gviObjectFeatureLayer) {

        var oid = pickResult.featureId;
        if (!SelectFC) {
            var fl = pickResult.featureLayer;
            var fc = getFCByFL(fl);
            SelectFC = fc;
        }
        var row = SelectFC.getRow(oid);
        var code= row.getValue(Config.fieldIndex);
        var wp = htmlWindow.createWindowParam();
        wp.filePath = Config.localPath + "index.html?code="+code;
        wp.sizeX = 350;
        wp.sizeY = 600;
        wp.resizable = false;
        wp.hastitle = false;
        wp.position = gviHTMLWindowPosition.gviWinPosParentRightTop;
        wp.round = 0;
        wp.isPopupWindow = false;
        wp.hideOnClick = true;
        wp.winId = 1;
        wp.minButtonVisible = true;
        wp.closeButtonEnabled = true;
        wp.transparence = 200;
        htmlWindow.setWindowParam(wp);
    }
}

function treeOperation() {
    //////复选框事件///////
    $('#treepanle').tree({
        onCheck: function (node) {
            if (node.checked) {
                projectTree.setVisibility(node.id, 0);
            } else {
                projectTree.setVisibility(node.id, 255);
            }
        }
    });
    //////双击事件////////
    $('#treepanle').tree({
        onDblClick: function (node) {
            if (!projectTree.isGroup(node.id) || node.id == 1) {
                if (node.id == 1) {
                    __g.terrain.flyTo(gviTerrainActionCode.gviJumpToTerrain);
                } else {
                    switch (objectManager.getObjectById(node.id).type) {
                        case gviObjectType.gviObjectFeatureLayer:
                            camera.flyToObject(node.id, gviActionCode.gviActionFlyTo);
                            break;
                        case gviObjectType.gviObject3DTileLayer:
                            camera.flyToObject(node.id, gviActionCode.gviActionFlyTo);
                            break;
                        case gviObjectType.gviObjectRenderModelPoint:
                            camera.flyToObject(node.id, gviActionCode.gviActionFlyTo);
                            break;
                        case gviObjectType.gviObjectPresentation:
                            objectManager.getObjectById(node.id).play(0);
                            break;
                        case gviObjectType.gviObjectTerrainLocation:
                            var camposition = objectManager.getObjectById(node.id).position;
                            var camPnt = __g.geometryFactory.createPoint(gviVertexAttribute.gviVertexAttributeZ);
                            camPnt.setCoords(camposition.x, camposition.y, camposition.altitude, 0, 0);
                            var cameulerAngle = __g.new_EulerAngle;
                            cameulerAngle.set(camposition.heading, camposition.tilt, camposition.roll);
                            camera.lookAt2(camPnt, camposition.distance, cameulerAngle);
                            camera.flyTime = 0;
                            break;
                        case gviObjectType.gviObjectClipPlaneOperation:
                            objectManager.getObjectById(node.id).execute();
                            break;
                    }
                }
            }
        }
    });
}

var strTree = "";
function eachTree(data) {
    if (data.children != null) {
        strTree += "{'id': '" + data.code + "', 'text':'" + data.name + "','children':[";
        var flag_haschild = false;
        for (var i = 0; i < data.children.length; i++) {
            flag_haschild = true;
            eachTree(data.children[i]);
        }
        if (flag_haschild)
            strTree = strTree.substring(0, strTree.length - 1) + "]},";
        else
            strTree = strTree + "]},";
    } else {
        strTree += "{ 'id': '" + data.code + "', 'text':'" + data.name + "' },";
    }
}
var myJson;
function loadTree() {
    if (myJson == null) {
        $.ajax({
            type: "GET",
            url: "http://192.168.3.33:6530/service/construction/api/loc-tree/code/Q01G/?DEPTH=5 ",
            dataType: 'json',
            success: function (data) {
                if (data) {
                    strTree = "[";
                    json_code = data;
                    eachTree(json_code);
                    strTree = strTree.substring(0, strTree.length - 1).replace(/[\n]/ig, '').replace(/[\r\n]/g, "") + "]";
                    myJson = eval('(' + strTree + ')');
                }
                $('#treepanle1').tree({
                    data: myJson,
                    checkbox: false,
                    animate: true,
                    cascadeCheck: true,
                    onlyLeafCheck: false
                });
            },
            error: function (e, x) {
                alert(e.responseText);
            }
        });
    } else {
        $('#treepanle1').tree({
            data: myJson,
            checkbox: false,
            animate: true,
            cascadeCheck: true,
            onlyLeafCheck: false
        });
    }
}
function treeOperation1() {
    //////双击事件////////
    $('#treepanle1').tree({
        onDblClick: function (node) {
        }
    });
}

//通过fl  获取到fc等信息
function getFCByFL(fl) {
    var c = fl.featureClassInfo.dataSourceConnectionString;
    var setName = fl.featureClassInfo.dataSetName;
    var fcName = fl.featureClassInfo.featureClassName;
    var ds = __g.dataSourceFactory.openDataSourceByString(c);
    var fds = ds.openFeatureDataset(setName);
    var fc = fds.openFeatureClass(fcName);
    return fc;
}
//重写加载工程树
function loadProjectTreeEx() {
    var sss = projectTree.traverse();
    sss = sss.replace(/name/g, 'text');
    sss = sss.replace(/ /g, '');
    sss = sss.replace(/\/n/g, '');
    sss = sss.replace(/visibility/g, 'checked');
    sss = sss.replace(/\n/g, '');
    sss = sss.replace(/\"/g, "'");
    sss = sss.replace(/:0}/g, ":false}");
    sss = sss.replace(/:1}/g, ":true}");
    sss = sss.replace(/:2}/g, ":false}");
    sss = sss.replace(/,'checked'/g, ",'state':'closed','checked'");
    var jsonobj = eval('(' + sss + ')');
    $('#treepanle').tree({
        data: jsonobj.children
    });
}
function flyToObject(node) {
    if (!projectTree.isGroup(node.id) || node.id == 1) {
        if (node.id == 1) {
            __g.terrain.flyTo(gviTerrainActionCode.gviJumpToTerrain);
        } else {
            switch (objectManager.getObjectById(node.id).type) {
                case gviObjectType.gviObjectFeatureLayer:
                    camera.flyToObject(node.id, gviActionCode.gviActionFlyTo);
                    break;
                case gviObjectType.gviObject3DTileLayer:
                    camera.flyToObject(node.id, gviActionCode.gviActionFlyTo);
                    break;
                case gviObjectType.gviObjectRenderModelPoint:
                    camera.flyToObject(node.id, gviActionCode.gviActionFlyTo);
                    break;
                case gviObjectType.gviObjectPresentation:
                    objectManager.getObjectById(node.id).play(0);
                    break;
                case gviObjectType.gviObjectTerrainLocation:
                    var camposition = objectManager.getObjectById(node.id).position;
                    var camPnt = __g.geometryFactory.createPoint(gviVertexAttribute.gviVertexAttributeZ);
                    camPnt.setCoords(camposition.x, camposition.y, camposition.altitude, 0, 0);
                    var cameulerAngle = __g.new_EulerAngle;
                    cameulerAngle.set(camposition.heading, camposition.tilt, camposition.roll);
                    camera.lookAt2(camPnt, camposition.distance, cameulerAngle);
                    camera.flyTime = 0;
                    break;
                case gviObjectType.gviObjectClipPlaneOperation:
                    objectManager.getObjectById(node.id).execute();
                    break;
            }
        }
    }
}
