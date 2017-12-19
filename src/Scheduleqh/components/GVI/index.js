import React, {Component} from 'react';

import {
	gviSkyboxImageIndex,
	gviMouseSelectObjectMask,
	gviInteractMode,
	gviMouseSelectMode,
	gviDataSetType
} from './constant';

class GVI extends Component {

	static propTypes = {};

	render() {
		return (
			<div>
				<div id="toolPlay1" style="float:left;width:100%;height:50px;">
					<a id="btnZoomIn" href="javascript:void(0)"
					   class="icon-play" style="float:left;" title="缩小"></a>
					<a id="btnZoomOut" href="javascript:void(0)"
					   class="icon-play" style="float:left;" title="放大"></a>
					<a id="btnFullScreen" href="javascript:void(0)"
					   class="icon-play" style="float:left;" title="全屏"></a>
					<a id="btnSelect" href="javascript:void(0)"
					   class="icon-play" style="float:left;" title="选择模式"></a>
					<a id="btnMove" href="javascript:void(0)" class="icon-play"
					   style="float:left;" title="漫游模式"></a>
				</div>
				<div
					style="float:left;width:100%;height:300px;overflow: hidden;">
					<object ref="__g" type="application/x-cm-3d" width="100%"
							height="100%"/>
				</div>
				<div id="toolPlay" style="float:left;width:100%;height:50px;">
					<div style="margin-top:-2px;height: 25px; line-height: 25px;
               width: 150px; float: left;  color: #000000;float:left;">
						当前时间：<input id="datenow" placeholder="2017/03/23"
									readOnly style="width:80px"/>
					</div>
					<div style="margin-top:-15px;height: 25px; line-height: 25px;
               width: 200px; color: #000000;float:left;">
						<input id="datescroll" type="range"
							   onInput="scrollchange(this.value)"
							   onChange="scrollchange(this.value)"
							   style="width:200px;height:20px" value="0"/>
					</div>
					<div style="margin-top:-2px;height: 25px; line-height: 25px; border-right: 1px solid #a1a1a1; border-bottom: 1px solid #a1a1a1;
                        width: 150px; float: left;  color: #000000;float:left;">
						开始时间：<input id="startdate" type="text"
									placeholder="2015-10" readOnly
									style="width:80px"/>
					</div>
					<div style="margin-top:-2px;height: 25px; line-height: 25px; width: 150px; float: left; border-bottom: 1px solid #a1a1a1;
                       color: #000000;float:left;">
						结束时间：<input id="enddate" type="text"
									placeholder="2016-10" readOnly
									style="width:80px"/>
					</div>
					<div style="float:left;margin-top:-2px">间隔<input
						id="stepTime" placeholder="1" style="width:20px;"
						type="text" value="1"/>秒|
					</div>
					<div style="float:left;margin-top:-2px">步长<input
						id="stepLength" placeholder="1" style="width:20px;"
						type="text" value="1"/>天
					</div>
					<div id="btnPlay" className="icon-play"
						 style="float:left;background-color:aqua" title="播放">播放
					</div>
					<div id="btnStop" className="icon-stop"
						 style="float:left;background-color:aqua" title="停止">停止
					</div>
				</div>
				<div style="width: 100%; height: 270px; float: left; overflow-y:auto;
                 position: relative;">
					<table className="bordered" style="overflow:auto"/>
				</div>
			</div>);
	}

	componentDidMount() {
		this.__g = this.refs.__g;
		this.__g.initialize(true, null);
		this.camera = this.__g.camera;
		this.objectManager = this._g.objectManager;
		this.load();
	}

