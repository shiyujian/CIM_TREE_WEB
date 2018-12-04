import React, {Component} from 'react';
import { Card, Row, Col } from 'antd';
import moment from 'moment';
import './index.less';
import DataOverviewByUser from './DataOverviewByUser';

export default class DataOverview extends Component {
    constructor (props) {
        super(props);
        this.state = {
            NewUser: 0,
            ActiveUser: 0,
            SessionCount: 0,
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
        console.log('realTimeUserData', realTimeUserData);
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
