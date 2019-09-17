import React, { Component } from 'react';
import { Content, DynamicTitle } from '_platform/components/layout';
import { actions } from '../store/query';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as platformActions } from '_platform/store/global';
import { DatePicker, Row, Col, Button, Table } from 'antd';
import { IN_OFF_DUTY_API } from '_platform/api';
import moment from 'moment';
import 'moment/locale/zh-cn';

// moment.locale('zh-cn');
let on_off_duty = IN_OFF_DUTY_API.split('--');
const { MonthPicker } = DatePicker;

@connect(
    state => {
        const { selfcare: { query = {} } = {}, platform } = state || {};
        return { ...query, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class Query extends Component {
    static propTypes = {};

    constructor (props) {
        super(props);
        this.state = {
            month: moment().format('YYYY-MM'),
            on_duty: on_off_duty[0],
            off_duty: on_off_duty[1]
        };
    }

    componentDidMount () {}

    onMonthChange (value) {
        this.setState({
            month: value.format('YYYY-MM')
        });
    }

    searchClick () {
        const {
            actions: { getCheckListAc }
        } = this.props;
        // getCheckListAc({
        // 	month: this.state.month
        // });
    }

    _getOrgInfo (org_code) {
        const {
            actions: { getOrgInfoAc }
        } = this.props;
        // getOrgInfoAc({
        // 	org_code:org_code,
        // })
        // 	.then(conf=>{
        // 		const {extra_params}=conf;
        // 		const {on_duty,off_duty}=extra_params;
        // 		if(on_duty && off_duty){
        // 			this.setState({
        // 				on_duty:conf[0].on_duty,
        // 				off_duty:conf[0].off_duty,
        // 			})
        // 		}else{
        // 			this.setState({
        // 				on_duty:on_off_duty[0],
        // 				off_duty:on_off_duty[1],
        // 			})
        // 		}
        // 	})
    }

    render () {
        const rowSelection = {
            // selectedRowKeys,
            onChange: this.onSelectChange
        };
        const { checkList = [] } = this.props;
        console.log('checklist', checkList);
        const newChecks = this.renderChecks(checkList);
        return (
            <div>
                <DynamicTitle title='个人考勤' {...this.props} />
                <Content>
                    <Row>
                        <Col span={8}>
                            工作日正常上班时间：{this.state.on_duty}
                        </Col>
                        <Col span={8}>
                            工作日正常下班时间：{this.state.off_duty}
                        </Col>
                        <Col span={8}>
                            <MonthPicker
                                style={{ display: 'block', float: 'left' }}
                                allowClear={false}
                                defaultValue={moment()}
                                placeholder='请选择查询月份'
                                onChange={this.onMonthChange.bind(this)}
                            />
                            <Button
                                style={{ display: 'block', float: 'left' }}
                                onClick={this.searchClick.bind(this)}
                            >
                                查询
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Table
                            dataSource={newChecks}
                            columns={this.columns}
                            className='foresttables'
                            rowSelection={rowSelection}
                            bordered
                        />
                    </Row>
                </Content>
            </div>
        );
    }

    renderChecks (checkList) {
        let array = [];
        checkList.map(check => {
            let obj = {
                id: check.id,
                created_on:
                    moment(check.created_on)
                        .utc()
                        .date() + '日',
                check_time:
                    check.checkin_record !== null
                        ? this.getCheckTime(check.checkin_record.check_time)
                        : null,
                checkout_time:
                    check.checkout_record !== null
                        ? this.getCheckTime(check.checkout_record.check_time)
                        : null,
                all_time: this.getAllTime(
                    check.checkin_record,
                    check.checkout_record,
                    check.created_on
                ),
                absence_time: this.getAbsenceTime(
                    check.checkin_record,
                    check.checkout_record,
                    check.created_on
                ),
                status: this.getStatus(
                    check.checkin_record,
                    check.checkout_record,
                    check.created_on
                )
            };
            array.push(obj);
        });
        return array;
    }

    getCheckTime (time) {
        return moment(time)
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');
    }
    // 获取在岗时间
    getAllTime (in_record, out_record, created_on) {
        let all_time = '0';
        if (in_record === null || out_record === null) {
            all_time = '0';
        } else {
            let login_time = moment(
                moment(in_record.check_time)
                    .utc()
                    .format('YYYY-MM-DD HH:mm:ss')
            ).valueOf();
            let out_time = moment(
                moment(out_record.check_time)
                    .utc()
                    .format('YYYY-MM-DD HH:mm:ss')
            ).valueOf();
            all_time = this._getTimeText(out_time - login_time);
        }
        return all_time;
    }
    _getTimeText (time_unix) {
        let h_n = 0;
        let m_n = 0;
        h_n = Math.floor(time_unix / 1000 / (60 * 60));
        m_n = Math.round((time_unix - h_n * 60 * 60 * 1000) / 1000 / 60);
        return h_n + '小时' + m_n + '分';
    }
    // 获取缺勤时间
    getAbsenceTime (in_record, out_record, created_on) {
        let on_duty = moment(
            moment(created_on)
                .utc()
                .format('YYYY-MM-DD') +
                ' ' +
                this.state.on_duty
        ).valueOf();
        let off_duty = moment(
            moment(created_on)
                .utc()
                .format('YYYY-MM-DD') +
                ' ' +
                this.state.off_duty
        ).valueOf();
        let time = '';
        if (in_record === null || out_record === null) {
            time = this._getTimeText(off_duty - on_duty);
        } else {
            let login_time = moment(
                moment(in_record.check_time)
                    .utc()
                    .format('YYYY-MM-DD HH:mm:ss')
            ).valueOf();
            let out_time = moment(
                moment(out_record.check_time)
                    .utc()
                    .format('YYYY-MM-DD HH:mm:ss')
            ).valueOf();
            if (out_time - login_time >= off_duty - on_duty) {
                time = this._getTimeText(out_time - login_time);
            } else {
                time = this._getTimeText(
                    off_duty - on_duty - (out_time - login_time)
                );
            }
        }
        return time;
    }
    // 获取当前状态
    getStatus (in_record, out_record, created_on) {
        let on_duty = moment(
            moment(created_on)
                .utc()
                .format('YYYY-MM-DD') +
                ' ' +
                this.state.on_duty
        ).valueOf();
        let off_duty = moment(
            moment(created_on)
                .utc()
                .format('YYYY-MM-DD') +
                ' ' +
                this.state.off_duty
        ).valueOf();
        let status = '';
        if (in_record === null || out_record === null) {
            status = '缺卡';
        } else {
            let login_time = moment(
                moment(in_record.check_time)
                    .utc()
                    .format('YYYY-MM-DD HH:mm:ss')
            ).valueOf();
            let out_time = moment(
                moment(out_record.check_time)
                    .utc()
                    .format('YYYY-MM-DD HH:mm:ss')
            ).valueOf();
            if (on_duty > login_time && off_duty < out_time) {
                status = '正常';
            } else if (on_duty > login_time && off_duty > out_time) {
                status = '早退';
            } else if (on_duty < login_time && off_duty < out_time) {
                status = '迟到';
            } else if (on_duty < login_time && off_duty > out_time) {
                status = '迟到、早退';
            }
        }
        return status;
    }
    columns = [
        {
            title: '日期',
            dataIndex: 'created_on',
            key: 'created_on'
        },
        {
            title: '首次打卡时间',
            dataIndex: 'check_time',
            key: 'check_time'
        },
        {
            title: '末次打卡时间',
            dataIndex: 'checkout_time',
            key: 'checkout_time'
        },
        {
            title: '在岗时间',
            dataIndex: 'all_time',
            key: 'all_time'
        },
        {
            title: '缺勤时间',
            dataIndex: 'absence_time',
            key: 'absence_time'
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status'
        }
    ];
}
