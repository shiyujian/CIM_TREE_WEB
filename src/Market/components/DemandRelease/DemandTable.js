import React, { Component } from 'react';
import { Table, Card, Row, Col } from 'antd';
import Filter from './Filter';
import './DemandTable.less';
export default class DemandTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            datasource: [1]
        };
    }

    componentDidMount () {}
    render () {
        const {
            datasource
        } = this.state;
        const {
            addDemandModalVisible
        } = this.props;
        let display = 'block';
        if (addDemandModalVisible) {
            display = 'none'
        }
        return (
            <div style={{display: display, padding: '0 20px'}}>
                <Filter {...this.props} {...this.state} />
                <div>
                    {
                        datasource.map((data, index) => {
                            return (
                                <Card title='card' key='1' className='menu'>
                                    <Row className='DemandTable-span-display'>
                                        <Col span={24}>
                                            <span className='DemandTable-card-span'>测试</span>
                                            <span>报价中</span>
                                        </Col>
                                    </Row>
                                    <Row className='DemandTable-card-layout'>
                                        <Col span={6}>
                                            <p>
                                                <span>报价起止时间:</span>
                                            </p>
                                            <p>
                                                <span>用苗地：</span>
                                            </p>
                                            <p>
                                                <span>采购品种：</span>
                                            </p>
                                            <p>
                                                <span>联系方式：</span>
                                            </p>
                                        </Col>
                                        <Col span={6}>
                                            sssssssssssss
                                        </Col>
                                        <Col span={6}>
                                            ddddddddd
                                        </Col>
                                    </Row>
                                </Card>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}
