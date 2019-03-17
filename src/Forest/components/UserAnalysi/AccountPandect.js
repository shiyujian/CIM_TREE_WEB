import React, {Component} from 'react';
import { Card, Row, Col } from 'antd';
import moment from 'moment';
import './index.less';
import DataOverviewByUser from './DataOverviewByUser';
const gridStyle = {
    width: '25%',
    textAlign: 'center'
};
export default class AccountPandect extends Component {
    constructor (props) {
        super(props);
        this.state = {
            NewUser: 0, // 累计注册账号总数
            ActiveUser: 0, // 日最高活跃账号数
            SessionCount: 0, // 今日用户活跃度
            TotalUser: 0
        };
    }
    componentDidMount = async () => {
        const {
            actions: {
                getTencentRealTimeUser
            }
        } = this.props;
        let realTimeUserData = await getTencentRealTimeUser();
        if (realTimeUserData && realTimeUserData.ret_msg && realTimeUserData.ret_msg === 'success') {
            let data = realTimeUserData && realTimeUserData.ret_data;
            let NewUser = data && data.NewUser;
            let ActiveUser = data && data.ActiveUser;
            let SessionCount = data && data.SessionCount;
            this.setState({
                NewUser,
                ActiveUser,
                SessionCount
            });
        }
    }

    render () {
        const {
            NewUser,
            ActiveUser,
            SessionCount
        } = this.state;
        return (
            <div>
                <div>
                    <h2>实时数据{moment().format('HH:mm:ss')}</h2>
                </div>
                {/* <Card title='关键指标'>
                    <Card.Grid style={gridStyle}>
                        <h3>累计注册账号总数</h3>
                        <div>{NewUser}</div>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                        <h3>日最高活跃账号数</h3>
                        <div>{NewUser}</div>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                        <h3>今日用户活跃度</h3>
                        <div>{NewUser}</div>
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>
                        <h3>今日用户新增度</h3>
                        <div>{NewUser}</div>
                    </Card.Grid>
                </Card> */}
                <div className='UserAnalysis-mod_basic'>
                    <div className='UserAnalysis-mod-title'>
                        <h3 className='UserAnalysis-mod-title-h3'>关键指标</h3>
                    </div>
                    <div className='UserAnalysis-table-content'>
                        <table className='UserAnalysis-table-layout'>
                            <tr>
                                <td className='UserAnalysis-table-border'>
                                    <div className='UserAnalysis-table-pad'>
                                        <div className='UserAnalysis-table-title'>
                                        新增用户
                                        </div>
                                        <div className='UserAnalysis-table-num'>
                                            {NewUser}
                                        </div>
                                    </div>
                                </td>
                                <td className='UserAnalysis-table-border'>
                                    <div className='UserAnalysis-table-pad'>
                                        <div className='UserAnalysis-table-title'>
                                        活跃用户数
                                        </div>
                                        <div className='UserAnalysis-table-num'>
                                            {ActiveUser}
                                        </div>
                                    </div>
                                </td>
                                <td className='UserAnalysis-table-border'>
                                    <div className='UserAnalysis-table-pad'>
                                        <div className='UserAnalysis-table-title'>
                                        启动次数
                                        </div>
                                        <div className='UserAnalysis-table-num'>
                                            {SessionCount}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div style={{marginTop: 15}}>
                    <h2>历史趋势</h2>
                </div>
                <div className='UserAnalysis-mod_basic'>
                    <DataOverviewByUser {...this.props} {...this.state} />
                </div>
            </div>
        );
    }
}
