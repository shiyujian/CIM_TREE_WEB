import React, { Component } from 'react';
import { TREETYPENO, NURSERYPARAM, TREEPARAM } from '_platform/api';
import { getForestImgUrl } from '_platform/auth';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    Modal,
    InputNumber,
    Icon,
    Radio,
    Select,
    Notification
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class AddThinClassModal extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            addThinClassType: 'multiple',
            firstSmallClassNum: 0,
            firstThinClassNum: 0,
            secondThinClassNum: 0
        };
    }
    static layout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 20 }
    };

    cancel = async () => {
        // const {
        //     form: { setFieldsValue }
        // } = this.props;
        // await setFieldsValue({
        // });
        await this.props.handleAddThinClassCancel();
    }
    changeNumToString = (value) => {
        let no = '';
        if (value < 10) {
            no = '00' + value;
        } else if (value < 100) {
            no = '0' + value;
        } else {
            no = '' + value;
        }
        return no;
    }
    save = async () => {
        const {
            platform: { tree = {} },
            section,
            packageDatas,
            sectionsData,
            actions: {
                postAddWpunits
            }
        } = this.props;
        const {
            addThinClassType,
            firstSmallClassNum,
            firstThinClassNum,
            secondThinClassNum
        } = this.state;
        let landeName = '';
        let landNo = '';
        let regionName = '';
        let regionNo = '';
        let sectionNoArr = section.split('-');
        if (sectionNoArr && sectionNoArr instanceof Array && sectionNoArr.length === 3) {
            packageDatas.map((treeData) => {
                if (treeData.No === sectionNoArr[0]) {
                    landeName = treeData.Name;
                    landNo = treeData.No;
                    let children = treeData.children;
                    children.map((child) => {
                        if (child.No === (sectionNoArr[0] + '-' + sectionNoArr[1])) {
                            regionName = child.Name;
                            let NoArr = child.No.split('-');
                            regionNo = NoArr[1];
                        }
                    });
                }
            });
        } else {
            return;
        }
        let sectionName = '';
        sectionsData.map((sectionData) => {
            if (sectionData.No === section) {
                sectionName = sectionData.Name;
            }
        });

        if (!firstSmallClassNum) {
            Notification.warning({
                message: '请输入小班编号'
            });
            return;
        }
        console.log('firstSmallClassNum', this.changeNumToString(firstSmallClassNum));

        if (addThinClassType === 'one') {
            if (!firstThinClassNum) {
                Notification.warning({
                    message: '请输入细班编号'
                });
                return;
            };
            let postData = [
                {
                    Land: landeName, // 地块
                    LandNo: landNo, // 地块编码
                    Region: regionName, // 区块
                    RegionNo: regionNo, // 区块编码
                    UnitProject: sectionName, // 标段
                    UnitProjectNo: sectionNoArr[2], // 标段编码
                    UnitProjectName: sectionName, // 标段名称
                    SmallClass: this.changeNumToString(firstSmallClassNum), // 小班
                    ThinClass: this.changeNumToString(firstThinClassNum), // 细班
                    SmallClassName: this.changeNumToString(firstSmallClassNum) + '号小班', // 小班名称
                    ThinClassName: this.changeNumToString(firstThinClassNum) + '号细班', // 细班名称
                    TreeTypeName: '' // 树种名称
                }
            ];
            console.log('postData', postData);
            let rst = await postAddWpunits({}, postData);
            console.log('rst', rst);
            if (rst && rst.code && rst.code === 1) {
                Notification.success({
                    message: '新增成功'
                });
                await this.props.handleAddThinClassCancel();
            } else {
                Notification.error({
                    message: '新增失败'
                });
            }
        } else if (addThinClassType === 'multiple') {
            if (!firstThinClassNum || !secondThinClassNum) {
                Notification.warning({
                    message: '请输入细班编号'
                });
                return;
            };
            let postData = [];
            for (let i = firstThinClassNum; i <= secondThinClassNum; i++) {
                postData.push({
                    Land: landeName, // 地块
                    LandNo: landNo, // 地块编码
                    Region: regionName, // 区块
                    RegionNo: regionNo, // 区块编码
                    UnitProject: sectionName, // 标段
                    UnitProjectNo: sectionNoArr[2], // 标段编码
                    UnitProjectName: sectionName, // 标段名称
                    SmallClass: this.changeNumToString(firstSmallClassNum), // 小班
                    ThinClass: this.changeNumToString(i), // 细班
                    SmallClassName: this.changeNumToString(firstSmallClassNum) + '号小班', // 小班名称
                    ThinClassName: this.changeNumToString(i) + '号细班', // 细班名称
                    TreeTypeName: '' // 树种名称
                });
            }
            console.log('postData', postData);
            let rst = await postAddWpunits({}, postData);
            console.log('rst', rst);
            if (rst && rst.code && rst.code === 1) {
                Notification.success({
                    message: '新增成功'
                });
                await this.props.handleAddThinClassCancel();
            } else {
                Notification.error({
                    message: '新增失败'
                });
            }
        }
    }
    changeAddThinClassType = async (e) => {
        this.setState({
            addThinClassType: e.target.value
        });
    }
    firsrSmallClassNumChange = async (value) => {
        this.setState({
            firstSmallClassNum: value
        });
    }
    firsrNumChange = async (value) => {
        this.setState({
            firstThinClassNum: value
        });
    }
    secondNumChange = async (value) => {
        this.setState({
            secondThinClassNum: value
        });
    }
    render () {
        const {
            addThinClassType,
            firstSmallClassNum,
            firstThinClassNum,
            secondThinClassNum
        } = this.state;
        return (
            <div>
                <Modal
                    title='新增细班'
                    width={600}
                    visible
                    maskClosable={false}
                    onOk={this.save.bind(this)}
                    onCancel={this.cancel.bind(this)}
                >
                    <Form>
                        <Row>
                            <Col span={24}>
                                <Row>
                                    <Col span={24}>
                                        <Row>
                                            <Col span={6}>
                                                <span>新增类型</span>
                                            </Col>
                                            <Col span={12}>
                                                <RadioGroup
                                                    value={addThinClassType}
                                                    onChange={this.changeAddThinClassType.bind(this)} >
                                                    <Radio value={'multiple'} key={'multiple'}>新增多个细班</Radio>
                                                    <Radio value={'one'} key={'one'}>新增一个细班</Radio>
                                                </RadioGroup>
                                            </Col>
                                            <Col span={6} />
                                        </Row>
                                    </Col>
                                    <Col span={24} style={{marginTop: 20}}>
                                        <Row>
                                            <Col span={6}>
                                                <span>小班编码</span>
                                            </Col>
                                            <Col span={7}>
                                                <InputNumber
                                                    min={0}
                                                    max={999}
                                                    value={firstSmallClassNum}
                                                    onChange={this.firsrSmallClassNumChange.bind(this)} />
                                            </Col>
                                        </Row>
                                    </Col>
                                    {
                                        addThinClassType === 'multiple'
                                            ? <Col span={24} style={{marginTop: 20}}>
                                                <Row>
                                                    <Col span={6}>
                                                        <span>编码选择</span>
                                                    </Col>
                                                    <Col span={7}>
                                                        <InputNumber
                                                            min={0}
                                                            max={999}
                                                            value={firstThinClassNum}
                                                            onChange={this.firsrNumChange.bind(this)} />
                                                    </Col>
                                                    <Col span={4}>
                                                    ~
                                                    </Col>
                                                    <Col span={7}>
                                                        <InputNumber
                                                            min={firstThinClassNum + 1}
                                                            max={999}
                                                            value={secondThinClassNum}
                                                            onChange={this.secondNumChange.bind(this)} />
                                                    </Col>
                                                </Row>
                                            </Col>
                                            : <Col span={24} style={{marginTop: 20}}>
                                                <Row>
                                                    <Col span={6}>
                                                        <span>编码选择</span>
                                                    </Col>
                                                    <Col span={7}>
                                                        <InputNumber
                                                            min={0}
                                                            max={999}
                                                            value={firstThinClassNum}
                                                            onChange={this.firsrNumChange.bind(this)} />
                                                    </Col>
                                                </Row>
                                            </Col>
                                    }

                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(AddThinClassModal);
