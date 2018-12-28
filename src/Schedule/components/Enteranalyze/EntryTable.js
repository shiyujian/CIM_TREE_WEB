import React, { Component } from 'react';
import { Spin } from 'antd';
import { SumTotal, DateImg } from '../../components';
import moment from 'moment';

export default class EntryTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            amount: 0,
            // 今日进场总数
            today: 0,
            nurserys: 0,
            loading1: false,
            loading2: false,
            loading3: false,
            isOpen: [false, false, false],
            nowmessage: [],
            nowmessagelist: []
        };
    }

    async componentDidMount () {
        const {
            actions: { nowmessage }
        } = this.props;
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
        if (leftkeycode !== prevProps.leftkeycode) {
            this.query();
        }
    }

    async query () {
        const {
            actions: { getTotalSat, gettreetype },
            leftkeycode
        } = this.props;
        this.setState({
            loading1: true,
            loading2: true,
            loading3: true
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
            loading1: false,
            loading2: false,
            loading3: false,
            amount,
            today
        });
    }

    render () {
        let { amount } = this.state;

        return (
            <div>
                <div style={{display: 'flex'}}>
                    <Spin spinning={this.state.loading1}>
                        <SumTotal
                            search={this.searchSum(0)}
                            title='苗木累计进场总数'
                        >
                            <div>{amount}</div>
                        </SumTotal>
                    </Spin>
                    <Spin spinning={this.state.loading2}>
                        <SumTotal
                            search={this.searchSum(1)}
                            title='苗木今日进场总数'
                        >
                            <div>{this.state.today}</div>
                        </SumTotal>
                    </Spin>
                    <Spin spinning={this.state.loading3}>
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
