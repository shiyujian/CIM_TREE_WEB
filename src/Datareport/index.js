import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Route,Switch} from 'react-router-dom';
import {Aside, Body, Main} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import {Icon} from 'react-fa';

export default class DataReport extends Component {

	async componentDidMount() {
		const {default: reducer} = await import('./store');
		const Containers = await import('./containers');
		injectReducer('datareport', reducer);
		this.setState({
			...Containers
		})
	}

	render() {
        const {ProjectData, UnitData, OrgData, PersonData, ModalData, DesignData,
            DesignScheduleData,WorkScheduleData,JianyanpiData,JianyanData,
            CostListData,WorkunitCost,BalancePlan,BalanceSchedule,SafetyDoc,
            SafetyHiddenDanger,SafetySpecial,SubmitConfig,VedioData,Defect,VedioInfoData} = this.state || {};
		return (
			<Body>
			<Aside>
				<Submenu {...this.props} menus={DataReport.menus} defaultOpenKeys={DataReport.defaultOpenKeys}/>
			</Aside>
			<Main>
				<Switch>
					{ProjectData && <Route exact path="/data" component={ProjectData}/>}
					{UnitData && <Route path="/data/unit" component={UnitData}/>}
					{OrgData && <Route exact path="/data/org" component={OrgData}/>}
					{PersonData && <Route path="/data/person" component={PersonData}/>}
                    {ModalData && <Route path="/data/modal" component={ModalData}/>}
                    
                    {DesignData && <Route exact path="/data/designdoc" component={DesignData}/>}
					{DesignScheduleData && <Route path="/data/designschedule" component={DesignScheduleData}/>}
					{WorkScheduleData && <Route exact path="/data/workschedule" component={WorkScheduleData}/>}
					{JianyanpiData && <Route path="/data/quality/jianyanpi" component={JianyanpiData}/>}
					{JianyanData && <Route path="/data/quality/jianyan" component={JianyanData}/>}
					{Defect && <Route path="/data/quality/defect" component={Defect}/>}
                    
                    {CostListData && <Route exact path="/data/costlist" component={CostListData}/>}
					{WorkunitCost && <Route path="/data/workunit" component={WorkunitCost}/>}
					{BalancePlan && <Route exact path="/data/balanceplan" component={BalancePlan}/>}
					{BalanceSchedule && <Route exact path="/data/balanceschedule" component={BalanceSchedule}/>}
                    {SafetyDoc && <Route path="/data/safetydoc" component={SafetyDoc}/>}
                    
                    {SafetyHiddenDanger && <Route exact path="/data/hiddendanger" component={SafetyHiddenDanger}/>}
					{SafetySpecial && <Route path="/data/special" component={SafetySpecial}/>}
					{VedioData && <Route path="/data/vedio" component={VedioData}/>}
					{VedioInfoData && <Route path="/data/vedioinfo" component={VedioInfoData}/>}
					{SubmitConfig && <Route path="/data/config" component={SubmitConfig}/>}
				</Switch>
			</Main>
			</Body>);
	}

