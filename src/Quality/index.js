import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {Main, Aside, Body} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as actions2 } from './store/cells';
import { actions as actions3 } from './store/subitem';
import {Icon} from 'react-fa';
import {getUser} from '_platform/auth'
import {message} from 'antd'
// @connect(
//     state => {
//         const { item = {} } = state.quality || {};
//         return item;
//     },
//     dispatch => ({
// 		cellActions: bindActionCreators({ ...actions2 }, dispatch),
// 		hyjActions: bindActionCreators({ ...actions3 }, dispatch),
//     }),
// )
 class Quality extends Component {
	constructor(props){
		super(props)
		this.state = {
			dwysjl:false
		}
	}

	async componentDidMount() {
		const {default: reducer} = await import('./store');
		const Containers = await import('./containers');
		console.log('Containers',Containers)
		injectReducer('quality', reducer);
		this.setState({
			...Containers,
		});
		let { getUserById } = this.props.cellActions;
       getUserById({ pk: getUser().id }).then(rst => {
			let orgcode;
			try{
				orgcode = rst.account.org_code;
				if(!orgcode){
					//message.error('当前用户无组织部门');
					return;
				}
			}catch(e){
				return;
			}
			let {fetchRootOrg} = this.props.hyjActions;
			fetchRootOrg({code:orgcode}).then(rst=>{
				console.log('当前用户组织结构反转', rst);
				if (rst.children[0].name.indexOf('监理')>=0) {
					this.setState({ dwysjl: true });
					//message.info('当前登录为监理单位');
				}
				if (rst.children[0].name.indexOf('施工')>=0) {
					//message.info('当前登录为施工单位');
				}
			});
			console.log(rst);
			let have = false;
			if (rst) {
				console.log(rst);
				if (rst && rst.groups) {
					rst.groups.forEach(ele => {
						if (ele.name.indexOf('监理') >= 0) {
							have = true;
						}
					});
				}
			}
			if (have) {
				this.setState({ dwysjl: true });
			}
        });
	}
	render() {
		const {TianBaoJL,Item, Cell, Inspection, Evaluate, DanweiJLShow,Cells, Defect,HuaFen,DanweiJL,DanweiJLAsk,Monitoring,TianBao,TianBao2, Fenbu, Danwei, FenbuRecord,Query,FenbuPreview,Subitem,DanWeiAsk,FenbuCheck} = this.state || {};
		let dwys = this.state.dwysjl?DanweiJL:Danwei;
		let jyptb = this.state.dwysjl?TianBaoJL:TianBao;
		return (
			<Body>
			<Aside>
				<Submenu {...this.props} menus={menus}/>
			</Aside>
			<Main>
				{Item && <Route exact path="/quality" component={Item}/>}
				{HuaFen && <Route path="/quality/yanshou/huafen" component={HuaFen}/>}
				{jyptb && <Route path="/quality/yanshou/tianbao" component={jyptb}/>}
				{Cell && <Route path="/quality/cell" component={Cell}/>}
				{Inspection && <Route path="/quality/inspection" component={Inspection}/>}
				{Evaluate && <Route path="/quality/evaluate" component={Evaluate}/>}
                {Defect && <Route path="/quality/defect" component={Defect}/>}
                {Fenbu && <Route exact path="/quality/yanshou/fenbu" component={Fenbu}/>}
				{dwys && <Route path="/quality/yanshou/danwei" component={dwys}/>}
				{DanweiJL && <Route path="/quality/yanshou/danweiJL" component={DanweiJL}/>}
                {FenbuRecord && <Route path="/quality/yanshou/fenbu/record" component={FenbuRecord}/>}
				{Monitoring && <Route path="/quality/monitoring" component={Monitoring}/>}
				{Query && <Route path="/quality/yanshou/query" component={Query}/>}
				{FenbuPreview && <Route path="/quality/yanshou/fenbu/preview" component={FenbuPreview}/>}
				{DanWeiAsk && <Route path="/quality/yanshou/danweiask" component={DanWeiAsk}/>}
				{DanweiJLShow && <Route path="/quality/yanshou/danweijlshow" component={DanweiJLShow}/>}
				{DanweiJLAsk && <Route path="/quality/yanshou/danweijlask" component={DanweiJLAsk}/>}
				{Subitem && <Route path="/quality/yanshou/subitem" component={Subitem}/>}
				{FenbuCheck && <Route path="/quality/yanshou/fenbu/check" component={FenbuCheck}/>}
			</Main>
			</Body>);
	}
}
export default connect(
    state => {
        const { item = {} } = state.quality || {};
        return item;
    },
    dispatch => ({
		cellActions: bindActionCreators({ ...actions2 }, dispatch),
		hyjActions: bindActionCreators({ ...actions3 }, dispatch),
    }),
)(Quality);
// const menus = [{
// 	key: 'tongji',
// 	name: '统计分析',
// 	path: '/quality',
// 	icon: <Icon name="tasks"/>
// }, {
// 	key: 'yanshou',
// 	name: '质量验收',
// 	path: '/quality/yanshou',
// 	icon: <Icon name="check-square-o"/>,
// 	children:[
// 	{
// 		name:'验收查询',
// 		path:''
// 	},		{
// 		name:'检验批划分',
// 		path:'/quality/yanshou/huafen'
// 	},		{
// 		name:'检验批填报',
// 		path:'/quality/yanshou/tianbao'
// 	},		{
// 		name:'分项验收',
// 		path:''
// 	},		{
// 		name:'分部验收',
// 		path:''
// 	},		{
// 		name:'单位工程验收',
// 		path:''
// 	},
// ]
// }, {
// 	key: 'monitoring',
// 	name: '质量监控',
// 	path: '/quality/monitoring',
// 	icon: <Icon name="wpforms"/>,
// }, {
// 	key: 'defect',
// 	name: '质量缺陷',
// 	path: '/quality/defect',
// 	icon: <Icon name="life-buoy"/>
// }];

