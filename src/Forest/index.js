import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Route,Switch} from 'react-router-dom';
import {Main, Aside, Body} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import {Icon} from 'react-fa';

export default class ForestContainer extends Component {

	async componentDidMount() {
		const {default: reducer} = await import('./store');
		const Containers = await import('./containers');
		injectReducer('forest', reducer);
		this.setState({
			...Containers
		});
	}

	render() {
		const {
			Nursoverallinfo = null,
			Nursmeasureinfo = null,
			Locmeasureinfo = null,
			Supervisorinfo = null,
			Checkerinfo = null,
			Faithinfo = null,
			Faithanalyze = null,
			Qualityanalyze = null,
			Enteranalyze = null,
			Scheduleanalyze = null,
			Dataimport = null,
			Contrastinfo = null,
		} = this.state || {};
		return (
				<Body >
				<Aside>
					<Submenu {...this.props} menus={ForestContainer.menus} defaultOpenKeys={ForestContainer.defaultOpenKeys}/>
				</Aside>
					<Main>
						{Nursoverallinfo && <Route path="/forest/nursoverallinfo" component={Nursoverallinfo}/>}
						{Nursmeasureinfo && <Route path="/forest/nursmeasureinfo" component={Nursmeasureinfo}/>}
						{Locmeasureinfo && <Route path="/forest/locmeasureinfo" component={Locmeasureinfo}/>}
						{Supervisorinfo && <Route path="/forest/supervisorinfo" component={Supervisorinfo}/>}
						{Checkerinfo && <Route path="/forest/checkerinfo" component={Checkerinfo}/>}
						{Faithinfo && <Route path="/forest/faithinfo" component={Faithinfo}/>}
						{Faithanalyze && <Route path="/forest/faithanalyze" component={Faithanalyze}/>}
						{Qualityanalyze && <Route path="/forest/qualityanalyze" component={Qualityanalyze}/>}
						{Enteranalyze && <Route path="/forest/enteranalyze" component={Enteranalyze}/>}
						{Scheduleanalyze && <Route path="/forest/scheduleanalyze" component={Scheduleanalyze}/>}
						{Dataimport && <Route path="/forest/dataimport" component={Dataimport}/>}
						{Contrastinfo && <Route path="/forest/contrastinfo" component={Contrastinfo}/>}
					</Main>
				</Body>);
	}

	static menus = [{
		key: 'info',
		id: 'INFO',
		name: '苗木大数据',
		children: [{
			key: 'nursoverallinfo',
			id: 'NURSOVERALLINFO',
			path: '/forest/nursoverallinfo',
			name: '苗木综合信息',
		},{
			key: 'nursmeasureinfo',
			id: 'NURSMEASUREINFO',
			path: '/forest/nursmeasureinfo',
			name: '苗圃测量信息',
		},{
			key: 'locmeasureinfo',
			id: 'LOCMEASUREINFO',
			path: '/forest/locmeasureinfo',
			name: '现场测量信息',
		},{
			key: 'supervisorinfo',
			id: 'SUPERVISORINFO',
			path: '/forest/supervisorinfo',
			name: '监理验收信息',
		},{
			key: 'ownerinfo',
			id: 'OWNERINFO',
			path: '/forest/checkerinfo',
			name: '业主抽查信息',
		},{
			key: 'contrastinfo',
			id: 'CONTRASTINFO',
			path: '/forest/contrastinfo',
			name: '苗木对比信息',
		},{
			key: 'faithinfo',
			id: 'FAITHINFO',
			path: '/forest/faithinfo',
			name: '供应商诚信信息',
		}]
	},{
		key: 'analyze',
		id: 'FOREST.ANALYZE',
		name: '数据分析',
		children: [{
			key: 'enteranalyze',
			id: 'ENTERANALYZE',
			path: '/forest/enteranalyze',
			name: '苗木进场分析',
		},{
			key: 'scheduleanalyze',
			id: 'SCHEDULEANALYZE',
			path: '/forest/scheduleanalyze',
			name: '种植进度分析',
		},{
			key: 'qualityanalyze',
			id: 'QUALITYANALYZE',
			path: '/forest/qualityanalyze',
			name: '种植质量分析',
		},{
			key: 'faithanalyze',
			id: 'FAITHANALYZE',
			path: '/forest/faithanalyze',
			name: '诚信供应商分析',
		}
		]
	},{
		key: 'import',
		id: 'FOREST.IMPORT',
		name: '数据导入',
		children: [{
			key: 'dataimport',
			id: 'DATAIMPORT',
			path: '/forest/dataimport',
			name: '定位数据导入',
		}]
	}];
	static defaultOpenKeys = ["info",'analyze','import']
};
