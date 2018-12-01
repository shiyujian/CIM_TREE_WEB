import React, {Component} from 'react';
import { Row, Col, DatePicker, Select, Spin } from 'antd';
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
        };
    }
    async componentDidMount() {
        this.query();
    }
    async query() {
        const {
            actions: { getTotalSat, gettreeEntrance, getCount, gettreetypeSection, getqueryTree },
            leftkeycode
        } = this.props;
        this.setState({
            loading3: true,
            loading4: true,
            loading5: true,
            loading6: true,
        });

        // 获取当前种树信息
        let postdata = {
            statType: 'nursery',
            section: leftkeycode
        };
        let amount = await getTotalSat({}, postdata);
        console.log(amount, '进场总数');

        // 获取当前种树信息
        let postdata2 = {
            statType: 'tree',
            section: leftkeycode
        };
        let plantAmount = await getTotalSat({}, postdata2);
        
        // 今日入场数
        let today = 0;
        let params = {
            stime: moment().format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
            no: leftkeycode
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
        // 一共需要种植棵数
        // let plantTotal = 0;
        // // 获取所有需要种植的总数
        // let totalTrees = await gettreetypeSection({}, { no: leftkeycode });
        // if (totalTrees && totalTrees instanceof Array) {
        //     totalTrees.map(tree => {
        //         plantTotal = tree.Complete + tree.UnComplete + plantTotal;
        //     });
        // }
        // 实时种植信息
        let message = await getqueryTree();

        let nowmessagelist = [];
        if (message && message.content) {
            nowmessagelist = message.content;
        }
        this.setState({
            loading3: false,
            loading4: false,
            loading5: false,
            loading6: false,
            amount,
            today,
            plantAmount: plantAmount,
            plantToday,
            nowmessagelist: nowmessagelist
            // plantTotal: plantTotal,
        });
    }
    render () {
        let { amount, today, plantAmount, plantToday, nowmessagelist, loading3, loading4, loading5, loading6 } = this.state;

        return (
            <div>
                <Row>
                    <Col span={5}>
                        <Spin spinning={loading3}>
                            <SumTotal
                                title='苗木累计进场总数'
                                title1='Total number of nursery stock'
                            >
                                <div>{amount}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={5}>
                        <Spin spinning={loading4}>
                            <SumTotal
                                title='苗木今日进场总数'
                                title1='Total number of nursery stock today'
                            >
                                <div>{today}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={5}>
                        <Spin spinning={loading5}>
                            <SumTotal
                                title='苗木累计种植总数'
                                title1='Total number of planted trees'
                            >
                                <div>{plantAmount}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={5}>
                        <Spin spinning={loading6}>
                            <SumTotal
                                title='苗木今日种植总数'
                                title1='Total number of planted trees today'
                            >
                                <div>{plantToday}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={4}>
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
}
