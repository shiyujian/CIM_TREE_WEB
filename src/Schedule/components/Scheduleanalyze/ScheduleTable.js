import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select, Row, Col, DatePicker, Spin } from 'antd';
import moment from 'moment';
import {
    Main,
    Aside,
    Body,
    Sidebar,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import { Cards, SumTotal, DateImg } from '../../components';
import { groupBy } from 'lodash';
var echarts = require('echarts');
const { RangePicker } = DatePicker;
const Option = Select.Option;

export default class ScheduleTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            amount: 0,
            today: 0,
            total: 0,
            loading5: false,
            loading6: false,
            loading7: false,
            isShow: true,
            isOpen: [false, false, false],
            nowmessage: {
                CreateTime: '',
                Factory: '',
                nowmessage: '',
                nowmessage: '',
                TreeTypeObj: { TreeTypeName: '' }
            },
            nowmessagelist: []
        };
    }

    async componentDidMount () {
        const {
            actions: {
                nowmessage,
            }
        } = this.props;
        this.query();

        // 实时种植信息
        let message = await nowmessage();

        console.log(message, '实时种植信息');
        let nowmessagelist = [];
        if (message && message.content) {
            nowmessagelist = message.content;
        }

        this.setState({
            nowmessagelist: nowmessagelist
        });

        // sxm:编码 或顺序码  可选
        // no:正式编码 可选
        // section：标段 可选
        // land：地块  可选
        // region：区域  可选
        // smallclass：小班  可选
        // thinclass：细班  可选
        // treetype：树类型  可选
        // status：状态 -1:未确认 0：监理通过 业主未抽查  1：监理不通过  2：监理通过业主抽查未通过  3：监理通过 业主抽查通过
        // stime：验收时间 开始时间
        // etime：验收时间 结束时间
        // page：页码，选填
        // size：每页数量，选填
    }

    async componentDidUpdate (prevProps, prevState) {
        const { leftkeycode } = this.props;
        // 地块修改，则修改标段
        if (leftkeycode != prevProps.leftkeycode) {
            this.query();
        }
    }

    async query () {
        const {
            actions: { getTotalSat, gettreetypeAll, gettreetypeSection },
            leftkeycode
        } = this.props;
        this.setState({
            loading5: true,
            loading6: true,
            loading7: true
        });

        let postdata = {
            statType: 'tree',
            section: leftkeycode
        };
        // 获取当前种树信息
        let amount = await getTotalSat({}, postdata);
        console.log(amount, '种树信息');
        this.setState({});

        // 今日种植棵数
        let params = {
            stime: moment().format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            no: leftkeycode
        };
        let rst = await gettreetypeAll({}, params);
        let today = 0;
        if (rst && rst instanceof Array) {
            rst.map(item => {
                today = today + item.Num;
            });
        }

        // 一共需要种植棵数
        let total = 0;
        // 获取所有需要种植的总数
        let totalTrees = await gettreetypeSection({}, { no: leftkeycode });
        if (totalTrees && totalTrees instanceof Array) {
            totalTrees.map(tree => {
                total = tree.Complete + tree.UnComplete + total;
            });
        }
        this.setState({
            amount,
            today: today,
            total: total,
            loading5: false,
            loading6: false,
            loading7: false
        });
    }

    render () {
        const { amount, today, total, isShow } = this.state;
        let asd = this.state.nowmessage;
        let score;
        if (isShow) {
            if (amount === 0 && total === 0) {
                score = '0.0%';
            } else {
                score = ((amount / total) * 100).toFixed(1) + '%';
            }
        } else {
            score = amount + '/' + total;
        }
        return (
            <div>
                <Row gutter={10} style={{ margin: '5px 5px 20px 5px' }}>
                    <Col span={5}>
                        <Spin spinning={this.state.loading5}>
                            <SumTotal
                                search={this.searchSum(0)}
                                title='苗木累计种植总数'
                                title1='Total number of planted trees'
                            >
                                <div>{this.state.amount}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={5}>
                        <Spin spinning={this.state.loading6}>
                            <SumTotal
                                search={this.searchSum(1)}
                                title='苗木今日种植总数'
                                title1='Total number of planted trees today'
                            >
                                <div>{this.state.today}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={5}>
                        <Spin spinning={this.state.loading7}>
                            <SumTotal
                                search={this.searchSum(2)}
                                title='种植完工率'
                                title1='Plant completion rate'
                            >
                                <div
                                    onClick={this.handleclick.bind(this)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {this.state.isShow ? (
                                        <div className='per'>{score}</div>
                                    ) : (
                                        <div
                                            className='score'
                                            style={{ fontSize: '20px' }}
                                        >
                                            {score}
                                        </div>
                                    )}
                                </div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={6}>
                        <div
                            className='nowmessage'
                            style={{ border: '1px solid #666' }}
                        >
                            <div>实时种植信息</div>
                            <div>
                                {this.state.nowmessagelist.map(
                                    (item, index) => (
                                        <div key={item.ID}>
                                            <span>
                                                {item.CreateTime}
                                                {item.Factory}
                                                {item.Inputer}
                                                录入
                                                {item.TreeTypeObj.TreeTypeName}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
    // 点击切换百分比和分数
    handleclick () {
        this.setState({
            isShow: !this.state.isShow
        });
    }
    // 点击图片出现日期选择
    handleIsOpen (index) {
        this.state.isOpen[index] = !this.state.isOpen[index];
        this.setState({
            isOpen: this.state.isOpen
        });
    }

    searchSum (index) {
        return (
            <div>
                <div
                    style={{ cursor: 'pointer' }}
                    onClick={this.handleIsOpen.bind(this, index)}
                >
                    <img style={{ height: '36px' }} src={DateImg} />
                </div>
            </div>
        );
    }
}
