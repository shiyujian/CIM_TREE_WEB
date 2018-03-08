import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select} from 'antd';
import * as actions from '../store';
import {PkCodeTree} from '../components';
import {PROJECT_UNITS} from '_platform/api';
import {CheckerTable} from '../components/Checkerinfo';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';

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
export default class Checkerinfo extends Component {
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
        const {actions: {getTree,gettreetype,getTreeList,getForestUsers,getTreeNodeList}, users,platform:{tree = {}}} = this.props; 
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
        if(!tree.bigTreeList){
            getTreeNodeList()
        }
        //地块树
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
        //状态
        let statusoption = [
            <Option key={'-1'} value={''}>全部</Option>,
            <Option key={'1'} value={"2"}>抽检未通过</Option>,
            <Option key={'2'} value={"3"}>抽检通过</Option>,
            <Option key={'3'} value={"0"}>业主未抽查</Option>,
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
                        <DynamicTitle title="业主抽查信息" {...this.props}/>
                        <Sidebar>
                            <PkCodeTree treeData={treeList}
                                selectedKeys={leftkeycode}
                                onSelect={this.onSelect.bind(this)}
                                // onExpand={this.onExpand.bind(this)}
                            />
                        </Sidebar>
                        <Content>
                            <CheckerTable  
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
    //标段选择, 重新获取: 小班、细班、树种
    sectionselect(value) {
        const {actions:{setkeycode, getTree,getLittleBan}} =this.props;
        this.currentSection = value;
        getLittleBan({no:value}).then(rst =>{
            let smallclasses = [];
            rst.map((item, index) => {
                let smallname = {
                    Name: rst[index].SmallClass,
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
                        Name: rst[index].ThinClass,
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
            sectionOptions.unshift(<Option key={-1} value={''}>全部</Option>)
            this.setState({sectionoption: sectionOptions})
        }
    }
    //设置小班选项
    setSmallClassOption(rst){
        if(rst instanceof Array){
            let smallclassList = [];
            let smallclassOptions = [];
            let smallclassoption = rst.map(item => {
                if(item.Name) {
                    let smalls = item.Name;
                    smallclassList.push(smalls);
                }
            })
            let smallclassData = [...new Set(smallclassList)];
            smallclassData.sort();
            smallclassData.map(small => {
                smallclassOptions.push(<Option key={small} value={small}>{small}</Option>)
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
                if(item.Name) {
                    let thins = item.Name;
                    thinclassList.push(thins);
                }
            })
            let thinclassData = [...new Set(thinclassList)];
            thinclassData.sort();
            thinclassData.map(thin => {
                thinclassOptions.push(<Option key={thin} value={thin}>{thin}</Option>)
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
        let keycode = value[0] || '';
        const {actions:{setkeycode,gettreetype,getTree,getLittleBan}} =this.props;
	    setkeycode(keycode);
        this.setState({leftkeycode:keycode,resetkey:++this.state.resetkey})
        
        //标段
        let rst = this.biaoduan.filter(item =>{
            return item.code.indexOf(keycode) !== -1;
        })
        this.setSectionOption(rst)
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