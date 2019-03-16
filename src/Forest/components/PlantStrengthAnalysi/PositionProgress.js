import React, { Component } from 'react';
import { Card, Row, Col, List, Form, Select, Button } from 'antd';
import ProgressThinClass from './ProgressThinClass'
import ProgressSmallClass from './ProgressSmallClass'
import '../index.less';
const titleStyle = {
    float: 'left',
    marginRight: 20
};
const CardStyle = {
    background: '#ECECEC',
    padding: '15px'
};
class PlantProgress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leftkeycode: '', // 项目code
        };
    }
    componentDidMount = async () => {
    }
    componentWillReceiveProps = async (nextProps) => {
    }

    render() {
        return (
            <div>
                <div style={CardStyle}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <ProgressSmallClass {...this.state} {...this.props} />
                        </Col>
                        <Col span={12}>
                            <ProgressThinClass {...this.state} {...this.props} />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default PlantProgress;
