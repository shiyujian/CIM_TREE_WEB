import React, {Component} from 'react';
import {Row, Col, Form, Input, Button,Popconfirm} from 'antd';
import {divIcon} from 'leaflet';
import {Map, TileLayer, Marker, Polygon} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {STATIC_DOWNLOAD_API} from '../../../_platform/api';
import { CollapsePanel } from 'antd/lib/collapse/Collapse';

const FormItem = Form.Item;
const URL = window.config.VEC_W;

class Info extends Component {
	render() {
		let {fieldList = [], relation = [], selectField ,form: {getFieldDecorator},
} = this.props;
		let fieldInfo = fieldList.find(field => field.code === selectField) || {};
		let areaInfo = this._getAreaInfo(relation, selectField) || {};
		const {extra_params = {}} = fieldInfo;
		const {file_info} = extra_params || {};
		const leafletCenter = window.config.initLeaflet.center;
		let arr = [];
		for (let item in extra_params){
			arr.push(item);
		}
		if (arr.length === 0) {
			return (
				<div>节点为空</div>
			)
		}else{
			return (
				<Row gutter={24} style={{marginBottom: 20}}>
					{
						fieldInfo.name ? (
							<div>
								<Row>
									<Col span={24}>
										<div style={{borderBottom: 'solid 1px #999', paddingBottom: 5, marginBottom: 20}}>
											<span style={{
												fontSize: 16,
												fontWeight: 'bold',
												paddingRight: '1em'
											}}>单元地块详情</span>
											<Button onClick={this.editField.bind(this)}>编辑单元</Button>
											<Popconfirm title="确定删除此单元吗?" onConfirm={this.delField.bind(this)} okText="确定" cancelText="取消">
												<Button style={{marginLeft:10}}>删除单元</Button>
											</Popconfirm>
										</div>
									</Col>
								</Row>
								<Col span={24}>
									<Row>
										<Col span={12}>
											<FormItem {...Info.layoutT} label="区域地块名称">
												<Input readOnly value={areaInfo.name}/>
											</FormItem>
										</Col>
										<Col span={12}>
											<FormItem {...Info.layoutT} label="区域地块编码">
												<Input readOnly value={areaInfo.code}/>
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col span={12}>
											<FormItem {...Info.layoutT} label="单元名称">
												<Input readOnly value={fieldInfo.name}/>
											</FormItem>
										</Col>
										<Col span={12}>
											<FormItem {...Info.layoutT} label="单元地块编码">
												{getFieldDecorator("code", {
													rules: [{ required: true, message: '必须为英文字母、数字以及 -_~`*!.[]{}()的组合', pattern: /^[\w\d\_\-]+$/ }],
													initialValue: fieldInfo.code
												})
												(
													<Input readOnly />
												)
												}
											</FormItem>
										</Col>
									</Row>
									<FormItem {...Info.layout} label="单元地块坐标">
										<Input type="textarea" rows={4} readOnly
											   value={extra_params.coordinates.length === 0 ? [] : JSON.stringify(extra_params.coordinates)}/>
									</FormItem>
									<FormItem {...Info.layout} label="单元地块文档">
										<div>
											<a href={`${STATIC_DOWNLOAD_API}${file_info.download_url}`}
											   target="_bank">
												{file_info.name}
											</a>
										</div>
									</FormItem>
									<FormItem {...Info.layout} label="单元地块地图">
										<Map center={leafletCenter} zoom={12} zoomControl={false}
											 style={{position: 'relative', height: 360, width: '100%'}}>
											<TileLayer url={URL} subdomains={['7']}/>
											<Polygon positions={this._getPoints(extra_params.coordinates.length === 0 ? [] : extra_params.coordinates)}/>
										</Map>
									</FormItem>
								</Col>
							</div>
						) : null
					}
				</Row>
			);
		}
	}			

	_getAreaInfo(list, code) {
		let rst = null;
		list.map((relation) => {
			if (relation.children.filter(cd => cd === code).length > 0) {
				rst = relation;
			}
		});
		return rst;
	}

	_getPoints(coordinates) {
		let positions = [];
		coordinates.map(coordinate => {
			positions.push([coordinate.Lat, coordinate.Lng])
		});
		return positions;
	}

	delField() {
		const {
			actions: {
				deleteFieldAc,
				getFieldAc,
				setSelectFieldAc
			},
			selectField
		} = this.props;
		deleteFieldAc({code: selectField})
			.then(() => {
				setSelectFieldAc(null)
				getFieldAc();
			})
	}

	editField() {
		const {actions: {toggleModalAc}} = this.props;
		toggleModalAc({
			type: "EDIT",
			visible: true
		})
	}

	static layout = {
		labelCol: {span: 4},
		wrapperCol: {span: 18},
	};
	static layoutT = {
		labelCol: {span: 8},
		wrapperCol: {span: 12},
	};
}
export default Form.create()(Info)

