import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Select } from 'antd';
import * as actions from '../store';
import { PROJECT_UNITS } from '_platform/api';
import { PkCodeTree } from '../components';
import { ContrastTable } from '../components/Contrastinfo';
import { actions as platformActions } from '_platform/store/global';
import { Main, Aside, Body, Sidebar, Content, DynamicTitle } from '_platform/components/layout';
import { getUser } from '_platform/auth'
const Option = Select.Option;
@connect(
    state => {
        const { forest, platform } = state;
        return { ...forest, platform };
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions }, dispatch),
    }),
)
export default class Contrastinfo extends Component {
    biaoduan = [];
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
            bigType: '',
        }
    }
    getbigTypeName(type) {
        switch (type) {
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
            default:
                return ''
        }
    }
    componentDidMount() {
        const { actions: { getTree, getTreeList, getTreeNodeList,getLittleBanAll }, treetypes,littleBanAll, platform: { tree = {} } } = this.props;
        this.biaoduan = [];
        for(let i=0;i<PROJECT_UNITS.length;i++){
            PROJECT_UNITS[i].units.map(item => {
                this.biaoduan.push(item);
            })
        }
        // 避免反复获取森林树种列表，提高效率
        if (!treetypes) {
            getTreeList().then(x => this.setTreeTypeOption(x));
        }
        if (!tree.bigTreeList) {
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
        this.setState({ typeoption })
        //合标
        let standardoption = [
            <Option key={'-1'} value={''}>全部</Option>,
            <Option key={'1'} value={'1'}>合标</Option>,
            <Option key={'2'} value={'0'}>不合标</Option>,
        ]
        this.setState({ standardoption })
    }

    render() {
        const { keycode } = this.props;
        const {
            leftkeycode,
            treetypeoption,
            treetypelist,
            sectionoption,
            typeoption,
            bigType,
            standardoption,
            resetkey,
        } = this.state;
        const { platform: { tree = {} } } = this.props;
        let treeList = [];
        if (tree.bigTreeList) {
            treeList = tree.bigTreeList
        }
        return (
            <Body>
                <Main>
                    <DynamicTitle title="苗木对比信息" {...this.props} />
                    <Sidebar width={190}>
                        <PkCodeTree treeData={treeList}
                            selectedKeys={leftkeycode}
                            onSelect={this.onSelect.bind(this)}
                        />
                    </Sidebar>
                    <Content>
                        <ContrastTable
                            key={resetkey}
                            {...this.props}
                            sectionoption={sectionoption}
                            sectionselect={this.sectionselect.bind(this)}
                            bigType={bigType}
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
    sectionselect(value) {
        const { actions: { setkeycode } } = this.props;
        const { leftkeycode } = this.state;
        setkeycode(leftkeycode)
        //树种
        this.typeselect('');
    }

    //设置标段选项
    setSectionOption(rst) {
        let user = getUser();
        let section = JSON.parse(user.sections);
        if (rst instanceof Array) {
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
            if (section.length === 0) {   //admin用户赋给全部的查阅权限
                sectionOptions.unshift(<Option key={-1} value={''}>全部</Option>)
            }
            this.setState({ sectionoption: sectionOptions })
        }
    }

    //类型选择, 重新获取: 树种
    typeselect(value) {
        const { treetypes } = this.props;
        this.setState({ bigType: value });
        let selectTreeType = [];
        treetypes.map(item => {
            let code = item.TreeTypeNo.substr(0, 1);
            if (code === value) {
                selectTreeType.push(item);
            }
        })
        this.setTreeTypeOption(selectTreeType);
    }

    //设置树种选项
    setTreeTypeOption(rst) {
        if (rst instanceof Array) {
            let treetypeoption = rst.map(item => {
                return <Option key={item.id} value={item.ID}>{item.TreeTypeName}</Option>
            })
            treetypeoption.unshift(<Option key={-1} value={''}>全部</Option>)
            this.setState({ treetypeoption, treetypelist: rst })
        }
    }

    //重置
    resetinput(leftkeycode) {
        this.setState({ resetkey: ++this.state.resetkey }, () => {
            this.onSelect([leftkeycode])
        })
    }

    //树选择, 重新获取: 标段、小班、细班、树种并置空
    onSelect(value = []) {
        let user = getUser()
        let keycode = value[0] || '';
        const { actions: { setkeycode, gettreetype, getTree, getLittleBan } } = this.props;
        setkeycode(keycode);
        this.setState({ leftkeycode: keycode, resetkey: ++this.state.resetkey })
        let sections = JSON.parse(user.sections);
        //标段
        let rst = [];
        if (sections.length === 0) {   //是admin
            rst = this.biaoduan.filter(item => {
                return item.code.indexOf(keycode) !== -1;
            })
        } else {
            rst = this.biaoduan.filter(item => {
                return item.code.indexOf(keycode) !== -1 && sections.indexOf(item.code) !== -1;
            })
        }
        this.setSectionOption(rst)
        //树种
        this.typeselect('');
    }
}