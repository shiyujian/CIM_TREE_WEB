import React,{Component} from 'react';
import {Form,Input,Row,Col,Button,Modal,message} from 'antd';
import {Map, TileLayer, Marker} from 'react-leaflet';
import {divIcon,point} from 'leaflet';
import {DefaultZoomLevel} from '_platform/api';
import './video.less';
const Base64 = require('js-base64').Base64;
const FormItem = Form.Item;
const confirm = Modal.confirm;
const URL = window.config.VEC_W;
const icon = divIcon({className: 'videoIcon',iconSize:point(21,26)});

class CameraForm extends Component{

    handleSubmit = (e) => {
        e.preventDefault();
        let me = this;
        const {action} = this.props;

        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
            const {cameraName,ip,port,userName,password,lat,lng,model} = values;
            //新增
            if(action === 'add') {
                const {postVideo} = me.props.actions;
                const {projectNode:{pk,code,obj_type}} = me.props;
                postVideo({}, {
                    "obj_type_hum": "物理位置",
                    "status": "A",
                    "obj_type": "C_LOC",
                    "code": "CAM_"+Date.now(),
                    "name": cameraName,
                    "extra_params": {
                        "username": userName,
                        "description": model,
                        "ip": ip,
                        "lat": lat,
                        "lng": lng,
                        "password": Base64.encode(password),
                        "port": port
                    },
                    "parent": {"pk": pk, "code": code, "obj_type": obj_type}
                }).then(data => {
                    message.success('成功添加摄像头');
                    let {getVideo} = this.props.actions;
                    getVideo();
                    me.props.form.setFieldsValue({cameraName:'',ip:'',port:'',userName:'',password:'',lat:'',lng:''});
                });
            }
            //更新
            if(action === 'update'){
                const {updateVideo} = me.props.actions;
                let {code} = me.props.selectedCamera;
                updateVideo({code:code},{
                    "obj_type_hum": "物理位置",
                    "status": "A",
                    "obj_type": "C_LOC",
                    "name": cameraName,
                    "extra_params": {
                        "username": userName,
                        "description": model,
                        "ip": ip,
                        "lat": lat,
                        "lng": lng,
                        "password": Base64.encode(password),
                        "port": port
                    }
                }).then(data=>{
                    message.success('成功更新摄像头');
                    let {getVideo} = this.props.actions;
                    getVideo();
                })
            }
        });
    }

    formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        }
    };

    deleteCamera= ()=>{
        let {deleteVideo} = this.props.actions;
        let {name,code} = this.props.selectedCamera;
        let me  = this;
        confirm({
            title: '确认删除摄像头?',
            content: `确认是否要删除摄像头【${name}】`,
            onOk() {
                deleteVideo({code}).then(data=>{
                    message.success('成功删除摄像头');
                    let {getVideo,setAcitonType} = me.props.actions;
                    getVideo();
                    setAcitonType('add');
                    me.props.form.setFieldsValue({cameraName:'',ip:'',port:'',userName:'',password:'',lat:'',lng:''});
                });
            },
            onCancel() {

            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {action} = this.props;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem label="名称" {...this.formItemLayout}>
                    {getFieldDecorator('cameraName', {
                        rules: [{ required: true, message: '请输入摄像头名称' }],
                    })(
                        <Input placeholder="摄像头名称" />
                    )}
                </FormItem>
                <FormItem label="外网ip" {...this.formItemLayout}>
                    {getFieldDecorator('ip', {
                        rules: [{ required: true, message: '请输入外网ip' }],
                    })(
                        <Input  type="text" placeholder="ip" />
                    )}
                </FormItem>
                <FormItem label="端口" {...this.formItemLayout}>
                    {getFieldDecorator('port', {
                        rules: [{ required: true, message: '请输入端口' }],
                    })(
                        <Input  type="text" placeholder="端口" />
                    )}
                </FormItem>
                <FormItem label="用户名" {...this.formItemLayout}>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '请输入用户名' }],
                    })(
                        <Input  type="text" placeholder="用户名" />
                    )}
                </FormItem>
                <FormItem label="密码" {...this.formItemLayout}>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码' }],
                    })(
                        <Input  type="text" placeholder="密码" />
                    )}
                </FormItem>
                <FormItem label="型号" {...this.formItemLayout}>
                    {getFieldDecorator('model', {
                        rules: [],
                    })(
                        <Input  type="text" placeholder="密码" />
                    )}
                </FormItem>
                <FormItem label="纬度" {...this.formItemLayout}>
                    {getFieldDecorator('lat', {
                        rules: [{ required: true, message: '请输入纬度' }],
                    })(
                        <Input  type="text" placeholder="纬度" />
                    )}
                </FormItem>
                <FormItem label="经度" {...this.formItemLayout}>
                    {getFieldDecorator('lng', {
                        rules: [{ required: true, message: '请输入经度' }],
                    })(
                        <Input  type="text" placeholder="经度" />
                    )}
                </FormItem>
                <FormItem wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 16, offset: 6 }
                      }}>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        保存
                    </Button>
                    {
                        action === 'update'?
                            <Button type="danger" style={{ marginLeft: 8 }}
                            onClick={this.deleteCamera}>删除</Button>
                            :''
                    }
                </FormItem>
            </Form>
        );
    }
}

const WrappedCameraForm = Form.create()(CameraForm);


class VideoMana extends  Component{

    state={
        pos:null,
        leafletCenter: window.config.initLeaflet.center,
    }

    componentDidMount(){
        const {setAcitonType} = this.props.actions;
        setAcitonType('add');
    }

    setAction(selectedCamera){
        if(selectedCamera){
            const {setAcitonType} = this.props.actions;
            setAcitonType('update');
            let cameraName = selectedCamera.name;
            let extPara = selectedCamera.extra_params;
            let ip = extPara.ip;
            let port = extPara.port;
            let userName = extPara.username;
            let password = Base64.decode(extPara.password);
            let lat = extPara.lat;
            let lng = extPara.lng;
            let model = extPara.description;
            this.refs.cameraForm.setFieldsValue({cameraName,ip,port,userName,password,model,lat,lng});
        }else{
            const {setAcitonType} = this.props.actions;
            setAcitonType('add');
            this.refs.cameraForm.setFieldsValue({cameraName:'',ip:'',port:'',userName:'',password:'',lat:'',lng:''});
        }
    }

    render(){
        const {action,projectNode} = this.props;
        const {leafletCenter} = this.state;
        return (<div>
            <Row>
                <h3>{projectNode?projectNode.name+'-':''}{action === 'add'? "添加摄像头":"更新摄像头"}</h3>
            </Row>
            <Row>
                <Col span={12}>
                    <WrappedCameraForm {...this.props}
                                                       ref="cameraForm"></WrappedCameraForm>
                </Col>
                <Col span={12}>
                    <Map center={leafletCenter} zoom={DefaultZoomLevel} zoomControl={true}
                         style={{position: 'relative', height: 336, width: '100%'}}
                         onClick={(e)=>{
                            this.setState({pos:e.latlng});
                            const {lat,lng} = this.state.pos;
                            this.refs.cameraForm.setFieldsValue({lat:lat.toFixed(8),lng:lng.toFixed(8)});
		                }}>
                        <TileLayer url={URL} subdomains={['7']}/>
                        {
                            this.state.pos?<Marker  icon={icon} key={1} position={this.state.pos} />:''
                        }
                    </Map>
                </Col>
            </Row>
        </div>)
    }
}

export default VideoMana;

