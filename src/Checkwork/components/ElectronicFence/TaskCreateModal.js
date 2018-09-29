import React, { Component } from 'react';
import { Button, Modal, Form, Row, Col, DatePicker, Select, Input, Notification, Spin } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import PersonTree from './PersonTree';
import { getUser } from '_platform/auth';
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

class TaskCreateModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            typeOptionArr: [], // 养护种类
            teamPerson: [], // 林总库中的所有人员
            signUser: '', // 当前登录用户信息
            loading: true
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getCuringTypes,
                getForestAllUsersData
            }
        } = this.props;
        let curingTypes = await getCuringTypes();
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
        // 获取林总数据库中所有的人员
        let totalUserData = window.localStorage.getItem('LZ_TOTAL_USER_DATA');
        totalUserData = JSON.parse(totalUserData);
        if (totalUserData && totalUserData instanceof Array && totalUserData.length > 0) {

        } else {
            let userData = await getForestAllUsersData();
            totalUserData = userData && userData.content;
        }
        let user = getUser();
        let signUser = '';
        totalUserData.map((userData) => {
            if (userData && userData.PK && Number(userData.PK) === user.id) {
                signUser = userData;
            }
        });
        this.setState({
            signUser
        });
    };
    componentDidUpdate (prevProps, prevState) {
        const {
            noLoading
        } = this.props;
        if (noLoading && noLoading !== prevProps.noLoading) {
            this.setState({
                loading: false
            });
        }
    }

    render () {
        const {
            form: { getFieldDecorator },
            treeNum = 0,
            regionArea = 0,
            regionSectionName,
            regionThinName
        } = this.props;
        const {
            typeOptionArr,
            loading
        } = this.state;
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
        let footer = loading ? null : arr;
        return (

            <Modal
                title='新建电子围栏'
                // onOk={this._handleTaskModalOk.bind(this)}
                // onCancel={this.props.onCancel}
                visible
                width='700px'
                footer={footer}
                closable={false}
                maskClosable={false}
            >
                <Spin spinning={this.state.loading}>
                    <Form>
                        
                    </Form>
                </Spin>
            </Modal>

        );
    }

    _handleSelectTeam = async (value) => {
        const {
            form: {
                setFieldsValue
            },
            actions: {
                getCuringGroupMans
            }
        } = this.props;
        if (value) {
            let postGetData = {
                groupid: value
            };
            let teamPerson = await getCuringGroupMans(postGetData);
            setFieldsValue({
                taskTeam: value
            });
            this.setState({
                teamPerson
            });
        } else {
            Notification.error({
                message: '选择班组失败',
                duration: 2
            });
        }
    }

    _handleTaskModalCancel = async () => {
        await this.props.onCancel();
        this.setState({
            loading: true
        });
    }

    // 下发任务
    _handleTaskModalOk = async () => {
        console.log('this.props', this.props);
        const {
            regionThinNo,
            regionSectionNo,
            wkt,
            groupwkt,
            checkedKeys,
            actions: {
                postCheckScope
            }
        } = this.props;
        const {
            teamPerson,
            signUser
        } = this.state;
        if (!(signUser && signUser.ID)) {
            Notification.error({
                message: '当前登录用户无法划分电子围栏',
                duration: 2
            });
            return;
        }
        if(checkedKeys.length == 0){
            Notification.error({
                 message: '请先选择群体',
                 duration: 2
            });
            return;
        }

        this.props.form.validateFields(async (err, values) => {
            console.log('err', err);
            console.log('values', values);
            if (!err) {
                try {
                    let wkt = groupwkt;
                    let boundary = [];
                    for(let i=0;i<wkt.length;i++){
                        boundary.push({
                            lat:wkt[i][1],
                            lng:wkt[i][0]
                        })
                    }
                    let postData = {
                        'boundary': boundary,
                    };
                    let taskData = await postCheckScope({id:checkedKeys[0]}, postData);
                    console.log('taskData', taskData);
                    if (taskData) {
                        Notification.success({
                            message: '电子围栏划分成功',
                            dutation: 3
                        });
                        await this.props.onOk();
                        this.setState({
                            loading: true
                        });
                    } else {
                        Notification.error({
                            message: '电子围栏划分失败',
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
export default Form.create()(TaskCreateModal);
