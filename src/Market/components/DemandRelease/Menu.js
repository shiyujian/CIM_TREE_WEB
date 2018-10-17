
import React, {Component} from 'react';
import { Form, Button, Card, Row, Col, message, Tag } from 'antd';
import { CULTIVATIONMODE } from '_platform/api';

class Menu extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataList: [],
            TreeTypes: []
        };
        this.renderButton = this.renderButton.bind(this); // 显示按钮
        this.toEditInfo = this.toEditInfo.bind(this); // 修改
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
            console.log(dataList);
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
        let CreateTime = record.CreateTime ? record.CreateTime.split(' ')[0] : '';
        return (
            <div className='menu' style={{marginTop: 10}}>
                <Card title={'发布时间：' + CreateTime}>
                    <Row>
                        <Col span={8}>
                            <h3>{ProjectName}{Section}采购单<Tag style={{marginLeft: 10}} color='#87d068'>{record.Status === 1 ? '报价中' : '未发布'}</Tag></h3>
                            <p className='text-p'>报价起止时间：{StartTime}至{EndTime}</p>
                            <p className='text-p'>用苗地：{record.UseNurseryAddress}</p>
                            <p className='text-p'>采购品种：
                                {TreeTypes}
                            </p>
                            <p className='text-p'>联系方式：{record.Phone}({record.Contacter})</p>
                        </Col>
                        <Col span={12}>
                            {
                                dataList.map((item, index) => {
                                    return (
                                        <div key={index} style={{display: 'flex', padding: '5px 0', width: '90%', borderBottom: '1px solid #ccc'}}>
                                            <div>
                                                <Tag color='blue-inverse' style={{cursor: 'auto'}}>{index}</Tag>
                                            </div>
                                            <div style={{width: 50}}>
                                                <span>{item.name}</span>
                                            </div>
                                            <div style={{marginLeft: 10}}>
                                                {
                                                    item.children.map((row, number) => {
                                                        let CultivationMode = '';
                                                        CULTIVATIONMODE.map(record => {
                                                            if (row.CultivationMode === record.id) {
                                                                CultivationMode = record.name;
                                                            }
                                                        });
                                                        return <p key={number} style={{marginBottom: '0.2em', fontSize: 10}}>胸径{row.DBH}cm 地径{row.GroundDiameter}cm 自然高{row.Height}cm 冠幅{row.CrownWidth}cm 培育方式：{CultivationMode} ￥{row.Price}（{row.Num}株)</p>;
                                                    })
                                                }
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </Col>
                        <Col span={4} style={{paddingTop: 30}}>
                            {
                                this.renderButton()
                            }
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
    renderButton () {
        let arr = [];
        let seeButton = <Button style={{marginRight: 15, marginBottom: 10}} key='seeButton' type='primary' onClick={this.toEditInfo}>查看报价</Button>;
        let overButton = <Button style={{marginRight: 15, marginBottom: 10}} key='overButton' type='primary' onClick={this.toSoldOut.bind(this, 3)}>提前结束报价</Button>;
        let upButton = <Button style={{marginRight: 15, marginBottom: 10}} key='upButton' type='primary' onClick={this.toSoldOut.bind(this, 1)}>上架</Button>;
        let downButton = <Button style={{marginRight: 15, marginBottom: 10}} key='downButton' type='primary' onClick={this.toSoldOut.bind(this, 0)}>下架</Button>;
        let editButton = <Button style={{marginRight: 15, marginBottom: 10}} key='editButton' type='primary' onClick={this.toEditInfo}>编辑</Button>;
        let deleteButton = <Button style={{marginRight: 15, marginBottom: 10}} key='deleteButton' type='primary' onClick={this.toDelete.bind(this)}>删除</Button>;
        switch (this.props.record.Status) {
            case 0:
                arr.push(editButton, upButton, deleteButton);
                break;
            case 1:
                arr.push(seeButton, downButton, overButton);
                break;
            case 2:
                arr.push(seeButton);
                break;
            case 3:
                arr.push(seeButton, deleteButton);
                break;
        }
        return arr;
    }
    toEditInfo () {
        this.props.toAddDemand(this.props.record.ID);
    }
    toSoldOut (status) {
        const { changeStatus } = this.props.actions;
        changeStatus({}, {
            id: this.props.record.ID,
            status: status
        }).then(rep => {
            if (rep.code === 1) {
                message.success('操作成功');
                this.props.toSearch();
            } else {
                message.success('操作失败');
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
