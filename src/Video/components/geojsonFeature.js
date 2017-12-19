// for out 
export default function getGeoJsonFeatureByType(type) {
	switch (type) {
		case 'geojsonFeature_monitor':
			return geojsonFeature_monitor;
			break;
		case 'geojsonFeature_other_monitor':
			return geojsonFeature_other_monitor;
			break;
		default:
			break;
	}
}


// 全景类型监控
const geojsonFeature_monitor = [{
	"type": "Feature",
	"properties": {
		"name": "全景类型监控1",
		"amenity": "Baseball Stadium",
		"popupContent": "全景类型监控1的描述"
	},
	"geometry": {
		"type": "Point",
		"coordinates": [114.02, 22.46]
	}
}, {
	"type": "Feature",
	"properties": {
		"name": "全景类型监控2",
		"amenity": "Baseball Stadium",
		"popupContent": "全景类型监控2的描述"
	},
	"geometry": {
		"type": "Point",
		"coordinates": [114.01, 22.42]
	}
}];

// 其他类型监控
const geojsonFeature_other_monitor = [{
    "type": "Feature",
    "properties": {
        "name": "其他类型监控1",
        "amenity": "Baseball Stadium",
        "popupContent": "其他类型监控1的描述"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [114.22, 22.38]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "其他类型监控2",
        "amenity": "Baseball Stadium",
        "popupContent": "其他类型监控2的描述"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [114.11, 22.42]
    }
}];