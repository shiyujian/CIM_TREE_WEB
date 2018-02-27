import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Popconfirm, Table, Icon } from 'antd';
import { STATIC_DOWNLOAD_API, DefaultZoomLevel } from '_platform/api';
import { CollapsePanel } from 'antd/lib/collapse/Collapse';

const FormItem = Form.Item;
const URL = window.config.VEC_W;

const columns = [{
	title: '序号',
	dataIndex: 'name',
	key: 'name',
	render: text => <a href="#">{text}</a>,
},{
	title: '种树',
	dataIndex: 'address',
	key: 'address',
},{
	title: '数量（课）',
	dataIndex: 'age',
	key: 'age',
}];

const data = [{
	key: '1',
	name: '1',
	age: 1234,
	address: '中国垂丝海棠',
}, {
	key: '2',
	name: '2',
	age: 111,
	address: '银杏',
}, {
	key: '3',
	name: '3',
	age: 32,
	address: '11',
}];

class Info extends Component {
	render() {
		let { fieldList = [], relation = [], selectField, form: { getFieldDecorator },
} = this.props;
		let fieldInfo = fieldList.find(field => field.code === selectField) || {};
		let areaInfo = this._getAreaInfo(relation, selectField) || {};
		const { extra_params = {} } = fieldInfo;
		const { file_info } = extra_params || {};
		const leafletCenter = window.config.initLeaflet.center;
		let arr = [];
		for (let item in extra_params) {
			arr.push(item);
		}
		if (arr.length === 0) {
			return (
				<div>节点为空</div>
			)
		} else {
			return (
				<Row gutter={24} style={{ marginBottom: 20 }}>
					{
						fieldInfo.name ? (
							<div>
								<Row>
									<Col span={24}>
										<div style={{ borderBottom: 'solid 1px #999', paddingBottom: 5, marginBottom: 20 }}>
											<span style={{
												fontSize: 16,
												fontWeight: 'bold',
												paddingRight: '1em'
											}}>细班详情</span>
											<Button onClick={this.editField.bind(this)}>细班编辑</Button>
											<Popconfirm title="确定删除此单元吗?" onConfirm={this.delField.bind(this)} okText="确定" cancelText="取消">
												<Button style={{ marginLeft: 10 }}>删除细班</Button>
											</Popconfirm>
										</div>
									</Col>
								</Row>
								<Col span={24}>
									<Row>
										<Col span={12}>
											<FormItem {...Info.layoutT} label="细班名称">
												<Input readOnly value={areaInfo.name} />
											</FormItem>
										</Col>
										<Col span={12}>
											<FormItem {...Info.layoutT} label="细班编码">
												<Input readOnly value={areaInfo.code} />
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col span={12}>
											<FormItem {...Info.layoutT} label="所属小班">
												<Input readOnly value={areaInfo.name} />
											</FormItem>
										</Col>
										<Col span={12}>
											<FormItem {...Info.layoutT} label="标段描述">
												<div>
													<a href={`${STATIC_DOWNLOAD_API}${file_info.download_url}`}
														target="_bank">
														{file_info.name}
													</a>
												</div>
											</FormItem>
										</Col>
									</Row>
									<Row>
								
										<FormItem {...Info.layout} label="所属小班">
												<div>
													<Table pagination={false} columns={columns} dataSource={data} />
												</div>
											</FormItem>
									</Row>
									<FormItem {...Info.layout} label="细班坐标">
										<Input type="textarea" rows={4} readOnly
											value={extra_params.coordinates.length === 0 ? [] : JSON.stringify(extra_params.coordinates)} />
									</FormItem>

									<FormItem {...Info.layout} label="细班地图">
										<Map center={leafletCenter} zoom={DefaultZoomLevel} zoomControl={false}
											style={{ position: 'relative', height: 360, width: '100%' }}>
											<TileLayer url={URL} subdomains={['7']} />
											<Polygon positions={this._getPoints(extra_params.coordinates.length === 0 ? [] : extra_params.coordinates)} />
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
		deleteFieldAc({ code: selectField })
			.then(() => {
				setSelectFieldAc(null)
				getFieldAc();
			})
	}

	editField() {
		const { actions: { toggleModalAc } } = this.props;
		toggleModalAc({
			type: "EDIT",
			visible: true
		})
	}

	static layout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 18 },
	};
	static layoutT = {
		labelCol: { span: 8 },
		wrapperCol: { span: 12 },
	};
}
export default Form.create()(Info)

