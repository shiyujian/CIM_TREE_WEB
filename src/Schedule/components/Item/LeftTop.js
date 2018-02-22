import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import {Select,Row,Col,Radio,Card,DatePicker} from 'antd';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RadioButton = Radio.Button;
import moment from 'moment';
const {RangePicker} = DatePicker;export default class Warning extends Component {

    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
            stime1: moment().format('2017-11-17 00:00:00'),
            etime1: moment().format('2018-2-26 23:59:59'),
            departOptions:"",
            data:"",
            gpshtnum:[],
            times:[],
            unitproject:"",
            project:"便道施工",
        }
    }
    componentWillReceiveProps(nextProps){
      let params = {}
      params.etime = this.state.etime1;
      params.stime = this.state.stime1;
      
      params.project = this.state.project;
      this.getdata(params);
    }

    componentDidMount() {
       
       let myChart = echarts.init(document.getElementById('lefttop'));

       let optionLine = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            legend: {
                data:['总数','一标','二标','三标','四标','五标'],
                left:'right'
                
            },
            xAxis: [
                {
                    type: 'category',
                    data: this.state.times,
                    axisPointer: 
                     {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '长度（m）',
                    axisLabel: {
                        formatter: '{value} '
                    }
                },
            ],
            series: []
        };
        myChart.setOption(optionLine);
    }
    
    
    render() { //todo 累计完成工程量
        console.log(this.state.data);
        
        return (
            <div >
            <Card>
            施工时间：
                <RangePicker 
                             style={{verticalAlign:"middle"}} 
                             defaultValue={[moment(this.state.stime1, 'YYYY-MM-DD HH:mm:ss'),moment(this.state.etime1, 'YYYY-MM-DD HH:mm:ss')]} 
                             showTime={{ format: 'HH:mm:ss' }}
                             format={'YYYY/MM/DD HH:mm:ss'}
                             onChange={this.datepick.bind(this)}
                             onOk={this.datepickok.bind(this)}
                            >
                            </RangePicker>
                    <div id='lefttop' style={{ width: '100%', height: '340px' }}></div>
                    <Select 
                          style={{width:'100px'}}
                          defaultValue="便道施工"
                          onSelect={this.onDepartments.bind(this)}
                          onChange={this.onChange.bind(this)}>
                          <Option key="1" value="便道施工">便道施工</Option>
                          <Option key="2" value="给排水沟槽开挖">给排水沟槽开挖</Option>
                          <Option key="3" value="给排水管道安装">给排水管道安装</Option>
                          <Option key="4" value="给排水回填">给排水回填</Option>
                          <Option key="5" value="绿地平整">绿地平整</Option>
                          <Option key="6" value="种植穴工程">种植穴工程</Option>
                          <Option key="7" value="常绿乔木">常绿乔木</Option>
                          <Option key="8" value="落叶乔木">落叶乔木</Option>
                          <Option key="9" value="亚乔木">亚乔木</Option>
                          <Option key="10" value="灌木">灌木</Option>
                          <Option key="11" value="草木">草木</Option>
                    </Select>
                    <span>强度分析</span>
                </Card>
            </div>
        );
        
      
    }
    datepick(){}
    datepickok(value){
      this.setState({etime1:value[1]?moment(value[1]).format('YYYY/MM/DD HH:mm:s'):'',
                     stime1:value[0]?moment(value[0]).format('YYYY/MM/DD HH:mm:s'):'',
                  })
      let params = {}
      params.etime = value[1]?moment(value[1]).format('YYYY/MM/DD HH:mm:s'):'';
      params.stime = value[0]?moment(value[0]).format('YYYY/MM/DD HH:mm:s'):'';
      params.project = this.state.project;
      this.getdata(params);
    }
    onDepartments(value){
      this.setState({
        project:value,
      })
      let params = {}
      params.etime = this.state.etime1;
      params.stime = this.state.stime1;
      params.project = value;
            this.getdata(params);
    }
    onChange(value){
        console.log(value);
        this.setState({
            project:value,
        })
        

    }
    getdata(value){
      const {actions: {progressdata,progressalldata}} = this.props;
      let gpshtnum = [];
      let times = [];
      progressdata({},value).then(rst=>{
        console.log(rst);
        
        for(let i = 0 ;i<=rst.length-1;i++){
            gpshtnum.push(rst[i].Num);
            let time = new Date(rst[i].CreateTime).toLocaleDateString()
            times.push(time);
        }
        this.setState({
          gpshtnum:gpshtnum,
          times:times,
        })
        let myChart = echarts.init(document.getElementById('lefttop'));
      let optionLine = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            legend: {
                data:['总数','一标','二标','三标','四标','五标'],
                left:'right'
                
            },
            xAxis: [
                {
                    type: 'category',
                    data: this.state.times,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '长度（m）',
                    axisLabel: {
                        formatter: '{value} '
                    }
                },
              
            ],
            series: [
                {
                    name:'总数',
                    type:'bar',
                    data:gpshtnum,
                    barWidth:'25%',
                    itemStyle:{
                        normal:{
                            color:'#02e5cd',
                            barBorderRadius:[50,50,50,50]
                        }
                    }
                },
                {
                    name:'一标',
                    type:'line',
                    data:gpshtnum,
                    itemStyle:{
                        normal:{
                            color:'black'
                        }
                    }
                },
                {
                    name:'二标',
                    type:'line',
                    data:gpshtnum,
                    itemStyle:{
                        normal:{
                            color:'orange'
                        }
                    }
                },
                {
                    name:'三标',
                    type:'line',
                    data:gpshtnum,
                    itemStyle:{
                        normal:{
                            color:'yellow'
                        }
                    }
                },
                {
                    name:'四标',
                    type:'line',
                    data:gpshtnum,
                    itemStyle:{
                        normal:{
                            color:'blue'
                        }
                    }
                },
                {
                    name:'五标',
                    type:'line',
                    data:gpshtnum,
                    itemStyle:{
                        normal:{
                            color:'green'
                        }
                    }
                }
            ]
        };
        myChart.setOption(optionLine);
      })
      
      // let biaoduan = ['1标段','2标段','3标段','4标段','5标段'];
      // let numbers = [];
      // for (let j=0; j<=biaoduan.length-1; j++){
      //     value.unitproject = biaoduan[i];
      //     progressdata({},value).then(rst=>{
      //       console.log(rst);
      //         let gpsht = rst;
      //         let gpshtnum = [];
      //         let times = [];
      //         for(var i = 0; i<=gpsht.length-1; i++){
      //             gpshtnum.push(gpsht[i].Num);
      //             let time = new Date(gpsht[i].CreateTime).toLocaleDateString()
      //             times.push(time);
      //         }
      //         numbers.push(gpshtnum);
      //   })
      // }
      // console.log(numbers,"realy");
      
      
    }
}