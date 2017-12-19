import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Link} from 'react-router-dom';
import { actions, ID } from '../store/item';
import { actions as actions2 } from '../store/cells';
import {actions as actions3} from '../store/monitoring'
import { actions as platformActions } from '_platform/store/global';
import { message, Select, Table, Input, Button, Radio ,Spin,Modal,Carousel} from 'antd';
import { Main, Content, Sidebar, DynamicTitle } from '_platform/components/layout';
import DocTree from '../components/DocTree';
import Approval from '_platform/components/singleton/Approval';
import { Filter, Blueprint } from '../components/Item';
import QualityTree from '../components/QualityTree'
import './fenbu.less';
import {USER_API, SERVICE_API, WORKFLOW_API,JYPMOD_API,UPLOADFILE_API,SERVICE_USER_ID,SERVICE_USER_PWD,SOURCE_API,STATIC_DOWNLOAD_API} from '_platform/api';
import {getUser} from '_platform/auth';
import WorkflowHistory from '../components/WorkflowHistory';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect(
    state => {
        const { cells = {} } = state.quality || {};
        return {...cells};
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions,...actions3}, dispatch),
        cellActions: bindActionCreators({ ...actions2 }, dispatch),
    }),
)
export default class Fenbu extends Component {

    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            fenbus: [],
            zifenbus: [],
            loading:false,
            checkObj:'fenbu',//验收对象
            unChecked:[],//未验收的
            checked:[],//已验收的
            checkState:'a',//已填报，b为为填报
            fenbuPk:'',//所验收分部的id
            checkAuth:false,//验收的权限  只有施工方才有此权限
            detailModalVisible:false,
            selectedrow:null,
            wk:null,
        };
        this.columns = [
            {
                title: '分项工程名称',
                dataIndex: 'name',
                width:'14%'
            }, {
                title: '检验批批数',
                dataIndex: 'num',
                width:'14%'
            }, {
                title: '当前状态',
                dataIndex: 'cStatus',
                width:'14%'
            }, {
                title: '合格率(%)',
                dataIndex: 'passPercent',
                width:'14%'
            }, {
                title: '提交时间',
                dataIndex: 'tianbaoTime',
                width:'14%'
            }, {
                title: '审核时间',
                dataIndex: 'check_time',
                width:'14%'
            },{
                title: '操作',
                render:(text,record,index)=>{
                    console.log(text,record,index);
                    return(
                        <Button onClick = {this.show.bind(this,record)} >
                        详情
                        </Button>
                    );
                }
            }
        ];
        //监理单位
        this.columns_sv = [
            {
                title: '分部工程名称',
                dataIndex: 'name',
                render: text => {
                    return (<Link to='/quality/yanshou/fenbu/check'>
                                <a>{text}</a>
                            </Link>)
                },
                onCellClick: (record,event) => {
                    this.state.fenbuPk = record.pk;
                    this.saveState();
                },
            }, {
                title: '提交时间',
                dataIndex: 'tianbaoTime',
            }, {
                title: '审核时间',
                dataIndex: 'check_time',
            }, {
                title: '状态',
                dataIndex: 'status',
                render: text => text === 2 ? '已完成' : '执行中'
            }
        ];
    }
    //在离开页面时把state存到store中，进入页面时获取到store的state
    saveState = () => {  
        const { saveFenbuState } = this.props.cellActions;
        let data = {};
        data.flag = false;
        data.state = this.state;
        saveFenbuState(data);   
    }
    componentDidMount(){
        let person = getUser();
        const {getUserByUname} = this.props.cellActions;
        const { fetchUserDetail, fetchRootOrg } = this.props.cellActions
        fetchUserDetail({pk: person.id}).then(user_res => {
            fetchRootOrg({code: user_res.account.org_code}).then(org_res => {
                let checkAuth = false;
                try {
                    const orgName = org_res.children[0].name
                    checkAuth = orgName === '施工单位' ? true : false
                } catch (e) {
                    console.log('error: ',e)
                }
                this.setState({checkAuth})
            })
        })
        console.log(this.props);
        const { fenbuState } = this.props;
        let flag;
        try{
            flag = fenbuState.flag;
        }catch(e){
            flag = false;
        }
        if(flag){
            this.setState({...fenbuState.state});
        }
        this.saveState();
    }
    //设置下拉框选项
    getOptions(datas) {
        let arr = [];
        datas.forEach(ele => {
            arr.push(<Option value={ele.pk}>{ele.name}</Option>);
        });
        return arr;
    }
    //将得到的数据分类，已检验 未检验,flag为true时，代表要
    setCheck(data,pk){
        let checked = [],unChecked =[];
        for(let i=0;i<data.length;i++){           
            try{
                if(data[i].extra_params.check_status  && data[i].extra_params.check_status === 2){
                    checked.push(data[i]);
                }else if(data[i].extra_params.check_status  && data[i].extra_params.check_status === 1){
                    unChecked.push(data[i]);
                }
            }catch(e){
                console.log(e);
                unChecked.push(data[i]);
            } 
        }
        //this.handleData(unChecked);
        this.handleData(checked);
        this.setState({loading:false,checked,unChecked,fenbuPk:pk});
    }
    //处理check 和 unchecked数据
    handleData(data){
        data.map((item) => {
            try{
                item.num = item.basic_params.qc_counts.nonchecked + item.basic_params.qc_counts.checked;
                item.num = isNaN(item.num) ? 0 : item.num;
                item.passPercent = item.basic_params.qc_counts.fine / item.num * 100;
                item.passPercent = isNaN(item.passPercent) ? 0 : item.passPercent;
                item.check_time = item.extra_params.check_time;
                item.tianbaoTime = item.extra_params.tianbaoTime;
                item.cStatus = item.extra_params.check_status === 2 ? '已验收' : '待验收';
            }catch(e){
                item.cStatus = '待验收';
            }           
        })
    }
    //分部下拉框变化
    async selectFenbu(fenbu) {
        let {checkObj} = this.state;
        let fenxiangs = [];
        let zifenbus = [];
        this.setState({loading:true});
        let { getUnitTreeByPk,getWorkPackageDetail } = this.props.cellActions;
        if(checkObj === 'fenbu'){
            let arrs = [];
            await getWorkPackageDetail({pk:fenbu}).then((rst) => {
                if(rst.extra_params.check_status > 0){
                    message.info('该分部已被发起过一次验收');
                    this.setState({checked:[],unChecked:[],loading:false});
                    return;
                }
                try{
                    if(rst.children_wp[0].obj_type_hum === '子分部工程'){
                        let children = rst.children_wp;
                        children.map((item) => {
                            arrs.push(getWorkPackageDetail({pk:item.pk}));
                        })
                        let res = [];
                        Promise.all(arrs).then(rst => {
                            for(let i = 0; i<rst.length;i++){
                                res = res.concat(rst[i].children_wp);
                            }
                            this.setCheck(res,fenbu);
                        })    
                    }else{
                        this.setCheck(rst.children_wp,fenbu);
                    }
                }catch(e){
                    console.log(e);
                    this.setCheck(rst.children_wp,fenbu);
                }
                
            });
        }else{
            getUnitTreeByPk({ pk: fenbu }).then(rst => {
                console.log(rst);
                if (rst.children.length > 0) {
                    if (rst.children[0].obj_type === 'C_WP_PTR_S') {
                        zifenbus = rst.children;
                    } else {
                        fenxiangs = rst.children;
                    }
                }
                this.setState({ fenxiangs: fenxiangs, zifenbus: zifenbus });
                this.setState({loading:false});
            });
        }  
    }
    selectZifenbu(zifenbu) {
        let { getUnitTreeByPk,getWorkPackageDetail } = this.props.cellActions;
        this.setState({loading:true});
        let fenxiangs = [];
        getWorkPackageDetail({ pk: zifenbu }).then((rst) => {
            if(rst.extra_params.check_status > 0 ){
                message.info('该分部已被发起过一次验收');
                this.setState({checked:[],unChecked:[],loading:false});
                return;
            }
            this.setCheck(rst.children_wp,zifenbu);
        })

    }
    async treeNodeClk(code) {
        //console.log(code);
        let [pk, type,] = code[0].split('--');
        this.setState({loading:true});
        //console.log(pk,type);
        let { getUnitTreeByPk,getAllFenbuWf } = this.props.cellActions;
        await getUnitTreeByPk({ pk: pk }).then(rst => {
            //console.log(rst);
            let fenbus = [];
            rst.children.map(item => {
				if(item.obj_type === "C_WP_UNT_S"){
					fenbus = fenbus.concat(item.children)
				}else{
					if(item.obj_type === "C_WP_PTR"){
						fenbus.push(item);
					}
				}
			})
            if(!this.state.checkAuth){
                this.setFenbuWorkflow(fenbus);
            }else{
                this.setState({ fenbus: fenbus, fenxiangs: [], zifenbus: [],checked:[],unChecked:[] });
                this.setState({loading:false});
                console.log('fenbus', fenbus);
            }
            
        });
    }
    //设置监理单位进来页面加载的表格
    async setFenbuWorkflow(fenbus){
        this.setState({loading:true});
        let {getAllFenbuWf,getUnitTreeByPk} = this.props.cellActions;
        let datas = [];
        for(let i = 0; i<fenbus.length; i++){
            datas.push(fenbus[i]);
            await getUnitTreeByPk({pk:fenbus[i].pk}).then(rst => {
                try{
                    if(rst.children[0].obj_type_hum === '子分部工程'){
                        rst.children.map(item => {
                            datas.push(item);
                        })
                    }
                }catch(e){
                    console.log(e);
                }
            })
        }
        let checked = [],unChecked = [];
        datas.map(item => {
            let temp = {};
            temp.status = item.extra_params.check_status;
            temp.check_time = item.extra_params.check_time;
            temp.name = item.name;
            temp.pk = item.pk;
            temp.tianbaoTime = item.extra_params.tianbaoTime;
            if(item.extra_params.check_status && item.extra_params.check_status === 2){
                checked.push(temp);
            }else if(item.extra_params.check_status){
                unChecked.push(temp);
            }
        })
        this.setState({checked,unChecked});
        this.setState({loading:false});
    }
    //radio变化
    radioChange(e){
        this.setState({checkState:e.target.value});
    }
    checkChange(e){
        this.setState({checkObj:e.target.value});
    }
    render() {
        let isAllCheck = this.state.unChecked.length === 0 && this.state.checked.length > 0 ? false : true; //表示判断是否所有的分项工程都已验收，可发起流程
        let fenbuAble = this.state.checkObj === 'fenbu' ? true : false;//表示验收对象为分部的时候，禁用子分部下拉框
        let ds = this.state.checkState === 'b' ? this.state.checked : this.state.unChecked;
        console.log('ds',ds);
        let authDisplay = this.state.checkAuth ? '' : 'none';
        let authDisplay1 = !this.state.checkAuth ? '' : 'none';
        return (
            <Main>
                <DynamicTitle title="分部验收" {...this.props} />
                <Sidebar>
                    <QualityTree
                        nodeClkCallback={this.treeNodeClk.bind(this)}
                        actions={this.props.cellActions} />
                </Sidebar>
                <Content>
                    <Spin spinning={this.state.loading}>
                        <div className="fenbu-title" style={{marginBottom:'20px',display:authDisplay}}>
                            <h3 style={{display:'inline'}}>验收对象：</h3>
                             <RadioGroup 
                             style={{marginLeft:'10px'}}
                             onChange = {this.checkChange.bind(this)}
                             value={this.state.checkObj}>
                                <RadioButton value="fenbu">分部工程验收</RadioButton>
                                <RadioButton value="zifenbu">子分部工程验收</RadioButton>
                            </RadioGroup>
                        </div>
                        <div>
                            <Select style={{marginLeft:'0px',display:authDisplay}}
                                onSelect={this.selectFenbu.bind(this)}
                                className='mySelect1' placeholder='分部'>
                                {this.getOptions(this.state.fenbus)}
                            </Select>
                            <Select
                                style={{display:authDisplay}}
                                disabled={fenbuAble}
                                onSelect={this.selectZifenbu.bind(this)}
                                className='mySelect1' placeholder='子分部'>
                                {this.getOptions(this.state.zifenbus)}
                            </Select>
                            {/*<Select
                                onSelect={this.selectFenxiang.bind(this)}
                                className='mySelect1' placeholder='分项'>
                                {this.getOptions(this.state.fenxiangs)}
                            </Select>*/}
                            <RadioGroup 
                             style={{marginLeft:'10px',marginBottom:'10px'}}
                             onChange = {this.radioChange.bind(this)}
                             value={this.state.checkState}>
                                <RadioButton value="a">待验收</RadioButton>
                                <RadioButton value="b">已验收</RadioButton>
                            </RadioGroup>
                            <Link to='/quality/yanshou/fenbu/record' style={{display:authDisplay}}>
                                <Button disabled={isAllCheck} onClick={this.saveState} type='primary' style={{marginLeft:'20px'}}>发起分部验收</Button>
                            </Link>
                        </div>
                        <div style={{ width: '100%',display:authDisplay }}>
                            <Table
                                className='huafenTable'
                                dataSource={ds}
                                columns={this.columns}
                            />
                        </div>
                        <div style={{ width: '100%',display:authDisplay1 }}>
                            <Table
                                className='huafenTable'
                                dataSource={ds}
                                columns={this.columns_sv}
                            />
                        </div>
                        {
                            this.state.detailModalVisible &&
                            <Modal
                                width={800}
                                height={600}
                                title="验收详情"
                                visible={true}
                                onCancel={() => {this.setState({selectedRow: null, detailModalVisible: false,wk:null})}}
                                footer={null}
                                maskClosable={false}
                            >
                                {this.getModalContent(this.state.selectedRow,this.state.wk)}
                            </Modal>
                        }    
                    </Spin>
                </Content>
            </Main>
        );
    }
