
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Tabs, Card, Row, Col } from 'antd';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

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
    componentWillReceiveProps (nextProps) {
        const { getOrgTree_new } = this.props.actions;
        if (nextProps.record) {
            let StartTime = nextProps.record['StartTime'].split(' ')[0];
            let EndTime = nextProps.record['EndTime'].split(' ')[0];
            this.setState({
                StartTime,
                EndTime
            });
            getOrgTree_new({code: nextProps.record.CreaterOrg}).then(rep => {
                this.setState({
                    organizationName: rep.name
                });
            });
        }
        if (nextProps.projectList && nextProps.record) {
            nextProps.projectList.map(item => {
                if (item.No === nextProps.record.ProjectName) {
                    this.setState({
                        ProjectName: item.Name
                    });
                }
                if (item.No === nextProps.record.Section) {
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
        return (
            <div className='menu'>
                <Card title='发布时间:'>
                    <Row>
                        <Col span={18}>
                            <h3>{ProjectName}{Section}采购单</h3>
                            <p className='title'>
                                <span>发布单位：{this.state.organizationName}</span>
                                <span style={{marginLeft: 20}}>报价起止时间:{StartTime}至{EndTime}</span>
                            </p>
                            <p>
                                <span>用苗地：{record.UseNurseryAddress}</span>
                                <span style={{marginLeft: 20}}>采购品种：{record.TreeTypes}</span>
                            </p>
                            <p>联系方式：{record.Phone}（{record.Contacter}）</p>
                        </Col>
                        <Col span={6} style={{textAlign: 'center'}}>
                            <p style={{marginTop: 22}}>已有 {record.OfferNun} 人报价</p>
                            <Link to={`/market/purchasedetails?id=${record.ID}`}>
                                <Button type='primary'>需求详情</Button>
                            </Link>
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
}

export default Form.create()(Menu);
