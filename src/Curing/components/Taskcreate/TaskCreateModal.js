import React, { Component } from 'react';
import { Button, Modal, Form, Row, Col, DatePicker, Select, Input } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import PersonTree from './PersonTree';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

class TaskCreateModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            typeOptionArr: []
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getcCuringTypes
            }
        } = this.props;
        let curingTypes = await getcCuringTypes();
        let content = curingTypes && curingTypes.content;
        let typeOptionArr = [];
        if (content && content.length > 0) {
            content.map((type) => {
                typeOptionArr.push(<Option key={type.ID} value={type.ID} >{type.Base_Name}</Option>);
            });
        }
        this.setState({
            typeOptionArr
        });
    };

    render () {
        const {
            form: { getFieldDecorator },
            treeNum = 0,
            coordinates,
            regionSectionName,
            regionThinName
        } = this.props;
        const {
            typeOptionArr
        } = this.state;
        const FormItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        return (
            <Modal
                title='新建任务'
                onOk={this._handleTaskModalOk.bind(this)}
                onCancel={this.props.onCancel}
                visible
                width='700px'
            >
                <Form>
                    <Row>
                        <FormItem {...FormItemLayout} label='养护类型'>
                            {getFieldDecorator('taskType', {
                                rules: [
                                    { required: true, message: '请选择养护类型' }
                                ]
                            })(
                                <Select placeholder={'请选择养护类型'}>
                                    {typeOptionArr}
                                </Select>
                            )}
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem {...FormItemLayout} label='任务时间'>
                            {getFieldDecorator('taskTime', {
                                rules: [
                                    { required: true, message: '请选择任务时间' }
                                ]
                            })(
                                <RangePicker
                                    showTime
                                    format='YYYY-MM-DD HH:mm'
                                    placeholder={['计划开始时间', '计划结束时间']}
                                    style={{
                                        width: '100%',
                                        height: '100%'
                                    }}
                                />
                            )}
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem {...FormItemLayout} label='养护班组'>
                            {getFieldDecorator('taskTeam', {
                                rules: [
                                    { required: true, message: '请选择养护班组' }
                                ]
                            })(
                                <PersonTree {...this.props} onSelect={this._handleSelectTeam.bind(this)} />
                            )}
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem {...FormItemLayout} label='树木数量'>
                            {getFieldDecorator('taskTreeNum', {
                                initialValue: `${treeNum}`,
                                rules: [
                                    { required: true, message: '请输入备注' }
                                ]
                            })(
                                <Input readOnly />
                            )}
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem {...FormItemLayout} label='标段'>
                            {getFieldDecorator('taskSection', {
                                initialValue: `${regionSectionName}`,
                                rules: [
                                    { required: true, message: '请输入标段名称' }
                                ]
                            })(
                                <Input readOnly />
                            )}
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem {...FormItemLayout} label='细班'>
                            {getFieldDecorator('taskThinClass', {
                                initialValue: `${regionThinName}`,
                                rules: [
                                    { required: true, message: '请输入细班名称' }
                                ]
                            })(
                                <Input readOnly />
                            )}
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem {...FormItemLayout} label='备注'>
                            {getFieldDecorator('taskRemark', {
                                rules: [
                                    { required: false, message: '请输入备注' }
                                ]
                            })(
                                <TextArea rows={4} />
                            )}
                        </FormItem>
                    </Row>
                </Form>
            </Modal>
        );
    }

    _handleSelectTeam = (value) => {
        const {
            form: {
                setFieldsValue
            }
        } = this.props;
        setFieldsValue({
            taskTeam: value
        });
    }

    // 下发任务
    _handleTaskModalOk = () => {
        console.log('this.props', this.props);
        this.props.form.validateFields((err, values) => {
            console.log('err', err);
            console.log('values', values);
            if (!err) {
                let taskType = values.taskType;
                let taskTime = values.taskTime;
                let taskTeam = values.taskTeam;
                let team = [];
                try {
                    let doc = JSON.parse(taskTeam);
                    if (doc && doc.extra_params && doc.extra_params.RelationMem) {
                        team = doc.extra_params.RelationMem;
                    } else {
                        team = [];
                    }
                    console.log('team', team);
                } catch (e) {

                }
                this.props.onCancel();
            }
        });
    }
}
export default Form.create()(TaskCreateModal);
