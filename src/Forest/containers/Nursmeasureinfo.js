import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select} from 'antd';
import * as actions from '../store';
import {PkCodeTree} from '../components';
import {NursmeasureTable} from '../components/Nursmeasureinfo';
import {actions as platformActions} from '_platform/store/global';
import {PROJECT_UNITS,FORESTTYPE} from '_platform/api';
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
export default class Nursmeasureinfo extends Component {
    biaoduan = [];
    constructor(props) {
        super(props)
        this.state = {
            treeLists: [],
            treetypeoption: [],
            sectionoption: [],
            typeoption: [],
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
        PROJECT_UNITS[0].units.map(item => {
            this.biaoduan.push(item);
        })
        PROJECT_UNITS[1].units.map(item => {
            this.biaoduan.push(item);
        })
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
            <Option key={'5'} value={'5'}>草本</Option>,
        ];
        this.setState({typeoption})

        //状态
        let statusoption = [{
            value: '',
            label: '全部'
        },{
            value: '0',
            label: '已种植',
        }, {
            value: '-1',
            label: '未种植',
            children: [{
                value: '1',
                label: '进场退回',
            }, {
                value: '2',
                label: '监理退回',
            }, {
                value: '3',
                label: '业主退回',
            }],
        }]
        this.setState({statusoption})
    }

    render() {
        const {keycode} = this.props;
        const {
            leftkeycode,
            treetypeoption,
            sectionoption,
            treetypelist,
            typeoption,
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
                                // onExpand={this.onExpand.bind(this)}
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
        let keycode = value[0] || '';
        const {actions:{setkeycode,gettreetype,getTree}} =this.props;
        setkeycode(keycode);
        this.setState({leftkeycode:keycode,resetkey:++this.state.resetkey})
        //标段
        //标段
        let rst = this.biaoduan.filter(item =>{
            return item.code.indexOf(keycode) !== -1;
        })
        this.setSectionOption(rst)
        //树种
        this.typeselect('');
    }
}