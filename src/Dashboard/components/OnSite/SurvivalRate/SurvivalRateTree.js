import React, { Component } from 'react';
import { Tree, Spin } from 'antd';
import L from 'leaflet';
import Scrollbar from 'smooth-scrollbar';
import { FOREST_GIS_API } from '_platform/api';
import './SurvivalRateTree.less';

import decoration from './SurvivalRateImg/decoration.png';
import hide from './SurvivalRateImg/hide2.png';
import display from './SurvivalRateImg/display2.png';
import {
    genPopUpContent,
    getThinClassName
} from '../../auth';
const TreeNode = Tree.TreeNode;

export default class SurvivalRateTree extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            // 成活率范围的点击状态，展示是否选中的图片
            survivalRateHundred: true,
            survivalRateNinety: true,
            survivalRateEighty: true,
            survivalRateSeventy: true,
            survivalRateSixty: true,
            survivalRateFifty: true,
            survivalRateFourty: true,
            // 成活率选项
            survivalRateMarkerLayerList: {},
            survivalRateRateData: '',
            survivalRateSectionData: '',
            switchSurvivalRateFirst: false, // 第一次切换至成活率模块时，因标段数据初始化太麻烦，所以用此字段代表未曾选择过标段数据，只需要根据成活率范围查找
            menuIsExtend: true /* 菜单是否展开 */,
            menuWidth: 665 /* 菜单宽度 */
        };
        this.tileSurvivalRateLayerFilter = null; // 成活率范围和标段筛选图层
        this.tileTreeSurvivalRateLayerBasic = null; // 成活率全部图层
    }
    // 右侧成活率范围
    survivalRateOptions = [
        {
            id: 'survivalRateHundred',
            label: '90%~100%',
            data: '0.9~1',
            num: '90~100',
            color: '#42645b'
        },
        {
            id: 'survivalRateNinety',
            label: '80%~90%',
            data: '0.8~0.9',
            num: '80~90',
            color: '#16e07f'
        },
        {
            id: 'survivalRateEighty',
            label: '70%~80%',
            data: '0.7~0.8',
            num: '70~80',
            color: '#007bff'
        },
        {
            id: 'survivalRateSeventy',
            label: '60%~70%',
            data: '0.6~0.7',
            num: '60~70',
            color: '#00ffff'
        },
        {
            id: 'survivalRateSixty',
            label: '50%~60%',
            data: '0.5~0.6',
            num: '50~60',
            color: '#ffff00'
        },
        {
            id: 'survivalRateFifty',
            label: '40%~50%',
            data: '0.4~0.5',
            num: '40~50',
            color: '#ff9900'
        },
        {
            id: 'survivalRateFourty',
            label: '0%~40%',
            data: '0~0.4',
            num: '0~40',
            color: '#ff3633'
        }
    ]

    componentDidMount = async () => {
        const {
            map
        } = this.props;
        if (map) {
            console.log('document.querySelector', document.querySelector('#survivalRateAsideDom'));
            if (document.querySelector('#survivalRateAsideDom')) {
                let survivalRateAsideDom = Scrollbar.init(document.querySelector('#survivalRateAsideDom'));
                console.log('survivalRateAsideDom', survivalRateAsideDom);
            }
            await map.on('click', this.handleSurvivalRateMapClickFunction);
            await this.getTileTreeSurvivalRateBasic();
            await this.getSurvivalRateRateDataDefault();
        }
    }
    componentWillUnmount = async () => {
        const {
            map
        } = this.props;
        map.off('click', this.handleSurvivalRateMapClickFunction);
        await this.removeTileTreeSurvivalRateLayer();
    }
    /* 菜单展开收起 */
    _extendAndFold = () => {
        this.setState({ menuIsExtend: !this.state.menuIsExtend });
    }
    // 成活率点击事件
    handleSurvivalRateMapClickFunction = (e) => {
        try {
            const {
                dashboardCompomentMenu
            } = this.props;
            if (dashboardCompomentMenu === 'geojsonFeature_survivalRate' && e) {
                this.getSxmByLocation(e.latlng.lng, e.latlng.lat);
            }
        } catch (e) {
            console.log('initMap', e);
        }
    }
    // 加载成活率全部瓦片图层
    getTileTreeSurvivalRateBasic = () => {
        const {
            map
        } = this.props;
        if (this.tileTreeSurvivalRateLayerBasic) {
            this.tileTreeSurvivalRateLayerBasic.addTo(map);
        } else {
            this.tileTreeSurvivalRateLayerBasic = L.tileLayer(
                FOREST_GIS_API +
                '/geoserver/gwc/service/wmts?layer=xatree%3Asurvivalrate&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                {
                    opacity: 1.0,
                    subdomains: [1, 2, 3],
                    minZoom: 12,
                    maxZoom: 21,
                    storagetype: 0,
                    tiletype: 'wtms'
                }
            ).addTo(map);
        }
    }
    // 去除成活率全部瓦片图层和成活率筛选图层
    removeTileTreeSurvivalRateLayer = () => {
        const {
            map
        } = this.props;
        const {
            survivalRateMarkerLayerList
        } = this.state;
        if (this.tileSurvivalRateLayerFilter) {
            map.removeLayer(this.tileSurvivalRateLayerFilter);
        }
        if (this.tileTreeSurvivalRateLayerBasic) {
            map.removeLayer(this.tileTreeSurvivalRateLayerBasic);
        }
        for (let v in survivalRateMarkerLayerList) {
            map.removeLayer(survivalRateMarkerLayerList[v]);
        }
    }
    // 切换到成活率模块后对成活率标段数据进行处理
    getSurvivalRateRateDataDefault = () => {
        let survivalRateRateData = this.handleSurvivalRateRateData();
        this.setState({
            survivalRateRateData,
            switchSurvivalRateFirst: true
        });
    }
    // 成活率选择标段
    _handleSurvivalRateCheck = async (keys, info) => {
        const {
            switchSurvivalRateFirst
        } = this.state;
        try {
            let queryData = '';
            for (let i = 0; i < keys.length; i++) {
                if (keys.length > 0 && keys[i] !== '全部') {
                    let eventKey = keys[i];
                    let eventKeyArr = eventKey.split('-');
                    if (eventKeyArr && eventKeyArr.length === 3) {
                        queryData = queryData + `'` + eventKey + `'`;
                        if (i < keys.length - 1) {
                            queryData = queryData + ',';
                        }
                    }
                }
            }
            // 如果queryData最后一位为逗号，则去除最后一位的逗号
            let data = queryData.substr(queryData.length - 1, 1);
            if (data === ',') {
                queryData = queryData.substr(0, queryData.length - 1);
            }
            // 在选择标段数据后，将首次切换至成活率字段改为false
            if (switchSurvivalRateFirst) {
                this.setState({
                    switchSurvivalRateFirst: false
                });
            }
            this.setState({
                survivalRateSectionData: queryData
            }, () => {
                this.addSurvivalRateLayer();
            });
        } catch (e) {
            console.log('_handleSurvivalRateCheck', e);
        }
    }
    // 成活率选择成活范围
    handleSurvivalRateButton (option) {
        try {
            this.setState({
                [option.id]: !this.state[option.id]
            }, () => {
                this.getSurvivalRateRateData();
            });
        } catch (e) {
            console.log('handleSurvivalRateButton', e);
        }
    }
    // 在获取成活率数据处理后，加载图层
    getSurvivalRateRateData = () => {
        let survivalRateRateData = this.handleSurvivalRateRateData();
        this.setState({
            survivalRateRateData
        }, () => {
            this.addSurvivalRateLayer();
        });
    }
    // 根据选择的成活范围对成活率数据进行处理
    handleSurvivalRateRateData = () => {
        let survivalRateRateData = '';
        this.survivalRateOptions.map((option) => {
            if (this.state[option.id]) {
                let data = option.num;
                let arr = data.split('~');
                let arr1 = arr[0];
                let arr2 = arr[1];
                // sql用or和and连接 可以正常使用
                // if (survivalRateRateData) {
                //     survivalRateRateData += ` or ( SurvivalRate > ${arr1} and SurvivalRate < ${arr2} )`;
                // } else {
                //     survivalRateRateData += `( SurvivalRate > ${arr1} and SurvivalRate < ${arr2} )`;
                // }
                // sql用or和between连接 也可以正常使用
                if (survivalRateRateData) {
                    survivalRateRateData += ` or ( SurvivalRate BETWEEN ${arr1} AND ${arr2} )`;
                } else {
                    survivalRateRateData += `( SurvivalRate BETWEEN ${arr1} AND ${arr2} )`;
                }
            }
        });
        return survivalRateRateData;
    }
    // 成活率加载图层
    addSurvivalRateLayer = async () => {
        const {
            map
        } = this.props;
        const {
            survivalRateSectionData,
            survivalRateRateData,
            switchSurvivalRateFirst
        } = this.state;
        try {
            await this.removeTileTreeSurvivalRateLayer();
            let url = '';
            // 初次进入成活率模块，没有对标段数据进行处理，选择了范围数据直接对图层进行更改
            if (switchSurvivalRateFirst) {
                url = FOREST_GIS_API +
                    `/geoserver/xatree/wms?cql_filter=${survivalRateRateData}`;
            } else if (survivalRateRateData && survivalRateSectionData) {
                // 在点击过标段数据之后，只有两种状态都存在，才能进行搜索
                url = FOREST_GIS_API +
                    `/geoserver/xatree/wms?cql_filter=Section%20IN%20(${survivalRateSectionData})%20and%20${survivalRateRateData}`;
            }
            let encodedUrl = encodeURI(url);
            if (url) {
                this.tileSurvivalRateLayerFilter = L.tileLayer.wms(encodedUrl,
                    {
                        layers: 'xatree:survivalrate',
                        crs: L.CRS.EPSG4326,
                        format: 'image/png',
                        maxZoom: 22,
                        transparent: true
                    }
                ).addTo(map);
            }
        } catch (e) {
            console.log('addSurvivalRateLayer', e);
        }
    }
    // 根据点击的地图坐标与实际树的定位进行对比,根据树节点获取树节点信息
    getSxmByLocation (x, y) {
        const {
            map
        } = this.props;
        let resolutions = [
            0.703125,
            0.3515625,
            0.17578125,
            0.087890625,
            0.0439453125,
            0.02197265625,
            0.010986328125,
            0.0054931640625,
            0.00274658203125,
            0.001373291015625,
            6.866455078125e-4,
            3.4332275390625e-4,
            1.71661376953125e-4,
            8.58306884765625e-5,
            4.291534423828125e-5,
            2.1457672119140625e-5,
            1.0728836059570312e-5,
            5.364418029785156e-6,
            2.682209014892578e-6,
            1.341104507446289e-6,
            6.705522537231445e-7,
            3.3527612686157227e-7
        ];
        let zoom = map.getZoom();
        let resolution = resolutions[zoom];
        let col = (x + 180) / resolution;
        // 林总说明I和J必须是整数
        let colp = Math.floor(col % 256);
        // let colp = col % 256;
        col = Math.floor(col / 256);
        let row = (90 - y) / resolution;
        // 林总说明I和J必须是整数
        let rowp = Math.floor(row % 256);
        // let rowp = row % 256;
        row = Math.floor(row / 256);
        let url =
            FOREST_GIS_API +
            '/geoserver/gwc/service/wmts?VERSION=1.0.0&LAYER=xatree:thinclass&STYLE=&TILEMATRIX=EPSG:4326:' +
            zoom +
            '&TILEMATRIXSET=EPSG:4326&SERVICE=WMTS&FORMAT=image/png&SERVICE=WMTS&REQUEST=GetFeatureInfo&INFOFORMAT=application/json&TileCol=' +
            col +
            '&TileRow=' +
            row +
            '&I=' +
            colp +
            '&J=' +
            rowp;
        jQuery.getJSON(url, null, async (data) => {
            if (data.features && data.features.length) {
                this.getSurvivalRateInfo(data, x, y);
            }
        });
    }
    // 点击地图上的区域的成活率
    getSurvivalRateInfo = async (data, x, y) => {
        const {
            platform: {
                tree = {}
            },
            map
        } = this.props;
        const {
            survivalRateMarkerLayerList
        } = this.state;
        let totalThinClass = tree.totalThinClass || [];
        try {
            let bigTreeList = (tree && tree.bigTreeList) || [];
            if (data && data.features && data.features.length > 0 && data.features[0].properties) {
                let properties = data.features[0].properties;
                for (let i in survivalRateMarkerLayerList) {
                    map.removeLayer(survivalRateMarkerLayerList[i]);
                }
                let areaData = getThinClassName(properties.no, properties.Section, totalThinClass, bigTreeList);
                let iconData = {
                    geometry: {
                        coordinates: [y, x],
                        type: 'Point'
                    },
                    key: properties.ID,
                    properties: {
                        sectionName: areaData.SectionName ? areaData.SectionName : '',
                        smallClassName: areaData.SmallName ? areaData.SmallName : '',
                        thinClassName: areaData.ThinName ? areaData.ThinName : '',
                        treetype: properties.treetype,
                        SurvivalRate: `${(properties && properties.SurvivalRate) || 0}%`,
                        type: 'survivalRate'
                    },
                    type: 'survivalRate'
                };
                let survivalRateLayer = L.popup()
                    .setLatLng([y, x])
                    .setContent(genPopUpContent(iconData))
                    .addTo(map);
                survivalRateMarkerLayerList[properties.ID] = survivalRateLayer;
                this.setState({
                    survivalRateMarkerLayerList
                });
            }
        } catch (e) {
            console.log('getSurvivalRateInfo', e);
        }
    }
    render () {
        const {
            menuIsExtend,
            menuWidth
        } = this.state;
        return (
            <div>
                <div>
                    <div className='SurvivalRatePage-container'>
                        <div className='SurvivalRatePage-r-main'>
                            {
                                menuIsExtend ? '' : (
                                    <img src={display}
                                        className='SurvivalRatePage-foldBtn'
                                        onClick={this._extendAndFold.bind(this)} />
                                )
                            }
                            <div
                                className={`SurvivalRatePage-menuPanel`}
                                style={
                                    menuIsExtend
                                        ? {
                                            width: menuWidth,
                                            transform: 'translateX(0)'
                                        }
                                        : {
                                            width: menuWidth,
                                            transform: `translateX(-${
                                                menuWidth
                                            }px)`
                                        }
                                }
                            >
                                <div className='SurvivalRatePage-menuBackground' />
                                <aside className='SurvivalRatePage-aside' id='survivalRateAsideDom'>
                                    <div className='SurvivalRatePage-MenuNameLayout'>
                                        <img src={decoration} />
                                        <span className='SurvivalRatePage-MenuName'>成活率</span>
                                        <img src={hide}
                                            onClick={this._extendAndFold.bind(this)}
                                            className='SurvivalRatePage-MenuHideButton' />
                                    </div>
                                    <div className='SurvivalRatePage-asideTree'>
                                        <div className='SurvivalRatePage-button'>
                                            {
                                                this.survivalRateOptions.map((option) => {
                                                    return (<a key={option.label}
                                                        title={option.label}
                                                        className={this.state[option.id] ? 'SurvivalRatePage-button-layoutSel' : 'SurvivalRatePage-button-layout'}
                                                        onClick={this.handleSurvivalRateButton.bind(this, option)}
                                                        style={{
                                                            marginRight: 8,
                                                            marginTop: 8
                                                        }}
                                                    >
                                                        <span className='SurvivalRatePage-button-layout-text'>{option.label}</span>
                                                        {/* <img src={imgurl} className='SurvivalRatePage-button-layout-img' /> */}
                                                        <span className='SurvivalRatePage-button-layout-img' />
                                                        <span style={{color: `${option.color}`}}
                                                            className={this.state[option.id] ? 'SurvivalRatePage-button-layout-numSel' : 'SurvivalRatePage-button-layout-num'}>
                                                            ——
                                                        </span>
                                                    </a>);
                                                })
                                            }
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
