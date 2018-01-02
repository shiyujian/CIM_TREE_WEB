/**
 *  点选查询 响应函数
 *  
 * 
 */
// 打开属性面板
function onOpenHtmlWindow(pickResult, intersectPoint) {
    if(!intersectPoint || !pickResult)
        return;
    
    if (pickResult.type == gviObjectType.gviObjectFeatureLayer) {
        var fid = pickResult.featureId;
        var fl = pickResult.featureLayer;
        console.log("Current Selected Layer Name: ", fl.name);
        console.log("Current Selected Layer FCinfo featureClassName: ", fl.featureClassInfo.featureClassName);
        console.log("Current Selected Layer FCinfo dataSetName: ", fl.featureClassInfo.dataSetName);
        fl.highlightFeature(fid, Config.selectedColor || 0xffff0000);

        var fcDataSetName = fl.featureClassInfo.dataSetName;
        switch(fcDataSetName){
            case "植树造林":
                onTreeClick(pickResult);
                break;
            // case "地块":
            //     onMassifQuery(pickResult, intersectPoint);
            //     break;
            // case "建筑":
            //     onBuildingQuery(pickResult, intersectPoint);
            //     break;
            default: 
                onPropertyQuery(pickResult);
                break;
        }
    } else if (pickResult.type == gviObjectType.gviObject3DTileLayer) {
        // 瓦片选择
       var car = camera.getCamera2();
       var len =car.position.distance3D(intersectPoint);
       //向相机方向延伸n米:n跟眼睛到交点距离有关，当距离远时n大，当距离近时n小。
       var factor = len * 0.001;
       var aimingPoint = camera.getAimingPoint2(intersectPoint, car.angle, factor);
       var sourcePoint = camera.getAimingPoint2(intersectPoint, car.angle, -factor);
   
       var intersetPolyline = __g.geometryFactory.createGeometry(gviGeometryType.gviGeometryPolyline, gviVertexAttribute.gviVertexAttributeZ);
       intersetPolyline.appendPoint(sourcePoint);
       intersetPolyline.appendPoint(aimingPoint);

        //text Polyline
        //  var templine = objectManager.createRenderPolyline(intersetPolyline,null,"11111111-1111-1111-1111-111111111111");
        // camera.flyToObject(templine.guid, 0);


       // 解析 Tilelayer中 RelationTable
        var tileLayer = pickResult.tileLayer;
        // var ret = {};
        // var ret =tileLayer.polylineIntersect(intersetPolyline, ret);
        var ret = tileLayer.polylineIntersect(intersetPolyline, {});
        var table= tileLayer.getClientData("RelationTable");
        //    var intersectPoint = ret.intersectPoint;
        var featureDataSetName = ret.featureDataSetName;
        var featureClassName = ret.featureClassName;
        var fid = ret.fid;
        var currConnectStrObj = null; // 当前拾取的图层链接信息

        console.info("ret", ret);

       //解析3DTile 对应的
       propertiesXML = "<xml>" + table + "</xml>";
       // console.log("propertiesXML", propertiesXML);
       var connectStrArray = [];
       var xmlDoc = $.parseXML(propertiesXML);
       $(xmlDoc).find("RelationData").each(function () {     //查找所有Property节点并遍历
           
            var Property = $(this);
            if(!Property){
                return;
            }
            var obj = {};
            obj.fcName = Property.find("FcName").text();
            obj.geometryFileName = Property.find("GeometryFileName").text();
            obj.connectStr = Property.find("OriginalConnectionString").text();  //获取节点的属性
            obj.fdsName = Property.find("FdsName").text();  //获取节点的属性
            // console.log("Property obj", obj);
            if(featureClassName == obj.fcName && featureDataSetName == obj.fdsName) {
                currConnectStrObj = obj;
                currConnectStrObj.fid = ret.fid;
            }
            connectStrArray.push(obj);
       });

       currConnectStrObj ? onBuildingQuery([currConnectStrObj], pickResult, null): onBuildingQuery(connectStrArray, pickResult, intersetPolyline);
       

       
    }
    
}