	load() {
		const __g = this.__g;
		//var b = __g.project.open("D:\\2017\\杭州华东勘测院\\itwo_web_th_offline\\data\\90.cep", true, "");
		const localPath = 'D:\\2017\\杭州华东勘测院\\itwo_web_th_offline\\data\\data\\';

		this.opendatabase(localPath + '时态测试-30.FDB');
		const position = __g.new_Vector3;
		var angle = __g.new_EulerAngle;
		position.set(97278.13168359932, 17273.514933748716, 1359.6293901102292);
		angle.heading = 36.84;
		angle.tilt = -52;
		this.camera.setCamera(position, angle,
			gviSetCameraFlags.gviSetCameraNoFlags);

		//opendatabase(localPath + "333.FDB");
		////eachCep("11111111-1111-1111-1111-111111111111", 0);
		const skyboxObj = this.objectManager.getSkyBox(0);
		skyboxObj.setImagePath(gviSkyboxImageIndex.gviSkyboxImageBack,
			localPath + '/1_BK.png');
		skyboxObj.setImagePath(gviSkyboxImageIndex.gviSkyboxImageBottom,
			localPath + '/1_DN.png');
		skyboxObj.setImagePath(gviSkyboxImageIndex.gviSkyboxImageFront,
			localPath + '/1_FR.png');
		skyboxObj.setImagePath(gviSkyboxImageIndex.gviSkyboxImageLeft,
			localPath + '/1_LF.png');
		skyboxObj.setImagePath(gviSkyboxImageIndex.gviSkyboxImageRight,
			localPath + '/1_RT.png');
		skyboxObj.setImagePath(gviSkyboxImageIndex.gviSkyboxImageTop,
			localPath + '/1_UP.png');
		__g.mouseSelectObjectMask = gviMouseSelectObjectMask.gviSelectAll;
		__g.interactMode = gviInteractMode.gviInteractSelect;
		__g.mouseSelectMode = gviMouseSelectMode.gviMouseSelectClick;
		__g.onmouseclickselect = this.selectsearch;
	}

	opendatabase(path) {
		const __g = this.__g;
		const tm_data = __g.new_ConnectionInfo;
		tm_data.connectionType = 3;
		tm_data.database = path;
		tm_data.userName = '';
		tm_data.password = '';
		const ds = __g.dataSourceFactory.openDataSource(tm_data);
		const setnames = ds.getFeatureDatasetNames();
		if (setnames.length == 0)
			return;
		const keyDatetimesList = new Array();

		for (var i = 0; i < setnames.length; i++) {
			var fs = ds.openFeatureDataset(setnames[i]);
			var fcnames = fs.getNamesByType(
				gviDataSetType.gviDataSetFeatureClassTable);
			if (fcnames.length == 0)
				continue;
			for (var j = 0; j < fcnames.length; j++) {
				var fc = fs.openFeatureClass(fcnames[j]);
				mapFC.add(fc.guid, fc);
			}
		}

		for (var l = 0; l < mapFC.length(); l++) {
			var fc = mapFC.values()[l];
			featureLayer = __g.objectManager.createFeatureLayer(fc, 'Geometry',
				null, null, '');
			featureLayer.maxVisibleDistance = 300000000;
			if (featureLayer == null)
				continue;
			featureLayer.enableTemporal = true;
			mapFL.add(fc.guid, featureLayer);

			__g.camera.flyToObject(featureLayer.guid, 0);
		}
	}

	selectsearch(pickResult) {
		if (pickResult == null) {
			return;
		}
		try {
			__g.featureManager.unhighlightAll();
			// document.getElementById("row_"+flag_fid).style.backgroundColor="white";
			if (pickResult != null) {
				if (pickResult.type == gviObjectType.gviObjectFeatureLayer) {

					$('.bordered tr').css('background', '#ffffff');
					$('.bordered tr').addClass('bordered_tr');
					$('#row_' + pickResult.featureId).css('background', '#ccc');
					if (glowguid != null) {
						__g.objectManager.deleteObject(glowguid);
					}
					for (var i = 0; i < len; i++) {
						var fc = mapFC.values()[i];

						var fdeRow = fc.getRow(pickResult.featureId);
						var index = fdeRow.fieldIndex('Geometry');
						var geo = fdeRow.getValue(index);
						var symbol = __g.new_ModelPointSymbol;
						symbol.setResourceDataSet(fc.featureDataSet);
						var rmp = __g.objectManager.createRenderModelPoint(geo,
							symbol, '11111111-1111-1111-1111-111111111111');
						rmp.glow(2000);
						glowguid = rmp.guid;
					}
				}
			}
		} catch (ex) {

		}
	}

	getFCByFL(fl) {
		var c = fl.featureClassInfo.dataSourceConnectionString;
		var setName = fl.featureClassInfo.dataSetName;
		var fcName = fl.featureClassInfo.featureClassName;
		var ds = __g.dataSourceFactory.openDataSourceByString(c);
		var fds = ds.openFeatureDataset(setName);
		var fc = fds.openFeatureClass(fcName);
		return fc;
	}

