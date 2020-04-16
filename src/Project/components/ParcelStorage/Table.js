import React, { Component } from 'react';
import { Upload, Input, Icon, Button, Table, Pagination, Modal, Form, Spin, message } from 'antd';
import L from 'leaflet';
import { formItemLayout } from '_platform/auth';
import {
    fillAreaColor,
    getCoordsArr,
    getPolygonByCoordArr
} from '../auth';
import {
    FOREST_GIS_API,
    WMSTILELAYERURL,
    TILEURLS,
    INITLEAFLET_API
} from '_platform/api';
const FormItem = Form.Item;
class Tablelevel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [], // 单页数据
            newDataList: [], // 查询后每页数据
            showModal: false,
            record: {},
            indexBtn: 1,
            fileList: [],
            page: 1,
            total: 0,
            section: '', // 搜索条件-地块编号
            confirmLoading: false,
            areaLayerList: [], // 区域地块图层list
            spinning: false // 加载中
        };
        this.dataList = []; // 暂存数据
        this.newDataList = []; // 筛选后的数据
        this.onSearch = this.onSearch.bind(this); // 查询地块
        this.handleSection = this.handleSection.bind(this); // 地块编号
        this.handlePage = this.handlePage.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onPutStorage = this.onPutStorage.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);

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
            }
            // {
            //     key: '6',
            //     title: '操作',
            //     dataIndex: 'action',
            //     render: (text, record, index) => {
            //         return (
            //             <div>
            //                 <a onClick={this.onEdit.bind(this, record)}>编辑</a>
            //             </div>
            //         );
            //     }
            // }
        ];
    }
    componentDidMount () {
        // 初始化地图
        this.initMap();
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
    render () {
        const { dataList, newDataList, confirmLoading, total, page, spinning } = this.state;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.onLocation(selectedRows);
            }
        };
        const propsUpload = {
            name: 'file',
            action: '',
            beforeUpload: (file, fileList) => {
                console.log(file);
                this.setState({
                    fileList
                });
                return false;
            }
        };
        return (
            <div className='table-level'>
                <div>
                    <Form layout='inline'>
                        <FormItem label='地块编号'>
                            <Input style={{width: 200}} onChange={this.handleSection.bind(this)} />
                        </FormItem>
                        <FormItem>
                            <Button type='primary' onClick={this.onSearch.bind(this, 1)}>查询</Button>
                        </FormItem>
                        <FormItem>
                            {
                                this.state.indexBtn === 1 ? <Button type='primary' onClick={this.onAdd.bind(this)} style={{marginLeft: 50}}>上传地块</Button> : <Button type='primary' onClick={this.onPutStorage.bind(this)} style={{marginLeft: 50}} loading={spinning}>地块入库</Button>
                            }
                        </FormItem>
                    </Form>
                </div>
                <div style={{marginTop: 20}}>
                    <div style={{width: 600, height: 640, float: 'left', overflow: 'hidden'}}>
                        <Spin spinning={spinning}>
                            <Table rowSelection={rowSelection} columns={this.columns} dataSource={newDataList.length === 0 ? dataList : newDataList} pagination={false} />
                        </Spin>
                        <Pagination style={{float: 'right', marginTop: 10}} current={page} total={total} onChange={this.handlePage.bind(this)} />
                    </div>
                    {/* 地图 */}
                    <div style={{marginLeft: 620, height: 640, overflow: 'hidden', border: '3px solid #ccc'}}>
                        <div id='mapid' style={{height: 640, width: '100%'}} />
                    </div>
                </div>
                <Modal
                    title='新增地块'
                    visible={this.state.showModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    confirmLoading={confirmLoading}
                >
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label='上传文件'
                        >
                            <div>
                                <div>请上传 .zip文件</div>
                                <Upload {...propsUpload}>
                                    <Button>
                                        <Icon type='upload' /> Click to Upload
                                    </Button>
                                </Upload>
                            </div>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
    onLocation (recordArr) {
        const { areaLayerList } = this.state;
        areaLayerList.map(item => {
            item.remove();
        });
        let coordinatesArr = []; // 多维数据
        recordArr.map(item => {
            let treearea = [];
            if (item.Geom) {
                let coordsArr = getCoordsArr(item.Geom);
                coordsArr.map(item => {
                    let arr = item.split(' ');
                    treearea.push([
                        arr[1],
                        arr[0]
                    ]);
                });
            }
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
    onSearch () {
        const { section } = this.state;
        if (!section) {
            // 没条件
            this.setState({
                newDataList: []
            });
        } else {
            // 查询之后
            this.dataList.map(item => {
                if (section === item.Section) {
                    this.newDataList.push(item);
                }
            });
            this.setState({
                newDataList: this.newDataList.slice(0, 10),
                total: this.newDataList.length,
                page: 1
            });
        }
    }
    handlePage (page) {
        let index = page - 1;
        if (this.state.section) {
            this.setState({
                page,
                newDataList: this.newDataList.slice(index * 10, index * 10 + 10)
            });
        } else {
            this.setState({
                page,
                dataList: this.dataList.slice(index * 10, index * 10 + 10)
            });
        }
    }
    handleSection (e) {
        this.setState({
            section: e.target.value
        });
    }
    onAdd () {
        this.setState({
            showModal: true
        });
    }
    onPutStorage () {
        console.log('dataList', this.dataList);
        this.setState({
            spinning: true
        });
        let pro = [];
        this.dataList.map(item => {
            let coordsArr = getCoordsArr(item.Geom);
            coordsArr = coordsArr.map(item => {
                let arr = item.split(' ');
                item = arr[0] + ' ' + arr[1];
                return item;
            });
            let polygon = getPolygonByCoordArr(coordsArr);
            pro.push({
                Section: item.Section,
                coords: polygon
            });
        });
        const { importThinClass } = this.props.actions;
        console.log('pro', pro);
        importThinClass({}, pro).then(rep => {
            if (rep.code === 1) {
                message.success('地块数据入库成功');
                this.dataList = [];
                this.setState({
                    dataList: [],
                    indexBtn: 1,
                    spinning: false
                });
            } else {
                message.error('操作失败，请联系管理员查找失败原因');
            }
        });
    }
    handleCancel () {
        this.setState({
            showModal: false
        });
    }
    handleOk () {
        const { fileList } = this.state;
        const formdata = new FormData();
        formdata.append('file', fileList[0]);
        const { shapeUploadHandler } = this.props.actions;
        this.setState({
            confirmLoading: true
        });
        shapeUploadHandler({
            name: fileList[0].name.split('.')[0]
        }, formdata).then(rep => {
            rep = JSON.parse(rep);
            if (rep.errorinfo) {
                message.error(rep.errorinfo);
                this.setState({
                    confirmLoading: false,
                    fileList: [],
                    showModal: false
                });
            } else {
                rep.features.map((item, index) => {
                    item.key = index;
                });
                this.dataList = rep.features;
                this.setState({
                    confirmLoading: false,
                    indexBtn: 0,
                    page: 1,
                    total: this.dataList.length,
                    dataList: this.dataList.slice(0, 10)
                }, () => {
                    // 隐藏弹框
                    this.handleCancel();
                });
            }
        });
    }
}

export default Form.create()(Tablelevel);
