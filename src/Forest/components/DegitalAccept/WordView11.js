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
            unitName: '',
            detail: ''
        };
    }

    componentDidMount = async () => {
        const {
            itemDetailList = [],
            unQualifiedList = []
        } = this.props;
        if (itemDetailList.length > 0) {
            let detail = itemDetailList[0];
            await this.getUnitMessage(detail);
            this.setState({
                detail
            });
        }
    }

    onOk () {
        this.props.onPressOk(11);
    }
    getUnitMessage = (detail) => {
        const {
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
        handleDetail.jianli = (detail && detail.AcceptanceObj && detail.AcceptanceObj.SupervisorObj && detail.AcceptanceObj.SupervisorObj.Full_Name) || '';
        handleDetail.shigong = (detail && detail.AcceptanceObj && detail.AcceptanceObj.ConstructerObj && detail.AcceptanceObj.ConstructerObj.Full_Name) || '';
        handleDetail.checker = (detail && detail.AcceptanceObj && detail.AcceptanceObj.ApplierObj && detail.AcceptanceObj.ApplierObj.Full_Name) || '';
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
        handleDetail.createTime = (detail && detail.CreateTime && moment(detail.CreateTime).format('YYYY年MM月DD日')) || '';
        let hgl = handleDetail.checkNum - handleDetail.failedNum; // 合格量
        let qulityok = 0; // 默认全部不合格
        if (handleDetail.checkNum !== 0) {
            qulityok = hgl / handleDetail.checkNum;
        }
        handleDetail.qulityok = qulityok;
        return handleDetail;
    }

    render () {
        const {
            itemDetailList = []
        } = this.props;
        const {
            leader,
            unitName,
            loading,
            detail
        } = this.state;
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
                                    <td colSpan='3'> {handleDetail.unit}</td>
                                    <td colSpan='1' width='118px'>细班（小班）</td>
                                    <td colSpan='1'>{`${array[2]}小班${array[3]}细班`}</td>
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
                                    <td />
                                    <td />
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td colSpan='2'>放样点穴</td>
                                    <td>5%</td>
                                    <td />
                                    <td />
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td colSpan='2'>挖穴</td>
                                    <td>5%</td>
                                    <td />
                                    <td />
                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td colSpan='2'>苗木质量</td>
                                    <td>25%</td>
                                    <td />
                                    <td />
                                </tr>
                                <tr>
                                    <td>5</td>
                                    <td colSpan='2'>土球质量</td>
                                    <td>15%</td>
                                    <td />
                                    <td />
                                </tr>
                                <tr>
                                    <td>6</td>
                                    <td colSpan='2'>苗木栽植</td>
                                    <td>10%</td>
                                    <td />
                                    <td />
                                </tr>
                                <tr>
                                    <td>7</td>
                                    <td colSpan='2'>苗木支架</td>
                                    <td>10%</td>
                                    <td />
                                    <td />
                                </tr>
                                <tr>
                                    <td>8</td>
                                    <td colSpan='2'>浇水</td>
                                    <td>10%</td>
                                    <td />
                                    <td />
                                </tr>
                                <tr>
                                    <td>9</td>
                                    <td colSpan='2'>大数据</td>
                                    <td>15%</td>
                                    <td />
                                    <td />
                                </tr>
                                <tr>
                                    <td className='hei60' colSpan='5'>造林合格率得分（按比重计分进行综合评价）</td>
                                    <td > 100</td>
                                </tr>
                                <tr>
                                    <td className='hei110' >施工单位质量专检结果</td>
                                    <td colSpan='5'>
                                        <div>
                                            <div style={{ float: 'left', marginLeft: 10 }}>
                                                <p >项目专业质量检查员：</p><p>{handleDetail.checker}</p>
                                            </div>
                                            <p style={{ float: 'right', marginRight: 10 }}>{handleDetail.applyTime}</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='hei110' >监理（建设）单位验收记录</td>
                                    <td colSpan='5'>
                                        <div>
                                            <div style={{ float: 'left', marginLeft: 10 }}>
                                                <p>监理工程师：</p><p>{handleDetail.jianli}</p>
                                            </div>
                                            <p style={{ float: 'right', marginRight: 10 }}>{handleDetail.createTime}</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <p>注：1.细班（小班）造林合格率得分=∑(单项验收得分×单项得分权重)/（100-零分项分值）×100。
                                2.附细班（小班）各项过程质量验收记录。</p>
                        </div>
                    </div>
                </Modal>
            </Spin>
        );
    }
}
