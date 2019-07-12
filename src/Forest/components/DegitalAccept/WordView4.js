import React, { Component } from 'react';
import { Spin, Modal, Tabs } from 'antd';
import './index.less';
import moment from 'moment';
const { TabPane } = Tabs;
export default class WordView1 extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            leader: '',
            unitName: '',
            detail: '',
            unQualifiedList: []
        };
    }

    componentDidMount = async () => {
        const {
            itemDetailList = []
        } = this.props;
        if (itemDetailList.length > 0) {
            let detail = itemDetailList[0];
            await this.getUnqualifiedList(detail);
            await this.getUnitMessage(detail);
            this.setState({
                detail
            });
        }
    }
    tabChange = async (key) => {
        const {
            itemDetailList = []
        } = this.props;
        let detail = itemDetailList[key];
        await this.getUnqualifiedList(detail);
        this.setState({
            detail
        });
    }
    getUnqualifiedList = async (detail) => {
        const {
            section = '',
            actions: {
                getMQulityCheckList
            }
        } = this.props;
        this.setState({
            loading: true
        });
        let unQualifiedList = [];
        let postdata1 = {
            section: section,
            thinclass: detail.ThinClass,
            treetype: detail.TreeType,
            status: 0
        };
        let result1 = await getMQulityCheckList({}, postdata1);
        if (result1 && result1.content && result1.content instanceof Array) {
            unQualifiedList = result1.content;
        }
        this.setState({
            loading: false,
            unQualifiedList
        });
    }
    setTableData = () => {
        const {
            unQualifiedList = []
        } = this.state;
        let tableData = [];
        console.log('unQualifiedList', unQualifiedList);
        if (unQualifiedList.length > 0) {
            for (let i = 0; i < unQualifiedList.length; i = i + 2) {
                let a = i;
                let b = i + 1;
                if (a !== unQualifiedList.length - 1) {
                    tableData.push(
                        <tr>
                            <td>{unQualifiedList[a].SXM || ''}</td>
                            <td colSpan='2'>{unQualifiedList[a].SupervisorInfo || ''}</td>
                            <td>{unQualifiedList[b].SXM || ''}</td>
                            <td colSpan='2'>{unQualifiedList[b].SupervisorInfo || ''}</td>
                        </tr>
                    );
                } else {
                    tableData.push(
                        <tr>
                            <td>{unQualifiedList[a].SXM || ''}</td>
                            <td colSpan='2'>{unQualifiedList[a].SupervisorInfo || ''}</td>
                            <td />
                            <td colSpan='2' />
                        </tr>
                    );
                }
            }
        }
        return tableData;
    }
    onOk () {
        this.props.onPressOk(4);
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
        handleDetail.jianli = (detail && detail.AcceptanceObj && detail.AcceptanceObj.SupervisorObj.Full_Name) || '';
        handleDetail.shigong = (detail && detail.AcceptanceObj && detail.AcceptanceObj.ConstructerObj.Full_Name) || '';
        handleDetail.checker = (detail && detail.AcceptanceObj && detail.AcceptanceObj.ApplierObj.Full_Name) || '';
        handleDetail.designArea = (detail && detail.DesignArea && (detail.DesignArea * 0.0015).toFixed(2)) || '';
        handleDetail.actualArea = (detail && detail.ActualArea && (detail.ActualArea * 0.0015).toFixed(2)) || '';
        handleDetail.sampleTapeArea = (detail && detail.SampleTapeArea && (detail.SampleTapeArea * 0.0015).toFixed(2)) || '';
        handleDetail.applyTime = (detail && detail.AcceptanceObj && detail.AcceptanceObj.ApplyTime && moment(detail.AcceptanceObj.ApplyTime).format('YYYY年MM月DD日')) || '';
        handleDetail.createTime = (detail && detail.CreateTime && moment(detail.CreateTime).format('YYYY年MM月DD日')) || ''; handleDetail.designNum = (detail && detail.DesignNum) || 0;
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

            <Modal
                width={800}
                visible={this.props.visible}
                title='苗木质量验收记录'
                onOk={this.onOk.bind(this)}
                maskClosable={false}
                onCancel={this.onOk.bind(this)}
                footer={null}
            >
                <Spin spinning={loading}>
                    <Tabs defaultActiveKey='0' onChange={this.tabChange.bind(this)}>
                        {
                            itemDetailList.map((item, index) => {
                                return (
                                    <TabPane
                                        tab={(item && item.TreeTypeObj && item.TreeTypeObj.TreeTypeName) || '树种'}
                                        key={index}>
                                        <div className='trrdd'>
                                            <table style={{ border: 1 }}>
                                                <tbody id='mytable'>
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
                                                        <td className='hei60' >施工执行标准名称及编号</td>
                                                        <td colSpan='5'> 《雄安新区造林工作手册》</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan='6' style={{height: 200}}>
                                                            <div style={{textAlign: 'left'}}>
                                                                <span style={{display: 'block'}}>验收要点：以细班或小班为单位，对苗木质量进行验收。按照不低于设计数量的30%进行抽检，对苗木品种、规格、质量情况进行打分。</span>
                                                                <span style={{display: 'block'}}>①苗木品种符合设计要求，规格符合设计要求，质量符合用苗要求即为合格，抽检合格率达到95%以上，计95分以上，通过检验；</span>
                                                                <span style={{display: 'block'}}>②苗木品种不符合设计要求；苗木规格低于设计要求；苗木主干弯曲；常绿苗木无顶芽；落叶乔木无中央领导枝；树冠严重偏冠；严重的机械损伤；检疫性或蛀干性病虫害，视为不合格，不予使用。</span>
                                                                <span style={{display: 'block'}}>苗木质量合格率=抽检合格数量/抽检数量。</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td height='60;' align='center'>设计数量</td>
                                                        <td colSpan='1'>{`${handleDetail.designNum} (个)`}</td>
                                                        <td>实际数量</td>
                                                        <td colSpan='1'>{`${handleDetail.actualNum} (个)`}</td>
                                                        <td>抽检数量</td>
                                                        <td >{`${handleDetail.checkNum} (个)`}</td>
                                                    </tr>
                                                    <tr>
                                                        <td height='60;' colSpan='1' width='118px'>抽检不合格数量</td>
                                                        <td colSpan='3'>{`${handleDetail.failedNum} (个)`}</td>
                                                        <td colSpan='1' width='118px'>合格率</td>
                                                        <td colSpan='2'>{`${handleDetail.score}%`}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan='6'>不合格苗木记录</td>
                                                    </tr>
                                                    <tr id='trskr'>
                                                        <td>二维码号牌</td>
                                                        <td colSpan='2'>不合格原因</td>
                                                        <td>二维码号牌</td>
                                                        <td colSpan='2'>不合格原因</td>
                                                    </tr>
                                                    {
                                                        this.setTableData()
                                                    }
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
                                                <p>注：1.苗木质量不合格记录可另附表。2.附验收过程照片及说明。</p>
                                            </div>
                                        </div>
                                    </TabPane>
                                );
                            })
                        }
                    </Tabs>
                </Spin>
            </Modal>
        );
    }
}
