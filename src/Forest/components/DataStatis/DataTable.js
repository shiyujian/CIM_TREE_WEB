import React, {Component} from 'react';
import { Spin } from 'antd';
import moment from 'moment';
import { SumTotal } from '../../components';

export default class DataTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            amount: 0,
            today: 0,
            plantAmount: 0,
            plantToday: 0,
            nowmessagelist: [],
            loading3: false,
            loading4: false,
            loading5: false,
            loading6: false,
            loading7: false
        };
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            leftkeycode,
            queryTime,
            section
        } = this.props;
        if (leftkeycode && leftkeycode !== prevProps.leftkeycode) {
            await this.query();
        }
        if (queryTime && queryTime !== prevProps.queryTime) {
            // if (section && section !== prevProps.section) {
            await this.query();
            // }
        }
    }
    async query () {
        const {
            actions: { getTotalSat, gettreeEntrance, getCount, getqueryTree },
            leftkeycode,
            section
        } = this.props;
        this.setState({
            loading3: true,
            loading4: true,
            loading5: true,
            loading6: true,
            loading7: true
        });

        // 获取当前种树信息
        let postdata = {
            statType: 'nursery',
            section: section || leftkeycode
        };
        let amount = await getTotalSat({}, postdata);

        // 获取当前种树信息
        let postdata2 = {
            statType: 'tree',
            section: section || leftkeycode
        };
        let plantAmount = await getTotalSat({}, postdata2);

        // 今日入场数
        let today = 0;
        let params = {
            stime: moment().format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            no: section || leftkeycode
        };
        let rst = await gettreeEntrance({}, params);
        if (rst && rst instanceof Array) {
            rst.map(item => {
                if (item && item.Section) {
                    today = today + item.Num;
                }
            });
        }
        // 今日种植棵数
        let rst2 = await getCount({}, params);
        let plantToday = 0;
        if (rst2 && rst2 instanceof Array) {
            rst2.map(item => {
                plantToday = plantToday + item.Num;
            });
        }
        // 实时种植信息
        let postdata3 = {
            page: 1,
            size: 5,
            no: leftkeycode,
            section: section
        };
        let message = await getqueryTree({}, postdata3);

        let nowmessagelist = [];
        if (message && message.content) {
            nowmessagelist = message.content;
        }
        this.setState({
            loading3: false,
            loading4: false,
            loading5: false,
            loading6: false,
            loading7: false,
            amount,
            today,
            plantAmount: plantAmount,
            plantToday,
            nowmessagelist: nowmessagelist
        });
    }
    render () {
        const {
            amount,
            today,
            plantAmount,
            plantToday,
            nowmessagelist,
            loading3,
            loading4,
            loading5,
            loading6,
            loading7
        } = this.state;

        return (
            <div>
                <div style={{display: 'flex'}}>
                    <Spin spinning={loading3}>
                        <SumTotal
                            title='苗木累计进场总数'
                        >
                            <div>{amount}</div>
                        </SumTotal>
                    </Spin>
                    <Spin spinning={loading4}>
                        <SumTotal
                            title='苗木今日进场总数'
                        >
                            <div>{today}</div>
                        </SumTotal>
                    </Spin>
                    <Spin spinning={loading5}>
                        <SumTotal
                            title='苗木累计种植总数'
                        >
                            <div>{plantAmount}</div>
                        </SumTotal>
                    </Spin>
                    <Spin spinning={loading6}>
                        <SumTotal
                            title='苗木今日种植总数'
                        >
                            <div>{plantToday}</div>
                        </SumTotal>
                    </Spin>
                    <Spin spinning={loading7}>
                        <div
                            className='nowmessage'
                            style={{ border: '1px solid #666' }}
                        >
                            <div>实时种植信息</div>
                            <div>
                                {nowmessagelist.map(
                                    (item, index) => (
                                        <div key={item.ID}>
                                            <span>
                                                {item.CreateTime}
                                                    录入
                                                {item.TreeTypeObj.TreeTypeName}
                                                ({item.ZZBM})
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
}
