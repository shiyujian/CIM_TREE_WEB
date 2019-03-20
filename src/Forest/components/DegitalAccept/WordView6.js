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
        this.props.onPressOk(6)
    }

    render() {
        const { detail } = this.props;
        let array = ['', '', '', '']
        if (detail && detail.ThinClass) {
            array = detail.ThinClass.split('-');
        }
        let unit = detail && detail.AcceptanceObj && detail.AcceptanceObj.Land || ''
        let jianli = detail && detail.AcceptanceObj && detail.AcceptanceObj.SupervisorObj.Full_Name || ''
        let treetypename = detail && detail.TreeTypeObj && detail.TreeTypeObj.TreeTypeName;
        let shigong = detail && detail.AcceptanceObj && detail.AcceptanceObj.ApplierObj.Full_Name || ''
        return (
            <Spin spinning={this.state.loading}>
                <Modal
                    width={800}
                    visible={this.props.visible}
                    title='苗木栽植质量验收记录'
                    onOk={this.onOk.bind(this)}
                    maskClosable={false}
                    onCancel={this.onOk.bind(this)}
                    footer={null}
                >
                    <div className='trrdd'>

                        <table style={{ border: 1 }}>
                            <tbody>
                                <tr>
                                    <td height="60;" colSpan="1" width="118px">单位工程名称</td>
                                    <td colSpan="3"> {unit}</td>
                                    <td colSpan="1" width="118px">细班（小班）</td>
                                    <td colSpan="1">{`${array[2]}(${array[3]})`}</td>
                                </tr>
                                <tr>
                                    <td height="60;" align="center">施工单位</td>
                                    <td colSpan="3">中国交建集团</td>
                                    <td >项目经理</td>
                                    <td >王伟</td>
                                </tr>
                                <tr>
                                    <td height="60;" align="center">施工员</td>
                                    <td colSpan="1">{shigong}</td>
                                    <td>苗木品种</td>
                                    <td colSpan="1">{treetypename}</td>
                                    <td>苗木规格</td>
                                    <td >95</td>
                                </tr>
                                <tr>
                                    <td height="60;" align="center">设计数量</td>
                                    <td colSpan="1">{detail.DesignNum}</td>
                                    <td>实际数量</td>
                                    <td colSpan="1">{detail.ActualNum}</td>
                                    <td>抽检数量</td>
                                    <td >{detail.CheckNum}</td>
                                </tr>
                                <tr>
                                    <td className='hei60' >施工执行标准名称及编号</td>
                                    <td colSpan="5"> 《雄安新区造林工作手册》</td>
                                </tr>
                                <tr>
                                    <td colSpan="6" height="200">
                                    验收要点：以细班或小班为单位，对苗木栽植进行验收。按照不低于设计数量的5%进行抽检，对苗木栽植情况进行打分。要求轻吊轻放，不损伤土球；栽植深度适宜，超过土球3～5厘米；苗木保持直立，栽紧踏实，不松动；不可降解的包装材料全部解除。
                                    ①按照上述要求植苗，达到标准，即为合格，抽检合格率达到90%以上，计90分以上，通过检验；
                                    ②以上标准中，有一项不符合要求，即为不合格，须整改。
                                    苗木栽植合格率=抽检合格数量/抽检数量。
			                        </td>
                                </tr>
                                <tr>
                                    <td colSpan="6">不合格记录</td>
                                </tr>
                                <tr>
                                    <td>二维码号牌</td>
                                    <td colSpan="2">不合格原因</td>
                                    <td>二维码号牌</td>
                                    <td colSpan="2">不合格原因</td>
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
