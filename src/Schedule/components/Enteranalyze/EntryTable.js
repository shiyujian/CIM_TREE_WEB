import React, { Component } from 'react';
import { Row, Col, DatePicker, Select, Spin } from 'antd';
import { SumTotal, DateImg } from '../../components';
import moment from 'moment';
import { groupBy } from 'lodash';
var echarts = require('echarts');
const Option = Select.Option;
const { RangePicker } = DatePicker;

export default class EntryTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            amount: 0,
            // 今日进场总数
            today: 0,
            nurserys: 0,
            loading3: false,
            loading4: false,
            loading6: false,
            isOpen: [false, false, false],
            nowmessage: [],
            nowmessagelist: []
        };
    }

    async componentDidMount () {
        const {
            actions: { nowmessage }
        } = this.props;
        this.query();
        // 实时种植信息
        let rst = await nowmessage();
        if (rst && rst.content) {
            this.setState({
                nowmessagelist: rst.content
            });
        }
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
            actions: { getTotalSat, gettreetype },
            leftkeycode
        } = this.props;
        this.setState({
            loading3: true,
            loading4: true,
            loading6: true
        });

        // 获取当前种树信息
        let postdata = {
            statType: 'nursery',
            section: leftkeycode
        };
        let amount = await getTotalSat({}, postdata);

        // 今日入场数
        let today = 0;
        let params = {
            stime: moment().format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            no: leftkeycode
        };
        let rst = await gettreetype({}, params);
        if (rst && rst instanceof Array) {
            rst.map(item => {
                if (item && item.Section) {
                    today = today + item.Num;
                }
            });
        }

        this.setState({
            loading3: false,
            loading4: false,
            loading6: false,
            amount,
            today
        });
    }

    render () {
        let { amount } = this.state;

        return (
            <div>
                <div style={{display: 'flex'}}>
                    <Spin spinning={this.state.loading3}>
                        <SumTotal
                            search={this.searchSum(0)}
                            title='苗木累计进场总数'
                        >
                            <div>{amount}</div>
                        </SumTotal>
                    </Spin>
                    <Spin spinning={this.state.loading4}>
                        <SumTotal
                            search={this.searchSum(1)}
                            title='苗木今日进场总数'
                        >
                            <div>{this.state.today}</div>
                        </SumTotal>
                    </Spin>
                    <Spin spinning={this.state.loading6}>
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
                    </Spin>
                </div>
            </div>
        );
    }

    searchSum (index) {
        return (
            <div key={index}>
                <div
                    style={{ cursor: 'pointer' }}
                    onClick={this.handleIsOpen.bind(this, index)}
                >
                    <img style={{ height: '36px' }} src={DateImg} />
                </div>
            </div>
        );
    }

    // 点击图片出现日期选择
    handleIsOpen (index) {
        this.state.isOpen[index] = !this.state.isOpen[index];
        this.setState({
            isOpen: this.state.isOpen
        });
    }
}
