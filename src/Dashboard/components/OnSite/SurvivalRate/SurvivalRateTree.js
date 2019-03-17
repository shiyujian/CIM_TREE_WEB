import React, { Component } from 'react';
import { Tree, Spin } from 'antd';
import { FOREST_GIS_TREETYPE_API, FOREST_GIS_API } from '_platform/api';
import './SurvivalRateTree.less';
// 存活率图片
import hundredImg from '../../SurvivalRateImg/90~100.png';
import ninetyImg from '../../SurvivalRateImg/80~90.png';
import eightyImg from '../../SurvivalRateImg/70~80.png';
import seventyImg from '../../SurvivalRateImg/60~70.png';
import sixtyImg from '../../SurvivalRateImg/50~60.png';
import fiftyImg from '../../SurvivalRateImg/40~50.png';
import foutyImg from '../../SurvivalRateImg/0~40.png';
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
            switchSurvivalRateFirst: false // 第一次切换至成活率模块时，因标段数据初始化太麻烦，所以用此字段代表未曾选择过标段数据，只需要根据成活率范围查找
        };
        this.tileSurvivalRateLayerFilter = null; // 成活率范围和标段筛选图层
        this.tileTreeSurvivalRateLayerBasic = null; // 成活率全部图层
    }
    // 右侧成活率范围
    survivalRateOptions = [
        {
            id: 'survivalRateHundred',
            label: '90~100',
            img: hundredImg
        },
        {
            id: 'survivalRateNinety',
            label: '80~90',
            img: ninetyImg
        },
        {
            id: 'survivalRateEighty',
            label: '70~80',
            img: eightyImg
        },
        {
            id: 'survivalRateSeventy',
            label: '60~70',
            img: seventyImg
        },
        {
            id: 'survivalRateSixty',
            label: '50~60',
            img: sixtyImg
        },
        {
            id: 'survivalRateFifty',
            label: '40~50',
            img: fiftyImg
        },
        {
            id: 'survivalRateFourty',
            label: '0~40',
            img: foutyImg
        }
    ]

    loop (data = [], loopTime) {
        if (loopTime) {
            loopTime = loopTime + 1;
        } else {
            loopTime = 1;
        }
        if (data) {
            return (
                <TreeNode
                    title={data.Name}
                    key={data.No}
                    selectable={false}
                >
                    {data.children &&
                        data.children.map(m => {
                            return this.loop(m, loopTime);
                        })}
                </TreeNode>
            );
        }
    }

    componentDidMount = async () => {
        const {
            map
        } = this.props;
        if (map) {
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
        console.log('是否存在点击事件', map.listens('click'));
        await this.removeTileTreeSurvivalRateLayer();
    }
    // 成活率点击事件
    handleSurvivalRateMapClickFunction = (e) => {
        try {
            const {
                dashboardCompomentMenu
            } = this.props;
            if (dashboardCompomentMenu === 'geojsonFeature_survivalRate' && e) {
                console.log('handleSurvivalRateMapClickFunction', e);
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
                    minZoom: 11,
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
    render () {
        const {
            survivalRateTree = [],
            survivalRateTreeLoading,
            menuTreeVisible
        } = this.props;
        let treeData = [
            {
                Name: '全部',
                No: '全部',
                children: survivalRateTree
            }
        ];
        return (
            <div>
                {
                    menuTreeVisible
                        ? (
                            <div>
                                <div className='SurvivalRateTree-menuPanel'>
                                    <aside className='SurvivalRateTree-aside' draggable='false'>
                                        <div className='SurvivalRateTree-asideTree'>
                                            <Spin spinning={survivalRateTreeLoading}>
                                                <Tree
                                                    showLine
                                                    checkable
                                                    defaultCheckedKeys={['全部']}
                                                    onCheck={this._handleSurvivalRateCheck.bind(this)}
                                                >
                                                    {treeData.map(p => {
                                                        return this.loop(p);
                                                    })}
                                                </Tree>
                                            </Spin>
                                        </div>
                                    </aside>
                                </div>
                                <div>
                                    <div className='SurvivalRateTree-menuSwitchSurvivalRateLayout'>
                                        {
                                            this.survivalRateOptions.map((option) => {
                                                return (
                                                    <div style={{ display: 'inlineBlock' }} key={option.id}>
                                                        <img src={option.img}
                                                            title={option.label}
                                                            className='SurvivalRateTree-rightMenuSurvivalRateImgLayout' />
                                                        <a className={this.state[option.id] ? 'SurvivalRateTree-rightMenuSurvivalRateSelLayout' : 'SurvivalRateTree-rightMenuSurvivalRateUnSelLayout'}
                                                            title={option.label}
                                                            key={option.id}
                                                            onClick={this.handleSurvivalRateButton.bind(this, option)} />
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        ) : ''
                }
            </div>
        );
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
                let data = option.label;
                let arr = data.split('~');
                let arr1 = arr[0];
                let arr2 = arr[1];
                if (survivalRateRateData) {
                    survivalRateRateData += `%20or%20SurvivalRate%20%3E%20${arr1}%20and%20SurvivalRate%20%3C%20${arr2}`;
                } else {
                    survivalRateRateData += `SurvivalRate%20%3E%20${arr1}%20and%20SurvivalRate%20%3C%20${arr2}`;
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
                url = FOREST_GIS_TREETYPE_API +
                    `/geoserver/xatree/wms?cql_filter=${survivalRateRateData}`;
            } else if (survivalRateRateData && survivalRateSectionData) {
                // 在点击过标段数据之后，只有两种状态都存在，才能进行搜索
                url = FOREST_GIS_TREETYPE_API +
                    `/geoserver/xatree/wms?cql_filter=Section%20IN%20(${survivalRateSectionData})%20and%20${survivalRateRateData}`;
            }
            if (url) {
                this.tileSurvivalRateLayerFilter = L.tileLayer.wms(url,
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
                        SurvivalRate: properties.SurvivalRate,
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
}
