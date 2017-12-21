import React, {Component} from 'react';
import {Table, Row, Col, Select, Input, Checkbox, Icon, notification, Button, DatePicker, Card, Radio, Calendar, Modal   } from 'antd';
import './index.less';
import {getUser} from '_platform/auth';
const RadioGroup = Radio.Group;
const Option = Select.Option;

export default class HistoryTable extends Component {

    constructor(props){
        super(props);
        this.state={
            panelVisible:false,
            newKey:Math.random(),
            schedulerList:[],
            downfinish:true,
            dataSet:[]
        }
    }
    componentWillReceiveProps(nextProps){
        if(this.props.item != nextProps.item){
            const{
                item
            }=nextProps
            if(item){
                let project = item.project;
                let unitProjecte = item.unitProjecte;
                const {getScheduler} = this.props.actions;
                const usr = getUser();
                const id = usr.id;   //,reviewer:id
                let test = true
                getScheduler({},{project:project.pk,unit:unitProjecte.pk}).then(result =>{
                    if(result && result.results && result.results.length>0){
                        for(var i=0;i<result.results.length;i++){
                            if(result.results[i].audit_status && result.results[i].audit_status.length>0 && result.results[i].audit_status[0].status==="完成"){
                                test = false;
                                this.setState({
                                    schedulerList:result.results,
                                    downfinish:false
                                });
                                return
                            }else{
                                this.setState({
                                    schedulerList:[],
                                    downfinish:true,
                                    dataSet:[]
                                });
                            }
                        }
                        if(test){
                            this.setState({
                                schedulerList:[],
                                downfinish:true,
                                dataSet:[]
                            });
                            notification.info({
                                message: '当前单位工程无日程可查询',
                                duration: 2
                            });
                            return;
                        }
                    }else{
                        this.setState({
                            schedulerList:[],
                            downfinish:true,
                            dataSet:[]
                        });
                        notification.info({
                            message: '当前单位工程无日程可查询',
                            duration: 2
                        });
                        return;
                    }
                });
            }
        }
    }
    render() { //todo 进度历史
        return (
            <Row>
                <Col span={24}>
                    <div className='mainConter'>
                        <div style={{marginBottom:'10px'}}>
                            <Button type="primary" 
                             icon="calendar" 
                             disabled={this.state.downfinish}
                             size="large"
                             onClick={()=>this.popScheduler()}>选择日程</Button>
                            <Modal
                             title="选择日程"
                             key={this.state.newKey}
                             visible={this.state.panelVisible}
                             width="1000"
                             maskClosable={false}
                             onCancel={()=>this.goCancel()}
                             footer={null}
                            >
                                <Calendar 
                                 dateCellRender={(value)=>this.dateCellRender(value)} 
                                 monthCellRender={(value)=>this.monthCellRender(value)}
                                 onSelect={(date)=>this.onCardClick(date)}
                                />
                            </Modal>  
                        </div>
                        <div>
                            <Table 
                             columns={columns} 
                             dataSource={this.state.dataSet}
                             bordered
                            />
                        </div>
                    </div>
                </Col>
            </Row>
        );
    }

    popScheduler = () =>{
		this.setState({newKey:Math.random(),panelVisible:true});
    }
    goCancel = () => {
		this.setState({panelVisible:false});
    }
    onCardClick = (date) =>{
		const {actions:{getWorkflowById}} = this.props;
		const {schedulerList} = this.state;
    	this.setState({currentDate:date.format('YYYY-MM-DD').toString()});
    	for(let i=0;i<schedulerList.length;i++){
    		//选中的时间和列表中时间相同
    		if(date.format('YYYY-MM-DD') === schedulerList[i].created_date.slice(0,10)){
				if(schedulerList[i].audit_status && schedulerList[i].audit_status.length>0 && schedulerList[i].audit_status[0].status==="完成"){
					if(schedulerList[i].flow.length===0){
						return;
					}
					let data = {date:date.format('YYYY-MM-DD')};
					console.log('schedule_table',schedulerList[i].schedule_table)
					this.setState({
						panelVisible:false,
						dataSet:schedulerList[i].schedule_table
					});
					return;
				}else{
					this.setState({
						dataSet:[],
						panelVisible:false
					});
				}
    		}
		}
		this.setState({
			dataSet:[],
			panelVisible:false
		});
    }
    
    monthCellRender(value) {
        const num = this.getMonthData(value);
        return num ? <div className="notes-month">
            <section>{num}</section>
            <span>Backlog number</span>
        </div> : null;
    }

    dateCellRender(value) {
		const listData = this.getListData(value);
		return (
			<ul className="events">
				{
					listData.map(item => (
					<li key={item.content}>
						<span className={`event-${item.type}`}>●</span>
						{item.content}
					</li>
					))
				}
			</ul>
		);
    }
    
    getListData(value) {
		let listData = [];
		const schedulerList = this.state.schedulerList;
		let datastr = '';
		for(let i=0;i<schedulerList.length;i++){
			datastr = schedulerList[i].created_date.slice(0,10);
			if(value.format('YYYY-MM-DD') === datastr){
				if(schedulerList[i].audit_status && schedulerList[i].audit_status.length>0 && schedulerList[i].audit_status[0].status==="完成"){
					listData.push({type:'normal',content:schedulerList[i].subject+'完成'});
				}
			}
		}
		return listData;
	}
    
}

const columns=[{
    title: 'WBS编码',
    dataIndex: 'code',
    key: 'code'
}, {
    title: '任务名称',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '作业类别',
    dataIndex: 'type',
    key: 'type'
},{
    title: '单位',
    dataIndex: 'company',
    key: 'company'
},{
    title: '施工图工程量',
    dataIndex: 'quantity',
    key: 'quantity'
},{
    title: '产值',
    dataIndex: 'output',
    key: 'output'
},{
    title: '计划开始时间',
    dataIndex: 'startTime',
    key: 'startTime'
},{
    title: '计划结束时间',
    dataIndex: 'plan_end_time',
    key: 'plan_end_time'
},{
    title: '计划工期',
    dataIndex: 'schedule',
    key: 'schedule'
},{
    title: '是否关键路线',
    dataIndex: 'path',
    key: 'path'
},{
    title: '是否里程碑',
    dataIndex: 'milestone',
    key: 'milestone'
},{
    title: '关联工程部位',
    dataIndex: 'site',
    key: 'site'
},{
    title: '累计完成工程量',
    dataIndex: 'total',
    key: 'total'
},{
    title: '是否完工',
    dataIndex: 'finish',
    key: 'finish'
}];
