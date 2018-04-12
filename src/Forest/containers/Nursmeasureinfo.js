import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select} from 'antd';
import * as actions from '../store';
import {PkCodeTree} from '../components';
import {NursmeasureTable} from '../components/Nursmeasureinfo';
import {actions as platformActions} from '_platform/store/global';
import {PROJECT_UNITS} from '_platform/api';
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
export default class Nursmeasureinfo extends Component {
    biaoduan = [];
    constructor(props) {
        super(props)
        this.state = {
            treeLists: [],
            treetypeoption: [],
            sectionoption: [],
            typeoption: [],
            mmtypeoption: [],
            treetypelist: [],
            statusoption: [],
            leftkeycode: '',
            resetkey: 0,
            bigType: '',
        }
    }
    getbigTypeName(type){
        switch(type){
            case '1':
                return '常绿乔木'
            case '2':
                return '落叶乔木'
            case '3':
                return '亚乔木'
            case '4':
                return '灌木'
            case '5':
                return '草本'
            default :
            return ''
        }
    }
    componentDidMount() {
        this.biaoduan = [];
        for(let i=0;i<PROJECT_UNITS.length;i++){
            PROJECT_UNITS[i].units.map(item => {
                this.biaoduan.push(item);
            })
        }
        const {actions: {getTree,gettreetype,getTreeList,getForestUsers,getTreeNodeList}, users, treetypes,platform:{tree = {}}} = this.props; 
        // 避免反复获取森林用户数据，提高效率
        if(!users){
            getForestUsers();
        }
        // 避免反复获取森林树种列表，提高效率
        if(!treetypes){
            getTreeList().then(x => this.setTreeTypeOption(x));
        }
        if(!tree.bigTreeList){
            getTreeNodeList()
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
        let mmtypeoption = [
            <Option key={'-1'} value={''}>全部</Option>,
            <Option key={'1'} value={'1'}>生态林</Option>,
            <Option key={'2'} value={'0'}>苗景林</Option>,
        ];

        let statusoption = [
            <Option key={'-1'} value={''}>全部</Option>,
            <Option key={'1'} value={'1'}>未打包</Option>,
            <Option key={'2'} value={'0'}>已打包</Option>,
        ];
        this.setState({typeoption,mmtypeoption,statusoption})
    }

    render() {
        const {keycode} = this.props;
        const {
            leftkeycode,
            treetypeoption,
            sectionoption,
            treetypelist,
            typeoption,
            mmtypeoption,
            bigType,
            resetkey,
            statusoption,
        } = this.state;
        const {platform:{tree={}}} = this.props;
        let treeList = [];
        if(tree.bigTreeList){
            treeList = tree.bigTreeList
        }
        return (
                <Body>
                    <Main>
                        <DynamicTitle title="苗圃测量信息" {...this.props}/>
                        <Sidebar>
                            <PkCodeTree treeData={treeList}
                                selectedKeys={leftkeycode}
                                onSelect={this.onSelect.bind(this)}
                            />
                        </Sidebar>
                        <Content>
                            <NursmeasureTable  
                             key={resetkey}
                             {...this.props} 
                             sectionoption={sectionoption}
                             sectionselect={this.sectionselect.bind(this)}
                             bigType={bigType}
                             typeoption={typeoption}
                             mmtypeoption={mmtypeoption}
                             typeselect={this.typeselect.bind(this)}
                             treetypeoption={treetypeoption} 
                             treetypelist={treetypelist}
                             leftkeycode={leftkeycode}
                             statusoption={statusoption}
                             keycode={keycode}
                             resetinput={this.resetinput.bind(this)}
                            />
                        </Content>
                    </Main>
                </Body>);
    }
    //标段选择, 重新获取: 树种
    sectionselect(value) {
        const {actions:{setkeycode}} =this.props;
        const {leftkeycode} = this.state;
        setkeycode(leftkeycode)
        //树种
        this.typeselect('');
    }
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

    //类型选择, 重新获取: 树种
    typeselect(value){
        const {treetypes} =this.props;
        this.setState({bigType: value});
        let selectTreeType = [];
        treetypes.map(item =>{
            let code = item.TreeTypeNo.substr(0,1);
            if(code === value){
                selectTreeType.push(item);
            }
        })
        this.setTreeTypeOption(selectTreeType);
    }

    //设置树种选项
    setTreeTypeOption(rst) {
        if(rst instanceof Array){
            let treetypeoption = rst.map(item => {
                return <Option key={item.id} value={item.ID}>{item.TreeTypeName}</Option>
            })
            treetypeoption.unshift(<Option key={-1} value={''}>全部</Option>)
            this.setState({treetypeoption,treetypelist:rst})
        }
    }

    //重置
    resetinput(leftkeycode) {
        this.setState({resetkey:++this.state.resetkey},() => {
            this.onSelect([leftkeycode])
        })
    }

    //树选择, 重新获取: 标段、树种并置空
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
        //树种
        this.typeselect('');
    }
}