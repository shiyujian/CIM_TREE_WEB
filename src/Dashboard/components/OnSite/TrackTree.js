import React, { Component } from 'react';
import { Tree, Button, DatePicker, Spin, Input } from 'antd';
import moment from 'moment';
import {handleTrackData} from '../auth';
import './TrackTree.less';
const TreeNode = Tree.TreeNode;
const { RangePicker } = DatePicker;
const Search = Input.Search;
export default class TrackTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            stime: '',
            etime: '',
            timeType: 'all',
            searchDateData: [],
            searchNameData: [],
            searchName: ''
        };
    }
    componentDidMount = async () => {
    }

    onCheck (keys, info) {
        this.props.onCheck(keys, info);
    }

    onSelect (keys, info) {
        this.props.onSelect(keys, info);
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

    loop (data = [], loopTime) {
        const that = this;
        if (loopTime) {
            loopTime = loopTime + 1;
        } else {
            loopTime = 1;
        }
        if (loopTime > 1) {
            return (
                <TreeNode
                    title={data.CreateTime}
                    key={JSON.stringify(data)}
                    selectable={false}
                >
                    {data.children &&
                    data.children.map(m => {
                        return that.loop(m, loopTime);
                    })}
                </TreeNode>
            );
        } else {
            return (
                <TreeNode
                    title={data.Full_Name}
                    key={data.ID}
                    selectable={false}
                >
                    {data.children &&
                    data.children.map(m => {
                        return that.loop(m, loopTime);
                    })}
                </TreeNode>
            );
        }
    }

    render () {
        let {
            trackTree = [],
            trackTreeLoading
        } = this.props;
        const {
            timeType,
            stime,
            etime,
            searchDateData,
            searchNameData,
            searchName
        } = this.state;
        let contents = [];
        console.log('searchName', searchName);
        console.log('searchNameData', searchNameData);

        if (searchName) {
            contents = searchNameData;
        } else if (etime && stime) {
            for (let j = 0; j < searchDateData.length; j++) {
                const element = searchDateData[j];
                if (element !== undefined) {
                    contents.push(element);
                }
            }
        } else {
            for (let j = 0; j < trackTree.length; j++) {
                const element = trackTree[j];
                if (element !== undefined) {
                    contents.push(element);
                }
            }
        };
        console.log('contents', contents);
        return (
            <div>
                <Spin spinning={trackTreeLoading}>
                    <Search
                        className='TrackTree-search'
                        placeholder='人名搜索'
                        onSearch={this.searchUserName.bind(this)}
                    />
                    <div className='TrackTree-button'>
                        <Button className='TrackTree-button-layout' style={{marginRight: 10}}
                            type={timeType === 'all' ? 'primary' : ''}
                            id='all' onClick={this.handleTimeChange.bind(this)}>
                            全部
                        </Button>
                        <Button className='TrackTree-button-layout' id='today'
                            type={timeType === 'today' ? 'primary' : ''}
                            onClick={this.handleTimeChange.bind(this)}>
                            今天
                        </Button>
                    </div>
                    <div className='TrackTree-button'>
                        <Button className='TrackTree-button-layout' style={{marginRight: 10}}
                            type={timeType === 'week' ? 'primary' : ''}
                            id='week' onClick={this.handleTimeChange.bind(this)}>
                            一周内
                        </Button>
                        <Button className='TrackTree-button-layout' id='custom'
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
                    <div className='TrackTree-statis-layout'>
                        <span style={{verticalAlign: 'middle'}}>人名</span>
                        <span className='TrackTree-data-text'>
                            次数
                        </span>
                    </div>
                    <div>
                        {
                            contents.map((content) => {
                                return (
                                    <div className='TrackTree-mrg10' key={content.ID}>
                                        <span style={{verticalAlign: 'middle'}}>{content.Full_Name}</span>
                                        <span className='TrackTree-data-text'>
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

    searchUserName = (value) => {
        let {
            trackTree = []
        } = this.props;
        const {
            stime,
            etime,
            searchDateData
        } = this.state;
        // 如果没有搜索数据，则展示全部数据，并将地图上的图层清空
        if (!value) {
            this.setState({
                searchNameData: [],
                searchName: ''
            });
            this.props.onLocation([]);
            return;
        }
        let contents = [];
        if (etime && stime) {
            for (let j = 0; j < searchDateData.length; j++) {
                const element = searchDateData[j];
                if (element !== undefined) {
                    contents.push(element);
                }
            }
        } else {
            for (let j = 0; j < trackTree.length; j++) {
                const element = trackTree[j];
                if (element !== undefined) {
                    contents.push(element);
                }
            }
        };
        let ckeckedData = [];
        let searchNameData = [];
        contents.map((content) => {
            let name = content.Full_Name;
            if (name.indexOf(value) !== -1) {
                searchNameData.push(content);
                if (content && content.children) {
                    ckeckedData = ckeckedData.concat(content.children);
                }
            }
        });
        console.log('ckeckedData', ckeckedData);
        this.props.onLocation(ckeckedData);
        this.setState({
            searchNameData,
            searchName: value
        });
    }

    handleTimeChange = (e) => {
        try {
            let target = e.target;
            let timeType = target.getAttribute('id');
            console.log('timeType', timeType);
            this.setState({
                timeType
            });
            let stime = '';
            let etime = '';
            if (timeType === 'custom') {
                return;
            } else if (timeType === 'all') {
                this.setState({
                    stime,
                    etime
                });
                return;
            } else if (timeType === 'today') {
                stime = moment().format('YYYY-MM-DD 00:00:00');
                etime = moment().format('YYYY-MM-DD 23:59:59');
            } else if (timeType === 'week') {
                stime = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
                etime = moment().format('YYYY-MM-DD 23:59:59');
            };
            console.log('wwwwwwwwwwwwww');
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
                getInspectRouter,
                getTrackTreeLoading
            }
        } = this.props;
        const {
            stime,
            etime
        } = this.state;
        try {
            this.props.onRemoveAllLayer();
            await getTrackTreeLoading(true);
            let postdata = {
                stime: stime,
                etime: etime,
                status: 2
            };
            let routes = await getInspectRouter({}, postdata);
            console.log('routes', routes);
            let searchDateData = handleTrackData(routes);
            console.log('searchDateData', searchDateData);
            await getTrackTreeLoading(false);
            this.setState({
                searchDateData
            });
        } catch (e) {
            console.log('queryRisk', e);
        }
    }
}
