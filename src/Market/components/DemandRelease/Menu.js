
import React, {Component} from 'react';
import { Form, Button, Card, Row, Col, message, Tag } from 'antd';

class Menu extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [],
            TreeTypes: []
        };
        this.toSoldOut = this.toSoldOut.bind(this); // 需求详情
    }
    componentDidMount () {
        if (this.props.record) {
            let StartTime = this.props.record['StartTime'].split(' ')[0];
            let EndTime = this.props.record['EndTime'].split(' ')[0];
            this.setState({
                StartTime,
                EndTime
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
        // 根据采购单id获取采购单
        const { getPurchaseStandard } = this.props.actions;
        getPurchaseStandard({}, {
            purchaseid: this.props.record.ID
        }).then(rep => {
            let dataList = [];
            let TreeTypes = [];
            rep.map(item => {
                if (!TreeTypes.includes(item.TreeTypeName)) {
                    TreeTypes.push(item.TreeTypeName);
                }
            });
            TreeTypes.map(item => {
                let arr = [];
                rep.map(row => {
                    if (row.TreeTypeName === item) {
                        arr.push({...row});
                    }
                });
                dataList.push({name: item, children: arr});
            });
            this.setState({
                dataList,
                TreeTypes
            });
        });
    }
    componentWillReceiveProps (nextProps) {
    }
    render () {
        const { dataList, TreeTypes, StartTime, EndTime, ProjectName, Section } = this.state;
        const { record } = this.props;
        return (
            <div className='menu' style={{marginTop: 10}}>
                <Card title={'发布时间：'}>
                    <Row>
                        <Col span={6}>
                            <h3>{ProjectName}{Section}采购单<Tag style={{marginLeft: 10}} color='#87d068'>{record.Status === 1 ? '报价中' : '未发布'}</Tag></h3>
                            <p>报价起止时间：{StartTime}至{EndTime}</p>
                            <p>用苗地：{record.UseNurseryAddress}</p>
                            <p>采购品种：
                                {TreeTypes}
                            </p>
                            <p>联系方式：{record.Phone}({record.Contacter})</p>
                        </Col>
                        <Col span={12}>
                            {
                                dataList.map((item, index) => {
                                    return (
                                        <div>
                                            <Tag color='blue-inverse'>{index}</Tag>
                                            <span>{item.name}</span>
                                            <span style={{display: 'inline-block', marginLeft: 10}}>
                                                {
                                                    item.children.map(row => {
                                                        return <p>胸径{row.DBH}cm 地径{row.GroundDiameter}cm 自然高{row.Height}cm 冠幅{row.CrownWidth}cm 培育方式：{row.CultivationMode} ￥{row.Price}（{row.Num}株)</p>;
                                                    })
                                                }
                                            </span>
                                        </div>
                                    );
                                })
                            }
                        </Col>
                        <Col span={6} style={{paddingTop: 40}}>
                            <Button onClick={this.toEditInfo}>查看报价</Button>
                            <Button type='primary' onClick={this.toEditInfo.bind(this, record.ID)} style={{marginLeft: 15}}>编辑</Button>
                            <Button type='primary' onClick={this.toSoldOut} style={{marginLeft: 15}}>
                                {record.Status === 1 ? '下架' : '上架'}
                            </Button>
                            {
                                record.Status === 1 || record.Status === 2 ? '' : <Button type='primary' onClick={this.toDelete.bind(this)} style={{marginLeft: 15}}>
                                    删除
                                </Button>
                            }
                            
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
            status: this.props.record.Status === 1 ? 0 : 1
        }).then(rep => {
            if (rep.code === 1) {
                message.success('上下架成功');
                this.props.toSearch();
            } else {
                message.success('上下架失败');
            }
        });
    }
    toDelete () {
        const { deletePurchase } = this.props.actions;
        deletePurchase({id: this.props.record.ID}).then(rep => {
            if (rep.code === 1) {
                message.success('删除成功');
                this.props.toSearch();
            }
        });
    }
}

export default Form.create()(Menu);
