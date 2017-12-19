/**
 * Created by tinybear on 17/8/8.
 * 视频监控
 */
import React,{Component} from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {actions} from '../../store'
import {message,Row,Col,Button,Modal,Form,Input} from 'antd';
import { VIDEO_PLUGIN_URL } from '../../../_platform/api'
import './Camera.less';
const Base64 = require('js-base64').Base64;
const WebVideoCtrl = window.WebVideoCtrl;
const FormItem = Form.Item;

let g_iWndIndex = 0;

@connect(
	state => {
        const {video} = state;
        return {video};
	},
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
	}),
)

class FormSetting extends Component{

    componentDidMount(){
        this.getLocalCfg();
        this.props.form.setFieldsValue({CapturePath:this.CapturePath,RecordPath:this.RecordPath});
    }

    BufferNumberType = "";
    PlayWndType = "";
    IVSMode = "";
    CaptureFileFormat = "";
    PackgeSize = "";
    RecordPath = "";
    DownloadPath = "";
    CapturePath = "";
    PlaybackPicPath = "";
    PlaybackFilePath = "";
    ProtocolType = "";

    getLocalCfg() {
        var xmlDoc = WebVideoCtrl.I_GetLocalCfg();
        this.BufferNumberType =  xmlDoc.getElementsByTagName('BuffNumberType')[0].textContent;
        this.PlayWndType = xmlDoc.getElementsByTagName('PlayWndType')[0].textContent;
        this.IVSMode = xmlDoc.getElementsByTagName('IVSMode')[0].textContent;
        this.CaptureFileFormat = xmlDoc.getElementsByTagName('CaptureFileFormat')[0].textContent;
        this.PackgeSize = xmlDoc.getElementsByTagName('PackgeSize')[0].textContent;
        this.RecordPath = xmlDoc.getElementsByTagName('RecordPath')[0].textContent;
        this.DownloadPath = xmlDoc.getElementsByTagName('DownloadPath')[0].textContent;
        this.CapturePath = xmlDoc.getElementsByTagName('CapturePath')[0].textContent;
        this.PlaybackPicPath = xmlDoc.getElementsByTagName('PlaybackPicPath')[0].textContent;
        this.PlaybackFilePath = xmlDoc.getElementsByTagName('PlaybackFilePath')[0].textContent;
        this.ProtocolType = xmlDoc.getElementsByTagName('ProtocolType')[0].textContent;
    }

    SetLocalCfg() {
        var arrXml = [],
            szInfo = "";

        arrXml.push("<LocalConfigInfo>");
        arrXml.push("<PackgeSize>" + this.PackgeSize + "</PackgeSize>");
        arrXml.push("<PlayWndType>" + this.PlayWndType + "</PlayWndType>");
        arrXml.push("<BuffNumberType>" + this.BufferNumberType + "</BuffNumberType>");
        arrXml.push("<RecordPath>" + this.RecordPath + "</RecordPath>");
        arrXml.push("<CapturePath>" + this.CapturePath + "</CapturePath>");
        arrXml.push("<PlaybackFilePath>" + this.PlaybackFilePath + "</PlaybackFilePath>");
        arrXml.push("<PlaybackPicPath>" + this.PlaybackPicPath + "</PlaybackPicPath>");
        arrXml.push("<DownloadPath>" + this.DownloadPath + "</DownloadPath>");
        arrXml.push("<IVSMode>" + this.IVSMode + "</IVSMode>");
        arrXml.push("<CaptureFileFormat>" + this.CaptureFileFormat + "</CaptureFileFormat>");
        arrXml.push("<ProtocolType>" + this.ProtocolType + "</ProtocolType>");
        arrXml.push("</LocalConfigInfo>");

        var iRet = WebVideoCtrl.I_SetLocalCfg(arrXml.join(""));

        if (0 == iRet) {
            szInfo = "本地配置设置成功！";
        } else {
            szInfo = "本地配置设置失败！";
        }
        message.info(szInfo);
    }

    clickOpenFileDlg(id, iType) {
        var szDirPath = WebVideoCtrl.I_OpenFileDlg(iType);

        if (szDirPath != -1 && szDirPath != "" && szDirPath != null) {
            this.props.form.setFieldsValue({[id]:szDirPath});
        }
    }

