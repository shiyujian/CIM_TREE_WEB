import React, { Component } from 'react';
import moment from 'moment';
import {
    Row,
    Col,
    Checkbox
} from 'antd';
import {
    FOREST_GIS_TREETYPE_API
} from '_platform/api';
import './TreePipePage.less';

export default class TreePipePage extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }
    // 灌溉管网类型
    treePipeTypeOptions = [
        {
            id: 'curingTaskFeed',
            label: '快速取水器'
        },
        {
            id: 'curingTaskDrain',
            label: '三通'
        },
        {
            id: 'curingTaskReplanting',
            label: '四通'
        },
        {
            id: 'curingTaskWorm',
            label: '阀水井'
        },
        {
            id: 'curingTaskTrim',
            label: '水井'
        },
        {
            id: 'curingTaskWeed',
            label: '泄水井'
        }
    ]
    // 灌溉管网口径范围
    treePipeRateOptions = [
        {
            id: 'survivalRateHundred',
            label: '0 ~ 63'
        },
        {
            id: 'survivalRateNinety',
            label: '63 ~ 100'
        },
        {
            id: 'survivalRateEighty',
            label: '100 ~ 150'
        }
    ]

    componentDidMount = async () => {
        await this.getTreePipeLayer();
    }
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

    componentWillUnmount = async () => {
        const {
            map
        } = this.props;
        if (this.tileTreePipeBasic) {
            map.removeLayer(this.tileTreePipeBasic);
            this.tileTreePipeBasic = null;
        }
    }

    render () {
        return (
            <div className='dashboard-menuSwitchTreePipeLayout'>
                <div style={{margin: 10}}>
                    <Row className='dashboard-menuSwitchTreePipeBorder'>
                        <span>类型</span>
                    </Row>
                    <Row>
                        {
                            this.treePipeTypeOptions.map((option) => {
                                return (
                                    <Col span={12} style={{marginTop: 5}}>
                                        <Checkbox onChange={this.pipeTypeChange.bind(this, option)}>{option.label}</Checkbox>
                                    </Col>
                                );
                            })
                        }
                    </Row>
                </div>
                <div style={{margin: 10}}>
                    <Row className='dashboard-menuSwitchTreePipeBorder'>
                        <span>口径</span>
                    </Row>
                    <Row>
                        {
                            this.treePipeRateOptions.map((option) => {
                                return (
                                    <Col span={12} style={{marginTop: 5}}>
                                        <Checkbox onChange={this.pipeCaliberChange.bind(this, option)}>{option.label}</Checkbox>
                                    </Col>
                                );
                            })
                        }
                    </Row>
                </div>
            </div>
        );
    }

    // 管网类型选中
    pipeTypeChange = () => {

    }
    // 管网口径选中
    pipeCaliberChange = () => {

    }
}
