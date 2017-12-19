/**
 * Created by pans0911 on 2017/3/15.
 */
import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox, message, notification, Select} from 'antd';

import styles from './CameraVideo.css';
import {DOWNLOAD_FILE} from '_platform/api';
const Base64 = require('js-base64').Base64;
const $ = window.$;
const WebVideoCtrl = window.WebVideoCtrl;
const FormItem = Form.Item;
const Option = Select.Option;

class CameraVideo extends Component {

	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			loginIPS: [],
			channels: [],
			g_iWndIndex: '',
			showPlugin: true,
			showDownload: false
		}
	}

	// 显示回调信息
	// showCBInfo(szInfo) {
	//     let sInfo = "<div>" + moment().format('YYYY-MM-DD HH:mm:ss') + " " + szInfo + "</div>";
	//     $("#cbinfo").html(sInfo + $("#cbinfo").html());
	// }

	componentDidMount() {
		const that = this;
		if (WebVideoCtrl.I_CheckPluginInstall() == -2) {
			message.error("请切换到IE11+浏览器打开此页面");
			return;
		}
		// 检查插件是否已经安装过
		if (WebVideoCtrl.I_CheckPluginInstall() == -1) {
			this.setState({showPlugin: false, showDownload: true});
			// message.warn("您还未安装过插件，双击开发包目录里的WebComponents.exe安装！");
			return;
		}
		// 初始化插件参数及插入插件
		WebVideoCtrl.I_InitPlugin('100%', '100%', {
			iWndowType: 2,
			cbSelWnd: (xmlDoc) => {
				let g_iWndIndex = $(xmlDoc).find("SelectWnd").eq(0).text();
				let szInfo = "当前选择的窗口编号：" + g_iWndIndex;
				that.setState({
					g_iWndIndex: g_iWndIndex,
				});
				// that.showCBInfo(szInfo);
			}
		});
		WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
		WebVideoCtrl.I_ChangeWndNum(1);
		that.loginSubmit();
		// 检查插件是否最新
		if (WebVideoCtrl.I_CheckPluginVersion() == -1) {
			message.warn("检测到新的插件版本，双击开发包目录里的WebComponents.exe升级！");
			return;
		}
	}

	componentWillUnmount() {
		this.state.loginIPS.forEach(szIP => {
			var iRet = WebVideoCtrl.I_Logout(szIP);
		});
		this.setState({loginIPS: []});
	}

	//开始登陆
	loginSubmit() {
		// e.preventDefault();
		const that = this;
		this.props.form.validateFields(['loginip', 'port', 'username', 'password'], (err, values) => {
			if (!err) {
				let szIP = values.loginip,
					szPort = values.port,
					szUsername = values.username,
					szPassword = values.password;
				let iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
					success: (xmlDoc) => {
						// message.success(szIP + " 登录成功！");
						// that.setState({
						// 	szIP: szIP
						// });
						that.setState({
							loginIPS: that.state.loginIPS.concat(szIP)
						});
						// $("#ip").prepend("<option value='" + szIP + "'>" + szIP + "</option>");
						setTimeout(function () {
							// 	$("#ip").val(szIP);
							that.getChannelInfo(szIP);
						}, 10);
					},
					error: () => {
						message.error(szIP + " 登录失败！");
					}
				});

				if (-1 == iRet) {
					that.setState({
						loginIPS: that.state.loginIPS.concat(szIP)
					});
					message.warning(szIP + " 已登录过！");
					that.getChannelInfo(szIP);
				}
			}
		});
	}

	// 获取通道
	getChannelInfo(value) {
		const that = this;
		// that.setState({
		// 	szIP: value
		// });
		let szIP = value,
			// oSel = $("#channels").empty(),
			nAnalogChannel = 0;
		//清空通道列表
		this.setState({
			channels: [],
		});
		if ("" == szIP) {
			return;
		}

		// 模拟通道
		WebVideoCtrl.I_GetAnalogChannelInfo(szIP, {
			async: false,
			success: (xmlDoc) => {
				let oChannels = $(xmlDoc).find("VideoInputChannel");
				nAnalogChannel = oChannels.length;

				$.each(oChannels, function (i) {
					let id = parseInt($(this).find("id").eq(0).text(), 10),
						name = $(this).find("name").eq(0).text();
					if ("" == name) {
						name = "Camera " + (id < 9 ? "0" + id : id);
					}
					that.setState({
						channels: that.state.channels.concat({
							name: name,
							id: id,
							bZero: false,
						})
					});
					// oSel.append("<option value='" + id + "' bZero='false'>" + name + "</option>");
				});
				// message.success(szIP + " 获取模拟通道成功！");
				// showOPInfo(szIP + " 获取模拟通道成功！");
			},
			error: () => {
				// message.error(szIP + " 获取模拟通道失败！");
				// showOPInfo(szIP + " 获取模拟通道失败！");
			}
		});
		// 数字通道
		WebVideoCtrl.I_GetDigitalChannelInfo(szIP, {
			async: false,
			success: (xmlDoc) => {
				let oChannels = $(xmlDoc).find("InputProxyChannelStatus");
				$.each(oChannels, function (i) {
					let id = parseInt($(this).find("id").eq(0).text(), 10),
						name = $(this).find("name").eq(0).text(),
						online = $(this).find("online").eq(0).text();
					if ("false" == online) {// 过滤禁用的数字通道
						return true;
					}
					if ("" == name) {
						name = "IPCamera " + ((id - nAnalogChannel) < 9 ? "0" + (id - nAnalogChannel) : (id - nAnalogChannel));
					}
					that.setState({
						channels: that.state.channels.concat({
							name: name,
							id: id,
							bZero: false,
						})
					});
					// oSel.append("<option value='" + id + "' bZero='false'>" + name + "</option>");
				});
				// message.success(szIP + " 获取数字通道成功！");
				// showOPInfo(szIP + " 获取数字通道成功！");
			},
			error: () => {
				// message.error(szIP + " 获取数字通道失败！");
				// showOPInfo(szIP + " 获取数字通道失败！");
			}
		});
		// 零通道
		WebVideoCtrl.I_GetZeroChannelInfo(szIP, {
			async: false,
			success: (xmlDoc) => {
				let oChannels = $(xmlDoc).find("ZeroVideoChannel");

				$.each(oChannels, function (i) {
					let id = parseInt($(this).find("id").eq(0).text(), 10),
						name = $(this).find("name").eq(0).text();
					if ("" == name) {
						name = "Zero Channel " + (id < 9 ? "0" + id : id);
					}
					if ("true" == $(this).find("enabled").eq(0).text()) {// 过滤禁用的零通道
						that.setState({
							channels: that.state.channels.concat({
								name: name,
								id: id,
								bZero: true,
							})
						});
						// oSel.append("<option value='" + id + "' bZero='true'>" + name + "</option>");
					}
				});
				// message.success(szIP + " 获取零通道成功！");
				// showOPInfo(szIP + " 获取零通道成功！");
			},
			error: () => {
				// message.error(szIP + " 获取零通道失败！");
				// showOPInfo(szIP + " 获取零通道失败！");
			}
		});
		setTimeout(function () {
			that.clickStartRealPlay();
		}, 1000);
	}

	//开始预览
	clickStartRealPlay() {
		const that = this;
		// this.props.form.validateFields(['ip', 'channels', 'streamtype'], (err, values) => {
		//     if (!err) {
		let oWndInfo = WebVideoCtrl.I_GetWindowStatus(that.state.g_iWndIndex),
			szIP = that.state.loginIPS[0],
			iStreamType = parseInt('1', 10),
			iChannelID = parseInt(that.state.channels[0].id, 10),
			bZeroChannel = false;
		this.state.channels.forEach(channel => {
			if (channel.id == iChannelID) {
				bZeroChannel = channel.bZero;
			}
		});
		// if ("" == szIP) {
		// 	return;
		// }
		if (oWndInfo != null) {// 已经在播放了，先停止
			WebVideoCtrl.I_Stop();
		}
		let iRet = WebVideoCtrl.I_StartRealPlay(szIP, {
			iStreamType: iStreamType,
			iChannelID: iChannelID,
			bZeroChannel: bZeroChannel
		});
		if (0 == iRet) {
			message.success("开始预览成功！")
		} else {
			message.error("开始预览失败！")
		}
		// }
		// })
	}

	render() {
		const {getFieldDecorator} = this.props.form;
		const formItemLayout = {
			labelCol: {span: 6},
			wrapperCol: {span: 14},
		};
		const {ip, port, username, password} = this.props.properties;
		return (
			<div style={{width: '100%', height: '100%'}}>
				{
					this.state.showPlugin ?
						<div id="divPlugin" className="plugin" style={{width: '100%', height: '100%'}}></div>
						: ''
				}
				<div id="cbinfo"></div>
				{
					this.state.showDownload ? (
						<div className={styles.downLoadPlugin}>
							<div>
								<a href={`${DOWNLOAD_FILE}/media/documents/meta/WebComponentsKithas_rem_cfg.exe`}
								   style={{'font-size': '16px'}}>未安装插件,请下载视频监控插件</a>
								<p style={{color: 'red'}}>注意先关闭浏览器再安装插件</p>
							</div>
						</div>) : ''
				}
				<fieldset className={styles.DisplayNone} style={{display:'none'}} >
					<legend>登录</legend>
					<Form onSubmit={this.loginSubmit.bind(this)}>
						<FormItem label='IP地址'
						          {...formItemLayout}
						>
							{getFieldDecorator('loginip', {
								//initialValue: '172.17.1.153',
								initialValue: ip,
								rules: [
									{required: true, message: '请输入IP地址！'},
								],
							})(
								<Input type='text' placeholder="请输入IP地址！"/>
							)}
						</FormItem>
						<FormItem label='端口号' {...formItemLayout}>
							{getFieldDecorator('port', {
								//initialValue: '80',
								initialValue: port,
								rules: [{required: true, message: '请输入端口号！'}],
							})(
								<Input type='text' placeholder="请输入端口号"/>
							)}
						</FormItem>
						<FormItem label='用户名' {...formItemLayout}>
							{getFieldDecorator('username', {
								//initialValue: 'hdy',
								initialValue: username,
								rules: [{required: true, message: '请输入用户名！'}],
							})(
								<Input type='text' placeholder="请输入用户名"/>
							)}
						</FormItem>
						<FormItem label='密码' {...formItemLayout}>
							{getFieldDecorator('password', {
								// initialValue: 'ecidi2017',
								initialValue: password,
								// initialValue: password?Base64.decode(password):'cuilu54007',
								rules: [{required: true, message: '请输入密码！'}],
							})(
								<Input type='password' placeholder="请输入密码"/>
							)}
						</FormItem>
						<FormItem label='设备端口（可选参数）' {...formItemLayout}>
							{getFieldDecorator('deviceport', {
								initialValue: '8000',
							})(
								<Input type='text' placeholder="设备端口（可选参数）"/>
							)}
						</FormItem>
						<FormItem
							wrapperCol={{span: 12, offset: 6}}
						>
							<Button type="primary" htmlType="submit" size="large">登录</Button>
						</FormItem>
					</Form>

				</fieldset>
				<fieldset className={styles.DisplayNone} style={{display:'none'}}>
					<legend>预览</legend>
					<Form>
						<FormItem label='已登录设备' {...formItemLayout}>
							{getFieldDecorator('ip', {
								initialValue: '',
								rules: [{required: true, message: '请选择登录的设备！'}],
							})(
								<Select onChange={this.getChannelInfo.bind(this)} notFoundContent="暂无登录设备">
									{
										this.state.loginIPS.map((ip, index) => {
											return <Option value={ip} key={index}>{ip}</Option>
										})
									}
								</Select>
							)}
						</FormItem>
						<FormItem label='通道列表' {...formItemLayout}>
							{getFieldDecorator('channels', {
								initialValue: '',
								rules: [{required: true, message: '请选择通道！'}],
							})(
								<Select notFoundContent="暂无通道">
									{
										this.state.channels.map((channel, index) => {
											return <Option value={String(channel.id)} key={index}>{channel.name}</Option>
										})
									}
								</Select>
							)}
						</FormItem>
						<FormItem label='码流类型' {...formItemLayout}>
							{getFieldDecorator('streamtype', {
								initialValue: '1',
							})(
								<Select>
									<Option value="1" key="1">主码流</Option>
									<Option value="2" key="2">子码流</Option>
									<Option value="3" key="3">第三码流</Option>
									<Option value="4" key="4">转码码流</Option>
								</Select>
							)}
						</FormItem>
						<FormItem
							wrapperCol={{span: 12, offset: 6}}
						>
							<Button type="primary" size="large" onClick={this.clickStartRealPlay.bind(this)}>开始预览</Button>
						</FormItem>
					</Form>
				</fieldset>
			</div>
		);
	}
}
export default CameraVideo = Form.create()(CameraVideo);

