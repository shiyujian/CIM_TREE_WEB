import React, { Component } from 'react';
import { Tree, Input, Spin } from 'antd';
import L from 'leaflet';
import {
    getIconType
} from '../../auth';
import {
    FOREST_GIS_API
} from '_platform/api';
import {
    trim
} from '_platform/auth';
import './TreeType.less';
import decoration from './TreeTypeImg/decoration.png';
import hide from './TreeTypeImg/hide2.png';
import display from './TreeTypeImg/display2.png';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
export default class TreeTypeTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            searchTree: [],
            searchValue: '',
            treetypes: [],
            treeTypeTreeData: [],
            treeType1: true,
            treeType2: true,
            treeType3: true,
            treeType4: true,
            treeType5: true,
            treeTypeTreeMarkerLayer: '', // 树种筛选树节点图层
            menuIsExtend: true /* 菜单是否展开 */,
            menuWidth: 560 /* 菜单宽度 */
        };
        this.tileTreeTypeLayerFilter = null; // 树种筛选图层
    }
    // 树种
    treeTypeOptions = [
        {
            id: 'treeType1',
            key: '1',
            label: '常绿乔木'
        },
        {
            id: 'treeType2',
            key: '2',
            label: '落叶乔木'
        },
        {
            id: 'treeType3',
            key: '3',
            label: '亚乔木'
        },
        {
            id: 'treeType4',
            key: '4',
            label: '灌木'
        },
        {
            id: 'treeType5',
            key: '5',
            label: '地被'
        }
    ]

    componentDidMount () {
        const {
            treetypesTree
        } = this.props;
        let treetypes = [];
        let treeTypeTreeData = [];
        try {
            if (treetypesTree && treetypesTree instanceof Array) {
                for (let i = 0; i < treetypesTree.length; i++) {
                    let children = treetypesTree[i].children;
                    children.map((child) => {
                        treetypes.push(child);
                    });
                }
            }
            for (let j = 0; j < treetypesTree.length; j++) {
                const element = treetypesTree[j];
                if (element !== undefined) {
                    treeTypeTreeData.push(element);
                }
            }
        } catch (e) {
            console.log('获取不分类树种', e);
        }
        console.log('aaaaaaaaaaaaaaaa', treeTypeTreeData);

        this.setState({
            treetypes,
            treeTypeTreeData
        });
    }

    componentWillUnmount = async () => {
        await this.removeTileTreeTypeLayerFilter();
    }

    /* 树种筛选多选树节点 */
    handleTreeTypeCheck = async (keys, info) => {
        const {
            map
        } = this.props;
        let queryData = '';
        let selectAllStatus = false;
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] === '全部') {
                selectAllStatus = true;
            }
            // 字符串中不获取‘全部’的字符串
            if (keys[i] > 6 && keys[i] !== '全部') {
                queryData = queryData + keys[i];
                if (i < keys.length - 1) {
                    queryData = queryData + ',';
                }
            }
        }
        // 如果选中全部，并且最后一位为逗号，则去除最后一位的逗号
        if (selectAllStatus) {
            let data = queryData.substr(queryData.length - 1, 1);
            if (data === ',') {
                queryData = queryData.substr(0, queryData.length - 1);
            }
        }
        await this.props.removeTileTreeLayerBasic();
        await this.removeTileTreeTypeLayerFilter();
        let url = FOREST_GIS_API +
            `/geoserver/xatree/wms?cql_filter=TreeType%20IN%20(${queryData})`;
        // this.tileTreeTypeLayerFilter指的是一下获取多个树种的图层，单个树种的图层直接存在treeLayerList对象中
        this.tileTreeTypeLayerFilter = L.tileLayer.wms(url,
            {
                layers: 'xatree:treelocation',
                crs: L.CRS.EPSG4326,
                format: 'image/png',
                maxZoom: 22,
                transparent: true
            }
        ).addTo(map);
    }

    // 去除树种筛选瓦片图层
    removeTileTreeTypeLayerFilter = () => {
        const {
            map
        } = this.props;
        if (this.tileTreeTypeLayerFilter) {
            map.removeLayer(this.tileTreeTypeLayerFilter);
            this.tileTreeTypeLayerFilter = null;
        }
    }

    handleSearchTree = async (value) => {
        const {
            actions: {
                getTreeLocation
            }
        } = this.props;
        const {
            treetypes = []
        } = this.state;
        try {
            value = trim(value);
            if (value) {
                let searchTree = [];
                let keys = [];
                treetypes.map((tree) => {
                    let name = tree.properties.name;
                    if (name.indexOf(value) !== -1) {
                        keys.push(tree.key);
                        searchTree.push(tree);
                    }
                });
                // 如果所搜索的数据非树种名称，则查看是否为顺序码
                if (searchTree.length === 0 && value) {
                    let location = {};
                    let treeData = await getTreeLocation({sxm: value});
                    let treeMess = treeData && treeData.content && treeData.content[0];
                    // 如果根据顺序码查到的数据存在坐标，则不修改左侧树信息，对树节点进行定位
                    if (treeMess && treeMess.X && treeMess.Y) {
                        location.X = treeMess.X;
                        location.Y = treeMess.Y;
                        await this.treeTypeTreeLocation(location);
                        this.setState({
                            searchValue: '',
                            searchTree: []
                        });
                    } else {
                        // 如果根据顺序码查到的数据不存在坐标，则树数据为空，同时没有坐标信息
                        this.setState({
                            searchValue: value,
                            searchTree
                        });
                    }
                } else {
                    // 如果搜索的数据为树种名称，则展示搜索数据
                    this.setState({
                        searchValue: value,
                        searchTree
                    });
                }
            } else {
                // 如果搜索的信息为空，则取消定位信息，同时展示所有的树种信息
                // await this.props.cancelLocation();
                await this.treeTypeTreeCancelLocation();
                this.setState({
                    searchValue: '',
                    searchTree: []
                });
            }
        } catch (e) {
            console.log('handleSearchTree', e);
        }
    }

    // 树种筛选模块搜索树然后进行定位
    treeTypeTreeLocation = async (data) => {
        const {
            map
        } = this.props;
        const {
            treeTypeTreeMarkerLayer
        } = this.state;
        if (treeTypeTreeMarkerLayer) {
            map.removeLayer(treeTypeTreeMarkerLayer);
        }
        let iconType = L.divIcon({
            className: getIconType('treeType')
        });
        let marker = L.marker([data.Y, data.X], {
            icon: iconType
        });
        marker.addTo(map);
        map.panTo([data.Y, data.X]);
        this.setState({
            treeTypeTreeMarkerLayer: marker
        });
    }

    // 取消树节点定位
    treeTypeTreeCancelLocation = async () => {
        const {
            map
        } = this.props;
        const {
            treeTypeTreeMarkerLayer
        } = this.state;
        if (treeTypeTreeMarkerLayer) {
            map.removeLayer(treeTypeTreeMarkerLayer);
        }
        this.setState({
            treeTypeTreeMarkerLayer: ''
        });
    }
    /* 菜单展开收起 */
    _extendAndFold = () => {
        this.setState({ menuIsExtend: !this.state.menuIsExtend });
    }

    // 树种选中
    treeTypeChange = async (option) => {
        const {
            treetypes
        } = this.state;
        console.log('treetypes', treetypes);

        try {
            this.setState({
                [option.id]: !this.state[option.id]
            }, () => {
                this.handleTreeTypeKeys();
            });
        } catch (e) {
            console.log('pipeMaterialChange', e);
        }
    }
    handleTreeTypeKeys = async () => {
        const {
            treeTypeTreeData
        } = this.state;
        let keys = [];
        this.treeTypeOptions.map((option) => {
            if (this.state[option.id]) {
                let key = option.key;
                treeTypeTreeData.map((type) => {
                    if (key === type.key) {
                        let children = (type && type.children) || [];
                        children.map((child) => {
                            if (child.key) {
                                keys.push(child.key);
                            }
                        });
                    }
                });
            }
        });
        this.handleTreeTypeCheck(keys);
    }

    render () {
        let {
            treetypesTree = [],
            treetypesTreeLoading
        } = this.props;
        const {
            searchTree,
            searchValue,
            menuIsExtend,
            menuWidth
        } = this.state;

        return (
            <div>
                <div className='TreeTypePage-container'>
                    <div className='TreeTypePage-r-main'>
                        {
                            menuIsExtend ? '' : (
                                <img src={display}
                                    className='TreeTypePage-foldBtn'
                                    onClick={this._extendAndFold.bind(this)} />
                            )
                        }
                        <div
                            className={`TreeTypePage-menuPanel`}
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

                            <div className='TreeTypePage-menuBackground' />
                            <aside className='TreeTypePage-aside' id='asideDom'>
                                <Spin spinning={treetypesTreeLoading}>
                                    <div className='TreeTypePage-MenuNameLayout'>
                                        <img src={decoration} />
                                        <span className='TreeTypePage-MenuName'>树种分布</span>
                                        <img src={hide}
                                            onClick={this._extendAndFold.bind(this)}
                                            className='TreeTypePage-MenuButton' />
                                    </div>
                                    <div className='TreeTypePage-asideTree'>
                                        <div className='TreeTypePage-button' style={{ marginTop: 8 }}>
                                            {
                                                this.treeTypeOptions.map((option) => {
                                                    return (<a key={option.label}
                                                        title={option.label}
                                                        className={this.state[option.id] ? 'TreeTypePage-button-layoutSel' : 'TreeTypePage-button-layout'}
                                                        onClick={this.treeTypeChange.bind(this, option)}
                                                        style={{
                                                            marginRight: 8,
                                                            marginTop: 8
                                                        }}
                                                    >
                                                        <span className='TreeTypePage-button-layout-text'>{option.label}</span>
                                                    </a>);
                                                })
                                            }
                                        </div>
                                    </div>
                                </Spin>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
