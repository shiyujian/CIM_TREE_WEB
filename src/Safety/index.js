import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Main, Aside, Body} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import {Icon} from 'react-fa';
// import "./containers/style.less"
// 

export default class Safety extends Component {

	async componentDidMount() {
		const {default: reducer} = await  import('./store');
		const Containers = await  import('./containers');

		injectReducer('safety', reducer);
		this.setState({
			...Containers
		})
	}

	render() {
		const {Register, Report, Investigation, Treatment, OrganizationalStructure,
			ManagementInstitution, EmergencyPlan, SafetyGoal, ResponsibilitySystem,
			QualificationVerification,EducationRegister,ActionsRecord,TechnicalDisclosure,
			FacilitiesAcceptance, SafetyCheck, HiddenDanger, SafetyRules, Special} = this.state || {};
		const {Scheme,RiskEvaluation,Unbearable,RiskFactor,DynamicReport,Discipline,Solution} = this.state || {};
		const {MonitorPlan,DataQuery,MonitorProject,MonitorStations,MonitorData,MonitorDataP,Dashboard} = this.state || {};
		return (
			<Body>
				<Aside>
					<Submenu {...this.props} menus={Safety.menus} defaultOpenKeys={Safety.defaultOpenKeys} />
				</Aside>
				<Main>
				<Switch>
					{Register && <Route path="/safety/accidentManagement/register" component={Register} />}
					{Scheme && <Route exact path="/safety/safetyPlan/scheme" component={Scheme} />}
					{Report && <Route path="/safety/accidentManagement/report" component={Report} />}
					{Investigation && <Route path="/safety/accidentManagement/investigation" component={Investigation} />}
					{Treatment && <Route path="/safety/accidentManagement/treatment" component={Treatment} />}
					{OrganizationalStructure && <Route path="/safety/safetyPlan/organizationalStructure" component={OrganizationalStructure} />}
					{ManagementInstitution && <Route path="/safety/safetyPlan/managementInstitution" component={ManagementInstitution} />}
					{EmergencyPlan && <Route path="/safety/safetyPlan/emergencyPlan" component={EmergencyPlan} />}
					{SafetyGoal && <Route path="/safety/safetyPlan/safetyGoal" component={SafetyGoal} />}
					{ResponsibilitySystem && <Route path="/safety/safetyPlan/responsibilitySystem" component={ResponsibilitySystem} />}
					{RiskEvaluation && <Route path="/safety/dangerousSourceManagement/riskEvaluation" component={RiskEvaluation} />}
					{Unbearable && <Route path="/safety/dangerousSourceManagement/unbearable" component={Unbearable} />}
					{RiskFactor && <Route path="/safety/dangerousSourceManagement/riskFactor" component={RiskFactor} />}
					{DynamicReport && <Route path="/safety/dangerousSourceManagement/dynamicReport" component={DynamicReport} />}
					{Discipline && <Route path="/safety/securityMeasures/discipline" component={Discipline} />}
					{Solution && <Route path="/safety/securityMeasures/solution" component={Solution} />}
					{QualificationVerification && <Route path="/safety/managementAndControl/qualificationVerification" component={QualificationVerification} />}
					{EducationRegister && <Route path="/safety/managementAndControl/educationRegister" component={EducationRegister} />}
					{ActionsRecord && <Route path="/safety/managementAndControl/actionsRecord" component={ActionsRecord} />}
					{TechnicalDisclosure && <Route path="/safety/managementAndControl/technicalDisclosure" component={TechnicalDisclosure} />}
					{FacilitiesAcceptance && <Route path="/safety/managementAndControl/facilitiesAcceptance" component={FacilitiesAcceptance} />}
					{SafetyCheck && <Route path="/safety/managementAndControl/safetyCheck" component={SafetyCheck} />}
					{HiddenDanger && <Route path="/safety/managementAndControl/hiddenDanger" component={HiddenDanger} />}
					{MonitorPlan && <Route path="/safety/safetyMonitor/plan" component={MonitorPlan} />}
					{DataQuery && <Route path="/safety/safetyMonitor/query" component={DataQuery} />}
					{MonitorProject && <Route path="/safety/safetyMonitor/project" component={MonitorProject} />}
					{MonitorStations && <Route path="/safety/safetyMonitor/stations" component={MonitorStations} />}
					{MonitorData && <Route path="/safety/safetyMonitor/monitoring" component={MonitorData} />}
					{MonitorDataP && <Route path="/safety/safetyMonitor/survey" component={MonitorDataP} />}
					{Dashboard && <Route path="/safety" component={Dashboard} />}
					{/* {SafetyRules && <Route path="/safety/specialSolutionsAndMeasures/safetyRules" component={SafetyRules} />}
					{Special && <Route path="/safety/specialSolutionsAndMeasures/special" component={Special} />} */}
					</Switch>
				</Main>
			</Body>)
	}

