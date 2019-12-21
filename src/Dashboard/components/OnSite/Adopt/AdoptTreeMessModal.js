import React, { Component } from 'react';
import { Button, Modal, Form, Row, Col, Spin } from 'antd';
import './AdoptTreeMess.less';
import moment from 'moment';
import defaultTreeImg from './AdoptImg/defaultTree.jpg';
import defaultUserImg from './AdoptImg/defaultUser.png';
import closeImg from './AdoptImg/close.png';

class AdoptTreeMessModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            curingData: []
        };
    }

    componentDidMount = async () => {

    };

    handleTreeModalCancel = async () => {
        await this.props.onCancel();
    }

    handleTypeData = (type, curingTypeData) => {
        let times = 0;
        for (let i in curingTypeData) {
            if (i === type && curingTypeData[i]) {
                times = curingTypeData[i];
            }
        }
        return times;
    }

    handleCuringMess = () => {
        const {
            curingMess
        } = this.props;
        if (curingMess && curingMess instanceof Array && curingMess.length > 0) {
            let curingType = [];
            let curingTimes = [];
            let curingData = [];
            let curingTypeData = {};
            for (let i = 0; i < curingMess.length; i++) {
                let data = curingMess[i];
                let typeName = data.typeName;
                if (curingType.indexOf(typeName) === -1) {
                    curingType.push(typeName);
                    curingTimes[typeName] = 1;

                    curingTypeData[typeName] = curingTimes[typeName];
                } else {
                    curingTimes[typeName] = curingTimes[typeName] + 1;
                    curingTypeData[typeName] = curingTimes[typeName];
                }
                if (i < 3) {
                    curingData.push(data);
                }
            }
            let curingObject = {
                curingTypeData,
                curingData
            };
            return curingObject;
        }
    }

    render () {
        const {
            seedlingMess,
            treeMess,
            adoptTreeMess,
            adoptTreeModalLoading,
            curingMess
        } = this.props;
        let curingObject = this.handleCuringMess();
        let curingTypeData = (curingObject && curingObject.curingTypeData) || {};
        let curingData = (curingObject && curingObject.curingData) || [];

        let name = '';
        try {
            if (adoptTreeMess && adoptTreeMess.Aadopter) {
                let data = adoptTreeMess.Aadopter.split('#');
                name = data[0];
            }
        } catch (e) {

        }
        return (
            <Modal
                title={null}
                visible
                footer={null}
                width={900}
                closable={false}
                wrapClassName={'web'}
                maskClosable={false}
                onOk={this.handleTreeModalCancel.bind(this)}
                onCancel={this.handleTreeModalCancel.bind(this)}
            >
                <Spin spinning={adoptTreeModalLoading}>
                    <div className='adoptTreeMess-background'>
                        <img src={closeImg}
                            onClick={this.handleTreeModalCancel.bind(this)}
                            className='adoptTreeMess-modal-closeImg' />
                        <Row className='adoptTreeMess-modal-top-layout'>
                            <Col span={8} style={{ paddingLeft: 130, paddingTop: 55 }}>
                                <img src={defaultUserImg} style={{width: 72, height: 72}} />
                                <div className='adoptTreeMess-modal-top-name' title={name}>
                                    {/* 恐怖如斯 */}
                                    { name || '.'}
                                </div>
                            </Col>
                            <Col span={8} className='adoptTreeMess-modal-top-adopt' >
                                <div className='adoptTreeMess-modal-top-time'>
                                    {/* 2018-08-30 14:25:31 */}
                                    {adoptTreeMess.AdoptTime ? moment(adoptTreeMess.AdoptTime).format('YYYY-MM-DD HH:mm:ss') : ''}
                                </div>
                            </Col>
                            <Col span={8} style={{ paddingLeft: 98, paddingTop: 55 }}>
                                <img src={defaultTreeImg} style={{width: 72, height: 72}} />
                                <div className='adoptTreeMess-modal-top-name' title={seedlingMess.TreeTypeName ? seedlingMess.TreeTypeName : ''}>
                                    {/* 桀桀桀桀桀桀桀桀桀桀桀桀桀桀 */}
                                    {seedlingMess.TreeTypeName ? seedlingMess.TreeTypeName : '.'}
                                </div>
                            </Col>
                        </Row>

                        <div className='adoptTreeMess-curingTaskType-layout'>
                            <div style={{width: 109.4, textAlign: 'center'}}>
                                <div className='adoptTreeMess-curingTaskTypeName'>
                                排涝
                                </div>
                                <div className='adoptTreeMess-curingTaskTypeNum'>
                                    {this.handleTypeData('排涝', curingTypeData)}
                                </div>
                            </div>
                            <div style={{width: 109.4, textAlign: 'center'}}>
                                <div className='adoptTreeMess-curingTaskTypeName'>
                                其他
                                </div>
                                <div className='adoptTreeMess-curingTaskTypeNum'>
                                    {this.handleTypeData('其他', curingTypeData)}
                                </div>
                            </div>
                            <div style={{width: 109.4, textAlign: 'center'}}>
                                <div className='adoptTreeMess-curingTaskTypeName'>
                                病虫害防治
                                </div>
                                <div className='adoptTreeMess-curingTaskTypeNum'>
                                    {this.handleTypeData('病虫害防治', curingTypeData)}
                                </div>
                            </div>
                            <div style={{width: 109.4, textAlign: 'center'}}>
                                <div className='adoptTreeMess-curingTaskTypeName'>
                                修剪
                                </div>
                                <div className='adoptTreeMess-curingTaskTypeNum'>
                                    {this.handleTypeData('修剪', curingTypeData)}
                                </div>
                            </div>
                            <div style={{width: 109.4, textAlign: 'center'}}>
                                <div className='adoptTreeMess-curingTaskTypeName'>
                                除草
                                </div>
                                <div className='adoptTreeMess-curingTaskTypeNum'>
                                    {this.handleTypeData('除草', curingTypeData)}
                                </div>
                            </div>
                            <div style={{width: 109.4, textAlign: 'center'}}>
                                <div className='adoptTreeMess-curingTaskTypeName'>
                                施肥
                                </div>
                                <div className='adoptTreeMess-curingTaskTypeNum'>
                                    {this.handleTypeData('施肥', curingTypeData)}
                                </div>
                            </div>
                            <div style={{width: 109.4, textAlign: 'center'}}>
                                <div className='adoptTreeMess-curingTaskTypeName'>
                                浇水
                                </div>
                                <div className='adoptTreeMess-curingTaskTypeNum'>
                                    {this.handleTypeData('浇水', curingTypeData)}
                                </div>
                            </div>
                        </div>
                        <Row className='adoptTreeMess-message-layout'>
                            <Col span={12} style={{paddingRight: 5}}>
                                <div className='adoptTreeMess-mrg10'>
                                    {/* <img src={codeImg} style={{marginRight: 10}} /> */}
                                    <span className='adoptTreeMess-lineTitle'>苗木编码</span>
                                    <span className='adoptTreeMess-modal-data-text'>
                                        {/* abn2017 */}
                                        {adoptTreeMess.SXM ? adoptTreeMess.SXM : ''}
                                    </span>
                                </div>
                                <div className='adoptTreeMess-mrg10'>
                                    {/* <img src={productLocationImg} style={{marginRight: 10}} /> */}
                                    <span className='adoptTreeMess-lineTitle'>产地</span>
                                    <span className='adoptTreeMess-modal-data-text'>
                                        {/* 定州市大辛庄某某村 */}
                                        {seedlingMess.TreePlace ? seedlingMess.TreePlace : ''}
                                    </span>
                                </div>
                                <div className='adoptTreeMess-mrg10'>
                                    {/* <img src={liftTimeImg} style={{marginRight: 10}} /> */}
                                    <span className='adoptTreeMess-lineTitle'>起苗时间</span>
                                    <span className='adoptTreeMess-modal-data-text'>
                                        {/* 2018-01-01 12:00:00 */}
                                        {seedlingMess.LifterTime ? seedlingMess.LifterTime : ''}
                                    </span>
                                </div>
                                <div className='adoptTreeMess-mrg10'>
                                    {/* <img src={treeLocationImg} style={{marginRight: 10}} /> */}
                                    <span className='adoptTreeMess-lineTitle'>栽植定位</span>
                                    <span className='adoptTreeMess-modal-data-text'
                                        title={treeMess.landName ? `${treeMess.landName} - ${treeMess.sectionName} - ${treeMess.SmallClass} - ${treeMess.ThinClass}` : ''}>
                                        {/* 九号地块 - 5标段 - 014号小班 - 041号细班 */}
                                        {treeMess.landName ? `${treeMess.landName} - ${treeMess.sectionName} - ${treeMess.SmallClass} - ${treeMess.ThinClass}` : ''}
                                    </span>
                                </div>
                            </Col>
                            <Col span={12} style={{paddingLeft: 5}}>
                                <div className='adoptTreeMess-mrg20'>
                                    {/* <img src={curingTaskMessImg} style={{marginRight: 10, marginTop: 2}} /> */}
                                    <span className='adoptTreeMess-lineTitle'>近三次养护详情</span>
                                </div>
                                {
                                    curingData.map((data, index) => {
                                        if (data && data.typeName && data.typeName !== '补植' && index < 3) {
                                            return (
                                                <div className='adoptTreeMess-mrg20' key={data.ID}>
                                                    <span className='adoptTreeMess-table-type-data'
                                                        style={{marginRight: 15}} >
                                                        {data.typeName ? data.typeName : ''}
                                                    </span>
                                                    <span className='adoptTreeMess-table-person-data'
                                                        title={data.CuringMans ? data.CuringMans : ''}
                                                        style={{marginRight: 20}} >
                                                        {data.CuringMans ? data.CuringMans : ''}
                                                    </span>
                                                    <span className='adoptTreeMess-table-time-data'>
                                                        {data.StartTime && data.EndTime ? moment(data.StartTime).format('YYYY-MM-DD HH:mm') + ' ~ ' + moment(data.EndTime).format('YYYY-MM-DD HH:mm') : ''}
                                                    </span>
                                                </div>
                                            );
                                        }
                                    })
                                }
                                {/* <div className='adoptTreeMess-mrg20'>
                                <span className='adoptTreeMess-table-type-data' style={{marginRight: 15}} >病虫害防治</span>
                                <span className='adoptTreeMess-table-person-data' style={{marginRight: 15}} >啊啊啊啊啊啊啊啊</span>
                                <span className='adoptTreeMess-table-time-data'>2018-01-01 12:00 ~ 2018-01-01 12:00</span>
                            </div>
                            <div className='adoptTreeMess-mrg20'>
                                <span className='adoptTreeMess-table-type-data' style={{marginRight: 15}} >病虫害防治</span>
                                <span className='adoptTreeMess-table-person-data' style={{marginRight: 15}} >啊啊啊啊啊啊啊啊</span>
                                <span className='adoptTreeMess-table-time-data'>2018-01-01 12:00 ~ 2018-01-01 12:00</span>
                            </div>
                            <div className='adoptTreeMess-mrg20'>
                                <span className='adoptTreeMess-table-type-data' style={{marginRight: 15}} >病虫害防治</span>
                                <span className='adoptTreeMess-table-person-data' style={{marginRight: 15}} >啊啊啊啊啊啊啊啊</span>
                                <span className='adoptTreeMess-table-time-data'>2018-01-01 12:00 ~ 2018-01-01 12:00</span>
                            </div> */}
                            </Col>
                        </Row>
                    </div>
                </Spin>
            </Modal>

        );
    }
}
export default Form.create()(AdoptTreeMessModal);
