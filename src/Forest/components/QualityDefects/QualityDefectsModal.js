import React, { Component } from 'react';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    Modal,
    Carousel
} from 'antd';
import L from 'leaflet';
import {
    WMSTILELAYERURL,
    TILEURLS,
    INITLEAFLET_API
} from '_platform/api';
import { getForestImgUrl } from '_platform/auth';
const FormItem = Form.Item;

class QualityDefectsModal extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            imgList: [],
            loading: false,
            picAutoPlay: ''
        };
    }
    static layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
    };

    componentDidMount = async () => {
        const {
            recordDetail,
            form: { setFieldsValue }
        } = this.props;
        await this.initMap();
        await this.handleLocation(recordDetail);
        let beforeSrc = [];
        let afterSrc = [];
        let imgList = [];
        if (recordDetail && recordDetail.Pics) {
            beforeSrc = this.handleImgClick(recordDetail.Pics);
        }
        if (recordDetail && recordDetail.ReorganizePics) {
            afterSrc = this.handleImgClick(recordDetail.ReorganizePics);
        }
        imgList = beforeSrc.concat(afterSrc);
        let picAutoPlay = '';
        if (imgList.length > 0) {
            picAutoPlay = [];
            picAutoPlay = imgList.map((src) => {
                return (
                    <div>
                        <img src={src} style={{width: 400, height: 400, textAlign: 'center'}} />
                    </div>
                );
            });
        }
        let statusName = '';
        switch (recordDetail.Status) {
            case -1:
                statusName = '已提交';
                break;
            case 0:
                statusName = '未通过';
                break;
            case 1:
                statusName = '整改中';
                break;
            case 2:
                statusName = '整改完成';
                break;
            case 3:
                statusName = '确认完成';
                break;
        }
        await setFieldsValue({
            SXM: recordDetail.SXM || undefined,
            Project: recordDetail.Project || undefined,
            sectionName: recordDetail.sectionName || undefined,
            place: recordDetail.place || undefined,
            ProblemType: recordDetail.ProblemType || undefined,
            CreateTime: recordDetail.CreateTime || undefined,
            Status: statusName || undefined,
            ReorganizeInfo: recordDetail.ReorganizeInfo || undefined,
            Pic: undefined
        });
        this.setState({
            imgList,
            picAutoPlay
        });
    }
    /* 初始化地图 */
    initMap () {
        try {
            let mapInitialization = INITLEAFLET_API;
            mapInitialization.crs = L.CRS.EPSG4326;
            mapInitialization.attributionControl = false;
            this.map = L.map('mapid', mapInitialization);
            // 加载基础图层
            this.tileLayer = L.tileLayer(TILEURLS[1], {
                // subdomains: [3],
                subdomains: [0, 1, 2, 3, 4, 5, 6, 7], // 天地图有7个服务节点，代码中不固定使用哪个节点的服务，而是随机决定从哪个节点请求服务，避免指定节点因故障等原因停止服务的风险
                minZoom: 15,
                maxZoom: 17,
                zoomOffset: 1
            }).addTo(this.map);
            // 地图上边的地点的名称
            L.tileLayer(WMSTILELAYERURL, {
                // subdomains: [3],
                subdomains: [0, 1, 2, 3, 4, 5, 6, 7],
                minZoom: 15,
                maxZoom: 17,
                zoomOffset: 1
            }).addTo(this.map);
        } catch (e) {
            console.log('initMap', e);
        }
    }
    // 定位
    handleLocation = (recordDetail) => {
        L.marker([recordDetail.Y, recordDetail.X]).addTo(this.map);
        this.map.panTo([recordDetail.Y, recordDetail.X]);
    }
    // 处理图片
    handleImgClick (data) {
        let srcs = [];
        try {
            if (data) {
                let arr = data.split(',');
                arr.map(rst => {
                    let src = getForestImgUrl(rst);
                    srcs.push(src);
                });
            }
        } catch (e) {
            console.log('处理图片', e);
        }
        return srcs;
    }
    handleCancel = async () => {
        this.setState({
            loading: false
        });
        this.props.handleCancel();
    }

    render () {
        const {
            form: {
                getFieldDecorator
            }
        } = this.props;
        const {
            picAutoPlay
        } = this.state;
        return (
            <div>
                <Modal
                    title='查看详情'
                    visible
                    onCancel={this.handleCancel.bind(this)}
                    footer={null}
                >
                    <Form>
                        <Row>
                            <div
                                id='mapid'
                                style={{
                                    height: 300,
                                    borderLeft: '1px solid #ccc'
                                }}
                            />
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Row>
                                    <Col span={24}>
                                        <FormItem
                                            {...QualityDefectsModal.layout}
                                            label='二维码'
                                        >
                                            {getFieldDecorator('SXM', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请输入二维码'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入二维码' readOnly />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...QualityDefectsModal.layout}
                                            label='项目'
                                        >
                                            {getFieldDecorator('Project', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message:
                                                            '请输入项目'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入项目' readOnly />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...QualityDefectsModal.layout}
                                            label='标段'
                                        >
                                            {getFieldDecorator('sectionName', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message:
                                                            '请输入标段'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入标段' readOnly />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...QualityDefectsModal.layout}
                                            label='位置'
                                        >
                                            {getFieldDecorator('place', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请输入位置'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入位置' readOnly />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...QualityDefectsModal.layout}
                                            label='缺陷类型'
                                        >
                                            {getFieldDecorator('ProblemType', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请输入缺陷类型'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入缺陷类型' readOnly />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...QualityDefectsModal.layout}
                                            label='上报时间'
                                        >
                                            {getFieldDecorator('CreateTime', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请输入上报时间'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入上报时间' readOnly />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...QualityDefectsModal.layout}
                                            label='整改状态'
                                        >
                                            {getFieldDecorator('Status', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请输入整改状态'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入整改状态' readOnly />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...QualityDefectsModal.layout}
                                            label='备注'
                                        >
                                            {getFieldDecorator('ReorganizeInfo', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请输入备注'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder='请输入备注' readOnly />
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            {...QualityDefectsModal.layout}
                                            label='图片'
                                        >
                                            {getFieldDecorator('Pics', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '图片'
                                                    }
                                                ]
                                            })(
                                                <div>
                                                    {
                                                        picAutoPlay
                                                            ? (
                                                                <Carousel autoplay>
                                                                    {picAutoPlay}
                                                                </Carousel>
                                                            ) : '暂无'
                                                    }
                                                </div>

                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Button
                                onClick={this.handleCancel.bind(this)}
                                style={{ float: 'right' }}
                                type='primary'
                            >
                            关闭
                            </Button>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(QualityDefectsModal);
