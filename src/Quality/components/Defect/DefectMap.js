/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../../store/defect';
import {Table} from 'antd';
import {FILE_API, CUS_TILEMAP, SOURCE_API, DOWNLOAD_FILE, WMSTILELAYERURL, TILEURLS} from '../../../_platform/api';

@connect(
	state => {
		const {defect = {}} = state.quality || {}
		return defect
	},
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
	}),
)

export class DefectMap extends Component{
	constructor(props) {
		super(props);
		this.state = {
			leafletCenter: window.config.initLeaflet.center,
            oldLayer: null
		};
		this.checkMarkers = {};
		this.map = null;
	}

    componentDidMount(){
		this.initMap();
        console.log(111111111111)
    }

    componentWillReceiveProps(nextProps) {
        const { defectData } = nextProps;
        const { oldLayer } = this.state;
        const newLayer = this.createMarker(defectData, oldLayer);
        this.setState({oldLayer: newLayer});
    }

    render() {
        return (
			<div id="defectmapid" style={{
				"position": "relative",
                "width": "100%",
                "height": 760
			}}>
			</div>
        )
    }

	WMSTileLayerUrl = WMSTILELAYERURL;
	subDomains = ['7'];

	tileUrls = TILEURLS;

	/*初始化地图*/
	initMap() {
		this.map = L.map('defectmapid', window.config.initLeaflet);

		L.control.zoom({position: 'bottomright'}).addTo(this.map)

		this.tileLayer = L.tileLayer(this.tileUrls[1], {
			attribution: '&copy;<a href="">ecidi</a>',
			id: 'tiandi-map',
			subdomains: this.subDomains
		}).addTo(this.map)
		//航拍影像
		if (CUS_TILEMAP)
			L.tileLayer(`${CUS_TILEMAP}/Layers/_alllayers/LE{z}/R{y}/C{x}.png`).addTo(this.map)

		L.tileLayer.wms(this.WMSTileLayerUrl, {
			subdomains: this.subDomains
		}).addTo(this.map)

	}

	/*在地图上添加marker和polygan*/
	createMarker = (defectData, oldLayer) => {
        if (oldLayer)
            oldLayer.remove();
        if (defectData) {
            const iconType = L.divIcon({className: 'mapIcon'})
            const coordinates = [defectData.lat, defectData.lng];
            const marker = L.marker(coordinates, {icon: iconType}).addTo(this.map)
    			.bindPopup(`${defectData.defectNum}`)
                .openPopup();
            return marker;
        }
        return [];
	}
}
