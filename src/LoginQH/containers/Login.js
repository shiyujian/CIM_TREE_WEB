import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../store/login';
import {Row,Col,Select,Form, Icon, Input, Button, Checkbox, message, notification, Radio,Tooltip} from 'antd';
import {setUser, clearUser, setPermissions, removePermissions} from '../../_platform/auth';
import QRCode from '../components/QRCode';
import {base,QRCODE_API} from '_platform/api';
import './Login.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(
	state => ({}),
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
	}),
)
class Login extends Component {

	static propTypes = {};

	constructor(props) {
		super(props);
		this.state = {
			isPwd: true,
			loginState:true,
			forgectState:false,
			appDownload:false,
			token:null,
			QRUrl:'',
			userMessage:null
		};
		this.account = [];
		this.code = [];
		clearUser();
		clearUser();
		clearUser();
		clearUser();
		clearUser();
	}

	componentDidMount() {
		
		let QH_LOGIN_USER = window.localStorage.getItem('QH_LOGIN_USER');
		if (QH_LOGIN_USER) {
			if(QH_LOGIN_USER.username && QH_LOGIN_USER.password){
				console.log('QH_LOGIN_USER',QH_LOGIN_USER)
				QH_LOGIN_USER = JSON.parse(QH_LOGIN_USER) || {};
				const {setFieldsValue} = this.props.form;
				setFieldsValue({
					'username': QH_LOGIN_USER.username,
					'password': QH_LOGIN_USER.password,
				});

				document.getElementById("username").value = QH_LOGIN_USER.username;
				document.getElementById("pwdInp").value = QH_LOGIN_USER.password;
				console.log('componentDidMount=====================')
			}
			// this.loginFunc(QH_LOGIN_USER, 1);
		}
	}

	shouldComponentUpdate(nextProps, nextState){
		let me = this;
		if(this.state.QRUrl != nextState.QRUrl && nextState.QRUrl != ''){
			const{
				QRUrl,
				token,
				loginState
			}=nextState;
			
			const {actions: {getLoginState}} = this.props;

			me.intervalID = setInterval(function(){
				getLoginState({token:token}).then((rst)=>{
					console.log('token',token)
					console.log('rst',rst)
					if(rst && rst.user){
						clearInterval(me.intervalID);
						const {actions: { getTasks}, history: {replace}} = me.props;
						clearUser();
						clearUser();
						clearUser();
						clearUser();
						clearUser();
						removePermissions();
						removePermissions();
						rst = rst.user;
						const data = {
							username: rst.username,
							password: rst.password
						};
						console.log('data',data)
						console.log('id',rst.id)
						getTasks({}, {task: 'processing', executor: rst.id}).then((tasks = []) => {
							notification.open({
								message:  '登录成功',
								description: rst.username
							});
							window.localStorage.setItem('QH_USER_DATA',
								JSON.stringify(rst));
							const {username, id, account = {}, all_permissions: permissions = [], is_superuser=false} = rst;
							const {person_name: name, organization: org, person_code: code,org_code} = account;
							setUser(username, id, name, org, tasks.length, data.password, code,is_superuser,org_code);
							// cookie('QH_USER_DATA', JSON.stringify(userMessage));
							setPermissions(permissions);
							window.localStorage.setItem('QH_LOGIN_USER',JSON.stringify(data));
							window.localStorage.setItem('QH_LOGIN_REMEMBER',false);
							setTimeout(() => {
								replace('/');
							}, 500);
						});
						return true;
					}else if(rst && rst.token){
						console.log('开始递归')
						return true;
					}else{
						notification.error({
							message:  '扫码登录时间已经超时,请刷新网页重新扫码登陆',
							duration: 2,
						})
						clearInterval(me.intervalID);
						return true;
					}
				})
			},5000)
			return true;
		}else if(nextState.loginState){
			clearInterval(me.intervalID);
			return true
		}else{
			return true
		}
	}
	
