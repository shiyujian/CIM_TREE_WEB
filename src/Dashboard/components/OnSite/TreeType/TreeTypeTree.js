import React, { Component } from 'react';
import { Tree, Input, Spin } from 'antd';
import {
    getIconType
} from '../../auth';
import {
    FOREST_GIS_TREETYPE_API
} from '_platform/api';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
export default class TreeTypeTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            searchTree: [],
            searchValue: '',
            treeTypeTreeMarkerLayer: '' // 树种筛选树节点图层
        };
        this.tileTreeTypeLayerFilter = null; // 树种筛选图层
    }

    componentDidMount () {
    }

    componentWillUnmount = async () => {
        await this.removeTileTreeTypeLayerFilter();
    }

    render () {
        let {
            treetypesTree = [],
            treetypesTreeLoading
        } = this.props;
        const {
            searchTree,
            searchValue
        } = this.state;
        let treeData = [];
        let defaultCheckedKeys = [];
        if (searchValue) {
            treeData = searchTree;
        } else {
            let contents = [];
            for (let j = 0; j < treetypesTree.length; j++) {
                const element = treetypesTree[j];
                if (element !== undefined) {
                    contents.push(element);
                    defaultCheckedKeys.push(element.key);
                }
            }
            treeData = [
                {
                    properties: {
                        name: '全部'
                    },
                    key: '全部',
                    children: contents
                }
            ];
        }
        return (
            <div>
                <Spin spinning={treetypesTreeLoading}>
                    <Search
                        placeholder='请输入树种名称或顺序码'
                        onSearch={this.searchTree.bind(this)}
                        style={{ width: '100%', marginBotton: 10, paddingRight: 5 }}
                    />
                    <div className={this.genIconClass()}>
                        <Tree
                            checkable
                            showIcon
                            defaultCheckedKeys={defaultCheckedKeys}
                            onCheck={this.handleTreeTypeCheck.bind(this)}
                            showLine
                        >
                            {treeData.map(p => {
                                return this.loop(p);
                            })}
                        </Tree>
                    </div>
                </Spin>
            </div>

        );
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

    loop (p) {
        let me = this;
        if (p) {
            return (
                <TreeNode
                    title={p.properties.name}
                    key={p.key}
                    selectable={false}
                >
                    {p.children &&
                        p.children.map(m => {
                            return me.loop(m);
                        })}
                </TreeNode>
            );
        }
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
        let url = FOREST_GIS_TREETYPE_API +
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

    searchTree = async (value) => {
        const {
            treetypes = [],
            actions: {
                getTreeLocation
            }
        } = this.props;
        try {
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
            console.log('e', 'searchTree');
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
}
