import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions, ID } from '../store/item';
import { actions as actions2 } from '../store/cells';
import {actions as actions3} from '../store/monitoring'
import { actions as platformActions } from '_platform/store/global';
import { message, Select, Table, Input, Button, Radio ,Spin,Modal} from 'antd';
import { Main, Content, Sidebar, DynamicTitle } from '_platform/components/layout';
import DocTree from '../components/DocTree';
import Approval from '_platform/components/singleton/Approval';
import { Filter, Blueprint } from '../components/Item';
import QualityTree from '../components/QualityTree';
import './fenbu.less';
import {USER_API, SERVICE_API, WORKFLOW_API,JYPMOD_API,UPLOADFILE_API,SERVICE_USER_ID,SERVICE_USER_PWD} from '_platform/api';
import {getUser} from '_platform/auth'

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
export default class DanweiJL extends Component {

    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
            fenbus: [],
            loading:false,
            tableType:'a',
            danwei:{}
        };
        this.columns = [
            {
                title: '单位工程名称',
                dataIndex: 'name',
            }, {
                title: '状态',
                dataIndex: 'yanshouStatus',
            }, {
                title: '合格率',
                dataIndex: 'percent',
            },
            {
                title: '审批人',
                dataIndex: 'yanshouUser',
            }
        ];
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
            console.log(rst);
            if(!(rst.obj_type === "C_WP_UNT"||rst.obj_type === "C_WP_UNT_S")){
                message.info('请选择单位工程');
                this.setState({loading:false});
                return;
            }
            if(rst.extra_params&&rst.extra_params.check_status){
                if(rst.extra_params.JianLiID === getUser().id){
                    this.setState({loading:false,danwei:rst});
                    return;
                }
            }
            this.setState({loading:false,danwei:{}});
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
            if(this.state.danwei.extra_params.check_status !== 0 ){
                message.error('该单位工程验收中');
                return;
            }
        }
        if(counta === 0 && countb>0)
        {
            message.info('可以发起单位验收');
            let {saveDanweiState} = this.props.cellActions;
            console.log(saveDanweiState,this.props.cellActions);
             saveDanweiState(this.state.danwei);
             this.props.history.push('/quality/yanshou/danweiask'); 
        }else{
            message.warning('不满足单位验收条件');
        }
    }
    shenPi(){
        let {saveDanweiState} = this.props.cellActions
        if(this.state.danwei.extra_params
            &&this.state.danwei.extra_params.check_status === 1
            &&this.state.danwei.extra_params.JianLiID === getUser().id){
                message.info('可以审批该单位');
                saveDanweiState(this.state.danwei);
                this.props.history.push('/quality/yanshou/danweijlask'); 
            }else{
                message.warning('无法审批该单位');
            }
    }
    rowClk(p1,p2){
        if(this.state.danwei.yanshouStatus === '已审批'){
            console.log('see shenpi');
            let {saveDanweiState} = this.props.cellActions;
            saveDanweiState(this.state.danwei);
            this.props.history.push('/quality/yanshou/danweijlshow'); 
            // if(this.state.danwei.extra_params
            //     &&this.state.danwei.extra_params.check_status === 1
            //     &&this.state.danwei.extra_params.JianLiID === getUser().id){
            //         message.info('可以审批该单位');
            //         saveDanweiState(this.state.danwei);
            //         this.props.history.push('/quality/yanshou/danweijlask'); 
            //     }else{
            //         message.warning('无法审批该单位');
            //     }
        }
    }
    render() {
        const { table: { editing = false } = {} } = this.props;
        let ds=[];
        let danwei = this.state.danwei;
        if(danwei.extra_params&&danwei.extra_params.check_status){
            delete danwei.children;
            let rate =danwei.extra_params.qualified_rate;
            danwei.percent = rate>0 && rate<=1?Math.floor(rate*100)+'%':'100%';
            danwei.yanshouStatus = danwei.extra_params.check_status===1?'待审批':'已审批';
            danwei.yanshouUser = danwei.extra_params.JianLiID === getUser().id ?'当前用户':'其他用户'
            ds.push(danwei);
        }
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
                        <div style={{ width: '100%' }}>
                        <Button
                        onClick = {this.shenPi.bind(this)}
                        type='primary' style={{margin:'20px'}}>审批单位验收</Button>
                            <Table
                                onRowClick = {this.rowClk.bind(this)}
                                className='huafenTable'
                                dataSource={ds}
                                columns={this.columns}
                            />
                        </div>
                    </Spin>
                </Content>
            </Main>
        );
    }

}
