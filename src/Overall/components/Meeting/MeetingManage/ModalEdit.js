import React, { Component } from 'react';
import {
    DatePicker,
    Notification,
    Input,
    Modal,
    Form,
    message
} from 'antd';
import moment from 'moment';
import L from 'leaflet';
import { formItemLayout, getUser } from '_platform/auth';
import './index.less';
import {
    WMSTILELAYERURL,
    TILEURLS
} from '_platform/api';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
let markerUI;
class ModalEdit extends Component {
    constructor (props) {
        super(props);
        this.state = {
            visibleMap: false,
            lat: '',
            lng: '',
            WKT: 'POINT(0 0)'
        };
        this.handleCancel = this.handleCancel.bind(this); // 取消创建
        this.handleOk = this.handleOk.bind(this); // 确认修改
    }
    async componentDidMount () {
        this.getDetails();
    }
    initMap () {
        // 基础设置
        let mapInitialization = {
            center: [this.state.lat || 38.99042701799772, this.state.lng || 116.0396146774292],
            zoomControl: false,
            zoom: 13,
            minZoom: 15
        };
        mapInitialization.crs = L.CRS.EPSG4326;
        mapInitialization.attributionControl = false;
        this.map = L.map('mapid', mapInitialization);
        // 基础图层
        this.tileLayer = L.tileLayer(TILEURLS[1], {
            // subdomains: [3],
            subdomains: [0, 1, 2, 3, 4, 5, 6, 7], // 天地图有7个服务节点，代码中不固定使用哪个节点的服务，而是随机决定从哪个节点请求服务，避免指定节点因故障等原因停止服务的风险
            minZoom: 15,
            maxZoom: 17,
            zoomOffset: 1
        }).addTo(this.map);
        // 道路图层
        L.tileLayer(WMSTILELAYERURL, {
            // subdomains: [3],
            subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
            minZoom: 15,
            maxZoom: 17,
            zoomOffset: 1
        }).addTo(this.map);
        markerUI = new L.Marker([this.state.lat, this.state.lng]);
        this.map.addLayer(markerUI);
        this.map.on('click', async (e) => {
            if (markerUI) {
                this.map.removeLayer(markerUI);
            }
            let latGps = e.latlng.lat;
            let lngGps = e.latlng.lng;
            console.log('latGps', lngGps, latGps);
            // 添加标记
            markerUI = new L.Marker([latGps, lngGps]);
            this.map.addLayer(markerUI);
            const {
                form: { setFieldsValue },
                actions: { getLocationName, getGcjbyGps }
            } = this.props;
            // 转换坐标系
            let GcjbyGpData = await getGcjbyGps({
                locations: `${lngGps},${latGps}`
            });
            let lngGcj = '', latGcj = '';
            if (GcjbyGpData && GcjbyGpData.status === '1' && GcjbyGpData.locations) {
                let locationArr = GcjbyGpData.locations.split(',');
                lngGcj = locationArr[0];
                latGcj = locationArr[1];
            }
            console.log('lngGcj', lngGcj, latGcj);
            // 获取地理位置
            let locationData = await getLocationName({
                location: `${lngGcj},${latGcj}`
            });
            if (locationData && locationData.status === '1' && locationData.regeocode && locationData.regeocode.formatted_address) {
                setFieldsValue({
                    Location: locationData.regeocode.formatted_address
                });
                console.log('WKT', lngGps);
                this.setState({
                    lat: latGps,
                    lng: lngGps,
                    WKT: `POINT(${lngGps} ${latGps})`
                });
            }
        });
    }
    getDetails () {
        const {
            recordID,
            form: { setFieldsValue },
            actions: { getMeetingDetail }
        } = this.props;
        getMeetingDetail({
            ID: recordID
        }).then(rep => {
            setFieldsValue({
                timeArr: [moment(rep.StartTime), moment(rep.EndTime)],
                MeetingName: rep.MeetingName,
                Location: rep.Location,
                MeetingTheme: rep.MeetingTheme,
                Contacter: rep.Contacter,
                Phone: rep.Phone
            });
            this.setState({
                WKT: `POINT(${rep.X} ${rep.Y})`,
                lat: rep.Y,
                lng: rep.X
            });
        });
    }
    handleCancel () {
        this.props.handleCancel();
    }
    handleOk () {
        const {
            recordID,
            form: { validateFields },
            actions: { putMeeting },
            leftKeyCode = '',
            permission = false,
            parentOrgID = ''
        } = this.props;
        const { WKT, lat, lng } = this.state;
        console.log('WKT', WKT);
        validateFields((err, values) => {
            if (permission) {
                if (!leftKeyCode) {
                    Notification.error({
                        message: '请选择单位'
                    });
                    return;
                }
            } else {
                if (!parentOrgID) {
                    Notification.error({
                        message: '当前用户无组织机构，请重新登录'
                    });
                    return;
                }
            }
            if (lat === '' || lng === '') {
                message.warning('请务必在地图中选中会议位置');
                return;
            }
            if (!err) {
                let StartTime = '', EndTime = '';
                if (values.timeArr && values.timeArr.length > 0) {
                    StartTime = moment(values.timeArr[0]).format(dateFormat);
                    EndTime = moment(values.timeArr[1]).format(dateFormat);
                }
                let params = {
                    MeetingType: '日常会议',
                    ProjectCode: 'P193',
                    BelongSystem: '雄安森林大数据平台',
                    OrgID: permission ? leftKeyCode : parentOrgID,
                    ID: recordID || '',
                    Contacter: values.Contacter, // 联系人
                    Creater: getUser().ID || '',
                    StartTime,
                    EndTime,
                    Location: values.Location || '', // 位置名称
                    MeetingName: values.MeetingName || '',
                    MeetingTheme: values.MeetingTheme || '', // 会议简介
                    Phone: values.Phone || '',
                    WKT // 坐标
                };
                putMeeting({}, params).then(rep => {
                    if (rep && rep.code === 1) {
                        Notification.success({
                            message: '修改会议成功'
                        });
                        this.props.handleCancel();
                        this.props.onSearch();
                    } else {
                        Notification.error({
                            message: rep.msg || '操作失败'
                        });
                    }
                });
            }
        });
    }
    onVisibleMap () {
        this.setState({
            visibleMap: !this.state.visibleMap
        }, () => {
            if (this.state.visibleMap) {
                this.initMap();
            }
        });
    }
    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        return (
            <div>
                <Modal
                    className='modal_Form'
                    title='编辑会议'
                    visible={this.props.showModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form
                        {...formItemLayout}
                    >
                        <FormItem
                            label='会议名称'
                        >
                            {
                                getFieldDecorator('MeetingName', {
                                    rules: [
                                        { required: true, message: '请务必填写此项' }
                                    ]
                                })(
                                    <Input
                                        style={{width: 350}}
                                        placeholder='请输入'
                                    />
                                )
                            }
                        </FormItem>
                        <FormItem
                            label='会议时间'
                        >
                            {
                                getFieldDecorator('timeArr', {
                                    rules: [
                                        { required: true, message: '请务必填写此项' }
                                    ]
                                })(
                                    <RangePicker
                                        showTime={{format: 'HH:mm:ss'}}
                                        format={dateFormat}
                                        placeholder={['开始时间', '结束时间']}
                                    />
                                )
                            }
                        </FormItem>
                        <FormItem
                            label='会议地点'
                        >
                            {
                                getFieldDecorator('Location', {
                                    rules: [
                                        { required: true, message: '请务必填写此项' }
                                    ]
                                })(
                                    <Input
                                        style={{width: 300}}
                                        placeholder='请输入'
                                    />
                                )
                            }
                            <div style={{display: 'inline-block'}} onClick={this.onVisibleMap.bind(this)}>
                                <span className='icon_location' />
                            </div>
                        </FormItem>
                        {/* 地图 */}
                        <div style={{display: this.state.visibleMap ? 'block' : 'none', width: '100%', height: 300, marginBottom: 20, overflow: 'hidden', border: '3px solid #ccc'}}>
                            <div id='mapid' style={{height: 300, width: '100%'}} />
                        </div>
                        <FormItem
                            label='会议议题'
                        >
                            {
                                getFieldDecorator('MeetingTheme', {

                                })(
                                    <TextArea
                                        rows='4'
                                        style={{width: 350}}
                                        placeholder='请输入'
                                    />
                                )
                            }
                        </FormItem>
                        <FormItem
                            label='会议联系人'
                        >
                            {
                                getFieldDecorator('Contacter', {

                                })(
                                    <Input
                                        style={{width: 350}}
                                        placeholder='请输入'
                                    />
                                )
                            }
                        </FormItem>
                        <FormItem
                            label='联系人电话'
                        >
                            {
                                getFieldDecorator('Phone', {
                                    validateTrigger: 'onBlur',
                                    rules: [
                                        { pattern: /^1\d{10}$/, message: '请填写11位手机号' }
                                    ]
                                })(
                                    <Input
                                        style={{width: 350}}
                                        placeholder='请输入'
                                    />
                                )
                            }
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}
export default Form.create()(ModalEdit);
