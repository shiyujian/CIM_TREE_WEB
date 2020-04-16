import React, { Component } from 'react';
import { Upload, Input, Icon, Button, Table, Pagination, Modal, Form, Spin, message } from 'antd';
import L from 'leaflet';
import { getUser, formItemLayout } from '_platform/auth';
import {
    fillAreaColor,
    getNewCoordsArrByMULTIPOLYGON,
    getNewCoordsArrByPOLYGON,
    getNewMultiPolygonByCoordArr,
    getNewPolygonByCoordArr
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
            dataList: [], // 每页的数据
            newDataList: [], // 查询后每页数据
            isSuperAdmin: false, // 是否是超级管理员
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
        this.handlePage = this.handlePage.bind(this); // 换页
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
                title: '树种',
                dataIndex: 'TreeType'
            },
            {
                key: '4',
                title: '设计面积',
                dataIndex: 'Area'
            },
            {
                key: '5',
                title: '设计量',
                dataIndex: 'Num'
            }
        ];
    }
    componentDidMount () {
        this.initMap();
        let userData = getUser();
        this.userSection = userData.section;
        if (userData.username === 'admin') {
            this.setState({
                isSuperAdmin: true
            });
        } else {
            this.setState({
                isSuperAdmin: false
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
    render () {
        const { dataList, newDataList, total, page, confirmLoading, spinning, selectKey, isSuperAdmin } = this.state;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log('定位过去', selectedRows);
                this.onLocation(selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log('全部选择', selected, selectedRows, changeRows);
                if (selected) {
                    changeRows.map(item => {
                        selectKey.push(item.key);
                    });
                    this.setState({
                        selectKey: selectKey
                    });
                } else {
                    let newSelectKey = [];
                    changeRows.map(item => {
                        selectKey.map(row => {
                            if (row.key === item.key) {

                            } else {
                                newSelectKey.push(row.key);
                            }
                        });
                    });
                    this.setState({
                        selectKey: newSelectKey
                    });
                }
            },
            onSelect: (record, selected) => {
                console.log('选择', record.Section, '选择', this.userSection);
                if (selected) {
                    // 增加
                    if (isSuperAdmin || record.Section === this.userSection || this.userSection.indexOf(record.Section) > -1) {
                        selectKey.push(record.key);
                        this.setState({
                            selectKey: selectKey
                        });
                        console.log('选中的key', selectKey);
                    } else {
                        message.error('勾选失败，当前用户所属标段与该细班所属标段不符');
                    }
                } else {
                    // 减少
                    let index = selectKey.indexOf(record.key);
                    selectKey.splice(index, 1);
                    this.setState({
                        selectKey: selectKey
                    });
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
                                this.state.indexBtn === 1 ? <Button
                                    type='primary'
                                    onClick={this.onAdd.bind(this)}
                                    style={{marginLeft: 50}}
                                >上传细班</Button>
                                    : <Button
                                        type='primary'
                                        onClick={this.onPutStorage.bind(this)}
                                        style={{marginLeft: 50}}
                                        loading={spinning}
                                    >细班入库</Button>
                            }
                        </FormItem>
                    </Form>
                </div>
                <div style={{marginTop: 20}}>
                    <div style={{width: 600, height: 700, float: 'left'}}>
                        <Spin spinning={spinning}>
                            <Table
                                rowKey='key'
                                rowSelection={rowSelection}
                                columns={this.columns}
                                dataSource={newDataList.length === 0 ? dataList : newDataList}
                                pagination={false}
                            />
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
    onLocation (selectedRows) {
        const { areaLayerList, isSuperAdmin } = this.state;
        areaLayerList.map(item => {
            item.remove();
        });
        let coordinatesArr = []; // 二维数据[[[y,x],[y,x]], [[y,x],[y,x]]]
        let selectKey = [];
        selectedRows.map(item => {
            if (isSuperAdmin || item.Section === this.userSection) {
                selectKey.push(item.key);
            }
        });
        console.log('选中的', selectKey, selectedRows);
        this.setState({
            selectKey
        });
        selectedRows.map(item => {
            if (item.Geom && item.Geom.indexOf('MULTIPOLYGON') !== -1) {
                let temporaryWKT = item.Geom.slice(item.Geom.indexOf('(((') + 3, item.Geom.indexOf(')))'));
                let coordsArr = getNewCoordsArrByMULTIPOLYGON(temporaryWKT); // [闭合圈数组, [闭合圈数组，闭合圈数组]]
                console.log('分解后的数组', coordsArr);
                coordsArr.map(row => {
                    let treearea = []; // 闭合圈 [[y,x],[y,x]]
                    let finalCoordsArr = []; // 多圈数据组合
                    row.map(record => {
                        finalCoordsArr.push(...record);
                    });
                    finalCoordsArr.map(record => {
                        let arr = record.split(' ');
                        treearea.push([
                            arr[1],
                            arr[0]
                        ]);
                    });
                    coordinatesArr.push(treearea);
                });
            } else if (item.Geom && item.Geom.indexOf('POLYGON') !== -1) {
                let treearea = []; // 闭合圈 [[y,x],[y,x]]
                let temporaryWKT = item.Geom.slice(item.Geom.indexOf('((') + 2, item.Geom.indexOf('))'));
                let coordsArr = getNewCoordsArrByPOLYGON(temporaryWKT); // 二维数组[闭合圈数组,闭合圈数组]
                let finalCoordsArr = []; // 多圈数据组合
                coordsArr.map(row => {
                    finalCoordsArr.push(...row);
                });
                finalCoordsArr.map(row => {
                    let arr = row.split(' ');
                    treearea.push([
                        arr[1],
                        arr[0]
                    ]);
                });
                coordinatesArr.push(treearea);
            }
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
        console.log('查询条件', number);
        if (!number) {
            this.setState({
                newDataList: [],
                dataList: this.dataList.slice(0, 10),
                page: 1,
                total: this.dataList.length
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
            if (this.newDataList.length === 0) {
                this.setState({
                    newDataList: [],
                    dataList: []
                });
            } else {
                this.setState({
                    newDataList: this.newDataList.slice(0, 10),
                    total: this.newDataList.length,
                    page: 1
                });
            }
        }
    }
    handlePage (page) {
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
                        num: parseInt(item.Num || 0), // 细班计划种植数量
                        area: parseFloat(item.Area || item.area || 0), // 面积
                        Level: item.Spec, // 规格
                        coords: item.Geom, // WKT格式item.Geom
                        TCNo: parseInt(item.TCNo || 0) // 细班唯一顺序属性
                    });
                }
            });
        });
        const { importThinClass } = this.props.actions;
        console.log(pro);
        if (pro.length === 0) {
            message.error('请从以下列表，勾选你要上传的数据');
            this.setState({
                spinning: false
            });
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
                } else {
                    message.error('操作失败，请联系管理员查找失败原因');
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
        const { fileList, isSuperAdmin } = this.state;
        const formdata = new FormData();
        formdata.append('file', fileList[0]);
        const { shapeUploadHandler } = this.props.actions;
        this.setState({
            confirmLoading: true
        });
        shapeUploadHandler({
            name: fileList[0].name.split('.')[0]
        }, formdata).then(rep => {
            if (rep === '未将对象引用设置到对象的实例。') {
                message.error('文件格式有问题，请联系管理人员查找原因');
                this.setState({
                    confirmLoading: false
                });
            }
            // 清除不规范字符
            rep = rep.replace(/\\/g, ' ');
            rep = typeof rep === 'string' ? JSON.parse(rep) : rep;

            // 解析文件失败
            if (rep.errorinfo) {
                message.error(rep.errorinfo);
                this.setState({
                    confirmLoading: false,
                    fileList: [],
                    showModal: false
                }, () => {

                });
            } else if (rep.features) {
                message.success('数据导入成功，已默认勾选可以的入库的数据');
                console.log(rep.features, '处理前的');
                // debugger
                rep.features.map((item, index) => {
                    item.key = index;
                    if (item.Geom.indexOf('MULTIPOLYGON') !== -1) {
                        let geomStr = item.Geom.slice(item.Geom.indexOf('(((') + 3, item.Geom.indexOf(')))'));
                        let finalCoordsArr = getNewCoordsArrByMULTIPOLYGON(geomStr);
                        item.Geom = getNewMultiPolygonByCoordArr(finalCoordsArr);
                        // debugger
                    } else if (item.Geom.indexOf('POLYGON') !== -1) {
                        let geomStr = item.Geom.slice(item.Geom.indexOf('((') + 2, item.Geom.indexOf('))'));
                        let finalCoordsArr = getNewCoordsArrByPOLYGON(geomStr);
                        item.Geom = getNewPolygonByCoordArr(finalCoordsArr);
                    }
                });
                console.log(rep.features, '处理后的');
                this.dataList = rep.features;
                // 选中可以上传的
                let selectKey = [];
                this.dataList.map((item, index) => {
                    item.key = index;
                    if (isSuperAdmin || item.Section === this.userSection) {
                        selectKey.push(item.key);
                    }
                });
                console.log('新数据', this.dataList);
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
