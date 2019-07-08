import React, { Component } from 'react';
import { Spin, Modal } from 'antd';
import './index.less';
import moment from 'moment';
export default class WordView1 extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            leader: '',
            unitName: ''
        };
    }

    componentDidMount = async () => {
        await this.getUnitMessage();
    }

    onOk () {
        this.props.onPressOk(6);
    }
    getUnitMessage = () => {
        const {
            detail = {},
            unitMessage = []
        } = this.props;
        let leader = '';
        let unitName = '';
        if (detail && detail.Section) {
            unitMessage.map((unit) => {
                if (unit && unit.Section && unit.Section === detail.Section) {
                    leader = unit.Leader;
                    unitName = unit.Unit;
                }
            });
        }
        this.setState({
            leader,
            unitName
        });
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
        const {
            leader,
            unitName,
            loading
        } = this.state;
        let array = ['', '', '', ''];
        if (detail && detail.ThinClass) {
            array = detail.ThinClass.split('-');
        }
        let handleDetail = this.handleDetailData(detail);
        console.log('handleDetail', handleDetail);
        return (
            <Spin spinning={loading}>
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
                                    <td height='60;' colSpan='1' width='118px'>单位工程名称</td>
                                    <td colSpan='3'> {handleDetail.unit}</td>
                                    <td colSpan='1' width='118px'>细班（小班）</td>
                                    <td colSpan='1'>{`${array[2]}小班${array[3]}细班`}</td>
                                </tr>
                                <tr>
                                    <td height='60;' align='center'>施工单位</td>
                                    <td colSpan='3'>{unitName}</td>
                                    <td >项目经理</td>
                                    <td >{leader}</td>
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
                                    <td height='60;' align='center'>设计数量</td>
                                    <td colSpan='1'>{handleDetail.designNum}</td>
                                    <td>实际数量</td>
                                    <td colSpan='1'>{handleDetail.actualNum}</td>
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
                                            <span style={{display: 'block'}}>验收要点：以细班或小班为单位，对苗木栽植进行验收。按照不低于设计数量的5%进行抽检，对苗木栽植情况进行打分。要求轻吊轻放，不损伤土球；栽植深度适宜，超过土球3～5厘米；苗木保持直立，栽紧踏实，不松动；不可降解的包装材料全部解除。</span>
                                            <span style={{display: 'block'}}>①按照上述要求植苗，达到标准，即为合格，抽检合格率达到90%以上，计90分以上，通过检验；</span>
                                            <span style={{display: 'block'}}>②以上标准中，有一项不符合要求，即为不合格，须整改。</span>
                                            <span style={{display: 'block'}}>苗木栽植合格率=抽检合格数量/抽检数量。</span>
                                        </div>
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
                            <p>注：1.苗木栽植验收不合格记录可另附表。2.附验收过程照片及说明。</p>
                        </div>
                    </div>
                </Modal>
            </Spin>
        );
    }
}
