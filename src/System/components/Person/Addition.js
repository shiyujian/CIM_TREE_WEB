import React, { Component } from 'react';
import {
    Modal,
    Row,
    Col,
    Form,
    Input,
    Select,
    message,
    Upload,
    Icon,
    Button,
    Switch,
    TreeSelect
} from 'antd';
import { getUserIsDocument } from '../../../_platform/auth';
import {getSectionNameBySection} from '_platform/gisAuth';
import { UPLOAD_API, STATIC_DOWNLOAD_API, STATIC_UPLOAD_API } from '../../../_platform/api';
import { Promise } from 'es6-promise';
let fileTypes =
    'application/jpeg,application/gif,application/png,image/jpeg,image/gif,image/png,image/jpg';

window.config = window.config || {};
const FormItem = Form.Item;
const { Option, OptGroup } = Select;

const RealName = (addition) => {
    return new Promise((resolve) => {
        fetch(`http://idcert.market.alicloudapi.com/idcard?idCard=${addition.id_num}&name=${addition.person_name}`, {
            headers: {
                'Authorization': 'APPCODE ' + 'c091fa7360bc48ff87a3471f028d5645'
            }
        }).then(rep => {
            return rep.json();
        }).then(rst => {
            if (rst.status === '01') {
                message.success('实名认证通过');
                resolve();
            } else {
                message.warning('实名认证失败，请确认信息是否正确');
            }
        });
    });
};

