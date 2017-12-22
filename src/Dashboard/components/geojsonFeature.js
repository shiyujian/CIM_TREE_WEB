/**
*
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
* 
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/

import { Video360_API } from '_platform/api';

// for out
export default function getGeoJsonFeatureByType(type) {
	switch (type) {
		case 'geojsonFeature_people':
			return geojsonFeature_people;
			break;
		case 'geojsonFeature_safety':
			return geojsonFeature_safety;
			break;
		case 'geojsonFeature_hazard':
			return geojsonFeature_hazard;
			break;
		case 'geojsonFeature_360':
			return geojsonFeature_360;
			break;
		case 'geojsonFeature_monitor':
			return geojsonFeature_monitor;
			break;
		case 'geojsonFeature_area':
			return geojsonFeature_area;
			break;
		default:
			break;
	}
}

/*现场人员*/
export const users = [
	{
		key: 'YZ',
		'properties': {
			name:'业主'
		},
		children: [
			{
				key: '17',
				'type': 'people',
				'properties': {
					'name': '吕新峰',
					'org': '工程部',
					'phone': '13687529653',
					'project': '前海市政工程V标第二项目部',
					'job': '工程部长',
				},
				'geometry': {
					'type': 'Point',
					'coordinates': [113.887125, 22.522761].reverse()
				}
			},
			{
				key:'19',
				'type': 'people',
				'properties': {
					'name': '王海波',
					'org': '工程部',
					'phone': '18617071155',
					'project': '前海市政工程V标第二项目部',
					'job': '技术员',
				},
				'geometry': {
					'type': 'Point',
					'coordinates': [113.902073, 22.524497].reverse(),
				}
			},
			{
				key:'20',
				'type': 'people',
				'properties': {
					'name': '张玉洁',
					'org': '工程部',
					'phone': '15769231789',
					'project': '前海市政工程V标第二项目部',
					'job': '技术员',
				},
				'geometry': {
					'type': 'Point',
					'coordinates': [113.901498, 22.537582].reverse(),
				},
			}
		]
	}
];

// 监理人员
const geojsonFeature_people = [
	{
		'type': 'people',
		'properties': {
			'name': '吕新峰',
			'org': '工程部',
			'phone': '13687529653',
			'project': '前海市政工程V标第二项目部',
			'job': '工程部长',
		},
		'geometry': {
			'type': 'Point',
			'coordinates': [113.887125, 22.522761],
		},
	}, {
		'type': 'people',
		'properties': {
			'name': '王海波',
			'org': '工程部',
			'phone': '18617071155',
			'project': '前海市政工程V标第二项目部',
			'job': '技术员',
		},
		'geometry': {
			'type': 'Point',
			'coordinates': [113.902073, 22.524497],
		},
	}, {
		'type': 'people',
		'properties': {
			'name': '张玉洁',
			'org': '工程部',
			'phone': '15769231789',
			'project': '前海市政工程V标第二项目部',
			'job': '技术员',
		},
		'geometry': {
			'type': 'Point',
			'coordinates': [113.901498, 22.537582],
		},
	}, {
		'type': 'people',
		'properties': {
			'name': '闾炜',
			'org': '工经部',
			'phone': '15692091328',
			'project': '前海市政工程V标第三项目部',
			'job': '工经部长',
		},
		'geometry': {
			'type': 'Point',
			'coordinates': [113.900348, 22.531707],
		},
	},
];
// 安全监测
const geojsonFeature_safety = [
	{
		'type': 'safety',
		key:'892',
		'properties': {
			'name': 'M4zbp-1-1-孔口',
			'value': 0.12,
			'loc': '12单元',
			'mode': '人工上传',
		},
		'geometry': {
			'type': 'Point',
			'coordinates': [113.88655,22.515282].reverse(),
		},
	}, {
		'type': 'safety',
		key:'893',
		'properties': {
			'name': '安全监测1',
			'value': 0.12,
			'loc': '15单元',
			'mode': '人工上传',
		},
		'geometry': {
			'type': 'Point',
			'coordinates': [113.876489,22.514882].reverse(),
		},
	}, ];

export let safetys = geojsonFeature_safety;

// 危险源
const geojsonFeature_hazard =[{
	key: 'p1',
	'properties': {
		name:"Ⅳ级",
	},
	children:[
		{
			'type': 'danger',
			key:1,
			'properties': {
				'content': '注浆速度、注浆压力等不符合设计相关要求',
				'level': 'Ⅲ级别',
				'measure': '压力检测',
				'name': '危险源1'
			},
			'geometry': {
				'type': 'Point',
				'coordinates': [113.902216,22.535446].reverse()
			},
		}, {
			'type': 'danger',
			key:2,
			'properties': {
				'content': '注浆速度、注浆压力等不符合设计相关要求',
				'level': 'Ⅱ级别',
				'measure': '压力检测',
				'name': '危险源2'
			},
			'geometry': {
				'type': 'Point',
				'coordinates': [113.899342,22.527568].reverse()
			},
		}, {
			'type': 'danger',
			key:3,
			'properties': {
				'content': '注浆速度、注浆压力等不符合设计相关要求',
				'level': 'Ⅳ级别',
				'measure': '压力检测',
				'name': '危险源3'
			},
			'geometry': {
				'type': 'Point',
				'coordinates': [113.888562,22.525698].reverse(),
			}
		}]
}]