//弹出详情 表格点击
    show(record){
        const {getUnitTreeByPk,getWorkflow} = this.props.cellActions;
        getUnitTreeByPk({pk:record.pk}).then((rst) => {
            let pk = rst.extra_params.workflowid || rst.extra_params.workflow_id || rst.extra_params.workflow || rst.extra_params.wfid;
            //显示流程详情
            getWorkflow({pk:pk}).then( res => {
                this.setState({selectedRow: rst, detailModalVisible: true,wk:res})
            })
    })
}
//生成模态框内容
getModalContent = (record,wk) => {
    console.log('getModalContent: ', record)
    const imgArr = record.extra_params.img || []
    const file = record.extra_params.file ? record.extra_params.file : ''
    const formItemLayout = {
        labelCol: { span: 8},
        wrapperCol: { span: 12},
    }
    return (
        <div>
            <div style={{marginBottom: 10}}>
                现场记录:
            </div>
            {!imgArr.length ? '暂无图片' :
                <Carousel autoplay>
                    {
                        imgArr.map(x => (
                            <div className="picDiv">
                                <img className="picImg" src={`${SOURCE_API}${x}`} alt=""/>
                            </div>
                        ))
                    }
                </Carousel>
            }
            <div style={{margin: '10px 0 10px 0'}}>
                <span style={{marginRight: 20}}>附件:</span>
                <span>
                    {file && file.length
                        ?
                        file.map((item) => {
                            return (<p><a href={`${STATIC_DOWNLOAD_API}${item.download_url}`}>{item.name}</a></p>)
                        })
                        :'暂无附件'
                    }
                </span>
            </div>
            <WorkflowHistory wk={wk}/>
        </div>
    )
}
}
const datasource = [{
    name:'粘层',
    num:56,
    cStatus:'待验收',
    passPercent:0,
},{
    name:'封层',
    num:29,
    cStatus:'待验收',
    passPercent:0,
},{
    name:'热拌沥青混合材料而层',
    num:56,
    cStatus:'待验收',
    passPercent:0,
},{
    name:'沥青贯入式面层',
    num:56,
    cStatus:'沥青表面处治面层',
    passPercent:0,
},{
    name:'粘层',
    num:56,
    cStatus:'待验收',
    passPercent:0,
}]