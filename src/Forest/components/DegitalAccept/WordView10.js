import React, { Component } from 'react';
import { Spin, Modal, Row, Col } from 'antd';
import {
    WMSTILELAYERURL,
    TILEURLS,
    INITLEAFLET_API
} from '_platform/api';
import L from 'leaflet';
import './index.less';
import {getForestImgUrl} from '_platform/auth';
import {
    fillAreaColor,
    handleCoordinates
} from './auth';
import {
    handlePOLYGONWktData
} from '_platform/gisAuth';
import moment from 'moment';
export default class WordView1 extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            leader: '',
            unitName: '',
            coords: [],
            tableData: []
        };
    }

    componentDidMount = async () => {
        const {
            itemDetail = {}
        } = this.props;
        await this.initMap();
        if (itemDetail && itemDetail.ID) {
            await this._addAreaLayer(itemDetail);
            await this.getUnitMessage(itemDetail);
        }
    }

    /* 初始化地图 */
    initMap () {
        try {
            let mapInitialization = INITLEAFLET_API;
            mapInitialization.crs = L.CRS.EPSG4326;
            this.map = L.map('mapid', mapInitialization);
            // 加载基础图层
            this.tileLayer = L.tileLayer(TILEURLS[1], {
                // subdomains: [3],
                subdomains: [0, 1, 2, 3, 4, 5, 6, 7], // 天地图有7个服务节点，代码中不固定使用哪个节点的服务，而是随机决定从哪个节点请求服务，避免指定节点因故障等原因停止服务的风险
                minZoom: 12,
                maxZoom: 17,
                zoomOffset: 1
            }).addTo(this.map);
            // 地图上边的地点的名称
            L.tileLayer(WMSTILELAYERURL, {
                // subdomains: [3],
                subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
                minZoom: 12,
                maxZoom: 17,
                zoomOffset: 1
            }).addTo(this.map);
        } catch (e) {
            console.log('initMap', e);
        }
    }
    // 选中细班，则在地图上加载细班图层
    _addAreaLayer = async (itemDetail) => {
        try {
            let str = '';
            let coords = [];
            let wkt = itemDetail.Coords;
            if (wkt.indexOf('MULTIPOLYGON') !== -1) {
                let datas = wkt.slice(wkt.indexOf('(') + 2, wkt.indexOf(')))') + 1);
                let arr = datas.split('),(');
                arr.map((a, index) => {
                    str = a.slice(a.indexOf('(') + 1, a.length - 1);
                    coords.push(str);
                });
            } else if (wkt.indexOf('POLYGON') !== -1) {
                str = handlePOLYGONWktData(wkt);
                coords.push(str);
            }
            this.setState({
                coords
            });
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
                }
            };
            this.setTableData(coords);
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

    onOk () {
        this.props.onPressOk(10);
    }
    getUnitMessage = (detail) => {
        const {
            unitMessage = []
        } = this.props;
        let leader = '';
        let unitName = '';
        if (detail && detail.Section) {
            unitMessage.map((unit) => {
                if (unit && unit.Section && unit.Section === detail.Section) {
                    leader = unit.Leader;
                    unitName = unit.Unit;
                }
            });
        }
        this.setState({
            leader,
            unitName
        });
    }
    setTableData = (corrds) => {
        console.log('corrds', corrds);
        let tableData = [];
        let treearea = [];
        if (corrds.length > 0) {
            for (let i = 0; i < corrds.length; i++) {
                let str = corrds[i];
                let data = handleCoordinates(str);
                console.log('data', data);
                if (data && data instanceof Array && data.length === 1) {
                    treearea = treearea.concat(data[0]);
                    console.log('data[0]', data[0]);
                }
            }
        }
        console.log('treearea', treearea);

        for (let i = 0; i < treearea.length; i = i + 2) {
            let a = i;
            let b = i + 1;
            if (a !== treearea.length - 1) {
                tableData.push(
                    <tr>
                        <td>{a + 1}</td>
                        <td>{treearea[a][1] || ''}</td>
                        <td >{treearea[a][0] || ''}</td>
                        <td>{b + 1}</td>
                        <td>{treearea[b][1] || ''}</td>
                        <td >{treearea[b][0] || ''}</td>
                    </tr>
                );
            } else {
                tableData.push(
                    <tr>
                        <td>{a + 1}</td>
                        <td>{treearea[a][1] || ''}</td>
                        <td>{treearea[a][0] || ''}</td>
                        <td />
                        <td />
                        <td />
                    </tr>
                );
            }
        }
        this.setState({
            tableData
        });
    }
    onImgClick (data) {
        let srcs = [];
        try {
            let arr = data.split(',');
            arr.map(rst => {
                let src = getForestImgUrl(rst);
                srcs.push(src);
            });
        } catch (e) {
            console.log('处理图片', e);
        }
        return srcs;
    }
    handleDetailData = (detail, record) => {
        let handleDetail = {};
        handleDetail.unit = (record && record.Land) || '';
        handleDetail.jianli = (record && record.SupervisorObj && record.SupervisorObj.Full_Name) || '';
        handleDetail.shigong = (record && record.ConstructerObj && record.ConstructerObj.Full_Name) || '';
        handleDetail.checker = (record && record.ApplierObj && record.ApplierObj.Full_Name) || '';
        handleDetail.surveyorName = (record && record.SurveyorObj && record.SurveyorObj.Full_Name) || '';
        handleDetail.designArea = (detail && detail.DesignArea && (detail.DesignArea * 0.0015).toFixed(2)) || '';
        handleDetail.actualArea = (detail && detail.ActualArea && (detail.ActualArea * 0.0015).toFixed(2)) || '';
        handleDetail.applyTime = (record && record.ApplyTime && moment(record.ApplyTime).format('YYYY年MM月DD日')) || '';
        handleDetail.createTime = (record && record.CheckTime && moment(record.CheckTime).format('YYYY年MM月DD日')) || '';
        handleDetail.areaRate = (detail && detail.AreaRate && Math.abs(detail.AreaRate)) || '';
        handleDetail.area = (detail && detail.Area && (detail.Area * 0.0015).toFixed(2)) || '';
        handleDetail.LocalPic = detail.LocalPic ? this.onImgClick(detail.LocalPic) : '';
        handleDetail.LocalDescribe = (detail && detail.LocalDescribe) || '';
        handleDetail.AllViewPic = detail.AllViewPic ? this.onImgClick(detail.AllViewPic) : '';
        handleDetail.AllViewDescribe = (detail && detail.AllViewDescribe) || '';
        return handleDetail;
    }
    render () {
        const {
            leader,
            unitName,
            loading,
            tableData
        } = this.state;
        const {
            itemDetail,
            record
        } = this.props;
        let array = ['', '', '', ''];
        if (itemDetail && itemDetail.ThinClass) {
            array = itemDetail.ThinClass.split('-');
        }
        let handleDetail = this.handleDetailData(itemDetail, record);
        return (
            <Spin spinning={loading}>
                <Modal
                    width={800}
                    visible={this.props.visible}
                    title='造林面积验收记录'
                    onOk={this.onOk.bind(this)}
                    maskClosable={false}
                    onCancel={this.onOk.bind(this)}
                    footer={null}
                >
                    <div>
                        <div className='trrdd'>
                            <table style={{ border: 1 }}>
                                <tbody>
                                    <tr>
                                        <td style={{ height: 60, width: 118 }} >单位工程名称</td>
                                        <td colSpan='3'> {handleDetail.unit}</td>
                                        <td style={{ width: 118 }}>细班（小班）</td>
                                        <td colSpan='3'>{`${array[2]}小班${array[3]}细班`}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ height: 60, align: 'center' }}>施工单位</td>
                                        <td colSpan='3'>{unitName}</td>
                                        <td >项目经理</td>
                                        <td >{leader}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ height: 60, align: 'center' }}>施工员</td>
                                        <td colSpan='1'>{handleDetail.shigong}</td>
                                        <td>测量员</td>
                                        <td colSpan='1'>{handleDetail.surveyorName}</td>
                                        <td>设计面积</td>
                                        <td >{`${handleDetail.designArea} (亩)`}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ height: 60, align: 'center' }}>实际面积</td>
                                        <td colSpan='1'>{`${handleDetail.actualArea} (亩)`}</td>
                                        <td>造林面积</td>
                                        <td colSpan='1'>{`${handleDetail.area} (亩)`}</td>
                                        <td>误差率</td>
                                        <td>{`${handleDetail.areaRate}%`}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ height: 60 }} >施工执行标准名称及编号</td>
                                        <td colSpan='5'> 《雄安新区造林工作手册》</td>
                                    </tr>
                                    <tr>
                                        <td style={{ height: 300 }} colSpan='6'>
                                            <div
                                                id='mapid'
                                                style={{
                                                    height: 300,
                                                    borderLeft: '1px solid #ccc'
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td rowSpan={2}>序号</td>
                                        <td colSpan='2'>测量坐标</td>
                                        <td rowSpan={2}>序号</td>
                                        <td colSpan='2'>测量坐标</td>

                                    </tr>
                                    <tr>
                                        <td>X</td>
                                        <td>Y</td>
                                        <td>X</td>
                                        <td>Y</td>
                                    </tr>
                                    {
                                        tableData
                                    }
                                    <tr>
                                        <td style={{ height: 110 }} >施工单位质量专检结果</td>
                                        <td colSpan='5'>
                                            <div>
                                                <div style={{ float: 'left', marginLeft: 10 }}>
                                                    <p >项目专业质量检查员：</p><p>{handleDetail.checker}</p>
                                                </div>
                                                <p style={{ float: 'right', marginRight: 10 }}>{handleDetail.applyTime}</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ height: 110 }} >监理（建设）单位验收记录</td>
                                        <td colSpan='5'>
                                            <div>
                                                <div style={{ float: 'left', marginLeft: 10 }}>
                                                    <p>监理工程师：</p><p>{handleDetail.jianli}</p>
                                                </div>
                                                <p style={{ float: 'right', marginRight: 10 }}>{handleDetail.createTime}</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div>
                                <p>注：1.测量坐标记录可另附表。2.本表需附面积测量图。</p>
                            </div>
                        </div>
                        {
                            handleDetail.AllViewPic || handleDetail.LocalPic
                                ? (
                                    <h1>附件：</h1>
                                ) : ''
                        }
                        {
                            handleDetail.AllViewPic
                                ? (
                                    <Row gutter={10}>
                                        <h2 style={{marginLeft: 5}}>全景照片</h2>
                                        <div style={{marginLeft: 5, marginBottom: 5}}>
                                            <span style={{fontSize: 15, fontWeight: 'bold'}}>
                                            验收说明：
                                            </span>
                                            <span>
                                                {handleDetail.AllViewDescribe || '无'}
                                            </span>
                                        </div>
                                        {
                                            handleDetail.AllViewPic.map((src) => {
                                                if (handleDetail.AllViewPic.length === 1) {
                                                    return (
                                                        <Row>
                                                            <Col span={6} />
                                                            <Col span={12}>
                                                                <img style={{ width: '100%' }} src={src} alt='图片' />
                                                            </Col>
                                                            <Col span={6} />
                                                        </Row>
                                                    );
                                                } else {
                                                    return (
                                                        <Col span={12}>
                                                            <img style={{ width: '100%' }} src={src} alt='图片' />
                                                        </Col>
                                                    );
                                                }
                                            })
                                        }
                                    </Row>
                                ) : ''
                        }
                        {
                            handleDetail.LocalPic
                                ? (
                                    <Row gutter={10}>
                                        <h2 style={{marginLeft: 5}}>局部照片</h2>
                                        <div style={{marginLeft: 5, marginBottom: 5}}>
                                            <span style={{fontSize: 15, fontWeight: 'bold'}}>
                                            验收说明：
                                            </span>
                                            <span>
                                                {handleDetail.LocalDescribe || '无'}
                                            </span>
                                        </div>
                                        {
                                            handleDetail.LocalPic.map((src) => {
                                                if (handleDetail.LocalPic.length === 1) {
                                                    return (
                                                        <Row>
                                                            <Col span={6} />
                                                            <Col span={12}>
                                                                <img style={{ width: '100%' }} src={src} alt='图片' />
                                                            </Col>
                                                            <Col span={6} />
                                                        </Row>
                                                    );
                                                } else {
                                                    return (
                                                        <Col span={12}>
                                                            <img style={{ width: '100%' }} src={src} alt='图片' />
                                                        </Col>
                                                    );
                                                }
                                            })
                                        }
                                    </Row>
                                ) : ''
                        }
                    </div>

                </Modal>
            </Spin>
        );
    }
}
