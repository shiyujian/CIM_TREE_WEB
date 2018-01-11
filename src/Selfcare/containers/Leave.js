import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select} from 'antd';
import * as actions from '../store';
// import {PkCodeTree} from '../components';
import {LeaveTable} from '../components/Leave';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
const Option = Select.Option;
@connect(
    state => {
        const {selfcare,platform} = state;
        return {...selfcare,platform};
    },
    dispatch => ({
        actions: bindActionCreators({...actions, ...platformActions}, dispatch),
    }),
)
export default class Leave extends Component {
    constructor(props) {
        super(props)
        this.state = {
            treeLists: [],
            treetypeoption: [],
            treetypelist: [],
            sectionoption: [],
            typeoption: [],
            standardoption: [],
            leftkeycode: '',
            resetkey: 0,
        }
    }
    componentDidMount() {
        
        //类型
        let typeoption = [
            <Option key={'-1'} value={''}>全部</Option>,
            <Option key={'1'} value={'1'}>病假</Option>,
            <Option key={'2'} value={'2'}>事假</Option>,
        ];
        this.setState({typeoption})
        //诚信
        let standardoption = [
            <Option key={'-1'} value={''}>全部</Option>,
            <Option key={'1'} value={'1'}>通过</Option>,
            <Option key={'2'} value={'0'}>不通过</Option>,
        ]
        this.setState({standardoption})
    }

    render() {
        const {keycode} = this.props;
        const {
            leftkeycode,
            treeLists,
            treetypeoption,
            treetypelist,
            sectionoption,
            typeoption,
            standardoption,
            resetkey,
        } = this.state;
        return (
                <Body>
                    <Main>
                        <DynamicTitle title="个人请假" {...this.props}/>
                        <Content>
                            <LeaveTable  
                             key={resetkey}
                             {...this.props} 
                             sectionoption={sectionoption}
                             sectionselect={this.sectionselect.bind(this)}
                             typeoption={typeoption}
                             typeselect={this.typeselect.bind(this)}
                             treetypeoption={treetypeoption} 
                             treetypelist={treetypelist}
                             standardoption={standardoption}
                             leftkeycode={leftkeycode}
                             keycode={keycode}
                             resetinput={this.resetinput.bind(this)}
                            />
                        </Content>
                    </Main>
                </Body>);
    }
    //标段选择, 重新获取: 树种
    sectionselect(value,treety) {
        const {actions:{setkeycode,getTreeList}} =this.props;
        const {leftkeycode} = this.state;
        setkeycode(leftkeycode)
        //树种
        getTreeList({},{field:'treetype',no:leftkeycode,section:value,treety,paginate:false})
        .then(rst => {
            this.setTreeTypeOption(rst)
        })
    }

    //类型选择, 重新获取: 树种
    typeselect(value,keycode,section){
        const {actions:{setkeycode,getTreeList}} =this.props;
        //树种
        getTreeList({},{field:'treetype',no:keycode,treety:value,section,paginate:false})
        .then(rst => {
            this.setTreeTypeOption(rst)
        })
    }

     //设置标段选项
    setSectionOption(rst){
        if(rst instanceof Array){
            let sectionoption = rst.map(item => {
                return <Option key={item} value={item}>{item}</Option>
            })
            sectionoption.unshift(<Option key={-1} value={''}>全部</Option>)
            this.setState({sectionoption})
        }
    }

    //设置树种选项
    setTreeTypeOption(rst) {
        if(rst instanceof Array){
            let treetypeoption = rst.map(item => {
                return <Option key={item.name} value={item.name}>{item.name}</Option>
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
        let keycode = value[0] || '';
        const {actions:{setkeycode,gettreetype,getTreeList,getTree}} =this.props;
        setkeycode(keycode);
        this.setState({leftkeycode:keycode,resetkey:++this.state.resetkey})
        
        //标段
        getTreeList({},{field:'section',no:keycode,paginate:false})
        .then(rst => {
            this.setSectionOption(rst)
        })
        //树种
        gettreetype({},{no:keycode,paginate:false})
        .then(rst => {
            this.setTreeTypeOption(rst)
        })
    }
    //树展开
    onExpand(expandedKeys,info) {
        const treeNode = info.node;
        const {actions: {getTree}} = this.props;
        const {treeLists} = this.state;
        const keycode = treeNode.props.eventKey;
        getTree({},{parent:keycode,paginate:false})
        .then(rst => {
            if(rst instanceof Array){
                if(rst.length > 0 && rst[0].wptype != '子单位工程') {
                    rst.forEach((item,index) => {
                        rst[index].children = []
                    })
                }
                getNewTreeData(treeLists,keycode,rst)
                this.setState({treeLists:treeLists})
            }
        })
    }
}
//连接树children
function getNewTreeData(treeData, curKey, child) {
    const loop = (data) => {
        data.forEach((item) => {
            if (curKey == item.attrs.no) {
                item.children = child;
            }else{
                if(item.children)
                    loop(item.children);
            }
        });
    };
    try {
       loop(treeData);
    } catch(e) {
        console.log(e)
    }
}