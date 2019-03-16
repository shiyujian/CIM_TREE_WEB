import React, { Component } from 'react';
import { Card, Row, Col, List, Form, Select, Button } from 'antd';
import PlantThinClass from './PlantThinClass'
import PlantSmallClass from './PlantSmallClass'
import PlantSection from './PlantSection'
import PlantTotal from './PlantTotal'
const CardStyle = {
    background: '#ECECEC',
    padding: '15px'
};
class PositionProgress extends Component {
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
                            <PlantThinClass {...this.state} {...this.props} />
                        </Col>
                        <Col span={12}>
                            <PlantSmallClass {...this.state} {...this.props} />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <PlantSection {...this.state} {...this.props} />
                        </Col>
                        <Col span={12}>
                            <PlantTotal {...this.state} {...this.props} />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default PositionProgress;
