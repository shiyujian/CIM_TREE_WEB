import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, ID } from '../store/item';
import { actions as actions2 } from '../store/cells';
import {actions as actions3} from '../store/monitoring'
import { actions as platformActions } from '_platform/store/global';
import { message, Select, Table, Input, Button, Radio ,Spin,Modal,Carousel} from 'antd';
import { Main, Content, Sidebar, DynamicTitle } from '_platform/components/layout';
import DocTree from '../components/DocTree';
import { Filter, Blueprint } from '../components/Item';
import QualityTree from '../components/QualityTree';
import WorkflowHistory from '../components/WorkflowHistory'
import './fenbu.less';
import {USER_API, SERVICE_API, WORKFLOW_API,JYPMOD_API,UPLOADFILE_API,SERVICE_USER_ID,SERVICE_USER_PWD,SOURCE_API,STATIC_DOWNLOAD_API} from '_platform/api';
import {getUser} from '_platform/auth'
import '../../Datum/components/Datum/index.less'


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@connect(
    state => {
        const { item = {} } = state.quality || {};
        return item;
    },
    dispatch => ({
        actions: bindActionCreators({ ...actions, ...platformActions,...actions3}, dispatch),
        cellActions: bindActionCreators({ ...actions2 }, dispatch),
    }),
)
export default class Danwei extends Component {

    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            fenbus: [],
            loading:false,
            tableType:'a',
            danwei:{},
            detailModalVisible:false
        };
        this.columns = [
            {
                title: '分部工程名称',
                dataIndex: 'name',
            }, {
                title: '合格率',
                dataIndex: 'percent',
            },{
                title: '总数',
                dataIndex: 'total_count',
            },{
                title: '合格数',
                dataIndex: 'qualified_count',
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
    }
 componentWillMount() {
    }
    componentDidMount() {
        console.log(this.props);

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
    //设置下拉框选项
    getOptions(datas) {
        let arr = [];
        datas.forEach(ele => {
            arr.push(<Option value={ele.pk}>{ele.name}</Option>);
        });
        return arr;
    }
    treeNodeClk(code) {
        let [pk, type,] = code[0].split('--');
        this.setState({loading:true});
        let { getUnitTreeByPk } = this.props.cellActions;
        getUnitTreeByPk({ pk: pk }).then(rst => {
            console.log('rst',rst);
            if(!(rst.obj_type === "C_WP_UNT"||rst.obj_type === "C_WP_UNT_S")){
                message.info('请选择单位或子单位工程');
                this.setState({loading:false});
                return;
            }
            let rst_type = rst.obj_type;
            let children = [];
            switch(rst_type){
                case 'C_WP_UNT_S':
                    children = rst.children;
                    break;
                case 'C_WP_UNT':
                    if(rst.children[0])
                    {   
                        if(rst.children[0].obj_type==='C_WP_UNT_S'){
                            rst.children.forEach(c=>{
                                children= children.concat(c.children);
                            })
                        }else{
                            children = rst.children;
                        }
                    }
            }
            console.log('c1',children);
            if(children[0]&&children[0].children.length>0){
             //   console.log(children[0].children[0]);
                if(children[0].children[0].obj_type === "C_WP_PTR_S"){
               //     console.log('ptrs');
                    let arr= [];
                    children.forEach(c=>{
                        arr.push(c);
                        //console.log('ptrs',c);
                        c.children.forEach(ele=>{
                            if(ele.obj_type === 'C_WP_PTR_S')
                            {
                                arr.push(ele);
                            }
                        });
               //         console.log('ptrs2',arr);
                    });
                    children = arr;
                }
            }
            console.log('c2',children);
            children.forEach(ele=>{
                delete ele.children;
            })
            this.setState({loading:false,fenbus:children,danwei:rst});
        });
    }
    radioChange(e){
        this.setState({tableType:e.target.value});
    }
    yanshou(){
        let [counta,countb]= [0,0];
        this.state.fenbus.forEach(ele =>{
            if(ele.extra_params.check_status ===2){
                countb++;
            }
            if(ele.extra_params.check_status ===1){
                counta++;
            }
        });
        if(this.state.danwei.extra_params){
            if(this.state.danwei.extra_params.check_status !== 0 && this.state.danwei.extra_params.check_status !== undefined){
                message.error('该单位工程验收中');
                return;
            }
        }
      //  console.log(counta,countb);
        if(counta === 0 && countb>0)
        {
            message.info('可以发起单位验收');
            let {saveDanweiState,saveFebBus} = this.props.cellActions;
            console.log(saveDanweiState,this.props.cellActions);
             saveDanweiState(this.state.danwei);
             saveFebBus(this.state.fenbus);
             this.props.history.push('/quality/yanshou/danweiask'); 
        }else{
            message.warning('不满足单位验收条件');
        }
    }
    render() {
        const rowSelection = {
			// selectedRowKeys,
			onChange: this.onSelectChange,
		};
        const { table: { editing = false } = {} } = this.props;
        let ds=[];
        switch(this.state.tableType){
            case 'a':
            this.state.fenbus.forEach(ele=>{
                if(ele.extra_params.check_status === 1){
                    //console.log('a',ele);
                    ele.percent = ele.extra_params.total_count ? Number.parseInt(ele.extra_params.qualified_count/ele.extra_params.total_count):0;
                    ele.total_count = ele.extra_params.total_count;
                    ele.qualified_count = ele.extra_params.qualified_count;
                    let ele2 = {children:null,...ele};
                    ds.push(ele2);
                }
            });
            break;
            case 'b':
            this.state.fenbus.forEach(ele=>{
               // console.log('b',ele);
                if(ele.extra_params.check_status === 2){
                    //delete ele.children;
                   // console.log('b2',ele);
                    ele.percent = ele.extra_params.total_count?Number.parseInt((ele.extra_params.qualified_count/ ele.extra_params.total_count)*100)+'%' :0;
                    ele.total_count = ele.extra_params.total_count;
                    ele.qualified_count = ele.extra_params.qualified_count;
                    let ele2 = {children:null,...ele};
                   // console.log('b3',ele2);
                    ds.push(ele2);
                }
            });
            break;
        }
        console.log(this.state.tableType,ds);
        return (
            <Main>
                <DynamicTitle title="单位验收" {...this.props} />
                <Sidebar>
                    <QualityTree
                        nodeClkCallback={this.treeNodeClk.bind(this)}
                        actions={this.props.cellActions} />
                </Sidebar>
                <Content>
                    <Spin spinning={this.state.loading}>
                        <div className='fenbu-title' style={{marginBottom:'10px'}}>
                            <RadioGroup 
                             onChange = {this.radioChange.bind(this)}
                             defaultValue="a">
                                <RadioButton value="a">待验收</RadioButton>
                                <RadioButton value="b">已验收</RadioButton>
                            </RadioGroup>
                            <Button
                             onClick = {this.yanshou.bind(this)}
                             type='primary' style={{marginLeft:'20px'}}>发起单位验收</Button>
                        </div>
                        <div style={{ width: '100%' }}>
                            <Table
                                // className='huafenTable'
                                rowSelection={rowSelection}
                                className="foresttables"
                                dataSource={ds}
                                bordered
                                columns={this.columns}
                            />
                        </div>
                    </Spin>
                </Content>
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
            </Main>
        );
    }

}
