import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select} from 'antd';
import * as actions from '../store';
import {PkCodeTree} from '../components';
import {PROJECT_UNITS} from '_platform/api';
import {SeedlingsInfo} from '../components/SeedlingsChange';
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
export default class SeedlingsChange extends Component {
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
            treetypeoption: [],
        }
    }
    componentDidMount() {
        const {actions: {getTree,gettreetype,getTreeList,getForestUsers,getTreeNodeList,getLittleBanAll,setkeycode}, users,treetypes,littleBanAll,platform:{tree = {}}} = this.props; 
        this.biaoduan = [];
        for(let i=0;i<PROJECT_UNITS.length;i++){
            PROJECT_UNITS[i].units.map(item => {
                this.biaoduan.push(item);
            })
        }

        setkeycode('')
        // 避免反复获取森林用户数据，提高效率
        if(!users){
            getForestUsers();
        }
        if(!treetypes){
            getTreeList();
        }
        if(!tree.bigTreeList){
            getTreeNodeList()
        }
        if(!littleBanAll){
            getLittleBanAll()
        }
        //类型
        let typeoption = [
            <Option key={'-1'} value={''}>全部</Option>,
            <Option key={'1'} value={'1'}>常绿乔木</Option>,
            <Option key={'2'} value={'2'}>落叶乔木</Option>,
            <Option key={'3'} value={'3'}>亚乔木</Option>,
            <Option key={'4'} value={'4'}>灌木</Option>,
            <Option key={'5'} value={'5'}>地被</Option>,
        ];
        //状态
        let statusoption = [
            <Option key={'-1'} value={''}>全部</Option>,
            <Option key={'1'} value={"-1"}>未抽查</Option>,
            <Option key={'4'} value={"2"}>业主抽查退回</Option>,
            <Option key={'5'} value={"3"}>业主抽查通过</Option>,
        ]
        this.setState({statusoption,typeoption})
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
            treetypeoption,
            typeoption,
            treetypelist,
            bigType
        } = this.state;
        const {platform:{tree={}}} = this.props;
        let treeList = [];
        if(tree.bigTreeList){
            treeList = tree.bigTreeList
        }
        return (
                <Body>
                    <Main>
                        <DynamicTitle title="苗木信息修改" {...this.props}/>
                        <Sidebar width={190}>
                            <PkCodeTree treeData={treeList}
                                selectedKeys={leftkeycode}
                                onSelect={this.onSelect.bind(this)}
                            />
                        </Sidebar>
                        <Content>
                            <SeedlingsInfo  
                             key={resetkey}
                             {...this.props} 
                             sectionoption={sectionoption}
                             smallclassoption={smallclassoption}
                             thinclassoption={thinclassoption}
                             bigType={bigType}
                             treetypeoption={treetypeoption} 
                             typeoption={typeoption}
                             statusoption={statusoption}
                             leftkeycode={leftkeycode}
                             keycode={keycode}
                             resetinput={this.resetinput.bind(this)}
                            />
                        </Content>
                    </Main>
                </Body>);
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
            // if(section.length === 0){   //admin用户赋给全部的查阅权限
            //     sectionOptions.unshift(<Option key={-1} value={''}>全部</Option>)
            // }
            this.setState({sectionoption: sectionOptions})
        }
    }

    //重置
    resetinput(leftkeycode) {
        this.setState({resetkey:++this.state.resetkey},() => {
            this.onSelect([leftkeycode])
        })
    }
    
  
}