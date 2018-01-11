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
		name: '安全动态',
		path: '/safety',
		icon: <Icon name="thermometer-empty"/>
	}, {
		key: 'safetySystem',
		id: 'SAFETY.SYSTEM',
		name: '安全体系',
		path: '/safetySystem',
		icon: <Icon name="thermometer-empty"/>
	}, {
		key: 'hiddenDanger',
		id: 'SAFETY.HIDDENDANGER',
		name: '安全隐患',
		path: '/safety/hiddenDanger',
		icon: <Icon name="building-o"/>
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
	}, {
		key: 'actuality',
		id: 'SAFETY.ACRUALITY',
		name: '安全动态管理',
		path: '/safety/actuality',
		icon: <Icon name="building-o"/>
	}]

	static defaultOpenKeys = ['safetyPlan']
}
