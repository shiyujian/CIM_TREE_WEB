import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import {Card,Row,Col,Select,Modal,Input,Button,Radio} from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;


export default class Warning extends Component {

    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
            projectStage:'',
            reportVisible:false,
            project:[],
            seriesData:[],
            xAxisData:[]
        }
    }

    componentDidMount() {
        const {getProjectTree} = this.props.actions;
        //获取最初始的树节点
        let test=[];
        getProjectTree({},{depth:1}).then((rst)=>{
            if(rst && rst.children && rst.children.length>0){
                let root = rst
                for(var i=0;i<rst.children.length;i++){
                    let project=rst.children[i]
                    test.push(project)
                }
                this.setState({
                    project:test,
                    projectStage:root.pk
                })
            }
        })
    }

    componentDidUpdate(prevProps,prevState){
        const {
            actions:{
                getProjectQuantity
            }
        }=this.props
        const {
            projectStage,
            seriesData,
            xAxisData
        }=this.state
        let me =this
        if(prevState.projectStage != this.state.projectStage){
            let projectQuantityData = {
                pk:projectStage
            }
            let parameter = {
                plan_key:'plan_quantity',
                actual_key:'actual_quantity',
                tree_depth:2
            }
            let xAxisData = [];
            let seriesData = [];
            getProjectQuantity(projectQuantityData,parameter).then((rst)=>{
                if(rst && rst.children){
                    for(var i=0;i<rst.children.length;i++){
                        seriesData.push(rst.children[i].complete_percent)
                        xAxisData.push(rst.children[i].name)
                    }
                    me.setState({
                        seriesData:seriesData,
                        xAxisData:xAxisData
                    })
                    console.log('wwwwwwwwwwwwsss',rst)
                }
            })

        }
        const myChart = echarts.init(document.getElementById('resultChangePie3'));
        const option = {
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '22%',
                containLabel: true
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true
                    }
                }
            },
            xAxis : [
                {
                    type : 'category',
                    data : xAxisData,
                    axisTick: {
                        interval: 0
                    },
                    axisLabel : {
                        rotate :50,
                        margin :0,
                        lineHeight :50,
                        rich: {
                            height :50
                        },
                        interval :0,
                        fontSize : 11
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    min:0,
                    max:100,
                    title: {
                        text: '百分比'
                    }
                }
            ],
            series : [
                {
                    name:'审查通过设计成果数量',
                    type:'bar',
                    data:seriesData
                }
            ]
        };
        myChart.setOption(option,true);


    }

    render() { //todo 各单位工程完成状态统计
        const{
            project
        }=this.state
        return (
            <Card >
                <h1 style={{textAlign:'center'}}>各单位工程完成状态统计</h1>
                <Row className='mb10'>
                    <Col span={6}></Col>
                    <Col span={12}>
                        <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">项目:</label>
                        <div className="start_input">
                            <Select style={{ width: '100%' }}
                                
                                placeholder={'搜索选择定位到单位工程'}
                                value={this.state.projectStage}
                                onChange={(value)=>{this.setState({projectStage:value})}}
                            >
                                {project.map((unit)=>{
                                    return <Option value={unit.pk} key={unit.pk} >{unit.name}</Option>
                                })}
                            </Select>
                        </div>
                    </Col>
                    <Col span={6}></Col>
                </Row>
                <div id='resultChangePie3' style={{ width: '100%', height: '450px' }}></div>
                
            </Card>
        );
    }
    
}
