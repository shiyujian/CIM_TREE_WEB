import React, { Component } from 'react';
import { Button, Select, Table, Pagination, Modal, Form, Spin, List } from 'antd';
import L from 'leaflet';
import {
    fillAreaColor,
    getCoordsArr
} from '../auth';
import {
    FOREST_GIS_API,
    WMSTILELAYERURL,
    TILEURLS,
    INITLEAFLET_API
} from '_platform/api';
const FormItem = Form.Item;
const Option = Select.Option;
class Tablelevel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            leftkeycode: '', // 项目
            dataList: [], // 地块列表
            selectedRowKeysList: [], // 选中的地块列表
            dataListHistory: [], // 历史数据列表
            sectionList: [], // 标段列表
            showModal: false,
            record: {},
            indexBtn: 1,
            fileList: [],
            page: 1,
            total: 0,
            section: '',
            areaLayerList: [], // 区域地块图层list
            spinning: true // loading
        };
        this.dataList = []; // 暂存数据
        this.onSearch = this.onSearch.bind(this); // 查询地块
        this.handleSection = this.handleSection.bind(this); // 所属标段
        this.onHistory = this.onHistory.bind(this); // 历史导入数据
        this.handlePage = this.handlePage.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.getItemList = this.getItemList.bind(this);

        this.columns = [
            {
                key: '1',
                title: '序号',
                dataIndex: '',
                render: (text, record, index) => {
                    return (
                        <span>{index + 1}</span>
                    );
                }
            },
            {
                key: '2',
                title: '标段',
                dataIndex: 'Section'
            },
            {
                key: '6',
                title: '操作',
                dataIndex: 'action',
                render: (text, record, index) => {
                    return (
                        <div>
                            <a onClick={this.onEdit.bind(this, record)}>编辑</a>
                        </div>
                    );
                }
            }
        ];
    }
    componentDidMount () {
        // 初始化地图
        this.initMap();
        // 获取历史数据
        this.getDataHistory();
        // 获取所有地块
        // this.onSearch(1);
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.leftkeycode) {
            this.setState({
                section: '',
                leftkeycode: nextProps.leftkeycode,
                sectionList: nextProps.sectionList
            }, () => {
                // 获取表格数据
                this.onSearch(1);
            });
        }
    }
    initMap () {
        // 基础设置
        let mapInitialization = INITLEAFLET_API;
        mapInitialization.crs = L.CRS.EPSG4326;
        mapInitialization.attributionControl = false;
        this.map = L.map('mapid', mapInitialization);
        // 基础图层
        this.tileLayer = L.tileLayer(TILEURLS[1], {
            // subdomains: [3],
            subdomains: [0, 1, 2, 3, 4, 5, 6, 7], // 天地图有7个服务节点，代码中不固定使用哪个节点的服务，而是随机决定从哪个节点请求服务，避免指定节点因故障等原因停止服务的风险
            minZoom: 15,
            maxZoom: 17,
            zoomOffset: 1
        }).addTo(this.map);
        // 道路图层
        L.tileLayer(WMSTILELAYERURL, {
            // subdomains: [3],
            subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
            minZoom: 15,
            maxZoom: 17,
            zoomOffset: 1
        }).addTo(this.map);
        // 树木瓦片图层
        L.tileLayer(
            FOREST_GIS_API + '/geoserver/gwc/service/wmts?layer=xatree%3Anewtreelocation&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}', {
                opacity: 1.0,
                subdomains: [1, 2, 3],
                minZoom: 15,
                maxZoom: 21,
                storagetype: 0,
                tiletype: 'wtms'
            }
        ).addTo(this.map);
    }
    getDataHistory () {
        const { getDataimports } = this.props.actions;
        getDataimports({}, {
            section: '',
            datatype: 'land',
            stime: '',
            etime: '',
            page: 1,
            size: 10
        }).then(rep => {
            if (rep.code === 200) {
                this.setState({
                    dataListHistory: rep.content
                });
            }
        });
    }
    render () {
        const { dataList, section, dataListHistory, total, page, sectionList, spinning, selectedRowKeysList } = this.state;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeysList: selectedRowKeys
                });
                this.onLocation(selectedRows);
            },
            selectedRowKeys: selectedRowKeysList
        };
        return (
            <div className='table-level'>
                <div>
                    <Form layout='inline'>
                        <FormItem label='标段'>
                            <Select style={{ width: 150 }} value={section} onChange={this.handleSection.bind(this)} allowClear>
                                {
                                    sectionList.map(item => {
                                        return <Option value={item.No} key={item.No}>{item.Name}</Option>;
                                    })
                                }
                            </Select>
                        </FormItem>
                        <FormItem>
                            <Button type='primary' onClick={this.onSearch.bind(this, 1)}>查询</Button>
                        </FormItem>
                        <FormItem>
                            <Button type='primary' onClick={this.onHistory.bind(this)} style={{marginLeft: 50}}>历史导入列表</Button>
                        </FormItem>
                    </Form>
                </div>
                <div style={{marginTop: 20}}>
                    <div style={{width: 600, height: 640, float: 'left', overflow: 'hidden'}}>
                        <Spin spinning={spinning}>
                            <Table rowSelection={rowSelection} columns={this.columns} dataSource={dataList} pagination={false} />
                        </Spin>
                        <Pagination style={{float: 'right', marginTop: 10}} defaultCurrent={page} total={total} onChange={this.handlePage.bind(this)} showQuickJumper />
                    </div>
                    {/* 地图 */}
                    <div style={{marginLeft: 620, height: 640, overflow: 'hidden', border: '3px solid #ccc'}}>
                        <div id='mapid' style={{height: 640, width: '100%'}} />
                    </div>
                </div>
                <Modal
                    title='历史导入列表'
                    visible={this.state.showModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <List
                        header={<div>
                            <div style={{float: 'left', width: 150}}>标段</div>
                            <div style={{float: 'left', width: 220}}>入库时间</div>
                            <div>操作</div>
                        </div>}
                        bordered
                        dataSource={dataListHistory}
                        renderItem={this.getItemList.bind(this)}
                    />
                </Modal>
            </div>
        );
    }
    getItemList (item) {
        return (
            <List.Item actions={[<a onClick={this.deleteRecord.bind(this, item.ID)}>删除</a>]}>
                <div style={{width: 150}}>{item.Section}</div>
                <div>{item.CreateTime}</div>
            </List.Item>
        );
    }
    onLocation (selectedRows) {
        const { areaLayerList } = this.state;
        areaLayerList.map(item => {
            item.remove();
        });
        let coordinatesArr = []; // 多维数据
        selectedRows.map(item => {
            let coordsArr = getCoordsArr(item.coords);
            let treearea = [];
            coordsArr.map(item => {
                let arr = item.split(' ');
                treearea.push([arr[1], arr[0]]);
            });
            coordinatesArr.push(treearea);
        });
        // 如果地块存在，则定位过去
        if (coordinatesArr.length !== 0) {
            let message = {
                key: 3,
                type: 'Feature',
                properties: {name: '', type: 'area'},
                geometry: { type: 'Polygon', coordinates: coordinatesArr }
            };
            let polygon = this._createMarker(message);
            // 放大该处视角
            this.map.fitBounds(polygon.getBounds());
            this.setState({
                areaLayerList: [ polygon ]
            });
        }
    }
    /* 在地图上添加marker和polygan */
    _createMarker (geo) {
        try {
            if (geo.properties.type === 'area') {
                // 创建区域图形
                let polygon = L.polygon(geo.geometry.coordinates, {
                    color: '#201ffd',
                    fillColor: fillAreaColor(geo.key),
                    fillOpacity: 0.3
                }).addTo(this.map);
                return polygon;
            }
        } catch (e) {
            console.log('e', e);
        }
    }
    deleteRecord (ID) {
        const { deleteDataimport } = this.props.actions;
        deleteDataimport({
            id: ID
        }, {}).then(rep => {
            this.getDataHistory();
        });
    }
    onSearch (page = 1) {
        this.setState({
            spinning: true
        });
        const { section, leftkeycode } = this.state;
        const { getLands } = this.props.actions;
        getLands({}, {
            section: section || leftkeycode,
            page,
            size: 10
        }).then(rep => {
            if (rep.code === 200) {
                rep.content.map((item, index) => {
                    item.key = index;
                });
                this.setState({
                    dataList: rep.content,
                    selectedRowKeysList: [],
                    total: rep.pageinfo && rep.pageinfo.total,
                    size: rep.pageinfo && rep.pageinfo.size,
                    spinning: false
                });
            }
        });
    }
    onHistory () {
        this.setState({
            showModal: true
        });
    }
    handleSection (value) {
        this.setState({
            section: value
        });
    }
    handlePage (page) {
        this.onSearch(page);
    }
    onEdit () {

    }
    handleOk () {
        this.handleCancel();
    }
    handleCancel () {
        this.setState({
            showModal: false
        });
    }
}

export default Form.create()(Tablelevel);
