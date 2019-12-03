import React, { Component } from 'react';
import { Tree, Button, DatePicker, Spin, Checkbox, Modal, Row } from 'antd';
import L from 'leaflet';
import './DeviceTree.less';
import moment from 'moment';
import DeviceDetail from './DeviceDetail';
import { handleLocationDeviceData, getIconType, genPopUpContent } from '../../auth';
// 机械图片
import deviceExcavatorImg from './DeviceImgs/挖掘机.png';
import deviceLoaderImg from './DeviceImgs/装载机.png';
import deviceRollerImg from './DeviceImgs/压路机.png';
import deviceRammerImg from './DeviceImgs/打夯机.png';
import deviceDumpTruckImg from './DeviceImgs/自卸汽车.png';
import deviceCraneImg from './DeviceImgs/吊车.png';
import deviceFogGunTruckImg from './DeviceImgs/雾炮车.png';
import deviceDitchingMachineImg from './DeviceImgs/开沟机.png';
import deviceSprinklerImg from './DeviceImgs/洒水车.png';
import deviceDiggerImg from './DeviceImgs/挖坑机.png';

const { RangePicker } = DatePicker;

export default class DeviceTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            timeType: 'today',
            searchData: [],
            deviceProgress: true, // 正在进行
            deviceComplete: false, // 已完成
            deviceMarkerLayerList: {}, // 机械图标图层List
            deviceSearchData: [],
            // 机械类型的点击状态，展示是否选中的图片
            deviceExcavator: true,
            deviceLoader: true,
            deviceRoller: true,
            deviceRammer: true,
            deviceDumpTruck: true,
            deviceCrane: true,
            deviceFogGunTruck: true,
            deviceDitchingMachine: true,
            deviceSprinkler: true,
            deviceDigger: true,
            // 机械详情弹窗
            deviceMess: {}, // 机械详情
            isShowDevice: false // 是否显示机械详情弹窗

        };
    }

    // 机械类型
    deviceTypeOptions = [
        {
            id: 'deviceExcavator',
            label: '挖掘机',
            img: deviceExcavatorImg
        },
        {
            id: 'deviceLoader',
            label: '装载机',
            img: deviceLoaderImg
        },
        {
            id: 'deviceRoller',
            label: '压路机',
            img: deviceRollerImg
        },
        {
            id: 'deviceRammer',
            label: '打夯机',
            img: deviceRammerImg
        },
        {
            id: 'deviceDumpTruck',
            label: '自卸汽车',
            img: deviceDumpTruckImg
        },
        {
            id: 'deviceCrane',
            label: '吊车',
            img: deviceCraneImg
        },
        {
            id: 'deviceFogGunTruck',
            label: '雾炮车',
            img: deviceFogGunTruckImg
        },
        {
            id: 'deviceDitchingMachine',
            label: '开沟机',
            img: deviceDitchingMachineImg
        },
        {
            id: 'deviceSprinkler',
            label: '洒水车',
            img: deviceSprinklerImg
        },
        {
            id: 'deviceDigger',
            label: '挖坑机',
            img: deviceDiggerImg
        }
    ]
    componentDidMount = async () => {
        const {
            deviceTreeDataDay
        } = this.props;
        try {
            if (deviceTreeDataDay && deviceTreeDataDay instanceof Array && deviceTreeDataDay.length >= 0) {
                await this.handleDeviceSearchData(deviceTreeDataDay);
            }
            // 机械点击事件
            document.querySelector('.leaflet-popup-pane').addEventListener('click', this.handleDeviceModalOk);
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }
    componentWillUnmount = async () => {
        try {
            await this.handleRemoveAllDeviceLayer();
            document.querySelector('.leaflet-popup-pane').removeEventListener('click', this.handleDeviceModalOk);
        } catch (e) {
            console.log('componentWillUnmount', e);
        }
    }
    handleDeviceModalOk = async (e) => {
        const {
            deviceSearchData
        } = this.state;
        let target = e.target;
        // 绑定机械详情点击事件
        if (target.getAttribute('class') === 'btnViewDevice') {
            let idDevice = target.getAttribute('data-id');
            let device = null;
            let deviceTreeList = [];
            if (deviceSearchData && deviceSearchData.length > 0) {
                deviceTreeList = deviceSearchData;
            }

            deviceTreeList.forEach(v => {
                if (!device) {
                    device = v.children.find(v1 => v1.key === idDevice);
                }
            });
            if (device && device.properties && device.properties.images) {
                this.setState({
                    deviceMess: device.properties,
                    isShowDevice: true
                });
            }
        }
    }
    // 搜索之后的机械数据
    handleDeviceSearchData = (searchData) => {
        this.setState({
            deviceSearchData: searchData,
            searchData
        }, () => {
            this.handleDeviceTypeAddLayer();
        });
    }
    // 机械加载图层
    handleDeviceTypeAddLayer = async () => {
        const {
            deviceSearchData,
            deviceMarkerLayerList
        } = this.state;
        const {
            deviceTreeData,
            map
        } = this.props;
        try {
            let checkedKeys = [];
            this.handleRemoveAllDeviceLayer();
            this.deviceTypeOptions.map((option) => {
                if (this.state[option.id]) {
                    checkedKeys.push(option.label);
                }
            });
            let checkedData = [];
            if (deviceSearchData) {
                checkedData = deviceSearchData;
            } else {
                checkedData = deviceTreeData;
            }
            checkedData.map((deviceData) => {
                checkedKeys.map((checkedKey) => {
                    if (deviceData && deviceData.key === checkedKey) {
                        let children = deviceData.children;
                        children.forEach((deviceData, index) => {
                            if (deviceMarkerLayerList[deviceData.key]) {
                                deviceMarkerLayerList[deviceData.key].addTo(map);
                            } else {
                                deviceMarkerLayerList[deviceData.key] = this._createMarker(deviceData);
                            }
                            if (index === children.length - 1) {
                                map.panTo(deviceData.geometry.coordinates);
                            }
                        });
                        this.setState({
                            deviceMarkerLayerList
                        });
                    }
                });
            });
        } catch (e) {
            console.log('handleDeviceTypeAddLayer', e);
        }
    }
    // 已完成
    handleDeviceComplete = (e) => {
        this.setState({
            deviceComplete: e.target.checked,
            deviceProgress: !e.target.checked
        }, () => {
            this.query();
        });
    }
    // 正在进行
    handleDeviceProgress = (e) => {
        this.setState({
            deviceProgress: e.target.checked,
            deviceComplete: !e.target.checked
        }, () => {
            this.query();
        });
    }
    handleTimeChange = (e) => {
        const {
            deviceComplete
        } = this.state;
        let {
            deviceTreeData = []
        } = this.props;
        try {
            let target = e.target;
            let timeType = target.getAttribute('id');
            this.setState({
                timeType
            });
            let stime = '';
            let etime = '';
            if (timeType === 'custom') {
                return;
            } else if (timeType === 'all') {
                // 如果没有设置时间  且status为初始状态  则直接获取redux的数据  不用query
                this.setState({
                    stime,
                    etime
                }, () => {
                    if (deviceTreeData && deviceTreeData instanceof Array && deviceTreeData.length > 0) {
                        if (deviceComplete) {
                            this.query();
                        } else { // 如果之前发起过请求，直接赋值
                            this.handleDeviceSearchData(deviceTreeData);
                        }
                    } else {
                        this.query();
                    }
                });
                return;
            } else if (timeType === 'today') {
                stime = moment().format('YYYY-MM-DD 00:00:00');
                etime = moment().format('YYYY-MM-DD 23:59:59');
            } else if (timeType === 'week') {
                stime = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
                etime = moment().format('YYYY-MM-DD 23:59:59');
            };
            this.setState({
                stime,
                etime
            }, () => {
                this.query();
            });
        } catch (e) {
            console.log('handleTimeChange', e);
        }
    }
    handleDateChange = (value) => {
        this.setState({
            stime: value[0] ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            etime: value[1] ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss') : ''
        }, () => {
            this.query();
        });
    }
    query = async () => {
        const {
            actions: {
                getLocationDevices,
                getDeviceTree,
                getDeviceTreeLoading
            },
            platform: {
                tree = {}
            },
            deviceTreeData
        } = this.props;
        const {
            stime,
            etime,
            timeType,
            deviceComplete,
            deviceProgress
        } = this.state;
        try {
            let thinClassTree = tree.thinClassTree;
            if (!stime && !etime && deviceProgress && deviceTreeData) {
                await this.handleDeviceSearchData(deviceTreeData);
                return;
            }
            await getDeviceTreeLoading(true);
            if (deviceProgress) {
                let content = [];
                let data = await getLocationDevices();

                if (data && data.content) {
                    content = data.content;
                }
                let devices = handleLocationDeviceData(content, thinClassTree);
                if (timeType === 'all') {
                    await getDeviceTree(devices);
                }
                await getDeviceTreeLoading(false);
                await this.handleDeviceSearchData(devices);
                this.setState({
                    searchData: devices
                });
            } else {
                let postdata = {
                    stime: stime,
                    etime: etime,
                    status: 2
                };
                let data = await getLocationDevices({}, postdata);
                if (data && data.content) {
                    let content = data.content;
                    let devices = handleLocationDeviceData(content, thinClassTree);
                    await getDeviceTreeLoading(false);
                    await this.handleDeviceSearchData(devices);
                    this.setState({
                        searchData: devices
                    });
                }
            }
        } catch (e) {
            console.log('queryDevice', e);
        }
    }

    // 机械选择类型
    handleDeviceTypeButton (option) {
        try {
            this.setState({
                [option.id]: !this.state[option.id]
            }, () => {
                this.handleDeviceTypeAddLayer();
            });
        } catch (e) {
            console.log('handleDeviceTypeButton', e);
        }
    }
    // 去除全部机械图层
    handleRemoveAllDeviceLayer = () => {
        const {
            map
        } = this.props;
        const {
            deviceMarkerLayerList // 机械图标图层List
        } = this.state;
        for (let v in deviceMarkerLayerList) {
            map.removeLayer(deviceMarkerLayerList[v]);
        }
    }
    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
        const {
            map
        } = this.props;
        try {
            if (
                !geo.geometry.coordinates[0] ||
                !geo.geometry.coordinates[1]
            ) {
                return;
            }
            let iconType = L.divIcon({
                className: getIconType(geo.properties.iconType)
            });
            let marker = L.marker(geo.geometry.coordinates, {
                icon: iconType,
                title: geo.properties.name
            });
            marker.bindPopup(
                L.popup({ maxWidth: 240 }).setContent(
                    genPopUpContent(geo)
                )
            );
            marker.addTo(map);
            return marker;
        } catch (e) {
            console.log('_createMarker', e);
        }
    }
    // 退出机械详情查看
    handleCancelVisible () {
        this.setState({
            isShowDevice: false,
            deviceMess: ''
        });
    }
    render () {
        let {
            deviceTreeData = [],
            deviceTreeLoading = false,
            menuTreeVisible
        } = this.props;
        const {
            timeType,
            stime,
            etime,
            searchData,
            deviceProgress,
            deviceComplete,
            isShowDevice
        } = this.state;
        let contents = [];
        if (!etime && !stime && deviceComplete) {
            for (let j = 0; j < deviceTreeData.length; j++) {
                const element = deviceTreeData[j];
                if (element !== undefined) {
                    contents.push(element);
                }
            }
        } else {
            for (let j = 0; j < searchData.length; j++) {
                const element = searchData[j];
                if (element !== undefined) {
                    contents.push(element);
                }
            }
        };

        return (
            <div>
                {
                    menuTreeVisible
                        ? (
                            <div>
                                <div className='DeviceTree-menuPanel'>
                                    <aside className='DeviceTree-aside' draggable='false'>
                                        <div className='DeviceTree-asideTree'>
                                            <Spin spinning={deviceTreeLoading}>
                                                {/* <div className='DeviceTree-button'>
                                                    <Checkbox className='DeviceTree-button-layout'
                                                        checked={deviceProgress}
                                                        onChange={this.handleDeviceProgress.bind(this)}>
                                                        正进行
                                                    </Checkbox>
                                                    <Checkbox className='DeviceTree-button-layout'
                                                        checked={deviceComplete}
                                                        onChange={this.handleDeviceComplete.bind(this)}>
                                                        已完成
                                                    </Checkbox>

                                                </div>
                                                <div className='DeviceTree-button'>
                                                    <Button className='DeviceTree-button-layout' style={{ marginRight: 10 }}
                                                        type={timeType === 'all' ? 'primary' : 'default'}
                                                        id='all' onClick={this.handleTimeChange.bind(this)}>
                                                        全部
                                                    </Button>
                                                    <Button className='DeviceTree-button-layout' id='today'
                                                        type={timeType === 'today' ? 'primary' : 'default'}
                                                        onClick={this.handleTimeChange.bind(this)}>
                                                        今天
                                                    </Button>
                                                </div>
                                                <div className='DeviceTree-button'>
                                                    <Button className='DeviceTree-button-layout' style={{ marginRight: 10 }}
                                                        type={timeType === 'week' ? 'primary' : 'default'}
                                                        id='week' onClick={this.handleTimeChange.bind(this)}>
                                                        一周内
                                                    </Button>
                                                    <Button className='DeviceTree-button-layout' id='custom'
                                                        type={timeType === 'custom' ? 'primary' : 'default'}
                                                        onClick={this.handleTimeChange.bind(this)}>
                                                        自定义
                                                    </Button>
                                                </div> */}
                                                {
                                                    timeType === 'custom'
                                                        ? <RangePicker
                                                            style={{ width: 220, marginBottom: 10 }}
                                                            showTime={{ format: 'YYYY-MM-DD HH:mm:ss' }}
                                                            format='YYYY-MM-DD HH:mm:ss'
                                                            placeholder={['Start Time', 'End Time']}
                                                            onChange={this.handleDateChange.bind(this)}
                                                        />
                                                        : ''
                                                }
                                                <div className='DeviceTree-statis-layout'>
                                                    <span style={{ verticalAlign: 'middle' }}>类型</span>
                                                    <span className='DeviceTree-data-text'>
                                                        数量
                                                    </span>
                                                </div>
                                                <div>
                                                    {
                                                        contents.map((content) => {
                                                            return (
                                                                <Row className='DeviceTree-mrg10' key={content.key}>
                                                                    <span style={{ verticalAlign: 'middle' }}>{content.properties.name}</span>
                                                                    <span className='DeviceTree-data-text'>
                                                                        {content.children.length}
                                                                    </span>
                                                                </Row>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            </Spin>
                                        </div>
                                    </aside>
                                </div>
                                <div>
                                    <div className='DeviceTree-menuSwitchDeviceTypeLayout'>
                                        {
                                            this.deviceTypeOptions.map((option) => {
                                                return (
                                                    <div style={{ display: 'inlineBlock', marginTop: 10, height: 20 }} key={option.id}>
                                                        <p className='DeviceTree-menuLabel'>{option.label}</p>
                                                        <img src={option.img}
                                                            title={option.label}
                                                            className='DeviceTree-rightMenuDeviceTypeImgLayout' />
                                                        <a className={this.state[option.id] ? 'DeviceTree-rightMenuDeviceTypeSelLayout' : 'DeviceTree-rightMenuDeviceTypeUnSelLayout'}
                                                            title={option.label}
                                                            key={option.id}
                                                            onClick={this.handleDeviceTypeButton.bind(this, option)} />
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        ) : ''
                }
                {
                    isShowDevice
                        ? <DeviceDetail
                            {...this.props}
                            {...this.state}
                            onCancel={this.handleCancelVisible.bind(this)}
                        /> : ''
                }
            </div>
        );
    }
}
