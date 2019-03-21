import React, {Component} from 'react';
import moment from 'moment';
import './index.less';
import DataOverviewByUser from './DataOverviewByUser';
export default class AccountPandect extends Component {
    constructor (props) {
        super(props);
        this.state = {
            NewUser: 0, // 累计注册账号总数
            ActiveUser: 0, // 日最高活跃账号数
            MaxUserNum: 0, // 今日用户活跃度
            UserNum: 0
        };
    }
    componentDidMount = async () => {
        const {
            actions: {
                getUserStat
            }
        } = this.props;
        let userStat = await getUserStat();
        let NewUser = (userStat && userStat.NewNum) || 0;
        let ActiveUser = (userStat && userStat.ActiveNum) || 0;
        let MaxUserNum = (userStat && userStat.MaxUserNum) || 0;
        let UserNum = (userStat && userStat.UserNum) || 0;
        this.setState({
            NewUser,
            ActiveUser,
            MaxUserNum,
            UserNum
        });
    }

    render () {
        const {
            NewUser,
            ActiveUser,
            MaxUserNum,
            UserNum
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
                            <tbody>
                                <tr>
                                    <td className='UserAnalysis-table-border'>
                                        <div className='UserAnalysis-table-pad'>
                                            <div className='UserAnalysis-table-title'>
                                        累计注册账户总数
                                            </div>
                                            <div className='UserAnalysis-table-num'>
                                                {UserNum}
                                            </div>
                                        </div>
                                    </td>
                                    {/* <td className='UserAnalysis-table-border'>
                                        <div className='UserAnalysis-table-pad'>
                                            <div className='UserAnalysis-table-title'>
                                        日最高活跃账户数
                                            </div>
                                            <div className='UserAnalysis-table-num'>
                                                {MaxUserNum}
                                            </div>
                                        </div>
                                    </td> */}
                                    <td className='UserAnalysis-table-border'>
                                        <div className='UserAnalysis-table-pad'>
                                            <div className='UserAnalysis-table-title'>
                                        当前用户活跃度
                                            </div>
                                            <div className='UserAnalysis-table-num'>
                                                {ActiveUser}
                                            </div>
                                        </div>
                                    </td>
                                    <td className='UserAnalysis-table-border'>
                                        <div className='UserAnalysis-table-pad'>
                                            <div className='UserAnalysis-table-title'>
                                        今日用户新增度
                                            </div>
                                            <div className='UserAnalysis-table-num'>
                                                {NewUser}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
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