// 通用 属性面板
////////////////
//属性查询
////////////////
var wpPropertyQuery;
var currSelectRow = null;
function onPropertyQuery(pickResult){
    var height = $("#__g").height();
    if (pickResult == null)
        return; 
    if(pickResult.type == gviObjectType.gviObjectFeatureLayer) {
        var fid = pickResult.featureId;
        var fl = pickResult.featureLayer;
        if(!wpPropertyQuery){
            wpPropertyQuery = htmlWindow.createWindowParam();
            wpPropertyQuery.sizeX = Config.htmlWinWidth;
            wpPropertyQuery.sizeY = Number(height) + Config.htmlWinHeight;
            wpPropertyQuery.hastitle = false;
            wpPropertyQuery.position = gviHTMLWindowPosition.gviWinPosParentRightTop;
            wpPropertyQuery.round = -1;
            wpPropertyQuery.hideOnClick = false;
            wpPropertyQuery.winId = 8;
            wpPropertyQuery.transparence = 200;
            wpPropertyQuery.isPopupWindow = false;
            wpPropertyQuery.resizable = false;
            wpPropertyQuery.resetOnHide="";
        }

        wpPropertyQuery.filePath = Config.localPath + "html/property/property.html?" + new Date().getTime();
            
        try{

            var fl_conn = fl.featureClassInfo.dataSourceConnectionString;
            var fl_ds = dataSourceFactory.openDataSourceByString(fl_conn);
            var fl_fdsName = fl.featureClassInfo.dataSetName;
            var fl_fds = fl_ds.openFeatureDataset(fl_fdsName);
            var fl_fcName = fl.featureClassInfo.featureClassName;
            var fl_fc = fl_fds.openFeatureClass(fl_fcName);
            currSelectRow = fl_fc.getRow(fid);
        }catch(e){
            console.log("citymaker error:", e);
        }

        htmlWindow.setWindowParam(wpPropertyQuery);
    }
   
}



 ////////////////
