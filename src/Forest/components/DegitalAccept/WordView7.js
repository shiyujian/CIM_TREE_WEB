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
        this.props.onPressOk(7)
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
                    title='苗木支架质量验收记录'
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
                                    <td>设计数量</td>
                                    <td colSpan="1">100</td>
                                    <td>抽检数量</td>
                                    <td >95</td>
                                </tr>
                                <tr>
                                    <td height="60;" align="center">抽检不合格数量</td>
                                    <td colSpan="3">设计数量</td>
                                    <td>合格率</td>
                                    <td colSpan="1">100</td>
                                </tr>
                                <tr>
                                    <td className='hei60' >施工执行标准名称及编号</td>
                                    <td colSpan="5"> 《雄安新区造林工作手册》</td>
                                </tr>
                                <tr>
                                    <td colSpan="6" height="200">
                                    验收要点：以细班或小班为单位，对苗木支架进行验收。按照不低于设计数量的5%进行抽检，对苗木支架情况进行打分。要求高于3米高的常绿树种或胸径大于5厘米的落叶树需要支架维护。落叶树种胸径低于5厘米的原则上不用支架，若冠高比失常、树干易发生倾斜，须采取竹竿捆绑固定后用支架维护。支架优先采用杉木、松木等比较坚固结实的材料。支架材料结实耐用，规格合理；绑扎必须牢固美观。
                                    ①支架固定结实，绑扎美观，即为合格，抽检合格率达到90%以上，计90分以上，通过检验；
                                    ②支架质量差且绑扎支架不牢固，即为不合格，须整改。
                                    苗木支架合格率=抽检合格数量/抽检数量。
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
