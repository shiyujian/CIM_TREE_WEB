import React, { Component } from 'react';
import { Button, Modal, Form, Row, DatePicker, Select, Input, Notification, Spin, Table } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class AuxiliaryAcceptanceModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount = async () => {
    };

    render () {
        const {
            form: { getFieldDecorator },
            regionArea = 0,
            noLoading,
            selectProjectName,
            selectSectionName,
            selectThinClassName,
            treeNum,
            treeTypeNumDatas
        } = this.props;
        const FormItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        let arr = [
            <Button key='back' size='large' onClick={this._handleTaskModalCancel.bind(this)}>
                取消
            </Button>,
            <Button
                key='submit'
                type='primary'
                size='large'
                onClick={this._handleTaskModalOk.bind(this)}
            >
                确定
            </Button>
        ];
        let footer = noLoading ? null : arr;

        return (
            <Modal
                title='新建任务'
                visible
                width='700px'
                onCancel={this._handleTaskModalCancel.bind(this)}
                footer={footer}
                closable={false}
                maskClosable={false}
            >
                <Spin spinning={noLoading}>
                    <Form>
                        <Row>
                            <FormItem {...FormItemLayout} label='项目'>
                                {getFieldDecorator('selectProject', {
                                    initialValue: `${selectProjectName}`,
                                    rules: [
                                        { required: true, message: '请输入项目名称' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='标段'>
                                {getFieldDecorator('selectSection', {
                                    initialValue: `${selectSectionName}`,
                                    rules: [
                                        { required: true, message: '请输入标段名称' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='位置'>
                                {getFieldDecorator('selectPlace', {
                                    initialValue: `${selectThinClassName}`,
                                    rules: [
                                        { required: true, message: '请输入小班细班名称' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='面积(亩)'>
                                {getFieldDecorator('selectArea', {
                                    initialValue: `${regionArea}`,
                                    rules: [
                                        { required: true, message: '请输入面积' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...FormItemLayout} label='树木数量(棵)'>
                                {getFieldDecorator('areaTreeNum', {
                                    initialValue: `${treeNum}`,
                                    rules: [
                                        { required: true, message: '请输入树木数量' }
                                    ]
                                })(
                                    <Input readOnly />
                                )}
                            </FormItem>
                        </Row>
                        {/* <Row>
                        <FormItem {...FormItemLayout} label='备注'>
                            {getFieldDecorator('taskRemark', {
                                rules: [
                                    { required: false, message: '请输入备注' }
                                ]
                            })(
                                <TextArea rows={4} />
                            )}
                        </FormItem>
                    </Row> */}
                        <Table
                            bordered
                            columns={this.columns}
                            dataSource={treeTypeNumDatas}
                            rowKey='order'
                        />
                    </Form>
                </Spin>
            </Modal>

        );
    }

    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            }
        },
        {
            title: '树种',
            dataIndex: 'TreeTypeName'
        },
        {
            title: '数量（棵）',
            dataIndex: 'Num'
        }
    ]

    _handleTaskModalCancel = async () => {
        await this.props.onCancel();
    }

    // 下发任务
    _handleTaskModalOk = async () => {
        console.log('this.props', this.props);
        const {
            regionThinNo,
            regionSectionNo,
            wkt,
            actions: {
                postCuringTask
            }
        } = this.props;

        this.props.form.validateFields(async (err, values) => {
            console.log('err', err);
            console.log('values', values);
            if (!err) {
                try {
                    await this.props.onOk();
                    return;
                    let CuringMans = '';
                    let postData = {
                        'Area': Number(values.taskTreeArea),
                        'CuringGroup': values.taskTeam,
                        'CuringMans': CuringMans,
                        'CuringMode': 0,
                        'CuringType': values.taskType,
                        'Num': 0,
                        'PlanEndTime': moment(values.taskTime[1]._d).format('YYYY-MM-DD HH:mm:ss'),
                        'PlanStartTime': moment(values.taskTime[0]._d).format('YYYY-MM-DD HH:mm:ss'),
                        'PlanWKT': wkt,
                        'Section': regionSectionNo,
                        'ThinClass': regionThinNo
                    };
                    let taskData = await postCuringTask({}, postData);
                    console.log('taskData', taskData);
                    if (taskData && taskData.code && taskData.code === 1) {
                        Notification.success({
                            message: '下发任务成功',
                            dutation: 3
                        });
                        await this.props.onOk();
                    } else {
                        Notification.error({
                            message: '下发任务失败',
                            dutation: 3
                        });
                    }
                } catch (e) {
                    console.log('e', e);
                }
            }
        });
    }
}
export default Form.create()(AuxiliaryAcceptanceModal);
