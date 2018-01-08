import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../store/login';
import {Form, Icon, Input, Button, Checkbox, message, notification, Radio,Tooltip} from 'antd';
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
		const formItemLayout = {
			labelCol:{
				xs :{span:24},
				sm :{span:8},
			},
			wrapperCol :{
				xs :{span:24},
				sm :{span:16},
			}
		}

		return (
			<div className="login-wrap">
				<div className="img-box">
					<a className="login-title"><img src={loginTitle}/></a>
				</div>
				<div className="loginState-box">
					<RadioGroup  className="radio" onChange={this.loginChange.bind(this)} defaultValue="account" style={{width:'100%'}}>
						<RadioButton value="account">账号登录</RadioButton>
						<RadioButton value="code">扫码登录</RadioButton>
					</RadioGroup>
				</div>
				{	
					loginState? !forgectState?
						<div className="main-box">
							<Form onSubmit={this.handleSubmit.bind(this)}
								className='login-form' id="loginForm">
								<FormItem>
									{getFieldDecorator('username', {
										rules: [{required: true, message: '请输入用户名'}],
									})(
										<Input addonBefore={<Icon type="user"/>} id="username"
											placeholder="请输入用户名"/>,
									)}
								</FormItem>
								<FormItem>
									{getFieldDecorator('password', {
										rules: [{required: true, message: '请输入密码'}],
									})(
										<div>
											<Input addonBefore={<Icon type="lock"/>}
												id='pwdInp' type={pwdType}
												placeholder="请输入密码"/>
											<a className="btn-change-type"
											style={{backgroundImage: `url(${chgTypeImg})`}}
											onClick={this.handleClick.bind(
												this)}/>
										</div>,
									)}
								</FormItem>
								<FormItem>
									{getFieldDecorator('remember', {
										valuePropName: 'checked',
										initialValue: false,
									})(
										<div>
										<Checkbox onChange={this.loginRememberChange.bind(this)}>记住密码</Checkbox>
										<span className="forgetPassword" onClick={this.ForgetPassword.bind(this)}>忘记密码</span>
										</div>	
									)}
								</FormItem>
								<Button type="primary" htmlType="submit"
										className="login-form-button">登录</Button>
							</Form>
						</div>: 
							<div className="main-box">
							<h1 style ={{textAlign:'center',marginBottom:10,marginTop:20,color:'red'}}></h1>
							<Form onSubmit={this.sureSubmit.bind(this)}
								className='login-form' id="loginForm">
								<FormItem>
									{getFieldDecorator('nickname', {
										rules: [{required: true, message: '请输入用户名'}],
									})(
										<Input addonBefore={<Icon type="user"/>} id="nickname"
											placeholder="请输入用户名"/>,
									)}
								</FormItem>
		
								<FormItem>
									{getFieldDecorator('phone', {
										rules: [{required: true, message: '请输入手机号'}],
									})(
										<div>
											<Input addonBefore={<Icon type="mobile"/>}
												id='phoneNumber' 
												placeholder="请输入手机号"
												/>
										</div>,
									)}
								</FormItem>
								<Button type="primary"  onClick={this.cancel.bind(this)} style={{width:'44%',height:'45px',marginTop:50,marginLeft:10,fontSize:18}}>取消</Button>	
								<Button type="primary" htmlType="submit" style={{width:'44%',height:'45px',marginTop:50,marginLeft:30,fontSize:18}}>确定</Button>
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
		this.props.form.validateFieldsAndScroll((err,values) =>{
			if(!err){
				console.log('values',values)
				// let partn =/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
				let partn=/^1[0-9]{10}$/;
				let phonenumber =values.phone;
				console.log(phonenumber)
				if(!partn.exec(phonenumber)){
					notification.error({
						message:  '手机号输入错误！',
						duration: 2,
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
