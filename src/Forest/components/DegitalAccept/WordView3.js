import React, { Component } from 'react';
import { Spin, Modal, Row, Col } from 'antd';
import './index.less'
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

export default class WordView1 extends Component {
    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            areaLayerList: [], // 
        };
        this.map = null;
    }

    // 初始化地图，获取目录树数据
    componentDidMount = async () => {
        const {
            actions: {
                getCustomViewByUserID
            },
            sscction,
            tinclass
        } = this.props;
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        await getCustomViewByUserID({id: user.id});
        await this.initMap();
        this._addAreaLayer(tinclass,sscction);
    }

    componentWillUnmount () {
        this.map = null;
    }

    /* 初始化地图 */
    initMap () {
        const {
            customViewByUserID = []
        } = this.props;
        try {
            let mapInitialization = INITLEAFLET_API;
            // 根据用户的自定义视图来查看聚焦点
            if (customViewByUserID && customViewByUserID instanceof Array && customViewByUserID.length > 0) {
                let view = customViewByUserID[0];
                let center = [view.center[0].lat, view.center[0].lng];
                let zoom = view.zoom;
                mapInitialization.center = center;
                mapInitialization.zoom = zoom;
            };
            this.map = L.map('mapidd', mapInitialization);
            this.tileLayer = L.tileLayer(TILEURLS[1], {
                subdomains: [1, 2, 3],
                minZoom: 1,
                maxZoom: 17,
                storagetype: 0
            }).addTo(this.map);
            // 地图上边的地点的名称
            L.tileLayer(WMSTILELAYERURL, {
                subdomains: [1, 2, 3],
                minZoom: 1,
                maxZoom: 17,
                storagetype: 0
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
    _addAreaLayer = async (eventKey) => {
        const {
            areaLayerList
        } = this.state;
        const {
            actions: { getTreearea }
        } = this.props;
        console.log(eventKey)
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

    onOk() {
        this.props.onPressOk(3)
    }

    render() {
        const { detail } = this.props;
        let array = ['', '', '', '']
        if (detail && detail.ThinClass) {
            array = detail.ThinClass.split('-');
        }
        let unit = detail && detail.AcceptanceObj && detail.AcceptanceObj.Land || ''
        let jianli = detail && detail.AcceptanceObj && detail.AcceptanceObj.SupervisorObj.Full_Name || ''
        let shigong = detail && detail.AcceptanceObj && detail.AcceptanceObj.ApplierObj.Full_Name || ''
        return (
            <Spin spinning={this.state.loading}>
                <Modal
                    width={800}
                    visible={this.props.visible}
                    title='挖穴质量验收记录'
                    onOk={this.onOk.bind(this)}
                    maskClosable={false}
                    onCancel={this.onOk.bind(this)}
                    footer={null}
                >
                    <div className='trrdd'>

                        <table style={{ border: 1 }}>
                            <tbody>
                                <tr>
                                    <td height="60;" colSpan="1" width="118px">单位工程名称</td>
                                    <td colSpan="3"> {unit}</td>
                                    <td colSpan="1" width="118px">细班（小班）</td>
                                    <td colSpan="1">{`${array[2]}(${array[3]})`}</td>
                                </tr>
                                <tr>
                                    <td height="60;" align="center">施工单位</td>
                                    <td colSpan="3">中国交建集团</td>
                                    <td >项目经理</td>
                                    <td >王伟</td>
                                </tr>
                                <tr>
                                    <td height="60;" align="center">施工员</td>
                                    <td colSpan="1">{shigong}</td>
                                    <td>设计面积</td>
                                    <td colSpan="1">100</td>
                                    <td>实际面积</td>
                                    <td >95</td>
                                </tr>
                                <tr>
                                    <td className='hei60' >施工执行标准名称及编号</td>
                                    <td colSpan="5"> 《雄安新区造林工作手册》</td>
                                </tr>
                                <tr>
                                    <td colSpan="6" height="200">
                                    验收要点：以细班或小班为单位，对挖穴进行验收。按照不低于设计数量的5%进行抽检，对挖穴直径和深度进行打分。挖穴直径比土球直径大于40厘米，底部平整，深比土球高10～20厘米。
                                    ①挖穴规格不小于上述要求即为合格，合格率达到90%以上，计90分以上，通过检验；
                                    ②挖穴直径未超过土球直径40厘米，或过于随意，大小不均，即不合格，须整改。
                                    挖穴合格率=抽检合格数量/抽检数量。

			                        </td>
                                </tr>
                                <tr>
                                <td style={{ height: 300 }} colSpan = '6'>
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
                                    <td height="60;" colSpan="1" width="118px">样带面积</td>
                                    <td colSpan="3">100</td>
                                    <td colSpan="1" width="118px">合格率</td>
                                    <td colSpan="1">95%</td>
                                </tr>
                                <tr>
                                    <td className='hei110' >施工单位质量专检结果</td>
                                    <td colSpan="5">
                                        <div>
                                            <p>项目专业质量检查员：</p>
                                            <p className='marL300'>年</p>
                                            <p className='marL30'>月</p>
                                            <p className='marL30'>日</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='hei110' >监理（建设）单位验收记录</td>
                                    <td colSpan="5">
                                        <div>
                                            <p>监理工程师：</p><p>{jianli}</p>
                                            <p className='marL300'>年</p>
                                            <p className='marL30'>月</p>
                                            <p className='marL30'>日</p>
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
