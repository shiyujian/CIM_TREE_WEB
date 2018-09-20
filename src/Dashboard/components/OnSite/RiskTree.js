import React, { Component } from 'react';
import { Tree, Button, DatePicker, Spin, Checkbox } from 'antd';
import './RiskTree.less';
import moment from 'moment';
import {handleRiskData} from '../auth';
const TreeNode = Tree.TreeNode;
const { RangePicker } = DatePicker;

export default class RiskTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            stime: '',
            etime: '',
            timeType: 'all',
            searchData: [],
            riskRectify: false,
            riskNotRectify: true
        };
    }

    componentDidMount = async () => {
        const {
            riskTree
        } = this.props;
        if (riskTree && riskTree instanceof Array && riskTree.length > 0) {
            await this.props.onSearchData(riskTree);
        }
    }

    onCheck (keys, info) {
        this.props.onCheck(keys, info);
    }

    genIconClass () {
        let icClass = '';
        let featureName = this.props.featureName;
        switch (featureName) {
            case 'geojsonFeature_track':
                icClass = 'tr-people';
                break;
            case 'geojsonFeature_risk':
                icClass = 'tr-hazard';
                break;
            case 'geojsonFeature_treetype':
                icClass = 'tr-area';
                break;
        }
        return icClass;
    }

    loop (p) {
        let me = this;
        if (p) {
            return (
                <TreeNode
                    title={p.properties.name}
                    key={p.key}
                    selectable={false}
                >
                    {p.children &&
                        p.children.map(m => {
                            return me.loop(m);
                        })}
                </TreeNode>
            );
        }
    }

    render () {
        let {
            riskTree = [],
            riskTreeLoading
        } = this.props;
        const {
            timeType,
            stime,
            etime,
            searchData,
            riskRectify,
            riskNotRectify
        } = this.state;
        let contents = [];
        if (!etime && !stime && riskNotRectify) {
            for (let j = 0; j < riskTree.length; j++) {
                const element = riskTree[j];
                if (element != undefined) {
                    contents.push(element);
                }
            }
        } else {
            for (let j = 0; j < searchData.length; j++) {
                const element = searchData[j];
                if (element != undefined) {
                    contents.push(element);
                }
            }
        };
        return (
            <div>
                <Spin spinning={riskTreeLoading}>
                    <div className='RiskTree-button'>
                        <Checkbox className='RiskTree-button-layout'
                            checked={riskNotRectify}
                            onChange={this.handleRiskNotRectify.bind(this)}>
                            未整改
                        </Checkbox>
                        <Checkbox className='RiskTree-button-layout'
                            checked={riskRectify}
                            onChange={this.handleRiskRectify.bind(this)}>
                            已整改
                        </Checkbox>
                    </div>
                    <div className='RiskTree-button'>
                        <Button className='RiskTree-button-layout' style={{marginRight: 10}}
                            type={timeType === 'all' ? 'primary' : ''}
                            id='all' onClick={this.handleTimeChange.bind(this)}>
                        全部
                        </Button>
                        <Button className='RiskTree-button-layout' id='today'
                            type={timeType === 'today' ? 'primary' : ''}
                            onClick={this.handleTimeChange.bind(this)}>
                        今天
                        </Button>
                    </div>
                    <div className='RiskTree-button'>
                        <Button className='RiskTree-button-layout' style={{marginRight: 10}}
                            type={timeType === 'week' ? 'primary' : ''}
                            id='week' onClick={this.handleTimeChange.bind(this)}>
                        一周内
                        </Button>
                        <Button className='RiskTree-button-layout' id='custom'
                            type={timeType === 'custom' ? 'primary' : ''}
                            onClick={this.handleTimeChange.bind(this)}>
                        自定义
                        </Button>
                    </div>
                    {
                        timeType === 'custom'
                            ? <RangePicker
                                style={{width: 220, marginBottom: 10}}
                                showTime={{ format: 'YYYY-MM-DD HH:mm:ss' }}
                                format='YYYY-MM-DD HH:mm:ss'
                                placeholder={['Start Time', 'End Time']}
                                onChange={this.handleDateChange.bind(this)}
                            />
                            : ''
                    }
                    <div className='RiskTree-statis-layout'>
                        <span style={{verticalAlign: 'middle'}}>类型</span>
                        <span className='RiskTree-data-text'>
                            数量
                        </span>
                    </div>
                    <div>
                        {
                            contents.map((content) => {
                                return (
                                    <div className='RiskTree-mrg10' key={content.key}>
                                        <span style={{verticalAlign: 'middle'}}>{content.properties.name}</span>
                                        <span className='RiskTree-data-text'>
                                            {content.children.length}
                                        </span>
                                    </div>
                                );
                            })
                        }
                    </div>
                    {/* <div className={this.genIconClass()}>
                        <Tree
                            checkable
                            showIcon
                            onCheck={this.onCheck.bind(this)}
                            showLine
                        // defaultExpandAll
                        >
                            {contents.map(p => {
                                return this.loop(p);
                            })}
                        </Tree>
                    </div> */}
                </Spin>
            </div>
        );
    }
    // 未整改
    handleRiskNotRectify = (e) => {
        this.setState({
            riskNotRectify: e.target.checked,
            riskRectify: !e.target.checked
        }, () => {
            this.query();
        });
    }
    // 已整改
    handleRiskRectify = (e) => {
        this.setState({
            riskRectify: e.target.checked,
            riskNotRectify: !e.target.checked
        }, () => {
            this.query();
        });
    }

    handleTimeChange = (e) => {
        const {
            riskRectify
        } = this.state;
        let {
            riskTree = []
        } = this.props;
        try {
            let target = e.target;
            let timeType = target.getAttribute('id');
            this.setState({
                timeType
            });
            let stime = '';
            let etime = '';
            if (timeType === 'custom') {
                return;
            } else if (timeType === 'all') {
                // 如果没有设置时间  且status为初始状态  则直接获取redux的数据  不用query
                this.setState({
                    stime,
                    etime
                }, () => {
                    if (riskRectify) {
                        this.query();
                    } else {
                        this.props.onSearchData(riskTree);
                    }
                });
                return;
            } else if (timeType === 'today') {
                stime = moment().format('YYYY-MM-DD 00:00:00');
                etime = moment().format('YYYY-MM-DD 23:59:59');
            } else if (timeType === 'week') {
                stime = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
                etime = moment().format('YYYY-MM-DD 23:59:59');
            };
            this.setState({
                stime,
                etime
            }, () => {
                this.query();
            });
        } catch (e) {
            console.log('handleTimeChange', e);
        }
    }

    handleDateChange = (value) => {
        this.setState({
            stime: value[0] ? moment(value[0]).format('YYYY-MM-DD HH:mm:ss') : '',
            etime: value[1] ? moment(value[1]).format('YYYY-MM-DD HH:mm:ss') : ''
        }, () => {
            this.query();
        });
    }

    query = async () => {
        const {
            actions: {
                getRisk,
                getRiskTreeLoading
            },
            riskTree
        } = this.props;
        const {
            stime,
            etime,
            riskNotRectify,
            riskRectify
        } = this.state;
        try {
            if (!stime && !etime && riskNotRectify) {
                await this.props.onSearchData(riskTree);
                return;
            }
            await getRiskTreeLoading(true);
            if (riskNotRectify) {
                let content = [];
                let postdata1 = {
                    stime: stime,
                    etime: etime,
                    status: -1
                };
                let data1 = await getRisk({}, postdata1);

                let postdata2 = {
                    stime: stime,
                    etime: etime,
                    status: 0
                };
                let data2 = await getRisk({}, postdata2);

                let postdata3 = {
                    stime: stime,
                    etime: etime,
                    status: 1
                };
                let data3 = await getRisk({}, postdata3);
                if (data1 && data1.content) {
                    content = content.concat(data1.content);
                }
                if (data2 && data2.content) {
                    content = content.concat(data2.content);
                }
                if (data3 && data3.content) {
                    content = content.concat(data3.content);
                }
                let risks = handleRiskData(content);
                await getRiskTreeLoading(false);
                await this.props.onSearchData(risks);
                this.setState({
                    searchData: risks
                });
            } else {
                let postdata = {
                    stime: stime,
                    etime: etime,
                    status: 2
                };
                let data = await getRisk({}, postdata);
                if (data && data.content) {
                    let content = data.content;
                    let risks = handleRiskData(content);
                    await getRiskTreeLoading(false);
                    await this.props.onSearchData(risks);
                    this.setState({
                        searchData: risks
                    });
                }
            }
        } catch (e) {
            console.log('queryRisk', e);
        }
    }
}
