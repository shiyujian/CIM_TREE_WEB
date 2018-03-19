import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select, Row, Col, DatePicker, Spin, Input, Icon} from 'antd';
import moment from 'moment';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Cards} from '../../components';

var echarts = require('echarts');
const {RangePicker} = DatePicker;
const Option = Select.Option;

export default class FaithTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            section: '',
            treetypeoption: [],
            treetyoption: [],
            leftkeycode: '',
            loading1: false,
            loading2: false,
            treety: '',
            treetype: '',
            treetypename:'',
            factory: '',
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.leftkeycode != this.state.leftkeycode) {
            this.setState({
                leftkeycode: nextProps.leftkeycode
            }, () => {
                this.changeData(1);
                this.changeSeed(2);
            })
        }
    }
	componentDidMount() {
        let that = this;
        //图1
        var myChart1 = echarts.init(document.getElementById('primaryClass'));
        let option1 = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            
                    type : 'shadow'        
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                }
            ],
            yAxis : [
                {
                    type : 'value',
                }
            ],
            series : []
        };
        myChart1.setOption(option1);

        //图2
        var myChart2 = echarts.init(document.getElementById('section1'));
        let option2 = {
            tooltip : {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                show : true,
                feature : {
                    saveAsImage : {show: true}
                }
            },
            xAxis : [
                {
                    type : 'value',
                }
            ],
            yAxis : [
                {
                    type : 'category'
                }
            ],
            series : []
        };
        myChart2.setOption(option2);
	}

	render() {
		return (
			<div>
                <Row gutter={10} style={{margin: '5px 5px 20px 5px'}}>
                    
    				<Col span={12} >
                        <Spin spinning={this.state.loading1}>
    						<Cards search={this.search(1)} title={this.title()}>
    							<div id = 'section1' style = {{width:'100%',height:'260px'}}>
    							</div>
    						</Cards>
                        </Spin>
    				</Col>
                    
    				<Col span={12} >
                        <Spin spinning={this.state.loading2}>
    						<Cards search={this.search(2)} title='供应商各供苗树种诚信分析'>
    							<div id = 'primaryClass' style = {{width:'100%',height:'260px'}}>
    							</div>
    						</Cards>
                        </Spin>
    				</Col>
    			</Row>
			</div>
		);
	}

	search(index) {
        if(index === 1) {
            const {treetyoption = [],treetypeoption = [], sectionoption} = this.props;
            const {treetypename,treety} = this.state;
            
            return (
                <Row>
                    <Col xl={4} lg={10}>
                        <span>类型：</span>
                        <Select allowClear className="forestcalcw2 mxw100" defaultValue='全部' value={treety} onChange={this.ontypechange.bind(this)}>
                            {treetyoption}
                        </Select>
                    </Col>
                    <Col xl={5} lg={10}>
                        <span>树种：</span>
                        <Select allowClear showSearch className="forestcalcw2 mxw100" defaultValue='全部' value={treetypename} onChange={this.ontreetypechange.bind(this)}>
                            {treetypeoption}
                        </Select>
                    </Col>
                </Row>
        )} else {
            const {factory} = this.state;
            return <div>
                <span>供应商：</span>
                <Input className='forestcalcw3 mxw200' onPressEnter={this.factorychange.bind(this)}/>
            </div>
        }
    }
    
    title(){
        const {sectionoption} = this.props;
        const {section} = this.state;
        return <div>
            <Select value={section} onSelect={this.onsectionchange.bind(this)} style={{width: '63px'}}>
                {sectionoption}
            </Select>
            <span>最诚信供应商</span>
        </div>
    }
    //图1点击事件
    onsectionchange(value) {
        this.setState({section:value},() => {
            this.changeData(1)
        })
    }

    ontypechange(value) {
        const {typeselect,leftkeycode = ''} = this.props;
        typeselect(value || '',leftkeycode)
        this.setState({treety:value || ''}, () => {
            this.ontreetypechange('')
        })
    }

    ontreetypechange(value) {
        console.log('value', value)
        const {treetypelist} = this.props;
        let treetype = treetypelist.find(rst => rst.name == value)
        this.setState({treetype:treetype?treetype.oid:'',treetypename:value || ''}, () => {
            this.changeData(1)
        })
    }

    changeData(index) {
        const {treetype,treety,section} = this.state;
        let param = {
            treety,
            treetype,
            section
        }
        this.qury(index,param)
    }

    changeSeed(index) {
        const {factory} = this.state;
        let param = {
            factory
        }
        this.qury(index, param)
    }

    factorychange(value) {
        this.setState({factory: value.target.value}, () => {
            this.changeSeed(2)
        })
    }

    qury(index,param) {
        const {actions: {getHonestyNewTreetype},leftkeycode} = this.props;
        if(index === 1) {
            this.setState({loading1:true})
            getHonestyNewTreetype({},param)
            .then(rst => {
                this.setState({loading1:false})
                if(!rst)
                    return
                try {
                    let myChart1 = echarts.getInstanceByDom(document.getElementById('section1'));
                    // let rank = ['第五名', '第四名', '第三名', '第二名', '第一名']
                    let rankData = rst.slice(0,5);
                    let integrity = [];
                    let nurseryname = [];
                    rankData.forEach((data) => {
                        integrity.push(data['Sincerity'])
                        nurseryname.push(data['Factory'])
                    })  
                    let options1 = {
                        legend: {
                            data:['供苗诚信度']
                        },
                        yAxis: [
                            {
                                type: 'category',
                                data: nurseryname
                            }
                        ],
                        series: [
                            {
                                name: '供苗诚信度',
                                type: 'bar',
                                data: integrity,
                            }
                        ]
                    }
                    myChart1.setOption(options1);                                 
                    
                } catch(e) {
                    console.log(e)
                }
            }) 
        } else if(index === 2) {
            this.setState({loading2:true})
            getHonestyNewTreetype({},param)
            .then(rst => {
                // console.log('rst',rst)
                this.setState({loading2:false})
                if(!rst)
                    return
                try {
                    let myChart2 = echarts.getInstanceByDom(document.getElementById('primaryClass'));
                    // let rankData = rst.slice(0,1);
                    // console.log(111,rankData);
                    let integrity = [];
                    let treetype = [];
                    rst.forEach((data) => {
                        integrity.push(data['Sincerity'])
                        treetype.push(data['TreeTypeName'])
                    })  
                    let options2 = {
                        legend: {
                            data:['供苗诚信度']
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: treetype
                            }
                        ],
                        series: [
                            {
                                name: '供苗诚信度',
                                type: 'bar',
                                data: integrity,
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                        {type: 'min', name: '最小值'}
                                    ]
                                },
                                markLine: {
                                    data: [
                                        {type: 'average', name: '平均值'}
                                    ]
                                }
                            }
                        ]
                    }
                    myChart2.setOption(options2);
                } catch(e) {
                    console.log(e)
                } 
            })
        }
    }
}