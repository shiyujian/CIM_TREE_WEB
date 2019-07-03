import React, { Component } from 'react';
import { Spin, Modal } from 'antd';
import './index.less';
import moment from 'moment';
export default class WordView1 extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    componentDidMount () {
        const { unQualifiedList = [] } = this.props;
        if (unQualifiedList.length > 0) {
            for (let i = 0; i < unQualifiedList.length / 2; i++) {
                let a = 2 * i;
                let b = 2 * i + 1;
                if (a !== unQualifiedList.length) {
                    $('#trskr').after(
                        '<tr>' +
                            '<td>' + unQualifiedList[a].SXM + '</td>' +
                            '<td colSpan="2">' + unQualifiedList[a].SupervisorInfo + '</td>' +
                            '<td>' + unQualifiedList[b].SXM + '</td>' +
                            '<td colSpan="2">' + unQualifiedList[b].SupervisorInfo + '</td>' +
                        '</tr>'
                    );
                } else {
                    $('#trskr').after(
                        '<tr>' +
                            '<td>' + unQualifiedList[a].SXM + '</td>' +
                            '<td colSpan="2">' + unQualifiedList[a].SupervisorInfo + '</td>' +
                            '<td>' + '' + '</td>' +
                            '<td colSpan="2">' + '' + '</td>' +
                        '</tr>'
                    );
                }
            }
        }
    }

    onOk () {
        this.props.onPressOk(5);
    }
    handleDetailData = (detail) => {
        let handleDetail = {};
        handleDetail.unit = (detail && detail.AcceptanceObj && detail.AcceptanceObj.Land) || '';
        handleDetail.jianli = (detail && detail.AcceptanceObj && detail.AcceptanceObj.SupervisorObj.Full_Name) || '';
        handleDetail.shigong = (detail && detail.AcceptanceObj && detail.AcceptanceObj.ConstructerObj.Full_Name) || '';
        handleDetail.checker = (detail && detail.AcceptanceObj && detail.AcceptanceObj.ApplierObj.Full_Name) || '';
        handleDetail.designArea = (detail && detail.DesignArea && (detail.DesignArea * 0.0015).toFixed(2)) || '';
        handleDetail.actualArea = (detail && detail.ActualArea && (detail.ActualArea * 0.0015).toFixed(2)) || '';
        handleDetail.sampleTapeArea = (detail && detail.SampleTapeArea && (detail.SampleTapeArea * 0.0015).toFixed(2)) || '';
        handleDetail.applyTime = (detail && detail.AcceptanceObj && detail.AcceptanceObj.ApplyTime && moment(detail.AcceptanceObj.ApplyTime).format('YYYY年MM月DD日')) || '';
        handleDetail.designNum = (detail && detail.DesignNum) || 0;
        handleDetail.actualNum = (detail && detail.ActualNum) || 0;
        handleDetail.loftingNum = (detail && detail.LoftingNum) || 0;
        handleDetail.score = (detail && detail.Score && (detail.Score).toFixed(2)) || 0;
        handleDetail.checkNum = (detail && detail.CheckNum) || 0;
        handleDetail.failedNum = (detail && detail.FailedNum) || 0;
        handleDetail.treetypename = (detail && detail.TreeTypeObj && detail.TreeTypeObj.TreeTypeName) || '';
        let hgl = handleDetail.checkNum - handleDetail.failedNum; // 合格量
        let qulityok = 0; // 默认全部不合格
        if (handleDetail.checkNum !== 0) {
            qulityok = hgl / handleDetail.checkNum;
        }
        handleDetail.qulityok = qulityok;
        return handleDetail;
    }

    render () {
        const { detail } = this.props;
        let array = ['', '', '', ''];
        if (detail && detail.ThinClass) {
            array = detail.ThinClass.split('-');
        }
        let handleDetail = this.handleDetailData(detail);
        console.log('handleDetail', handleDetail);
        return (
            <Spin spinning={this.state.loading}>
                <Modal
                    width={800}
                    visible={this.props.visible}
                    title='土球质量验收记录'
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
                                    <td colSpan='3'> {handleDetail.unit}</td>
                                    <td colSpan='1' width='118px'>细班（小班）</td>
                                    <td colSpan='1'>{`${array[2]}小班${array[3]}细班`}</td>
                                </tr>
                                <tr>
                                    <td height='60;' align='center'>施工单位</td>
                                    <td colSpan='3'>中国交建集团</td>
                                    <td >项目经理</td>
                                    <td >王伟</td>
                                </tr>
                                <tr>
                                    <td height='60;' align='center'>施工员</td>
                                    <td colSpan='1'>{handleDetail.shigong}</td>
                                    <td>苗木品种</td>
                                    <td colSpan='1'>{handleDetail.treetypename}</td>
                                    <td>苗木规格</td>
                                    <td > / </td>
                                </tr>
                                <tr>
                                    <td height='60;' align='center'>土球规格</td>
                                    <td colSpan='1'>/</td>
                                    <td>设计数量</td>
                                    <td colSpan='1'>{handleDetail.designNum}</td>
                                    <td>抽检数量</td>
                                    <td >{handleDetail.checkNum}</td>
                                </tr>
                                <tr>
                                    <td height='60;' align='center'>抽检不合格数量</td>
                                    <td colSpan='3'>{handleDetail.failedNum}</td>
                                    <td >合格率</td>
                                    <td colSpan='2'>{`${handleDetail.score}%`}</td>
                                </tr>
                                <tr>
                                    <td className='hei60' >施工执行标准名称及编号</td>
                                    <td colSpan='5'> 《雄安新区造林工作手册》</td>
                                </tr>
                                <tr>
                                    <td colSpan='6' style={{height: 200}}>
                                        <div style={{textAlign: 'left'}}>
                                            <p>验收要点：以细班或小班为单位，对土球质量进行验收。按照不低于设计数量的10%进行抽检，对苗木土球质量情况进行打分。要求土球完整，落叶乔木土球直径达到胸径的8-10倍，常绿乔木土球直径达到地径的7倍以上，亚乔木、独干灌木土球直径达到地径的8倍以上，丛生灌木土球直径达到丛围3倍以上。</p>
                                            <p>①达到以上质量要求即为合格，抽检合格率达到90%以上，计90分以上，通过检验；</p>
                                            <p>②土球散坨；落叶乔木土球直径低于胸径的8倍；常绿乔木土球直径低于地径的7倍；亚乔木、独干灌木土球直径低于7倍；丛生灌木土球直径小于丛围3倍，视为不合格，不予使用。</p>
                                            <p>土球质量合格率=抽检合格数量/抽检数量。</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan='6'>不合格记录</td>
                                </tr>
                                <tr id='trskr'>
                                    <td>二维码号牌</td>
                                    <td colSpan='2'>不合格原因</td>
                                    <td>二维码号牌</td>
                                    <td colSpan='2'>不合格原因</td>
                                </tr>
                                <tr>
                                    <td className='hei110' >施工单位质量专检结果</td>
                                    <td colSpan='5'>
                                        <div>
                                            <p>项目专业质量检查员：</p><p>{handleDetail.checker}</p>
                                            <p style={{ marginLeft: 270 }}>{handleDetail.applyTime}</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='hei110' >监理（建设）单位验收记录</td>
                                    <td colSpan='5'>
                                        <div>
                                            <p>监理工程师：</p><p>{handleDetail.jianli}</p>
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
