var TREELAYER = null;
var MAPLABELLAYER = null;
var _TiandituSLLabelPath = 'http://t{s}.tianditu.cn/cva_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles';
var _routeLayer = null;
var map = null;

function initMap () {
    var initCenter = [38.9818, 116.03411];
    var initZoom = 14;
    map = MAP = new L.map('map', {
        minZoom: 11,
        maxZoom: 19,
        center: initCenter,
        zoom: initZoom,
        zoomControl: false,
        attributionControl: false,
        crs: L.CRS.EPSG4326
    });
    map.on('click', function (e) {
        getThinClass(e.latlng.lng, e.latlng.lat);
    });
    map.on('drag', function () {

    });
    MAPLABELLAYER = new L.tileLayer(_TiandituSLLabelPath, {
        subdomains: [1, 2, 3],
        minZoom: 11,
        maxZoom: 21,
        storagetype: 0
    });
    TREELAYER = new L.tileLayer('http://39.96.47.88:200/thinclass', {
        opacity: 1.0,
        subdomains: [1, 2, 3],
        minZoom: 11,
        maxZoom: 21,
        storagetype: 0,
        tiletype: 'arcgis'
    });
    TREELAYER.addTo(map);
    MAPLABELLAYER.addTo(map);

    var _treeLayer = L.tileLayer('http://39.96.47.88:8080/geoserver/gwc/service/wmts?layer=xatree%3Atreelocation&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}', {
        opacity: 1.0,
        subdomains: [1, 2, 3],
        minZoom: 11,
        maxZoom: 21,
        storagetype: 0,
        tiletype: 'wtms'
    });
    _treeLayer.setOpacity(0.7);
    _treeLayer.addTo(map);
}

// 面积计算
function CalArea (latLngs) {
    var pointsCount = latLngs.length,
        area = 0.0,
        d2r = L.LatLng.DEG_TO_RAD,
        p1, p2;

    if (pointsCount > 2) {
        for (var i = 0; i < pointsCount; i++) {
            p1 = latLngs[i];
            p2 = latLngs[(i + 1) % pointsCount];
            area += ((p2.lng - p1.lng) * d2r) *
					(2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
        }
        area = area * 6378137.0 * 6378137.0 / 2.0;
    }

    return Math.abs(area);
}

/// ////////////////////draw end///////////////////////////////////
