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
            stime1: moment().format('2018/2/26 00:00:00'),
            etime1: moment().format('2018/2/26 23:59:59'),
            departOptions:"",
            unitproject:"1标段",
            choose:["灌木","亚乔木","落叶乔木","常绿乔木","种植穴工程","绿地平整","给排水回填","给排水管道安装","给排水沟槽开挖","便道施工"],
            treetypelist:[<Option key="1" value="1标段">1标段</Option>,
                          <Option key="2" value="2标段">2标段</Option>,
                          <Option key="3" value="3标段">3标段</Option>,
                          <Option key="4" value="4标段">4标段</Option>,
                          <Option key="5" value="5标段">5标段</Option>],
        }
    }

    componentDidMount() {
        const {actions: {progressdata,progressalldata}} = this.props;
        progressdata({},{unitproject:this.state.unitproject,etime:this.state.etime1}).then(rst=>{
              this.getdata(rst);
          })

        
        let myChart = echarts.init(document.getElementById('rightbottom'));

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
                    type: 'value',
                    boundaryGap:[0,0.01],
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    boundaryGap:[0,0.01],
                    data:this.state.choose,
                },
                
            ],
            series: [
                {
                    name:'已检验批个数',
                    type:'bar',
                    data:[250, 360, 280, 230, 312, 240, 290,300,266,300],
                    barWidth:'25%',
                    itemStyle:{
                        normal:{
                            color:'#02e5cd',
                            barBorderRadius:[50,50,50,50]
                        }
                    }
                }
            ]
        };
        myChart.setOption(optionLine);
    }
    
    
    render() { //todo 累计完成工程量
        return (
            <div >
                <Card>
                截止日期：
                   <DatePicker  
                     style={{textAlign:"center"}} 
                     showTime
                     defaultValue={moment(this.state.etime1, 'YYYY/MM/DD HH:mm:ss')} 
                     format={'YYYY/MM/DD HH:mm:ss'}
                     onChange={this.datepick.bind(this)}
                     onOk={this.datepickok.bind(this)}
                    >
                    </DatePicker>
                    <div id='rightbottom' style={{ width: '100%', height: '340px' }}></div>
                    <Select 
                          placeholder="请选择部门"
                          notFoundContent="暂无数据"
                          defaultValue="1标段"
                          onSelect={this.onDepartments.bind(this) }>
                          {this.state.treetypelist}
                          
                    </Select>
                    <span>进度分析</span>
                </Card>
            </div>
        );
    }
    datepick(){}
    datepickok(value){
      this.setState({etime1:value?moment(value).format('YYYY/MM/DD HH:mm:s'):'',
                  })
      
      const {actions: {progressdata,progressalldata}} = this.props;
      progressdata({},{unitproject:this.state.unitproject,etime:this.state.etime1}).then(rst=>{
            this.getdata(rst);
        })
    }
    onDepartments(value){
      console.log(value);
      const {actions: {progressdata,progressalldata}} = this.props;
      this.setState({
        unitproject:value,
      })
      progressdata({},{unitproject:value,etime:this.state.etime1}).then(rst=>{
            this.getdata(rst);
        })
    }
    
    getdata(rst){
      console.log(rst,"xixixi");
      let choose = this.state.choose;
      let shuzhu = [];
      // let Num = 0;
      for (let j=0; j<=choose.length-1; j++){
        // debugger;
        let Num = 0;
        for(let i=0; i<=rst.length-1; i++){
          if(choose[j] === rst[i].Project){
            Num = Num + rst[i].Num
          }
        }
        shuzhu.push(Num);
      }
      console.log(shuzhu);
      let myChart = echarts.init(document.getElementById('rightbottom'));
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
                    type: 'value',
                    boundaryGap:[0,0.01],
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    boundaryGap:[0,0.01],
                    data:this.state.choose,
                },
                
            ],
            series: [
                {
                    name:'已检验批个数',
                    type:'bar',
                    data:shuzhu,
                    barWidth:'25%',
                    itemStyle:{
                        normal:{
                            color:'#02e5cd',
                            barBorderRadius:[50,50,50,50]
                        }
                    }
                }
            ]
        };
        myChart.setOption(optionLine);
    }
}