import React, { Component } from 'react';
import { Tree, Button, DatePicker, Spin, Input } from 'antd';
import L from 'leaflet';
import moment from 'moment';
import {
    handleTrackData,
    getSectionName,
    getIconType,
    genPopUpContent
} from '../../auth';
import {
    trim
} from '_platform/auth';
import './TrackTree.less';
const TreeNode = Tree.TreeNode;
const { RangePicker } = DatePicker;
const Search = Input.Search;
export default class TrackTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            stime: moment().format('YYYY-MM-DD 00:00:00'),
            etime: moment().format('YYYY-MM-DD 23:59:59'),
            timeType: 'today',
            searchDateData: [],
            searchNameData: [],
            searchName: '',
            trackLayerList: {}, // 轨迹图层List
            trackMarkerLayerList: {} // 轨迹图标图层List
        };
        this.userDetailList = {}; // 人员信息List
    }
    genIconClass () {
        let icClass = '';
        let featureName = this.props.featureName;
        switch (featureName) {
            case 'geojsonFeature_track':
                icClass = 'tr-people';
                break;
            case 'geojsonFeature_risk':
                icClass = 'tr-hazard';
                break;
            case 'geojsonFeature_treetype':
                icClass = 'tr-area';
                break;
        }
        return icClass;
    }

    loop (data = [], loopTime) {
        const that = this;
        if (loopTime) {
            loopTime = loopTime + 1;
        } else {
            loopTime = 1;
        }
        if (loopTime > 1) {
            return (
                <TreeNode
                    title={data.CreateTime}
                    key={JSON.stringify(data)}
                    selectable={false}
                >
                    {data.children &&
                    data.children.map(m => {
                        return that.loop(m, loopTime);
                    })}
                </TreeNode>
            );
        } else {
            return (
                <TreeNode
                    title={data.Full_Name}
                    key={data.ID}
                    selectable={false}
                >
                    {data.children &&
                    data.children.map(m => {
                        return that.loop(m, loopTime);
                    })}
                </TreeNode>
            );
        }
    }
    componentDidMount = async () => {
        const {
            trackTreeDay
        } = this.props;
        if (trackTreeDay && trackTreeDay instanceof Array && trackTreeDay.length >= 0) {
            this.setState({
                searchDateData: trackTreeDay
            });
        }
    }
    componentWillUnmount = async () => {
        await this.handleRemoveAllTrackLayer();
    }

    render () {
        let {
            trackTree = [],
            trackTreeLoading
        } = this.props;
        const {
            timeType,
            stime,
            etime,
            searchDateData,
            searchNameData,
            searchName
        } = this.state;
        let contents = [];
        if (searchName) {
            contents = searchNameData;
        } else if (etime && stime) {
            for (let j = 0; j < searchDateData.length; j++) {
                const element = searchDateData[j];
                if (element !== undefined) {
                    contents.push(element);
                }
            }
        } else {
            for (let j = 0; j < trackTree.length; j++) {
                const element = trackTree[j];
                if (element !== undefined) {
                    contents.push(element);
                }
            }
        };
        return (
            <div>
                <Spin spinning={trackTreeLoading}>
                    <Search
                        className='TrackTree-search'
                        placeholder='人名搜索'
                        onSearch={this.searchUserName.bind(this)}
                    />
                    <div className='TrackTree-button'>
                        <Button className='TrackTree-button-layout' style={{marginRight: 10}}
                            type={timeType === 'all' ? 'primary' : 'default'}
                            id='all' onClick={this.handleTimeChange.bind(this)}>
                            全部
                        </Button>
                        <Button className='TrackTree-button-layout' id='today'
                            type={timeType === 'today' ? 'primary' : 'default'}
                            onClick={this.handleTimeChange.bind(this)}>
                            今天
                        </Button>
                    </div>
                    <div className='TrackTree-button'>
                        <Button className='TrackTree-button-layout' style={{marginRight: 10}}
                            type={timeType === 'week' ? 'primary' : 'default'}
                            id='week' onClick={this.handleTimeChange.bind(this)}>
                            一周内
                        </Button>
                        <Button className='TrackTree-button-layout' id='custom'
                            type={timeType === 'custom' ? 'primary' : 'default'}
                            onClick={this.handleTimeChange.bind(this)}>
                            自定义
                        </Button>
                    </div>
                    {
                        timeType === 'custom'
                            ? <RangePicker
                                style={{width: 220, marginBottom: 10}}
                                showTime={{ format: 'YYYY-MM-DD HH:mm:ss' }}
                                format='YYYY-MM-DD HH:mm:ss'
                                placeholder={['Start Time', 'End Time']}
                                onChange={this.handleDateChange.bind(this)}
                            />
                            : ''
                    }
                    <div className='TrackTree-statis-layout'>
                        <span style={{verticalAlign: 'middle'}}>人名</span>
                        <span className='TrackTree-data-text'>
                            次数
                        </span>
                    </div>
                    <div>
                        {
                            contents.map((content) => {
                                return (
                                    <div className='TrackTree-mrg10' key={content.ID}>
                                        <span style={{verticalAlign: 'middle'}}>{content.Full_Name}</span>
                                        <span className='TrackTree-data-text'>
                                            {content.children.length}
                                        </span>
                                    </div>
                                );
                            })
                        }
                    </div>
                </Spin>
            </div>

        );
    }

    searchUserName = (value) => {
        let {
            trackTree = []
        } = this.props;
        const {
            stime,
            etime,
            searchDateData
        } = this.state;
        // 如果没有搜索数据，则展示全部数据，并将地图上的图层清空
        value = trim(value);
        if (!value) {
            this.setState({
                searchNameData: [],
                searchName: ''
            });
            this.handleTrackLocation([]);
            return;
        }
        let contents = [];
        if (etime && stime) {
            for (let j = 0; j < searchDateData.length; j++) {
                const element = searchDateData[j];
                if (element !== undefined) {
                    contents.push(element);
                }
            }
        } else {
            for (let j = 0; j < trackTree.length; j++) {
                const element = trackTree[j];
                if (element !== undefined) {
                    contents.push(element);
                }
            }
        };
        let ckeckedData = [];
        let searchNameData = [];
        contents.map((content) => {
            let name = content.Full_Name;
            if (name.indexOf(value) !== -1) {
                searchNameData.push(content);
                if (content && content.children) {
                    ckeckedData = ckeckedData.concat(content.children);
                }
            }
        });
        this.handleTrackLocation(ckeckedData);
        this.setState({
            searchNameData,
            searchName: value
        });
    }

    handleTimeChange = (e) => {
        let {
            trackTree = []
        } = this.props;
        try {
            let target = e.target;
            let timeType = target.getAttribute('id');
            console.log('timeType', timeType);
            this.setState({
                timeType
            });
            let stime = '';
            let etime = '';
            if (timeType === 'custom') {
                return;
            } else if (timeType === 'all') {
                this.setState({
                    stime,
                    etime
                }, () => {
                    if (trackTree.length === 0) {
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
                getInspectRouter,
                getTrackTree,
                getTrackTreeLoading
            }
        } = this.props;
        const {
            stime,
            etime,
            timeType
        } = this.state;
        try {
            this.handleRemoveAllTrackLayer();
            await getTrackTreeLoading(true);
            let postdata = {
                stime: stime,
                etime: etime,
                status: 2
            };
            let routes = await getInspectRouter({}, postdata);
            let searchDateData = handleTrackData(routes);
            if (timeType === 'all') {
                await getTrackTree(searchDateData);
            }
            await getTrackTreeLoading(false);
            this.setState({
                searchDateData
            });
        } catch (e) {
            console.log('query', e);
        }
    }

    // 搜索人员姓名定位
    handleTrackLocation = async (ckeckedData) => {
        try {
            this.handleRemoveAllTrackLayer();
            for (let i = 0; i < ckeckedData.length; i++) {
                let child = ckeckedData[i];
                if (i === ckeckedData.length - 1) {
                    await this.handleTrackAddLayer(child, true);
                } else {
                    await this.handleTrackAddLayer(child, false);
                }
            }
        } catch (e) {
            console.log('handleTrackLocation', e);
        }
    }

    // 加载轨迹图层
    handleTrackAddLayer = async (data, isFocus) => {
        const {
            trackLayerList,
            trackMarkerLayerList
        } = this.state;
        const {
            actions: {
                getMapList,
                getUserDetail,
                getTrackTreeLoading
            },
            platform: {tree = {}},
            map
        } = this.props;
        try {
            await getTrackTreeLoading(true);
            let selectKey = data.ID;
            if (trackLayerList[selectKey]) {
                trackLayerList[selectKey].addTo(map);
                if (trackMarkerLayerList[selectKey]) {
                    trackMarkerLayerList[selectKey].addTo(map);
                }
                if (isFocus) {
                    await getTrackTreeLoading(false);
                    map.fitBounds(trackLayerList[selectKey].getBounds());
                }
            } else {
                let routes = await getMapList({ routeID: selectKey });
                if (!(routes && routes instanceof Array && routes.length > 0)) {
                    return;
                }
                let latlngs = [];
                routes.forEach(item => {
                    latlngs.push([item.Y, item.X]);
                });
                if (data && data.PatrolerUser && data.PatrolerUser.ID) {
                    let user = {};
                    if (this.userDetailList[data.PatrolerUser.ID]) {
                        user = this.userDetailList[data.PatrolerUser.ID];
                    } else {
                        user = await getUserDetail({id: data.PatrolerUser.ID});
                        this.userDetailList[data.PatrolerUser.ID] = user;
                    };
                    let sectionName = '';
                    if (user && user.Section) {
                        let bigTreeList = (tree && tree.bigTreeList) || [];
                        let section = user.Section;
                        sectionName = getSectionName(section, bigTreeList);
                    }

                    let iconData = {
                        geometry: {
                            coordinates: [latlngs[0][0], latlngs[0][1]],
                            type: 'Point'
                        },
                        key: selectKey,
                        properties: {
                            name: user.Full_Name ? user.Full_Name : user.User_Name,
                            phone: user.Phone ? user.Phone : '',
                            sectionName: sectionName,
                            type: 'track'
                        },
                        type: 'track'
                    };
                    let trackMarkerLayer = this._createMarker(iconData);
                    trackMarkerLayerList[selectKey] = trackMarkerLayer;
                }
                let polyline = L.polyline(latlngs, { color: 'red' }).addTo(
                    map
                );
                trackLayerList[selectKey] = polyline;
                if (isFocus) {
                    await getTrackTreeLoading(false);
                    map.fitBounds(polyline.getBounds());
                }
                this.setState({
                    trackLayerList,
                    trackMarkerLayerList
                });
            }
        } catch (e) {
            console.log('handleTrackAddLayer', e);
        }
    }

    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
        try {
            const {
                map
            } = this.props;
            if (
                !geo.geometry.coordinates[0] ||
                    !geo.geometry.coordinates[1]
            ) {
                return;
            }
            let iconType = L.divIcon({
                className: getIconType(geo.type)
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

    // 去除全部巡检路线图层
    handleRemoveAllTrackLayer = () => {
        const {
            map
        } = this.props;
        const {
            trackLayerList, // 轨迹图层List
            trackMarkerLayerList // 轨迹图标图层List
        } = this.state;
        for (let v in trackLayerList) {
            map.removeLayer(trackLayerList[v]);
        }
        for (let v in trackMarkerLayerList) {
            map.removeLayer(trackMarkerLayerList[v]);
        }
    }
}