	static menus = [{
		key: 'basicinfo',
		id: 'DATA.BASICINFO',
		path: '/data',
		name: '基础信息',
        icon: <Icon name="user-o"/>,
        children: [
			{
				key: 'project',
				id: 'DATA.PROJECT',
				name: '项目信息',
				path: '/data',
				icon: <Icon name="sign-language"/>
			}, {
				key: 'unit',
				id: 'DATA.UNIT',
				name: '单位工程',
				path: '/data/unit',
				icon: <Icon name="deafness"/>
			}, {
				key: 'org',
				id: 'DATA.ORG',
				name: '组织结构',
				path: '/data/org',
				icon: <Icon name="sign-language"/>
			}, {
				key: 'person',
				id: 'DATA.PERSON',
				name: '人员信息',
				path: '/data/person',
				icon: <Icon name="deafness"/>
			}
		]
	}, {
		key: 'modal',
		id: 'DATA.MODAL',
		path: '/data/modal',
		name: '模型信息',
		icon: <Icon name="calendar-check-o"/>
	}, {
		key: 'design',
		id: 'DATA.DESIGN',
		path: '/data/designdoc',
		name: '设计信息',
        icon: <Icon name="area-chart"/>,
	},{
		key: 'schedule',
		id: 'DATA.SCHEDULE',
		path: '/data/schedule',
		name: '进度信息',
        icon: <Icon name="sliders"/>,
        children: [
			{
				key: 'workschedule',
				id: 'DATA.WORKSCHEDULE',
				name: '施工进度',
				path: '/data/workschedule',
				icon: <Icon name="sign-language"/>
			}, {
				key: 'designschedule',
				id: 'DATA.DESIGNSCHEDULE',
				name: '设计进度',
				path: '/data/designschedule',
				icon: <Icon name="sign-language"/>
			}
		]
	}, {
		key: 'quality',
		id: 'DATA.QUALITY',
		path: '/data/quality',
		name: '质量信息',
        icon: <Icon name="wrench"/>,
        children: [
			{
				key: 'jianyanpi',
				id: 'DATA.JIANYANPI',
				name: '检验批信息',
				path: '/data/quality/jianyanpi',
				icon: <Icon name="sign-language"/>
			}, {
				key: 'jianyan',
				id: 'DATA.JIANYAN',
				name: '其他检验信息',
				path: '/data/quality/jianyan',
				icon: <Icon name="sign-language"/>
			},  {
				key: 'defect',
				id: 'DATA.DEFECT',
				name: '质量问题',
				path: '/data/quality/defect',
				icon: <Icon name="sign-language"/>
			}
		]
	}, {
		key: 'COST',
		id: 'DATA.COST',
		path: '/data/cost',
		name: '成本结算',
        icon: <Icon name="tty"/>,
        children: [
			{
				key: 'costlist',
				id: 'DATA.COSTLIST',
				name: '计价清单',
				path: '/data/costlist',
				icon: <Icon name="sign-language"/>
			}, {
				key: 'workunit',
				id: 'DATA.WORKUNIT',
				name: '工程量结算',
				path: '/data/workunit',
				icon: <Icon name="sign-language"/>
            }, {
				key: 'balanceplan',
				id: 'DATA.BALANCEPLAN',
				name: '结算计划',
				path: '/data/balanceplan',
				icon: <Icon name="sign-language"/>
			},
		]
	}, {
		key: 'SAFETY',
		id: 'DATA.SAFETY',
		path: '/data/safety',
		name: '安全信息',
        icon: <Icon name="tty"/>,
        children: [
			{
				key: 'safetydoc',
				id: 'DATA.SAFETYDOC',
				name: '安全文档',
				path: '/data/safetydoc',
				icon: <Icon name="sign-language"/>
			}, {
				key: 'hiddendanger',
				id: 'DATA.HIDDENDANGER',
				name: '安全隐患',
				path: '/data/hiddendanger',
				icon: <Icon name="sign-language"/>
            },
            {
				key: 'special',
				id: 'DATA.SPECIAL',
				name: '安全专项',
				path: '/data/special',
				icon: <Icon name="sign-language"/>
			}, {
				key: 'vedio',
				id: 'DATA.VEDIO',
				name: '视频监控',
				path: '/data/vedio',
				icon: <Icon name="sign-language"/>
			}, {
				key: 'vedioinfo',
				id: 'DATA.VEDIOINFO',
				name: '影像信息',
				path: '/data/vedioinfo',
				icon: <Icon name="sign-language"/>
			}
		]
	},];
	static defaultOpenKeys = ['basicinfo']
}


// {
// 	key: 'balanceschedule',
// 	id: 'DATA.BALANCESCHEDULE',
// 	name: '结算进度',
// 	path: '/data/balanceschedule',
// 	icon: <Icon name="sign-language"/>
// }


// {
// 	key: 'config',
// 	id: 'DATA.CONFIG',
// 	path: '/data/config',
// 	name: '报送配置',
// 	icon: <Icon name="tty"/>,
// }
