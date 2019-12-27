import React, { Component } from 'react';
import { Spin, Modal, Row, Col, Tabs } from 'antd';
import L from 'leaflet';
import './index.less';
import {
    WMSTILELAYERURL,
    TILEURLS,
    INITLEAFLET_API
} from '_platform/api';
import {
    fillAreaColor,
    handleAreaLayerData,
    handleCoordinates,
    wktToJson
} from './auth';
import { lineString, buffer } from '@turf/turf';
import moment from 'moment';
const { TabPane } = Tabs;
export default class WordView1 extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            leader: '',
            unitName: '',
            detail: '',
            tabKey: 0
        };
        this.map = null;
    }

    // 初始化地图，获取目录树数据
    componentDidMount = async () => {
        const {
            itemDetailList = []
        } = this.props;
        if (itemDetailList.length > 0) {
            let detail = itemDetailList[0];
            await this.initMap(detail);
            console.log('detail', detail);
            await this.getRouteLayer(detail);
            await this.getUnitMessage(detail);
            this.setState({
                detail
            });
        }
    }
    /* 初始化地图 */
    initMap = async (detail) => {
        try {
            if (this.map) {
                await this.map.off();
                await this.map.remove();
            }
            let mapInitialization = INITLEAFLET_API;
            mapInitialization.crs = L.CRS.EPSG4326;
            mapInitialization.attributionControl = false;
            this.map = L.map(`${detail.ID}`, mapInitialization);

            this.tileLayer = L.tileLayer(TILEURLS[1], {
                // subdomains: [3],
                subdomains: [0, 1, 2, 3, 4, 5, 6, 7], // 天地图有7个服务节点，代码中不固定使用哪个节点的服务，而是随机决定从哪个节点请求服务，避免指定节点因故障等原因停止服务的风险
                minZoom: 10,
                maxZoom: 17,
                zoomOffset: 1
            }).addTo(this.map);
            // 地图上边的地点的名称
            L.tileLayer(WMSTILELAYERURL, {
                // subdomains: [3],
                subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
                minZoom: 10,
                maxZoom: 17,
                zoomOffset: 1
            }).addTo(this.map);
        } catch (e) {
            console.log('initMap', e);
        }
    }
    getRouteLayer = async (detail) => {
        console.log('detail', detail);
        if (detail && detail.Section && detail.ThinClass) {
            await this._addAreaLayer(detail.ThinClass, detail.Section);
        }
        detail.Geom && await this.area(wktToJson(detail.Geom));
    }
    // 选中细班，则在地图上加载细班图层
    _addAreaLayer = async (eventKey, section) => {
        const {
            actions: { getTreearea }
        } = this.props;
        try {
            let coordsList = await handleAreaLayerData(eventKey, getTreearea, section);
            if (coordsList && coordsList instanceof Array && coordsList.length > 0) {
                for (let t = 0; t < coordsList.length; t++) {
                    let coords = coordsList[t];
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
                }
            }
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
        this.props.onPressOk(3);
    }
    area (points) {
        if (points && points instanceof Array && points.length > 1) {
            console.log('aaaaaaaa');
            let latlngs = [];
            let lnglats = [];
            for (let i = 0; i < points.length; i++) {
                latlngs.push([points[i].Y, points[i].X]);
                lnglats.push([points[i].X, points[i].Y]);
            }
            let beginIcon = L.icon({
                iconUrl: require('./img/start.png'),
                iconSize: [26, 28],
                iconAnchor: [13, 28]
            });
            let endIcon = L.icon({
                iconUrl: require('./img/end.png'),
                iconSize: [26, 28],
                iconAnchor: [13, 28]
            });
            console.log('beginIcon', beginIcon);
            L.marker(latlngs[0], {
                icon: beginIcon,
                zIndexOffset: -50
            }).addTo(this.map);
            L.marker(latlngs[latlngs.length - 1], {
                icon: endIcon,
                zIndexOffset: -50
            }).addTo(this.map);

            let linestring1 = lineString(lnglats, { name: 'line 1' });
            console.log('linestring1', linestring1);
            let buffered = buffer(linestring1, 0.005, { units: 'kilometers' });
            L.geoJSON(buffered, {
                style: function (feature) {
                    return {
                        color: 'red'
                    };
                }
            }).addTo(this.map);
            this.map.panTo(latlngs[0]);
        }
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
    handleDetailData = (detail) => {
        let handleDetail = {};
        handleDetail.unit = (detail && detail.AcceptanceObj && detail.AcceptanceObj.Land) || '';
        handleDetail.jianli = (detail && detail.AcceptanceObj && detail.AcceptanceObj.SupervisorObj && detail.AcceptanceObj.SupervisorObj.Full_Name) || '';
        handleDetail.shigong = (detail && detail.AcceptanceObj && detail.AcceptanceObj.ConstructerObj && detail.AcceptanceObj.ConstructerObj.Full_Name) || '';
        handleDetail.checker = (detail && detail.AcceptanceObj && detail.AcceptanceObj.ApplierObj && detail.AcceptanceObj.ApplierObj.Full_Name) || '';
        handleDetail.designArea = (detail && detail.DesignArea && (detail.DesignArea * 0.0015).toFixed(2)) || '';
        handleDetail.actualArea = (detail && detail.ActualArea && (detail.ActualArea * 0.0015).toFixed(2)) || '';
        handleDetail.sampleTapeArea = (detail && detail.SampleTapeArea && (detail.SampleTapeArea * 0.0015).toFixed(2)) || '';
        handleDetail.applyTime = (detail && detail.AcceptanceObj && detail.AcceptanceObj.ApplyTime && moment(detail.AcceptanceObj.ApplyTime).format('YYYY年MM月DD日')) || '';
        handleDetail.createTime = (detail && detail.CreateTime && moment(detail.CreateTime).format('YYYY年MM月DD日')) || ''; handleDetail.designNum = (detail && detail.DesignNum) || 0;
        handleDetail.actualNum = (detail && detail.ActualNum) || 0;
        handleDetail.loftingNum = (detail && detail.LoftingNum) || 0;
        handleDetail.score = (detail && detail.Score && (detail.Score).toFixed(2)) || 0;
        handleDetail.checkNum = (detail && detail.CheckNum) || 0;
        handleDetail.failedNum = (detail && detail.FailedNum) || 0;
        handleDetail.treetypename = (detail && detail.TreeTypeObj && detail.TreeTypeObj.TreeTypeName) || '';
        let hgl = handleDetail.checkNum - handleDetail.failedNum; // 合格量
        handleDetail.hgl = hgl;
        let hege = detail.DigHoleQualifiedNum;
        let buhege = detail.DigHoleUnQualifiedNum;
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
        handleDetail.rowList = rowList;
        return handleDetail;
    }
    tabChange = async (key) => {
        const {
            itemDetailList = []
        } = this.props;
        let detail = itemDetailList[key];
        // if (!this.map) {
        await this.initMap(detail);
        // }
        await this.getRouteLayer(detail);

        this.setState({
            detail
        });
    }
    render () {
        const {
            itemDetailList = []
        } = this.props;
        const {
            leader,
            unitName,
            loading,
            detail
        } = this.state;
        console.log('detail', detail);
        let array = ['', '', '', ''];
        if (detail && detail.ThinClass) {
            array = detail.ThinClass.split('-');
        }
        let handleDetail = this.handleDetailData(detail);
        console.log('handleDetail', handleDetail);
        return (
            <Spin spinning={loading}>
                <Modal
                    width={800}
                    visible={this.props.visible}
                    title='挖穴质量验收记录'
                    onOk={this.onOk.bind(this)}
                    maskClosable={false}
                    onCancel={this.onOk.bind(this)}
                    footer={null}
                >
                    <Tabs defaultActiveKey='0' onChange={this.tabChange.bind(this)}>
                        {
                            itemDetailList.map((item, index) => {
                                return (
                                    <TabPane
                                        tab={(item && item.TreeTypeObj && item.TreeTypeObj.TreeTypeName) || '树种'}
                                        key={index}>
                                        <div className='trrdd'>
                                            <table style={{ border: 1 }}>
                                                <tbody>
                                                    <tr>
                                                        <td height='60;' colSpan='1' width='118px'>单位工程名称</td>
                                                        <td colSpan='3'> {handleDetail.unit}</td>
                                                        <td colSpan='1' width='118px'>细班（小班）</td>
                                                        <td colSpan='1'>{`${array[2]}小班${array[3]}细班`}</td>
                                                    </tr>
                                                    <tr>
                                                        <td height='60;' align='center'>施工单位</td>
                                                        <td colSpan='3'>{unitName}</td>
                                                        <td >项目经理</td>
                                                        <td >{leader}</td>
                                                    </tr>
                                                    <tr>
                                                        <td height='60;' align='center'>施工员</td>
                                                        <td colSpan='1'>{handleDetail.shigong}</td>
                                                        <td>苗木品种及规格</td>
                                                        <td colSpan='1'>{handleDetail.treetypename}</td>
                                                        <td>土球规格</td>
                                                        <td > / </td>
                                                    </tr>
                                                    <tr>
                                                        <td className='hei60' >施工执行标准名称及编号</td>
                                                        <td colSpan='5'> 《雄安新区造林工作手册》</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan='6' style={{height: 200}}>
                                                            <div style={{textAlign: 'left'}}>
                                                                <span style={{display: 'block'}}>验收要点：以细班或小班为单位，对挖穴进行验收。按照不低于设计数量的5%进行抽检，对挖穴直径和深度进行打分。挖穴直径比土球直径大于40厘米，底部平整，深比土球高10～20厘米。</span>
                                                                <span style={{display: 'block'}}>①挖穴规格不小于上述要求即为合格，合格率达到90%以上，计90分以上，通过检验；</span>
                                                                <span style={{display: 'block'}}>②挖穴直径未超过土球直径40厘米，或过于随意，大小不均，即不合格，须整改。</span>
                                                                <span style={{display: 'block'}}>挖穴合格率=抽检合格数量/抽检数量。</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ height: 300 }} colSpan='6'>
                                                            <div
                                                                id={item.ID}
                                                                // id='mapID'
                                                                style={{
                                                                    height: 300,
                                                                    borderLeft: '1px solid #ccc'
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td height='60;'width='118px'>挖穴标准</td>
                                                        <td colSpan='1'> / </td>
                                                        <td height='60;'width='118px'>设计数量</td>
                                                        <td colSpan='1'>{`${handleDetail.designNum} (个)`}</td>
                                                        <td colSpan='1' width='118px'>实际数量</td>
                                                        <td colSpan='1'>{`${handleDetail.actualNum} (个)`}</td>
                                                    </tr>
                                                    <tr>
                                                        <td height='60;'width='118px'>抽检数量</td>
                                                        <td colSpan='1'>{`${handleDetail.checkNum} (个)`}</td>
                                                        <td height='60;'width='118px'>抽检合格数量</td>
                                                        <td colSpan='1'>{`${handleDetail.hgl} (个)`}</td>
                                                        <td colSpan='1' width='118px'>合格率</td>
                                                        <td colSpan='1'>{`${handleDetail.score}%`}</td>
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
                                                                        handleDetail.rowList
                                                                    }
                                                                </Col>
                                                            </Row>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className='hei110' >施工单位质量专检结果</td>
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
                                                        <td className='hei110' >监理（建设）单位验收记录</td>
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
                                                <p>注：1.挖穴验收记录可另附表。2.附验收过程照片及说明。 </p>
                                            </div>
                                        </div>
                                    </TabPane>
                                );
                            })
                        }
                    </Tabs>
                </Modal>
            </Spin>
        );
    }
}
