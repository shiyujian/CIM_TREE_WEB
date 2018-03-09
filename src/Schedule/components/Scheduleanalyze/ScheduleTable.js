import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select, Row, Col, DatePicker, Spin} from 'antd';
import moment from 'moment';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Cards, SumTotal, DateImg} from '../../components';
import {groupBy} from 'lodash';
var echarts = require('echarts');
const {RangePicker} = DatePicker;
const Option = Select.Option;

export default class ScheduleTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            amount: '',
            today: '',
            pers: '',
            score: '',
            loading5: false,
            loading6: false,
            loading7: false,
            isShow: true,
            isOpen: [false,false,false],
            nowmessage:{CreateTime:"",Factory:"",nowmessage:"",nowmessage:"",TreeTypeObj:{TreeTypeName:""}},
            nowmessagelist:[],
        }
    }

	async componentDidMount() {
        const {
            actions: {
                gettreetypeAll,
                nowmessage
            }
        } = this.props;

        this.setState({loading5:true});
        this.setState({loading6:true});

        let message = await nowmessage()
        console.log('ScheduleTableScheduleTable',message)
        let nowmessagelist = []
        if(nowmessage && nowmessage.content){
            nowmessagelist = nowmessage.content
        }

        this.setState({
            nowmessagelist:nowmessagelist
        })

        let rst = await gettreetypeAll()
        console.log('ScheduleTableScheduleTable',rst)


        let amount = 0;
        let today = 0;
        let date = moment().format('YYYY/MM/DD');
        if(rst && rst instanceof Array){
            rst.map((item)=>{
                amount = amount + item.Num
                if(date === item.Time){
                    today = today + item.Num
                }
            })
        }

        this.setState({loading5:false});
    
        this.setState({
            amount:amount,
            today:today,
            loading5:false,
            loading6:false
        })


        // sxm:编码 或顺序码  可选
        // no:正式编码 可选
        // section：标段 可选
        // land：地块  可选
        // region：区域  可选
        // smallclass：小班  可选
        // thinclass：细班  可选
        // treetype：树类型  可选
        // status：状态 -1:未确认 0：监理通过 业主未抽查  1：监理不通过  2：监理通过业主抽查未通过  3：监理通过 业主抽查通过
        // stime：验收时间 开始时间
        // etime：验收时间 结束时间
        // page：页码，选填
        // size：每页数量，选填
    }
    
    async query(){
        const {
            actions: {
                gettreetypeAll,
                gettreetypeSection,
                gettreetypeSmallClass,
                gettreetypeThinClass
            },
            leftkeycode,
        } = this.props;
        

        this.setState({loading5:true,loading6:true})
       

    }

	render() {
        let asd = this.state.nowmessage;
        console.log(asd);
        
        console.log(this.state.nowmessagelist,"xiaoxiao")
		return (
			<div>
                <Row gutter={10} style={{margin: '5px 5px 20px 5px'}}>
                    <Col span={5}>
                        <Spin spinning={this.state.loading5}>
                            <SumTotal search={this.searchSum(0)} title='苗木累计种植总数' title1='Total number of planted trees'>
                                <div>{this.state.amount}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={5}>
                        <Spin spinning={this.state.loading6}>
                            <SumTotal search={this.searchSum(1)} title='苗木今日种植总数' title1='Total number of planted trees today'>
                                <div>{this.state.today}</div>
                            </SumTotal>
                        </Spin>
                    </Col>
                    <Col span={5}>
                        <Spin spinning={this.state.loading7}>
                            <SumTotal search={this.searchSum(2)} title='种植完工率' title1='Plant completion rate'>
                                <div onClick ={this.handleclick.bind(this)} style={{cursor:'pointer'}}>
                                    {
                                        this.state.isShow ? <div className="per">{this.state.pers}</div>
                                        :
                                        <div className='score' style={{fontSize: '20px'}}>{this.state.score}</div>
                                    }
                                </div>
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
    //点击切换百分比和分数
    handleclick (){
        this.setState({
            isShow : !this.state.isShow
        })
    }
    //点击图片出现日期选择
    handleIsOpen(index) {
        this.state.isOpen[index] = !this.state.isOpen[index];
        this.setState({
            isOpen : this.state.isOpen
        })
    }

    searchSum(index) {
        return(
            <div>
                <div style={{cursor:'pointer'}} onClick = {this.handleIsOpen.bind(this,index)}><img style={{height: '36px'}} src={DateImg}/></div>
                
            </div>
        )
    }
    
}
//除
function division(arr1, arr2) {
    if(arr1 !== 0 && arr2 !== 0) {
        let per = 0;
        per = (Math.round(arr1 / arr2 * 10000) / 100.00 + '%');
        return per;
    }
}
//拼接
function joint(arr1, arr2) {
    let join = '';
    join = arr1 + '/' + arr2;
    return join;
}
//点击切换

function dd(path){
    var ele= document.querySelectorAll(path);
    for(let i=0;i<ele.length;i++){
        ele[i].index=i;
        ele[i].onclick=function(){
            if(this.index===0){
                this.style.display="none";
                ele[1].style.display="block";
            }else{
                this.style.display="none";
                ele[0].style.display="block";
            }
        }
    }
}

function sorting(val1, val2) {
    let ele1 = val1.Label;
    let ele2 = val2.Label;
    if(ele1 < ele2) {
        return -1;
    } else if(ele1 > ele2) {
        return 1;
    } else {
        return 0;
    }
}

