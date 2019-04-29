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
        this.props.onPressOk(11);
    }

    render () {
        const { detail } = this.props;
        let array = ['', '', '', ''];
        if (detail && detail.ThinClass) {
            array = detail.ThinClass.split('-');
        }
        let unit = (detail && detail.AcceptanceObj && detail.AcceptanceObj.Land) || '';
        let jianli = (detail && detail.AcceptanceObj && detail.AcceptanceObj.SupervisorObj.Full_Name) || '';
        return (
            <Spin spinning={this.state.loading}>
                <Modal
                    width={800}
                    visible={this.props.visible}
                    title='细班（小班）造林合格率验收表'
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
                                    <td className='hei60' >施工单位</td>
                                    <td colSpan='5'> 《雄安新区造林工作手册》</td>
                                </tr>
                                <tr>
                                    <td className='hei60' >施工执行标准名称及编号</td>
                                    <td colSpan='5'> 《雄安新区造林工作手册》</td>
                                </tr>
                                <tr>
                                    <td>序号</td>
                                    <td colSpan='2'>项目</td>
                                    <td>权重</td>
                                    <td>分项检验得分</td>
                                    <td>加权得分</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td colSpan='2'>土地整理</td>
                                    <td>5%</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td colSpan='2'>放样点穴</td>
                                    <td>5%</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td colSpan='2'>挖穴</td>
                                    <td>5%</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td colSpan='2'>苗木质量</td>
                                    <td>25%</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>5</td>
                                    <td colSpan='2'>土球质量</td>
                                    <td>15%</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>6</td>
                                    <td colSpan='2'>苗木栽植</td>
                                    <td>10%</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>7</td>
                                    <td colSpan='2'>苗木支架</td>
                                    <td>10%</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>8</td>
                                    <td colSpan='2'>浇水</td>
                                    <td>10%</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>9</td>
                                    <td colSpan='2'>大数据</td>
                                    <td>15%</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className='hei60' colSpan='5'>造林合格率得分（按比重计分进行综合评价）</td>
                                    <td > 100</td>
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
