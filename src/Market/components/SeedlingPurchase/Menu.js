
import React, {Component} from 'react';
import { Form, Button, Card, Row, Col } from 'antd';

class Menu extends Component {
    constructor (props) {
        super(props);
        this.state = {
            StartTime: '', // 报价开始时间
            EndTime: '', // 报价结束时间
            organizationName: '' // 所在单位名称
        };
        this.handlePane = this.handlePane.bind(this); // 切换标签页
        this.handleSubmit = this.handleSubmit.bind(this); // 提交查询
    }
    componentDidMount () {
        const { getOrgTree_new } = this.props.actions;
        if (this.props.record) {
            let StartTime = this.props.record['StartTime'].split(' ')[0];
            let EndTime = this.props.record['EndTime'].split(' ')[0];
            this.setState({
                StartTime,
                EndTime
            });
            getOrgTree_new({code: this.props.record.CreaterOrg}).then(rep => {
                this.setState({
                    organizationName: rep.name
                });
            });
        }
        if (this.props.projectList && this.props.record) {
            this.props.projectList.map(item => {
                if (item.No === this.props.record.ProjectName) {
                    this.setState({
                        ProjectName: item.Name
                    });
                }
                if (item.No === this.props.record.Section) {
                    this.setState({
                        Section: item.Name
                    });
                }
            });
        }
    }
    render () {
        const { StartTime, EndTime, ProjectName, Section } = this.state;
        const { record } = this.props;
        let CreateTime = record.CreateTime ? record.CreateTime.split(' ')[0] : '';
        return (
            <div className='menu'>
                <Card title={'发布时间：' + CreateTime}>
                    <Row>
                        <Col span={18}>
                            <h3>{ProjectName}{Section}采购单</h3>
                            <p className='text-p'>
                                <span>发布单位：{this.state.organizationName}</span>
                                <span style={{marginLeft: 20}}>报价起止时间：{StartTime}&nbsp;至&nbsp;{EndTime}</span>
                            </p>
                            <p className='text-p'>
                                <span>用苗地址：{record.UseNurseryAddress}</span>
                                <span style={{marginLeft: 20}}>采购品种：{record.TreeTypes}</span>
                            </p>
                            <p className='text-p'>联系方式：{record.Phone}（{record.Contacter}）</p>
                        </Col>
                        <Col span={6} style={{textAlign: 'center'}}>
                            {}
                            <Button type='primary' style={{marginTop: 22}} onClick={this.toPurchaseDetails.bind(this, record.ID)}>需求详情</Button>
                            <p>已有 {record.OfferNum} 人报价</p>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
    handlePane () {

    }
    handleSubmit () {

    }
    toPurchaseDetails (key) {
        this.props.actions.changePurchaseDetailsVisible(true);
        this.props.actions.changePurchaseDetailsKey(key);
    }
}

export default Form.create()(Menu);
