import React, { Component } from 'react';
import { Modal, Input, Form, Button, Notification, Table, Radio, Row, Col, Select, Switch, Upload, Icon } from 'antd';
import { CODE_PROJECT } from '_platform/api';
// import { getProjectUnits } from '../../../_platform/auth'
import './PersonModify.less';
import { getUser, getProjectUnits } from '_platform/auth';
import { getNextStates } from '_platform/components/Progress/util';
import { WORKFLOW_CODE, PROJECT_UNITS } from '_platform/api'
import { flattenDeep } from 'lodash';

const RadioGroup = Radio.Group;
const { Option, OptGroup } = Select;
const FormItem = Form.Item;
window.config = window.config || {};

const { TextArea } = Input;
var moment = require('moment');
class PersonModify extends Component {

    // export default class PersonModify extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        // const {modifyPer } = this.props;
        // console.log("modifyPer",modifyPer)
    }
    render() {
        const { modifyPer } = this.props;
        console.log("modifyPer", modifyPer)

        const addition = modifyPer
        const { form: {
			getFieldDecorator
        }, actions: { changeAdditionField }, tags = [] } = this.props;
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        let roles = []
        addition.groups.map(ese => {
            roles.push(ese.name)
        })
        let sectio = []
        PROJECT_UNITS.map(ies => {
            ies.units.map(ies1 => {
                addition.sections.map(ie => {
                    if (ies1.code == ie) {
                        sectio.push(ies1.value)
                    }
                })
            })

        })

        let defaultNurse = []
        tags.map(rst => {
            addition.tags.map(item => {
                if (rst.ID == item) {
                    defaultNurse.push(rst.NurseryName + '-' + rst.Factory)
                }

            })
        })
        // 上传用户头像
        let fileList = []
        console.log("addition",addition)
        if (addition.account.person_avatar_url && addition.account.person_avatar_url != 'http://47.104.160.65:6511') {
            const avatar_urlName = addition.account.person_avatar_url.split("/").pop()
            const avatar_url = window.config.STATIC_FILE_IP + ':' + window.config.STATIC_PREVIEW_PORT + '/media' + addition.account.person_avatar_url
            fileList = [{
                uid: -1,
                name: avatar_urlName,
                status: 'done',
                url: avatar_url,
                thumbUrl: avatar_url,
            }];
        }
        // 上传用户签名
        let fileList1 = []
        if (addition.account.person_signature_url && addition.account.person_signature_url != 'http://47.104.160.65:6511') {
            const avatar_urlName3 = addition.account.person_signature_url.split("/").pop()
            const avatar_url3 = window.config.STATIC_FILE_IP + ':' + window.config.STATIC_PREVIEW_PORT + '/media' + addition.account.person_signature_url
            fileList1 = [{
                uid: -1,
                name: avatar_urlName3,
                status: 'done',
                url: avatar_url3,
                thumbUrl: avatar_url3,
            }];
        }
        // 上传身份证正面
        let fileList2 = []
        let id_image_url = ''
        let id_image_urlName
        if (addition.id_image && addition.id_image[0]) {
            if (addition.id_image[0].name && addition.id_image[0].filepath) {
                id_image_urlName = addition.id_image[0].name
                // filepath: STATIC_DOWNLOAD_API + "/media" + file.file.response.download_url.split('/media')[1]
                const id_img = addition.id_image[0].filepath.split('/media')[1]
                const id_imgs = window.config.STATIC_FILE_IP + ':' + window.config.STATIC_PREVIEW_PORT + '/media' + id_img
                id_image_url = id_imgs ? id_imgs : addition.id_image[0].thumbUrl
                fileList2 = [{
                    uid: 1,
                    name: id_image_urlName,
                    status: 'done',
                    url: id_image_url,
                    thumbUrl: id_image_url,
                }]
            }
        }
        // 上传身份证发面
        let fileList3 = []
        let id_image_url1 = ''
        let id_image_urlName1
        if (addition.id_image && addition.id_image[1]) {
            if (addition.id_image[1].name && addition.id_image[1].filepath) {
                const id_img = addition.id_image[1].filepath.split('/media')[1]
                const id_imgs = window.config.STATIC_FILE_IP + ':' + window.config.STATIC_PREVIEW_PORT + '/media' + id_img
                id_image_urlName1 = addition.id_image[1].name
                id_image_url1 = id_imgs ? id_imgs : addition.id_image[1].thumbUrl
                fileList3 = [{
                    uid: 2,
                    name: id_image_urlName1,
                    status: 'done',
                    url: id_image_url1,
                    thumbUrl: id_image_url1,
                }]
            }
        }
        return (
            <Modal
                onCancel={this.cancel.bind(this)}
                visible={this.props.Modvisible}
                width={1280}
                onOk={this.onok.bind(this)}
            >
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>详情</h1>
                <Form>
                    <Row gutter={24}>
                        <Col span={12}>
                            <FormItem   {...PersonModify.layout} label="用户名:">
                                <Input value={addition.username} placeholder="请输入用户名" />
                            </FormItem>
                            <FormItem   {...PersonModify.layout} label="姓名:">
                                <Input placeholder="请输入姓名" value={addition.account.person_name} />
                            </FormItem>
                            <FormItem   {...PersonModify.layout} label="性别:">
                                <Input placeholder="请选择性别" value={addition.basic_params.info.sex} >
                                </Input>
                            </FormItem>
                            <FormItem   {...PersonModify.layout} label="身份证号码:">
                                <Input placeholder="请输入身份证号码" value={addition.id_num} />
                            </FormItem>
                            {user.is_superuser ?
                                <FormItem {...PersonModify.layout} label="部门编码">
                                    <Input placeholder="部门编码" value={addition.account.organization.code} />
                                </FormItem> : ''
                            }
                            {
                                addition.id ? <FormItem {...PersonModify.layout} label="密码">
                                    <Input disabled={!!addition.id} placeholder="请输入密码" value={addition.password} />
                                </FormItem> : <FormItem   {...PersonModify.layout} label="密码:">
                                        <Input disabled={!!addition.id} placeholder="请输入密码" value={addition.password} />
                                    </FormItem>
                            }

                            <FormItem {...PersonModify.layout} label="标段">
                                <Input placeholder="标段" value={sectio}
                                    style={{ width: '100%' }}>
                                    {/* {
                                        units ?
                                            units.map((item) => {
                                                return <Option key={item.code} value={item.code} >{item.value}</Option>
                                            }) :
                                            ''
                                    } */}
                                </Input>
                            </FormItem>
                            <FormItem {...PersonModify.layout} label="用户头像">

                                {
                                    fileList&&fileList.length ? <Upload
                                        name="file"

                                        listType="picture-card"
                                        onRemove={false}
                                        defaultFileList={fileList}
                                    >
                                    </Upload> : '无'
                                }
                            </FormItem>
                            <FormItem {...PersonModify.layout} label="用户签名">

                                {
                                    fileList1&&fileList1.length ? <Upload
                                        name="file"
                                        listType="picture-card"
                                        onRemove={false}
                                        defaultFileList={fileList1}
                                    >
                                    </Upload> : '无'
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...PersonModify.layout} label="邮箱">
                                <Input placeholder="请输入邮箱" value={addition.email} onChange={changeAdditionField.bind(this, 'email')} />
                            </FormItem>
                            <FormItem   {...PersonModify.layout} label="手机号码:">
                                <Input placeholder="请输入手机号码" value={addition.basic_params.info.phone} />
                            </FormItem>
                            <FormItem   {...PersonModify.layout} label="职务:">
                                <Input placeholder="请选择职务" value={addition.title}
                                    style={{ width: '100%' }}>
                                </Input>
                            </FormItem>
                            <FormItem   {...PersonModify.layout} label="角色:">
                                <Input placeholder="请选择角色"
                                    value={roles}
                                    mode="multiple" style={{ width: '100%' }}>
                                </Input>
                            </FormItem>
                            {user.is_superuser ?
                                <FormItem {...PersonModify.layout} label="部门名称">
                                    <Input placeholder="部门名称" value={addition.account.organization.name} />
                                </FormItem> : ''
                            }
                            <FormItem {...PersonModify.layout} label="苗圃">
                                <Input placeholder="苗圃"
                                    value={defaultNurse}
                                    style={{ width: '100%' }} >
                                </Input>
                            </FormItem>
                            <Row  >
                                <Col span={8}>
                                    <FormItem {...PersonModify.layoutT} label="黑名单">
                                        <Switch checked={addition.id ? (addition.is_black == 0 ? false : true) : false} />
                                    </FormItem>
                                </Col>
                                {/* <Col span={5}>
                                    <FormItem {...PersonModify.layoutT} label="关联用户">
                                        <Switch checked={addition.id ? addition.change_all : false} />
                                    </FormItem>
                                </Col> */}
                                <Col span={16}>
                                    <FormItem {...PersonModify.layoutR} label="原因">
                                        <Input value={addition.black_remark} />
                                    </FormItem>
                                </Col>

                            </Row>
                            <FormItem {...PersonModify.layout} label="身份证正面照片">
                                {
                                    fileList2&&fileList2.length ? <Upload
                                        name="file"

                                        listType="picture-card"
                                        onRemove={false}
                                        defaultFileList={fileList2}
                                    >
                                    </Upload> : '无'
                                }
                            </FormItem>
                            <FormItem {...PersonModify.layout} label="身份证反面照片">
                                {
                                    fileList3&&fileList3.length ? <Upload
                                        name="file"

                                        listType="picture-card"
                                        onRemove={false}
                                        defaultFileList={fileList3}
                                    >
                                    </Upload> : '无'
                                }
                            </FormItem>

                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }


    async onok(id) {

        const { actions: { ModifyVisible } } = this.props;
        ModifyVisible(false);
    }
    cancel() {
        const { actions: { ModifyVisible } } = this.props;
        ModifyVisible(false);
    }
    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    static layoutT = {
        labelCol: { span: 18 },
        wrapperCol: { span: 6 },
    };
    static layoutR = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };
}

export default Form.create()(PersonModify)
