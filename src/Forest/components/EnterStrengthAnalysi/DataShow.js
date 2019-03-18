import React, {Component} from 'react';
import { Spin } from 'antd';
import moment from 'moment';
import { SumTotal } from '../../components';

export default class DataShow extends Component {
    constructor (props) {
        super(props);
        this.state = {
            amount: 0,
            today: 0,
            plantAmount: 0,
            plantToday: 0,
            nowmessagelist: [],
            loading1: false,
            loading2: false,
            loading3: false,
            loading4: false,
            loading5: false
        };
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            queryTime
        } = this.props;
        // 因搜索条件处在项目改变后，会进行搜索，改变queryTime的值， 所以不需要对项目进行监控
        if (queryTime && queryTime !== prevProps.queryTime) {
            await this.query();
        }
    }
    async query () {
        const {
            actions: { getTotalSat, getTreeEntrance, getCount, getqueryTree },
            leftkeycode,
            section
        } = this.props;
        this.setState({
            loading1: true,
            loading2: true,
            loading3: true,
            loading4: true,
            loading5: true
        });

        // 获取当前种树信息
        let getTotalSatNurseryPostdata = {
            statType: 'nursery',
            section: section || leftkeycode
        };
        let amount = await getTotalSat({}, getTotalSatNurseryPostdata);

        // 获取当前种树信息
        let getTotalSatTreePostdata = {
            statType: 'tree',
            section: section || leftkeycode
        };
        let plantAmount = await getTotalSat({}, getTotalSatTreePostdata);

        // 今日入场数
        let today = 0;
        let gettreeEntrancePostData = {
            stime: moment().format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            no: section || leftkeycode
        };
        let rst = await getTreeEntrance({}, gettreeEntrancePostData);
        if (rst && rst instanceof Array) {
            rst.map(item => {
                if (item && item.Section) {
                    today = today + item.Num;
                }
            });
        }
        let getCountPostData = {
            stime: moment().format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            no: leftkeycode
        };
        // 今日种植棵数
        let rst2 = await getCount({}, getCountPostData);
        let plantToday = 0;
        if (rst2 && rst2 instanceof Array) {
            if (section) {
                rst2.map(item => {
                    if (item.Section === section) {
                        plantToday = item.Num;
                    }
                });
            } else {
                rst2.map(item => {
                    plantToday = plantToday + item.Num;
                });
            }
        }
        // 实时种植信息
        let getqueryTreePostData = {
            page: 1,
            size: 5,
            no: leftkeycode,
            section: section
        };
        let message = await getqueryTree({}, getqueryTreePostData);

        let nowmessagelist = [];
        if (message && message.content) {
            nowmessagelist = message.content;
        }
        this.setState({
            loading1: false,
            loading2: false,
            loading3: false,
            loading4: false,
            loading5: false,
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
            loading1,
            loading2,
            loading3,
            loading4,
            loading5
        } = this.state;

        return (
            <div>
                <div style={{display: 'flex'}}>
                    <Spin spinning={loading1}>
                        <SumTotal
                            title='苗木累计进场总数'
                        >
                            <div>{amount}</div>
                        </SumTotal>
                    </Spin>
                    <Spin spinning={loading2}>
                        <SumTotal
                            title='苗木今日进场总数'
                        >
                            <div>{today}</div>
                        </SumTotal>
                    </Spin>
                    <Spin spinning={loading3}>
                        <SumTotal
                            title='苗木累计种植总数'
                        >
                            <div>{plantAmount}</div>
                        </SumTotal>
                    </Spin>
                    <Spin spinning={loading4}>
                        <SumTotal
                            title='苗木今日种植总数'
                        >
                            <div>{plantToday}</div>
                        </SumTotal>
                    </Spin>
                    <Spin spinning={loading5}>
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
