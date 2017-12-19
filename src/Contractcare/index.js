import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Route,Switch} from 'react-router-dom';
import {Main, Aside, Body} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import {Icon} from 'react-fa';

export default class ContractContainer extends Component {

	async componentDidMount() {
		const {default: reducer} = await import('./store');
		const Containers = await import('./containers');
		injectReducer('contract', reducer);
		this.setState({
			...Containers
		});
	}

	render() {
		const {
			Client = null, 
			Iteminfo = null,
			Maincontract = null,
			Subcontract = null,
			Contractcollect = null,
			Contractpayment = null,
			Maininvoice = null,
			Subinvoice = null,
			Pretaxinfo = null,
			Deposit = null,
			Contractchange = null,
			Contractfinal = null,
			Acceptancebill = null,
			Systempermission = null,
		} = this.state || {};
		return (
			<Body>
			<Aside>
				<Submenu {...this.props} menus={ContractContainer.menus}/>
			</Aside>
			<Main>
				<div style={{
						"position": "absolute",
						"top": 80,
						"bottom": 37,
						"left": 160,
						"right": 0,
						"zIndex": 1000
					}}
				>
					{Client && <Route exact path="/contractcare" component={Client}/>}
					{Iteminfo && <Route path="/contractcare/Iteminfo" component={Iteminfo}/>}
					{Maincontract && <Route path="/contractcare/maincontract" component={Maincontract}/>}
					{Subcontract && <Route path="/contractcare/subcontract" component={Subcontract}/>}
					{Contractcollect && <Route path="/contractcare/contractcollect" component={Contractcollect}/>}
					{Contractpayment && <Route path="/contractcare/contractpayment" component={Contractpayment}/>}
					{Maininvoice && <Route path="/contractcare/maininvoice" component={Maininvoice}/>}
					{Subinvoice && <Route path="/contractcare/subinvoice" component={Subinvoice}/>}
					{Pretaxinfo && <Route path="/contractcare/pretaxinfo" component={Pretaxinfo}/>}
					{Deposit && <Route path="/contractcare/deposit" component={Deposit}/>}
					{Contractchange && <Route path="/contractcare/contractchange" component={Contractchange}/>}
					{Contractfinal && <Route path="/contractcare/contractfinal" component={Contractfinal}/>}
					{Acceptancebill && <Route path="/contractcare/acceptancebill" component={Acceptancebill}/>}
					{Systempermission && <Route path="/contractcare/systempermission" component={Systempermission}/>}
				</div>
			</Main>
			</Body>);
	}

	static menus = [{
		key: 'client',
		id: 'CONTRACTCARE.CLIENT',
		path: '/contractcare',
		name: '客户管理',
		icon: <Icon name="book"/>,
	},{
		key: 'iteminfo',
		id: 'CONTRACTCARE.ITEMINFO',
		path: '/contractcare/iteminfo',
		name: '项目信息列表',
		icon: <Icon name="book"/>,
	},{
		key: 'maincontract',
		id: 'CONTRACTCARE.MAINCONTRACT',
		path: '/contractcare/maincontract',
		name: '总包合同信息维护',
		icon: <Icon name="book"/>,
	},{
		key: 'subcontract',
		id: 'CONTRACTCARE.SUBCONTRACT',
		path: '/contractcare/subcontract',
		name: '分包合同信息维护',
		icon: <Icon name="book"/>,
	},{
		key: 'contractcollect',
		id: 'CONTRACTCARE.CONTRACTCOLLECT',
		path: '/contractcare/contractcollect',
		name: '合同收款',
		icon: <Icon name="book"/>,
	},{
		key: 'contractpayment',
		id: 'CONTRACTCARE.CONTRACTPAYMENT',
		path: '/contractcare/contractpayment',
		name: '合同付款',
		icon: <Icon name="book"/>,
	},{
		key: 'maininvoice',
		id: 'CONTRACTCARE.MAININVOICE',
		path: '/contractcare/maininvoice',
		name: '总包合同发票',
		icon: <Icon name="book"/>,
	},{
		key: 'subinvoice',
		id: 'CONTRACTCARE.SUBINVOICE',
		path: '/contractcare/subinvoice',
		name: '分包合同发票',
		icon: <Icon name="book"/>,
	},{
		key: 'pretaxinfo',
		id: 'CONTRACTCARE.PRETAXINFO',
		path: '/contractcare/pretaxinfo',
		name: '预缴税信息维护',
		icon: <Icon name="book"/>,
	},{
		key: 'deposit',
		id: 'CONTRACTCARE.DEPOSIT',
		path: '/contractcare/deposit',
		name: '合同保函保证金',
		icon: <Icon name="book"/>,
	},{
		key: 'contractchange',
		id: 'CONTRACTCARE.CONTRACTCHANGE',
		path: '/contractcare/contractchange',
		name: '合同变更',
		icon: <Icon name="book"/>,
	},{
		key: 'contractfinal',
		id: 'CONTRACTCARE.CONTRACTFINAL',
		path: '/contractcare/contractfinal',
		name: '合同结算',
		icon: <Icon name="book"/>,
	},{
		key: 'acceptancebill',
		id: 'CONTRACTCARE.ACCEPTANCEBILL',
		path: '/contractcare/acceptancebill',
		name: '承兑汇票',
		icon: <Icon name="book"/>,
	},{
		key: 'systempermission',
		id: 'CONTRACTCARE.SYSTEMPERMISSION',
		path: '/contractcare/systempermission',
		name: '系统权限列表',
		icon: <Icon name="book"/>,
	}];
};
