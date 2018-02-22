import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import {Select,Row,Col,Radio,Card,DatePicker} from 'antd';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RadioButton = Radio.Button;
import moment from 'moment';
const {RangePicker} = DatePicker;
export default class Warning extends Component {

    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
            stime1: moment().format('2017/11/17 00:00:00'),
            etime1: moment().format('2017/11/24 23:59:59'),
            data:"",
            gpshtnum:[],
            departOptions:"",
            unitproject:"1标段",
            project:"便道施工",

        }
    }

    componentWillReceiveProps(nextProps){
        const {actions: {progressdata,progressalldata}} = this.props;
        progressdata({},{unitproject:this.state.unitproject,project:this.state.project}).then(rst=>{
            console.log(rst,"xixhia");
            this.getdata(rst);
        })
        progressalldata().then(rst=>{
            console.log(rst,"hghlgl")
        }) 
        console.log(this.state.data);
      
    }

    componentDidMount() {

        const myChart = echarts.init(document.getElementById('rightop'));

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
            // legend: {
            //     data:['一标'],
            //     left:'right'
                
            // },
            xAxis: [
                {
                    type: 'category',
                    data: ['2017-11-13','2017-11-13','2017-11-13','2017-11-13','2017-11-13','2017-11-13','2017-11-13'],
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    min: 0,
                    max: 50,
                    interval: 5,
                    axisLabel: {
                        formatter: '{value} '
                    }
                },
            ],
            series: [
               
                {
                    name:'一标',
                    type:'line',
                    yAxisIndex: 0,
                    data:[30,40,50,20,10,30,30],
                    itemStyle:{
                        normal:{
                            color:'black'
                        }
                    }
                },
              
            ]
        };
        myChart.setOption(optionLine);
    }
    
    
    render() { //todo 累计完成工程量
        return (
            <div >
                <Card>
                施工时间：
                 <RangePicker 
                             style={{verticalAlign:"middle"}} 
                             defaultValue={[moment(this.state.stime1, 'YYYY/M/DD HH:mm:ss'),moment(this.state.etime1, 'YYYY/MM/DD HH:mm:ss')]} 
                             showTime={{ format: 'HH:mm:ss' }}
                             format={'YYYY/MM/DD HH:mm:ss'}
                             onChange={this.datepick.bind(this)}
                             onOk={this.datepickok.bind(this)}
                            >
                            </RangePicker>
                    <div id='rightop' style={{ width: '100%', height: '340px' }}></div>
                    <Select 
                          defaultValue="便道施工"
                          onSelect={this.onDepartments1.bind(this) }
                          onChange={this.onChange.bind(this)}>
                          <Option key="1" value="便道施工">便道施工</Option>
                          <Option key="2" value="给排水水沟挖槽">给排水水沟挖槽</Option>
                          <Option key="3" value="给排水管道安装">给排水管道安装</Option>
                          <Option key="4" value="给排水回填">给排水回填</Option>
                          <Option key="5" value="绿地平整">绿地平整</Option>
                          <Option key="6" value="种植穴工程">种植穴工程</Option>
                    </Select>
                    <Select 
                          placeholder="请选择部门"
                          notFoundContent="暂无数据"
                          defaultValue="一标段"
                          onSelect={this.onDepartments2.bind(this)}
                          onChange={this.onChange.bind(this)}>
                          <Option key="8" value="1标段">1标段</Option>
                          <Option key="9" value="2标段">2标段</Option>
                          <Option key="10" value="3标段">3标段</Option>
                          <Option key="11" value="4标段">4标段</Option>
                          <Option key="12" value="5标段">5标段</Option>
                    </Select>
                    <span>强度分析</span>
                </Card>
            </div>
        );
    }
    datepick(){}
    datepickok(value){
      console.log(value[0]?moment(value[0]).format('YYYY/MM/DD HH:mm:s'):'');
      this.setState({etime1:value[1]?moment(value[1]).format('YYYY/MM/DD HH:mm:s'):'',
                     stime1:value[0]?moment(value[0]).format('YYYY/MM/DD HH:mm:s'):'',
                  })
      const {actions: {progressdata,progressalldata}} = this.props;
      progressdata({},{unitproject:this.state.unitproject,project:this.state.project,etime:this.state.etime1,stime:this.state.stime1}).then(rst=>{
            this.getdata(rst);
        })

    }
    onChange(){}
    onDepartments1(value){
      const {actions: {progressdata,progressalldata}} = this.props;
        console.log(value,"111");
        this.setState({
          project:value,
        })
        progressdata({},{unitproject:this.state.unitproject,project:value,etime:this.state.etime1,stime:this.state.stime1}).then(rst=>{
            this.getdata(rst);
        })

    }
    onDepartments2(value){
      const {actions: {progressdata,progressalldata}} = this.props;
        console.log(value,"111");
        this.setState({
          unitproject:value,
        })
        progressdata({},{unitproject:value,project:this.state.project,etime:this.state.etime1,stime:this.state.stime1}).then(rst=>{
            this.getdata(rst);
        })

    }
    getdata(rst){
      console.log(rst);

      let gpsht = rst;
      let gpshtnum = [];
      let times = [];
      for(var i = 0; i<=gpsht.length-1; i++){
          gpshtnum.push(gpsht[i].Num);
          let time = new Date(gpsht[i].CreateTime).toLocaleDateString()
          times.push(time);
      }
      console.log(gpshtnum,times,"realy");
       const myChart = echarts.init(document.getElementById('rightop'));

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
            xAxis: [
                {
                    type: 'category',
                    data: times,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} '
                    }
                },
            ],
            series: [
               
                {
                    // name:'一标',
                    type:'line',
                    data:gpshtnum,
                    itemStyle:{
                        normal:{
                            color:'black'
                        }
                    }
                },
              
            ]
        };
        myChart.setOption(optionLine);
    }
}