// 树木 价格 属性面板
////////////////
var wpTree;
var treePropertyObj = {id:null, name:null};
//隐藏树属性框并清除树高亮
function hideTreeWP() {
    if (wpTree) {
        __g.featureManager.unhighlightAll();
        treePropertyObj.id = null;
        treePropertyObj.name = null;
        htmlWindow.hideWindow(wpTree.winId);
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
                fl.highlightFeature(fid,Config.selectedColor || 0xffff0000);
                    

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


 //地块点击事件
function onMassifQuery(pickResult, intersectPoint) {
    hideTableLabel();
    if (pickResult != null && pickResult.type == gviObjectType.gviObjectFeatureLayer) {
        var fid = pickResult.featureId;
        var fl = pickResult.featureLayer;

        Config.massifName.map(function (name, i) {
            if (fl.name == name) {
                {//查询
                    fl.highlightFeature(fid, Config.selectedColor || 0xffff0000); 
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
//倾斜查询
////////////////
var isBuilding = false;
var wpBuilding;
function onBuildingQuery(connectStrArray, pickResult, intersetPolyline){
    {
        highlightHelper && highlightHelper.setRegion(null);
    }
    try{
        //
        currSelectRow = findAndCreateResult(connectStrArray, intersetPolyline);

    }catch(e){
        console.log("onBuildingQuery","打开数据源出错");
    }

    var height = $("#__g").height();
    if(!wpBuilding){
        wpBuilding = htmlWindow.createWindowParam();
        wpBuilding.sizeX = Config.htmlWinWidth;
        wpBuilding.sizeY = Number(height) + Config.htmlWinHeight;
        wpBuilding.hastitle = false;
        wpBuilding.position = gviHTMLWindowPosition.gviWinPosParentRightTop;
        wpBuilding.round = -1;
        wpBuilding.hideOnClick = false;
        wpBuilding.winId = 8;
        wpBuilding.transparence = 200;
        wpBuilding.isPopupWindow = false;
        wpBuilding.resizable = false;
        wpBuilding.resetOnHide="";
    }

    wpBuilding.filePath = Config.localPath + "html/property/property.html?" + new Date().getTime();

    // 弹窗
    if(wpBuilding){
        // wpBuilding.filePath = Config.localPath + 'html/building/building.html?t=' + new Date().getTime();
        htmlWindow.setWindowParam(wpBuilding);
    }

}

  // 查找并显示 点选的结果
  var tempResultGroup;
  function findAndCreateResult(fcStrings,intersetPolyline) {

    var dataSrouceFactory = __g.dataSourceFactory;
    for (var i = 0; i < fcStrings.length; i++) {
        var fcStr = fcStrings[i];
        var conn = fcStr.connectStr;
        var fcName = fcStr.fcName;
        var setName = fcStr.fdsName;
        var geoFieldName = fcStr.geometryFileName;

        try{
            //console.log("conn",conn);
            var ds = dataSrouceFactory.openDataSourceByString(conn);
            //console.log("ds",ds);
            var set = ds.openFeatureDataset(setName);
            //console.log("set",set);
            var fc = set.openFeatureClass(fcName);
            //console.log("fc",fc);
            
            // 清除临时对象
            if(tempResultGroup) {
                projectTree.deleteItem(tempResultGroup);
            }

            tempResultGroup = projectTree.createGroup('tempGeometry','22222222-2222-2222-2222-222222222222');
            console.log("tempResultGroup ",tempResultGroup);

            //存在fid
            var result;
            if(fcStr.fid){
                
                result = fc.getRow(fcStr.fid);
                var geometryIndex = result.fieldIndex(geoFieldName);
                var geometry = result.getValue(geometryIndex);

                showResultsFeatures(geometry, Config.selectedColor || 0xffff0000, tempResultGroup, set);

            } else {
                // 如果没有 ret
                result = getResult(fc, intersetPolyline, geoFieldName);

            }
            return result;

        } catch(e){
            console.log('findAndCreateResult error: ', e);
        }
        
    }
    return null;
}
//综合查询
function getResult(fc, geometry, geometryField) {
    if(!fc || !geometry || !geometryField){
        console.log("getResult 缺失参数");
        return null;
    }

    var filter = null;
    // console.log("geometry",geometry);
    if (geometry) {
        filter = __g.new_SpatialFilter;
        filter.geometry = geometry;
        filter.spatialRel = gviSpatialRel.gviSpatialRelEnvelope;
        filter.geometryField = geometryField;
        filter.resultBeginIndex = 0;
        filter.resultLimit =200;
    } else {
        return null;
    }

    // 查询的结果集合
    try{

        var cursor = fc.search(filter, true);

        // 存储当前选中的要素的oid

        if (cursor) {
            var  indexGeometry = cursor.findField(geometryField);
            // console.log("indexGeometry ",indexGeometry);

            var row = null;
            while ((row = cursor.nextRow())) {
                
                if(indexGeometry !== -1) {
                    var geo = row.getValue(indexGeometry);

                    // show results
                    var renderObj = showResultsFeatures(geo, Config.selectedColor || 0xffff0000, tempResultGroup);

                    // 将渲染对象的GUID存入obj中
                    if(renderObj){
                        //设置最大可视距离
                        renderObj.maxVisibleDistance = 9000000;
                        
                        // highlightHelper && highlightHelper.setRegion(renderObj.symbol);
                    }
                }
                currSelectRow = row;
                return currSelectRow
            }
        }

    }catch(e){
        console.log("search error", e);
    }

    return currSelectRow;
}

 // 在三维场景中显示查询的结果
 var _tempResultFeatureLayer;
 function showResultsFeatures(geo,color,group, featureDataSet){
     // console.log("geometry type ",geo.geometryType);
     if(!geo || !group) {
         return null;
     }
     var symbol = null;
     switch(geo.geometryType){
         case gviGeometryType.gviGeometryPoint : 
             symbol =  __g.new_SimplePointSymbol;
             symbol.color = color;
             return objectManager.createRenderPoint(geo,symbol,group);

         case gviGeometryType.gviGeometryPOI:
             return objectManager.createRenderPOI(geo);

         case gviGeometryType.gviGeometryModelPoint :
                symbol =  __g.new_ModelPointSymbol;
                symbol.color = color;
                symbol.enableColor = true;
                symbol.setResourceDataSet(featureDataSet);
                var tempModelPoint = objectManager.createRenderModelPoint(geo,symbol,group);
                tempModelPoint.depthTestMode = gviDepthTestMode.gviDepthTestDisable;                
                return tempModelPoint;
             break;

         case gviGeometryType.gviGeometryLine : 
             break;

         case gviGeometryType.gviGeometryPolyline :
             symbol =  __g.new_CurveSymbol;
             symbol.color = color;
             return objectManager.createRenderPolyline(geo,symbol,group);

         case gviGeometryType.gviGeometryMultiPolyline :
             symbol =  __g.new_CurveSymbol;
             symbol.color = color;
             return objectManager.createRenderMultiPolyline(geo,symbol,group);

         case gviGeometryType.gviGeometryPolygon : 
             symbol =  __g.new_SurfaceSymbol;
             symbol.color = color;
             var tempPolygon = objectManager.createRenderPolygon(geo,symbol,group);
             tempPolygon.depthTestMode = gviDepthTestMode.gviDepthTestDisable; 
             tempPolygon.heightStyle = gviHeightStyle.gviHeightOnEverything;
             return tempPolygon;

         case gviGeometryType.gviGeometryMultiPolygon :
             symbol =  __g.new_SurfaceSymbol;
             symbol.color = color;
             return objectManager.createRenderMultiPolygon(geo,symbol,group);

         default: break;
     }
     return null;
 }