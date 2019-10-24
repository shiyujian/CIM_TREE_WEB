import React, { Component } from 'react';
import {
    Table,
    Button,
    DatePicker,
    Tabs,
    Notification,
    Input,
    Modal,
    Form
} from 'antd';
import moment from 'moment';
import XLSX from 'xlsx';
import L from 'leaflet';
import { formItemLayout } from '_platform/auth';
import './index.less';
import {
    WMSTILELAYERURL,
    TILEURLS
} from '_platform/api';
import zhiguanban from './zhiguanban.png';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
let markerUI;

const { TabPane } = Tabs;
class ModalSee extends Component {
    constructor (props) {
        super(props);
        this.state = {
            lat: '', // 39
            lng: '', // 116
            visibleMap: false,
            QRCode: '', // 二维码
            dataList: [],
            imgViewSrc: '',
            imgViewModalVisible: false,
            meetingRecord: ''
        };
        this.handleCancel = this.handleCancel.bind(this); // 取消创建
        this.handleOk = this.handleOk.bind(this); // 确认查看
    }
    async componentDidMount () {
        this.getDetails();
    }
    initMap () {
        // 基础设置
        let mapInitialization = {
            center: [this.state.lat || 38.99042701799772, this.state.lng || 116.0396146774292],
            zoomControl: false,
            zoom: 13,
            minZoom: 10
        };
        mapInitialization.crs = L.CRS.EPSG4326;
        mapInitialization.attributionControl = false;
        this.map = L.map('mapid', mapInitialization);
        // 基础图层
        this.tileLayer = L.tileLayer(TILEURLS[1], {
            subdomains: [1, 2, 3], // 天地图有7个服务节点，代码中不固定使用哪个节点的服务，而是随机决定从哪个节点请求服务，避免指定节点因故障等原因停止服务的风险
            minZoom: 10,
            maxZoom: 17,
            zoomOffset: 1
        }).addTo(this.map);
        // 道路图层
        L.tileLayer(WMSTILELAYERURL, {
            subdomains: [1, 2, 3],
            minZoom: 10,
            maxZoom: 17,
            zoomOffset: 1
        }).addTo(this.map);
        markerUI = new L.Marker([this.state.lat, this.state.lng]);
        this.map.addLayer(markerUI);
    }
    getDetails () {
        const {
            recordID,
            form: { setFieldsValue },
            actions: { getMeetingDetail }
        } = this.props;
        getMeetingDetail({
            ID: recordID
        }).then(rep => {
            setFieldsValue({
                timeArr: [moment(rep.StartTime), moment(rep.EndTime)],
                MeetingName: rep.MeetingName,
                Location: rep.Location,
                MeetingTheme: rep.MeetingTheme,
                Contacter: rep.Contacter,
                Phone: rep.Phone
            });
            this.setState({
                lat: rep.Y,
                lng: rep.X,
                QRCode: rep.QRCode,
                dataList: rep.Persons,
                meetingRecord: rep
            });
        });
    }
    handleCancel () {
        this.props.handleCancel();
    }
    handleOk () {
        this.props.handleCancel();
    }
    onVisibleMap () {
        this.setState({
            visibleMap: !this.state.visibleMap
        }, () => {
            if (this.state.visibleMap) {
                this.initMap();
            }
        });
    }
    handleImgView (src) {
        this.setState({
            imgViewSrc: src,
            imgViewModalVisible: true
        });
    }
    handleImgViewModalCancel = () => {
        this.setState({
            imgViewSrc: '',
            imgViewModalVisible: false
        });
    }

