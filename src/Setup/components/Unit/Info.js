import React, {Component} from 'react';
import {Row, Col, Form, Input, Button, Card,Table,Popconfirm,message} from 'antd';
import {STATIC_DOWNLOAD_API, SOURCE_API} from '../../../_platform/api';
import {divIcon} from 'leaflet';
import {Map, TileLayer, Marker, Polygon} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const FormItem = Form.Item;
const URL = window.config.VEC_W;
export default class Info extends Component {
	//当前点击的obj_type是否可以操作
	_getType(obj_type){
		switch(obj_type){
			case 'C_WP_UNT':
				return true;
				break;
			case 'C_WP_UNT_S':
				return true;
				break;
			default:
				return false;
		}
	}
	//当前点击的obj_type是否可以操作
	_getTypeName(obj_type){
		switch(obj_type){
			case 'C_WP_UNT':
				return '单位工程';
				break;
			case 'C_WP_UNT_S':
				return '子单位工程';
				break;
			default:
				return '单位工程';
		}
	}
	render() {
		const {unitList = [], instanceDetail = [], selectUnit,canjianList} = this.props;
		let unitInfo = Info.checkLoop(unitList,!selectUnit ? '' : selectUnit.split('--')[0]) || {};
		let unitInfo_units = unitInfo.extra_params.unit;
		const leafletCenter = window.config.initLeaflet.center;
		return (
			<Row gutter={24} style={{marginBottom: 20}}>
				{
					unitInfo.name ? (
						<div>
							<Row>
								<Col span={24}>
									<div style={{borderBottom: 'solid 1px #999', paddingBottom: 5, marginBottom: 20}}>
										<span style={{
											fontSize: 16,
											fontWeight: 'bold',
											paddingRight: '1em'
										}}>{this._getTypeName(selectUnit.split('--')[2])}详情</span>
										{
											(this._getType(selectUnit.split('--')[2])) && (
												<div style={{display:'inline-block'}}>
													<Button onClick={this.editUnit.bind(this)}>编辑{this._getTypeName(selectUnit.split('--')[2])}</Button>
													<Popconfirm title="确定删除吗?" onConfirm={this.delUnit.bind(this)} okText="确定" cancelText="取消">
														<Button>删除{this._getTypeName(selectUnit.split('--')[2])}</Button>
													</Popconfirm>
												</div>
											)
										}
									</div>
								</Col>
							</Row>
							<Col span={24}>
								<Row>
									<Col span={12}>
										<FormItem {...Info.layoutT} label="单位工程名称">
											<Input readOnly value={unitInfo.name}/>
										</FormItem>
									</Col>
									<Col span={12}>
										<FormItem {...Info.layoutT} label="单位工程编码">
											<Input readOnly value={unitInfo.code}/>
										</FormItem>
									</Col>
								</Row>
								<FormItem {...Info.layout} label="单位工程简介">
									<Input type="textarea" rows={3} readOnly
											  value={unitInfo.extra_params.desc || ''}/>
								</FormItem>
								<FormItem {...Info.layout} label="相关文件">
									<div>
										{unitInfo.extra_params.file_info ? (
											<a href={unitInfo.extra_params.file_info ? `${STATIC_DOWNLOAD_API}${unitInfo.extra_params.file_info.download_url}` : ''}
											   target="_bank">
												{unitInfo.extra_params.file_info.name}
											</a>
										) : '无相关文档'}
									</div>
								</FormItem>
								<FormItem {...Info.layout} label="位置坐标">
									<Input type="textarea" rows={4} readOnly
											value={unitInfo.extra_params.coordinates === 0 ? [] : JSON.stringify(unitInfo.extra_params.coordinates)}/>
								</FormItem>
								<Row>
									<Col span={12}>
										<FormItem {...Info.layoutT} label="参建单位">
											<Table dataSource={canjianList || []} size="small" columns={Info.unitColumns} rowKey="code"/>
										</FormItem>
									</Col>
									<Col span={12}>
										<FormItem {...Info.layoutT} label="关联其他单位工程">
											<Table dataSource={unitInfo.extra_params.projectUnit || []} size="small" columns={Info.projectUnitColumns} rowKey="code"/>
										</FormItem>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<FormItem {...Info.layoutT} label="地图位置">
											<Map center={leafletCenter} zoom={12} zoomControl={false}
												 style={{position: 'relative', height: 240, width: '100%'}}>
												<TileLayer url={URL} subdomains={['7']}/>
												<Polygon positions={this._getPoints(unitInfo.extra_params.coordinates.length === 0 ? [] : unitInfo.extra_params.coordinates)}/>
											</Map>
										</FormItem>
									</Col>
									<Col span={12}>
										<FormItem {...Info.layoutT} label="模型位置">
											<Map center={leafletCenter} zoom={12} zoomControl={false}
												 style={{position: 'relative', height: 240, width: '100%'}}>
												<TileLayer url={URL} subdomains={['7']}/>
												<Polygon positions={this._getPoints(unitInfo.extra_params.coordinates.length === 0 ? [] : unitInfo.extra_params.coordinates)}/>
											</Map>
										</FormItem>
									</Col>
								</Row>
								<FormItem {...Info.layout} label="相关图片">
									<Row style={{marginBottom: '20px'}}>
										{
											unitInfo.extra_params.images ? (
												unitInfo.extra_params.images.map((img, index) => {
													return (
														<Col span={4} offset={1} key={index}>
															<Card bodyStyle={{padding: 0}}>
																<div style={{display: 'inline-block', float: 'left'}}>
																	<img width="100%"  src={`${SOURCE_API}${img.a_file}`}/>
																</div>
															</Card>
														</Col>
													)
												})
											) : '无相关图片'
										}
									</Row>
								</FormItem>
							</Col>
						</div>
					) : null
				}
			</Row>
		);
	}

