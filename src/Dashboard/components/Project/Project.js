import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../../store';
import { Radio, Button } from 'antd';
// import { CUS_TILEMAP } from '_platform/api';
import './Project.less';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const $ = window.$;
window.config = window.config || {};
@connect(
    state => {
        const { dashboard, platform } = state;
        return { ...dashboard, platform };
    },
    dispatch => ({
        actions: bindActionCreators(actions, dispatch)
    })
)
export default class Project extends Component {
    constructor (props) {
        super(props);
        this.state = {
            menuWidth: 200 /* 菜单宽度 */,
            isTwoScreenShow: 1
        };
        this.tileLayer = null;
        this.tileTreeLayerBasic = null;
        this.imgTileLayer = null;
        this.cvaTileLayer = null;
        this.map = null;
        this.map2 = null;
        /* 菜单宽度调整 */
        this.menu = {
            startPos: 0,
            isStart: false,
            tempMenuWidth: 0,
            count: 0,
            minWidth: 200,
            maxWidth: 500
        };
    }

    options = [
        {
            label: '区域地块',
            value: 'geojsonFeature_area',
            IconName: 'square'
        },
        {
            label: '巡检路线',
            value: 'geojsonFeature_track',
            IconUrl: require('../ImageIcon/people.png'),
            IconName: 'universal-access'
        },
        {
            label: '安全隐患',
            value: 'geojsonFeature_risk',
            IconUrl: require('../ImageIcon/risk.png'),
            IconName: 'warning'
        },
        {
            label: '树种筛选',
            value: 'geojsonFeature_treetype',
            IconName: 'square'
        },
        {
            label: '养护任务',
            value: 'geojsonFeature_curingTask',
            IconName: 'curingTask'
        },
        {
            label: '成活率',
            value: 'geojsonFeature_survivalRate'
        },
        {
            label: '工程影像',
            value: 'geojsonFeature_projectPic'
        }
    ];

    async componentDidMount () {
        this.initMap();
        this.initMap2();
        // 地图联动
        const maps = [this.map, this.map2];
        // 事件
        function maplink (e) {
            let _this = this;
            maps.map(function (t) {
                t.setView(_this.getCenter(), _this.getZoom());
            });
        }
        // 绑定
        maps.map(function (t) {
            // t.on({moveend:maplink,zoomend:maplink})
            t.on({ drag: maplink, zoom: maplink });
        });
    }

