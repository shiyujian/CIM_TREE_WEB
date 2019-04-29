import React, { Component } from 'react';
import { Spin, Modal } from 'antd';
import './index.less';

export default class WordView1 extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    componentDidMount () {
    }

    onOk () {
        this.props.onPressOk(8);
    }

    render () {
        const { detail } = this.props;
        let array = ['', '', '', ''];
        if (detail && detail.ThinClass) {
            array = detail.ThinClass.split('-');
        }
        let unit = (detail && detail.AcceptanceObj && detail.AcceptanceObj.Land) || '';
        let jianli = (detail && detail.AcceptanceObj && detail.AcceptanceObj.SupervisorObj.Full_Name) || '';
        let shigong = (detail && detail.AcceptanceObj && detail.AcceptanceObj.ApplierObj.Full_Name) || '';
        let qulityok = 0; // 默认全部不合格
        let hgl = detail.CheckNum - detail.FailedNum; // 合格量
        if (detail.CheckNum !== 0) {
            qulityok = hgl / detail.CheckNum;
        }
        return (
            <Spin spinning={this.state.loading}>
                <Modal
                    width={800}
                    visible={this.props.visible}
                    title='苗木浇水质量验收记录'
                    onOk={this.onOk.bind(this)}
                    maskClosable={false}
                    onCancel={this.onOk.bind(this)}
                    footer={null}
                >
                    <div className='trrdd'>

                        <table style={{ border: 1 }}>
                            <tbody>
                                <tr>
                                    <td height='60;' colSpan='1' width='118px'>单位工程名称</td>
                                    <td colSpan='3'> {unit}</td>
                                    <td colSpan='1' width='118px'>细班（小班）</td>
                                    <td colSpan='1'>{`${array[2]}(${array[3]})`}</td>
                                </tr>
                                <tr>
                                    <td height='60;' align='center'>施工单位</td>
                                    <td colSpan='3'>中国交建集团</td>
                                    <td >项目经理</td>
                                    <td >王伟</td>
                                </tr>
                                <tr>
                                    <td height='60;' align='center'>施工员</td>
                                    <td colSpan='1'>{shigong}</td>
                                    <td>设计数量</td>
                                    <td colSpan='1'>{detail.DesignNum}</td>
                                    <td>抽检数量</td>
                                    <td >{detail.CheckNum}</td>
                                </tr>
                                <tr>
                                    <td height='60;' align='center'>抽检合格数量</td>
                                    <td colSpan='3'>{hgl}</td>
                                    <td >合格率</td>
                                    <td >{qulityok}</td>
                                </tr>
                                <tr>
                                    <td className='hei60' >施工执行标准名称及编号</td>
                                    <td colSpan='5'> 《雄安新区造林工作手册》</td>
                                </tr>
                                <tr>
                                    <td colSpan='6' height='200'>
                                    验收要点：以细班或小班为单位，对浇水进行验收。按照不低于设计数量的5%进行抽检，对苗木浇水情况进行打分。要求苗木栽植后围砌圆形土堰，土堰内径应大于挖穴直径10厘米，土堰深为20～25厘米，培实，蓄水能力强。栽植后24小时内浇透定根水，一周左右浇透第二遍水。每次浇完水后要及时进行覆土封穴。
                                    ①定根水浇水及时，做到随栽随浇，第二次浇水在一周内完成，每次浇完水后及时进行覆土封穴，即为合格，抽检合格率达到90%以上，计90分以上，通过检验；
                                    ②土堰内径小于挖穴大小，树盘深小于15厘米，即为不合格，须整改。
                                    苗木浇水合格率=抽检合格数量/抽检数量。
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan='6'>不合格记录</td>
                                </tr>
                                <tr>
                                    <td>二维码号牌</td>
                                    <td colSpan='2'>不合格原因</td>
                                    <td>二维码号牌</td>
                                    <td colSpan='2'>不合格原因</td>
                                </tr>
                                <tr>
                                    <td className='hei110' >施工单位质量专检结果</td>
                                    <td colSpan='5'>
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
                                    <td colSpan='5'>
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