// export default class Addition extends Component {
class Addition extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            searchList: [],
            search: false,
            searchValue: '',
            newKey: Math.random(),
            idImgF: true,
            idImgZ: true,
            change_alValue: null,
            section: ''
        };
    }
    renderContent () {
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        const {
            platform: { roles = [] },
            sidebar: {
                node = {}
            } = {}
        } = this.props;
        var systemRoles = [];
        if (user.is_superuser) {
            systemRoles.push({
                name: '苗圃角色',
                value: roles.filter(role => role.grouptype === 0)
            });
            systemRoles.push({
                name: '施工角色',
                value: roles.filter(role => role.grouptype === 1)
            });
            systemRoles.push({
                name: '监理角色',
                value: roles.filter(role => role.grouptype === 2)
            });
            systemRoles.push({
                name: '业主角色',
                value: roles.filter(role => role.grouptype === 3)
            });
            systemRoles.push({
                name: '养护角色',
                value: roles.filter(role => role.grouptype === 4)
            });
            systemRoles.push({
                name: '供应商角色',
                value: roles.filter(role => role.grouptype === 6)
            });
        } else {
            for (let i = 0; i < user.groups.length; i++) {
                const rolea = user.groups[i].grouptype;
                switch (rolea) {
                    case 0:
                        systemRoles.push({
                            name: '苗圃角色',
                            value: roles.filter(role => role.grouptype === 0)
                        });
                        break;
                    case 1:
                        // 对于非苗圃基地的部门，施工方不能选择苗圃角色
                        if (node && node.topParent === '苗圃基地') {
                            systemRoles.push({
                                name: '苗圃角色',
                                value: roles.filter(role => role.grouptype === 0)
                            });
                        }
                        systemRoles.push({
                            name: '施工角色',
                            value: roles.filter(role => role.grouptype === 1)
                        });
                        systemRoles.push({
                            name: '养护角色',
                            value: roles.filter(role => role.grouptype === 4)
                        });
                        break;
                    case 2:
                        systemRoles.push({
                            name: '监理角色',
                            value: roles.filter(role => role.grouptype === 2)
                        });
                        break;
                    case 3:
                        systemRoles.push({
                            name: '业主角色',
                            value: roles.filter(role => role.grouptype === 3)
                        });
                        break;
                    case 4:
                        systemRoles.push({
                            name: '养护角色',
                            value: roles.filter(role => role.grouptype === 4)
                        });
                        break;
                    case 6:
                        systemRoles.push({
                            name: '供应商角色',
                            value: roles.filter(role => role.grouptype === 6)
                        });
                        break;
                    default:
                        break;
                }
            }
        }
        const objs = systemRoles.map(roless => {
            return (
                <OptGroup label={roless.name} key={roless.name}>
                    {roless.value.map(role => {
                        return (
                            <Option key={role.id} value={String(role.id)}>
                                {role.name}
                            </Option>
                        );
                    })}
                </OptGroup>
            );
        });
        return objs;
    }
    renderTitle () {
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        const {
            platform: { roles = [] }
        } = this.props;
        var systemRoles = [];
        if (user.is_superuser) {
            systemRoles.push({
                name: '苗圃职务',
                children: ['苗圃', '苗圃文书'],
                value: roles.filter(role => role.grouptype === 0)
            });
            systemRoles.push({
                name: '施工职务',
                children: [
                    '施工领导',
                    '协调调度人',
                    '质量负责人',
                    '安全负责人',
                    '文明负责人',
                    '普通员工',
                    '施工文书',
                    '测量员',
                    '施工整改人'
                ],
                value: roles.filter(role => role.grouptype === 1)
            });
            systemRoles.push({
                name: '监理职务',
                children: ['总监', '监理组长', '普通监理', '监理文书'],
                value: roles.filter(role => role.grouptype === 2)
            });
            systemRoles.push({
                name: '业主职务',
                children: ['业主', '业主文书', '业主领导'],
                value: roles.filter(role => role.grouptype === 3)
            });
            systemRoles.push({
                name: '供应商职务',
                children: ['供应商', '供应商文书'],
                value: roles.filter(role => role.grouptype === 6)
            });
        } else {
            for (let i = 0; i < user.groups.length; i++) {
                const rolea = user.groups[i].grouptype;
                switch (rolea) {
                    case 0:
                        systemRoles.push({
                            name: '苗圃职务',
                            children: ['苗圃', '苗圃文书'],
                            value: roles.filter(role => role.grouptype === 0)
                        });
                        break;
                    case 1:
                        systemRoles.push({
                            name: '苗圃职务',
                            children: ['苗圃'],
                            value: roles.filter(role => role.grouptype === 0)
                        });
                        systemRoles.push({
                            name: '施工职务',
                            children: [
                                '施工领导',
                                '协调调度人',
                                '质量负责人',
                                '安全负责人',
                                '文明负责人',
                                '普通员工',
                                '施工文书',
                                '测量员',
                                '施工整改人'
                            ],
                            value: roles.filter(role => role.grouptype === 1)
                        });
                        break;
                    case 2:
                        systemRoles.push({
                            name: '监理职务',
                            children: [
                                '总监',
                                '监理组长',
                                '普通监理',
                                '监理文书'
                            ],
                            value: roles.filter(role => role.grouptype === 2)
                        });
                        break;
                    case 3:
                        systemRoles.push({
                            name: '业主职务',
                            children: ['业主', '业主文书', '业主领导'],
                            value: roles.filter(role => role.grouptype === 3)
                        });
                        break;
                    case 5:
                        systemRoles.push({
                            name: '供应商职务',
                            children: ['供应商', '供应商文书'],
                            value: roles.filter(role => role.grouptype === 6)
                        });
                        break;
                    default:
                        break;
                }
            }
        }
        const objs = systemRoles.map(roless => {
            return (
                <OptGroup label={roless.name} key={roless.name} >
                    {roless.children.map(role => {
                        return (
                            <Option key={role} value={role}>
                                {role}
                            </Option>
                        );
                    })}
                </OptGroup>
            );
        });
        return objs;
    }
    // 上传用户头像
    uploadChange (file) {
        const status = file.file.status;
        const {
            actions: { postUploadFilesImg, getImgBtn }
        } = this.props;
        if (status === 'done') {
            let newFileList = file.file.response.download_url.split(
                '/media'
            )[1];
            getImgBtn(true);
            postUploadFilesImg(newFileList);
        }
        if (status === 'removed') {
            getImgBtn(false);
            postUploadFilesImg();
        }
        if (event) {
            let { percent } = event;
            if (percent !== undefined) {
            }
        }
    }
    // 上传用户签名
    uploadChangew (file) {
        const status = file.file.status;
        const {
            actions: { postUploadAutograph, getAutographBtn }
        } = this.props;
        if (status === 'done') {
            let newFileList = file.file.response.download_url.split(
                '/media'
            )[1];
            // postUploadVideo(newFileList)
            getAutographBtn(true);
            postUploadAutograph(newFileList);
        }
        if (status === 'removed') {
            getAutographBtn(false);
            postUploadAutograph();
        }
        if (event) {
            let { percent } = event;
            if (percent !== undefined) {
            }
            // this.setState({ progress: parseFloat(percent.toFixed(1)) });
        }
    }
    // 上传身份证正面照片
    uploadChanges (file) {
        const status = file.file.status;
        const {
            actions: { postUploadFilesNum, getImgNumBtn }
            // postUploadFilesNums = []
        } = this.props;
        if (status === 'done') {
            // let newFileList = postUploadFilesNums;
            let newFile = {
                name: file.file.name,
                filepath:
                    STATIC_DOWNLOAD_API +
                    '/media' +
                    file.file.response.download_url.split('/media')[1]
            };
            getImgNumBtn(true);
            this.setState({ idImgZ: true });
            postUploadFilesNum(newFile);
        }
        if (status === 'removed') {
            getImgNumBtn(false);
            postUploadFilesNum();
            this.setState({ idImgZ: false });
        }
        if (event) {
            let { percent } = event;
            if (percent !== undefined) {
            }
        }
    }
    // 上传身份证反面照片
    uploadChangea (file) {
        const status = file.file.status;
        const {
            actions: { postUploadNegative, getImgNegative }
            // postUploadNegatives = []
        } = this.props;
        if (status === 'done') {
            // let newFileList = postUploadNegatives;
            let newFile = {
                name: file.file.name,
                filepath:
                    STATIC_DOWNLOAD_API +
                    '/media' +
                    file.file.response.download_url.split('/media')[1]
            };
            this.setState({ idImgF: true });

            getImgNegative(true);
            postUploadNegative(newFile);
        }
        if (status === 'removed') {
            getImgNegative(false);
            postUploadNegative();
            this.setState({ idImgF: false });
        }
        if (event) {
            let { percent } = event;
            if (percent !== undefined) {
            }
        }
    }

    componentDidMount () {
        const {
            actions: { getRoles }
        } = this.props;
        getRoles();
    }
    componentDidUpdate (prevProps, prevState) {
        const {
            sidebar,
            addition,
            isSection,
            actions: { changeAdditionField }
        } = this.props;
        if (
            addition &&
            addition.visible &&
            addition.visible !== prevProps.addition.visible
        ) {
            let node = sidebar && sidebar.node;
            if (!node) {
                return;
            }
            let code = node.code;
            let name = node.name;
            let pk = node.pk;
            changeAdditionField('org_code', code);
            changeAdditionField('organizationName', name);
            changeAdditionField('organizationPk', pk);
        }
        if (isSection && isSection instanceof Array && isSection.length > 0 && isSection !== prevProps.isSection) {
            this.setState({
                section: isSection[0]
            });
        }
    }

    render () {
        const {
            form: { getFieldDecorator },
            addition = {},
            actions: { changeAdditionField },
            isSection = []
        } = this.props;
        const {
            section
        } = this.state;
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        // 用户是否为文书
        let userIsDocument = getUserIsDocument();
        let units = this.getUnits(isSection);
        let avatar_url = '';
        let avatar_urlName;
        // 上传用户头像
        let fileList = [];
        if (
            addition.person_avatar_url &&
            addition.person_avatar_url !== STATIC_UPLOAD_API
        ) {
            avatar_urlName = addition.person_avatar_url.split('/').pop();
            avatar_url =
                window.config.STATIC_FILE_IP +
                ':' +
                window.config.STATIC_PREVIEW_PORT +
                '/media' +
                addition.person_avatar_url;
            fileList = [
                {
                    uid: -1,
                    name: avatar_urlName,
                    status: 'done',
                    url: avatar_url,
                    thumbUrl: avatar_url
                }
            ];
        }
        // 上传用户签名
        let autographList = [];
        if (
            addition.relative_signature_url &&
            addition.relative_signature_url !== STATIC_UPLOAD_API
        ) {
            const avatar_urlName3 = addition.relative_signature_url
                .split('/')
                .pop();
            const avatar_url3 =
                window.config.STATIC_FILE_IP +
                ':' +
                window.config.STATIC_PREVIEW_PORT +
                '/media' +
                addition.relative_signature_url;
            autographList = [
                {
                    uid: -1,
                    name: avatar_urlName3,
                    status: 'done',
                    url: avatar_url3,
                    thumbUrl: avatar_url3
                }
            ];
        }
        // 上传身份证正面
        let fileList1 = [];
        let id_image_url = '';
        let id_image_urlName;
        if (addition.id_image && addition.id_image[0]) {
            if (addition.id_image[0].name && addition.id_image[0].filepath) {
                id_image_urlName = addition.id_image[0].name;
                const id_img = addition.id_image[0].filepath.split('/media')[1];
                const id_imgs =
                    window.config.STATIC_FILE_IP +
                    ':' +
                    window.config.STATIC_PREVIEW_PORT +
                    '/media' +
                    id_img;
                id_image_url = id_imgs || addition.id_image[0].thumbUrl;
                fileList1 = [
                    {
                        uid: 1,
                        name: id_image_urlName,
                        status: 'done',
                        url: id_image_url,
                        thumbUrl: id_image_url
                    }
                ];
            }
        }

        // 上传身份证发面
        let fileList2 = [];
        let id_image_url1 = '';
        let id_image_urlName1;
        if (addition.id_image && addition.id_image[1]) {
            if (addition.id_image[1].name && addition.id_image[1].filepath) {
                const id_img = addition.id_image[1].filepath.split('/media')[1];
                const id_imgs =
                    window.config.STATIC_FILE_IP +
                    ':' +
                    window.config.STATIC_PREVIEW_PORT +
                    '/media' +
                    id_img;
                id_image_urlName1 = addition.id_image[1].name;
                id_image_url1 = id_imgs || addition.id_image[1].thumbUrl;
                fileList2 = [
                    {
                        uid: 2,
                        name: id_image_urlName1,
                        status: 'done',
                        url: id_image_url1,
                        thumbUrl: id_image_url1
                    }
                ];
            }
        }
        let marginTops = '';
        if (!user.is_superuser) {
            marginTops = '55px';
        }
        return (
            <div>
                {addition.visible && (
                    <Modal
                        title={'新增人员'}
                        visible
                        className='large-modal'
                        width='80%'
                        maskClosable={false}
                        key={this.state.newKey}
                        onOk={this.save.bind(this)}
                        onCancel={this.cancel.bind(this)}
                    >
                        <Form>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <FormItem
                                        {...Addition.layout}
                                        label='用户名:'
                                    >
                                        {getFieldDecorator('UserName', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入用户名，且不超过15位',
                                                    max: 15
                                                }
                                            ]
                                        })(
                                            <Input
                                                placeholder='请输入用户名'
                                                onChange={changeAdditionField.bind(
                                                    this,
                                                    'username'
                                                )}
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...Addition.layout}
                                        label='姓名:'
                                    >
                                        {getFieldDecorator('FullName', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入姓名'
                                                }
                                            ]
                                        })(
                                            <Input
                                                placeholder='请输入姓名'
                                                onChange={changeAdditionField.bind(
                                                    this,
                                                    'person_name'
                                                )}
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...Addition.layout}
                                        label='性别:'
                                    >
                                        {getFieldDecorator('sexName', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择性别'
                                                }
                                            ]
                                        })(
                                            <Select
                                                placeholder='请选择性别'
                                                onChange={changeAdditionField.bind(
                                                    this,
                                                    'gender'
                                                )}
                                                style={{ width: '100%' }}
                                            >
                                                <Option key='女' value='女'>女</Option>
                                                <Option key='男' value='男'>男</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...Addition.layout}
                                        label='身份证号码:'
                                    >
                                        {getFieldDecorator('idcard', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入身份证号码'
                                                }
                                            ]
                                        })(
                                            <Input
                                                placeholder='请输入身份证号码'
                                                onChange={changeAdditionField.bind(
                                                    this,
                                                    'id_num'
                                                )}
                                            />
                                        )}
                                    </FormItem>
                                    {(user.is_superuser) ? (
                                        <FormItem
                                            {...Addition.layout}
                                            label='部门编码'
                                        >
                                            <Input
                                                placeholder='部门编码'
                                                value={addition.org_code}
                                                readOnly
                                            />
                                        </FormItem>
                                    ) : (
                                        ''
                                    )}
                                    <FormItem
                                        {...Addition.layout}
                                        label='密码:'
                                    >
                                        {getFieldDecorator('PassWord', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入密码，且不超过15位',
                                                    max: 15
                                                }
                                            ]
                                        })(
                                            <Input
                                                placeholder='请输入密码'
                                                onChange={changeAdditionField.bind(
                                                    this,
                                                    'password'
                                                )}
                                            />
                                        )}
                                    </FormItem>

                                    <FormItem {...Addition.layout} label='标段'>
                                        <Select
                                            placeholder='标段'
                                            value={
                                                addition.id
                                                    ? addition.sections
                                                    : section
                                            }
                                            onChange={this.changeSection.bind(
                                                this
                                            )}
                                            // mode='multiple'
                                            style={{ width: '100%' }}
                                        >
                                            {units
                                                ? units.map(item => {
                                                    return (
                                                        <Option
                                                            key={item.code}
                                                            value={item.code}
                                                        >
                                                            {item.name}
                                                        </Option>
                                                    );
                                                })
                                                : ''}
                                        </Select>
                                    </FormItem>
                                    <div style={{ marginLeft: '25%' }}>
                                        <Upload
                                            name='file'
                                            multiple
                                            accept={fileTypes}
                                            // showUploadList: false,
                                            action={UPLOAD_API}
                                            listType='picture'
                                            data={file => ({
                                                name: file.fileName,
                                                a_file: file
                                            })}
                                            onChange={this.uploadChange.bind(
                                                this
                                            )}
                                            defaultFileList={fileList}
                                            disabled={
                                                fileList && fileList.length
                                                    ? this.props.getImgBtns ===
                                                      true
                                                        ? this.props.getImgBtns
                                                        : this.props
                                                            .getImgBtns !==
                                                          false
                                                    : this.props.getImgBtns
                                            }
                                        >
                                            <Button>
                                                <Icon type='upload' />
                                                <span>上传用户头像</span>
                                            </Button>
                                        </Upload>
                                    </div>

                                    <div
                                        style={{
                                            marginLeft: '25%',
                                            marginTop: '30px'
                                        }}
                                    >
                                        <Upload
                                            name='file'
                                            multiple
                                            accept={fileTypes}
                                            // showUploadList: false,
                                            action={UPLOAD_API}
                                            listType='picture'
                                            data={file => ({
                                                name: file.fileName,
                                                a_file: file
                                            })}
                                            onChange={this.uploadChangew.bind(
                                                this
                                            )}
                                            defaultFileList={autographList}
                                            disabled={
                                                autographList &&
                                                autographList.length
                                                    ? this.props
                                                        .getAutographBtns ===
                                                      true
                                                        ? this.props
                                                            .getAutographBtns
                                                        : this.props
                                                            .getAutographBtns !==
                                                          false
                                                    : this.props
                                                        .getAutographBtns
                                            }
                                        >
                                            <Button>
                                                <Icon type='upload' />
                                                <span>上传用户签名</span>
                                            </Button>
                                        </Upload>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...Addition.layout} label='邮箱'>
                                        <Input
                                            placeholder='请输入邮箱'
                                            value={addition.email}
                                            onChange={changeAdditionField.bind(
                                                this,
                                                'email'
                                            )}
                                        />
                                    </FormItem>
                                    <FormItem
                                        {...Addition.layout}
                                        label='手机号码:'
                                    >
                                        {getFieldDecorator('telephone', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入手机号码'
                                                }
                                            ]
                                        })(
                                            <Input
                                                placeholder='请输入手机号码'
                                                onChange={changeAdditionField.bind(
                                                    this,
                                                    'person_telephone'
                                                )}
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...Addition.layout}
                                        label='职务:'
                                    >
                                        {getFieldDecorator('titles', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择职务'
                                                }
                                            ]
                                        })(
                                            <Select
                                                placeholder='请选择职务'
                                                onChange={changeAdditionField.bind(
                                                    this,
                                                    'title'
                                                )}
                                                style={{ width: '100%' }}
                                            >
                                                {this.renderTitle()}
                                            </Select>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...Addition.layout}
                                        label='角色:'
                                    >
                                        {getFieldDecorator('rolesNmae', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择角色'
                                                }
                                            ]
                                        })(
                                            <Select
                                                placeholder='请选择角色'
                                                optionFilterProp='children'
                                                filterOption={(input, option) =>
                                                    option.props.children
                                                        .toLowerCase()
                                                        .indexOf(
                                                            input.toLowerCase()
                                                        ) >= 0
                                                }
                                                onChange={this.changeRoles.bind(
                                                    this
                                                )}
                                                // mode='multiple'
                                                style={{ width: '100%' }}
                                            >
                                                {this.renderContent()}
                                            </Select>
                                        )}
                                    </FormItem>
                                    {(user.is_superuser || userIsDocument) ? (
                                        <FormItem
                                            {...Addition.layout}
                                            label='部门名称'
                                        >
                                            <Input
                                                placeholder='部门名称'
                                                value={addition.organizationName}
                                                readOnly
                                            />
                                        </FormItem>
                                    ) : (
                                        ''
                                    )}
                                    <div
                                        style={{
                                            marginLeft: '25%',
                                            marginTop: marginTops
                                        }}
                                    >
                                        <Upload
                                            name='file'
                                            multiple
                                            accept={fileTypes}
                                            action={UPLOAD_API}
                                            listType='picture'
                                            data={file => ({
                                                name: file.fileName,
                                                a_file: file
                                            })}
                                            onChange={this.uploadChanges.bind(
                                                this
                                            )}
                                            defaultFileList={fileList1}
                                            disabled={
                                                fileList1 && fileList1.length
                                                    ? this.props
                                                        .getImgNumBtns === true
                                                        ? this.props
                                                            .getImgNumBtns
                                                        : this.props
                                                            .getImgNumBtns !==
                                                          false
                                                    : this.props.getImgNumBtns
                                            }
                                        >
                                            <Button>
                                                <Icon type='upload' />
                                                <span>上传身份证正面照片</span>
                                            </Button>
                                        </Upload>
                                    </div>
                                    <div
                                        style={{
                                            marginLeft: '25%',
                                            marginTop: '30px'
                                        }}
                                    >
                                        <Upload
                                            name='file'
                                            multiple
                                            accept={fileTypes}
                                            // className='form-item-required'
                                            // showUploadList: false,
                                            action={UPLOAD_API}
                                            listType='picture'
                                            data={file => ({
                                                name: file.fileName,
                                                a_file: file
                                            })}
                                            onChange={this.uploadChangea.bind(
                                                this
                                            )}
                                            defaultFileList={fileList2}
                                            disabled={
                                                fileList2 && fileList2.length
                                                    ? this.props
                                                        .getImgNegatives ===
                                                      true
                                                        ? this.props
                                                            .getImgNegatives
                                                        : this.props
                                                            .getImgNegatives !==
                                                          false
                                                    : this.props.getImgNegatives
                                            }
                                        >
                                            <Button>
                                                <Icon type='upload' />
                                                <span>上传身份证反面照片</span>
                                            </Button>
                                        </Upload>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                )}
            </div>
        );
    }

    // 获取项目的标段
    getUnits (sections) {
        const {
            platform: { tree = {} }
        } = this.props;
        let bigTreeList = tree.bigTreeList;
        let units = [];

        sections.map((section) => {
            let name = getSectionNameBySection(section, bigTreeList);
            units.push({
                code: section,
                name: name
            });
        });
        return units;
    }

    changeRoles (value) {
        const {
            actions: { changeAdditionField }
        } = this.props;
        changeAdditionField('roles', [value]);
    }
    changeSection (value) {
        const {
            actions: { changeAdditionField }
        } = this.props;
        this.setState({
            section: value
        });
        changeAdditionField('sections', [value]);
    }
    changeChange_all (value) {
        const {
            actions: { changeAdditionField }
        } = this.props;
        this.setState({ change_alValue: value });
        changeAdditionField('change_all', value);
    }

    save = async () => {
        const {
            addition = {},
            sidebar: { node } = {},
            actions: {
                postUser,
                clearAdditionField,
                getUsers,
                postUploadFilesImg,
                getImgBtn,
                postUploadNegative,
                getImgNegative,
                getAutographBtn,
                postUploadFilesNum,
                getImgNumBtn,
                postUploadAutograph,
                getTablePage
            }
        } = this.props;
        const {
            section
        } = this.state;
        const roles = addition.roles || [];
        if (this.props.fileList) {
            addition.person_avatar_url = this.props.fileList;
        } else {
            addition.person_avatar_url = addition.person_avatar_url;
        }
        if (this.props.postUploadAutographs) {
            addition.relative_signature_url = this.props.postUploadAutographs;
        } else {
            addition.relative_signature_url = addition.relative_signature_url;
        }
        // addition.id_image = [UploadFilesNums, UploadNegatives];
        addition.id_image = [];
        if (!/^[\w@\.\+\-_]+$/.test(addition.username)) {
            message.warn('请输入英文字符、数字');
        } else {
            this.props.form.validateFields(async (err, values) => {
                if (!err) {
                    let postUserPostData = {
                        is_person: true,
                        username: addition.username,
                        email: addition.email || '',
                        password: addition.password,
                        account: {
                            person_code: addition.code,
                            person_name: addition.person_name,
                            person_type: 'C_PER',
                            person_avatar_url:
                                this.props.fileList || '',
                            person_signature_url:
                                this.props.postUploadAutographs || '',
                            organization: {
                                pk: node.pk,
                                code: node.code,
                                obj_type: 'C_ORG',
                                rel_type: 'member',
                                name: node.name
                            }
                        },
                        tags: addition.tags || [],
                        sections: addition.id
                            ? addition.sections
                            : [section],
                        groups: roles.map(role => +role),
                        is_active: true,
                        // black_remark: addition.black_remark,
                        id_num: addition.id_num,
                        // is_black: 0,
                        // 取消身份证照片限制
                        // id_image: [UploadFilesNums, UploadNegatives],
                        id_image: [],
                        basic_params: {
                            info: {
                                电话: addition.person_telephone || '',
                                性别: addition.gender || '',
                                技术职称: addition.title || '',
                                phone: addition.person_telephone || '',
                                sex: addition.gender || '',
                                duty: ''
                            }
                        },
                        extra_params: {},
                        title: addition.title || ''
                    };
                    // 先进行实名认证再注册用户
                    let realNameData = await RealName(addition);
                    console.log('realNameData', realNameData);
                    let userData = await postUser({}, postUserPostData);
                    if (userData.code === 1) {
                        const msgs = JSON.parse(userData.msg);
                        if (
                            msgs.status === 400 &&
                                    msgs.error === 'This id_num is blacklist'
                        ) {
                            message.warning('身份证号已经加入黑名单');
                            return;
                        } else {
                            message.info('新增人员成功');
                        }
                        await clearAdditionField();
                        await postUploadFilesImg();
                        await postUploadFilesNum();
                        await postUploadNegative();
                        await postUploadAutograph();
                        await getAutographBtn();
                        await getImgBtn();
                        await getImgNumBtn();
                        await getImgNegative();
                        const codes = Addition.collect(node);
                        let paget = '';
                        const totals = this.props.getTablePages.total;
                        if (totals >= 9) {
                            if (totals.toString().length > 1) {
                                const strs1 = totals.toString();
                                const strs2 = strs1.substring(
                                    0,
                                    strs1.length - 1
                                );
                                paget = strs2 * 1 + 1;
                            } else {
                                paget = 1;
                            }
                        } else {
                            paget = 1;
                        }
                        let uerList = await getUsers({}, { org_code: codes, page: paget });
                        let pagination = {
                            current: paget,
                            total: uerList.count
                        };
                        getTablePage(pagination);
                        this.setState({
                            newKey: Math.random()
                        });
                    } else {
                        if (userData.code === 2) {
                            message.warn('用户名已存在！');
                        } else {
                            message.warn('服务器端报错！');
                        }
                    }
                }
            });
        }
    }

    cancel () {
        const {
            actions: {
                clearAdditionField,
                getImgBtn,
                getImgNumBtn,
                getSwitch,
                getImgNegative,
                getAutographBtn
            }
        } = this.props;
        getImgBtn();
        getImgNumBtn();
        getImgNegative();
        getAutographBtn();
        getSwitch();
        this.setState({
            newKey: Math.random(),
            idImgF: true,
            idImgZ: true
        });
        clearAdditionField();
    }

    static collect = (node = {}) => {
        const { code } = node;
        let rst = [];
        rst.push(code);
        return rst;
    };

    static layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    static layoutT = {
        labelCol: { span: 18 },
        wrapperCol: { span: 6 }
    };
    static layoutR = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
    };
}
export default Form.create()(Addition);
