import React, { Component } from 'react';
import { Tree, Input, message } from 'antd';
import L from 'leaflet';
import {
    FOREST_GIS_API
} from '_platform/api';
import {
    getSeedlingMess,
    getTreeMessFun,
    getCuringMess
} from '../TreeMess/TreeInfo';
import {
    getThinClassName,
    handleGetAddressByCoordinate,
    getIconType
} from '../../auth';
import {
    trim
} from '_platform/auth';
import AdoptTreeMessModal from './AdoptTreeMessModal';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
export default class TreeAdoptTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            searchTree: [],
            searchValue: '',
            // 结缘
            adoptTreeMarkerLayerList: {}, // 苗木结缘图标List
            adoptTreeDataList: {}, // 苗木结缘数据List
            adoptTreeModalVisible: false,
            adoptTreeModalLoading: false,
            seedlingMess: '',
            treeMess: '',
            curingMess: '',
            adoptTreeMess: ''
        };
        this.tileTreeAdoptLayerBasic = null;
    }

    loop (p) {
        if (p) {
            return (
                <TreeNode
                    title={p.SXM}
                    key={p.ID}
                />
            );
        }
    }
    componentDidMount = async () => {
        const {
            map
        } = this.props;
        if (map) {
            map.panTo([38.9966207742691, 116.035585999489]);
            // 添加地图点击事件
            await map.on('click', this.handleAdoptTreeGisClickFunction);
            // 加载苗木结缘图层
            await this.getTileTreeAdoptBasic();
        }
    }
    componentWillUnmount = async () => {
        const {
            map
        } = this.props;
        const {
            adoptTreeMarkerLayerList
        } = this.state;
        // 关闭地图点击事件
        map.off('click', this.handleAdoptTreeGisClickFunction);
        // 去除苗木结缘图层
        this.removeTileTreeAdoptLayer();
        for (let t in adoptTreeMarkerLayerList) {
            map.removeLayer(adoptTreeMarkerLayerList[t]);
        }
    }
    // 查看苗木信息点击事件
    handleAdoptTreeGisClickFunction = (e) => {
        try {
            const {
                dashboardCompomentMenu
            } = this.props;
            if (dashboardCompomentMenu === 'geojsonFeature_treeAdopt' && e) {
                // 通过点击坐标获取苗木结缘信息
                this.getSxmByLocation(e.latlng.lng, e.latlng.lat);
            }
        } catch (e) {
            console.log('handleAdoptTreeGisClickFunction', e);
        }
    }
    // 加载苗木结缘全部瓦片图层
    getTileTreeAdoptBasic = () => {
        const {
            map
        } = this.props;
        if (this.tileTreeAdoptLayerBasic) {
            this.tileTreeAdoptLayerBasic.addTo(map);
        } else {
            this.tileTreeAdoptLayerBasic = L.tileLayer(
                FOREST_GIS_API +
                '/geoserver/gwc/service/wmts?layer=xatree%3Aadopttree&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                {
                    opacity: 1.0,
                    subdomains: [1, 2, 3],
                    minZoom: 10,
                    maxZoom: 21,
                    storagetype: 0,
                    tiletype: 'wtms'
                }
            ).addTo(map);
        }
    }
    // 去除苗木结缘全部瓦片图层
    removeTileTreeAdoptLayer = () => {
        const {
            map
        } = this.props;
        if (this.tileTreeAdoptLayerBasic) {
            map.removeLayer(this.tileTreeAdoptLayerBasic);
        }
    }

    render () {
        const {
            searchTree = [],
            searchValue,
            adoptTreeModalVisible
        } = this.state;
        let contents = [];
        if (searchValue) {
            contents = searchTree;
        }
        return (
            <div>
                <Search
                    placeholder='请输入结缘人姓名'
                    onSearch={this.searchTreeData.bind(this)}
                    style={{ width: '100%', marginBotton: 10, paddingRight: 5 }}
                />
                <Tree
                    showIcon
                    onSelect={this._handleAdoptSelect.bind(this)}
                    showLine
                >
                    {contents.map(p => {
                        return this.loop(p);
                    })}
                </Tree>
                { // 苗木结缘弹窗展示树木信息
                    adoptTreeModalVisible
                        ? (
                            <AdoptTreeMessModal
                                {...this.props}
                                {...this.state}
                                onCancel={this.handleCancelAdoptTreeMessModal.bind(this)} />
                        ) : ''
                }
            </div>

        );
    }
    // 显示苗木结缘Modal
    handleOkAdoptTreeMessModal () {
        this.setState({
            adoptTreeModalLoading: false
        });
    }
    // 关闭苗木结缘Modal
    handleCancelAdoptTreeMessModal () {
        this.handleModalMessData();
        this.setState({
            adoptTreeModalVisible: false,
            adoptTreeModalLoading: true
        });
    }
    // 清除苗木结缘弹窗内用到的数据
    handleModalMessData () {
        this.setState({
            seedlingMess: '',
            treeMess: '',
            curingMess: '',
            adoptTreeMess: ''
        });
    }

    searchTreeData = async (value) => {
        const {
            actions: {
                getAdoptTreeByAdopter,
                getTreeLocation
            }
        } = this.props;
        try {
            if (value) {
                value = trim(value);
                let postdata = {
                    aadopter: value
                };
                let data = await getAdoptTreeByAdopter(postdata);
                let adoptTrees = (data && data.content) || [];
                for (let i = 0; i < adoptTrees.length; i++) {
                    let adoptTree = adoptTrees[i];
                    let SXM = adoptTree.SXM;
                    let treeData = await getTreeLocation({sxm: SXM});
                    let treeMess = treeData && treeData.content && treeData.content[0];
                    if (treeMess && treeMess.X && treeMess.Y) {
                        adoptTree.X = treeMess.X;
                        adoptTree.Y = treeMess.Y;
                    }
                }
                // 去除没有定位数据的
                for (let i = 0; i < adoptTrees.length; i++) {
                    if (!(adoptTrees[i] && adoptTrees[i].X && adoptTrees[i].Y)) {
                        adoptTrees.splice(i, 1);
                    }
                }
                if (adoptTrees && adoptTrees.length === 0) {
                    message.warning('未查询到结缘数据');
                    this._handleAdoptCheck([]);
                    this.setState({
                        searchTree: [],
                        searchValue: value
                    });
                    return;
                }
                this._handleAdoptCheck(adoptTrees);
                this.setState({
                    searchTree: adoptTrees,
                    searchValue: value
                });
            } else {
                this._handleAdoptCheck([]);
                this.setState({
                    searchTree: [],
                    searchValue: value
                });
            }
        } catch (e) {
            console.log('searchTree', e);
        }
    }
    // 定位至点击树种所在位置
    _handleAdoptSelect = async (keys, info) => {
        const {
            map
        } = this.props;
        const {
            adoptTreeDataList
        } = this.state;
        try {
            if (info && info.selected) {
                const eventKey = keys[0];
                let data = adoptTreeDataList[eventKey];
                map.panTo([data.Y, data.X]);
            }
        } catch (e) {
            console.log('_handleAdoptSelect', e);
        }
    }
    // 加载苗木结缘图层
    _handleAdoptCheck = async (adoptTrees) => {
        const {
            map
        } = this.props;
        const {
            adoptTreeDataList,
            adoptTreeMarkerLayerList
        } = this.state;
        try {
            for (let t in adoptTreeMarkerLayerList) {
                map.removeLayer(adoptTreeMarkerLayerList[t]);
            }
            if (adoptTrees && adoptTrees instanceof Array && adoptTrees.length > 0) {
                for (let i = 0; i < adoptTrees.length; i++) {
                    let adoptTree = adoptTrees[i];
                    let ID = adoptTree.ID;
                    let iconType = L.divIcon({
                        className: getIconType('adopt')
                    });
                    let adoptTreeMarkerLayer = L.marker([adoptTree.Y, adoptTree.X], {
                        icon: iconType
                        // title: adoptTree.SXM // 如果有title字段  无法点击图标 进行查询树木信息的操作
                    });
                    adoptTreeMarkerLayer.addTo(map);
                    adoptTreeDataList[ID] = adoptTree;
                    adoptTreeMarkerLayerList[ID] = adoptTreeMarkerLayer;
                    this.setState({
                        adoptTreeDataList,
                        adoptTreeMarkerLayerList
                    });
                    if (i === 0) {
                        map.panTo([adoptTree.Y, adoptTree.X]);
                    }
                }
            }
        } catch (e) {
            console.log('_handleAdoptCheck', e);
        }
    }

    // 根据点击的地图坐标与实际树的定位进行对比,根据树节点获取树节点信息
    getSxmByLocation (x, y) {
        const {
            map
        } = this.props;
        var resolutions = [
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
            '/geoserver/gwc/service/wmts?VERSION=1.0.0&LAYER=xatree:treelocation&STYLE=&TILEMATRIX=EPSG:4326:' +
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
            // await this.setState({
            //     adoptTreeModalVisible: true,
            //     adoptTreeModalLoading: true
            // });
            if (data.features && data.features.length) {
                let adoptTreeMess = await this.getTreeAdoptInfo(data, x, y);
                if (adoptTreeMess) {
                    await this.setState({
                        adoptTreeModalVisible: true,
                        adoptTreeModalLoading: true
                    });
                    await this.getTreeMessData(data, x, y);
                    await this.handleOkAdoptTreeMessModal();
                } else {
                    message.warning('未查询到结缘数据');
                }
            } else {
                message.warning('未查询到结缘数据');
            }
        });
    }
    // 获取苗木结缘信息
    getTreeAdoptInfo = async (data, x, y) => {
        const {
            actions: {
                getAdoptTrees
            }
        } = this.props;
        try {
            let adoptTreeMess = '';
            if (data && data.features && data.features.length > 0 && data.features[0].properties) {
                let postdata = {
                    sxm: data.features[0].properties.SXM
                };
                let adoptData = await getAdoptTrees({}, postdata);
                let content = (adoptData && adoptData.content) || [];
                if (content && content.length > 0) {
                    adoptTreeMess = content[0];
                    this.setState({
                        adoptTreeMess
                    });
                }
            }
            return adoptTreeMess;
        } catch (e) {
            console.log('getTreeAdoptInfo', e);
        }
    }
    // 获取树木详情信息
    getTreeMessData = async (data, x, y) => {
        const {
            actions: {
                getNurserys,
                getCarpackbysxm,
                getTreeMess,
                getCuringTreeInfo,
                getCuringTypes,
                getCuringMessage,
                getTreeLocationCoord,
                getLocationNameByCoordinate
            },
            platform: {
                tree = {}
            },
            curingTypes
        } = this.props;
        try {
            let postdata = {
                sxm: data.features[0].properties.SXM
                // sxm: 'ABG9834'
            };
            let totalThinClass = tree.totalThinClass || [];
            let bigTreeList = (tree && tree.bigTreeList) || [];
            let queryTreeData = await getTreeMess(postdata);
            if (!queryTreeData) {
                queryTreeData = {};
            }
            // 苗圃数据
            let nurserysDatas = await getNurserys({}, postdata);
            // 车辆打包数据
            let carData = await getCarpackbysxm(postdata);
            // 养护树木信息
            let curingTreeData = await getCuringTreeInfo({}, postdata);
            // 获取树的地理坐标信息
            let treeLocationData = await getTreeLocationCoord(postdata);
            let curingTypeArr = [];
            if (!curingTypes) {
                let curingTypesData = await getCuringTypes();
                curingTypeArr = curingTypesData && curingTypesData.content;
            } else {
                curingTypeArr = curingTypes;
            };
            let SmallClassName = queryTreeData.SmallClass
                ? queryTreeData.SmallClass + '号小班'
                : '';
            let ThinClassName = queryTreeData.ThinClass
                ? queryTreeData.ThinClass + '号细班'
                : '';
            // 获取小班细班名称
            if (queryTreeData && queryTreeData.Section && queryTreeData.SmallClass && queryTreeData.ThinClass) {
                let sections = queryTreeData.Section.split('-');
                let No =
                            sections[0] +
                            '-' +
                            sections[1] +
                            '-' +
                            queryTreeData.SmallClass +
                            '-' +
                            queryTreeData.ThinClass;
                let regionData = getThinClassName(No, queryTreeData.Section, totalThinClass, bigTreeList);
                SmallClassName = regionData.SmallName;
                ThinClassName = regionData.ThinName;
            }
            let nurserysData = {};
            let curingTaskData = [];
            let curingTaskArr = [];
            if (
                nurserysDatas && nurserysDatas.content && nurserysDatas.content instanceof Array &&
                        nurserysDatas.content.length > 0
            ) {
                nurserysData = nurserysDatas.content[0];
            }
            if (
                curingTreeData && curingTreeData.content && curingTreeData.content instanceof Array &&
                        curingTreeData.content.length > 0
            ) {
                let content = curingTreeData.content;
                content.map((task) => {
                    if (curingTaskArr.indexOf(task.CuringID) === -1) {
                        curingTaskData.push(task);
                        curingTaskArr.push(task.CuringID);
                    }
                });
            }
            // 根据苗圃的起苗坐标获取起苗地址
            let nurserysAddressData = await handleGetAddressByCoordinate(nurserysData.location, getLocationNameByCoordinate);
            let nurserysAddressName = (nurserysAddressData && nurserysAddressData.regeocode && nurserysAddressData.regeocode.formatted_address) || '';
            nurserysData.nurserysAddressName = nurserysAddressName;
            // 根据树木的定位坐标获取定位地址
            let location = '';
            if (treeLocationData && treeLocationData.X && treeLocationData.Y) {
                location = `${treeLocationData.X},${treeLocationData.Y}`;
            }
            queryTreeData.locationCoord = location;
            // let treeAddressData = await handleGetAddressByCoordinate(location, getLocationNameByCoordinate);
            // let queryTreeAddressName = (treeAddressData && treeAddressData.regeocode && treeAddressData.regeocode.formatted_address) || '';
            // queryTreeData.queryTreeAddressName = queryTreeAddressName;

            let seedlingMess = getSeedlingMess(queryTreeData, carData, nurserysData);
            let treeMess = getTreeMessFun(SmallClassName, ThinClassName, queryTreeData, nurserysData, bigTreeList);
            let curingMess = await getCuringMess(curingTaskData, curingTypeArr, getCuringMessage);
            this.setState({
                seedlingMess,
                treeMess,
                curingMess
            });
        } catch (e) {
            console.log('getTreeMessData', e);
        }
    }
}
