import React, { Component } from 'react';
import moment from 'moment';
import { Upload, Input, Icon, Button, Select, Table, Pagination, Modal, Form, Spin, message } from 'antd';
import { getUser, formItemLayout } from '_platform/auth';
import {
    fillAreaColor,
    getCoordsArr
} from '../auth';
const FormItem = Form.Item;
const Option = Select.Option;
window.config = window.config || {};
class Tablelevel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [], // 每页的数据
            newDataList: [], // 查询后每页数据
            showModal: false,
            record: {}, // 行数据
            indexBtn: 1, // 是否为上传细班选项
            fileList: [], // 上传的文件列表
            selectKey: [], // 选中的可上传细班
            page: 1,
            total: 0,
            confirmLoading: false, // 是否允许取消
            number: '', // 细班编号
            areaLayerList: [], // 区域地块图层list
            spinning: false // 加载中
        };
        this.dataList = []; // 所有的暂存数据
        this.newDataList = []; // 筛选后数据
        this.userSection = ''; // 用户所属标段
        this.onSearch = this.onSearch.bind(this); // 查询细班
        this.handleNumber = this.handleNumber.bind(this); // 细班编号
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.onAdd = this.onAdd.bind(this); // 暂存细班
        this.onEdit = this.onEdit.bind(this);
        this.onPutStorage = this.onPutStorage.bind(this); // 细班入库
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
    WMSTileLayerUrl = window.config.WMSTileLayerUrl;
    tileUrls = {
        1: window.config.IMG_W,
        2: window.config.VEC_W
    };
    componentDidMount () {
        this.initMap();
        let userData = getUser();
        this.userSection = userData.sections.slice(2, -2);
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
        const { dataList, newDataList, total, page, confirmLoading, spinning, selectKey } = this.state;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log('定位过去');
                this.onLocation(selectedRows);
            },
            onSelect: (record, selected) => {
                if (selected) {
                    // 增加
                    if (record.Section === this.userSection) {
                        selectKey.push(record.key);
                    }
                } else {
                    // 减少
                    let index = selectKey.indexOf(record.key);
                    selectKey.splice(index, 1);
                }
            },
            hideDefaultSelections: true,
            selectedRowKeys: selectKey
        };
        const propsUpload = {
            name: 'file',
            action: '',
            beforeUpload: (file, fileList) => {
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
                                this.state.indexBtn === 1 ? <Button type='primary' onClick={this.onAdd.bind(this)} style={{marginLeft: 50}}>上传细班</Button> : <Button type='primary' onClick={this.onPutStorage.bind(this)} style={{marginLeft: 50}} loading={spinning}>细班入库</Button>
                            }
                        </FormItem>
                    </Form>
                </div>
                <div style={{marginTop: 20}}>
                    <div style={{width: 600, height: 700, float: 'left'}}>
                        <Spin spinning={spinning}>
                            <Table rowSelection={rowSelection} columns={this.columns} dataSource={newDataList.length === 0 ? dataList : newDataList} pagination={false} />
                        </Spin>
                        <Pagination style={{float: 'right', marginTop: 10}} current={page} total={total} onChange={this.handlePage.bind(this)} showQuickJumper />
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
        console.log('定位数据', recordArr);
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
        const { number } = this.state;
        if (!number) {
            this.setState({
                newDataList: []
            });
        } else {
            // 查询之后
            let newDataList = [];
            this.dataList.map(item => {
                if (item.ThinClass === number) {
                    newDataList.push(item);
                }
            });
            this.newDataList = newDataList;
            console.log('查询后数据', this.newDataList);
            this.setState({
                newDataList: this.newDataList.slice(0, 10),
                total: this.newDataList.length,
                page: 1
            });
        }
    }
    handlePage (page) {
        console.log('换页', page);
        let index = page - 1;
        if (this.state.number) {
            console.log('新数据');
            this.setState({
                page,
                newDataList: this.newDataList.slice(index * 10, index * 10 + 10)
            });
        } else {
            console.log('老数据');
            this.setState({
                page,
                dataList: this.dataList.slice(index * 10, index * 10 + 10)
            });
        }
    }
    onPutStorage () {
        this.setState({
            spinning: true
        });
        let pro = [];
        const { selectKey } = this.state;
        console.log('所有数据', this.dataList);
        this.dataList.map(item => {
            // 入库选中的数据
            selectKey.map(row => {
                if (item.key === row) {
                    pro.push({
                        no: item.ThinClass,
                        treetype: item.TreeType,
                        Section: item.Section,
                        num: item.Num, // 细班计划种植数量
                        area: item.Area, // 面积
                        Level: item.Spec, // 规格
                        coords: item.Geom, // WKT格式item.Geom
                        TCNo: item.TCNo // 细班唯一顺序属性
                    });
                }
            });
        });
        const { importThinClass } = this.props.actions;
        console.log(pro);
        if (pro.length === 0) {
            message.error('没有可供入库的数据');
            this.setState({
                spinning: false
            });
            return;
        } else {
            importThinClass({}, pro).then(rep => {
                if (rep.code === 1) {
                    message.success('细班数据入库成功');
                    this.dataList = [];
                    this.setState({
                        dataList: [],
                        indexBtn: 1,
                        spinning: false
                    });
                }
            });
        }
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
            rep = JSON.parse(rep);
            // 解析文件失败
            if (rep.errorinfo) {
                message.error(rep.errorinfo);
                this.setState({
                    confirmLoading: false,
                    fileList: [],
                    showModal: false
                }, () => {
                    return;
                });
            } else {
                rep.features.map((item, index) => {
                    item.key = index;
                });
                this.dataList = rep.features;
                console.log('最初数据', this.dataList);
                let selectKey = [];
                this.dataList.map(item => {
                    if (item.Section === this.userSection) {
                        selectKey.push(item.key);
                    }
                });
                this.setState({
                    confirmLoading: false,
                    indexBtn: 0,
                    page: 1,
                    total: this.dataList.length,
                    selectKey,
                    dataList: this.dataList.slice(0, 10)
                }, () => {
                    // 隐藏弹框
                    this.handleCancel();
                });
            }
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
}

export default Form.create()(Tablelevel);
