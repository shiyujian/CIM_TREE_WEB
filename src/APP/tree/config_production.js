/**
 *
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
【数字化研发部】配置文件添加和修改暂行规范,不宜删除以下说明
1.config.js和api.js注意区别,config.js主要是IP和端口,api.js主要是服务的组织;
2.根据重要级别进行模块化组织，参考以下格式和顺序进行配置:
	//公共资源服务,同级别IP和端口需同时出现,例如:基础服务,静态文件存储服务,流程管理服务等;
	//单模块资源服务,只是针对单个模块使用的服务,例如:巡检模块,安全监测模块等;
	//临时资源服务
	//静态常量
3.IP、端口和服务地址必须做出说明
4.在src/_platform/API.js和src下所有源码当中,不能出现IP和端口固定的情况;
*/

/** ******【开发环境配置】,如有新增配置，请保持dev\master\producation\stage同步**********/

window.config = {
    /** *********************公共资源服务**************************/
    // 基础服务域名
    DOMAIN: 'https://www.xaqnxl.com',
    // 园林接口地址
    SDOMAIN: 'https://www.xazhyl.com',
    // 二维展示根据坐标获取树木顺序码端口
    DASHBOARD_ONSITE: 'https://tree.imrforest.com:8082',
    // 林总图片新接口
    ALIIMG: 'https://xatree-1.oss-cn-qingdao.aliyuncs.com',

    // 高德地图逆地理编码
    LBSAMAP: 'https://restapi.amap.com',
    // 地图瓦片地址
    WMSTileLayerUrl:
        // 'http://t{s}.tianditu.gov.cn/cva_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=87c942f4f4a2b17270f52f797df4537c',
        'http://t{s}.tianditu.com/cia_c/wmts?layer=cia&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=87c942f4f4a2b17270f52f797df4537c',
    IMG_W:
        // 'http://t{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=87c942f4f4a2b17270f52f797df4537c',
        'http://t{s}.tianditu.com/img_c/wmts?layer=img&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=87c942f4f4a2b17270f52f797df4537c',
    VEC_W:
        // 'http://t{s}.tianditu.gov.cn/vec_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=87c942f4f4a2b17270f52f797df4537c',
        'http://t{s}.tianditu.com/vec_c/wmts?layer=vec&style=default&tilematrixset=c&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=87c942f4f4a2b17270f52f797df4537c',
    IMG_1: 'https://www.xaqnxl.com:200/1',
    IMG_2: 'https://www.xaqnxl.com:200/2',
    IMG_3: 'https://www.xaqnxl.com:200/3',
    IMG_4: 'https://www.xaqnxl.com:200/4',
    IMG_5: 'https://www.xaqnxl.com:200/5',
    IMG_6: 'https://www.xaqnxl.com:200/6',
    IMG_7: 'https://www.xaqnxl.com:200/7',

    /** *********************单模块资源服务**************************/
    // 智慧森林
    // 苗圃定位模板
    nurseryLocation:
        'https://xatree-1.oss-cn-qingdao.aliyuncs.com/nurseryLocation.xlsx',

    /** *********************临时资yu源服务**************************/
    initLeaflet: {
        center: [38.99042701799772, 116.0396146774292],
        // center: [30.2528290000, 120.0177300000], // 华东院
        zoomControl: false,
        zoom: 13,
        minZoom: 10,
        editable: true
    },
    XACompanyInitLeaflet: {
        // center: [39.029373914931, 115.893481987848], // 小白楼
        center: [38.99042701799772, 116.0396146774292],
        // center: [39.048904, 115.884522],
        zoomControl: false,
        zoom: 15,
        minZoom: 10,
        editable: true
    },
    // 个人考勤的上下班时间，如果当前的部门未配置的话拿此上下班时间，用[--]分开，此处必须配置
    IN_OFF_DUTY: '08:30:00--18:00:00'
};
