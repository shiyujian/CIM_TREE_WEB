import React, { Component } from 'react';
import { Button, Modal, Form, Row, Col, Input, Tabs } from 'antd';
import './AdoptTreeMess.less';
import adoptImg from './TreeAdoptImg/adopt.png';
import treeImg from './TreeAdoptImg/tree.jpg';
import userImg from './TreeAdoptImg/user.png';
import titleImg from './TreeAdoptImg/title.png';
import lineImg from './TreeAdoptImg/line.png';
import productLocationImg from './TreeAdoptImg/productLocation.png';
import liftTimeImg from './TreeAdoptImg/liftTime.png';
import treeLocationImg from './TreeAdoptImg/treeLocation.png';
import curingTasksImg from './TreeAdoptImg/curingTask.png';
import curingTaskMessImg from './TreeAdoptImg/curingTaskMess.png';

const TabPane = Tabs.TabPane;

class AdoptTreeMessModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            title: ''
        };
    }

    componentDidMount = async () => {
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
    };

    handleTreeModalCancel = async () => {
        await this.props.onCancel();
    }
    //  切换标签页
    tabChange (key) {
    }

    render () {
        const {
            seedlingMess,
            treeMess,
            flowMess,
            curingMess,
            adoptTreeMess
        } = this.props;
        const {
            title
        } = this.state;

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
                            <img src={userImg} style={{width: 100, height: 100}} />
                            <div className='adoptTreeMess-modal-top-name'>
                                牛大虎
                                {/* {adoptTreeMess.Aadopter ? adoptTreeMess.Aadopter : ''} */}
                            </div>
                        </div>
                        <div className='adoptTreeMess-modal-top-adopt' >
                            <img src={adoptImg} />
                            <div className='adoptTreeMess-modal-top-time'>
                                2018-09-18 15:55:15
                                {/* {adoptTreeMess.AdoptTime ? adoptTreeMess.AdoptTime : ''} */}
                            </div>
                        </div>
                        <div>
                            <img src={treeImg} style={{width: 100, height: 100}} />
                            <div className='adoptTreeMess-modal-top-name'>
                                杨柳
                                {/* {seedlingMess.TreeTypeName ? seedlingMess.TreeTypeName : ''} */}
                            </div>
                        </div>
                    </div>
                    <img src={lineImg} style={{marginBottom: 20}} />
                    <div>
                        <div className='adoptTreeMess-mrg10'>
                            <img src={productLocationImg} style={{marginRight: 10}} />
                            <span>苗木编码：</span>
                            <span className='adoptTreeMess-modal-data-text'>
                                wwwwwwwwwwwwww
                                {/* {adoptTreeMess.SXM ? adoptTreeMess.SXM : ''} */}
                            </span>
                        </div>
                        <div className='adoptTreeMess-mrg10'>
                            <img src={productLocationImg} style={{marginRight: 10}} />
                            <span>产地：</span>
                            <span className='adoptTreeMess-modal-data-text'>
                                wwwwwwwwwwwwww
                                {/* {seedlingMess.TreePlace ? seedlingMess.TreePlace : ''} */}
                            </span>
                        </div>
                        <div className='adoptTreeMess-mrg10'>
                            <img src={liftTimeImg} style={{marginRight: 10}} />
                            <span>起苗时间：</span>
                            <span className='adoptTreeMess-modal-data-text'>
                                wwwwwwwwwwwwww
                                {/* {seedlingMess.LifterTime ? seedlingMess.LifterTime : ''} */}
                            </span>
                        </div>
                        <div className='adoptTreeMess-mrg10'>
                            <img src={treeLocationImg} style={{marginRight: 10}} />
                            <span>栽植定位：</span>
                            <span className='adoptTreeMess-modal-data-text'>
                                wwwwwwwwwwwwww
                                {/* {adoptTreeMess.SXM ? adoptTreeMess.SXM : ''} */}
                            </span>
                        </div>
                    </div>
                </div>
            </Modal>

        );
    }
}
export default Form.create()(AdoptTreeMessModal);
