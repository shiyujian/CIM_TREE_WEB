import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import {Select,Row,Col,Radio,Card,DatePicker} from 'antd';
import { FORESTTYPE } from '../../../_platform/api';
import {Cards, SumTotal, DateImg} from '../../components';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RadioButton = Radio.Button;
import moment from 'moment';
const {RangePicker} = DatePicker;

export default class Bottom extends Component {

    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    
    
    render() { //todo 苗木种植强度分析
        
        return (
           null
            
        );
        
      
    }

    search(index) {
        if(index === 1) {
             return <div>
                    <span>种植时间：</span>
                    <RangePicker 
                     style={{verticalAlign:"middle"}} 
                     defaultValue={[moment(this.state.stime1, 'YYYY-MM-DD HH:mm:ss'),moment(this.state.etime1, 'YYYY-MM-DD HH:mm:ss')]} 
                     showTime={{ format: 'HH:mm:ss' }}
                     format={'YYYY/MM/DD HH:mm:ss'}
                     onChange={this.datepick.bind(this,index)}
                     onOk={this.datepickok.bind(this,index)}
                    >
                    </RangePicker>
                </div>
            } else {
                 return <div>
                    <span>截止时间：</span>
                    <DatePicker  
                     style={{textAlign:"center"}} 
                     showTime
                     defaultValue={moment(this.state.etime2, 'YYYY-MM-DD HH:mm:ss')} 
                     format={'YYYY/MM/DD HH:mm:ss'}
                     onChange={this.datepick.bind(this,index)}
                     onOk={this.datepickok.bind(this,index)}
                    >
                    </DatePicker>
                </div>
            }
    }

    datepick(index,value){
        if(index == 1) {
            this.setState({stime1:value[0]?moment(value[0]).format('YYYY-MM-DD HH:mm:ss'):''})
            this.setState({etime1:value[1]?moment(value[1]).format('YYYY-MM-DD HH:mm:ss'):''})
        }
        if(index == 2){
            this.setState({etime2:value?moment(value).format('YYYY-MM-DD HH:mm:ss'):''})
        }
        if(index == 3){
            this.setState({etime3:value?moment(value).format('YYYY-MM-DD HH:mm:ss'):''})
        }
        if(index == 4){
            this.setState({etime4:value?moment(value).format('YYYY-MM-DD HH:mm:ss'):''})
        }
    }

    datepick1(index, value) {
        let param = {
            etime:value?moment(value).unix():''
        }
        this.sum(index, param);
        this.state.isOpen[index] = !this.state.isOpen[index];
        this.setState({
            isOpen:this.state.isOpen
        })
    }

    datepickok(index){
        if(index == 1 ) {
            const {stime1,etime1} = this.state;
            let param = {
                stime:this.state.stime1,
                etime:this.state.etime1,
            }
            this.qury(index,param);
        }
        if(index == 2 ) {
            const {etime2} = this.state;
            let param = {
                etime:this.state.etime2,
            }
            this.qury(index,param);
        }
        if(index == 3 ) {
            const {etime3,section} = this.state;
            let param = {
                etime:this.state.etime3,
                section:section,
            }
          
            this.qury(index,param);
        }
        if(index == 4 ) {
            const {etime4,section,smallclass} = this.state;
            let param = {
                etime:this.state.etime4,
                section,
            }
            this.qury(index,param);
        }
    }
    
    
    
}