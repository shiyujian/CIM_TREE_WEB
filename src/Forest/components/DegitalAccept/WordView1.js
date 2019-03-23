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

import {
    wktToJson
} from '_platform/gisAuth';
/ * turf */
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
            tinclass,
            detail = {}
        } = this.props;
        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        await getCustomViewByUserID({id: user.id});
        await this.initMap();
        this._addAreaLayer(tinclass,sscction);
        detail.Geom && this.area(wktToJson(detail.Geom));
        // this.area(wktToJson('LINESTRING(115.5235717559 39.0255521735,115.5235717356 39.0255521642,115.523571649 39.0255521625,115.5235715253 39.025552063599996,115.5235698582 39.0255519424,115.5235653684 39.0255515815,115.5235603148 39.0255489401,115.52355668349999 39.0255446922,115.52355474960001 39.0255395664,115.5235540898 39.0255350754,115.523554986 39.0255305073,115.5235568982 39.0255263123,115.5235607437 39.0255221696,115.5235661617 39.025519481299995,115.5235720818 39.025518586,115.523578376 39.0255188676,115.5235846506 39.0255205539,115.5235903374 39.0255226876,115.523594797 39.0255258128,115.52359686850001 39.0255305992,115.5235992875 39.0255356618,115.5236016121 39.0255405124,115.5236002651 39.0255456245,115.5235952272 39.0255504422,115.52358830700001 39.0255527734,115.5235799397 39.0255537789,115.52357351500001 39.0255533492,115.52357132920001 39.025552038,115.5235711156 39.0255520993,115.5235709159 39.0255523656,115.52357092689999 39.025552350299996)'));
    }

    componentWillUnmount () {
        this.map = null;
    }

    onOk() {
        this.props.onPressOk(1)
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
    _addAreaLayer = async (eventKey,section) => {
        const {
            areaLayerList
        } = this.state;
        const {
            actions: { getTreearea }
        } = this.props;
        console.log(eventKey)
        try {
            let coords = await handleAreaLayerData(eventKey, getTreearea,section);
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
    area (points) {
        debugger
        let lineLayer = new L.featureGroup().addTo(this.map);
		if (points.length > 1) {
			var latlngs = [];
			var lnglats = [];

			for (var i = 0; i < points.length; i++) {
				latlngs.push([points[i].Y, points[i].X]);
				lnglats.push([points[i].X, points[i].Y]);
			}
			var beginIcon = new L.icon({
				iconUrl: require('./img/start.png'),
				iconSize: [26, 28],
				iconAnchor: [13, 28]
			});
			var endIcon = new L.icon({
				iconUrl: require('./img/end.png'),
				iconSize: [26, 28],
				iconAnchor: [13, 28]
			});
			var start = new L.marker(latlngs[0], {
				icon: beginIcon,
				zIndexOffset: -50
			}).addTo(lineLayer);
			var end = new L.marker(latlngs[latlngs.length - 1], {
				icon: endIcon,
				zIndexOffset: -50
			}).addTo(lineLayer);
			this.map.fitBounds(lineLayer.getBounds());

			var linestring1 = turf.lineString(lnglats, { name: 'line 1' });
			var buffered = turf.buffer(linestring1, 0.005, { units: 'kilometers' });
			L.geoJSON(buffered, {
				style: function (feature) {
					return {
						color: 'red'
					};
				}
			}).addTo(lineLayer);
			// var area = turf.area(buffered.geometry)
			// return area
		}
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
        let sjmj = detail && detail.DesignArea || ''
        let shijmj = detail && detail.ActualArea || ''
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
                                    <td colSpan = '3'>{unit}</td>
                                    <td style={{ width: 118 }}>细班（小班）</td>
                                    <td>{`${array[2]}(${array[3]})`}</td>
                                </tr>
                                <tr>
                                    <td style={{ height: 60, align: 'center' }} >施工单位</td>
                                    <td colSpan = '3'>中国交建集团</td>
                                    <td >项目经理</td>
                                    <td >王伟</td>
                                </tr>
                                <tr>
                                    <td style={{ height: 60, align: 'center' }} colSpan = '1'>施工员</td>
                                    <td colSpan = '1'>{shigong}</td>
                                    <td colSpan = '1'>设计面积</td>
                                    <td colSpan = '1'>{sjmj}</td>
                                    <td colSpan = '1'>实际面积</td>
                                    <td colSpan = '1'>{shijmj}</td>
                                </tr>
                                <tr>
                                    <td style={{ height: 60 }} >施工执行标准名称及编号</td>
                                    <td colSpan = '5'> 《雄安新区造林工作手册》</td>
                                </tr>
                                <tr>
                                    <td style={{ height: 100}} colSpan = '6' >
                                        验收要点：以细班或小班为单位，对土地整理进行验收。按照不低于5%的设计面积随机布设5m宽样带，对样带的微地形处理、垃圾和碎石处理情况进行打分。
                                        ①微地形按照设计要求精准完成，垃圾碎石清除干净，计90分以上，通过检验；
                                        ②微地形处理或垃圾碎石处理总体较好，但仍有不足，需整改。
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
                                    <td style={{ width: 118, height: 60 }} colSpan = '1'>样带面积</td>
                                    <td colSpan = '2'>{detail.SampleTapeArea}</td>
                                    <td style={{ width: 118 }}>得分</td>
                                    <td colSpan = '2'>{detail.Score}</td>
                                </tr>
                                <tr>
                                    <td style={{ height: 110 }} >施工单位质量专检结果</td>
                                    <td colSpan = '5'>
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
                                    <td colSpan = '5'>
                                        <div>
                                            <p>监理工程师：</p><p>{jianli}</p>
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
