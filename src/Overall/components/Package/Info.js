import React, {Component} from 'react';
import {Row, Col, Form, Input} from 'antd';
import {divIcon} from 'leaflet';
import {Map, TileLayer, Marker, Polygon} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
const FormItem = Form.Item;
const URL = window.config.VEC_W;

export default class Info extends Component {

	static propTypes = {};

	render() {
		const {
			packagesData = {
				name:'',
				code:'',
				extra_params: {
					schedule: '',
					amount: '',
					intro: '',
					location: [],
					quantity: '',
				}
			}
		} = this.props;
		let node=packagesData.extra_params;
		const leafletCenter = window.config.initLeaflet.center;
		return (
			<Row gutter={24} style={{marginBottom: 20}}>
				<Col span={12}>
					<FormItem {...Info.layout} label="工程名称">
						<Input readOnly value={packagesData.name}/>
					</FormItem>
					<FormItem {...Info.layout} label="工程编码">
						<Input readOnly value={packagesData.code}/>
					</FormItem>
					<FormItem {...Info.layout} label="施工单位">
						<Input readOnly value={node.schedule}/>
					</FormItem>
					<FormItem {...Info.layout} label="项目简介">
						<Input type="textarea" rows={3} readOnly value={node.intro}/>
					</FormItem>
				</Col>
				<Col span={12}>
					<p style={{marginBottom: 6}}>项目定位图：</p>
					<Map center={leafletCenter} zoom={13} zoomControl={false}
					     style={{position: 'relative', height: 250, width: '100%'}}>
						<TileLayer url={URL} subdomains={['7']}/>
						<Polygon positions={node.location || []}/>
					</Map>
				</Col>
			</Row>);
	}
	static layout = {
		labelCol: {span: 6},
		wrapperCol: {span: 18},
	};
}
