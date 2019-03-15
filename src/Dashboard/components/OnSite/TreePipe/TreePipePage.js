import React, { Component } from 'react';
import moment from 'moment';
import {
    Row,
    Col,
    Checkbox,
    Spin,
    Tree, 
    Button, 
    DatePicker
} from 'antd';
import {
    FOREST_GIS_TREETYPE_API
} from '_platform/api';
import './TreePipePage.less';
const { RangePicker } = DatePicker;

export default class TreePipePage extends Component {
    constructor (props) {
        super(props);
        this.state = {
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
            // 管网口径范围
            treePipeRataSixty: false,
            treePipeRataHundred: false,
            treePipeRataHundredFifty: false,

            treePipeNode: false, // 查询管点
            treePipe: true, // 查询管网
            treePipeCaliberData: '', // 管径的Sql语句
            treePipeMaterialData: '', // 管线材质的Sql语句
            treePipeNodeTypeData: '', // 管点设备类型的Sql语句
            contents: [] // 搜索的数据
        };
        this.tileLayerTreeFilter = null;
        this.tileTreePipeBasic = null;
        this.tileLayerTreeThinClass = null;
        this.tileTreePipeNodeBasic = null;
    }
    // 灌溉管网设备类型
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
    // 灌溉管网口径范围
    treePipeRateOptions = [
        {
            id: 'treePipeRataSixty',
            label: '0~60'
        },
        {
            id: 'treePipeRataHundred',
            label: '60~100'
        },
        {
            id: 'treePipeRataHundredFifty',
            label: '100~150'
        }
    ]
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

    componentDidMount = async () => {
        await this.getTileLayerTreeFilter();
        await this.getTileLayerTreeThinClass();
        await this.getTreePipeLayer();
        await this.getTreePipeNodeLayer();
    }
    // 灌溉管网下的树木图层
    getTileLayerTreeFilter = async => {
        const {
            map
        } = this.props;
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
    }
    // 灌溉管网下的细班图层
    getTileLayerTreeThinClass = async => {
        const {
            map
        } = this.props;
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
    }
    // '/geoserver/gwc/service/wmts?layer=xatree%3Atreelocation&style=&tilematrixset=My_EPSG%3A43261&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A4326%3A{z}&TileCol={x}&TileRow={y}'
    // 加载灌溉管网图层
    getTreePipeLayer = async () => {
        const {
            map
        } = this.props;
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
    }
    // 加载灌溉管网图层
    getTreePipeNodeLayer = async () => {
        const {
            map
        } = this.props;
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
    }

    componentWillUnmount = async () => {
        const {
            map
        } = this.props;
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
    }

