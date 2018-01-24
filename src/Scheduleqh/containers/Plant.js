import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select, Row, Col, DatePicker, Cards} from 'antd';
import * as actions from '../store/entry';
import moment from 'moment';
import {PkCodeTree} from '../components';
import {ScheduleTable} from '../components/Scheduleanalyze';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {groupBy} from 'lodash';

var echarts = require('echarts');
const {RangePicker} = DatePicker;
const Option = Select.Option;

@connect(
    state => {
        const {platform} = state || {};
        return {platform};
    },
    dispatch => ({
        actions: bindActionCreators({...actions, ...platformActions}, dispatch),
    }),
)
export default class Scheduleanalyze extends Component {

    constructor(props) {
        super(props)
        this.state = {
            treeLists: [],
            sectionoption: [],
            smallclassoption: [],
            leftkeycode: '',
            section: '',
            smallclass: '',
            data:[],
            account:"",
            biaoduan:[],
            shuzhi:[],
        }
    }

    componentDidMount () {
         // const {actions: {getTree}} = this.props;
          

        const {actions: {getTree,getTreeList}} = this.props;
           getTree()
            .then(rst => {
                this.setSectionOption(rst);
                this.setSmallClassOption(rst);
            });
        //地块树
         try {
            getTree({},{parent:'root'})
            .then(rst => {
                if(rst instanceof Array && rst.length > 0){
                    rst.forEach((item,index) => {
                        rst[index].children = []
                    })
                    getTree({},{parent:rst[0].No})
                    .then(rst1 => {
                        if(rst1 instanceof Array && rst1.length > 0){
                            rst1.forEach((item,index) => {
                                rst1[index].children = []
                            })
                            getNewTreeData(rst,rst[0].No,rst1)
                            getTree({},{parent:rst1[0].No})
                            .then(rst2 => {
                                if(rst2 instanceof Array && rst2.length > 0){
                                    getNewTreeData(rst,rst1[0].No,rst2)
                                    this.setState({treeLists:rst},() => {
                                        this.onSelect([rst2[0].No])
                                    })
                                    // getNewTreeData(rst,rst[0].No,rst2)
                                    // getTree({},{parent:rst2[0].No})
                                    // .then(rst3 => {
                                    //     if(rst3 instanceof Array && rst3.length > 0){
                                    //         getNewTreeData(rst,rst2[0].No,rst3)
                                    //         this.setState({treeLists:rst},() => {
                                    //             this.onSelect([rst3[0].No])
                                    //         })
                                    //     } else {
                                    //         this.setState({treeLists:rst})
                                    //     }
                                    // })
                                } else {
                                    this.setState({treeLists:rst})
                                }
                            })
                        }else {
                            this.setState({treeLists:rst})
                        }
                    })
                }
            })
        } catch(e){
            console.log(e)
        }
    }