	eachCep(rootID, parentid) {
		var object = __g.objectManager.getObjectById(rootID);
		if (object != undefined) {
			if (object.type == gviObjectType.gviObjectFeatureLayer) {
				var fcInfo = object.featureClassInfo;
				var key = fcInfo.dataSourceConnectionString + '-' + fcInfo.dataSetName + '-' + fcInfo.featureClassName;
				key = key.replace("//", "////");
				if (!mapFC.Exists(key)) {
					object.enableTemporal =true;
					mapFL.add(key,object);
					var fc = this.getFCByFL(object);
					mapFC.add(key, fc);
				}
			}
		}
		var ztreeFirstChild = __g.projectTree.getNextItem(rootID, 11);
		if (ztreeFirstChild != "00000000-0000-0000-0000-000000000000") {
			this.eachCep(ztreeFirstChild, rootID);
		}
		var siblingID = __g.projectTree.getNextItem(rootID, 13);
		if (siblingID != "00000000-0000-0000-0000-000000000000") {
			this.eachCep(siblingID, parentid);
		}
	}

	ExchangeModelStatus(key, ids, color) {
		var value = mapFC.getItem((key + "").trim());
		__g.featureManager.highlightFeatures(value, ids, color);
	}

	zoomIn() {
		this.camera.zoomIn(0);
	}

	zoomOut() {
		this.camera.zoomOut(0);
	}

	fullScreen() {
		this.__g.fullScreen = !this.__g.fullScreen;
	}

	select() {
		// todo gviInteractMode define
		__g.interactMode = gviInteractMode.gviInteractSelect;
	}

	move() {
		__g.interactMode = gviInteractMode.gviInteractNormal;
	}

	play() {
		// todo set play state
		document.getElementById('datescroll').value = 0;
		if (playHandler == null) {
			var stepTime = getstepTime();
			if (stepTime == null || stepTime == '') {
				stepTime = 1;
			}
			i_listData_temp = 1;
			playHandler = setInterval(() => {
				this.next();
			}, stepTime * 1000);//开启速度
			playHandler2 = setInterval(() => {
				this.changeScroll();
			}, stepTime * 1000);//开启速度
		}
	}

	next() {
		var stepLength = getstepLength();
		if (stepLength == null || stepLength == '') {
			stepLength = 1;
		}
		if (stepLength > 1) {
			if (i_listData_temp + stepLength < listData_temp.length) {
				var arr = [];
				for (var i = 0; i < stepLength; i++) {
					arr.push(i_listData_temp + i);
				}
				search_arr(arr);
				i_listData_temp = i_listData_temp + stepLength;
				var strTime = listData_temp[i_listData_temp].结束;
				setTime(strTime);
			} else {
				if (i_listData_temp + 1 != listData_temp.length) {
					var arr = [];
					for (var i = 0; i <
					listData_temp.length - i_listData_temp - 1; i++) {
						arr.push(listData_temp.length - i);
					}
					search_arr(arr);
					i_listData_temp = listData_temp.length - 1;
					var strTime = listData_temp[i_listData_temp].结束;
					setTime(strTime);
				}
				clearInterval(playHandler);
				clearInterval(playHandler2);
				playHandler = null;
				playHandler2 = null;
			}
		} else {
			if (i_listData_temp < listData_temp.length) {
				search(i_listData_temp);
				var strTime = listData_temp[i_listData_temp].结束;
				setTime(strTime);
				i_listData_temp++;
			} else {
				clearInterval(playHandler);
				clearInterval(playHandler2);
				playHandler = null;
				playHandler2 = null;
			}
		}
	}

	changeScroll() {
		var oIpt = document.getElementById('datescroll');
		var oTime = document.getElementById('datenow');
		var stepLength = getstepLength();
		oIpt.value = parseFloat(oIpt.value) + 4 * stepLength;
		oTime.value = getTimeNow(oIpt.value);
		if (parseFloat(oIpt.value) >= 100) {
			oIpt.value = 100;
		}
	}

	stop() {
		var strTime = listData_temp[0].开始;
		setTime(strTime);
		document.getElementById('datescroll').value = 0;
		clearInterval(playHandler2);
		$('.bordered tr').css('background', '#ffffff');
		$('.bordered tr').addClass('bordered_tr');
		if (glowguid != null) {
			__g.objectManager.deleteObject(glowguid);
		}
	}

}
