import React, { Component } from 'react';
import { Menu, Badge } from 'antd';
import { Icon } from 'react-fa';
import './Header.less';
import { Link } from 'react-router-dom';
import { getUser, clearUser, getPermissions, removePermissions } from '../../auth';
import { loadMenus, loadIgnoreModules, loadHeadLogo } from 'APP/api';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '_platform/store/global/tabs';

@connect(
	state => {
		const {platform = {}} = state;
		return platform;
	},
	dispatch => ({
		actions: bindActionCreators(actions, dispatch),
	})
)

export default class Header extends Component {
	state = {
		dotShow: false,
		tasks:0
	}
	componentDidMount() {
		const { tasks = 0 } = getUser();
		if (tasks > 0) {
			console.log('tasks',tasks)
			this.setState({
				dotShow: true,
				tasks:tasks
			})
		}
	}

	onClickDot = () => {
		this.setState({
			dotShow: false
		})
	}


	render() {
		console.log('header');
		const { match: { params: { module = '' } = {} } = {} } = this.props;
		const ignore = Header.ignoreModules.some(m => m === module);
		if (ignore) {
			return null;
		}
		const { username = '', name = '', is_superuser = false } = getUser();
		const permissions = getPermissions() || [];
		return (
			<header className="header">
				<a className="head-logo" href='/'>
					<img src={loadHeadLogo} alt="logo" />
					<div className="brand">
						<div>
							森林大数据建设管理平台
						</div>
					</div>
				</a>
				<Menu className="nav-menu head-nav"
					selectedKeys={this.selectKeys()}
					mode="horizontal">
					{
						Header.menus.map(menu => {
							let has = permissions.some(permission => permission === `appmeta.${menu.id}.READ`);
							// let has = true
							if (has) {
								return (
									<Menu.Item
										key={menu.key}
										className="nav-item">
										<Link to={menu.path}>
											{menu.icon}
											<span className="title">{menu.title}</span>
										</Link>
									</Menu.Item>)
							}
							// for (var i = 0; i < permissions.length; i++) {
							// 取出数据使用二进制进行判断对比 如果有这个1就显示否则隐藏
							// 	if (permissions[i].value & 1 == "1") {
							// 		if (permissions[i].id == `${menu.id}`) {

							// 			return (
							// 				<Menu.Item
							// 					key={menu.key}
							// 					className="nav-item">
							// 					<Link to={menu.path}>
							// 						{menu.icon}
							// 						<span className="title">{menu.title}</span>
							// 					</Link>
							// 				</Menu.Item>)
							// 		}
							// 	}
							// break;
							// }
						})
					}
				</Menu>
				<div className="head-right">
					<div className="head-info">
						<a className="user">{name ? name : username}</a>
						<Icon name="sign-out" title="退出登录" onClick={this.signOut.bind(this)} />
					</div>
					<div className="head-fn" >
						<Badge  count={this.state.tasks}>
							<Link to='/selfcare'>
								<Icon style={{ marginTop: "4px" }} name="tasks" title="个人任务" onClick={this.onClickDot.bind(this)} />
							</Link>
						</Badge>
						<Link to='/modeldown'>
							<Icon name="download" title="下载模型" style={{marginLeft:10}}/>
						</Link>
					</div>
				</div>
			</header>);
	}

	selectKeys() {
		const { match: { params: { module = '' } = {} } = {} } = this.props;
		const { key = '' } = Header.menus.find(menu => {
			const pathnames = /^\/(\w+)/.exec(menu.path) || [];
			return pathnames[1] === module;
		}) || {};
		return [key];
	}

	signOut() {
		const { history, actions: {clearTab} } = this.props;
		clearUser();
		clearTab();
		removePermissions();
		
		let remember = window.localStorage.getItem('QH_LOGIN_REMEMBER');
		if (!remember) {
			window.localStorage.removeItem('QH_LOGIN_USER');
		}
		setTimeout(() => {
			history.replace('/login');
		}, 500);
	}

	Download() {

	}

	static ignoreModules = loadIgnoreModules;

	static menus = loadMenus;

	//现在通过APP/api进行导入，不在此定义声明
	/*static menus = [{
		key: 'home',
		id: 'HOME',
		title: '首页',
		path: '/',
		icon: <Icon name="home"/>,
	}, {
		key: 'dashboard',
		id: 'DISPLAY',
		title: '综合展示',
		path: '/dashboard',
		icon: <Icon name="map"/>
	}, {
		key: 'overall',
		id: 'MANAGE',
		title: '综合管理',
		path: '/overall/news',
		icon: <Icon name="cubes"/>,
	}, {
		key: 'datum',
		id: 'DATUM',
		title: '资料管理',
		path: '/datum',
		icon: <Icon name="book"/>
	}, {
		key: 'design',
		id: 'DESIGN',
		title: '设计管理',
		path: '/design',
		icon: <Icon name="edit"/>,
	}, {
		key: 'quality',
		id: 'QUALITY',
		title: '质量管理',
		path: '/quality',
		icon: <Icon name="list-alt"/>
	}, {
		key: 'schedule',
		id: 'SCHEDULE',
		title: '进度管理',
		path: '/schedule',
		icon: <Icon name="random"/>
	}, {
		key: 'safety',
		title: '安全管理',
		id: 'SAFETY',
		path: '/safety',
		icon: <Icon name="shield"/>,
	}, {
		key: 'cost',
		title: '造价管理',
		path: '/cost',
		icon: <Icon name="jpy"/>
	}, {
		key: 'video',
		title: '三维全景',
		id: 'VIDEO',
		path: '/video/monitor',
		icon: <Icon name="video-camera"/>
	}, {
		key: 'forest',
		id: 'FOREST',
		title: '森林数据',
		path: '/forest/nursoverallinfo',
		icon: <Icon name="tree"/>,
	}, {
		key: 'contractcare',
		id: 'CONTRACTCARE',
		title: '合同管理',
		path: '/contractcare',
		icon: <Icon name="book"/>
	}, {
		key: 'drawingcare',
		id: 'DRAWINGCARE',
		title: '图档管理',
		path: '/drawingcare/recordmanage',
		icon: <Icon name="list-alt"/>
	}, {
		key: 'selfcare',
		id: 'SELFCARE',
		title: '个人中心',
		path: '/selfcare',
		icon: <Icon name="user"/>
	}, {
		key: 'system',
		id: 'SYSTEM',
		title: '系统设置',
		path: '/system',
		icon: <Icon name="cogs"/>
	}, {
		key: 'setup',
		id: 'SETUP',
		title: '系统管理',
		path: '/setup',
		icon: <Icon name="gear"/>
	}, {
		key: 'data',
		id: 'DATA',
		title: '数据报送',
		path: '/data',
		icon: <Icon name="gear"/>
	}]*/
}