    render() {
        const {keycode} = this.props;
        const {
            treeLists,
            sectionoption,
            leftkeycode,
            smallclassoption,
            section,
            smallclass,
        } = this.state;
        return (
            <Body>
                <Main>
                    <DynamicTitle title="种植进度分析" {...this.props}/>
                    <Sidebar>
                        <PkCodeTree treeData={treeLists}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                            onExpand={this.onExpand.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <ScheduleTable
                            key={leftkeycode}
                            {...this.props} 
                            sectionoption={sectionoption}
                            section={section}
                            leftkeycode={leftkeycode}
                            smallclassoption={smallclassoption}
                            sectionselect={this.sectionselect.bind(this)}
                            smallclass={smallclass}
                        />
                    </Content>
                </Main>
            </Body>
        );
    }
    //标段选择, 重新获取: 小班、细班、树种
    // sectionselect(value) {

    //     const {actions:{setkeycode,getTreeList}} = this.props;
    //     const {leftkeycode} = this.state;
    //     this.setState({section:value})
    //     //小班
    //     getTreeList({},{field:'smallclass',no:leftkeycode,section:value,paginate:false})
    //     .then(rst => {
    //         if(rst instanceof Array){
    //             let smallName;
    //             let smallNameArr = Array();
    //             if(rst instanceof Array){
    //                 debugger;
    //                 let smallclassoption = rst.map(item => {
    //                     console.log(11111,item);

    //                     let smallclassName = item.attrs.name;
    //                     // smallName = smallclassName.replace("号小班","");
    //                     smallName = smallclassName
    //                     if (smallName < 100) {
    //                         smallName = "0" + smallName;
    //                     }
    //                     if (smallName < 10) {
    //                         smallName = "00" + smallName;
    //                     }
    //                     smallNameArr.push(smallName);
    //                     return <Option key={smallName} value={smallName}>{smallName}</Option>
    //                 })
    //                 console.log("smallNameArr",smallNameArr[0]);
    //                 this.setState({smallclassoption, smallclass:smallNameArr[0]})
    //             }
    //         }
    //     })
    // }

    //标段选择, 重新获取: 小班、细班、树种
    sectionselect(value,treety) {
        const {actions:{setkeycode, getTreeList, getTree}} =this.props;
        const {leftkeycode} = this.state;
        setkeycode(leftkeycode)
        //小班
        getTree({},{parent:leftkeycode})
        .then(rst => {
            console.log(rst,"dwa")
            let smallclasses = [];
            rst.map((item, index) => {
                if(rst[index].Section == value) {
                    let smallclassName = rst[index].Name.replace("号小班","");
                     if (smallclassName < 100) {
                            smallclassName = "0" + smallclassName;
                        }
                        // if (smallclassName < 10) {
                        //     smallclassName = "00" + smallclassName;
                        // }
                    let smallname = {
                        Name: smallclassName,
                    }
                    smallclasses.push(smallname)
                }
            })
            this.setSmallClassOption(smallclasses)
        })
        //细班
        // getTree({},{parent:leftkeycode})
        // .then((rst, index) => {
        //     let thin = [];
        //     let promises = rst.map(item => {
        //         return getTree({}, {parent: item.No})
        //     })
        //     Promise.all(promises).then(rest => {
        //         rest.map(items => {
        //             items.map(i => {
        //                 thin.push(i);
        //             })
        //         })
        //         this.setThinClassOption(thin)
        //     })
        // })
        // //树种
        // getTreeList()
        // .then(rst => {
        //     this.setTreeTypeOption(rst)
        // })
    }


    //设置标段选项
    setSectionOption(rst){
        if(rst instanceof Array){
            let sectionList = [];
            let sectionOptions = [];
            let sectionoption = rst.map((item, index) => {
                if(item.Section) {
                    let sections = item.Section;
                    sectionList.push(sections);
                }
            })
            let sectionData = [...new Set(sectionList)];
            sectionData.sort();
            sectionData.map(sec => {
                sectionOptions.push(<Option key={sec} value={sec}>{sec}</Option>)
            })
            // sectionOptions.unshift(<Option key={-1} value={''}>全部</Option>)
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
            // smallclassOptions.unshift(<Option key={-1} value={''}>全部</Option>)
            this.setState({smallclassoption: smallclassOptions})
        }
    }
     //树选择
    onSelect(value = []) {
        let keycode = value[0] || '';
        const {actions:{gettreetype1}} =this.props;
        this.setState({leftkeycode:keycode})
        //标段
        gettreetype1()
        // gettreetype({},{no:keycode,paginate:false})
        .then(rst => {
            // this.setTreeTypeOption(rst)
            console.log(rst);
            let res = groupBy(rst, function(n){
                return n.Section
            });
            let biaoduan = Object.keys(res);
            let trees = [];
            // let qaz = 0;
            let wsx = [];
            trees = Object.entries(res);
            for(var j = 0 ; j<=trees.length-1; j++){
                  var abc = trees[j][1];
                 let qaz = 0;
                  for(var k = 0 ; k<=abc.length-1; k++){
                     qaz = qaz + abc[k].Num;
                  }
                   wsx.push(qaz);
            }
            let Num1 = 0;
                for(var i = 0; i<=rst.length-1; i++){
                    Num1 = Num1 + rst[i].Num;
                }
            this.setState({
                data:res,
                account:Num1,
                biaoduan:biaoduan,
                shuzhi:wsx,

            })
           

        })
    }
    //     getTreeList({},{field:'section',no:keycode,paginate:false})
    //     .then(rst => {
    //         if(rst instanceof Array){
    //             let sectionoption = rst.map(item => {
    //                 return <Option key={item} value={item}>{item}</Option>
    //             })
    //              // 小班默认值
    //             getTreeList({},{field:'smallclass',section:rst[0],paginate:false})
    //             .then(rst => {
    //                 let smallName;
    //                 let smallNameArr = Array();
    //                 if(rst instanceof Array){
    //                     let smallclassoption = rst.map(item => {
    //                         let smallclassName = item.attrs.name;
    //                         smallName = smallclassName.replace("号小班","");
    //                         if (smallName < 100) {
    //                             smallName = "0" + smallName;
    //                         }
    //                         smallNameArr.push(smallName);
    //                         return <Option key={smallName} value={smallName}>{smallName}</Option>
    //                     })
    //                     this.setState({smallclassoption, smallclass:smallNameArr[0]})
    //                 }  
    //             })
    //             this.setState({sectionoption,section:rst[0]})
    //         }
    //     })
    // }
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