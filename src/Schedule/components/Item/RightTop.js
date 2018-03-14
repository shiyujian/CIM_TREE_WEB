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
            data:"",
            gpshtnum:[],
            departOptions:"",
            unitproject:"1标段",
            project:"便道施工",

        }
    }

    componentWillReceiveProps(nextProps){
        
        let params = {}
        params.etime = this.state.etime1;
        params.stime = this.state.stime1;
        params.project = this.state.project;
        params.unitproject = this.state.unitproject;
        this.getdata(params);

        // const {actions: {progressdata,progressalldata}} = this.props;
        // progressdata({},{unitproject:this.state.unitproject,project:this.state.project}).then(rst=>{
        //     console.log(rst,"xixhia");
        //     this.getdata(rst);
        // })
        // progressalldata().then(rst=>{
        //     console.log(rst,"hghlgl")
        // }) 
        // console.log(this.state.data);
      
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
                    // name: '长度（m）',
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
        return (
            <div >
                <Card>
                施工时间：
                 <RangePicker 
                    style={{verticalAlign:"middle"}} 
                    defaultValue={[moment(this.state.stime, 'YYYY/MM/DD HH:mm:ss'),moment(this.state.etime, 'YYYY/MM/DD HH:mm:ss')]} 
                    showTime={{ format: 'HH:mm:ss' }}
                    format={'YYYY/MM/DD HH:mm:ss'}
                    onChange={this.datepick.bind(this)}
                    onOk={this.datepick.bind(this)}
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
    datepick(value){

        this.setState({stime:value[0]?moment(value[0]).format('YYYY/MM/DD HH:mm:ss'):''})
        this.setState({etime:value[1]?moment(value[1]).format('YYYY/MM/DD HH:mm:ss'):''})
        let params = {}
        
        
        params.etime = value[1]?moment(value[1]).format('YYYY/MM/DD HH:mm:ss'):'';
        params.stime = value[0]?moment(value[0]).format('YYYY/MM/DD HH:mm:ss'):'';
        params.project = this.state.project;
        params.unitproject = this.state.unitproject;
        this.getdata(params);
    }
    onChange(){}
    onDepartments1(value){
        this.setState({
            project:value,
        })
        let params = {}
        params.etime = this.state.etime1;
        params.stime = this.state.stime1;
        params.unitproject = this.state.unitproject;
        params.project = value;
        this.getdata(params);

        // const {actions: {progressdata,progressalldata}} = this.props;
        // console.log(value,"111");
        // this.setState({
        // project:value,
        // })
        // progressdata({},{unitproject:this.state.unitproject,project:value,etime:this.state.etime1,stime:this.state.stime1}).then(rst=>{
        //     this.getdata(rst);
        // })

    }
    onDepartments2(value){
        this.setState({
            unitproject:value,
        })
        let params = {}
        params.etime = this.state.etime1;
        params.stime = this.state.stime1;
        params.project = this.state.project;
        params.unitproject = value;
        this.getdata(params);

        // const {actions: {progressdata,progressalldata}} = this.props;
        // console.log(value,"111");
        // this.setState({
        //   unitproject:value,
        // })
        // progressdata({},{unitproject:value,project:this.state.project,etime:this.state.etime1,stime:this.state.stime1}).then(rst=>{
        //     this.getdata(rst);
        // })

    }
    getdata(value){
        console.log('aaaaaaaaaaaaaaaaaaaaa',value)
        const {actions: {progressdata,progressalldata}} = this.props;
        let gpshtnum = [];
        let times = [];
        let time = [];


        progressalldata({},value).then(rst=>{
            console.log(rst);
            let datas = [];
            if(rst && rst.content){

                let content = rst.content
                //将获取的数据按照 ProgressTime 时间排序
                content.sort(function(a, b) {
                    if (a.ProgressTime < b.ProgressTime ) {
                        return -1;
                    } else if (a.ProgressTime > b.ProgressTime ) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                console.log('content',content)
                //将 ProgressTime 单独列为一个数组
                for(let i=0;i<content.length;i++){
                    let a = moment(content[i].ProgressTime).format('YYYY/MM/DD')
                    time.push(a)
                }
                //时间数组去重
                times = [...new Set(time)]
                console.log('times',times)
                
                times.map((time,index)=>{
                    datas[index] = 0;
                    content.map((arr,a)=>{
                        if(moment(arr.ProgressTime).format('YYYY/MM/DD') === time){
                            let Items = arr.Items?arr.Items:[]
                            Items.map((item,x)=>{
                                //默认的种类
                                if(x<6){
                                    if(item.Project === value.project){
                                        datas[index] = datas[index]+item.Num+0
                                    }else{
                                        datas[index] = datas[index]+0
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
                                    console.log('treetype',treetype)

                                    if(treetype === value.project){
                                        datas[index] = datas[index]+item.Num+0
                                    }else{
                                        datas[index] = datas[index]+0
                                    }
                                }
                            })
                        }
                    })
                })
                console.log('datas',datas)

                this.setState({
                    gpshtnum:datas,
                    times:times,
                })
            }
            
            //当查不出数据时，使横坐标不为空
            let a = moment().subtract(2, 'days').format('YYYY/MM/DD');
            let b = moment().subtract(1, 'days').format('YYYY/MM/DD');
            let c = moment().format('YYYY/MM/DD');
            let d = moment().add(1, 'days').format('YYYY/MM/DD');
            let e = moment().add(2, 'days').format('YYYY/MM/DD');
            let dates = [];
            dates.push(a)
            dates.push(b)
            dates.push(c)
            dates.push(d)
            dates.push(e)
            console.log('dates',dates)

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
                        data: times.length>0?times:dates,
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        // name: '长度（m）',
                        axisLabel: {
                            formatter: '{value} '
                        }
                    },
                ],
                series: [
                
                    {
                        // name:'一标',
                        type:'line',
                        data:datas,
                        itemStyle:{
                            normal:{
                                color:'black'
                            }
                        }
                    },
                
                ]
            };
            myChart.setOption(optionLine);

        })


        
    }
}
