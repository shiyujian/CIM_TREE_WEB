import React, {Component} from 'react';
import {Row, Col, Input, Icon, DatePicker, Select, Spin} from 'antd';
import {Cards, SumTotal, DateImg} from '../../components';
import { FOREST_API, FORESTTYPE,TREETYPENO} from '../../../_platform/api';
import moment from 'moment';
import {groupBy} from 'lodash';
var echarts = require('echarts');
const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class EntryTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            amount: 0,
            //今日进场总数
            today: 0,
            nurserys: '',
            loading3: false,
            loading4: false,
            loading5: false,
            isOpen: [false,false,false],
            nowmessage:[],
            nowmessagelist:[]
        }
    }

    componentDidMount(){
        
        const {actions: {getfactory,nowmessage,gettreetype,getTotalSat}} = this.props;
        //实时种植信息
        nowmessage().then(rst=>{
            if(rst && rst.content){
                console.log(rst.content,"xionsui");
                this.setState({
                    nowmessagelist:rst.content,
                })
            }
        })
        //供应商个数
        getfactory().then(rst=>{
            this.setState({loading5:false})
            if(rst && rst instanceof Array ){
                let factorynum = rst.length;
                this.setState({
                    nurserys:factorynum,
                }) 
            }
            
        })
        //入场总数和今日入场数
        let amount = 0;
        let today = 0;

        let postdata = {
            statType:'nursery' 
        }
        getTotalSat(postdata).then((rst)=>{
            this.setState({
                amount:rst
            })
        })

        let params ={
            stime: moment().format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
        }
        gettreetype({},params).then((rst)=>{
            if(rst && rst instanceof Array){
                rst.map(item=>{
                    if(item && item.Section){
                        today = today + item.Num
                    }                    
                })
                this.setState({
                    today
                })
            }
                
        })
        
    }

    render() {
        let {amount} = this.state;
        
        return (
            <div>
                <Row gutter={10} style={{margin: '5px 5px 20px 5px'}}>
                    <Col span={5}>
                        <Spin spinning={this.state.loading3}>
                            <SumTotal search={this.searchSum(0)} title='苗木累计进场总数' title1='Total number of nursery stock'>
                                <div>{amount}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={5}>
                        <Spin spinning={this.state.loading4}>
                            <SumTotal search={this.searchSum(1)} title='苗木今日进场总数' title1='Total number of nursery stock today'>
                                <div>{this.state.today}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={5}>
                        <Spin spinning={this.state.loading5}>
                            <SumTotal search={this.searchSum(2)} title='供苗商总数' title1='Total number of nursery'>
                                <div>{this.state.nurserys}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={6}>
                     <div className="nowmessage" style={{border:"1px solid #666"}}>
                    <div>实时种植信息</div>
                    <div>
                    {this.state.nowmessagelist.map((item,index)=>
                            <div key={item.id}>
                              <span>{item.CreateTime}{item.Factory}{item.Inputer}录入{item.TreeTypeObj.TreeTypeName}</span>
                            </div>
                        )}
                    </div>
                    </div>
                    </Col>
                </Row>
            </div>
        );
    }

    searchSum(index) {
        return(
            <div>
                <div style={{cursor:'pointer'}} onClick = {this.handleIsOpen.bind(this,index)}><img style={{height:'36px'}} src={DateImg}/></div>
            </div>
        )
    }

    //点击图片出现日期选择
    handleIsOpen(index) {
        this.state.isOpen[index] = !this.state.isOpen[index];
        this.setState({
            isOpen : this.state.isOpen
        })
    }
}




