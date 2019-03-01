import React, {Component} from 'react';
import { Card, Row, Col } from 'antd';
import moment from 'moment';

export default class VehicleAnalysi extends Component {
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
    }

    render () {
        const {
            NewUser,
            ActiveUser,
            SessionCount
        } = this.state;
        return (
            <div>
                hh
            </div>
        );
    }
}