    WMSTileLayerUrl = window.config.WMSTileLayerUrl;
    subDomains = ['7'];
    tileUrls = {
        // 1: window.config.IMG_W,
        // 2: window.config.VEC_W,
        1: window.config.IMG_1,
        2: window.config.IMG_2,
        3: window.config.IMG_3,
        4: window.config.IMG_4,
        5: window.config.IMG_5,
        6: window.config.IMG_6,
        7: window.config.IMG_7
    };
    /* 初始化地图 */
    initMap () {
        this.map = L.map('mapid', window.config.initLeaflet);

        L.control.zoom({ position: 'bottomright' }).addTo(this.map);

        this.imgTileLayer = L.tileLayer(window.config.IMG_W, {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 20,
            storagetype: 0
        }).addTo(this.map);

        this.cvaTileLayer = L.tileLayer(`${window.config.WMSTileLayerUrl}`, {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 20,
            storagetype: 0
        }).addTo(this.map);

        this.tileLayer = L.tileLayer(this.tileUrls[1], {
            opacity: 1.0,
            subdomains: [1, 2, 3],
            minZoom: 12,
            maxZoom: 20,
            storagetype: 0,
            tiletype: 'arcgis'
        }).addTo(this.map);

        // 航拍影像
        // L.tileLayer(`${CUS_TILEMAP}/Layers/_alllayers/LE{z}/R{y}/C{x}.png`).addTo(this.map);
        // document.querySelector('#mapid').addEventListener('animationend', function(){
        //     this.map.invalidateSize();
        //     console.log('test');
        // });
    }
    initMap2 () {
        this.map2 = L.map('mapid2', window.config.initLeaflet);

        L.control.zoom({ position: 'bottomright' }).addTo(this.map2);

        this.imgTileLayer = L.tileLayer(window.config.IMG_W, {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 20,
            storagetype: 0
        }).addTo(this.map2);

        this.cvaTileLayer = L.tileLayer(`${window.config.WMSTileLayerUrl}`, {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 20,
            storagetype: 0
        }).addTo(this.map2);

        this.tileTreeLayerBasic = L.tileLayer(this.tileUrls[1], {
            opacity: 1.0,
            subdomains: [1, 2, 3],
            minZoom: 12,
            maxZoom: 20,
            storagetype: 0,
            tiletype: 'arcgis'
        }).addTo(this.map2);

        // 航拍影像
        // L.tileLayer(`${CUS_TILEMAP}/Layers/_alllayers/LE{z}/R{y}/C{x}.png`).addTo(this.map);
    }
    // 切换
    toggleTileLayer (e) {
        const index = e.target.value;
        console.log('index', index);
        this.tileLayer.setUrl(this.tileUrls[index]);
    }
    toggleTileLayer2 (e) {
        const index = e.target.value;
        console.log('index', index);
        this.tileTreeLayerBasic.setUrl(this.tileUrls[index]);
    }
    /* 显示隐藏地图marker */
    onEndResize (e) {
        this.menu.isStart = false;
    }
    onResizingMenu (e) {
        if (this.menu.isStart) {
            e.preventDefault();
            this.menu.count++;
            let ys = this.menu.count % 5;
            if (ys == 0 || ys == 1 || ys == 3 || ys == 4) return; // 降低事件执行频率
            let dx = e.clientX - this.menu.startPos;
            let menuWidth = this.menu.tempMenuWidth + dx;
            if (menuWidth > this.menu.maxWidth) menuWidth = this.menu.maxWidth;
            if (menuWidth < this.menu.minWidth) menuWidth = this.menu.minWidth;
            this.setState({ menuWidth: menuWidth });
        }
    }
    handleMenuButton (e) {
        const {
            actions: {
                switchDashboardCompoment
            }
        } = this.props;
        let target = e.target;
        let buttonID = target.getAttribute('id');
        if (buttonID !== 'geojsonFeature_projectPic') {
            switchDashboardCompoment(buttonID);
        }
    }
    render () {
        const {
            dashboardCompomentMenu
        } = this.props;
        return (
            <div className='project_map-container'>
                <div
                    ref='appendBody'
                    className='l-map project_r-main'
                    onMouseUp={this.onEndResize.bind(this)}
                    onMouseMove={this.onResizingMenu.bind(this)}
                >
                    <div className='dashboard-menuSwitchButton'>
                        {this.options.map(option => {
                            return (
                                <div className='dashboard-menuButtonLayout'>
                                    <Button
                                        type={dashboardCompomentMenu === option.value ? 'primary' : 'info'}
                                        size='large' id={option.value}
                                        onClick={this.handleMenuButton.bind(this)}>
                                        {option.label}
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                    <div className='project_treeControl3' style={{ zIndex: 888 }}>
                        <div>
                            <RadioGroup
                                defaultValue={1}
                                onChange={this.toggleTileLayer.bind(this)}
                                size='small'
                            >
                                <RadioButton value={1}>
                                    2017年11月15日
                                </RadioButton>
                                <RadioButton value={2}>
                                    2017年11月24日
                                </RadioButton>
                                <RadioButton value={3}>
                                    2017年12月01日
                                </RadioButton>
                                <RadioButton value={4}>
                                    2017年12月10日
                                </RadioButton>
                                <RadioButton value={5}>
                                    2017年12月13日
                                </RadioButton>
                                <RadioButton value={6}>
                                    2018年3月23日
                                </RadioButton>
                                <RadioButton value={7}>
                                    2018年5月4日
                                </RadioButton>
                            </RadioGroup>
                        </div>
                    </div>
                    <div className='project_treeControl2' style={{ zIndex: 888 }}>
                        <div>
                            <RadioGroup
                                defaultValue={1}
                                onChange={this.toggleTileLayer2.bind(this)}
                                size='small'
                            >
                                <RadioButton value={1}>
                                    2017年11月15日
                                </RadioButton>
                                <RadioButton value={2}>
                                    2017年11月24日
                                </RadioButton>
                                <RadioButton value={3}>
                                    2017年12月01日
                                </RadioButton>
                                <RadioButton value={4}>
                                    2017年12月10日
                                </RadioButton>
                                <RadioButton value={5}>
                                    2017年12月13日
                                </RadioButton>
                                <RadioButton value={6}>
                                    2018年3月23日
                                </RadioButton>
                                <RadioButton value={7}>
                                    2018年5月4日
                                </RadioButton>
                            </RadioGroup>
                        </div>
                    </div>
                    <div>
                        <div
                            id='mapid'
                            style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                borderLeft: '1px solid #ccc',
                                float: 'left',
                                width: '50%'
                            }}
                        />
                        <div
                            id='mapid2'
                            style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: '50%',
                                right: 0,
                                borderLeft: '1px solid #ccc',
                                float: 'right',
                                width: '50%'
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
