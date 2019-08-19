import React, { Component } from 'react';
import { Tree, Spin } from 'antd';
import L from 'leaflet';
import {FOREST_GIS_API} from '_platfoem/api';
import {
    fillAreaColor,
    handleAreaLayerData,
    handleCoordinates
} from '../auth';
const TreeNode = Tree.TreeNode;
// 还未想好区域地块树和辅助管理的图层如何一起管理  勿删
// 还未想好区域地块树和辅助管理的图层如何一起管理  勿删
// 还未想好区域地块树和辅助管理的图层如何一起管理  勿删
export default class AreaBlockTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    loop (data = [], loopTime) {
        const that = this;
        let disableCheckbox = true;
        if (loopTime) {
            loopTime = loopTime + 1;
        } else {
            loopTime = 1;
        }
        if (loopTime <= 3) {
            disableCheckbox = false;
        }
        if (data) {
            return (
                <TreeNode
                    title={data.Name}
                    key={data.No}
                    selectable={disableCheckbox}
                >
                    {data.children &&
                        data.children.map(m => {
                            return that.loop(m, loopTime);
                        })}
                </TreeNode>
            );
        }
    }

    render () {
        const {
            areaTreeLoading,
            platform: {
                tree = {}
            }
        } = this.props;
        let onSiteAreaTreeData = [];
        if (tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 1) {
            onSiteAreaTreeData = tree.thinClassTree;
        } else if (tree.onSiteThinClassTree && tree.onSiteThinClassTree instanceof Array && tree.onSiteThinClassTree.length > 0) {
            onSiteAreaTreeData = tree.onSiteThinClassTree;
        }
        return (
            <div>
                <div className='AreaBlockTree-rightAreaMenu'>
                    <aside className='AreaBlockTree-rightAreaMenu-aside' draggable='false'>
                        <div className='AreaBlockTree-rightAreaMenu-areaTree'>
                            <Spin spinning={areaTreeLoading}>
                                <Tree
                                    showLine
                                    onSelect={this.props.onSelect}
                                >
                                    {onSiteAreaTreeData.map(p => {
                                        return this.loop(p);
                                    })}
                                </Tree>
                            </Spin>
                        </div>
                    </aside>
                </div>
            </div>
        );
    }

    // 细班选择处理
    _handleAreaSelect = async (keys, info) => {
        const {
            areaLayerList,
            realThinClassLayerList
        } = this.state;
        const {
            dashboardCompomentMenu
        } = this.props;
        // 当前选中的节点
        let areaEventTitle = info.node.props.title;
        this.setState({
            areaEventKey: keys[0],
            areaEventTitle
        });
        try {
            const eventKey = keys[0];
            for (let v in areaLayerList) {
                areaLayerList[v].map((layer) => {
                    this.map.removeLayer(layer);
                });
            }
            if (eventKey) {
                // 细班的key加入了标段，首先对key进行处理
                let handleKey = eventKey.split('-');
                // 如果选中的是细班，则直接添加图层
                if (handleKey.length === 5) {
                    // 如果之前添加过，直接将添加过的再次添加，不用再次请求
                    if (areaLayerList[eventKey]) {
                        areaLayerList[eventKey].map((layer) => {
                            layer.addTo(this.map);
                            this.map.fitBounds(layer.getBounds());
                        });
                    } else {
                    // 如果不是添加过，需要请求数据
                        await this._addAreaLayer(eventKey);
                    }
                }
                if (dashboardCompomentMenu === 'geojsonFeature_auxiliaryManagement') {
                    let selectNo = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[3] + '-' + handleKey[4];
                    let selectSectionNo = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[2];
                    if (this.tileTreeLayerBasic) {
                        this.map.removeLayer(this.tileTreeLayerBasic);
                    }
                    this.handleRemoveRealThinClassLayer();
                    if (realThinClassLayerList[eventKey]) {
                        realThinClassLayerList[eventKey].addTo(this.map);
                    } else {
                        var url = FOREST_GIS_API +
                        `/geoserver/xatree/wms?cql_filter=No+LIKE+%27%25${selectNo}%25%27%20and%20Section+LIKE+%27%25${selectSectionNo}%25%27`;
                        let thinClassLayer = L.tileLayer.wms(url,
                            {
                                layers: 'xatree:treelocation',
                                crs: L.CRS.EPSG4326,
                                format: 'image/png',
                                maxZoom: 22,
                                transparent: true
                            }
                        ).addTo(this.map);
                        realThinClassLayerList[eventKey] = thinClassLayer;
                        this.setState({
                            realThinClassLayerList
                        });
                    }
                }
            }
        } catch (e) {
            console.log('处理选中节点', e);
        }
    }

    // 去除细班实际区域的图层
    handleRemoveRealThinClassLayer = () => {
        const {
            realThinClassLayerList
        } = this.state;
        for (let i in realThinClassLayerList) {
            this.map.removeLayer(realThinClassLayerList[i]);
        }
    }

    // 选中细班，则在地图上加载细班图层
    _addAreaLayer = async (eventKey) => {
        const {
            areaLayerList
        } = this.state;
        const {
            actions: { getTreearea }
        } = this.props;
        try {
            let coords = await handleAreaLayerData(eventKey, getTreearea);
            if (coords && coords instanceof Array && coords.length > 0) {
                for (let i = 0; i < coords.length; i++) {
                    let str = coords[i];
                    let treearea = handleCoordinates(str);
                    let message = {
                        key: 3,
                        type: 'Feature',
                        properties: {name: '', type: 'area'},
                        geometry: { type: 'Polygon', coordinates: treearea }
                    };
                    let layer = this._createMarker(message);
                    if (i === coords.length - 1) {
                        this.map.fitBounds(layer.getBounds());
                    }
                    if (areaLayerList[eventKey]) {
                        areaLayerList[eventKey].push(layer);
                    } else {
                        areaLayerList[eventKey] = [layer];
                    }
                }
                this.setState({
                    areaLayerList
                });
            };
        } catch (e) {
            console.log('加载细班图层', e);
        }
    }

    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
        try {
            if (geo.properties.type === 'area') {
                // 创建区域图形
                let layer = L.polygon(geo.geometry.coordinates, {
                    color: '#201ffd',
                    fillColor: fillAreaColor(geo.key),
                    fillOpacity: 0.3
                }).addTo(this.map);
                return layer;
            }
        } catch (e) {
            console.log('_createMarker', e);
        }
    }
}
