import React, { Component } from 'react';
import {
    Row,
    Col,
    Button,
    Input,
    Form,
    Carousel
} from 'antd';
import './Details.css';
import mmewm from './img/mmewm.jpg';
const { TextArea } = Input;
const FormItem = Form.Item;
export default class Details extends Component {
    static layout = {
        labelCol: {span: 8},
        wrapperCol: {span: 16}
    };
    constructor (props) {
        super(props);
        this.state = {
        };
    }
    render () {
        const {
            detailRow,
            projectList
        } = this.props;
        let dk = detailRow.Section;
        let sections = detailRow.Section;
        let startendNo = detailRow.Distributes ? detailRow.Distributes[0].StartNo + ' - ' + detailRow.Distributes[0].EndNo : '';
        if (projectList.length > 0 && dk) {
            for (let i = 0; i < projectList.length; i++) {
                if (projectList[i].No === dk.split('-')[0]) {
                    dk = projectList[i].Name;
                    let list = projectList[i].children;
                    for (let j = 0; j < list.length; j++) {
                        if (list[j].No === sections) {
                            sections = list[j].Name;
                        }
                    }
                }
            }
        }

        return (
            <div>
                <div className='Details'>
                    <h3 style={{height: 35, borderBottom: '1px solid #ccc'}}>{dk}{sections}二维码牌申请详情</h3>
                    <Form>
                        <Row>
                            <Col span={8}>
                                <FormItem label='地块' {...Details.layout}>
                                    <Input disabled value={dk} />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='标段' {...Details.layout}>
                                    <Input disabled value={sections} />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='计划栽植量' {...Details.layout}>
                                    <Input disabled value={detailRow.PlanNum} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label='库存量' {...Details.layout}>
                                    <Input disabled value={detailRow.StockNum} />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='实际派发总量' {...Details.layout}>
                                    <Input disabled value={detailRow.DistributeNum} />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='派发号段' {...Details.layout}>
                                    <Input disabled value={startendNo} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label='申请人' {...Details.layout}>
                                    <Input disabled value={detailRow.ApplierObj ? detailRow.ApplierObj.Full_Name : ''} />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='申请单位' {...Details.layout}>
                                    <Input disabled value={detailRow.ConstructUnit} />
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='申请时间' {...Details.layout}>
                                    <Input disabled value={detailRow.ApplyTime} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label='审核状态' {...Details.layout}>
                                    <Input disabled value={detailRow.Status === -1 ? '待审核' : (detailRow.Status === 0 ? '未通过' : '通过')} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label='审核说明' {...Details.layout}>
                                    <Input disabled value={detailRow.CheckInfo} style={{width: 'calc(100% * 4 - 50px)'}} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label='备注' {...Details.layout}>
                                    <TextArea disabled value={detailRow.Remark} rows={4} style={{width: 'calc(100% * 4 - 50px)', maxWidth: 'calc(100% * 4 - 50px)'}} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem label='二维码挂牌标准图集' {...Details.layout} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Carousel autoplay style={{width: '80%', margin: 'auto'}}>
                                    <div>
                                        <h3>1</h3>
                                    </div>
                                    <div>
                                        <h3>2</h3>
                                    </div>
                                    <div>
                                        <h3>3</h3>
                                    </div>
                                    <div>
                                        <h3>4</h3>
                                    </div>
                                </Carousel>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem label='二维码牌生产及安装标准说明' {...Details.layout} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <div style={{width: '80%', margin: 'auto'}}>
                                    <div style={{width: '50%', float: 'left', height: '300px'}}>
                                        <img src={mmewm} style={{width: '80%', height: '80%', textAlign: 'center'}} />
                                    </div>
                                    <div style={{width: '50%', float: 'left', height: '300px', lineHeight: '20px'}}>
                                        <div style={{marginBottom: '20px'}}>制作: 不可擅自更改电子版铭牌外观，按照电子铭牌样式制作成金属铭牌，铭牌成品须达到字迹清晰、二维码可快速识别、色彩靓丽；铭牌表层无法黏贴小广告、无法用马克笔类物品涂写；材质耐氧化，耐紫外线，不易变色、褪色。</div>
                                        <div>安装：铭牌安装以不影响设施整体观瞻为总体原则。安装需便于市民识别扫码，高度不得高于1.8米，不得遮挡设施核心内容，不影响设施日常维护及清洁。安装方式须采用黏贴作业，要确保铭牌与设施相互对应，安装时须扫码匹配设备。安装后须保持设施及铭牌清洁，保证市民扫码。</div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{textAlign: 'center'}}>
                                <Button type='primary' onClick={this.onBack.bind(this, 'nursery')}>关闭</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        );
    }
    onBack (type) {
        this.props.onDetailBack(type);
    }
}
