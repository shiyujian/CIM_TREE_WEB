import React, { Component } from 'react';
import moment from 'moment';
import { Upload, Input, Icon, Button, Select, Table, Pagination, Modal, Form, Spin, message } from 'antd';
import { getUser, formItemLayout, getForestImgUrl, getUserIsManager } from '_platform/auth';
import {
    fillAreaColor,
    getCoordsArr,
    getPolygonByCoordArr
} from '../auth';
const FormItem = Form.Item;
window.config = window.config || {};
class Tablelevel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [],
            showModal: false,
            record: {},
            indexBtn: 1,
            fileList: [],
            page: 1,
            total: 0,
            confirmLoading: false, // 是否允许取消
            number: '',
            areaLayerList: [] // 区域地块图层list
        };
        this.dataList = []; // 暂存数据
        this.onSearch = this.onSearch.bind(this); // 查询细班
        this.handleNumber = this.handleNumber.bind(this); // 细班编号
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.onAdd = this.onAdd.bind(this); // 暂存细班
        this.onEdit = this.onEdit.bind(this);
        this.onUpload = this.onUpload.bind(this); // 细班入库
        this.handlePage = this.handlePage.bind(this);
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
                title: '细班编号',
                dataIndex: 'ThinClass'
            },
            {
                key: '3',
                title: '树木类型',
                dataIndex: 'TreeType'
            },
            {
                key: '4',
                title: '细班面积',
                dataIndex: 'Area'
            },
            {
                key: '5',
                title: '计划栽植量',
                dataIndex: 'Num'
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
    WMSTileLayerUrl = window.config.WMSTileLayerUrl;
    tileUrls = {
        1: window.config.IMG_W,
        2: window.config.VEC_W
    };
    componentDidMount () {
        this.initMap();
    }
    initMap () {
        // 基础设置
        this.map = L.map('mapid', {
            zoom: 14,
            center: [39.04882729053497, 115.90790748596191],
            crs: L.CRS.EPSG4326,
            zoomControl: false
        });
        // 基础图层
        this.tileLayer = L.tileLayer(this.tileUrls[1], {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 17,
            storagetype: 0
        }).addTo(this.map);
        // 道路图层
        L.tileLayer(this.WMSTileLayerUrl, {
            subdomains: [1, 2, 3],
            minZoom: 1,
            maxZoom: 17,
            storagetype: 0
        }).addTo(this.map);
        // 树木瓦片图层
        L.tileLayer(
            window.config.DASHBOARD_ONSITE + '/geoserver/gwc/service/wmts?layer=xatree%3Atreelocation&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}', {
                opacity: 1.0,
                subdomains: [1, 2, 3],
                minZoom: 11,
                maxZoom: 21,
                storagetype: 0,
                tiletype: 'wtms'
            }
        ).addTo(this.map);
    }
    render () {
        const { dataList, total, page, confirmLoading } = this.state;
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
                        <FormItem label='细班编号'>
                            <Input style={{width: 200}} onChange={this.handleNumber.bind(this)} />
                        </FormItem>
                        <FormItem>
                            <Button type='primary' onClick={this.onSearch.bind(this)}>查询</Button>
                        </FormItem>
                        <FormItem>
                            {
                                this.state.indexBtn === 1 ? <Button type='primary' onClick={this.onAdd.bind(this)} style={{marginLeft: 50}}>上传细班</Button> : <Button type='primary' onClick={this.onUpload.bind(this)} style={{marginLeft: 50}}>细班入库</Button>
                            }
                        </FormItem>
                    </Form>
                </div>
                <div style={{marginTop: 20}}>
                    <div style={{width: 600, height: 700, float: 'left'}}>
                        <Table rowSelection={rowSelection} columns={this.columns} dataSource={dataList} pagination={false} rowKey='ThinClass' />
                        <Pagination style={{float: 'right', marginTop: 10}} defaultCurrent={page} total={total} onChange={this.handlePage.bind(this)} />
                    </div>
                    {/* 地图 */}
                    <div style={{marginLeft: 620, height: 700, overflow: 'hidden', border: '3px solid #ccc'}}>
                        <div id='mapid' style={{height: 700, width: '100%'}} />
                    </div>
                </div>
                <Modal
                    title='新增细班'
                    maskClosable={false}
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
        console.log('coordinatesArr', coordinatesArr);
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
        const { number } = this.state;
        console.log(number);
        if (!number) {
            this.setState({
                dataList: this.dataList.slice(0, 10)
            });
        }
        this.dataList.map(item => {
            if (item.ThinClass === number) {
                this.setState({
                    dataList: [item]
                });
            }
        });
    }
    onUpload () {
        console.log(this.props.actions);
        let pro = [];
        this.dataList.map(item => {
            pro.push({
                no: item.ThinClass,
                treetype: item.TreeType,
                Section: item.Section,
                num: item.Num, // 细班计划种植数量
                area: item.Area, // 面积
                Level: item.Spec, // 规格
                coords: '' // WKT格式item.Geom
            });
        });
        const { importThinClass } = this.props.actions;
        console.log(pro);
        importThinClass({}, pro).then(rep => {
            if (rep.code === 1) {
                message.success('细班数据入库成功');
                console.log(rep);
                this.dataList = [];
                this.setState({
                    dataList: []
                });
            }
        });
    }
    handleNumber (e) {
        this.setState({
            number: e.target.value
        });
    }
    onAdd () {
        this.setState({
            showModal: true
        });
    }
    onEdit (record, e) {
        e.preventDefault();
        this.setState({
            showModal: true,
            record
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
            console.log(rep);
            rep = JSON.parse(rep);
            this.dataList = rep.features;
            console.log(this.dataList);
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
        });
    }
    handleCancel () {
        if (this.state.confirmLoading) {
            message.warning('文件上传中不允许取消');
            return;
        }
        this.setState({
            showModal: false,
            fileList: [],
            record: {}
        });
    }
    handlePage (page) {
        page = page - 1;
        this.setState({
            dataList: this.dataList.slice(page * 10, page * 10 + 10)
        });
    }
}

export default Form.create()(Tablelevel);
