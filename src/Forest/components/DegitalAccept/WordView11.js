import React, { Component } from 'react';
import { Spin, Modal } from 'antd';
import {
    getProjectNameBySection
} from '_platform/gisAuth';
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
            itemDetail: ''
        };
    }

    componentDidMount = async () => {
        const {
            itemDetail
        } = this.props;
        if (itemDetail && itemDetail.acceptance) {
            await this.getUnitMessage();
        }
    }

    onOk () {
        this.props.onPressOk(11);
    }
    getUnitMessage = () => {
        const {
            unitMessage = [],
            thinclass,
            section
        } = this.props;
        let leader = '';
        let unitName = '';
        unitMessage.map((unit) => {
            if (unit && unit.Section && unit.Section === section) {
                leader = unit.Leader;
                unitName = unit.Unit;
            }
        });
        this.setState({
            leader,
            unitName
        });
    }
    handleDetailData = (record) => {
        const {
            itemDetail,
            platform: {
                tree
            },
            section
        } = this.props;
        let handleDetail = {};
        let thinClassTree = [];
        if (tree.thinClassTree) {
            thinClassTree = tree.thinClassTree;
        }
        handleDetail.unit = getProjectNameBySection(section, thinClassTree);
        handleDetail.score = (itemDetail && itemDetail.score) || 0;
        handleDetail.score1 = (itemDetail && itemDetail.score1) || 0;
        handleDetail.score11 = (itemDetail && itemDetail.score11) || 0;
        handleDetail.score2 = (itemDetail && itemDetail.score2) || 0;
        handleDetail.score21 = (itemDetail && itemDetail.score21) || 0;
        handleDetail.score3 = (itemDetail && itemDetail.score3) || 0;
        handleDetail.score31 = (itemDetail && itemDetail.score31) || 0;
        handleDetail.score4 = (itemDetail && itemDetail.score4) || 0;
        handleDetail.score41 = (itemDetail && itemDetail.score41) || 0;
        handleDetail.score5 = (itemDetail && itemDetail.score5) || 0;
        handleDetail.score51 = (itemDetail && itemDetail.score51) || 0;
        handleDetail.score6 = (itemDetail && itemDetail.score6) || 0;
        handleDetail.score61 = (itemDetail && itemDetail.score61) || 0;
        handleDetail.score7 = (itemDetail && itemDetail.score7) || 0;
        handleDetail.score71 = (itemDetail && itemDetail.score71) || 0;
        handleDetail.score8 = (itemDetail && itemDetail.score8) || 0;
        handleDetail.score81 = (itemDetail && itemDetail.score81) || 0;
        handleDetail.score9 = (itemDetail && itemDetail.score9) || 0;
        handleDetail.score91 = (itemDetail && itemDetail.score91) || 0;

        return handleDetail;
    }

    render () {
        const {
            thinclass,
            record
        } = this.props;
        const {
            leader,
            unitName,
            loading,
            tableData
        } = this.state;
        let list = thinclass.split('-');
        let array = [];
        list.map((item, i) => {
            if (i !== 2) {
                array.push(item);
            }
        });
        let handleDetail = this.handleDetailData(record);
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
                                    <td className='hei60'>施工单位</td>
                                    <td colSpan='5'>{unitName}</td>
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
                                    <td>{handleDetail.score1}</td>
                                    <td>{handleDetail.score11}</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td colSpan='2'>放样点穴</td>
                                    <td>5%</td>
                                    <td>{handleDetail.score2}</td>
                                    <td>{handleDetail.score21}</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td colSpan='2'>挖穴</td>
                                    <td>5%</td>
                                    <td>{handleDetail.score3}</td>
                                    <td>{handleDetail.score31}</td>
                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td colSpan='2'>苗木质量</td>
                                    <td>25%</td>
                                    <td>{handleDetail.score4}</td>
                                    <td>{handleDetail.score41}</td>
                                </tr>
                                <tr>
                                    <td>5</td>
                                    <td colSpan='2'>土球质量</td>
                                    <td>15%</td>
                                    <td>{handleDetail.score5}</td>
                                    <td>{handleDetail.score51}</td>
                                </tr>
                                <tr>
                                    <td>6</td>
                                    <td colSpan='2'>苗木栽植</td>
                                    <td>10%</td>
                                    <td>{handleDetail.score6}</td>
                                    <td>{handleDetail.score61}</td>
                                </tr>
                                <tr>
                                    <td>7</td>
                                    <td colSpan='2'>苗木支架</td>
                                    <td>10%</td>
                                    <td>{handleDetail.score7}</td>
                                    <td>{handleDetail.score71}</td>
                                </tr>
                                <tr>
                                    <td>8</td>
                                    <td colSpan='2'>浇水</td>
                                    <td>10%</td>
                                    <td>{handleDetail.score8}</td>
                                    <td>{handleDetail.score81}</td>
                                </tr>
                                <tr>
                                    <td>9</td>
                                    <td colSpan='2'>大数据</td>
                                    <td>15%</td>
                                    <td>{handleDetail.score9}</td>
                                    <td>{handleDetail.score91}</td>
                                </tr>
                                <tr>
                                    <td className='hei60' colSpan='5'>造林合格率得分（按比重计分进行综合评价）</td>
                                    <td >{handleDetail.score}</td>
                                </tr>
                                <tr>
                                    <td className='hei110' >施工单位自检记录</td>
                                    <td colSpan='5'>
                                        <div>
                                            <div style={{ float: 'left', marginLeft: 10 }}>
                                                <p >项目经理：</p><p>{leader}</p>
                                            </div>
                                            <p style={{ float: 'right', marginRight: 10 }}>{handleDetail.applyTime}</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='hei110' >监理（建设）单位验收记录</td>
                                    <td colSpan='5'>
                                        <div>
                                            <div>
                                                <div style={{ float: 'left', marginLeft: 10 }}>
                                                    <p>总监理工程师(建设单位项目负责人)：</p>
                                                </div>
                                            </div>

                                            <p style={{ float: 'right', marginRight: 10 }} />
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
