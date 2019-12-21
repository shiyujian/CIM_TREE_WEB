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
    genPopUpContent
} from '../../auth';
import {
    FOREST_GIS_API
} from '_platform/api';
import './TreePipePage.less';
import decoration from './TreePipeImg/decoration.png';
import hide from './TreePipeImg/hide2.png';
import display from './TreePipeImg/display2.png';
import defaultCard from './TreePipeImg/1default.png';

export default class TreePipePage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            treePipeLoading: false,
            // 管网查询图层类型
            treePipeLayerTypePipe: false,
            treePipeLayerTypePipeNode: false,
            // 管网设备类型
            quickWater: false,
            threePass: false,
            fourPass: false,
            valveWell: false,
            waterWell: false,
            drainageWell: false,
            // 管网管径范围
            treePipeRataSixty: false,
            treePipeRataHundred: false,
            treePipeRataHundredFifty: false,

            treePipeNode: false, // 查询管点
            treePipe: true, // 查询管网
            treePipeCaliberData: '', // 管径的Sql语句
            treePipeMaterialData: '', // 管线材质的Sql语句
            treePipeNodeTypeData: '', // 管点设备类型的Sql语句
            contents: [], // 搜索的数据
            treePipeGisQuery: true, // 是否点击查看
            treePipePopLayer: '',
            menuIsExtend: true /* 菜单是否展开 */,
            menuWidth: 560 /* 菜单宽度 */
        };
        this.tileLayerTreeFilter = null;
        this.tileTreePipeBasic = null;
        this.tileLayerTreeThinClass = null;
        this.tileTreePipeNodeBasic = null;
    }
    // 管线材质
    treePipeMaterialOptions = [
        {
            id: 'treePipeMaterialPVC',
            label: 'PVC'
        },
        {
            id: 'treePipeMaterialPVC-U',
            label: 'PVC-u'
        }
    ]
    // 灌溉管线管径范围
    treePipeRateOptions = [
        {
            id: 'treePipeRataFifty',
            label: '0~50'
        },
        {
            id: 'treePipeRataHundred',
            label: '50~100'
        },
        {
            id: 'treePipeRataHundredFifty',
            label: '100~150'
        }
    ]
    // 灌溉管点设备类型
    treePipeNodeTypeOptions = [
        {
            id: 'quickWater',
            label: '快速取水器'
        },
        {
            id: 'threePass',
            label: '三通'
        },
        {
            id: 'fourPass',
            label: '四通'
        },
        {
            id: 'valveWell',
            label: '阀水井'
        },
        {
            id: 'waterWell',
            label: '水井'
        },
        {
            id: 'drainageWell',
            label: '泄水井'
        }
    ]

    componentDidMount = async () => {
        const {
            map
        } = this.props;
        try {
            map.on('click', this.handleTreePipeMapClickFunction);
            await this.getTileLayerTreeFilter();
            await this.getTileLayerTreeThinClass();
            await this.getTreePipeLayer();
            await this.getTreePipeNodeLayer();
            let data = Scrollbar.init(document.querySelector('#asideDom'));
            let resultdata = Scrollbar.init(document.querySelector('#resultAsideDom'));
            console.log('data', data);
            console.log('resultdata', resultdata);
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }
    componentWillUnmount = async () => {
        const {
            map
        } = this.props;
        const {
            treePipePopLayer
        } = this.state;
        try {
            map.off('click', this.handleTreePipeMapClickFunction);

            if (this.tileTreePipeBasic) {
                await map.removeLayer(this.tileTreePipeBasic);
                this.tileTreePipeBasic = null;
            }
            if (this.tileLayerTreeFilter) {
                await map.removeLayer(this.tileLayerTreeFilter);
                this.tileLayerTreeFilter = null;
            }
            if (this.tileLayerTreeThinClass) {
                await map.removeLayer(this.tileLayerTreeThinClass);
                this.tileLayerTreeThinClass = null;
            }
            if (this.tileTreePipeNodeBasic) {
                await map.removeLayer(this.tileTreePipeNodeBasic);
                this.tileTreePipeNodeBasic = null;
            }
            if (treePipePopLayer) {
                await map.removeLayer(treePipePopLayer);
            }
        } catch (e) {
            console.log('componentWillUnmount', e);
        }
    }
    handleTreePipeMapClickFunction = (e) => {
        try {
            const {
                dashboardCompomentMenu
            } = this.props;
            const {
                treePipeGisQuery
            } = this.state;
            if (dashboardCompomentMenu === 'geojsonFeature_treePipe' && treePipeGisQuery && e) {
                this.handleQueryPipeByWkt([e.latlng.lat, e.latlng.lng]);
            }
        } catch (e) {
            console.log('initMap', e);
        }
    }
    // 灌溉管网下的树木图层
    getTileLayerTreeFilter = async => {
        const {
            map
        } = this.props;
        try {
            this.tileLayerTreeFilter = L.tileLayer(
                FOREST_GIS_API +
                '/geoserver/gwc/service/wmts?layer=xatree%3Aland&style=&tilematrixset=My_EPSG%3A43261&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                {
                    opacity: 1.0,
                    subdomains: [1, 2, 3],
                    minZoom: 10,
                    maxZoom: 21,
                    storagetype: 0,
                    tiletype: 'wtms'
                }
            ).addTo(map);
        } catch (e) {
            console.log('getTileLayerTreeFilter', e);
        }
    }
    // 灌溉管网下的细班图层
    getTileLayerTreeThinClass = async => {
        const {
            map
        } = this.props;
        try {
            this.tileLayerTreeThinClass = L.tileLayer(
                FOREST_GIS_API +
                '/geoserver/gwc/service/wmts?layer=xatree%3Athinclass&style=&tilematrixset=My_EPSG%3A43261&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                {
                    opacity: 1.0,
                    subdomains: [1, 2, 3],
                    minZoom: 10,
                    maxZoom: 21,
                    storagetype: 0,
                    tiletype: 'wtms'
                }
            ).addTo(map);
        } catch (e) {
            console.log('getTileLayerTreeThinClass', e);
        }
    }
    // 加载灌溉管网图层
    getTreePipeLayer = async () => {
        const {
            map
        } = this.props;
        try {
            this.tileTreePipeBasic = L.tileLayer(
                FOREST_GIS_API +
                '/geoserver/gwc/service/wmts?layer=xatree%3Apipe&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                {
                    opacity: 1.0,
                    subdomains: [1, 2, 3],
                    minZoom: 10,
                    maxZoom: 21,
                    storagetype: 0,
                    tiletype: 'wtms'
                }
            ).addTo(map);
        } catch (e) {
            console.log('getTreePipeLayer', e);
        }
    }
    // 加载灌溉管网图层
    getTreePipeNodeLayer = async () => {
        const {
            map
        } = this.props;
        try {
            this.tileTreePipeNodeBasic = L.tileLayer(
                FOREST_GIS_API +
                '/geoserver/gwc/service/wmts?layer=xatree%3Apipenode&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                {
                    opacity: 1.0,
                    subdomains: [1, 2, 3],
                    minZoom: 10,
                    maxZoom: 21,
                    storagetype: 0,
                    tiletype: 'wtms'
                }
            ).addTo(map);
        } catch (e) {
            console.log('getTreePipeNodeLayer', e);
        }
    }
    // 对查询到的数据按材质分类
    handleMaterialResult = (contents) => {
        let materialResults = [];
        if (contents && contents instanceof Array && contents.length > 0) {
            for (let i = 0; i < contents.length; i++) {
                let content = contents[i];
                if (content && content.ID && content.Material) {
                    this.treePipeMaterialOptions.map((option) => {
                        if (option.label === content.Material) {
                            let exist = false;
                            let childData = [];
                            // 查看TreeData里有无这个类型的数据，有的话，push
                            materialResults.map((result) => {
                                if (result.Name === option.label) {
                                    exist = true;
                                    childData = result.children;
                                    childData.push((content));
                                }
                            });
                            // 没有的话，创建
                            if (!exist) {
                                childData.push(content);
                                materialResults.push({
                                    ID: option.ID,
                                    Name: option.label,
                                    children: childData
                                });
                            }
                        }
                    });
                }
            }
        }
        return materialResults;
    }
    // 对查询到的数据按管径分类
    handleCaliberResult = (contents) => {
        let caliberResults = [];
        let DNList = [];
        if (contents && contents instanceof Array && contents.length > 0) {
            for (let i = 0; i < contents.length; i++) {
                let content = contents[i];
                if (content && content.ID && content.DN) {
                    // 不存在  则生成child
                    if (DNList.indexOf(content.DN) === -1) {
                        let childData = [];
                        childData.push(content);
                        caliberResults.push({
                            ID: content.DN,
                            Name: content.DN,
                            children: childData
                        });
                        DNList.push(content.DN);
                    } else {
                        DNList.map((DN) => {
                            if (DN === content.DN) {
                                let childData = [];
                                // 查看TreeData里有无这个类型的数据，有的话，push
                                caliberResults.map((result) => {
                                    if (result.Name === DN) {
                                        childData = result.children;
                                        childData.push((content));
                                    }
                                });
                            }
                        });
                    }
                }
            }
        }
        caliberResults.sort(function (a, b) {
            if (a.Name < b.Name) {
                return -1;
            } else if (a.Name > b.Name) {
                return 1;
            } else {
                return 0;
            }
        });
        return caliberResults;
    }
    // 对查询到的数据按设备类型分类
    handlePipeNodeTypeResult = (contents) => {
        let pipeNodeTypeResults = [];
        if (contents && contents instanceof Array && contents.length > 0) {
            for (let i = 0; i < contents.length; i++) {
                let content = contents[i];
                if (content && content.ID && content.PipeType) {
                    this.treePipeNodeTypeOptions.map((option) => {
                        if (option.label === content.PipeType) {
                            let exist = false;
                            let childData = [];
                            // 查看TreeData里有无这个类型的数据，有的话，push
                            pipeNodeTypeResults.map((result) => {
                                if (result.Name === option.label) {
                                    exist = true;
                                    childData = result.children;
                                    childData.push((content));
                                }
                            });
                            // 没有的话，创建
                            if (!exist) {
                                childData.push(content);
                                pipeNodeTypeResults.push({
                                    ID: option.ID,
                                    Name: option.label,
                                    children: childData
                                });
                            }
                        }
                    });
                }
            }
        }
        return pipeNodeTypeResults;
    }
    /* 菜单展开收起 */
    _extendAndFold = () => {
        this.setState({ menuIsExtend: !this.state.menuIsExtend });
    }
    handleChangePipeType = async (e) => {
        this.setState({
            treePipe: !this.state.treePipe,
            treePipeNode: !this.state.treePipeNode
        }, async () => {
            await this.handleQueryTreePipe();
        });
    }
    handleChangePipeNodeType = async (e) => {
        await this.handleQueryTreePipe();
        this.setState({
            treePipeNode: !this.state.treePipeNode,
            treePipe: !this.state.treePipe
        }, async () => {
            await this.handleQueryTreePipe();
        });
    }
    // 管点类型选中
    pipeNodeTypeChange = async (option) => {
        try {
            this.setState({
                [option.id]: !this.state[option.id]
            }, () => {
                this.handlePipeNodeTypeData();
            });
        } catch (e) {
            console.log('pipeNodeTypeChange', e);
        }
    }
    // 处理管点数据
    handlePipeNodeTypeData = async () => {
        try {
            let treePipeNodeTypeData = '';
            let treePipeNodeTypeDataList = [];
            this.treePipeNodeTypeOptions.map((option) => {
                if (this.state[option.id]) {
                    let orderData = `PipeType = '${option.label}'`;
                    treePipeNodeTypeDataList.push(orderData);
                }
            });
            if (treePipeNodeTypeDataList.length > 1) {
                treePipeNodeTypeDataList.map((child, index) => {
                    if (index === 0) {
                        treePipeNodeTypeData = `( ${child}`;
                    } else if (index === treePipeNodeTypeDataList.length - 1) {
                        treePipeNodeTypeData = `${treePipeNodeTypeData} or ${child} )`;
                    } else {
                        treePipeNodeTypeData = `${treePipeNodeTypeData} or ${child}`;
                    }
                });
            } else if (treePipeNodeTypeDataList.length === 1) {
                treePipeNodeTypeData = treePipeNodeTypeDataList[0];
            }
            this.setState({
                treePipeNodeTypeData
            }, () => {
                this.handleQueryTreePipe();
            });
        } catch (e) {
            console.log('handlePipeNodeTypeData', e);
        }
    }
    // 管网管径选中
    pipeCaliberChange = async (option) => {
        try {
            this.setState({
                [option.id]: !this.state[option.id]
            }, () => {
                this.handlePipeCaliberData();
            });
        } catch (e) {
            console.log('pipeCaliberChange', e);
        }
    }
    // 处理管网管径数据
    handlePipeCaliberData = async () => {
        try {
            let treePipeCaliberData = '';
            let treePipeCaliberDataList = [];
            this.treePipeRateOptions.map((option) => {
                if (this.state[option.id]) {
                    let data = option.label;
                    let arr = data.split('~');
                    let arr1 = arr[0];
                    let arr2 = arr[1];
                    let orderData = `( DN > ${arr1} and DN < ${arr2} )`;
                    treePipeCaliberDataList.push(orderData);
                    // if (treePipeCaliberData) {
                    //     treePipeCaliberData = `( ${treePipeCaliberData} or  ( DN > ${arr1} and DN < ${arr2} ) ) `;
                    // } else {
                    //     treePipeCaliberData += `( DN > ${arr1} and DN < ${arr2} ) `;
                    // }
                }
            });
            if (treePipeCaliberDataList.length > 1) {
                treePipeCaliberDataList.map((child, index) => {
                    if (index === 0) {
                        treePipeCaliberData = `( ${child}`;
                    } else if (index === treePipeCaliberDataList.length - 1) {
                        treePipeCaliberData = `${treePipeCaliberData} or ${child} )`;
                    } else {
                        treePipeCaliberData = `${treePipeCaliberData} or ${child}`;
                    }
                });
            } else if (treePipeCaliberDataList.length === 1) {
                treePipeCaliberData = treePipeCaliberDataList[0];
            }
            this.setState({
                treePipeCaliberData
            }, () => {
                this.handleQueryTreePipe();
            });
        } catch (e) {
            console.log('handlePipeCaliberData', e);
        }
    }
    // 管网材质选中
    pipeMaterialChange = async (option) => {
        try {
            this.setState({
                [option.id]: !this.state[option.id]
            }, () => {
                this.handlePipeMaterialData();
            });
        } catch (e) {
            console.log('pipeMaterialChange', e);
        }
    }
    // 处理管网材质数据
    handlePipeMaterialData = async () => {
        try {
            let treePipeMaterialData = '';
            this.treePipeMaterialOptions.map((option) => {
                if (this.state[option.id]) {
                    let data = option.label;
                    if (treePipeMaterialData) {
                        treePipeMaterialData = `( ${treePipeMaterialData} or  Material = '${data}' ) `;
                    } else {
                        treePipeMaterialData += `Material = '${data}' `;
                    }
                }
            });
            this.setState({
                treePipeMaterialData
            }, () => {
                this.handleQueryTreePipe();
            });
        } catch (e) {
            console.log('handlePipeCaliberData', e);
        }
    }
    // 查询数据
    handleQueryTreePipe = async () => {
        const {
            actions: {
                getQueryTreePipe
            }
        } = this.props;
        const {
            treePipeCaliberData,
            treePipeMaterialData,
            treePipeNodeTypeData,
            treePipe,
            treePipeNode
        } = this.state;
        try {
            let contents = [];
            let sqlData = '';
            let layers = '';
            if (treePipe) {
                layers = 'pipe';
                if (treePipeCaliberData) {
                    sqlData += `and ${treePipeCaliberData}`;
                }
                if (treePipeMaterialData) {
                    sqlData += `and ${treePipeMaterialData}`;
                }
            } else if (treePipeNode) {
                layers = 'pipenode';
                if (treePipeNodeTypeData) {
                    sqlData += `and ${treePipeNodeTypeData}`;
                }
            }
            if (sqlData) {
                this.setState({
                    treePipeLoading: true
                });
                let postData = {
                    Layers: layers,
                    Sql: sqlData
                };
                let queryTreePipeData = await getQueryTreePipe({}, postData);
                if (treePipe) {
                    contents = queryTreePipeData && queryTreePipeData.Pipes;
                } else if (treePipeNode) {
                    contents = queryTreePipeData && queryTreePipeData.PipeNodes;
                }
            }
            this.setState({
                contents,
                treePipeLoading: false
            });
        } catch (e) {
            console.log('handleQueryTreePipe', e);
        }
    }
    // 查找点击点的管线，管点
    handleQueryPipeByWkt = async (latlng) => {
        const {
            map,
            actions: {
                getQueryTreePipe
            }
        } = this.props;
        const {
            treePipe,
            treePipeNode,
            treePipePopLayer
        } = this.state;
        try {
            if (treePipePopLayer) {
                await map.removeLayer(treePipePopLayer);
            }
            let pnt = map.latLngToLayerPoint(latlng);
            let minPnt = map.layerPointToLatLng([pnt.x - 2, pnt.y - 2]);
            let maxPnt = map.layerPointToLatLng([pnt.x + 2, pnt.y + 2]);
            let wkt = 'POLYGON((';
            wkt += minPnt.lng + ' ' + minPnt.lat + ',' + minPnt.lng + ' ' + maxPnt.lat + ',' + maxPnt.lng + ' ' + maxPnt.lat + ',' + maxPnt.lng + ' ' + minPnt.lat + ',' + minPnt.lng + ' ' + minPnt.lat;
            wkt += '))';
            let layers = '';
            if (treePipe) {
                layers = 'pipe';
            } else if (treePipeNode) {
                layers = 'pipenode';
            }
            let postData = {
                Sql: '',
                Bbox: wkt,
                Layers: layers
            };
            let queryTreePipeData = await getQueryTreePipe({}, postData);
            let contents = [];
            if (treePipe) {
                contents = queryTreePipeData && queryTreePipeData.Pipes;
                if (contents.length === 0) {
                    message.warning('未查询到管线数据');
                    return;
                }
            } else if (treePipeNode) {
                contents = queryTreePipeData && queryTreePipeData.PipeNodes;
                if (contents.length === 0) {
                    message.warning('未查询到管点数据');
                    return;
                }
            }
            contents.map((content, index) => {
                if (index !== 0) { return; }
                let contentMessage = {};
                if (treePipe) {
                    contentMessage = {
                        type: 'treePipe',
                        typeName: '管线',
                        CreateTime: (content && content.CreateTime) || '',
                        DN: (content && content.DN) || '',
                        Depth: (content && content.Depth) || '',
                        Material: (content && content.Material) || '',
                        Altitude: (content && content.Altitude) || '',
                        Section: (content && content.Section) || '',
                        ThinClass: (content && content.ThinClass) || ''
                    };
                } else if (treePipeNode) {
                    contentMessage = {
                        type: 'treePipeNode',
                        typeName: '管点',
                        CreateTime: (content && content.CreateTime) || '',
                        PipeType: (content && content.PipeType) || '',
                        Depth: (content && content.Depth) || '',
                        Altitude: (content && content.Altitude) || '',
                        Model: (content && content.Model) || '',
                        Section: (content && content.Section) || '',
                        ThinClass: (content && content.ThinClass) || ''
                    };
                }
                let treePipePopLayer = L.popup()
                    .setLatLng(latlng)
                    .setContent(genPopUpContent(contentMessage))
                    .addTo(map);
                this.setState({
                    treePipePopLayer
                });
            });
        } catch (e) {
            console.log('handleQueryPipeByWkt', e);
        }
    }

    render () {
        const {
            menuTreeVisible
        } = this.props;
        const {
            treePipe,
            treePipeNode,
            contents = [],
            treePipeCaliberData,
            treePipeMaterialData,
            treePipeNodeTypeData,
            treePipeLoading,
            treePipeGisQuery,
            menuIsExtend,
            menuWidth
        } = this.state;
        // 是否展示管线材质的搜索数据
        let materialResultVisible = false;
        let materialResults = [];
        // 是否展示管线管径的搜索数据
        let caliberResultVisible = false;
        let caliberResults = [];
        // 是否展示管点设备类型的搜索数据
        let pipeNodeTypeResultVisible = false;
        let pipeNodeTypeResults = [];
        if (contents && contents.length > 0) {
            if (treePipeMaterialData) {
                materialResultVisible = true;
                materialResults = this.handleMaterialResult(contents);
            }
            if (treePipeCaliberData) {
                caliberResultVisible = true;
                caliberResults = this.handleCaliberResult(contents);
            }
            if (treePipeNodeTypeData) {
                pipeNodeTypeResultVisible = true;
                pipeNodeTypeResults = this.handlePipeNodeTypeResult(contents);
            }
        }
        return (
            <div>
                <div>
                    <div className='TreePipePage-container'>
                        <div className='TreePipePage-r-main'>
                            {
                                menuIsExtend ? '' : (
                                    <img src={display}
                                        className='TreePipePage-foldBtn'
                                        onClick={this._extendAndFold.bind(this)} />
                                )
                            }
                            <div
                                className={`TreePipePage-menuPanel`}
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

                                <div className='TreePipePage-menuBackground' />
                                <aside className='TreePipePage-aside' id='asideDom'>
                                    <div className='TreePipePage-MenuNameLayout'>
                                        <img src={decoration} />
                                        <span className='TreePipePage-MenuName'>灌溉管网</span>
                                        <img src={hide}
                                            onClick={this._extendAndFold.bind(this)}
                                            className='TreePipePage-MenuHideButton' />
                                    </div>
                                    <div className='TreePipePage-asideTree'>

                                        <div className='TreePipePage-button'>
                                            <a key={'管线'}
                                                title={'管线'}
                                                className={treePipe ? 'TreePipePage-button-layoutSel' : 'TreePipePage-button-layout'}
                                                onClick={this.handleChangePipeType.bind(this)}
                                                style={{
                                                    marginRight: 8,
                                                    marginTop: 8
                                                }}
                                            >
                                                <span className='TreePipePage-button-layout-text'>管线</span>
                                            </a>
                                            <a key={'管点'}
                                                title={'管点'}
                                                className={treePipeNode ? 'TreePipePage-button-layoutSel' : 'TreePipePage-button-layout'}
                                                onClick={this.handleChangePipeNodeType.bind(this)}
                                            >
                                                <span className='TreePipePage-button-layout-text'>管点</span>
                                            </a>
                                        </div>
                                        {
                                            treePipe
                                                ? <div>
                                                    <div className='TreePipePage-button'>
                                                        {
                                                            this.treePipeMaterialOptions.map((option) => {
                                                                return (<a key={option.label}
                                                                    title={option.label}
                                                                    className={this.state[option.id] ? 'TreePipePage-button-layoutSel' : 'TreePipePage-button-layout'}
                                                                    onClick={this.pipeMaterialChange.bind(this, option)}
                                                                    style={{
                                                                        marginRight: 8,
                                                                        marginTop: 8
                                                                    }}
                                                                >
                                                                    <span className='TreePipePage-button-layout-text'>{option.label}</span>
                                                                </a>);
                                                            })
                                                        }
                                                    </div>
                                                    <div className='TreePipePage-button'>
                                                        {
                                                            this.treePipeRateOptions.map((option) => {
                                                                return (<a key={option.label}
                                                                    title={option.label}
                                                                    className={this.state[option.id] ? 'TreePipePage-button-layoutSel' : 'TreePipePage-button-layout'}
                                                                    onClick={this.pipeCaliberChange.bind(this, option)}
                                                                    style={{
                                                                        marginRight: 8,
                                                                        marginTop: 8
                                                                    }}
                                                                >
                                                                    <span className='TreePipePage-button-layout-text'>{option.label}</span>
                                                                </a>);
                                                            })
                                                        }
                                                    </div>
                                                </div> : ''
                                        }
                                        {
                                            treePipeNode
                                                ? <div className='TreePipePage-button'>
                                                    {
                                                        this.treePipeNodeTypeOptions.map((option) => {
                                                            return (<a key={option.label}
                                                                title={option.label}
                                                                className={this.state[option.id] ? 'TreePipePage-button-layoutSel' : 'TreePipePage-button-layout'}
                                                                onClick={this.pipeNodeTypeChange.bind(this, option)}
                                                                style={{
                                                                    marginRight: 8,
                                                                    marginTop: 8
                                                                }}
                                                            >
                                                                <span className='TreePipePage-button-layout-text'>{option.label}</span>
                                                            </a>);
                                                        })
                                                    }
                                                </div> : ''
                                        }
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </div>
                    <div className='TreePipePage-result-Container'>
                        <div className='TreePipePage-result-r-main'>
                            <div
                                className={`TreePipePage-result-menuPanel`}
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
                                <div className='TreePipePage-result-menuBackground' />
                                <aside className='TreePipePage-result-aside' id='resultAsideDom'>
                                    <Spin spinning={treePipeLoading}>
                                        <div className='TreePipePage-result-MenuNameLayout'>
                                            <img src={decoration} />
                                            <span className='TreePipePage-result-MenuName'>
                                                {treePipe ? '管线' : (treePipeNode ? '管点' : '')}
                                            </span>
                                        </div>
                                        <div className='TreePipePage-result-asideTree'>
                                            {
                                                treePipe && materialResultVisible
                                                    ? <div>
                                                        {
                                                            materialResults.map((result) => {
                                                                return (
                                                                    <div key={result.ID} className='TreePipePage-result-resultlayout'>
                                                                        <div className='TreePipePage-result-resultBackground' />
                                                                        <span className='TreePipePage-result-type'>
                                                                            {result.Name}
                                                                        </span>
                                                                        <span className='TreePipePage-result-num'>
                                                                            {result.children.length}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </div> : ''
                                            }
                                            {
                                                treePipe && caliberResultVisible
                                                    ? <div>
                                                        {
                                                            caliberResults.map((result) => {
                                                                return (
                                                                    <div key={result.ID} className='TreePipePage-result-resultlayout'>
                                                                        <div className='TreePipePage-result-resultBackground' />
                                                                        <span className='TreePipePage-result-type'>
                                                                            {`管径 ${result.Name}`}
                                                                        </span>
                                                                        <span className='TreePipePage-result-num'>
                                                                            {result.children.length}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </div> : ''
                                            }
                                            {
                                                treePipeNode && pipeNodeTypeResultVisible
                                                    ? <div>
                                                        {
                                                            pipeNodeTypeResults.map((result) => {
                                                                return (
                                                                    <div key={result.ID} className='TreePipePage-result-resultlayout'>
                                                                        <div className='TreePipePage-result-resultBackground' />
                                                                        <span className='TreePipePage-result-type'>
                                                                            {result.Name}
                                                                        </span>
                                                                        <span className='TreePipePage-result-num'>
                                                                            {result.children.length}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </div> : ''
                                            }
                                        </div>
                                    </Spin>
                                </aside>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