	_getPoints(coordinates) {
		let positions = [];
		coordinates.map(coordinate => {
			positions.push([coordinate.Lat, coordinate.Lng])
		});
		return positions;
	}

	delUnit() {
		const {
			actions: {
				deleteUnitAc,
				getUnitAc,
				setSelectUnitAc,
				delDirAc,
				deleteLocationAc,
				putDir
			},
			selectUnit,
		} = this.props;					
		deleteUnitAc({ code: selectUnit.split('--')[0] })
			.then(rst => {
				if (rst === "") {
					setSelectUnitAc('');
					getUnitAc();
					message.success('删除成功！');
					if (selectUnit.split('--')[2] === 'C_WP_UNT') {
						putDir({ code: selectUnit.split('--')[0] }, {
							"parent": {
								"obj_type": "C_DIR",
								"code": selectUnit.split('--')[0]
							}
						}).then(() => {
							message.success('删除文件目录成功！')
						})
					}
				} else {
					message.error("请先删除其子节点");
				}
			})
	}
	editUnit() {
		const {actions: {toggleModalAc}} = this.props;
		toggleModalAc({
			type: "EDIT",
			visible: true
		})
	}
	static checkLoop = (list, checkCode) => {
		let rst = null;
		list.find((item = {}) => {
			const {code, children = []} = item;
			if (code === checkCode) {
				rst = item;
			} else {
				const tmp = Info.checkLoop(children, checkCode);
				if (tmp) {
					rst = tmp;
				}
			}
		});
		return rst;
	};
	static layout = {
		labelCol: {span: 4},
		wrapperCol: {span: 18},
	};
	static layoutT = {
		labelCol: {span: 8},
		wrapperCol: {span: 12},
	};
	static unitColumns = [{
		title: '组织结构类型',
		dataIndex: 'type',
		key: 'type',
	}, {
		title: '组织结构名称',
		dataIndex: 'name',
		key: 'name',
	}];
	static projectUnitColumns = [{
		title: '单位工程名称',
		dataIndex: 'name',
		key: 'name',
	}, {
		title: '单位工程编码',
		dataIndex: 'code',
		key: 'code',
	}];
}
