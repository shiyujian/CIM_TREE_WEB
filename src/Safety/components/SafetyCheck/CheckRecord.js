import React, {Component} from 'react';

import {Input,Card, Form, Table,Popconfirm,Button,Row,Col,Select} from 'antd';
import {UPLOAD_API} from '_platform/api';
const FormItem = Form.Item;
const {Option} = Select

export default class CheckRecord extends Component {

	constructor(props) {
		super(props);
		this.state = {

		};
	}
    onBtnClick = (type) =>{
        //Simpllify the code through type
        if(type==="photo"){
  
        }else if(type==="edit"){
  
        }else if(type==="download"){
  
        }
      }
	render() {
		const columns3 = [{
            title:'安全检查计划',
            dataIndex:'unbearable',
            width: '25%'
        },{
            title:'工程名称',
            dataIndex:'warninglevel',
            width: '20%'
        },{
            title:'分部分项',
            dataIndex:'mayaccident',
            width: '20%'
        },{
            title:'负责人',
            dataIndex:'position',
            width: '15%'
        },{
            title:'时间',
            dataIndex:'targetControl',
            width: '20%'
        }];
		return (
            <div>
               <Row>
                    <div style={{display:'inline-block',width:"calc(100% - 666px)"}}>
                        <Card>
                            <Row>
                                <Button 
                                    type="primary" 
                                    icon="calendar" 
                                    size="large"
                                    onClick={()=>this.popScheduler()}
                                    >选择日程</Button>
                            </Row>
                            <Table 
                                columns={columns3} 
                                dataSource={this.state.dataSet}
                                bordered
                                style={{marginTop:20}}
                            />
                            </Card>
                    </div>
                    <div style={{float:'right',width:666}}>
                        <Card>
                            <h1 style={{textAlign:'center'}}>文明施工安全检查记录</h1>
                            <Row>
                                <span style={{fontSize:16}}>2017年10月9日 星期一</span>
                                <span style={{fontSize:16,marginLeft:15}}>负责人：张春峰</span>
                                <Button 
                                    type="primary" 
                                    onClick={()=>this.onBtnClick("photo")}
                                    icon="file-jpg" 
                                    style={{float:'right'}}
                                    >现场照片</Button>
                            </Row>
                            <Card style={{marginTop:5,height:456}}></Card>
                                <Button 
                                    type="primary" 
                                    onClick={()=>this.onBtnClick("edit")}
                                    icon="edit" 
                                    style={{float:'right',marginTop:5}}
                                    >编辑</Button>
                                <Button 
                                    type="primary" 
                                    icon="download" 
                                    style={{float:'right',marginRight:5,marginTop:5}}
                                    onClick={()=>this.onBtnClick("download")}
                                    >下载</Button>
                        </Card>
                    </div>
                </Row>
            </div>
		)
	}
}
