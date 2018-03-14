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
            stime: moment().format('YYYY/MM/DD 00:00:00'),
            etime: moment().format('YYYY/MM/DD 23:59:59'),
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
        this.getdata()
    }

    componentDidUpdate(prevProps, prevState){
        const {
            stime,
            etime,
            unitproject
        } = this.state
        const {
            leftkeycode
        }=this.props
        try{
            if(leftkeycode.split('-')[0] != prevProps.leftkeycode.split('-')[0]){
                this.getdata()
            }
        }catch(e){
            console.log(e)
        }
        if(stime != prevState.stime || etime != prevState.etime || unitproject != prevState.unitproject){
            this.getdata()
        }
    }

    render() { //todo 累计完成工程量
        return (
            <div >
                <Card>
                施工时间：
                    <RangePicker 
                        style={{textAlign:"center"}} 
                        defaultValue={[moment(this.state.stime, 'YYYY/MM/DD HH:mm:ss'),moment(this.state.etime, 'YYYY/MM/DD HH:mm:ss')]}  
                        showTime={{ format: 'HH:mm:ss' }}
                        format={'YYYY/MM/DD HH:mm:ss'}
                        onChange={this.datepick.bind(this)}
                        onOk={this.datepick.bind(this)}
                    >
                    </RangePicker>
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
    datepick(value){
        this.setState({stime:value[0]?moment(value[0]).format('YYYY/MM/DD HH:mm:ss'):''})
        this.setState({etime:value[1]?moment(value[1]).format('YYYY/MM/DD HH:mm:ss'):''})
    }
    
    onDepartments(value){
        this.setState({
            unitproject:value,
        })
    }
    
    getdata(){
        const{
            etime,
            stime,
            unitproject
        }=this.state
        let params = {
            etime:etime,
            stime:stime,
            unitproject:unitproject
        }
        console.log('RightBottomaaaaaaaaaaaaaaaaaaaaa',params)
        const {actions: {progressdata,progressalldata}} = this.props;
        let gpshtnum = [];
        let times = [];
        let time = [];

        progressalldata({},params).then(rst=>{
            console.log('RightBottom',rst);
            let datas = Array(10).fill(0);
            if(rst && rst.content){

                let content = rst.content
                content.map((rst,index)=>{
                    let Items = rst.Items?rst.Items:[]
                    Items.map((item,x)=>{
                        //默认的种类
                        if(x<6){
                            switch(item.Project){
                                case '便道施工' : 
                                datas[9] += item.Num
                                    break;
                                case '给排水沟槽开挖' :
                                datas[8] += item.Num
                                    break;
                                case '给排水管道安装' :
                                datas[7] += item.Num
                                    break;
                                case '给排水回填' :
                                datas[6] += item.Num
                                    break;
                                case '绿地平整' :
                                datas[5] += item.Num
                                    break;
                                case '种植穴工程' :
                                datas[4] += item.Num
                                    break;    
                            }
                        }else{//添加的数目种类
                            let treetype = ''
                            FORESTTYPE.map(forest => {
                                return forest.children.map(rst => {
                                    if(rst.name === item.Project){
                                        treetype =  forest.name
                                    }
                                })
                            }) 
                            console.log('RightBottomtreetype',treetype)

                            switch(treetype){
                                case '常绿乔木' : 
                                    datas[3] += item.Num
                                    break;
                                case '落叶乔木' :
                                    datas[2] += item.Num
                                    break;
                                case '亚乔木' :
                                    datas[1] += item.Num
                                    break;
                                case '灌木' :
                                    datas[0] += item.Num
                                    break;   
                            }
                        }
                    })
                })
                
                console.log('RightBottomdatas',datas)

               
            }
        
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
                        data:datas,
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

        })
        
    }
}