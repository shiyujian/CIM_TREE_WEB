import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Popconfirm,Checkbox } from 'antd';
import { STATIC_DOWNLOAD_API, DefaultZoomLevel } from '_platform/api';
import { CollapsePanel } from 'antd/lib/collapse/Collapse';
const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item;
const URL = window.config.VEC_W;
const plan = ['树高','冠幅','胸径','地径','土球高度','土求直径']
const plans = ['树高','冠幅','胸径','地径','土球高度','土求直径','定位']
// const options = [
// 	{lable:'树高',value:'树高' },
// 	{lable:'冠幅',value:'冠幅' },
// 	{lable:'胸径',value:'胸径' },
// 	{lable:'地径',value:'地径' },
// 	{lable:'土球高度',value:'土球高度' },
// 	{lable:'土求直径',value:'土求直径' },
// ]


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
											}}>树种详情</span>
											<Button onClick={this.editField.bind(this)}>编辑树种</Button>
											<Popconfirm title="确定删除此单元吗?" onConfirm={this.delField.bind(this)} okText="确定" cancelText="取消">
												<Button style={{ marginLeft: 10 }}>删除树种</Button>
											</Popconfirm>
										</div>
									</Col>
								</Row>
								<Col span={24}>
									{/* <Row>
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
									</Row> */}
									<Row>
										<Col span={12}>
											<FormItem {...Info.layoutT} label="树种">
												<Input readOnly value={fieldInfo.name} />
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col span={12}>
											<FormItem {...Info.layoutT} label="所属类型">
												<Input readOnly value={fieldInfo.name} />
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col span={12}>
											<FormItem {...Info.layoutT} label="学名">
												<Input readOnly value={areaInfo.name} />
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col span={12}>
											<FormItem {...Info.layoutT} label="编码">
												<Input readOnly value={areaInfo.code} />
											</FormItem>
										</Col>
									</Row>
									{/* <FormItem {...Info.layout} label="单元地块坐标">
										<Input type="textarea" rows={4} readOnly
											   value={extra_params.coordinates.length === 0 ? [] : JSON.stringify(extra_params.coordinates)}/>
									</FormItem> */}
									{/* <FormItem {...Info.layout} label="单元地块文档">
										<div>
											<a href={`${STATIC_DOWNLOAD_API}${file_info.download_url}`}
											   target="_bank">
												{file_info.name}
											</a>
										</div>
									</FormItem> */}
									<FormItem {...Info.layout} label="习性">
										<Input type='textarea' style={{ position: 'relative', height: 320, width: 530, resize: 'none' }} />
									</FormItem>

									<Row>
										<Col span={12}>
											<FormItem {...Info.layoutT} label="苗圃测量内容">
												<CheckboxGroup options={plan}/>
											</FormItem>
										</Col>
									</Row>
									<Row>
										<Col span={12}>
											<FormItem {...Info.layoutT} label="现场测量内容">
												<CheckboxGroup options={plans}/>
											</FormItem>
										</Col>
									</Row>
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