    submit=(e)=>{
        e.preventDefault();
        let me  = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                me.RecordPath = values.RecordPath;
                me.CapturePath = values.CapturePath;
                me.SetLocalCfg();
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };

        return (
            <Form onSubmit={this.submit}>
                <FormItem {...formItemLayout} label="录像保存文件路径">
                    <Row gutter={8}>
                        <Col span={20}>
                            {getFieldDecorator('RecordPath', {
                                rules: [{ required: true, message: '请选择录像文件路径' }],
                            })(
                                <Input size="large" />
                            )}
                        </Col>
                        <Col span={4}>
                            <Button size="large" onClick={()=>{
                                    this.clickOpenFileDlg('RecordPath',0)
                                }}>浏览</Button>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem {...formItemLayout} label="预览抓图保存路径">
                    <Row gutter={8}>
                        <Col span={20}>
                            {getFieldDecorator('CapturePath', {
                                rules: [{ required: true, message: '请选择抓图文件路径' }],
                            })(
                                <Input size="large" />
                            )}
                        </Col>
                        <Col span={4}>
                            <Button size="large" onClick={()=>{
                                    this.clickOpenFileDlg('CapturePath',0)
                                }}>浏览</Button>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 16, offset: 8 },
                    }}
                    >
                    <Button type="primary" htmlType="submit">保存</Button>
                </FormItem>
            </Form>
        )
    }
}

const WrappedFormSetting = Form.create()(FormSetting);

class Camera extends Component{

    constructor(props){
        super(props);
        this.state={
            szIP :'58.250.17.151',
            szPort : '8081',
            szUsername :'admin',
            szPassword : 'cuilu54007',
            settingVisible:false,
            isRecording : false,
            panelVisible: true,
        }
        this.isInited = false;
        this.contentHeight = 0;
    }

    componentDidMount(){
        // this.contentHeight = document.querySelector('html').clientHeight - 80 - 36 - 52;
        this.contentHeight = 600
        this.initPlugin();
    }

    componentWillUnmount() {
        // var iRet = WebVideoCtrl.I_Logout(this.state.szIP);
        this.logout();
    }

    loadCamera(camera){
        console.log('camera: ', camera)
        let {ip,port,username,password} = camera
        let me = this;
        this.setState({szIP:ip,szPort:port,szUsername:username,
            szPassword:password?Base64.decode(password):'cuilu54007'},()=>{
            if(this.isInited) {
                WebVideoCtrl.I_Logout(this.state.szIP);
                me.login();
            }
        });
    }

    initPlugin(){
        // 检查插件是否已经安装过
        var iRet = WebVideoCtrl.I_CheckPluginInstall();
        if (-2 == iRet) {
            message.info("您的Chrome浏览器版本过高，不支持NPAPI插件！");
            this.setState({panelVisible: false})
            return;
        } else if (-1 == iRet) {
            message.info("您还未安装过插件，请安装WebComponentsKit.exe插件");
            document.querySelector('#root').insertAdjacentHTML('afterend',
            '<iframe src="'+`${VIDEO_PLUGIN_URL}`+'" style="display: none"></iframe>')
            this.setState({panelVisible: false})
            return;
        }

        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin('100%', (this.contentHeight||500) - 100, {
            bWndFull: false,//是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
            iWndowType: 1,
            cbSelWnd: function (xmlDoc) {
                // g_iWndIndex = $(xmlDoc).find("SelectWnd").eq(0).text();
                var szInfo = "当前选择的窗口编号：" + g_iWndIndex;
                console.log(szInfo);
            }
        });
        WebVideoCtrl.I_InsertOBJECTPlugin("cameraWndPlugin");
        this.isInited = true;
        return true;
    }

