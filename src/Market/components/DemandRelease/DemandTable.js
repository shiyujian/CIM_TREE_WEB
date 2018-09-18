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
            <div style={{display: display}}>
                <Filter {...this.props} {...this.state} />
                <div>
                    {
                        datasource.map((data, index) => {
                            return (
                                <Card title='card' key='1'>
                                    <Row className='DemandTable-span-display'>
                                        <span className='DemandTable-card-span'>测试</span>
                                        <span>报价中</span>
                                    </Row>
                                    <div className='DemandTable-card-layout'>
                                        <div className='DemandTable-card-sub-layout'>
                                            <div className='DemandTable-span-display'>
                                                <span>报价起止时间：</span>
                                            </div>
                                            <div className='DemandTable-span-display'>
                                                <span>用苗地：</span>
                                            </div>
                                            <div className='DemandTable-span-display'>
                                                <span>采购品种：</span>
                                            </div>
                                            <div className='DemandTable-span-display'>
                                                <span>联系方式：</span>
                                            </div>
                                        </div>
                                        <div className='DemandTable-card-sub-layout'>
                                            sssssssssssss
                                        </div>
                                        <div className='DemandTable-card-sub-layout'>
                                            ddddddddd
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}
