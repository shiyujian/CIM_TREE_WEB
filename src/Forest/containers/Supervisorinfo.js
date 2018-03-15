import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select} from 'antd';
import * as actions from '../store';
import {PkCodeTree} from '../components';
import {PROJECT_UNITS} from '_platform/api';
import {SupervisorTable} from '../components/Supervisorinfo';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {getUser} from '_platform/auth'
const Option = Select.Option;
@connect(
	state => {
		const {forest,platform} = state;
		return {...forest,platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Supervisorinfo extends Component {
    biaoduan = [];
	constructor(props) {
        super(props)
        this.state = {
        	treeLists: [],
            sectionoption: [],
            smallclassoption: [],
            thinclassoption: [],
            statusoption: [],
            leftkeycode: '',
            resetkey: 0,
        }
    }
    componentDidMount() {
        this.biaoduan = [];
        PROJECT_UNITS[0].units.map(item => {
            this.biaoduan.push(item);
        })
        PROJECT_UNITS[1].units.map(item => {
            this.biaoduan.push(item);
        })
        const {actions: {getTree,getForestUsers,getTreeNodeList}, users,platform:{tree = {}}} = this.props; 
        // 避免反复获取森林用户数据，提高效率
        if(!users){
            getForestUsers();
        }
        if(!tree.bigTreeList){
            getTreeNodeList()
        }
        //状态
        let statusoption = [
            <Option key={'-1'} value={''}>全部</Option>,
            <Option key={'1'} value={"-1"}>未抽查</Option>,
            <Option key={'2'} value={"0"}>抽查未通过</Option>,
            <Option key={'3'} value={"1"}>抽查通过</Option>,
        ]
        this.setState({statusoption})
    }

	render() {
  		const {keycode} = this.props;
  		const {
            leftkeycode,
            sectionoption,
            smallclassoption,
            thinclassoption,
            statusoption,
            resetkey,
        } = this.state;
        const {platform:{tree={}}} = this.props;
        let treeList = [];
        if(tree.bigTreeList){
            treeList = tree.bigTreeList
        }
		return (
				<Body>
					<Main>
						<DynamicTitle title="监理验收信息" {...this.props}/>
						<Sidebar>
							<PkCodeTree treeData={treeList}
								selectedKeys={leftkeycode}
								onSelect={this.onSelect.bind(this)}
							/>
						</Sidebar>
						<Content>
							<SupervisorTable  
                             key={resetkey}
                             {...this.props} 
                             sectionoption={sectionoption}
                             sectionselect={this.sectionselect.bind(this)}
                             smallclassoption={smallclassoption}
                             smallclassselect={this.smallclassselect.bind(this)}
                             thinclassoption={thinclassoption}
                             thinclassselect={this.thinclassselect.bind(this)}
                             statusoption={statusoption}
                             leftkeycode={leftkeycode}
                             keycode={keycode}
                             resetinput={this.resetinput.bind(this)}
                            />
						</Content>
					</Main>
				</Body>);
	}
    //标段选择
    sectionselect(value) {
        const {actions:{setkeycode, getTree,getLittleBan}} =this.props;
        this.currentSection = value;
        getLittleBan({no:value}).then(rst =>{
            let smallclasses = [];
            rst.map((item, index) => {
                let smallname = {
                    code: rst[index].SmallClass,
                    name:rst[index].SmallClassName ? rst[index].SmallClassName : rst[index].SmallClass,
                }
                smallclasses.push(smallname)
            })
            this.setSmallClassOption(smallclasses)
        })
    }

    //小班选择, 重新获取: 细班、树种
    smallclassselect(value) {
        const {actions:{setkeycode,getTree,getLittleBan}} =this.props;
        getLittleBan({no:this.currentSection}).then(rst =>{
            let smallclasses = [];
            rst.map((item, index) => {
                if(item.SmallClass === value){
                    let smallname = {
                        code: rst[index].ThinClass,
                        name:rst[index].ThinClassName ? rst[index].ThinClassName : rst[index].ThinClass
                    }
                    smallclasses.push(smallname)
                }
            })
            this.setThinClassOption(smallclasses)
        })
        //树种
        this.typeselect('');
    }

    //细班选择, 重新获取: 树种
    thinclassselect(value,section) {
    }
    
    //设置标段选项
    setSectionOption(rst){
        let user = getUser();
        let section = JSON.parse(user.sections);
        if(rst instanceof Array){
            let sectionList = [];
            let sectionOptions = [];
            let sectionoption = rst.map((item, index) => {
                sectionList.push(item);
            })
            let sectionData = [...new Set(sectionList)];
            sectionData.sort();
            sectionData.map(sec => {
                sectionOptions.push(<Option key={sec.code} value={sec.code}>{sec.value}</Option>)
            })
            if(section.length === 0){   //admin用户赋给全部的查阅权限
                sectionOptions.unshift(<Option key={-1} value={''}>全部</Option>)
            }
            this.setState({sectionoption: sectionOptions})
        }
    }
    //设置小班选项
    setSmallClassOption(rst){
        if(rst instanceof Array){
            let smallclassList = [];
            let smallclassOptions = [];
            let smallclassoption = rst.map(item => {
                if(item.name) {
                    let smalls = {
                        name: item.name,
                        code:item.code,
                    }
                    smallclassList.push(smalls);
                }
            })
            let smalls = [];
            let array = [];
            smallclassList.map(item =>{
                if(array.indexOf(item.code) === -1){
                    smalls.push(item);
                    array.push(item.code)
                }
            })
            smalls.map(small => {
                smallclassOptions.push(<Option key={small.code} value={small.code}>{small.name}</Option>)
            })
            smallclassOptions.unshift(<Option key={-1} value={''}>全部</Option>)
            this.setState({smallclassoption: smallclassOptions})
        }
    }

    // 设置细班选项
    setThinClassOption(rst){
        if(rst instanceof Array){
            let thinclassList = [];
            let thinclassOptions = [];
            let thinclassoption = rst.map(item => {
                if(item.name) {
                    let thins = {
                        code:item.code,
                        name:item.name
                    };
                    thinclassList.push(thins);
                }
            })
            let thinclassData = [...new Set(thinclassList)];
            thinclassData.sort();
            let i = 0;
            thinclassData.map(thin => {
                thinclassOptions.push(<Option key={i} value={thin.code}>{thin.name}</Option>)
                i++
            })
            thinclassOptions.unshift(<Option key={-1} value={''}>全部</Option>)
            this.setState({thinclassoption: thinclassOptions})
        }
    }

    //重置
    resetinput(leftkeycode) {
        this.setState({resetkey:++this.state.resetkey},() => {
            this.onSelect([leftkeycode])
        })
    }

    //树选择, 重新获取: 标段、小班、细班、树种并置空
	onSelect(value = []) {
        let user = getUser()
        let keycode = value[0] || '';
        const {actions:{setkeycode,gettreetype,getTree,getLittleBan}} =this.props;
	    setkeycode(keycode);
        this.setState({leftkeycode:keycode,resetkey:++this.state.resetkey})
        let sections = JSON.parse(user.sections);
        //标段
        let rst = [];
        if(sections.length === 0){   //是admin
            rst = this.biaoduan.filter(item =>{
                return item.code.indexOf(keycode) !== -1;
            })
        }else{
            rst = this.biaoduan.filter(item =>{
                return item.code.indexOf(keycode) !== -1 && sections.indexOf(item.code) !== -1;
            })
        }
        this.setSectionOption(rst)
    }
}