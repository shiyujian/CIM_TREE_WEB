import React, { Component } from 'react';
import { Tree, Button, DatePicker, Spin, Checkbox } from 'antd';
import './CuringTaskTree.less';
import moment from 'moment';
import {handleCuringTaskData} from '../auth';
const TreeNode = Tree.TreeNode;
const { RangePicker } = DatePicker;

export default class CuringTaskTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            stime: '',
            etime: '',
            timeType: 'all',
            searchData: [],
            curingTaskComplete: false,
            curingTaskUnComplete: true
        };
    }

    componentDidMount = async () => {
        const {
            curingTaskTree
        } = this.props;
        if (curingTaskTree && curingTaskTree instanceof Array && curingTaskTree.length > 0) {
            await this.props.onSearchData(curingTaskTree);
        }
    }

    onCheck (keys, info) {
        this.props.onCheck(keys, info);
    }

    onSelect (keys, info) {
        this.props.onSelect(keys, info);
    }

    loop (p, loopTime) {
        const that = this;
        if (loopTime) {
            loopTime = loopTime + 1;
        } else {
            loopTime = 1;
        }
        if (loopTime === 1) {
            if (p) {
                return (
                    <TreeNode
                        selectable={false}
                        title={p.Name}
                        key={p.ID}
                    >
                        {p.children &&
                            p.children.map(m => {
                                return that.loop(m, loopTime);
                            })}
                    </TreeNode>
                );
            }
        } else {
            if (p) {
                return (
                    <TreeNode
                        selectable={false}
                        title={`${p.CreateTime}-${p.CuringMans}`}
                        key={p.ID}
                    />
                );
            }
        }
    }

    render () {
        let {
            curingTaskTree = [],
            curingTaskTreeLoading
        } = this.props;
        const {
            timeType,
            stime,
            etime,
            searchData,
            curingTaskComplete,
            curingTaskUnComplete
        } = this.state;
        let contents = [];
        if (!etime && !stime && curingTaskUnComplete) {
            for (let j = 0; j < curingTaskTree.length; j++) {
                const element = curingTaskTree[j];
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
                <Spin spinning={curingTaskTreeLoading}>
                    <div className='CuringTaskTree-button'>
                        <Checkbox className='CuringTaskTree-button-layout'
                            checked={curingTaskUnComplete}
                            onChange={this.handleCuringTaskUnComplete.bind(this)}>
                            未完成
                        </Checkbox>
                        <Checkbox className='CuringTaskTree-button-layout'
                            checked={curingTaskComplete}
                            onChange={this.handleCuringTaskComplete.bind(this)}>
                            已完成
                        </Checkbox>
                    </div>
                    <div className='CuringTaskTree-button'>
                        <Button className='CuringTaskTree-button-layout' style={{marginRight: 10}}
                            type={timeType === 'all' ? 'primary' : ''}
                            id='all' onClick={this.handleTimeChange.bind(this)}>
                            全部
                        </Button>
                        <Button className='CuringTaskTree-button-layout' id='today'
                            type={timeType === 'today' ? 'primary' : ''}
                            onClick={this.handleTimeChange.bind(this)}>
                            今天
                        </Button>
                    </div>
                    <div className='CuringTaskTree-button'>
                        <Button className='CuringTaskTree-button-layout' style={{marginRight: 10}}
                            type={timeType === 'week' ? 'primary' : ''}
                            id='week' onClick={this.handleTimeChange.bind(this)}>
                            一周内
                        </Button>
                        <Button className='CuringTaskTree-button-layout' id='custom'
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
                    <div className='CuringTaskTree-statis-layout'>
                        <span style={{verticalAlign: 'middle'}}>类型</span>
                        <span className='CuringTaskTree-data-text'>
                            数量
                        </span>
                    </div>
                    <div>
                        {
                            contents.map((content) => {
                                return (
                                    <div className='CuringTaskTree-mrg10' key={content.ID}>
                                        <span style={{verticalAlign: 'middle'}}>{content.Name}</span>
                                        <span className='CuringTaskTree-data-text'>
                                            {content.children.length}
                                        </span>
                                    </div>
                                );
                            })
                        }
                    </div>
                    {/* <Tree
                        checkable
                        onCheck={this.onCheck.bind(this)}
                        showLine
                    >
                        {contents.map(p => {
                            return this.loop(p);
                        })}
                    </Tree> */}
                </Spin>
            </div>
        );
    }

    // 未整改
    handleCuringTaskUnComplete = (e) => {
        this.setState({
            curingTaskUnComplete: e.target.checked,
            curingTaskComplete: !e.target.checked
        }, () => {
            this.query();
        });
    }
    // 已整改
    handleCuringTaskComplete = (e) => {
        this.setState({
            curingTaskComplete: e.target.checked,
            curingTaskUnComplete: !e.target.checked
        }, () => {
            this.query();
        });
    }

    handleTimeChange = (e) => {
        const {
            curingTaskComplete
        } = this.state;
        const {
            curingTaskTree
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
                    if (curingTaskComplete) {
                        this.query();
                    } else {
                        this.props.onSearchData(curingTaskTree);
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
                getCuring,
                getCuringTypes,
                getCuringTaskTreeLoading
            },
            curingTypes,
            curingTaskTree
        } = this.props;
        const {
            stime,
            etime,
            curingTaskUnComplete,
            curingTaskComplete
        } = this.state;
        try {
            if (!stime && !etime && curingTaskUnComplete) {
                await this.props.onSearchData(curingTaskTree);
                return;
            }
            await getCuringTaskTreeLoading(true);
            let curingTypesData = [];
            if (curingTypes && curingTypes instanceof Array && curingTypes.length > 0) {
                curingTypesData = curingTypes;
            } else {
                let data = await getCuringTypes();
                curingTypesData = data && data.content;
            }
            let curingTaskTreeData = [];
            if (curingTypesData && curingTypesData.length > 0) {
                if (curingTaskUnComplete) {
                    let curingTasks = [];
                    // 状态为有效
                    let postdata1 = {
                        stime: stime,
                        etime: etime,
                        status: 0
                    };
                    let data1 = await getCuring({}, postdata1);
                    // 状态为退回
                    let postdata2 = {
                        stime: stime,
                        etime: etime,
                        status: 1
                    };
                    let data2 = await getCuring({}, postdata2);
                    if (data1 && data1.content) {
                        curingTasks = curingTasks.concat(data1.content);
                    }
                    if (data2 && data2.content) {
                        curingTasks = curingTasks.concat(data2.content);
                    }
                    curingTaskTreeData = await handleCuringTaskData(curingTypesData, curingTasks);
                    await getCuringTaskTreeLoading(false);
                    await this.props.onSearchData(curingTaskTreeData);
                    this.setState({
                        searchData: curingTaskTreeData
                    });
                } else {
                    // 状态为已上报
                    let postdata = {
                        stime: stime,
                        etime: etime,
                        status: 2
                    };
                    let curingTaskData = await getCuring({}, postdata);
                    let curingTasks = curingTaskData.content;
                    curingTaskTreeData = await handleCuringTaskData(curingTypesData, curingTasks);
                    await getCuringTaskTreeLoading(false);
                    await this.props.onSearchData(curingTaskTreeData);
                    this.setState({
                        searchData: curingTaskTreeData
                    });
                }
            }
        } catch (e) {
            console.log('queryRisk', e);
        }
    }
}
