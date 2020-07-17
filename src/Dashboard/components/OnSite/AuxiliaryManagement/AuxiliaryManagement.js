import React, { Component } from 'react';
import L from 'leaflet';
import _ from 'underscore';
import {
    Row,
    Col,
    Checkbox,
    Spin,
    message
} from 'antd';
import Scrollbar from 'smooth-scrollbar';
import {
    FOREST_GIS_API
} from '_platform/api';
import {
    getSmallThinNameByThinClassData
} from '_platform/gisAuth';
import './AuxiliaryManagement.less';
import decoration from './AuxiliaryManagementImg/decoration.png';
import hide from './AuxiliaryManagementImg/hide2.png';
import display from './AuxiliaryManagementImg/display2.png';

export default class AuxiliaryManagement extends Component {
    constructor (props) {
        super(props);
        this.state = {
            treeTypeRealDesignList: [],
            treeTypeList: [],
            realThinClassLayerList: {},
            auxiliaryManagementLoading: false,
            menuIsExtend: true /* 菜单是否展开 */,
            menuWidth: 560 /* 菜单宽度 */
        };
    }
    // 灌溉管线类型
    treePipeTypeOptions = [

    ]

    componentDidMount = async () => {
        const {
            actions: {
                getTreeTypeAction
            },
            areaEventKey
        } = this.props;
        try {
            let treeTypeList = await getTreeTypeAction();
            let data = Scrollbar.init(document.querySelector('#asideDom'));
            let resultdata = Scrollbar.init(document.querySelector('#resultAsideDom'));
            console.log('data', data);
            console.log('resultdata', resultdata);
            this.setState({
                treeTypeList
            }, () => {
                if (areaEventKey) {
                    this.handleGetAuxiliaryManagementLayer();
                }
            });
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }
    componentWillUnmount = async () => {
        try {
            this.handleRemoveRealThinClassLayer();
        } catch (e) {
            console.log('componentWillUnmount', e);
        }
    }
    componentDidUpdate = async (prevProps, prevState) => {
        const {
            dashboardCompomentMenu,
            areaEventKey
        } = this.props;

        if (areaEventKey && areaEventKey !== prevProps.areaEventKey) {
            if (dashboardCompomentMenu === 'geojsonFeature_auxiliaryManagement') {
                this.handleGetAuxiliaryManagementLayer();
            }
        }
    }
    handleGetAuxiliaryManagementLayer = () => {
        const {
            areaEventKey,
            map
        } = this.props;
        const {
            realThinClassLayerList
        } = this.state;
        try {
            // 细班的key加入了标段，首先对key进行处理
            let handleKey = areaEventKey.split('-');
            // 如果选中的是细班，则直接添加图层
            if (handleKey.length === 5) {
                let selectNo = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[3] + '-' + handleKey[4];
                let selectSectionNo = handleKey[0] + '-' + handleKey[1] + '-' + handleKey[2];
                this.handleGetTreeTypeNum(selectNo, selectSectionNo);
                this.handleRemoveRealThinClassLayer();

                if (realThinClassLayerList[areaEventKey]) {
                    realThinClassLayerList[areaEventKey].addTo(map);
                } else {
                    var url = FOREST_GIS_API +
                        `/geoserver/xatree/wms?cql_filter=No+LIKE+%27%25${selectNo}%25%27%20and%20Section+LIKE+%27%25${selectSectionNo}%25%27`;
                    let thinClassLayer = L.tileLayer.wms(url,
                        {
                            layers: 'xatree:treelocation',
                            crs: L.CRS.EPSG4326,
                            format: 'image/png',
                            maxZoom: 22,
                            transparent: true
                        }
                    ).addTo(map);
                    realThinClassLayerList[areaEventKey] = thinClassLayer;
                    this.setState({
                        realThinClassLayerList
                    });
                }
            }
        } catch (e) {
            console.log('handleGetAuxiliaryManagementLayer', e);
        }
    }
    handleGetTreeTypeNum = async (selectNo, selectSectionNo) => {
        const {
            actions: {
                getStatByTreeType,
                getStatTreePlans,
                getTreeTypeAction
            }
        } = this.props;
        let {
            treeTypeList = []
        } = this.state;
        try {
            this.setState({
                auxiliaryManagementLoading: true
            });
            let realStatPostData = {
                no: selectNo,
                section: selectSectionNo
            };
            let planStatPostData = {
                thinclass: selectNo,
                section: selectSectionNo
            };
            if (!(treeTypeList && treeTypeList instanceof Array && treeTypeList.length > 0)) {
                treeTypeList = await getTreeTypeAction();
            }
            let treeTypeRealDesignList = [];
            let realStatData = await getStatByTreeType({}, realStatPostData);
            let planStatData = await getStatTreePlans({}, planStatPostData);
            let uniqueTreeTypeIDList = [];
            realStatData.map((realData) => {
                if (realData && realData.TreeTypeNo) {
                    let typeID = '';
                    let typeName = '';
                    treeTypeList.map((treeType) => {
                        if (Number(treeType.TreeTypeNo) === Number(realData.TreeTypeNo)) {
                            typeID = Number(treeType.ID);
                            typeName = treeType.TreeTypeName;
                        }
                    });
                    if (uniqueTreeTypeIDList.indexOf(typeID) === -1) {
                        uniqueTreeTypeIDList.push(typeID);
                        let designData = planStatData.find((design) => Number(design.TreeType) === Number(typeID));
                        if (designData && designData.No) {
                            treeTypeRealDesignList.push({
                                realNum: Math.abs(realData.Num),
                                planNum: Math.abs(designData.Num),
                                treeTypeID: typeID,
                                treeTypeName: typeName
                            });
                        } else {
                            treeTypeRealDesignList.push({
                                realNum: Math.abs(realData.Num),
                                planNum: 0,
                                treeTypeID: typeID,
                                treeTypeName: typeName
                            });
                        }
                    }
                }
            });
            planStatData.map((planData) => {
                if (planData && planData.TreeType) {
                    let typeID = '';
                    let typeName = '';
                    treeTypeList.map((treeType) => {
                        if (Number(treeType.ID) === Number(planData.TreeType)) {
                            typeID = Number(treeType.ID);
                            typeName = treeType.TreeTypeName;
                        }
                    });
                    if (uniqueTreeTypeIDList.indexOf(typeID) === -1) {
                        treeTypeRealDesignList.push({
                            realNum: 0,
                            planNum: Math.abs(planData.Num),
                            treeTypeID: typeID,
                            treeTypeName: typeName
                        });
                    }
                }
            });

            this.setState({
                treeTypeList,
                treeTypeRealDesignList,
                auxiliaryManagementLoading: false
            });
        } catch (e) {
            console.log('handleGetTreeTypeNum', e);
        }
    }
    // 去除细班实际区域的图层
    handleRemoveRealThinClassLayer = () => {
        const {
            map
        } = this.props;
        const {
            realThinClassLayerList
        } = this.state;
        for (let i in realThinClassLayerList) {
            map.removeLayer(realThinClassLayerList[i]);
        }
    }
    /* 菜单展开收起 */
    _extendAndFold = () => {
        this.setState({ menuIsExtend: !this.state.menuIsExtend });
    }

    render () {
        const {
            areaEventKey,
            platform: {
                tree = {}
            }
        } = this.props;
        const {
            auxiliaryManagementLoading,
            menuIsExtend,
            menuWidth,
            treeTypeRealDesignList
        } = this.state;
        let thinClassTree = tree.thinClassTree || tree.onSiteThinClassTree || [];
        let name = getSmallThinNameByThinClassData(areaEventKey, thinClassTree);
        return (
            <div>
                <div>
                    <div className='AuxiliaryManagement-container'>
                        <div className='AuxiliaryManagement-r-main'>
                            {
                                menuIsExtend ? '' : (
                                    <img src={display}
                                        className='AuxiliaryManagement-foldBtn'
                                        onClick={this._extendAndFold.bind(this)} />
                                )
                            }
                            <div
                                className={`AuxiliaryManagement-menuPanel`}
                                style={
                                    menuIsExtend
                                        ? {
                                            width: menuWidth,
                                            transform: 'translateX(0)'
                                        }
                                        : {
                                            width: menuWidth,
                                            transform: `translateX(-${
                                                menuWidth
                                            }px)`
                                        }
                                }
                            >

                                <div className='AuxiliaryManagement-menuBackground' />
                                <aside className='AuxiliaryManagement-aside' id='asideDom'>
                                    <Spin spinning={auxiliaryManagementLoading}>
                                        <div className='AuxiliaryManagement-MenuNameLayout'>
                                            <img src={decoration} />
                                            <span className='AuxiliaryManagement-MenuName'>{name || '辅助管理'}</span>
                                            <img src={hide}
                                                onClick={this._extendAndFold.bind(this)}
                                                className='AuxiliaryManagement-MenuHideButton' />
                                            <span className='AuxiliaryManagement-NumTitle'>实际栽种量 / 设计量</span>
                                        </div>
                                        <div className='AuxiliaryManagement-asideTree'>
                                            <div>
                                                <div className='AuxiliaryManagement-button'>
                                                    {
                                                        treeTypeRealDesignList.map((option) => {
                                                            return (<a key={option.treeTypeID}
                                                                title={option.treeTypeName}
                                                                className={'AuxiliaryManagement-button-layoutSel'}
                                                                style={{
                                                                    marginRight: 8,
                                                                    marginTop: 8
                                                                }}
                                                            >
                                                                <span className='AuxiliaryManagement-button-layout-text'>{option.treeTypeName}</span>
                                                                <div className={'AuxiliaryManagement-button-layout-numSel'}>
                                                                    <span className={'AuxiliaryManagement-button-layout-actualNum'}>
                                                                        {option.realNum}
                                                                    </span>
                                                                    <span className={'AuxiliaryManagement-button-layout-numDivide'}>
                                                                    /
                                                                    </span>
                                                                    <span className={'AuxiliaryManagement-button-layout-designNum'}>
                                                                        {option.planNum}
                                                                    </span>
                                                                </div>
                                                            </a>);
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </Spin>
                                </aside>
                            </div>
                        </div>
                    </div>
                    {/* <div className='AuxiliaryManagement-result-Container'>
                        <div className='AuxiliaryManagement-result-r-main'>
                            <div
                                className={`AuxiliaryManagement-result-menuPanel`}
                                style={
                                    menuIsExtend
                                        ? {
                                            width: 280,
                                            transform: 'translateX(0)'
                                        }
                                        : {
                                            width: 280,
                                            transform: `translateX(-${
                                                menuWidth + 288
                                            }px)`
                                        }
                                }
                            >
                                <div className='AuxiliaryManagement-result-menuBackground' />
                                <aside className='AuxiliaryManagement-result-aside' id='resultAsideDom'>
                                    <Spin spinning={auxiliaryManagementLoading}>
                                        <div className='AuxiliaryManagement-result-MenuNameLayout'>
                                            <img src={decoration} />
                                            <span className='AuxiliaryManagement-result-MenuName'>
                                                面积
                                            </span>
                                        </div>
                                        <div className='AuxiliaryManagement-result-asideTree'>
                                            <div>
                                                {
                                                    materialResults.map((result) => {
                                                        return (
                                                            <div key={result.ID} className='AuxiliaryManagement-result-resultlayout'>
                                                                <div className='AuxiliaryManagement-result-resultBackground' />
                                                                <span className='AuxiliaryManagement-result-type'>
                                                                    {result.Name}
                                                                </span>
                                                                <span className='AuxiliaryManagement-result-num'>
                                                                    {result.children.length}
                                                                </span>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </Spin>
                                </aside>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>

        );
    }
}
