import React, { Component } from 'react';
import { Button, DatePicker, Spin, Checkbox, Row } from 'antd';
import L from 'leaflet';
import Scrollbar from 'smooth-scrollbar';
import './TreeTransferTree.less';
import moment from 'moment';
import {
    handleCuringTaskData,
    getIconType,
    genPopUpContent,
    handleCuringTaskMess
} from '../../auth';
import {handlePOLYGONWktData} from '_platform/gisAuth';

import decoration from './TreeTransferImg/decoration.png';
import hide from './TreeTransferImg/hide2.png';
import display from './TreeTransferImg/display2.png';

const { RangePicker } = DatePicker;

export default class TreeTransferTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            stime: moment().format('YYYY-MM-DD'),
            etime: moment().format('YYYY-MM-DD'),
            dateStime: '',
            dateEtime: '',
            timeType: 'today',
            transferTreeSrarchData: 0,
            menuIsExtend: true /* 菜单是否展开 */,
            menuWidth: 437 /* 菜单宽度 */
        };
    }

    componentDidMount = async () => {
        const {
            treeTransferTreeDay = 0
        } = this.props;
        try {
            await this.handleTransferSearchData(treeTransferTreeDay);
            if (document.querySelector('#TreeTransferAsideDom')) {
                let TreeTransferAsideDom = Scrollbar.init(document.querySelector('#TreeTransferAsideDom'));
                console.log('TreeTransferAsideDom', TreeTransferAsideDom);
            }
        } catch (e) {
            console.log('componentDidMount', e);
        }
    }

    componentWillUnmount = async () => {
        // await this.handleRemoveAllCuringTaskLayer();
    }

    /* 菜单展开收起 */
    _extendAndFold = () => {
        this.setState({ menuIsExtend: !this.state.menuIsExtend });
    }

    handleTimeChange = (timeType) => {
        const {
            treeTransferTree
        } = this.props;
        try {
            this.setState({
                timeType,
                dateStime: '',
                dateEtime: ''
            });
            let stime = '';
            let etime = '';
            if (timeType === 'all') {
                // 如果没有设置时间  且status为初始状态  则直接获取redux的数据  不用query
                this.setState({
                    stime,
                    etime
                }, () => {
                    if (treeTransferTree && treeTransferTree instanceof Array && treeTransferTree.length > 0) {
                        this.handleTransferSearchData(treeTransferTree);
                    } else {
                        this.query();
                    }
                });
                return;
            } else if (timeType === 'today') {
                stime = moment().format('YYYY-MM-DD');
                etime = moment().format('YYYY-MM-DD');
            } else if (timeType === 'week') {
                stime = moment().subtract(7, 'days').format('YYYY-MM-DD');
                etime = moment().format('YYYY-MM-DD');
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
            dateStime: value[0] ? moment(value[0]).format('YYYY-MM-DD') : '',
            dateEtime: value[1] ? moment(value[1]).format('YYYY-MM-DD') : '',
            timeType: 'custom',
            stime: value[0] ? moment(value[0]).format('YYYY-MM-DD') : '',
            etime: value[1] ? moment(value[1]).format('YYYY-MM-DD') : ''
        }, () => {
            this.query();
        });
    }

    query = async () => {
        const {
            actions: {
                getTreeTransferStat,
                getTreeTransferTree,
                getTreeTransferTreeLoading
            }
        } = this.props;
        const {
            stime,
            etime,
            timeType
        } = this.state;
        try {
            await getTreeTransferTreeLoading(true);
            let postdata = {
                stime: stime ? moment(stime).format('YYYY-MM-DD 00:00:01') : '',
                etime: etime ? moment(etime).format('YYYY-MM-DD 23:59:59') : ''
            };
            let data = await getTreeTransferStat({}, postdata);
            await getTreeTransferTreeLoading(false);
            if (timeType === 'all') {
                await getTreeTransferTree(data);
            }
            await this.handleTransferSearchData(data);
        } catch (e) {
            console.log('query', e);
        }
    }
    // 搜索之后的养护任务数据
    handleTransferSearchData = (searchData) => {
        this.setState({
            transferTreeSrarchData: searchData
        });
    }
    render () {
        let {
            treeTransferTreeLoading
        } = this.props;
        const {
            timeType,
            menuIsExtend,
            menuWidth,
            dateStime,
            dateEtime,
            transferTreeSrarchData = 0
        } = this.state;
        return (
            <div className='TreeTransferPage-container'>
                <div className='TreeTransferPage-r-main'>
                    {
                        menuIsExtend ? '' : (
                            <img src={display}
                                className='TreeTransferPage-foldBtn'
                                onClick={this._extendAndFold.bind(this)} />
                        )
                    }
                    <div
                        className={`TreeTransferPage-menuPanel`}
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
                        <div className='TreeTransferPage-menuBackground' />
                        <aside className='TreeTransferPage-aside' id='TreeTransferAsideDom'>
                            <div className='TreeTransferPage-MenuNameLayout'>
                                <img src={decoration} />
                                <span className='TreeTransferPage-MenuName'>苗木迁移</span>
                                <img src={hide}
                                    onClick={this._extendAndFold.bind(this)}
                                    className='TreeTransferPage-MenuHideButton' />
                            </div>
                            <div className='TreeTransferPage-asideTree'>
                                <Spin spinning={treeTransferTreeLoading}>
                                    <div className='TreeTransferPage-TimeButton'>
                                        <a key='今天'
                                            title='今天'
                                            id='today'
                                            className={timeType === 'today' ? 'TreeTransferPage-button-timeSel' : 'TreeTransferPage-button-time'}
                                            onClick={this.handleTimeChange.bind(this, 'today')}
                                            style={{
                                                marginRight: 8
                                                // marginTop: 8
                                            }}
                                        >
                                            <span className={timeType === 'today' ? 'TreeTransferPage-button-time-textSel' : 'TreeTransferPage-button-time-text'}>
                                                今天
                                            </span>
                                        </a>
                                        <a key='一周内'
                                            title='一周内'
                                            id='week'
                                            className={timeType === 'week' ? 'TreeTransferPage-button-timeSel' : 'TreeTransferPage-button-time'}
                                            onClick={this.handleTimeChange.bind(this, 'week')}
                                            style={{
                                                marginRight: 8
                                                // marginTop: 8
                                            }}
                                        >
                                            <span className={timeType === 'week' ? 'TreeTransferPage-button-time-textSel' : 'TreeTransferPage-button-time-text'}>
                                                一周内
                                            </span>
                                        </a>
                                        <a key='全部'
                                            title='全部'
                                            id='all'
                                            className={timeType === 'all' ? 'TreeTransferPage-button-timeSel' : 'TreeTransferPage-button-time'}
                                            onClick={this.handleTimeChange.bind(this, 'all')}
                                            style={{
                                                marginRight: 8
                                                // marginTop: 8
                                            }}
                                        >
                                            <span className={timeType === 'all' ? 'TreeTransferPage-button-time-textSel' : 'TreeTransferPage-button-time-text'}>
                                                全部
                                            </span>
                                        </a>
                                        <a key='custom'
                                            title='custom'
                                            id='custom'
                                            className={timeType === 'custom' ? 'TreeTransferPage-button-customTimeSel' : 'TreeTransferPage-button-customTime'}
                                            style={{
                                                marginRight: 8
                                                // marginTop: 8
                                            }}
                                        >
                                            <RangePicker
                                                allowClear={false}
                                                style={{ width: '100%', height: '100%' }}
                                                value={
                                                    dateStime && dateEtime
                                                        ? [
                                                            moment(dateStime, 'YYYY-MM-DD'),
                                                            moment(dateEtime, 'YYYY-MM-DD')
                                                        ] : null
                                                }
                                                format='YYYY-MM-DD'
                                                placeholder={['开始时间', '结束时间']}
                                                onChange={this.handleDateChange.bind(this)}
                                            />
                                        </a>
                                    </div>
                                    <div className='TreeTransferPage-button'>
                                        <div>
                                            <span className='TreeTransferPage-button-layout-num'>
                                                {transferTreeSrarchData}
                                            </span>
                                        </div>
                                    </div>
                                </Spin>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        );
    }
}