    //登录
    login() {
        let me = this;
        var szIP = this.state.szIP,
            szPort = this.state.szPort,
            szUsername = this.state.szUsername,
            szPassword = this.state.szPassword;

        if ("" == szIP || "" == szPort) {
            return;
        }

        var iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
            success: function (xmlDoc) {
                console.log(szIP + " 登录成功！");
                me.startRealPlay();
            },
            error: function () {
                console.log(szIP + " 登录失败！");
            }
        });

        if (-1 == iRet) {
            console.log(szIP + " 已登录过！");
        }
    }

    logout() {
        var szIP = this.state.szIP,
            szInfo = "";

        if (szIP == "") {
            return;
        }

        var iRet = WebVideoCtrl.I_Logout(szIP);
        if (0 == iRet) {
            szInfo = "退出成功！";
        } else {
            szInfo = "退出失败！";
        }
        console.log(szInfo);
    }

    //开始预览
    startRealPlay() {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
            szIP = this.state.szIP,
            iStreamType = 1,
            iChannelID = 1,
            bZeroChannel = true,
            szInfo = "";

        if ("" == szIP) {
            return;
        }

        if (oWndInfo != null) {// 已经在播放了，先停止
            WebVideoCtrl.I_Stop();
        }

        var iRet = WebVideoCtrl.I_StartRealPlay(szIP, {
            iStreamType: iStreamType,
            iChannelID: iChannelID,
            bZeroChannel: bZeroChannel
        });

        if (0 == iRet) {
            szInfo = "开始预览成功！";
        } else {
            szInfo = "开始预览失败！";
        }

        console.log(szIP + " " + szInfo);
    }

    // 停止预览
    stopRealPlay() {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
            szInfo = "";

        if (oWndInfo != null) {
            var iRet = WebVideoCtrl.I_Stop();
            if (0 == iRet) {
                szInfo = "停止预览成功！";
            } else {
                szInfo = "停止预览失败！";
            }
            console.log(oWndInfo.szIP + " " + szInfo);
        }
    }

    //云台控制
    g_bPTZAuto = false;
    PTZControl = (iPTZIndex)=>{
        var iPTZSpeed = 1,me = this;

        if (9 == iPTZIndex && me.g_bPTZAuto) {
            iPTZSpeed = 0;// 自动开启后，速度置为0可以关闭自动
        } else {
            me.g_bPTZAuto = false;// 点击其他方向，自动肯定会被关闭
        }

        WebVideoCtrl.I_PTZControl(iPTZIndex, false, {
            iPTZSpeed: iPTZSpeed,
            success: function (xmlDoc) {
                if (9 == iPTZIndex) {
                    me.g_bPTZAuto = !me.g_bPTZAuto;
                }
                console.log(" 开启云台成功！");
            },
            error: function () {
                message.error(" 开启云台失败！");
            }
        });
    }

    PTZZoomIn() {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(10, false, {
                iWndIndex: g_iWndIndex,
                success: function (xmlDoc) {
                    console.log(oWndInfo.szIP + " 调焦+成功！");
                },
                error: function () {
                    message.error(oWndInfo.szIP + "  调焦+失败！");
                }
            });
        }
    }

    PTZZoomout() {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(11, false, {
                iWndIndex: g_iWndIndex,
                success: function (xmlDoc) {
                    console.log(oWndInfo.szIP + " 调焦-成功！");
                },
                error: function () {
                    message.error(oWndInfo.szIP + "  调焦-失败！");
                }
            });
        }
    }

    PTZZoomStop() {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

        if (oWndInfo != null) {
            WebVideoCtrl.I_PTZControl(11, true, {
                iWndIndex: g_iWndIndex,
                success: function (xmlDoc) {
                    console.log(oWndInfo.szIP + " 调焦停止成功！");
                },
                error: function () {
                    console.log(oWndInfo.szIP + "  调焦停止失败！");
                }
            });
        }
    }

    // 全屏
    clickFullScreen() {
        WebVideoCtrl.I_FullScreen(true);
    }

    //截图
    capturePic() {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
            szInfo = "";

        if (oWndInfo != null) {
            var szChannelID = 1,
                szPicName = oWndInfo.szIP + "_" + szChannelID + "_" + new Date().getTime(),
                iRet = WebVideoCtrl.I_CapturePic(szPicName);
            if (0 == iRet) {
                szInfo = "抓图成功！";
            } else {
                szInfo = "抓图失败！";
            }
            message.info(oWndInfo.szIP + " " + szInfo);
        }
    }


    StartRecord() {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
            szInfo = "";

        if (oWndInfo != null) {
            var szChannelID = 1,
                szFileName = oWndInfo.szIP + "_" + szChannelID + "_" + new Date().getTime(),
                iRet = WebVideoCtrl.I_StartRecord(szFileName);
            if (0 == iRet) {
                szInfo = "开始录像成功！";
                this.setState({isRecording:true});
            } else {
                szInfo = "开始录像失败！";
            }
            message.info(oWndInfo.szIP + " " + szInfo);
        }
    }

    stopRecord() {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
            szInfo = "";

        if (oWndInfo != null) {
            var iRet = WebVideoCtrl.I_StopRecord();
            if (0 == iRet) {
                szInfo = "停止录像成功！";
                this.setState({isRecording:false});
            } else {
                szInfo = "停止录像失败！";
            }
            message.info(oWndInfo.szIP + " " + szInfo);
        }
    }

    generateRecord = () => {
        this.props.openUploadModal()
        this.props.closeCamera()
    }

    render() {
        return (
            <div style={{'position':'relative',height:this.contentHeight+'px'}}>
                <div className="camera-box">
                    <div id="cameraWndPlugin" style={{width:'100%'}} className={this.state.settingVisible?'hide':''}></div>
                    {/* <div className="camera-toolbar" style={this.state.panelVisible ? {} : {display: 'none'}}> */}
                    <div className="camera-toolbar">
                        <Row gutter={8}>
                            <Col span={12}>
                                <div className="camera-ptz" >
                                    <Row style={{height: 30}} gutter={8}>
                                        <Col span={6}><Button onClick={this.PTZControl.bind(this,5)}>左上</Button></Col>
                                        <Col span={6}><Button onClick={this.PTZControl.bind(this,1)}>上</Button></Col>
                                        <Col span={6}><Button onClick={this.PTZControl.bind(this,7)}>右上</Button></Col>
                                        <Col span={6}><Button onMouseDown={this.PTZZoomIn} onMouseUp={this.PTZZoomStop}>放大</Button></Col>
                                    </Row>
                                    <Row style={{height: 30}} gutter={8}>
                                        <Col span={6}><Button onClick={this.PTZControl.bind(this,3)}>左</Button></Col>
                                        <Col span={6}><Button onClick={this.PTZControl.bind(this,9)}>自动</Button></Col>
                                        <Col span={6}><Button onClick={this.PTZControl.bind(this,4)}>右</Button></Col>
                                    </Row>
                                    <Row style={{height: 30}} gutter={8}>
                                        <Col span={6}><Button onClick={this.PTZControl.bind(this,6)}>左下</Button></Col>
                                        <Col span={6}><Button onClick={this.PTZControl.bind(this,2)}>下</Button></Col>
                                        <Col span={6}><Button onClick={this.PTZControl.bind(this,8)}>右下</Button></Col>
                                        <Col span={6}><Button onMouseDown={this.PTZZoomout} onMouseUp={this.PTZZoomStop}>缩小</Button></Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="camera-ptx" >
                                    <Row style={{height: 30}} gutter={8}>
                                        <Col span={6} offset={12}><Button onClick={()=>{ this.capturePic(); }}>截图</Button></Col>
                                        <Col span={6} ><Button onClick={()=>{ this.state.isRecording?this.stopRecord():this.StartRecord(); }}>{this.state.isRecording?"结束录像":"开始录像"}</Button></Col>
                                    </Row>
                                    <Row style={{height: 30}} gutter={8}>
                                        <Col span={6} offset={18}> <Button onClick={()=>{this.generateRecord()}} >生成记录</Button> </Col>
                                    </Row>
                                    <Row style={{height: 30}} gutter={8}>
                                        <Col span={6} offset={12}><Button onClick={()=>{ this.stopRealPlay(); this.logout(); }}>停止播放</Button></Col>
                                        <Col span={6} ><Button onClick={()=>{this.setState({settingVisible:true})}}>保存路径</Button></Col>
                                    </Row>
                                </div>
                                    {/* <Button className="r" onClick={this.clickFullScreen}>全屏</Button> */}
                                    {/* <Button className="r">2x2</Button>
                                    <Button className="r">1x1</Button> */}
                            </Col>
                        </Row>
                    </div>
                </div>
                <Modal title="设置"
                   visible={this.state.settingVisible}
                   onCancel={()=>{
                        this.setState({settingVisible:false})
                   }}
                   className="setting-modal"
                >
                    <WrappedFormSetting></WrappedFormSetting>
                </Modal>
        </div>)
    }
}

export default Camera;
