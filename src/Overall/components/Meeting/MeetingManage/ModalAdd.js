import React, { Component } from 'react';
import {
    Button,
    DatePicker,
    Notification,
    Input,
    Modal,
    Form,
    message
} from 'antd';
import moment from 'moment';
import L from 'leaflet';
import gcoord from 'gcoord';
import { formItemLayout, getUser } from '_platform/auth';
import {
    WMSTILELAYERURL,
    TILEURLS,
    XACOMPANYINITLEAFLET_API
} from '_platform/api';
import './index.less';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const AMap = window.AMap;
let markerUI;
class ModalAdd extends Component {
    constructor (props) {
        super(props);
        this.state = {
            visibleMap: false,
            imgUrl: './position_icon_03.png',
            lat: '',
            lng: '',
            WKT: 'POINT(0 0)',
            startTime: moment().format('YYYY-MM-DD HH:00:00'),
            endTime: moment().add(1, 'h').format('YYYY-MM-DD HH:00:00')
        };
        this.handleCancel = this.handleCancel.bind(this); // 取消创建
        this.handleOk = this.handleOk.bind(this); // 确认创建
    }
    async componentDidMount () {
        // this.initMap();
        let me = this;
        let userPositionData = '';
        let mapObj = new AMap.Map('mapid2');
        mapObj.plugin('AMap.Geolocation', function () {
            let geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, // 是否使用高精度定位，默认:true
                timeout: 10000, // 超过10秒后停止定位，默认：无穷大
                maximumAge: 0, // 定位结果缓存0毫秒，默认：0
                convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true, // 显示定位按钮，默认：true
                buttonPosition: 'LB', // 定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });
            mapObj.addControl(geolocation);
            let data = geolocation.getCurrentPosition();
            console.log('data', data);
            AMap.event.addListener(geolocation, 'complete', onComplete);// 返回定位信息
            AMap.event.addListener(geolocation, 'error', onError); // 返回定位出错信息
            function onComplete (data) {
                userPositionData = data;
                // data是具体的定位信息
                console.log('onComplete', data);
                if (me.map) {
                    if (userPositionData && userPositionData.type && userPositionData.type === 'complete') {
                        if (userPositionData.position && userPositionData.position.lat && userPositionData.position.lng) {
                            let center = [userPositionData.position.lat, userPositionData.position.lng];
                            me.map.panTo(center);
                        }
                    }
                }
                me.setState({
                    userPositionData
                });
            }
            function onError (data) {
                // data是具体的定位信息
                console.log('onError', data);
            }
        });
    }
    initMap = async () => {
        const {
            userPositionData
        } = this.state;
        const {
            form: { setFieldsValue },
            actions: {
                getLocationName
            }
        } = this.props;
        try {
            console.log('userPositionData', userPositionData);
            let locationData = '';
            if (this.map) {
                return;
                // await this.map.off();
                // await this.map.remove();
            }
            // 基础设置
            let mapInitialization = XACOMPANYINITLEAFLET_API;
            mapInitialization.crs = L.CRS.EPSG4326;
            mapInitialization.attributionControl = false;
            let userPositionLngGps = '';
            let userPositionLatGps = '';

            if (userPositionData && userPositionData.type && userPositionData.type === 'complete') {
                if (userPositionData.position && userPositionData.position.lat && userPositionData.position.lng) {
                    let result = gcoord.transform(
                        [userPositionData.position.lng, userPositionData.position.lat], // 经纬度坐标
                        gcoord.GCJ02, // 当前坐标系
                        gcoord.WGS84 // 目标坐标系
                    );
                    console.log('result', result);
                    userPositionLngGps = result[0];
                    userPositionLatGps = result[1];

                    mapInitialization.center = [userPositionLatGps, userPositionLngGps];
                    // 获取地理位置
                    locationData = await getLocationName({
                        location: `${userPositionData.position.lng},${userPositionData.position.lat}`
                    });
                }
            }

            this.map = L.map('mapid', mapInitialization);
            // 基础图层
            this.tileLayer = L.tileLayer(TILEURLS[1], {
                subdomains: [1, 2, 3], // 天地图有7个服务节点，代码中不固定使用哪个节点的服务，而是随机决定从哪个节点请求服务，避免指定节点因故障等原因停止服务的风险
                minZoom: 10,
                maxZoom: 17,
                zoomOffset: 1
            }).addTo(this.map);
            // 道路图层
            L.tileLayer(WMSTILELAYERURL, {
                subdomains: [1, 2, 3],
                minZoom: 10,
                maxZoom: 17,
                zoomOffset: 1
            }).addTo(this.map);
            if (locationData && locationData.status && locationData.status === '1' && locationData.regeocode && locationData.regeocode.formatted_address) {
                setFieldsValue({
                    Location: locationData.regeocode.formatted_address
                });
                this.setState({
                    LocationUrl: locationData.regeocode.formatted_address,
                    lat: userPositionLatGps,
                    lng: userPositionLngGps,
                    WKT: `POINT(${userPositionLngGps} ${userPositionLatGps})`
                });
                markerUI = new L.Marker([userPositionLatGps, userPositionLngGps]);
                this.map.addLayer(markerUI);
            }
            this.map.on('click', async (e) => {
                if (markerUI) {
                    this.map.removeLayer(markerUI);
                }
                let latGps = e.latlng.lat;
                let lngGps = e.latlng.lng;
                // 添加标记
                console.log('latGps', lngGps, latGps);
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
                    this.setState({
                        LocationUrl: locationData.regeocode.formatted_address,
                        lat: latGps,
                        lng: lngGps,
                        WKT: `POINT(${lngGps} ${latGps})`
                    });
                }
            });
        } catch (e) {
            console.log('e', e);
        }
    }
    handleCancel () {
        this.props.handleCancel();
    }
    handleOk () {
        const {
            form: { validateFields },
            actions: { postMeeting }
        } = this.props;
        const { WKT, lat, lng } = this.state;
        validateFields((err, values) => {
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
                    Contacter: values.Contacter, // 联系人
                    Creater: getUser().ID || '',
                    StartTime,
                    EndTime,
                    Location: values.Location || '', // 位置名称
                    MeetingName: values.MeetingName || '', // 会议名称
                    MeetingTheme: values.MeetingTheme || '', // 会议简介
                    Phone: values.Phone || '',
                    WKT // 坐标
                };
                postMeeting({}, params).then(rep => {
                    if (rep && rep.code === 1) {
                        Notification.success({
                            message: '创建会议成功'
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

    _handleCreateMeasureOk () {

    }
    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        const {
            userPositionData,
            startTime,
            endTime
        } = this.state;
        console.log('userPositionData', userPositionData);

        return (
            <div>
                <Modal
                    className='modal_Form'
                    style={{width: 600}}
                    title='创建会议'
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
                                    initialValue: [
                                        moment(startTime, 'YYYY-MM-DD HH:00:00'),
                                        moment(endTime, 'YYYY-MM-DD HH:00:00')
                                    ],
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
                        <div style={{
                            display: this.state.visibleMap ? 'block' : 'none',
                            width: '100%',
                            height: 300,
                            marginBottom: 20,
                            overflow: 'hidden',
                            border: '3px solid #ccc'
                        }}>
                            <div id='mapid' style={{height: 300, width: '100%'}} />
                            <div id='mapid2' style={{display: 'none'}} />
                            <div>
                                <Button
                                    type='primary'
                                    style={{marginRight: 10}}
                                    onClick={this._handleCreateMeasureOk.bind(this)}>
                                    确定
                                </Button>
                            </div>
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
export default Form.create()(ModalAdd);
