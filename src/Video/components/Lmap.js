/**
 * Created by pans0911 on 2017/3/15.
 */
import React, {Component} from 'react';
import {Map, TileLayer, ZoomControl, WMSTileLayer, GeoJSON, Marker, Popup} from 'react-leaflet';
import {Button, Card, Checkbox, Tag} from 'antd';

import geoJsonFeature from './geojsonFeature';

import L from 'leaflet';
import styles from './style.css';
import CameraVideo from './CameraVideo';
import {DefaultZoomLevel} from '_platform/api';

const initLeaflet = window.config.initLeaflet;

const CheckboxGroup = Checkbox.Group;

let Popups=[]
class ExtendedMarker extends Marker {
	Popups=[];
	componentDidMount() {
		super.componentDidMount();
		// this.leafletElement.closePopup();
		Popups=Popups.concat(this.leafletElement)
	}
	componentDidUpdate(nextProps){
		this.updateLeafletElement(this.props,nextProps)
		Popups=Popups.concat(this.leafletElement)
	}
}

export default class Lmap extends Component {
	constructor(props) {
		super(props);
		this.state = {
			TileLayerUrl: this.tileUrls[1],
			geoData: geoJsonFeature('geojsonFeature_monitor'),
			isNotDisplay: {
				display: ''
			},
			CameraLists: geoJsonFeature('geojsonFeature_monitor'),
			leafletCenter: window.config.initLeaflet.center,
			index:0,
		};
	}

	WMSTileLayerUrl = window.config.WMSTileLayerUrl;
	subDomains = ['7'];

	tileUrls = {
		1: window.config.VEC_W,
		2: window.config.IMG_W
	};

	options = [
		{label: '全景类型监控', value: 'geojsonFeature_monitor'},
		{label: '其他类型监控', value: 'geojsonFeature_other_monitor'},
	];

	toggleTileLayer(index) {
		this.setState({
			TileLayerUrl: this.tileUrls[index],
			isNotDisplay: {display: ''}
		})
	}

	toggleFeature(names = []) {
		if(Popups.length>0){
			Popups[this.state.index].closePopup()
		}
		Popups=[];
		let rst = [];
		names.forEach(name => {
			rst = rst.concat(geoJsonFeature(name));
		});
		this.setState({
			geoData: rst,
		})
	}

	changeCenter(point,index) {
		this.setState({
			// leafletCenter: [point.geometry.coordinates[1], point.geometry.coordinates[0]],
			index:index,
		});
		Popups[index].openPopup();
		Popups=[];
	}

	render() {
		return (
		  <div ref="appendBody">
			  <div className={styles.treeControl}>
				  <iframe allowTransparency={true} className={styles.btnCtro}/>
				  <div style={{marginRight: 121}}>
					  <Button type="primary" onClick={this.toggleTileLayer.bind(this, 1)}>地图</Button>
					  <Button type="info" onClick={this.toggleTileLayer.bind(this, 2)}>卫星</Button>
				  </div>
				  <div style={this.state.isNotDisplay}>
					  <Card bordered={false} style={{width: 300}}>
						  <CheckboxGroup options={this.options} defaultValue={['geojsonFeature_monitor']}
										 onChange={this.toggleFeature.bind(this)}/>
					  </Card>
				  </div>
			  </div>
			  <div className={(this.state.geoData.length != 0) ? '' : styles.DisplayNone}>
				  <div className={styles.videolist}>
					  <Card title="视频监控列表" style={{width: 220}} bodyStyle={{maxHeight: 300, overflowY: 'auto'}}>
						  {
							  this.state.geoData.map((rst, index) => {
								  return (
									<Tag className={styles.OneVideoList} key={index} color="blue-inverse"
										 onClick={this.changeCenter.bind(this, rst,index)}>{rst.properties.name}</Tag>
								  )
							  })
						  }
					  </Card>
				  </div>
			  </div>
			  <div>
				  <Map className="map" center={this.state.leafletCenter}
					   style={{
						   "position": "absolute",
						   "top": 0,
						   "bottom": 0,
						   "left": 0,
						   "right": 0
					   }} zoom={DefaultZoomLevel} maxZoom={initLeaflet?initLeaflet.maxZoom:18} zoomControl={false}>
					  <TileLayer url={this.state.TileLayerUrl} attribution={'&copy;<a href="">ecidi</a>'}
								 subdomains={this.subDomains}/>
					  <WMSTileLayer url={this.WMSTileLayerUrl} subdomains={this.subDomains}/>
					  <ZoomControl position='bottomright'/>
					  {
						  this.state.geoData.map((geo, index) => {
							  return (
								<ExtendedMarker key={index} icon={L.divIcon({className: styles.videoIcon})}
												position={[geo.geometry.coordinates[1], geo.geometry.coordinates[0]]}>
									<Popup minWidth={520} maxHeight={500}>
										<div>
											<h2>
												名称：{geo.properties.name}
											</h2>
											<h2>
												设施名称：{geo.properties.amenity}
											</h2>
											<h3>
												监控描述：{geo.properties.popupContent}
											</h3>
											<CameraVideo />
										</div>
									</Popup>
								</ExtendedMarker>
							  )
						  })
					  }
				  </Map>
				  }
			  </div>
		  </div>
		)
	}
}