	render() {
		// console.log('this.props',this.props)
		const {getFieldDecorator} = this.props.form;
		const{
			QRUrl,
			token,
			loginState,
			forgectState,
			appDownload,
			userMessage
		}=this.state
		// const loginTitle = require('../../_layouts/logo.png');
		const loginTitle = require('./images/logo1.png');
		const docDescibe = require('./images/doc.png');
		const hello = require('./images/hello.png');
		const appImg=require('./images/app.png');
		const pwdType = this.state.isPwd ? 'password' : 'text';
		/// 密码输入框类型改变时图标变化
		let chgTypeImg = require('./images/icon_eye1.png');
		if (this.state.isPwd) {
			chgTypeImg = require('./images/icon_eye1.png');
		} else {
			chgTypeImg = require('./images/icon_eye2.png');
		}
		console.log('wwwwwwwwwwwwww',QRUrl)
		let size = 180;
		let level = 'H';
		let bgColor = "#FFFFFF";
		let fgColor = "#000000";

		return (
			<div className="login-wrap">
				<Row>
					<Col span={4}>
                    </Col>
                    <Col span={4} style={{marginTop:'50'}}>
                    	<div style={{width:'300'}} >
							<a className="login-title"><img src={loginTitle}/></a>
						</div>
                    </Col>
                    <Col span={11}>
                    </Col>
                    <Col span={4} style={{marginTop:'100'}}>
                    	<div style={{width:'300'}} >
							<a className="login-title"><img src={hello}/></a>
						</div>
                    </Col>
                </Row>
                <Row style={{height:'60%'}}>
					<Col span={5}>
                    </Col>
                    <Col span={10}>
                    	<div >
							<img style={{width:"100%",height:'100%'}}src={docDescibe}/>
						</div>
                    </Col>
                    <Col span={6} style={{height:'100%'}}>
                    	{	
							loginState? !forgectState?

								<div className="main-box" >
									<Form onSubmit={this.handleSubmit.bind(this)}
										className='login-form' id="loginForm">
										<div style={{padding:'40'}}>
											<p style={{fontSize:'25',color:'#108EE9',textAlign:'center'}}>深林大数据建设管理平台</p>
											<FormItem  style={{marginTop:'10%'}}>
			                                     <Select  placeholder="项目选择">
			                                          <Option value='二'>二</Option>
			                                          <Option value='一'>一</Option>
			                                     </Select>
		                                    </FormItem>
											<FormItem style={{marginTop:'10%'}}>
												{getFieldDecorator('username', {
													rules: [{required: true, message: '请输入用户名'}],
												})(
													<Input id="username"
														placeholder="用户名/手机号"/>,
												)}
											</FormItem>
											<FormItem style={{marginTop:'10%'}}>
												{getFieldDecorator('password', {
													rules: [{required: true, message: '请输入密码'}],
												})(
													<div>
														<Input 
															id='pwdInp' type={pwdType}
															placeholder="密码"/>
														<a className="btn-change-type"
														style={{backgroundImage: `url(${chgTypeImg})`}}
														onClick={this.handleClick.bind(
															this)}/>
													</div>,
												)}
											</FormItem>
											<FormItem style={{marginTop:'10%'}}>
												{getFieldDecorator('remember', {
													valuePropName: 'checked',
													initialValue: false,
												})(
													<div>
													<Checkbox  style={{color:'gray',marginLeft:'10'}} onChange={this.loginRememberChange.bind(this)}>记住密码</Checkbox>
													<span className="forgetPassword" onClick={this.ForgetPassword.bind(this)}>忘记密码</span>
													</div>	
												)}
											</FormItem>
											<Button type="primary" htmlType="submit"
													className="login-form-button">登录</Button>
										</div>
									</Form>
								</div>: 
									<div className="main-box">
									<h1 style ={{textAlign:'center',marginBottom:10,marginTop:20,color:'red'}}></h1>
										<Form onSubmit={this.sureSubmit.bind(this)}
											className='login-form' id="loginForm">
											<div style={{padding:'40'}}>
												<FormItem style={{marginTop:'40'}}>
													{getFieldDecorator('nickname', {
														rules: [{required: true, message: '请输入用户名'}],
													})(
														<Input  id="nickname"
															placeholder="请输入用户名"/>,
													)}
												</FormItem>
						
												<FormItem style={{marginTop:'30'}}>
													{getFieldDecorator('phone', {
														rules: [{required: true, message: '请输入手机号'}],
													})(
														<div>
															<Input 
																id='phoneNumber' 
																placeholder="请输入手机号"
																/>
														</div>,
													)}
												</FormItem>
												<Button type="primary"  onClick={this.cancel.bind(this)} style={{width:'35%',height:'45px',marginTop:50,marginLeft:30,fontSize:18}}>返回</Button>	
												<Button type="primary" htmlType="submit" style={{width:'35%',height:'45px',marginTop:50,marginLeft:30,fontSize:18}}>确定</Button>
											</div>
										</Form>
									
								</div>:
								 appDownload?<div className="imgbox">
									             <a className="Imgtitle"><img src={appImg}/></a>
												 <p onClick={this.backLogin.bind(this)} style={{fontSize:16,color:'white',marginTop:'10',color:'red',cursor:'pointer',textDecoration:'underline',textAlign:'center'}}>返回扫码登录</p>
									         </div>:
											 <div className="picture-box">
												<QRCode {...this.props}
												size={size}
												level={level}
												bgColor={bgColor}
												fgColor={fgColor}
												value={QRUrl}/>
												<p style={{fontSize:16,color:'white',marginTop:'10'}}>请打开移动端"扫一扫"</p>
												<p style={{fontSize:16,color:'white',marginTop:'10'}}>还没有移动端?<span onClick={this.nowDownload.bind(this)} style={{fontSize:16,color:'red',marginTop:'10',textDecoration:'underline',cursor:'pointer' }}>立即下载</span></p>
											 </div>
						}
                    </Col>
                </Row>
            </div>			
		);
	}