	static menus = [{
		key: 'safety',
		id: 'SAFETY.STATISTICS',
		name: '统计分析',
		path: '/safety',
		icon: <Icon name="thermometer-empty"/>
	}, {
		key: 'safetyPlan',
		id: 'SAFETY.SAFETYPLAN',
		name: '安全策划',
		path: '/safety/safetyPlan',
		icon: <Icon name="podcast"/>,
		children: [
			{
				key: 'scheme',
				id: 'SAFETY.SCHEME',
				name: '安全策划书',
				path: '/safety/safetyPlan/scheme',
				icon: <Icon name="reply-all"/>
			}, {
				key: 'organizationalStructure',
				id: 'SAFETY.ORGANIZATIONALSTRUCTURE',
				name: '组织架构',
				path: '/safety/safetyPlan/organizationalStructure',
				icon: <Icon name="retweet"/>
			}, {
				key: 'managementInstitution',
				id: 'SAFETY.MANAGEMENTINSTITUTION',
				name: '安全管理制度',
				path: '/safety/safetyPlan/managementInstitution',
				icon: <Icon name="road"/>
			}, {
				key: 'emergencyPlan',
				id: 'SAFETY.EMERGENCYPLAN',
				name: '应急预案',
				path: '/safety/safetyPlan/emergencyPlan',
				icon: <Icon name="suitcase"/>
			}, {
				key: 'safetyGoal',
				id: 'SAFETY.SAFETYGOAL',
				name: '安全目标',
				path: '/safety/safetyPlan/safetyGoal',
				icon: <Icon name="window-minimize"/>
			}, {
				key: 'responsibilitySystem',
				id: 'SAFETY.RESPONSIBILITYSYSTEM',
				name: '安全责任制',
				path: '/safety/safetyPlan/responsibilitySystem',
				icon: <Icon name="window-maximize"/>
			}
		]
	}, {
		key: 'dangerousSourceManagement',
		id: 'SAFETY.DANGEROUSSOURCEMANAGEMENT',
		name: '危险源管理',
		path: '/safety/dangerousSourceManagement',
		icon: <Icon name="wrenach"/>,
		children: [
			{
				key: 'riskEvaluation',
				id: 'SAFETY.RISKEVALUATION',
				name: '风险评价',
				path: '/safety/dangerousSourceManagement/riskEvaluation',
				icon: <Icon name="minus-square-o"/>
			}, {
				key: 'unbearable',
				id: 'SAFETY.UNBEARABLE',
				name: '不可承受风险',
				path: '/safety/dangerousSourceManagement/unbearable',
				icon: <Icon name="star-half-empty"/>
			}, {
				key: 'riskFactor',
				id: 'SAFETY.RISKFACTOR',
				name: '重大危险因素',
				path: '/safety/dangerousSourceManagement/riskFactor',
				icon: <Icon name="plus-square-o"/>
			}, {
				key: 'dynamicReport',
				id: 'SAFETY.DYNAMICREPORT',
				name: '动态报表',
				path: '/safety/dangerousSourceManagement/dynamicReport',
				icon: <Icon name="bar-chart-o"/>
			}
		]
	},/*  {
		key: 'specialSolutionsAndMeasures',
		name: '专项方案及措施',
		path: '/safety/specialSolutionsAndMeasures',
		icon: <Icon name="building-o"/>,
		children: [
			{
				key: 'safetyRules',
				id: 'SAFETY.SAFETYRULES',
				name: '安全规程',
				path: '/safety/specialSolutionsAndMeasures/safetyRules',
				icon: <Icon name="building-o"/>
			}, {
				key: 'special',
				id: 'SAFETY.SPECIAL',
				name: '专项方案/措施',
				path: '/safety/specialSolutionsAndMeasures/special',
				icon: <Icon name="building-o"/>
			}
		]
	},  */{
		key: 'securityMeasures',
		id:'SAFETY.ZXFAJCS',
		name: '专项方案及措施',
		path: '/safety/securityMeasures',
		icon: <Icon name="tty"/>,
		children: [
			{
				key: 'discipline',
				id: 'SAFETY.DISCIPLINE',
				name: '安全规程',
				path: '/safety/securityMeasures/discipline',
				icon: <Icon name="sign-language"/>
			}, {
				key: 'solution',
				id: 'SAFETY.SOLUTION',
				name: '专项方案',
				path: '/safety/securityMeasures/solution',
				icon: <Icon name="deafness"/>
			}
		]
	}, {
		key: 'SafetyMonitor',
		name: '安全监测',
		id:'SAFETY.MONITORAQJC',
		path: '/safety/safetyMonitor',
		icon: <Icon name="trophy" />,
		children: [
			{
				key: 'plan',
				id: 'SAFETY.PLAN',
				name: '监测方案',
				path: '/safety/safetyMonitor/plan',
				icon: <Icon name="unlock-alt" />
			}, {
				key: 'query',
				id: 'SAFETY.QUERY',
				name: '监测数据查询',
				path: '/safety/safetyMonitor/query',
				icon: <Icon name="user-secret" />
			}, {
				key: 'project',
				id: 'SAFETY.PROJECT',
				name: '监测项目',
				path: '/safety/safetyMonitor/project',
				icon: <Icon name="universal-access" />
			}, {
				key: 'stations',
				id: 'SAFETY.STATIONS',
				name: '监测点',
				path: '/safety/safetyMonitor/stations',
				icon: <Icon name="deaf" />
			}, {
				key: 'monitoring',
				id: 'SAFETY.MONITORING',
				name: '监测数据',
				path: '/safety/safetyMonitor/monitoring',
				icon: <Icon name="low-vision" />
			}
		]
	}, {
		key: 'managementAndControl',
		id: 'SAFETY.MANAGEMENTANDCONTROL',
		name: '安全管控',
		path: '/safety/managementAndControl',
		icon: <Icon name="sitemap"/>,
		children: [
			{
				key: 'safetyCheck',
				id: 'SAFETY.SAFETYCHECK',
				name: '安全检查',
				path: '/safety/managementAndControl/safetyCheck',
				icon: <Icon name="times-circle-o"/>
			}, {
				key: 'qualificationVerification',
				id: 'SAFETY.QUALIFICATIONVERIFICATION',
				name: '安全资质验证',
				path: '/safety/managementAndControl/qualificationVerification',
				icon: <Icon name="sliders"/>
			}, {
				key: 'educationRegister',
				id: 'SAFETY.EDUCATIONREGISTER',
				name: '安全教育登记',
				path: '/safety/managementAndControl/educationRegister',
				icon: <Icon name="tag"/>
			}, {
				key: 'actionsRecord',
				id: 'SAFETY.ACTIONSRECORD',
				name: '安全活动记录',
				path: '/safety/managementAndControl/actionsRecord',
				icon: <Icon name="tags"/>
			}, {
				key: 'technicalDisclosure',
				id: 'SAFETY.TECHNICALDISCLOSURE',
				name: '安全技术交底',
				path: '/safety/managementAndControl/technicalDisclosure',
				icon: <Icon name="window-restore"/>
			}, {
				key: 'facilitiesAcceptance',
				id: 'SAFETY.FACILITIESACCEPTANCE',
				name: '设备设施验收',
				path: '/safety/managementAndControl/facilitiesAcceptance',
				icon: <Icon name="tint"/>
			}, {
				key: 'hiddenDanger',
				id: 'SAFETY.HIDDENDANGER',
				name: '安全隐患',
				path: '/safety/managementAndControl/hiddenDanger',
				icon: <Icon name="building-o"/>
			},  /*{
				key: 'safetyMonitoring',
				id: 'SAFETY.SAFETYMONITORING',
				name: '安全监测',
				path: '/safety/managementAndControl/safetyMonitoring',
				icon: <Icon name="building-o"/>
			}*/
		]
	},  {
		key: 'accidentManagement',
		name: '事故管理',
		id:'SAFETY.ACCIDENT',
		path: '/safety/accidentManagement',
		icon: <Icon name="share-square"/>,
		children: [
			{
				key: 'register',
				id: 'SAFETY.REGISTER',
				name: '事故登记',
				path: '/safety/accidentManagement/register',
				icon: <Icon name="share-square-o"/>
			}, {
				key: 'report',
				id: 'SAFETY.REPORT',
				name: '事故报告',
				path: '/safety/accidentManagement/report',
				icon: <Icon name="shield"/>
			}, {
				key: 'treatment',
				id: 'SAFETY.TREATMENT',
				name: '事故处理',
				path: '/safety/accidentManagement/treatment',
				icon: <Icon name="ship"/>
			}, {
				key: 'investigation',
				id: 'SAFETY.INVESTIGATION',
				name: '事故调查',
				path: '/safety/accidentManagement/investigation',
				icon: <Icon name="shopping-bag"/>
			}
		]
	}]

	static defaultOpenKeys = ['safetyPlan']
}
