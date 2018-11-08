import React, { Component } from 'react';
import { Button, Modal, Form, Table } from 'antd';
import './AdoptTreeMess.less';
import moment from 'moment';
import adoptImg from './TreeAdoptImg/adopt.png';
import defaultTreeImg from './TreeAdoptImg/defaultTree.jpg';
import defaultUserImg from './TreeAdoptImg/defaultUser.png';

import titleImg from './TreeAdoptImg/title.png';
import lineImg from './TreeAdoptImg/line.png';
import codeImg from './TreeAdoptImg/code.png';
import productLocationImg from './TreeAdoptImg/productLocation.png';
import liftTimeImg from './TreeAdoptImg/liftTime.png';
import treeLocationImg from './TreeAdoptImg/treeLocation.png';
import curingTasksImg from './TreeAdoptImg/curingTask.png';
import curingTaskMessImg from './TreeAdoptImg/curingTaskMess.png';

class AdoptTreeMessModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            title: '',
            curingTypeData: [],
            curingData: []
        };
        this.curingTypeColumns = [];
        this.curingDataColumns = [
            {
                title: '类型',
                dataIndex: 'typeName',
                key: 'typeName'
            },
            {
                title: '养护人',
                dataIndex: 'CuringMans',
                key: 'CuringMans',
                render: text => <div className='adoptTreeMess-modal-column'><span title={text} href='#'>{text}</span></div>
            },
            {
                title: '开始时间',
                dataIndex: 'StartTime',
                key: 'StartTime',
                render: (text, record, index) => {
                    if (text) {
                        try {
                            text = moment(text).format('YYYY-MM-DD HH:mm:ss');
                            let timeArr = text.split(' ');
                            let time1 = timeArr[0];
                            let time2 = timeArr[1];
                            return (
                                <div style={{textAlign: 'center'}}>
                                    <div>{time1}</div>
                                    <div>{time2}</div>
                                </div>
                            );
                        } catch (e) {
                            console.log('处理时间', e);
                        }
                    } else {
                        return null;
                    }
                }
            },
            {
                title: '结束时间',
                dataIndex: 'EndTime',
                key: 'EndTime',
                render: (text, record, index) => {
                    if (text) {
                        try {
                            text = moment(text).format('YYYY-MM-DD HH:mm:ss');
                            let timeArr = text.split(' ');
                            let time1 = timeArr[0];
                            let time2 = timeArr[1];
                            return (
                                <div style={{textAlign: 'center'}}>
                                    <div>{time1}</div>
                                    <div>{time2}</div>
                                </div>
                            );
                        } catch (e) {
                            console.log('处理时间', e);
                        }
                    } else {
                        return null;
                    }
                }
            }

        ];
    }

    componentDidMount = async () => {
        const {
            curingMess
        } = this.props;
        console.log('curingMess', curingMess);
        let title = [];
        title.push(
            <div style={{display: 'inlineBlock'}}>
                <img src={titleImg} style={{marginRight: 5}} />
                <span className='adoptTreeMess-modal-title'>结缘信息</span>
            </div>
        );
        this.setState({
            title
        });
        if (curingMess && curingMess instanceof Array && curingMess.length > 0) {
            let curingType = [];
            let curingTimes = [];
            let curingData = [];
            for (let i = 0; i < curingMess.length; i++) {
                let data = curingMess[i];
                let typeName = data.typeName;
                if (curingType.indexOf(typeName) === -1) {
                    curingType.push(typeName);
                    this.curingTypeColumns.push({
                        title: typeName,
                        dataIndex: typeName,
                        key: typeName
                    });
                    curingTimes[typeName] = 1;
                } else {
                    curingTimes[typeName] = curingTimes[typeName] + 1;
                }
                if (i < 3) {
                    curingData.push(data);
                }
            }
            let curingTypeData = [curingTimes];
            console.log('curingTypeData', curingTypeData);
            console.log('this.curingTypeColumns', this.curingTypeColumns);
            this.setState({
                curingTypeData,
                curingData
            });
        }
    };

    handleTreeModalCancel = async () => {
        await this.props.onCancel();
    }

    render () {
        const {
            seedlingMess,
            treeMess,
            curingMess,
            adoptTreeMess
        } = this.props;
        const {
            title,
            curingTypeData,
            curingData
        } = this.state;
        let name = '';
        try {
            if (adoptTreeMess && adoptTreeMess.Aadopter) {
                let data = adoptTreeMess.Aadopter.split('#');
                name = data[0];
            }
        } catch (e) {

        }
        let arr = [
            <Button key='back' size='large' onClick={this.handleTreeModalCancel.bind(this)}>
                关闭
            </Button>
        ];
        let footer = arr;
        return (
            <Modal
                title={title}
                visible
                footer={footer}
                width={550}
                onOk={this.handleTreeModalCancel.bind(this)}
                onCancel={this.handleTreeModalCancel.bind(this)}
            >
                <div>
                    <div className='adoptTreeMess-modal-top-layout'>
                        <div>
                            <img src={defaultUserImg} style={{width: 100, height: 100}} />
                            <div className='adoptTreeMess-modal-top-name' title={name}>
                                {name}
                            </div>
                        </div>
                        <div className='adoptTreeMess-modal-top-adopt' >
                            <img src={adoptImg} />
                            <div className='adoptTreeMess-modal-top-time'>
                                {adoptTreeMess.AdoptTime ? moment(adoptTreeMess.AdoptTime).format('YYYY-MM-DD HH:mm:ss') : ''}
                            </div>
                        </div>
                        <div>
                            <img src={defaultTreeImg} style={{width: 100, height: 100}} />
                            <div className='adoptTreeMess-modal-top-name' title={seedlingMess.TreeTypeName ? seedlingMess.TreeTypeName : ''}>
                                {seedlingMess.TreeTypeName ? seedlingMess.TreeTypeName : ''}
                            </div>
                        </div>
                    </div>
                    <img src={lineImg} style={{marginBottom: 20}} />
                    <div>
                        <div className='adoptTreeMess-mrg10'>
                            <img src={codeImg} style={{marginRight: 10}} />
                            <span style={{verticalAlign: 'middle'}}>苗木编码</span>
                            <span className='adoptTreeMess-modal-data-text'>
                                {adoptTreeMess.SXM ? adoptTreeMess.SXM : ''}
                            </span>
                        </div>
                        <div className='adoptTreeMess-mrg10'>
                            <img src={productLocationImg} style={{marginRight: 10}} />
                            <span style={{verticalAlign: 'middle'}}>产地</span>
                            <span className='adoptTreeMess-modal-data-text'>
                                {seedlingMess.TreePlace ? seedlingMess.TreePlace : ''}
                            </span>
                        </div>
                        <div className='adoptTreeMess-mrg10'>
                            <img src={liftTimeImg} style={{marginRight: 10}} />
                            <span style={{verticalAlign: 'middle'}}>起苗时间</span>
                            <span className='adoptTreeMess-modal-data-text'>
                                {seedlingMess.LifterTime ? seedlingMess.LifterTime : ''}
                            </span>
                        </div>
                        <div className='adoptTreeMess-mrg10'>
                            <img src={treeLocationImg} style={{marginRight: 10}} />
                            <span style={{verticalAlign: 'middle'}}>栽植定位</span>
                            <span className='adoptTreeMess-modal-data-text'>
                                {treeMess.landName ? `${treeMess.landName} - ${treeMess.sectionName} - ${treeMess.SmallClass} - ${treeMess.ThinClass}` : ''}
                            </span>
                        </div>
                        <div className='adoptTreeMess-mrg20'>
                            <img src={curingTasksImg} style={{marginRight: 10}} />
                            <span style={{verticalAlign: 'middle'}}>养护任务统计</span>
                        </div>
                        <Table
                            columns={this.curingTypeColumns}
                            dataSource={curingTypeData}
                            bordered
                            pagination={false}
                            style={{marginBottom: 20}}
                        />
                        <div className='adoptTreeMess-mrg20'>
                            <img src={curingTaskMessImg} style={{marginRight: 10}} />
                            <span style={{verticalAlign: 'middle'}}>近三次养护详情</span>
                        </div>
                        <Table
                            columns={this.curingDataColumns}
                            dataSource={curingData}
                            bordered
                            pagination={false}
                            style={{marginBottom: 20}}
                        />
                    </div>
                </div>
            </Modal>

        );
    }
}
export default Form.create()(AdoptTreeMessModal);
