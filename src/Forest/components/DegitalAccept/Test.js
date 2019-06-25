import React, { Component } from 'react';
import { Spin, Modal, Row, Col } from 'antd';
import L from 'leaflet';
import './index.less';
import {
    FOREST_GIS_API,
    FOREST_GIS_TREETYPE_API,
    WMSTILELAYERURL,
    TILEURLS,
    INITLEAFLET_API
} from '_platform/api';
import {
    fillAreaColor,
    handleAreaLayerData,
    handleCoordinates
} from 'Dashboard/components/auth';

export default class Test extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            areaLayerList: [] //
        };
        this.map = null;
    }

    // 初始化地图，获取目录树数据
    componentDidMount = async () => {
        await this.initMap();
        this._addAreaLayer('P009-01-002-002', 'P009-01-01');
    }

    componentWillUnmount () {
        this.map = null;
    }

    onOk () {
        // this.props.onPressOk(1)
    }
    /* 初始化地图 */
    initMap () {
        try {
            let mapInitialization = INITLEAFLET_API;
            mapInitialization.crs = L.CRS.EPSG4326;
            this.map = L.map('mapid', mapInitialization);
            this.tileLayer = L.tileLayer(TILEURLS[1], {
                subdomains: [1, 2, 3], // 天地图有7个服务节点，代码中不固定使用哪个节点的服务，而是随机决定从哪个节点请求服务，避免指定节点因故障等原因停止服务的风险
                minZoom: 10,
                maxZoom: 17,
                zoomOffset: 1
            }).addTo(this.map);
            // 地图上边的地点的名称
            L.tileLayer(WMSTILELAYERURL, {
                subdomains: [1, 2, 3],
                minZoom: 10,
                maxZoom: 17,
                zoomOffset: 1
            }).addTo(this.map);
            // 加载苗木图层
            // this.getTileLayerTreeBasic();
            // 加载秋冬季的细班图层
            // this.getTileTreeWinterThinClassLayerBasic();
            // 获取秋冬季的区块范围
            // this.getTileTreeWinterProjectLayerBasic();
        } catch (e) {
            console.log('initMap', e);
        }
    }

    // 选中细班，则在地图上加载细班图层
    _addAreaLayer = async (eventKey, section) => {
        const {
            areaLayerList
        } = this.state;
        const {
            actions: { getTreearea }
        } = this.props;
        console.log(eventKey);
        try {
            let coords = await handleAreaLayerData(eventKey, getTreearea, section);
            if (coords && coords instanceof Array && coords.length > 0) {
                for (let i = 0; i < coords.length; i++) {
                    let str = coords[i];
                    let treearea = handleCoordinates(str);
                    let message = {
                        key: 3,
                        type: 'Feature',
                        properties: { name: '', type: 'area' },
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

    render () {
        const { detail } = this.props;
        let array = ['', '', '', ''];
        if (detail && detail.ThinClass) {
            array = detail.ThinClass.split('-');
        }
        let unit = detail && detail.AcceptanceObj && detail.AcceptanceObj.Land || '';
        let jianli = detail && detail.AcceptanceObj && detail.AcceptanceObj.SupervisorObj.Full_Name || '';
        let shigong = detail && detail.AcceptanceObj && detail.AcceptanceObj.ApplierObj.Full_Name || '';
        let sjmj = detail && detail.DesignArea || '';
        let shijmj = detail && detail.ActualArea || '';
        let thinclass = 'P191-01-002-002';
        let hege = 70;
        let buhege = 30;
        let currenthege = 0;
        let currentbuhege = 0;
        let total = hege + buhege;
        let rowList = [];
        for (let i = 0; i < total / 17; i++) { // 判断需要展示多少行
            let colList = [];
            for (let j = 0; j < 17; j++) {
                if (Math.random() > 0.3) {
                    if (currenthege !== hege) { // 还有合格的选项
                        colList.push(<Col span={1}><div style={{}}>√</div></Col>);
                        currenthege++;
                    } else if (currentbuhege !== buhege) { // 没有合格的选项了，只能添加不合格
                        colList.push(<Col span={1}><div>×</div></Col>);
                        currentbuhege++;
                    } else { // 都没有选项了，添加空项
                        colList.push(<Col span={1}><div style={{height: 21}}>{ }</div></Col>);
                    }
                } else {
                    if (currentbuhege !== buhege) {
                        colList.push(<Col span={1}><div>×</div></Col>);
                        currentbuhege++;
                    } else if (currenthege !== hege) {
                        colList.push(<Col span={1}><div>√</div></Col>);
                        currenthege++;
                    } else {
                        colList.push(<Col span={1}><div style={{height: 21}}>{ }</div></Col>);
                    }
                }
            }
            rowList.push(colList);
        }
        return (
            <Spin spinning={this.state.loading}>
                <Modal
                    width={800}
                    visible={this.props.visible}
                    title='土地整改质量验收记录'
                    onOk={this.onOk.bind(this)}
                    maskClosable={false}
                    onCancel={this.onOk.bind(this)}
                    footer={null}
                >
                    <div className='trrdd'>
                        <table style={{ border: 1 }}>
                            <tbody>
                                <tr>
                                    <td style={{ height: 60, width: 118 }}>单位工程名称</td>
                                    <td colSpan='3'>{unit}</td>
                                    <td style={{ width: 118 }}>细班（小班）</td>
                                    <td>{`${array[2]}(${array[3]})`}</td>
                                </tr>
                                <tr>
                                    <td style={{ height: 60, align: 'center' }} >施工单位</td>
                                    <td colSpan='3'>中国交建集团</td>
                                    <td >项目经理</td>
                                    <td >王伟</td>
                                </tr>
                                <tr>
                                    <td style={{ height: 60, align: 'center' }} colSpan='1'>施工员</td>
                                    <td colSpan='1'>{shigong}</td>
                                    <td colSpan='1'>设计面积</td>
                                    <td colSpan='1'>{sjmj}</td>
                                    <td colSpan='1'>实际面积</td>
                                    <td colSpan='1'>{shijmj}</td>
                                </tr>
                                <tr>
                                    <td style={{ height: 60 }} >施工执行标准名称及编号</td>
                                    <td colSpan='5'> 《雄安新区造林工作手册》</td>
                                </tr>
                                <tr>
                                    <td style={{ height: 100 }} colSpan='6' >
                                        验收要点：以细班或小班为单位，对土地整理进行验收。按照不低于5%的设计面积随机布设5m宽样带，对样带的微地形处理、垃圾和碎石处理情况进行打分。
                                        ①微地形按照设计要求精准完成，垃圾碎石清除干净，计90分以上，通过检验；
                                        ②微地形处理或垃圾碎石处理总体较好，但仍有不足，需整改。
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ height: 300 }} colSpan='6'>
                                        <div
                                            id='mapidd'
                                            style={{
                                                height: 300,
                                                borderLeft: '1px solid #ccc'
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan='6'>
                                        <Row>
                                            <Col span={3} style={{ width: 116 }}>
                                                <div style={{ width: 116, marginTop: 20 }}>验收记录
                                                合格(√)
                                        不合格(×)</div>
                                            </Col>
                                            <Col span={21} style={{ width: 630 }}>
                                                {
                                                    rowList
                                                }
                                            </Col>
                                        </Row>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ height: 110 }} >施工单位质量专检结果</td>
                                    <td colSpan='5'>
                                        <div>
                                            <p>项目专业质量检查员：</p>
                                            <p style={{ marginLeft: 300 }}>年</p>
                                            <p style={{ marginLeft: 30 }}>月</p>
                                            <p style={{ marginLeft: 30 }}>日</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ height: 110 }} >监理（建设）单位验收记录</td>
                                    <td colSpan='5'>
                                        <div>
                                            <p>监理工程师：</p><p>{jianli}</p><p>{jianli}</p>
                                            <p style={{ marginLeft: 300 }}>年</p>
                                            <p style={{ marginLeft: 30 }}>月</p>
                                            <p style={{ marginLeft: 30 }}>日</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <p>注：附验收过程照片及说明</p>
                            <p>2、本表解释权归XXXXXXXX。咨询电话：XXXXXXXX</p>
                        </div>
                    </div>
                </Modal>
            </Spin>
        );
    }
}
