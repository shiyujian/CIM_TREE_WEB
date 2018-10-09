
import React, {Component} from 'react';
import { Form, Button, Card, Row, Col, message } from 'antd';

class Menu extends Component {
    constructor (props) {
        super(props);
        this.state = {
            a: 1
        };
        this.toSoldOut = this.toSoldOut.bind(this); // 需求详情
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.record) {
            let StartTime = nextProps.record['StartTime'].split(' ')[0];
            let EndTime = nextProps.record['EndTime'].split(' ')[0];
            this.setState({
                StartTime,
                EndTime
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
            <div className='menu' style={{marginTop: 10}}>
                <Card title={'发布时间：'}>
                    <Row>
                        <Col span={8}>
                            <h3>{ProjectName}{Section}<span>({record.SKU})</span></h3>
                            <p>报价起止时间：{StartTime}至{EndTime}</p>
                            <p>用苗地：{record.UseNurseryAddress}</p>
                            <p>采购品种：{record.TreeTypes}</p>
                            <p>联系方式：{record.Phone}({record.Contacter})</p>
                        </Col>
                        <Col span={8}>
                            <p>采购品种：采购品种：采购品种：</p>
                        </Col>
                        <Col span={8} style={{paddingTop: 40}}>
                            <Button onClick={this.toEditInfo}>查看报价</Button>
                            <Button type='primary' onClick={this.toEditInfo.bind(this, record.ID)} style={{marginLeft: 15}}>编辑需求</Button>
                            <Button type='primary' onClick={this.toSoldOut} style={{width: 82, marginLeft: 15}}>下架</Button>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
    toEditInfo (key) {
        this.props.toAddDemand(key);
    }
    toSoldOut () {
        const { changeStatus } = this.props.actions;
        changeStatus({}, {
            id: this.props.record.ID,
            status: 3
        }).then(rep => {
            message.success('下架成功');
            this.props.toSearch();
        });
    }
}

export default Form.create()(Menu);