    render () {
        const {
            treePipeLoading = false,
            menuTreeVisible
        } = this.props;
        const {
            treePipe,
            treePipeNode,
            contents = []
        } = this.state;
        let MaterialResultVisible = false;
        let CaliberResultVisible = false;
        return (
            <div>
                {
                    menuTreeVisible
                 ? (
                     <div>
                         <div className='dashboard-menuPanel'>
                            <aside className='dashboard-aside' draggable='false'>
                                <div className='dashboard-asideTree'>
                                    <Spin spinning={treePipeLoading}>
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
                                            treePipe ? 
                                            <div className='TreePipePage-button'>
                                                <div style={{marginBottom: 10}}>
                                                    <Row className='dashboard-menuSwitchTreePipeBorder'>
                                                        <span>口径</span>
                                                    </Row>
                                                    <Row>
                                                        {
                                                            this.treePipeRateOptions.map((option) => {
                                                                return (
                                                                    <Col span={12} style={{marginTop: 5}} key={option.id}>
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
                                                <div style={{marginBottom: 10}}>
                                                    <Row className='dashboard-menuSwitchTreePipeBorder'>
                                                        <span>材质</span>
                                                    </Row>
                                                    <Row>
                                                        {
                                                            this.treePipeMaterialOptions.map((option) => {
                                                                return (
                                                                    <Col span={12} style={{marginTop: 5}} key={option.id}>
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
                                            </div>
                                            : ''
                                        }
                                        {
                                            treePipeNode ?
                                            <div className='TreePipePage-button'>
                                                <div style={{marginBottom: 10}}>
                                                    <Row className='dashboard-menuSwitchTreePipeBorder'>
                                                        <span>设备类型</span>
                                                    </Row>
                                                    <Row>
                                                        {
                                                            this.treePipeNodeTypeOptions.map((option) => {
                                                                return (
                                                                    <Col span={12} style={{marginTop: 5}} key={option.id}>
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
                                        <div className='TreePipePage-statis-layout'>
                                            <span style={{verticalAlign: 'middle'}}>细班</span>
                                            <span className='TreePipePage-data-text'>
                                                创建时间
                                            </span>
                                        </div>
                                        <div>
                                            {
                                                contents.map((content) => {
                                                    return (
                                                        <div className='TreePipePage-mrg10' key={content.ID}>
                                                            <span style={{verticalAlign: 'middle'}}>
                                                                {content.ThinClass}
                                                            </span>
                                                            <span className='TreePipePage-data-text'>
                                                                {moment(content.CreateTime).format('YYYY/MM/DD')}
                                                            </span>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                        {
                                            CaliberResultVisible ?
                                            <div>
                                                <div className='TreePipePage-statis-layout'>
                                                    <span style={{verticalAlign: 'middle'}}>口径</span>
                                                    <span className='TreePipePage-data-text'>
                                                        数量
                                                    </span>
                                                </div>
                                                <div>
                                                    {
                                                        contents.map((content) => {
                                                            return (
                                                                <div className='TreePipePage-mrg10' key={content.key}>
                                                                    <span style={{verticalAlign: 'middle'}}>{content.properties.name}</span>
                                                                    <span className='TreePipePage-data-text'>
                                                                        {content.children.length}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            </div> : ''
                                        }
                                        {
                                            MaterialResultVisible ?
                                            <div>
                                                <div className='TreePipePage-statis-layout'>
                                                    <span style={{verticalAlign: 'middle'}}>材质</span>
                                                    <span className='TreePipePage-data-text'>
                                                        数量
                                                    </span>
                                                </div>
                                                <div>
                                                    {
                                                        contents.map((content) => {
                                                            return (
                                                                <div className='TreePipePage-mrg10' key={content.ID}>
                                                                    <span style={{verticalAlign: 'middle'}}>{content.properties.name}</span>
                                                                    <span className='TreePipePage-data-text'>
                                                                        {content.children.length}
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
    handleChangePipeType = async (e) => {
        this.setState({
            treePipe: e.target.checked,
            treePipeNode: !e.target.checked
        });
    }
    handleChangePipeNodeType = async (e) => {
        this.setState({
            treePipeNode: e.target.checked,
            treePipe: !e.target.checked
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
                    treePipeNodeTypeDataList.push(orderData)
                }
            });
            if (treePipeNodeTypeDataList.length > 1) {
                treePipeNodeTypeDataList.map((child, index) => {
                    if (index === 0) {
                        treePipeNodeTypeData = `( ${child}`
                    } else if (index === treePipeNodeTypeDataList.length - 1) {
                        treePipeNodeTypeData = `${treePipeNodeTypeData} or ${child} )`
                    } else {
                        treePipeNodeTypeData = `${treePipeNodeTypeData} or ${child}`
                    }
                })
            } else if (treePipeNodeTypeDataList.length === 1) {
                treePipeNodeTypeData = treePipeNodeTypeDataList[0];
            }
            console.log('treePipeNodeTypeData', treePipeNodeTypeData);
            this.setState({
                treePipeNodeTypeData
            }, () => {
                this.handleQueryTreePipe();
            });
        } catch (e) {
            console.log('handlePipeNodeTypeData', e);
        }
    }
    // 管网口径选中
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
    // 处理管网口径数据
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
                    treePipeCaliberDataList.push(orderData)
                    // if (treePipeCaliberData) {
                    //     treePipeCaliberData = `( ${treePipeCaliberData} or  ( DN > ${arr1} and DN < ${arr2} ) ) `;
                    // } else {
                    //     treePipeCaliberData += `( DN > ${arr1} and DN < ${arr2} ) `;
                    // }
                }
            });
            console.log('treePipeCaliberDataList', treePipeCaliberDataList);
            if (treePipeCaliberDataList.length > 1) {
                treePipeCaliberDataList.map((child, index) => {
                    if (index === 0) {
                        treePipeCaliberData = `( ${child}`
                    } else if (index === treePipeCaliberDataList.length - 1) {
                        console.log('aaaaaa')
                        treePipeCaliberData = `${treePipeCaliberData} or ${child} )`
                    } else {
                        treePipeCaliberData = `${treePipeCaliberData} or ${child}`
                    }
                })
            } else if (treePipeCaliberDataList.length === 1) {
                treePipeCaliberData = treePipeCaliberDataList[0];
            }
            console.log('treePipeCaliberData', treePipeCaliberData);
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
        } = this.props
        const {
            treePipeCaliberData,
            treePipeMaterialData,
            treePipeNodeTypeData,
            treePipe,
            treePipeNode
        } = this.state;
        try {
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
                let postData = {
                    Layers: layers,
                    Sql: sqlData
                }
                let queryTreePipeData = await postTreePipeQuery({}, postData);
                console.log('queryTreePipeData', queryTreePipeData);
                let contents = [];
                if (treePipe) {
                    contents = queryTreePipeData && queryTreePipeData.Pipes;
                } else if (treePipeNode) {
                    contents = queryTreePipeData && queryTreePipeData.PipeNodes;
                }
                this.setState({
                    contents
                })
            }
        } catch (e) {
            console.log('handleQueryTreePipe', e);
        }
    }
}
