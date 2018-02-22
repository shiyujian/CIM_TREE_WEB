import React, { Component } from 'react';
import { base, STATIC_DOWNLOAD_API, UNITS } from '../../../_platform/api';
import {
	Form, Input, Button, Row, Col, message, Popconfirm,Tabs,DatePicker,Select
} from 'antd';
import GeneralAddition from './GeneralAddition';

const FormItem = Form.Item;
const Search = Input.Search;
const TabPane=Tabs.TabPane;
const {RangePicker}=DatePicker;

export default class GeneralFilter extends Component {

	static propTypes = {};

	static layout = {
		labelCol: {span: 6},
		wrapperCol: {span: 18},
   };
	render() {
		const { 
			actions: { toggleAddition }, 
			Doc = [],
			toggleData: toggleData = {
				type: 'equipment'
			},
			form: { getFieldDecorator }
		} = this.props;
		console.log('filter.this.props',this.props)
		console.log('filter.doc',Doc)
		return (
			<Form style={{ marginBottom: 24 }}>
				<Row >
					<Col span={20}>
						<Row >
							<Col span={12}>
								<FormItem {...GeneralFilter.layout} label='单位工程'>
                                    {
                                        getFieldDecorator('sunit', {
                                            rules: [
                                                { required: false, message: '请选择单位工程' }
                                            ]
                                        })
                                            (<Select placeholder='请选择单位工程' allowClear>
                                                {UNITS.map(d => <Option key={d.value} value={d.value}>{d.value}</Option>)}
                                            </Select>)
                                    }
                                </FormItem>
							</Col>
							<Col span={12}>
								<FormItem {...GeneralFilter.layout} label='编号'>
                                    {
                                        getFieldDecorator('scode', {
                                            rules: [
                                                { required: false, message: '请输入编号' }
                                            ]
                                        })
                                            (<Input placeholder='请输入编号' />)
                                    }
                                </FormItem>
							</Col>
						</Row>
						<Row >
							<Col span={12}>
                                <FormItem {...GeneralFilter.layout} label='日期'>
                                    {
                                        getFieldDecorator('stimedate', {
                                            rules: [
                                                { type: 'array', required: false, message: '请选择时期' }
                                            ]
                                        })
                                            (<RangePicker size='default' format='YYYY-MM-DD'  />)
                                    }
                                </FormItem>
                            </Col>
							<Col span={12}>
                                <FormItem {...GeneralFilter.layout} label='流程状态'>
                                    {
                                        getFieldDecorator('sstatus', {
                                            rules: [
                                                { required: false, message: '请选择流程状态' }
                                            ]
                                        })
                                            (<Select placeholder='请选择流程类型' allowClear>
                                                {/* <Option key={Math.random*4} value={0}>编辑中</Option> */}
                                                {/* <Option key={Math.random*5} value={1}>已提交</Option> */}
                                                <Option key={Math.random*6} value={2}>执行中</Option>
                                                <Option key={Math.random*7} value={3}>已完成</Option>
                                                {/* <Option key={Math.random*8} value={4}>已废止</Option> */}
                                                {/* <Option key={Math.random*9} value={5}>异常</Option> */}
                                            </Select>)
                                    }
                                </FormItem>
                            </Col>
						</Row>
					</Col>
					<Col span={3} offset={1}>
                        <Row>
                            <FormItem>
                                <Button type='Primary' onClick={this.query.bind(this)}>查询</Button>
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem>
                                <Button onClick={this.clear.bind(this)}>清除</Button>
                            </FormItem>
                        </Row>
                    </Col>
				</Row>
				<Row gutter={24}>
					<Col span={24}>
						{!this.props.isTreeSelected ?
							<Button style={{ marginRight: 10 }} disabled>新增</Button> :
							<Button style={{ marginRight: 10 }} type="primary" onClick={toggleAddition.bind(this, true)}>新增</Button>
						}
						{
							toggleData.type == 'equipment' && <GeneralAddition {...this.props} />
						}
						{
							(Doc.length === 0) ?
								<Button style={{ marginRight: 10 }} disabled>删除</Button> :
								<Popconfirm title="确定要删除文件吗？" onConfirm={this.confirm.bind(this)} onCancel={this.cancel.bind(this)} okText="Yes" cancelText="No">
									<Button style={{ marginRight: 10 }} type="primary" >删除</Button>
								</Popconfirm>
						}
					</Col>
				</Row>
			</Form>
		);
	}

	query() {
        this.props.gettaskSchedule()
    }

    clear() {
        this.props.form.setFieldsValue({
            sunit: undefined,
            scode: undefined,
            stimedate: undefined,
            sstatus: undefined
        })
    }
	cancel() {

	}

	confirm() {
		const {
			coded = [],
			selected = [],
			currentcode = {},
			actions: { deletedoc, getdocument }
		} = this.props;
		if (selected === undefined || selected.length === 0) {
			message.warning('请先选择要删除的文件！');
			return;
		}
		selected.map(rst => {
			coded.push(rst.code);
		});
		let promises = coded.map(function (code) {
			return deletedoc({ code: code });
		});
		message.warning('删除文件中...');
		Promise.all(promises).then(() => {
			message.success('删除文件成功！');
			getdocument({ code: currentcode.code })
				.then(() => {
				});
		}).catch(() => {
			message.error('删除失败！');
			getdocument({ code: currentcode.code })
				.then(() => {
				});
		});
	}

	
};
