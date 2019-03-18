import React, { Component } from 'react';
import { Spin, Modal, Row, Col } from 'antd';
import './index.less'

export default class WordView1 extends Component {
    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    componentDidMount() {
    }

    onOk() {
        this.props.onPressOk(2)
    }

    render() {
        const { detail } = this.props;
        let array = ['', '', '', '']
        if (detail && detail.ThinClass) {
            array = detail.ThinClass.split('-');
        }
        let unit = detail && detail.AcceptanceObj && detail.AcceptanceObj.Land || ''
        let jianli = detail && detail.AcceptanceObj && detail.AcceptanceObj.SupervisorObj.Full_Name || ''
        let shigong = detail && detail.AcceptanceObj && detail.AcceptanceObj.ApplierObj.Full_Name || ''
        return (
            <Spin spinning={this.state.loading}>
                <Modal
                    width={800}
                    visible={this.props.visible}
                    title='放样点穴质量验收记录'
                    onOk={this.onOk.bind(this)}
                    maskClosable={false}
                    onCancel={this.onOk.bind(this)}
                    footer={null}
                >
                    <div className='trrdd'>

                        <table style={{ border: 1 }}>
                            <tbody>
                                <table border="1">
                                    <tr>
                                        <td className='hei60' colSpan="1" width="118px">单位工程名称</td>
                                        <td colSpan="3"> {unit}</td>
                                        <td colSpan="1" width="118px">细班（小班）</td>
                                        <td colSpan="1">{`${array[2]}(${array[3]})`}</td>
                                    </tr>
                                    <tr>
                                        <td className='hei60' align="center">施工单位</td>
                                        <td colSpan="3">中国交建集团</td>
                                        <td >项目经理</td>
                                        <td >王伟</td>
                                    </tr>
                                    <tr>
                                        <td className='hei60' align="center">施工员</td>
                                        <td colSpan="1">{shigong}</td>
                                        <td>设计数量</td>
                                        <td colSpan="1">{detail.DesignNum}</td>
                                        <td>实际数量</td>
                                        <td >{detail.ActualNum}</td>
                                    </tr>
                                    <tr>
                                        <td className='hei60' >施工执行标准名称及编号</td>
                                        <td colSpan="5"> 《雄安新区造林工作手册》</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="6" height="200">
                                            验收要点：以细班或小班为单位，对放样点穴进行验收。按照不低于5%的设计面积随机布设5m宽样带，对样带内的点穴精准度、密度情况进行打分。
                                            ①放点精准，抽检密度与设计密度的误差在±10%之内，视为合格，计90分以上，通过检验；
                                            ②放点不准，抽检密度与设计密度的误差超出±10%，即为不合格，需整改。
                                            放样点穴合格率=100-|（1-（抽检数量/样带面积）/设计密度）|*100
    
			                            </td>
                                    </tr>
                                    <tr>
                                        <td className='hei60' colSpan="6">
                                            这里是样带设计情况
			                            </td>
                                    </tr>
                                    <tr>
                                        <td className='hei60' colSpan="1" width="118px">设计面积</td>
                                        <td colSpan="2">{detail.DesignArea}</td>
                                        <td colSpan="1" width="118px">设计密度</td>
                                        <td colSpan="2">95%</td>
                                    </tr>
                                    <tr>
                                        <td className='hei60' colSpan="1" width="118px">样带面积</td>
                                        <td colSpan="2">{detail.SampleTapeArea}</td>
                                        <td colSpan="1" width="118px">放点数量</td>
                                        <td colSpan="2">{detail.LoftingNum}</td>
                                    </tr>
                                    <tr>
                                        <td className='hei60' colSpan="1" width="118px">实际密度</td>
                                        <td colSpan="2">100</td>
                                        <td colSpan="1" width="118px">合格率</td>
                                        <td colSpan="2">95%</td>
                                    </tr>
                                    <tr>
                                        <td className='hei110' >施工单位质量专检结果</td>
                                        <td colSpan="5">
                                            <div>
                                                <p>项目专业质量检查员：</p>
                                                <p className='marL300'>年</p>
                                                <p className='marL30'>月</p>
                                                <p className='marL30'>日</p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='hei110' >监理（建设）单位验收记录</td>
                                        <td colSpan="5">
                                            <div>
                                                <p>监理工程师：</p><p>{jianli}</p>
                                                <p className='marL300'>年</p>
                                                <p className='marL30'>月</p>
                                                <p className='marL30'>日</p>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </tbody>
                        </table>
                        <div>
                            <p>注：附验收过程照片及说明</p>
                            <p>2、本表解释权归XXXXXXXX。咨询电话：XXXXXXXX</p>
                        </div>
                    </div>
                </Modal>
            </Spin>
        );
    }
}
