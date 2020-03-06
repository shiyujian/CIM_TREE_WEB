import React, {
    Component
} from 'react';
import {
    Icon,
    Tag,
    Button,
    Input,
    Modal,
    Select,
    Upload,
    message,
    Row,
    Col,
    Tabs,
    Table,
    Steps,
    Form,
    Notification
} from 'antd';
import {
    getYsTypeByID,
    getStatusByID
} from './auth';
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { Step } = Steps;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
    }
};
class AgainCheckModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [], // 业主
            defaultActiveCurrent: 0 // 最新一步
        };
        this.columns = [
            {
                title: '验收类型',
                dataIndex: 'CheckTypeName'
            },
            {
                title: '细班号',
                dataIndex: 'ThinClass',
                render: (text, record) => {
                    return (<div>
                        {
                            record.ThinClass.map(item => {
                                return <Tag color='green'>{item}</Tag>;
                            })
                        }
                    </div>);
                }
            }
        ];
    }
    componentDidMount () {
        const { DetailsInfo } = this.props;
        let dataList = [];
        let checkTypeArr = [];
        DetailsInfo.Details.map(item => {
            if (!checkTypeArr.includes(item.CheckType)) {
                checkTypeArr.push(item.CheckType);
            }
        });
        checkTypeArr.map(item => {
            let thinClassArr = [];
            DetailsInfo.Details.map(row => {
                if (item === row.CheckType) {
                    thinClassArr.push(row.ThinClass.substr(-7, 7));
                }
            });
            dataList.push({
                CheckType: item,
                CheckTypeName: getYsTypeByID(item),
                ThinClass: thinClassArr
            });
        });
        let defaultActiveCurrent = 0;
        switch (DetailsInfo.Status) {
            case 0: defaultActiveCurrent = 1;
                break;
            case 1: defaultActiveCurrent = 2;
                break;
            case 2: defaultActiveCurrent = 1;
                break;
            case 3: defaultActiveCurrent = 2;
                break;
            case 4: defaultActiveCurrent = 2;
                break;
        }
        this.setState({
            dataList,
            defaultActiveCurrent
        });
    }
    onDownload = async (url) => {
        if (url) {
            console.log('下载文件', url);
            window.open(url);
        } else {
            Notification.error({
                message: '提示',
                description: '无附件'
            });
        }
    }
    getStep () {
        const { DetailsInfo } = this.props;
        let flowList = DetailsInfo.Flows;
        let StepArr = [];
        let ApplierFullName = '';
        let ApplierUserName = '';
        
        let SupervisorFullName = '';
        let SupervisorUserName = '';

        let OwnerFullName = '';
        let OwnerUserName = '';
        if (DetailsInfo.ApplierObj && DetailsInfo.ApplierObj.User_Name) {
            ApplierFullName = DetailsInfo.ApplierObj.Full_Name;
            ApplierUserName = DetailsInfo.ApplierObj.User_Name;
        }
        if (DetailsInfo.SupervisorObj && DetailsInfo.SupervisorObj.User_Name) {
            SupervisorFullName = DetailsInfo.SupervisorObj.Full_Name;
            SupervisorUserName = DetailsInfo.SupervisorObj.User_Name;
        }
        if (DetailsInfo.OwnerObj && DetailsInfo.OwnerObj.User_Name) {
            OwnerFullName = DetailsInfo.OwnerObj.Full_Name;
            OwnerUserName = DetailsInfo.OwnerObj.User_Name;
        }
        let ApplierDom = <Step title='施工重新申请验收（已完成）' description={<div>
            <div>
                <span>申请人：{ApplierFullName}（{ApplierUserName}）</span>
                <span style={{float: 'right'}}>申请时间：{DetailsInfo.ApplyTime}</span>
            </div>
            <div style={{marginTop: 10}}>
                <span>重新申请原因：{DetailsInfo.Reason}</span>
            </div>
            <div style={{marginTop: 10}}>
                <Button onClick={this.onDownload.bind(this, DetailsInfo.ReasonFile)}><Icon type='download' />查看附件</Button>
                {
                    DetailsInfo.ReasonFile ? <span style={{marginLeft: 10}}>{DetailsInfo.ReasonFile.split('_')[1]}</span> : ''
                }
            </div>
        </div>} />;
        StepArr.push(
            ApplierDom
        );
        if (DetailsInfo.Status === 0) {
            StepArr.push(
                <Step title='监理审核（待办）' description={
                    <div>
                        <div>
                            <span>监理：{SupervisorFullName}（{SupervisorUserName}）</span>
                        </div>
                    </div>
                } />
            );
        } else if (DetailsInfo.Status === 1) {
            StepArr.push(
                <Step title='监理审核（通过）' description={<div>
                    <div>
                        <span>监理：{SupervisorFullName}（{SupervisorUserName}）</span>
                        <span style={{float: 'right'}}>审核时间：{flowList[1].CreateTime}</span>
                    </div>
                    <div style={{marginTop: 10}}>
                        <span>备注：{flowList[1].Info}</span>
                    </div>
                </div>} />
            );
            StepArr.push(
                <Step title='业主审核（待办）' description={
                    <div>
                        <div>
                            <span>业主：{OwnerFullName}（{OwnerUserName}）</span>
                        </div>
                    </div>
                } />
            );
        } else if (DetailsInfo.Status === 2) {
            StepArr.push(
                <Step title='监理审核（不通过）' description={<div>
                    <div>
                        <span>监理：{SupervisorFullName}（{SupervisorUserName}）</span>
                        <span style={{float: 'right'}}>审核时间：{flowList[1].CreateTime}</span>
                    </div>
                    <div style={{marginTop: 10}}>
                        <span>备注：{flowList[1].Info}</span>
                    </div>
                </div>} />
            );
        } else if (DetailsInfo.Status === 3) {
            StepArr.push(
                <Step title='监理审核（通过）' description={<div>
                    <div>
                        <span>监理：{SupervisorFullName}（{SupervisorUserName}）</span>
                        <span style={{float: 'right'}}>审核时间：{flowList[1].CreateTime}</span>
                    </div>
                    <div style={{marginTop: 10}}>
                        <span>备注：{flowList[1].Info}</span>
                    </div>
                </div>} />
            );
            StepArr.push(
                <Step title='业主审核（通过）' description={<div>
                    <div>
                        <span>业主：{OwnerFullName}（{OwnerUserName}）</span>
                        <span style={{float: 'right'}}>审核时间：{flowList[2].CreateTime}</span>
                    </div>
                    <div style={{marginTop: 10}}>
                        <span>备注：{flowList[2].Info}</span>
                    </div>
                </div>} />
            );
        } else if (DetailsInfo.Status === 4) {
            StepArr.push(
                <Step title='监理审核（通过）' description={<div>
                    <div>
                        <span>监理：{SupervisorFullName}（{SupervisorUserName}）</span>
                        <span style={{float: 'right'}}>审核时间：{flowList[1].CreateTime}</span>
                    </div>
                    <div style={{marginTop: 10}}>
                        <span>备注：{flowList[1].Info}</span>
                    </div>
                </div>} />
            );
            StepArr.push(
                <Step title='业主审核（不通过）' description={<div>
                    <div>
                        <span>业主：{OwnerFullName}（{OwnerUserName}）</span>
                        <span style={{float: 'right'}}>审核时间：{flowList[2].CreateTime}</span>
                    </div>
                    <div style={{marginTop: 10}}>
                        <span>备注：{flowList[2].Info}</span>
                    </div>
                </div>} />
            );
        }
        return StepArr;
    }
    render () {
        const { dataList, defaultActiveCurrent } = this.state;
        return (<div>
            <Modal
                width='750px'
                title='查看'
                footer={null}
                visible={this.props.detailsModalVisible}
                onCancel={this.props.handleCancel}
            >
                <Tabs defaultActiveKey={1}>
                    <TabPane tab='重新验收的细班' key='details'>
                        <Table
                            rowKey='CheckType'
                            bordered
                            pagination={false}
                            columns={this.columns}
                            dataSource={dataList}
                        />
                    </TabPane>
                    <TabPane tab='历史流程' key='flow'>
                        <Steps direction='vertical' current={defaultActiveCurrent}>
                            {
                                this.getStep()
                            }
                        </Steps>
                    </TabPane>
                </Tabs>
            </Modal>
        </div>);
    }
}
export default Form.create()(AgainCheckModal);