const menus = [
	{
		key: 'tongji',
		id: 'QUALITY.TONGJI',
		name: '统计分析',
		path: '/quality',
		icon: <Icon name="tasks" />
	},
	{
		key: 'yanshou',
		name: '质量验收',
		path: '/quality/yanshou',
		icon: <Icon name="check-square-o" />,
		children: [
			{
        		key: 'query',
        		id: 'QUALITY.QUERY',
				name: '验收查询',
				path: '/quality/yanshou/query',
				icon: <Icon name="bullseye"/>
			},{
        		key: 'huafen',
        		id: 'QUALITY.HUAFEN',
				name: '检验批划分',
				path: '/quality/yanshou/huafen',
				icon: <Icon name="asterisk"/>
			}, {
        		key: 'tianbao',
        		id: 'QUALITY.TIANBAO',
				name: '检验批填报',
				path: '/quality/yanshou/tianbao',
				icon: <Icon name="anchor"/>
			}, {
        		key: 'subitem',
        		id: 'QUALITY.SUBITEM',
				name: '分项验收',
				path: '/quality/yanshou/subitem',
				icon: <Icon name="arrows"/>
			}, {
        		key: 'fenbu',
        		id: 'QUALITY.FENBU',
				name: '分部验收',
				path: '/quality/yanshou/fenbu',
				icon: <Icon name="certificate"/>
			}, {
        		key: 'danwei',
        		id: 'QUALITY.DANWEI',
				name: '单位工程验收',
				path: '/quality/yanshou/danwei',
				icon: <Icon name="crosshairs"/>
			}
		]
	}, {
		key: 'monitoring',
		id: 'QUALITY.MONITORING',
		name: '质量监控',
		path: '/quality/monitoring',
		icon: <Icon name="wpforms" />,
    }, {
    	key: 'defect',
		id: 'QUALITY.DEFECT',
    	name: '质量缺陷',
    	path: '/quality/defect',
    	icon: <Icon name="life-buoy"/>
    }];
