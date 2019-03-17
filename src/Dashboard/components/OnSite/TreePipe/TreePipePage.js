import React, { Component } from 'react';
import moment from 'moment';
import {
    Row,
    Col,
    Checkbox,
    Spin,
    message
} from 'antd';
import {
    genPopUpContent
} from '../../auth';
import {
    FOREST_GIS_TREETYPE_API
} from '_platform/api';
import './TreePipePage.less';

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
            treePipeGisQuery: false, // 是否点击查看
            treePipePopLayer: ''
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
            console.log('是否存在点击事件', map.listens('click'));

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
            console.log('dashboardCompomentMenu', dashboardCompomentMenu);
            console.log('treePipeGisQuery', treePipeGisQuery);
            console.log('e', e);
            if (dashboardCompomentMenu === 'geojsonFeature_treePipe' && treePipeGisQuery && e) {
                console.log('handleTreePipeMapClickFunction', e);
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
                FOREST_GIS_TREETYPE_API +
                '/geoserver/gwc/service/wmts?layer=xatree%3Aland&style=&tilematrixset=My_EPSG%3A43261&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                {
                    opacity: 1.0,
                    subdomains: [1, 2, 3],
                    minZoom: 11,
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
                FOREST_GIS_TREETYPE_API +
                '/geoserver/gwc/service/wmts?layer=xatree%3Athinclass&style=&tilematrixset=My_EPSG%3A43261&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                {
                    opacity: 1.0,
                    subdomains: [1, 2, 3],
                    minZoom: 11,
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
                FOREST_GIS_TREETYPE_API +
                '/geoserver/gwc/service/wmts?layer=xatree%3Apipe&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                {
                    opacity: 1.0,
                    subdomains: [1, 2, 3],
                    minZoom: 11,
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
                FOREST_GIS_TREETYPE_API +
                '/geoserver/gwc/service/wmts?layer=xatree%3Apipenode&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}',
                {
                    opacity: 1.0,
                    subdomains: [1, 2, 3],
                    minZoom: 11,
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
            treePipeGisQuery
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
                {
                    menuTreeVisible
                        ? (
                            <div>
                                <div className='TreePipePage-menuPanel'>
                                    <aside className='TreePipePage-aside' draggable='false'>
                                        <div className='TreePipePage-asideTree'>
                                            <Spin spinning={treePipeLoading}>
                                                <div className='TreePipePage-button'>
                                                    <div className='TreePipePage-GisQueryBorder'>
                                                        <Checkbox className='TreePipePage-button-layout'
                                                            checked={treePipeGisQuery}
                                                            onChange={this.handleChangePipeGisQuery.bind(this)}>
                                                            地图标注
                                                        </Checkbox>
                                                    </div>
                                                </div>
                                                <div className='TreePipePage-button'>
                                                    <Checkbox className='TreePipePage-button-layout'
                                                        checked={treePipe}
                                                        onChange={this.handleChangePipeType.bind(this)}>
                                                        管线
                                                    </Checkbox>
                                                    <Checkbox className='TreePipePage-button-layout'
                                                        checked={treePipeNode}
                                                        onChange={this.handleChangePipeNodeType.bind(this)}>
                                                        管点
                                                    </Checkbox>
                                                </div>
                                                {
                                                    treePipe
                                                        ? <div className='TreePipePage-button'>
                                                            <div style={{ marginBottom: 10 }}>
                                                                <Row className='TreePipePage-menuSwitchTreePipeBorder'>
                                                                    <span>材质</span>
                                                                </Row>
                                                                <Row>
                                                                    {
                                                                        this.treePipeMaterialOptions.map((option) => {
                                                                            return (
                                                                                <Col span={12} style={{ marginTop: 5 }} key={option.id}>
                                                                                    <Checkbox checked={this.state[option.id]}
                                                                                        onChange={this.pipeMaterialChange.bind(this, option)}>
                                                                                        {option.label}
                                                                                    </Checkbox>
                                                                                </Col>
                                                                            );
                                                                        })
                                                                    }
                                                                </Row>
                                                            </div>
                                                            <div style={{ marginBottom: 10 }}>
                                                                <Row className='TreePipePage-menuSwitchTreePipeBorder'>
                                                                    <span>管径</span>
                                                                </Row>
                                                                <Row>
                                                                    {
                                                                        this.treePipeRateOptions.map((option) => {
                                                                            return (
                                                                                <Col span={12} style={{ marginTop: 5 }} key={option.id}>
                                                                                    <Checkbox
                                                                                        checked={this.state[option.id]}
                                                                                        onChange={this.pipeCaliberChange.bind(this, option)}>
                                                                                        {option.label}
                                                                                    </Checkbox>
                                                                                </Col>
                                                                            );
                                                                        })
                                                                    }
                                                                </Row>
                                                            </div>
                                                        </div>
                                                        : ''
                                                }
                                                {
                                                    treePipeNode
                                                        ? <div className='TreePipePage-button'>
                                                            <div style={{ marginBottom: 10 }}>
                                                                <Row className='TreePipePage-menuSwitchTreePipeBorder'>
                                                                    <span>设备类型</span>
                                                                </Row>
                                                                <Row>
                                                                    {
                                                                        this.treePipeNodeTypeOptions.map((option) => {
                                                                            return (
                                                                                <Col span={12} style={{ marginTop: 5 }} key={option.id}>
                                                                                    <Checkbox checked={this.state[option.id]}
                                                                                        onChange={this.pipeNodeTypeChange.bind(this, option)}>
                                                                                        {option.label}
                                                                                    </Checkbox>
                                                                                </Col>
                                                                            );
                                                                        })
                                                                    }
                                                                </Row>
                                                            </div>
                                                        </div>
                                                        : ''
                                                }
                                                <div className='TreePipePage-query-title'>查询结果：</div>
                                                {
                                                    treePipe && materialResultVisible
                                                        ? <div>
                                                            <div className='TreePipePage-statis-layout'>
                                                                <span style={{ verticalAlign: 'middle' }}>材质</span>
                                                                <span className='TreePipePage-data-text'>
                                                                    数量
                                                                </span>
                                                            </div>
                                                            <div>
                                                                {
                                                                    materialResults.map((result) => {
                                                                        return (
                                                                            <div className='TreePipePage-mrg10' key={result.ID}>
                                                                                <span style={{ verticalAlign: 'middle' }}>{result.Name}</span>
                                                                                <span className='TreePipePage-data-text'>
                                                                                    {result.children.length}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        </div> : ''
                                                }
                                                {
                                                    treePipe && caliberResultVisible
                                                        ? <div>
                                                            <div className='TreePipePage-statis-layout'>
                                                                <span style={{ verticalAlign: 'middle' }}>管径</span>
                                                                <span className='TreePipePage-data-text'>
                                                                    数量
                                                                </span>
                                                            </div>
                                                            <div>
                                                                {
                                                                    caliberResults.map((result) => {
                                                                        return (
                                                                            <div className='TreePipePage-mrg10' key={result.ID}>
                                                                                <span style={{ verticalAlign: 'middle' }}>{result.Name}</span>
                                                                                <span className='TreePipePage-data-text'>
                                                                                    {result.children.length}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        </div> : ''
                                                }
                                                {
                                                    treePipeNode && pipeNodeTypeResultVisible
                                                        ? <div>
                                                            <div className='TreePipePage-statis-layout'>
                                                                <span style={{ verticalAlign: 'middle' }}>设备类型</span>
                                                                <span className='TreePipePage-data-text'>
                                                                    数量
                                                                </span>
                                                            </div>
                                                            <div>
                                                                {
                                                                    pipeNodeTypeResults.map((result) => {
                                                                        return (
                                                                            <div className='TreePipePage-mrg10' key={result.ID}>
                                                                                <span style={{ verticalAlign: 'middle' }}>{result.Name}</span>
                                                                                <span className='TreePipePage-data-text'>
                                                                                    {result.children.length}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        </div> : ''
                                                }
                                            </Spin>
                                        </div>
                                    </aside>
                                </div>
                            </div>
                        ) : ''
                }
            </div>

        );
    }
    handleChangePipeGisQuery = async (e) => {
        this.setState({
            treePipeGisQuery: e.target.checked
        });
    }
    handleChangePipeType = async (e) => {
        this.setState({
            treePipe: e.target.checked,
            treePipeNode: !e.target.checked
        }, async () => {
            await this.handleQueryTreePipe();
        });
    }
    handleChangePipeNodeType = async (e) => {
        await this.handleQueryTreePipe();
        this.setState({
            treePipeNode: e.target.checked,
            treePipe: !e.target.checked
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
                postTreePipeQuery
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
                let queryTreePipeData = await postTreePipeQuery({}, postData);
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
                postTreePipeQuery
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
            let queryTreePipeData = await postTreePipeQuery({}, postData);
            let contents = [];
            console.log('aaaaaaaaaaaaa');
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
                        CreateTime: content.CreateTime,
                        DN: content.DN,
                        Depth: content.Depth,
                        Material: content.Material,
                        Altitude: content.Altitude,
                        Section: content.Section,
                        ThinClass: content.ThinClass
                    };
                } else if (treePipeNode) {
                    contentMessage = {
                        type: 'treePipeNode',
                        typeName: '管点',
                        CreateTime: content.CreateTime,
                        PipeType: content.PipeType,
                        Depth: content.Depth,
                        Altitude: content.Altitude,
                        Model: content.Model,
                        Section: content.Section,
                        ThinClass: content.ThinClass
                    };
                }
                let treePipePopLayer = L.popup()
                    .setLatLng(latlng)
                    .setContent(genPopUpContent(contentMessage))
                    .addTo(map);
                this.setState({
                    treePipePopLayer
                })
            });
        } catch (e) {
            console.log('handleQueryPipeByWkt', e);
        }
        
    }
}
