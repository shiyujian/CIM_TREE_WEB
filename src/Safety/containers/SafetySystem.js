import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select} from 'antd';
import PkCodeTree from '../components/PkCodeTree.js';
import {SafetyTable, AddModal} from '../components/SafetySystem';
import {actions as platformActions} from '_platform/store/global';
import {PROJECT_UNITS,FORESTTYPE} from '_platform/api';
import {actions} from '../store/safetySystem'
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
const Option = Select.Option;
@connect(
    state => {
        const {safety: {safetySystem = {}}, platform} = state;
        return {...safetySystem,platform};
    },
    dispatch => ({
        actions: bindActionCreators({...actions, ...platformActions}, dispatch),
    }),
)
export default class SafetySystem extends Component {
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
        // const {actions: {getTree,gettreetype,getTreeList}} = this.props;
        // //地块树
        // try {
        //     getTree({},{parent:'root'})
        //     .then(rst => {
        //         if(rst instanceof Array && rst.length > 0){
        //             rst.forEach((item,index) => {
        //                 rst[index].children = []
        //             })
        //             getTree({},{parent:rst[0].No})
        //             .then(rst1 => {
        //                 if(rst1 instanceof Array && rst1.length > 0){
        //                     rst1.forEach((item,index) => {
        //                         rst1[index].children = []
        //                     })
        //                     getNewTreeData(rst,rst[0].No,rst1)
        //                     getTree({},{parent:rst1[0].No})
        //                     .then(rst2 => {
        //                         if(rst2 instanceof Array && rst2.length > 0){
        //                             getNewTreeData(rst,rst1[0].No,rst2)
        //                             this.setState({treeLists:rst},() => {
        //                                 this.onSelect([rst2[0].No])
        //                             })
        //                             // getNewTreeData(rst,rst[0].No,rst2)
        //                             // getTree({},{parent:rst2[0].No})
        //                             // .then(rst3 => {
        //                             //     if(rst3 instanceof Array && rst3.length > 0){
        //                             //         getNewTreeData(rst,rst2[0].No,rst3)
        //                             //         this.setState({treeLists:rst},() => {
        //                             //             this.onSelect([rst3[0].No])
        //                             //         })
        //                             //     } else {
        //                             //         this.setState({treeLists:rst})
        //                             //     }
        //                             // })
        //                         } else {
        //                             this.setState({treeLists:rst})
        //                         }
        //                     })
        //                 }else {
        //                     this.setState({treeLists:rst})
        //                 }
        //             })
        //         }
        //     })
        // } catch(e){
        //     console.log(e)
        // }

        const {actions: {getTree,gettreetype,getTreeList,getForestUsers,getTreeNodeList,getForestTreeNodeList}, users, treetypes,platform:{tree = {}}} = this.props; 
        this.biaoduan = [];
        PROJECT_UNITS[0].units.map(item => {
            this.biaoduan.push(item);
        })
        PROJECT_UNITS[1].units.map(item => {
            this.biaoduan.push(item);
        })
        // 避免反复获取森林用户数据，提高效率
        if(!users){
            getForestUsers();
        }
        if(!treetypes){
            getTreeList();
        }
        // 避免反复获取森林树种列表，提高效率
        if(!tree.bigTreeList){
            getTreeNodeList()
        }
        //类型
        let typeoption = [
            <Option key={'-1'} value={''}>全部</Option>,
            <Option key={'1'} value={'1'}>1</Option>,
            <Option key={'2'} value={'2'}>2</Option>,
            <Option key={'3'} value={'3'}>3</Option>,
            <Option key={'4'} value={'4'}>4</Option>,
            <Option key={'5'} value={'5'}>5</Option>,
        ];
        this.setState({typeoption})
        //通过
        let standardoption = [
            <Option key={'-1'} value={''}>全部</Option>,
            <Option key={'1'} value={'1'}>通过</Option>,
            <Option key={'2'} value={'0'}>不通过</Option>,
        ]
        this.setState({standardoption})
    }

    render() {
        const {keycode, addVisible} = this.props;
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
        console.log("addVisible:",addVisible);

        const {platform:{tree={}}} = this.props;
        let treeList = [];
        if(tree.bigTreeList){
            treeList = tree.bigTreeList
        }
        return (
            <Body>
                <Main>
                    <DynamicTitle title="安全体系" {...this.props}/>
                    <Sidebar>
                        <PkCodeTree 
                            treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                            onExpand={this.onExpand.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <SafetyTable  
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
                        {
                            addVisible && <AddModal {...this.props}/>
                        }
                    </Content>
                </Main>
            </Body>
        );
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
            if (curKey == item.No) {
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