    handlePlantDataExport = async () => {
        const {
            form: {
                validateFields
            }
        } = this.props;
        const {
            dataList,
            meetingRecord
        } = this.state;
        if (!(dataList && dataList instanceof Array && dataList.length > 0)) {
            Notification.warning({
                message: '数据为空，不能导出',
                duration: 3
            });
            return;
        }
        validateFields((err, values) => {
            if (!err) {
                let meetingName = [`会议名称`, `${values.MeetingName}`];
                let meetingNameData = meetingName.map((data, i) =>
                    Object.assign(
                        {},
                        {
                            v: data, position: String.fromCharCode(65 + i) + 1
                        })).reduce((prev, next) =>
                    Object.assign(
                        {}, prev, {
                            [next.position]: { v: next.v }
                        }), {});
                let timeArr = [
                    `会议时间`,
                    `${moment(meetingRecord.StartTime).format('YYYY-MM-DD HH:mm:ss')} —— ${moment(meetingRecord.EndTime).format('YYYY-MM-DD HH:mm:ss')}`];
                let timeArrData = timeArr.map((data, i) =>
                    Object.assign(
                        {},
                        {
                            v: data, position: String.fromCharCode(65 + i) + 2
                        })).reduce((prev, next) =>
                    Object.assign(
                        {}, prev, {
                            [next.position]: { v: next.v }
                        }), {});
                let location = [`会议地点`, `${values.Location}`];
                let locationData = location.map((data, i) =>
                    Object.assign(
                        {},
                        {
                            v: data, position: String.fromCharCode(65 + i) + 3
                        })).reduce((prev, next) =>
                    Object.assign(
                        {}, prev, {
                            [next.position]: { v: next.v }
                        }), {});
                let meetingTheme = [`会议议题`, `${values.MeetingTheme}`];
                let meetingThemeData = meetingTheme.map((data, i) =>
                    Object.assign(
                        {},
                        {
                            v: data, position: String.fromCharCode(65 + i) + 4
                        })).reduce((prev, next) =>
                    Object.assign(
                        {}, prev, {
                            [next.position]: { v: next.v }
                        }), {});
                let contacter = [`会议联系人`, `${values.Contacter}`, `${values.Phone}`];
                let contacterData = contacter.map((data, i) =>
                    Object.assign(
                        {},
                        {
                            v: data, position: String.fromCharCode(65 + i) + 5
                        })).reduce((prev, next) =>
                    Object.assign(
                        {}, prev, {
                            [next.position]: { v: next.v }
                        }), {});
                let tblData = [];
                dataList.map(item => {
                    let obj = {};
                    obj['姓名'] = item.Name;
                    obj['单位'] = item.Unit;
                    obj['职务'] = item.Duty;
                    obj['电话'] = item.Phone;
                    obj['打卡时间'] = item.CheckTime;
                    tblData.push(obj);
                });
                let _headers = ['姓名', '单位', '职务', '电话', '打卡时间'];
                let headers = _headers.map((data, i) =>
                    Object.assign(
                        {},
                        {
                            v: data, position: String.fromCharCode(65 + i) + 7
                        })).reduce((prev, next) =>
                    Object.assign(
                        {}, prev, {
                            [next.position]: { v: next.v }
                        }), {});
                let tableData = tblData.map((data, i) =>
                    _headers.map((k, j) =>
                        Object.assign(
                            {},
                            {
                                v: data[k],
                                position: String.fromCharCode(65 + j) + (i + 8)
                            }))).reduce((prev, next) =>
                    prev.concat(next)).reduce((prev, next) =>
                    Object.assign(
                        {}, prev, {
                            [next.position]: { v: next.v }
                        }),
                {});
                let output = Object.assign(
                    {},
                    meetingNameData,
                    timeArrData,
                    locationData,
                    meetingThemeData,
                    contacterData,
                    headers,
                    tableData
                );
                // 获取所有单元格的位置
                let outputPos = Object.keys(output);
                // 计算出范围
                let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
                // 构建 workbook 对象
                let wb = {
                    SheetNames: ['mySheet'],
                    Sheets: {
                        'mySheet': Object.assign({}, output, { '!ref': ref })
                    }
                };
                XLSX.writeFile(wb, `会议签到表.xlsx`);
            }
        });
    }
    render () {
        const {
            form: { getFieldDecorator }
        } = this.props;
        const {
            dataList,
            QRCode,
            imgViewModalVisible,
            imgViewSrc
        } = this.state;
        console.log('dataList', dataList);
        let imgViewBut = [
            <Button key='back' size='large' onClick={this.handleImgViewModalCancel.bind(this)}>
                关闭
            </Button>
        ];
        let imgViewFooter = imgViewBut;

        let operations = <Button onClick={this.handlePlantDataExport.bind(this)}>
            导出
        </Button>;
        return (
            <div>
                <Modal
                    title='图片详情'
                    visible={imgViewModalVisible}
                    footer={imgViewFooter}
                    width={495}
                    onOk={this.handleImgViewModalCancel.bind(this)}
                    onCancel={this.handleImgViewModalCancel.bind(this)}
                >
                    <img
                        src={imgViewSrc}
                        style={{ width: '450px', height: '450px' }}
                        alt='图片' />
                </Modal>
                <Modal
                    className='modal_Form'
                    title='查看会议'
                    okButtonProps={{disabled: true}}
                    visible={this.props.showModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                >
                    <div>
                        <Tabs defaultActiveKey='1' tabBarExtraContent={operations}>
                            <TabPane tab='基础信息' key='1'>
                                <Form
                                    {...formItemLayout}
                                >
                                    <FormItem
                                        label='会议二维码'
                                    >
                                        <a>
                                            <img
                                                onClick={this.handleImgView.bind(this, QRCode)}
                                                src={QRCode}
                                                alt='二维码加载失败'
                                                style={{width: 80, height: 80}}
                                            />
                                        </a>
                                    </FormItem>
                                    <FormItem
                                        label='小程序'
                                    >
                                        <a>
                                            <img
                                                onClick={this.handleImgView.bind(this, zhiguanban)}
                                                src={zhiguanban}
                                                alt='二维码加载失败'
                                                style={{width: 80, height: 80}}
                                            />
                                        </a>
                                    </FormItem>
                                    <FormItem
                                        label='会议名称'
                                    >
                                        {
                                            getFieldDecorator('MeetingName', {

                                            })(
                                                <Input
                                                    readOnly
                                                    style={{width: 350}}
                                                    placeholder='请输入'
                                                />
                                            )
                                        }
                                    </FormItem>
                                    <FormItem
                                        label='会议时间'
                                    >
                                        {
                                            getFieldDecorator('timeArr', {

                                            })(
                                                <RangePicker
                                                    disabled
                                                    showTime={{format: 'HH:mm:ss'}}
                                                    format={dateFormat}
                                                    placeholder={['开始时间', '结束时间']}
                                                />
                                            )
                                        }
                                    </FormItem>
                                    <FormItem
                                        label='会议地点'
                                    >
                                        {
                                            getFieldDecorator('Location', {

                                            })(
                                                <Input
                                                    readOnly
                                                    style={{width: 300}}
                                                    placeholder='请输入'
                                                />
                                            )
                                        }
                                        <div style={{display: 'inline-block'}} onClick={this.onVisibleMap.bind(this)}>
                                            <span className='icon_location' />
                                        </div>
                                    </FormItem>
                                    {/* 地图 */}
                                    <div style={{display: this.state.visibleMap ? 'block' : 'none', width: '100%', height: 300, marginBottom: 20, overflow: 'hidden', border: '3px solid #ccc'}}>
                                        <div id='mapid' style={{height: 300, width: '100%'}} />
                                    </div>
                                    <FormItem
                                        label='会议议题'
                                    >
                                        {
                                            getFieldDecorator('MeetingTheme', {

                                            })(
                                                <TextArea
                                                    readOnly
                                                    rows='4'
                                                    style={{width: 350}}
                                                    placeholder='请输入'
                                                />
                                            )
                                        }
                                    </FormItem>
                                    <FormItem
                                        label='会议联系人'
                                    >
                                        {
                                            getFieldDecorator('Contacter', {

                                            })(
                                                <Input
                                                    readOnly
                                                    style={{width: 350}}
                                                    placeholder='请输入'
                                                />
                                            )
                                        }
                                    </FormItem>
                                    <FormItem
                                        label='联系人电话'
                                    >
                                        {
                                            getFieldDecorator('Phone', {

                                            })(
                                                <Input
                                                    readOnly
                                                    style={{width: 350}}
                                                    placeholder='请输入'
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Form>
                            </TabPane>
                            <TabPane tab='参会人员' key='2'>
                                <Table
                                    className='ModalTable'
                                    columns={this.columns}
                                    dataSource={dataList}
                                    pagination={false}
                                    rowKey='ID'
                                    bordered
                                />
                            </TabPane>
                        </Tabs>
                    </div>

                </Modal>
            </div>
        );
    }
    columns = [
        {
            title: '序号',
            dataIndex: 'order',
            render: (text, record, index) => {
                return index + 1;
            }
        },
        {
            title: '姓名',
            width: '100',
            dataIndex: 'Name'
        },
        {
            title: '电话',
            width: '120',
            dataIndex: 'Phone'
        },
        {
            title: '单位',
            width: '120',
            dataIndex: 'Unit'
        },
        {
            title: '职务',
            width: '100',
            dataIndex: 'Duty'
        },
        {
            title: '打卡时间',
            width: '100',
            dataIndex: 'CheckTime'
        }
    ];
}
export default Form.create()(ModalSee);
