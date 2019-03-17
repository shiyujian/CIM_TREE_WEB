import React, { Component } from 'react';
import { Card, Row, Col, DatePicker, Spin } from 'antd';
import moment from 'moment';
import '../index.less';
const dateFormat = 'YYYY-MM-DD';
class PlantProgress extends Component {
    constructor (props) {
        super(props);
        this.state = {
            spinningEnter: false,
            spinningReturn: false,
            leftkeycode: '' // 项目code
        };
        this.sectionList = []; // 标段列表
        this.leftkeycode = ''; // 项目code
        this.handleDate = this.handleDate.bind(this);
    }
    componentDidMount = async () => {

    }
    componentWillReceiveProps = async (nextProps) => {
    }

    render () {
        const { enterDate, returnDate, spinningEnter, spinningReturn } = this.state;
        return (
            <div>
                22
            </div>
        );
    }
    handleDate () {

    }
}

export default PlantProgress;
