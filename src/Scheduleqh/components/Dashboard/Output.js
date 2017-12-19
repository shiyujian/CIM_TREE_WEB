import React, {Component} from 'react';
import Blade from '_platform/components/panels/Blade';
import echarts from 'echarts';
import {Select,Row,Col,Radio,Card} from 'antd';
import './index.css';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RadioButton = Radio.Button;

export default class Warning extends Component {

    static propTypes = {};
    constructor(props){
        super(props);
        this.state={
            attachmentFile:'',
            unitProjecte:[],
            unitStage:'',
            dateVersionState:'年度统计',
            graphicalVersionState:'a'
        }
    }

    componentDidMount() {
        const {getProjectTree} = this.props.actions;
        //获取最初始的树节点
        let unitProjecte=[];
        let test=[];
        getProjectTree({},{depth:2}).then((rst)=>{
            if(rst && rst.children && rst.children.length>0){
                for(var i=0;i<rst.children.length;i++){
                    let project=rst.children[i]
                    test.push(project)
                    if(project.children.length>0){
                        for(var t=0; t<project.children.length;t++){
                            let item=project.children[t]
                            unitProjecte.push(item)
                        }
                    }
                }
                this.setState({
                    unitProjecte:unitProjecte,
                    project:test,
                    unitStage:unitProjecte[0].pk
                })
            }
        })
        // let unitProjecte=[];
        // getProjectTree({},{depth:3}).then((rst)=>{
        //     console.log('rst=========',rst)
        //     if(rst){
        //         if(rst.children.length>0){
        //             for(var i=0;i<rst.children.length;i++){
        //                 if(rst.children[i].children.length>0){
        //                     let project=rst.children[i].children;
        //                     for(var t=0; t<project.length;t++){
        //                         if(project[t].children.length>0){
        //                             let item=project[t].children
        //                             for(var s=0;s<item.length;s++){
        //                                 unitProjecte.push(item[s])
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //             this.setState({
        //                 unitProjecte:unitProjecte
        //             })
        //         }
        //     }
            
        // })

        const myChart = echarts.init(document.getElementById('resultChangePie'));
        this.optionBar = {
            color: [ '#8ce4fc','#fcff82','#1859ec', '#0ee24f'],
            legend: {
                data: ['计划完成', '实际完成'],
                x:'left'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
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
                    data : ['2017年1月', '2017年2月', '2017年3月', '2017年4月', '2017年5月', '2017年6月', '2017年7月', '2017年8月'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'计划完成',
                    type:'bar',
                    data:[9857, 8292, 4310, 6470, 6293, 4239, 9857, 8292]
                },
                {
                    name:'实际完成',
                    type:'bar',
                    data:[12082, 8680, 4015, 5813, 7556, 5493, 12082, 8680]
                }
            ]
        };

        this.optionLine = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['Step Start', 'Step Middle', 'Step End']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                data : ['2017年1月', '2017年2月', '2017年3月', '2017年4月', '2017年5月', '2017年6月', '2017年7月', '2017年8月'],
                textStyle : {
                    fontStyle : 'oblique'
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'Step Start',
                    type:'line',
                    step: 'start',
                    data:[9857, 8292, 4310, 6470, 6293, 4239, 9857, 8292]
                }
            ]
        };
        

        myChart.setOption(this.optionBar,true);
    }
    
    
    render() { //todo 成果交付申请变更百分率
        const{
            unitProjecte
        }=this.state
        return (
            <div >
                <Card>
                    <h1 style={{textAlign:'center'}}>工程量统计</h1>
                    <Row className='mb10'>
                        <Col span={12}>
                            <RadioGroup onChange={this.dateChange.bind(this)} value={this.state.dateVersionState} >
                                <Radio  value={'年度统计'}>年度统计</Radio>
                                <Radio  value={'月度统计'}>月度统计</Radio>
                                <Radio  value={'日统计'}>日统计</Radio>
                            </RadioGroup>
                        </Col>
                        <Col span={12}>
                            <label  style={{minWidth: 60,display: 'inline-block'}} htmlFor="">单位工程:</label>
                            <div className="start_input">
                                <Select style={{ width: '100%' }}
                                    value={this.state.unitStage}
                                    onChange={(value)=>{this.setState({unitStage:value})}}
                                >
                                    {unitProjecte.map((unit)=>{
                                        return <Option value={unit.code} key={unit.code} >{unit.name}</Option>
                                    })}
                                </Select>
                            </div>
                        </Col>
                    </Row>
                    <Row className='mb10'>
                        <Col span={24}>
                            <RadioGroup onChange={this.graphicalChange.bind(this)} defaultValue="a">
                                <RadioButton value="a">实际完成工程量柱状图</RadioButton>
                                <RadioButton value="b">累计完成工程量折线图</RadioButton>
                            </RadioGroup>
                        </Col>
                    </Row>
                    <div id='resultChangePie' style={{ width: '100%', height: '340px' }}></div>
                </Card>
            </div>
        );
    }
    //选择历史版本
    dateChange(dateVersion){
        console.log('选择历史版本',dateVersion.target.value);
        this.setState({
            dateVersionState: dateVersion.target.value
        });
    }
    graphicalChange(graphicalVersion){
        console.log('选择历史版本',graphicalVersion.target.value);
        if(graphicalVersion.target.value==='a'){
            const myChart = echarts.init(document.getElementById('resultChangePie'));
            myChart.setOption(this.optionBar,true);
        }else if(graphicalVersion.target.value==='b'){
            const myChart = echarts.init(document.getElementById('resultChangePie'));
            myChart.setOption(this.optionLine,true);
        }

        this.setState({
            graphicalVersionState: graphicalVersion.target.value
        });
    }
}
