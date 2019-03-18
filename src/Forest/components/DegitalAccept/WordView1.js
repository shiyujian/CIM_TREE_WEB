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
        this.props.onPressOk(1)
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
        let sjmj = detail && detail.DesignArea || ''
        let shijmj = detail && detail.ActualArea || ''
        return (
            <Spin spinning={this.state.loading}>
                <Modal
                    width={800}
                    visible={this.props.visible}
                    title='土地整改质量验收记录'
                    onOk={this.onOk.bind(this)}
                    maskClosable={false}
                    onCancel={this.onOk.bind(this)}
                    footer={null}
                >
                    <div className='trrdd'>
                        
                        <table style={{ border: 1 }}>
                            <tbody>
                                <tr>
                                    <td style={{ height: 60, width: 118 }}>单位工程名称</td>
                                    <td colSpan = '3'>{unit}</td>
                                    <td style={{ width: 118 }}>细班（小班）</td>
                                    <td>{`${array[2]}(${array[3]})`}</td>
                                </tr>
                                <tr>
                                    <td style={{ height: 60, align: 'center' }} >施工单位</td>
                                    <td colSpan = '3'>中国交建集团</td>
                                    <td >项目经理</td>
                                    <td >王伟</td>
                                </tr>
                                <tr>
                                    <td style={{ height: 60, align: 'center' }} colSpan = '1'>施工员</td>
                                    <td colSpan = '1'>{shigong}</td>
                                    <td colSpan = '1'>设计面积</td>
                                    <td colSpan = '1'>{sjmj}</td>
                                    <td colSpan = '1'>实际面积</td>
                                    <td colSpan = '1'>{shijmj}</td>
                                </tr>
                                <tr>
                                    <td style={{ height: 60 }} >施工执行标准名称及编号</td>
                                    <td colSpan = '5'> 《雄安新区造林工作手册》</td>
                                </tr>
                                <tr>
                                    <td style={{ height: 100}} colSpan = '6' >
                                        验收要点：以细班或小班为单位，对土地整理进行验收。按照不低于5%的设计面积随机布设5m宽样带，对样带的微地形处理、垃圾和碎石处理情况进行打分。
                                        ①微地形按照设计要求精准完成，垃圾碎石清除干净，计90分以上，通过检验；
                                        ②微地形处理或垃圾碎石处理总体较好，但仍有不足，需整改。
			                    </td>
                                </tr>
                                <tr>
                                    <td style={{ height: 60 }} colSpan = '6'>
                                        这里是样带设计情况
			                    </td>
                                </tr>
                                <tr>
                                    <td style={{ width: 118, height: 60 }} colSpan = '1'>样带面积</td>
                                    <td colSpan = '2'>{detail.SampleTapeArea}</td>
                                    <td style={{ width: 118 }}>得分</td>
                                    <td colSpan = '2'>{detail.Score}</td>
                                </tr>
                                <tr>
                                    <td style={{ height: 110 }} >施工单位质量专检结果</td>
                                    <td colSpan = '5'>
                                        <div>
                                            <p>项目专业质量检查员：</p>
                                            <p style={{ marginLeft: 300 }}>年</p>
                                            <p style={{ marginLeft: 30 }}>月</p>
                                            <p style={{ marginLeft: 30 }}>日</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ height: 110 }} >监理（建设）单位验收记录</td>
                                    <td colSpan = '5'>
                                        <div>
                                            <p>监理工程师：</p><p>{jianli}</p><p>{jianli}</p>
                                            <p style={{ marginLeft: 300 }}>年</p>
                                            <p style={{ marginLeft: 30 }}>月</p>
                                            <p style={{ marginLeft: 30 }}>日</p>
                                        </div>
                                    </td>
                                </tr>
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