/*安全隐患点*/
export const hazards = geojsonFeature_hazard;

// 360全景
const geojsonFeature_360 = [{
	"type": "panorama",
	key:'11111111',
	"properties": {
		"name": "奥威路与S344奥威东路",
        "type":"panorama",
		"link": Video360_API
	},
	"geometry": {
		"type": "Point",
		"coordinates": [22.5101379798,113.8920954599]
	}
}, {
	"type": "panorama",
	key:'11111112',
	"properties": {
		"name": "S334南中段",
        "type":"panorama",
		"link": Video360_API
	},
	"geometry": {
		"type": "Point",
		"coordinates": [22.5201379720,113.8920954590]
	}
}, {
	"type": "panorama",
	key:'11111113',
	"properties": {
		"name": "后台村与S334交叉口",
        "type":"panorama",
		"link": Video360_API
	},
	"geometry": {
		"type": "Point",
		"coordinates": [22.5101379600,113.8920954599]
	}
}];

export const panorama_360 = geojsonFeature_360;



// 视频监控
const geojsonFeature_monitor = [
	{
		'type': 'monitor',
		key:1,
		'properties': {
			'name': '视频监控1',
			'type': 'videosurveillance',
			'amenity': '挖土监控',
			'popupContent': '基地挖图视频监控',
			'org':'15单元视频监控'
		},
		'geometry': {
			'type': 'Point',
			'coordinates': [113.878501,22.513279].reverse(),
		},
	}];

/*视频监控*/
export const vedios =geojsonFeature_monitor;

// 区域地块
const geojsonFeature_area = [
	{
		'type': 'Feature',
		'properties': {
			'name': '区域地块1',
			'type': 'area',
		},
		'geometry': {
			'type': 'Polygon',
			'coordinates': [
				[
					[113.86, 22.54],
					[113.95, 22.56],
					[114.00, 22.53],
					[113.96, 22.52],
					[113.88, 22.51],
					[113.86, 22.54],
				]],
		},
	}, {
		'type': 'Feature',
		'properties': {
			'name': '区域地块2',
			'type': 'area',
		},
		'geometry': {
			'type': 'Polygon',
			'coordinates': [
				[
					[114.02, 22.56],
					[114.09, 22.55],
					[114.10, 22.51],
					[114.04, 22.52],
					[114.01, 22.54],
					[114.02, 22.56],
				]],
		},
	}, {
		'type': 'Feature',
		'properties': {
			'name': '区域地块3',
			'type': 'area',
		},
		'geometry': {
			'type': 'Polygon',
			'coordinates': [
				[
					[114.09, 22.50],
					[114.08, 22.44],
					[113.99, 22.44],
					[113.99, 22.47],
					[114.03, 22.48],
					[114.07, 22.51],
					[114.09, 22.50],
				]],
		},
	}];

/*轨迹回放*/
export const tracks = {
	"type": "Feature",
	"properties": {
		times:[
			"2017-05-22T14:10:00Z",
			"2017-05-22T14:15:00Z",
			"2017-05-22T14:20:00Z",
			"2017-05-22T14:25:00Z",
			"2017-05-22T14:30:00Z",
			"2017-05-22T14:35:00Z",
			"2017-05-22T14:40:00Z",
			"2017-05-22T14:45:00Z",
			"2017-05-22T14:50:00Z",
			"2017-05-22T14:55:00Z",
			"2017-05-22T15:00:00Z"
		]
	},
	"geometry": {
		"type": "LineString",
		"coordinates": [
			[
				113.88702392578125,
				22.520446085488572
			],
			[
				113.8902425765991,
				22.517314273139817
			],
			[
				113.8932466506958,
				22.51442025686723
			],
			[
				113.89050006866455,
				22.512438018976408
			],
			[
				113.88891220092772,
				22.51093149916928
			],
			[
				113.8819169998169,
				22.505024197335548
			],
			[
				113.87929916381836,
				22.50934567111034
			],
			[
				113.87629508972168,
				22.51442025686723
			],
			[
				113.8758659362793,
				22.516164602697195
			],
			[
				113.8771104812622,
				22.518265717308317
			],
			[
				113.87929916381836,
				22.517472847622763
			]
		]
	}
}