	loginRememberChange(e){
		if(e.target.checked){
			window.localStorage.setItem('QH_LOGIN_REMEMBER',true);
		}else{
			window.localStorage.setItem('QH_LOGIN_REMEMBER',false);
		}
	}

	loginChange(e){
		const {actions: {getToken}} = this.props;
		if(e.target.value === 'account'){
			this.setState({
				loginState:true,
				forgectState:false,
				appDownload:false,
				QRUrl:'',
				token:null,
				userMessage:null
			})
		}else if(e.target.value === 'code'){
			getToken().then((rst)=>{
				if(rst.token){
					let token = rst.token;
					let QRUrl = QRCODE_API + rst.url;
					console.log('token',token);
					console.log('QRUrl',QRUrl);
					this.setState({
						token:token,
						QRUrl:QRUrl
					})
				}
			})
			this.setState({
				loginState:false,
				// forgectState:false,
			})
		}
	}
	//忘记密码
	ForgetPassword(){
		this.setState({
			forgectState:true,
			loginState:true,
			appDownload:false,
			QRUrl:'',
			token:null,
			userMessage:null
		})
	}
	//立即下载
	nowDownload(){
		this.setState({
			appDownload:true,
			forgectState:false,
			loginState:false,
			QRUrl:'',
			token:null,
			userMessage:null
		})
	}
	//	忘记密码确定
	sureSubmit(e){
		e.preventDefault();
		const {actions: {forgect}} = this.props;
		this.props.form.validateFieldsAndScroll((err,values) =>{
			if(!err){
				// console.log('values',values)
				// let partn =/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
				let partn=/^1[0-9]{10}$/;
				let phonenumber =values.phone;
				if(!partn.exec(phonenumber)){
					notification.error({
						message:  '手机号输入错误！',
						duration: 2,
					})
				}else{
					const data = {
						username: values.nickname	
					};
					forgect({}, data).then(rst => {
						console.log('rst',rst)
						if(rst.errornum === "400004"){
							notification.error({
								message:  '输入的用户未绑定手机，请联系管理员找回密码！',
								duration: 2,
							})
						}else if(rst.errornum === "400002"){
							notification.error({
								message:  '输入的用户不存在！',
								duration: 2,
							})
						}else if(rst.errornum === "400003"){
							notification.error({
								message:  '找不到与用户关联的人员！',
								duration: 2,
							})
						}else if(rst.errornum === "400005"){
							notification.error({
								message:  '短信发送失败！',
								duration: 2,
							})
						}else{
							this.setState({
								appDownload:false,
								forgectState:false,
								loginState:true,
								QRUrl:'',
								token:null,
								userMessage:null
							})
						}
					})
				}
			}
		})
		
	}
	cancel(){
		this.setState({
			appDownload:false,
			forgectState:false,
			loginState:true,
			QRUrl:'',
			token:null,
			userMessage:null
		})
	}
	//返回登录
	backLogin(){
		this.setState({
			appDownload:false,
			forgectState:false,
			loginState:false,
			QRUrl:'',
			token:null,
			userMessage:null
		})
	}
	handleClick(e) {
		e.preventDefault();
		this.setState({
			isPwd: !this.state.isPwd
		});
	};

	handleSubmit(e) {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('err',err)
				console.log('values',values)
				const data = {
					username: values.username,
					password: values.password
				};
				this.loginFunc(data, 0, values);
			}
		});
	}

	loginFunc(data, loginType, values) {
		const {actions: {login, getTasks}, history: {replace}} = this.props;
		clearUser();
		clearUser();
		clearUser();
		clearUser();
		clearUser();
		removePermissions();
		removePermissions();
		login({}, data).then(rst => {
			if (rst && rst.id) {
				getTasks({}, {task: 'processing', executor: rst.id}).then((tasks = []) => {
					notification.open({
						message: loginType ? '自动登录成功' : '登录成功',
						description: rst.username
					});
					window.localStorage.setItem('QH_USER_DATA',
						JSON.stringify(rst));
					const {username, id, account = {}, all_permissions: permissions = [], is_superuser=false} = rst;
					const {person_name: name, organization: org, person_code: code,org_code} = account;
					setUser(username, id, name, org, tasks.length, data.password, code,is_superuser,org_code);
					// cookie('QH_USER_DATA', JSON.stringify(rst));
					setPermissions(permissions);
					if (loginType === 0) {
						if (values.remember) {
							window.localStorage.setItem('QH_LOGIN_USER',
								JSON.stringify(data));
						} else {
							window.localStorage.removeItem('QH_LOGIN_USER');
						}
					}
					setTimeout(() => {
						replace('/');
					}, 500);
				});

			} else {
				message.error('用户名或密码错误！');
			}
		});
	}
}

export default Form.create()(Login);
