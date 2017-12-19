import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {actions} from '../store/safetyMonitor';
import AddFile from '../components/Discipline/AddFile'
import {actions as platformActions} from '_platform/store/global';
import ProjectUnitWrapper from '../components/ProjectUnitWrapper';
import {CUS_TILEMAP, TILEURLS,WMSTILELAYERURL} from '_platform/api';
import './DataQuery.css';
import moment from 'moment';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import echarts from 'echarts';
import {
    Table,
    Row,
    Col,
    Form,
    Button,
    Input,
    Popconfirm,
    DatePicker,
    Tabs,
    Radio,
    Select,
    notification
} from 'antd';
const Search = Input.Search;
const $ = window.$;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;
@connect(
    state => {
        const {platform,safety:{safetyMonitor={}} = {}} = state;
        return {platform,safetyMonitor}
    },
    dispatch => ({
        actions: bindActionCreators({...actions, ...platformActions}, dispatch)
    })
)

class DataQuery extends Component {
    static propTypes = {};
    constructor(){
        super();
        this.state = {
            TileLayerUrl: this.tileUrls[1],
            totalDisplay:'block',
            record:{},
            setEditVisiable:false,
            index:'-1',
            dataSet:[],
            newKey: Math.random(),
            project:{},
            unitProject:{},
            dateList:[],
            surveyVisiable:false,  
            normalVisiable:false,
            positionList:[],   //监测点列表
            monitorVal:[],     //监测数据列表
            monthForSuvery:'',   //month select by suvery chart page
            optionLine1:{},
            optionLine2:{}
        }
        this.map = null;
    }

    componentDidMount() {
        this.initMap();
        const { 
            actions: { 
                getMonitorValues,
                getProjectTree
            } 
        } = this.props;
        getProjectTree({},{depth:2}).then((rst)=>{
            if(rst && rst.children && rst.children.length>0){
                let project=rst.children;
                let unitProject = {};
                for(var i=0;i<project.length;i++){
                    if(project[i].children.length>0){
                        unitProject=project[i].children[0];
                        this.setState({
                            unitProject:unitProject,
                            project:project[i],
                        });
                        break;
                    }
                }
                this.getDataList(unitProject);
            }
        });
    }

    getDataList(unitProject,dateString){
        const { 
            actions: { 
                getMonitorValues
            } 
        } = this.props;
        let dataSet = [];
        if(!dateString){
            dateString = '';
        }
        getMonitorValues({},{unit:unitProject.code,large:true,date:dateString}).then(rst=>{
            rst.map(item=>{
                let data = {};
                data.id = item._id;   //current data id
                data.nid = item.node._id;   //monitor node id
                data.mid = item.node.m_type._id;  //monitor type id
                data.depth = item.depth;
                data.hasdepth = item.node.m_type.has_depth;
                data.instrument = item.node.instrument;
                data.date = item.view_date.slice(0,10);
                data.date1 = item.node.created.slice(0,10);
                //some base data.
                data.x = item.node.coord.x;
                data.y = item.node.coord.y;
                data.z = item.node.coord.z;
                data.number = item.node.number;
                data.monitorProject = item.node.m_type.project;
                data.project = item.node.m_type.name;
                data.unit = item.node.m_type.measure_unit;
                data.value = item.value;
                data.variation = item.variation;
                data.a_variation = item.a_variation;
                data.gradient = item.gradient;
                //flag things
                data.value_abn = item.value_abn;
                data.variation_abn = item.variation_abn;
                data.a_variation_abn = item.a_variation_abn;
                data.gradient_abn = item.gradient_abn;
                //range things
                if(item.node.m_type.threshold_min==="负无穷"&&item.node.m_type.threshold_max==="正无穷"){
                    data.threshold = "";
                }else{
                    data.threshold = `${item.node.m_type.threshold_min}-${item.node.m_type.threshold_max}`;
                }
                if(item.node.m_type.variation_min==="负无穷"&&item.node.m_type.variation_max==="正无穷"){
                    data.varthreshold = "";
                }else{
                    data.varthreshold = `${item.node.m_type.variation_min}-${item.node.m_type.variation_max}`;
                }
                if(item.node.m_type.a_variation_min==="负无穷"&&item.node.m_type.a_variation_max==="正无穷"){
                    data.lvarthreshold = "";
                }else{
                    data.lvarthreshold = `${item.node.m_type.a_variation_min}-${item.node.m_type.a_variation_max}`;
                }
                if(item.node.m_type.gradient_min==="负无穷"&&item.node.m_type.gradient_max==="正无穷"){
                    data.thgradient = "";
                }else{
                    data.thgradient = `${item.node.m_type.gradient_min}-${item.node.m_type.gradient_max}`;
                }
                dataSet.push(data);
            });
            this.setState({dataSet});
        });
        return 0;
    }

    componentWillUnmount() {
        clearInterval(this.timeInteval)
        /*三维切换卡顿*/

        if (this.state.iframe_key) {
            $('#showCityMarkerId')[0].contentWindow.terminateRender &&
            $('#showCityMarkerId')[0].contentWindow.terminateRender()
        }
    }

    WMSTileLayerUrl = WMSTILELAYERURL;
    subDomains = ['7']
    tileUrls = TILEURLS;
    /*初始化地图*/
    initMap() {
        this.map = L.map('mapid', window.config.initLeaflet);

        L.control.zoom({position: 'bottomright'}).addTo(this.map)

        this.tileLayer = L.tileLayer(TILEURLS[1], {
            attribution: '&copy;<a href="">ecidi</a>',
            id: 'tiandi-map',
            subdomains: this.subDomains
        }).addTo(this.map)
        //航拍影像
        if (CUS_TILEMAP)
            L.tileLayer(`${CUS_TILEMAP}/Layers/_alllayers/LE{z}/R{y}/C{x}.png`).addTo(this.map)

        L.tileLayer.wms(this.WMSTileLayerUrl, {
            subdomains: this.subDomains
        }).addTo(this.map)

    }


    deletet(record,index){
    }

    onAddClick(record,index){
        this.setState({newKey: Math.random(),setEditVisiable:true})
    }

    goCancel(){
        this.setState({setEditVisiable:false});
    }

    onSelect = (project,unitProject)=>{
        const { 
            actions: { 
                getDateList,
            } 
        } = this.props;
        if(unitProject){
            this.setState({project,unitProject});
        }else{
            return;
        }
        this.getDataList(unitProject); 
        getDateList({},{unit:unitProject.code}).then(rst=>{
            this.setState({dateList:rst,surveyVisiable:false,normalVisiable:false,totalDisplay:'block'});
        });
    }

    createMarker(geo) {
        //if no coord infomation,do not display the marker
        if (!geo.coord.x || !geo.coord.y) {
            return;
        }
        geo.coordinates = [geo.coord.x,geo.coord.y];
        let iconType = L.divIcon({className: 'videoIcon'});
        let marker = L.marker(geo.coordinates, {icon: iconType, title: geo.number});
        marker.bindPopup(L.popup({maxWidth: 240}).setContent(`<div>123<div>`));
        marker.addTo(this.map);
        return marker;
    }

    onViewClick = (record,index) =>{
        let positionList = [];
        const { 
            actions: { 
                getMonitorNodes
            } 
        } = this.props;
        const {unitProject} = this.state;
        getMonitorNodes({},{unit:unitProject.code,type:record.project}).then((rst)=>{
            if(rst.results){
                rst.results.map((item)=>{
                    this.createMarker(item);   //有一个测点就创建一个图标
                    let data = {};
                    data.number = item.number;   //监测点编号
                    data.id = item._id;    //监测点id
                    data.x = item.coord.x;
                    data.y = item.coord.y;
                    data.z = item.coord.z;
                    data.monitorProject = item.m_type.name;   //监测项目名称
                    data.project_part = item.project_part===null?'':item.project_part;
                    positionList.push(data);
                });
                if(record.hasdepth===true){
                    this.setState({surveyVisiable:true,totalDisplay:'none',positionList});
                }else{
                    this.setState({normalVisiable:true,totalDisplay:'none',positionList});
                }
            }
        });
    }

    disabledDate(current) {
      const {dateList} = this.state;
      if(current){
        let dada = current.format('YYYY-MM-DD');
        return current && dateList.indexOf(dada)===-1;
      }
      return current;
    }

    onPickerChange(date,dateString){
        const {unitProject} = this.state;
        this.getDataList(unitProject,dateString);
    }

    onPickerChange1(date,dateString){
        const {record} = this.state;
        this.getMonitorValue(record,dateString);
    }
    onPickerChange2(date,dateString){  //
        const {record} = this.state;
        this.setState({monthForSuvery:dateString});
        this.getMonitorValue1(record,dateString);
    }
    onPickerChange3(date,dateString){  //
        const {record} = this.state;
        this.setState({monthForSuvery:dateString});
        this.getMonitorValue2(record,dateString);
    }
    handleChange(value){
        const {record} = this.state;
        if(!record.x){
            notification.warning({
                message: '请选择一个监测点！',
                duration: 2
            });
            return;
        }
    }

    getMonitorValue2(record,dateString,times){
        const {unitProject} = this.state;
        const { 
            actions: { 
                getMonitorValues
            } 
        } = this.props;
        let monitorVal = [];
        if(!dateString){
            dateString = '';
        }
        //default 1
        if(!times){
            times = 1;
        }
        //Init the dataArray to echarts
        let variationArray = [];   //本次变化量
        let a_variationArray = [];  //累计变化量
        let Xcoordinate = [];   
        let node_depth = [];       //作为纵坐标

        getMonitorValues({},{unit:unitProject.code,node:record.id,month:dateString,times:times}).then(rst=>{
            rst.map(item=>{
                Xcoordinate.push(item.date);
                if(node_depth.length===0){
                    node_depth = item.node_depth;
                }
                variationArray.push({name:item.date,type:'line',data:item.variation});
                a_variationArray.push({name:item.date,type:'line',data:item.a_variation});
            });
            
            let optionLine1 = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data:Xcoordinate,
                    x:'left'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {
                            show:false
                        }
                    }
                },
                xAxis: {
                    type: 'value',
                },
                yAxis: {
                    type: 'category',
                    data : node_depth,
                    textStyle : {
                        fontStyle : 'oblique'
                    }
                },
                series: variationArray
            };
            let optionLine2 = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data:Xcoordinate,
                    x:'left'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {
                            show:false
                        }
                    }
                },
                xAxis: {
                    type: 'value'
                    
                },
                yAxis: {
                    type: 'category',
                    data : node_depth,
                    textStyle : {
                        fontStyle : 'oblique'
                    }
                },
                series: a_variationArray
            };
            this.setState({optionLine1,optionLine2})
            const myChart = echarts.init(document.getElementById('resultChangePie'));
            myChart.setOption(optionLine1,true);
            this.setState({variationArray,a_variationArray,Xcoordinate});
        });
    }
    //根据日期得到统计图的信息
    getMonitorValue1(record,dateString){
        const {unitProject} = this.state;
        const { 
            actions: { 
                getMonitorValues
            } 
        } = this.props;
        let monitorVal = [];
        if(!dateString){
            dateString = '';
        }
        //Init the dataArray to echarts
        let valueArray = [];
        let variationArray = [];   //本次变化量
        let a_variationArray = [];  //累计变化量
        let gradientArray = [];
        let Xcoordinate = [];
        let i = 1;
        getMonitorValues({},{unit:unitProject.code,node:record.id,month:dateString}).then(rst=>{
            rst.results.map(item=>{
                valueArray.push(item.value);
                variationArray.push(item.variation);
                a_variationArray.push(item.a_variation);
                gradientArray.push(item.gradient);
                Xcoordinate.push(i++);
            });
            let optionLine = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data:['读数','变化量', '累计变化量', '变化率'],
                    x:'left'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {
                            show:false
                        }
                    }
                },
                xAxis: {
                    type: 'category',
                    data : Xcoordinate,
                    textStyle : {
                        fontStyle : 'oblique'
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'读数',
                        type:'line',
                        step: 'start',
                        data:valueArray
                    }, {
                        name:'变化量',
                        type:'bar',
                        step: 'start',
                        data:variationArray
                        // data:[10,20]
                    }, {
                        name:'累计变化量',
                        type:'bar',
                        step: 'start',
                        data:a_variationArray
                    }, {
                        name:'变化率',
                        type:'bar',
                        step: 'start',
                        data:gradientArray
                    }
                ]
            };
            const myChart = echarts.init(document.getElementById('resultChangePie1'));
            myChart.setOption(optionLine,true);
            this.setState({valueArray,variationArray,a_variationArray,gradientArray,Xcoordinate});
        });
    }

    getMonitorValue(record,dateString){
        const {unitProject} = this.state;
        const { 
            actions: { 
                getMonitorValues
            } 
        } = this.props;
        let monitorVal = [];
        if(!dateString){
            dateString = '';
        }
        getMonitorValues({},{unit:unitProject.code,type:record.monitorProject,node:record.id,date:dateString}).then(rst=>{
            rst.results.map(item=>{
                let data = {};
                data.id = item._id;   //current data id
                data.nid = item.node._id;   //monitor node id
                data.mid = item.node.m_type._id;  //monitor type id
                data.depth = item.depth;
                data.hasdepth = item.node.m_type.has_depth;
                data.instrument = item.node.instrument;
                data.date = item.view_date.slice(0,10);
                data.date1 = item.node.created.slice(0,10);
                //some base data.
                data.x = item.node.coord.x;
                data.y = item.node.coord.y;
                data.z = item.node.coord.z;
                data.number = item.node.number;
                data.value_init = item.value_init;
                data.monitorProject = item.node.m_type.project;
                data.value = item.value;
                data.variation = item.variation;
                data.a_variation = item.a_variation;
                data.gradient = item.gradient;
                //flag things
                data.value_abn = item.value_abn;
                data.variation_abn = item.variation_abn;
                data.a_variation_abn = item.a_variation_abn;
                data.gradient_abn = item.gradient_abn;
                //range things
                if(item.node.m_type.threshold_min==="负无穷"&&item.node.m_type.threshold_max==="正无穷"){
                    data.threshold = "";
                }else{
                    data.threshold = `${item.node.m_type.threshold_min}-${item.node.m_type.threshold_max}`;
                }
                if(item.node.m_type.variation_min==="负无穷"&&item.node.m_type.variation_max==="正无穷"){
                    data.varthreshold = "";
                }else{
                    data.varthreshold = `${item.node.m_type.variation_min}-${item.node.m_type.variation_max}`;
                }
                if(item.node.m_type.a_variation_min==="负无穷"&&item.node.m_type.a_variation_max==="正无穷"){
                    data.lvarthreshold = "";
                }else{
                    data.lvarthreshold = `${item.node.m_type.a_variation_min}-${item.node.m_type.a_variation_max}`;
                }
                if(item.node.m_type.gradient_min==="负无穷"&&item.node.m_type.gradient_max==="正无穷"){
                    data.thgradient = "";
                }else{
                    data.thgradient = `${item.node.m_type.gradient_min}-${item.node.m_type.gradient_max}`;
                }
                monitorVal.push(data);
            });
            this.setState({monitorVal});
        });
    }
    onStationClick = (record,index) => {
        const {unitProject} = this.state;
        const { 
            actions: { 
                getMonitorValues,
                getDateList
            } 
        } = this.props;
        this.setState({record});
        getDateList({},{unit:unitProject.code,node:record.id}).then(rst=>{
            this.setState({dateList:rst});
        });
        this.getMonitorValue(record);
    }

    onSelectChange(value){
        const {record,monthForSuvery} = this.state;
        if(!record.id){   //未选择监测点
            notification.warning({
                message: '请选择监测点！',
                duration: 2
            });
            return;
        }
        this.getMonitorValue2(record,monthForSuvery,value);
    }

    render() {
        const { 
            form: {getFieldDecorator}, 
        } = this.props;
        const {dataSet,project,unitProject,positionList,monitorVal} = this.state;
        let projectName = project.name?project.name:'';
        let unitName = unitProject.name?unitProject.name:'';
        debugger
        const columns = [
            {
                title:'监测项目',
                dataIndex:'project',
                width: '8%'
            },{
                title:'单位',
                dataIndex:'unit',
                width: '3%'
            },{
                title:'累计变化最大监测点',
                dataIndex:'number',
                width: '10%'
            },{
                title:'本次读数',
                dataIndex:'value',
                width: '10%',
                render:(text,record)=>{
                    if(record.value_abn===true){
                        return <p style={{color:'red'}}>{text}</p>
                    }else if(record.value_abn===false){
                        return <p>{text}</p>
                    }
                }
            },{
                title:'阈值',
                dataIndex:'threshold',
                width: '5%',
                render:(text)=>{
                    if(text===""){
                        return <p>————</p>
                    }else{
                        return <p>{text}</p>
                    }
                }
            },{
                title:'本次变化量',
                dataIndex:'variation',
                width: '10%',
                render:(text,record)=>{
                    if(record.variation_abn===true){
                        return <p style={{color:'red'}}>{text}</p>
                    }else if(record.variation_abn===false){
                        return <p>{text}</p>
                    }
                }

            },{
                title:'变化量阈值',
                dataIndex:'varthreshold',
                width: '10%',
                render:(text)=>{
                    if(text===""){
                        return <p>————</p>
                    }else{
                        return <p>{text}</p>
                    }
                }
            },{
                title:'累计变化量',
                dataIndex:'a_variation',
                width: '5%',
                render:(text,record)=>{
                    if(record.a_variation_abn===true){
                        return <p style={{color:'red'}}>{text}</p>
                    }else if(record.a_variation_abn===false){
                        return <p>{text}</p>
                    }
                }
            },{
                title:'累计变化量阈值',
                dataIndex:'lvarthreshold',
                width: '10%',
                render:(text)=>{
                    if(text===""){
                        return <p>————</p>
                    }else{
                        return <p>{text}</p>
                    }
                }
            },{
                title:'变化率',
                dataIndex:'gradient',
                width: '5%',
                render:(text,record)=>{
                    if(record.gradient_abn===true){
                        return <p style={{color:'red'}}>{text}</p>
                    }else if(record.gradient_abn===false){
                        return <p>{text}</p>
                    }
                }
            },{
                title:'变化率阈值',
                dataIndex:'thgradient',
                width: '10%',
                render:(text)=>{
                    if(text===""){
                        return <p>————</p>
                    }else{
                        return <p>{text}</p>
                    }
                }
            },{
                title:'是否异常',
                dataIndex:'normal',
                width: '10%',
                render:(text,record)=>{
                    if(record.value_abn||record.gradient_abn||record.variation_abn||record.a_variation_abn){
                        return <p style={{color:'red'}}>是</p>
                    }else{
                        return <p>否</p>
                    }
                }
            },{
                title:'操作',
                dataIndex:'opt',
                width: '10%',
                render: (text,record,index) => {
                    return <div>
                              <a href="javascript:;" onClick={this.onViewClick.bind(this,record,index)}>查看</a>
                            </div>
                }
            }
        ];
        const columnsD = 
            [{
                title:'深度',
                dataIndex:'depth',
                width: '12.5%',
            },{
                title:'初始值',
                dataIndex:'value_init',
                width: '12.5%',
            },{
                title:'本次读数',
                dataIndex:'value',
                width: '12.5%',
            },{
                title:'本次位移',    //本次变化量
                dataIndex:'variation',
                width: '12.5%',
            },{
                title:'累计位移',   //累计变化量
                dataIndex:'a_variation',
                width: '12.5%',
            }
        ];
        const columnsN = 
            [{
                title:'监测日期',
                dataIndex:'date',
                width: '12.5%',
            },{
                title:'仪器',
                dataIndex:'instrument',
                width: '12.5%',
            },{
                title:'本次读数',
                dataIndex:'value',
                width: '12.5%',
            },{
                title:'本次变化量',   
                dataIndex:'variation',
                width: '12.5%',
            },{
                title:'累计变化量',   
                dataIndex:'a_variation',
                width: '12.5%',
            },{
                title:'变化率',   
                dataIndex:'gradient',
                width: '12.5%',
        }];
        const columns0 = 
            [{
                title:'监测点列表',
                dataIndex:'number',
                render:(text,record,index) =>{
                    return <a href="javascript:;" onClick={this.onStationClick.bind(this,record,index)}>{text}</a>
                }
            }];
                    
        return (
            <div>
                <DynamicTitle title="监测数据查询" {...this.props}/>
                <Sidebar>
                    <div style={{overflow:'hidden'}} className="project-tree">
                        <ProjectUnitWrapper {...this.props} onSelect={this.onSelect.bind(this)}/>
                    </div>
                </Sidebar>
                <Content>
                    <div className="map-container" style={{position: 'relative'}}>
                        <div ref="appendBody" className="l-map r-main">
                            <div id="mapid" style={{
                                "position": "relative",
                                "width": "100%",
                                "height": 620
                            }}>
                            </div>
                        </div>
                        <Row style={{display:`${this.state.totalDisplay}`,marginTop:10}}>
                            <Col span={6}>
                                <DatePicker
                                  style={{marginLeft:10}}
                                  format="YYYY-MM-DD"
                                  onChange={(date,dateString)=>this.onPickerChange(date,dateString)}
                                  disabledDate={(value)=>this.disabledDate(value)}
                                />
                            </Col>
                            <Table 
                             columns={columns} 
                             dataSource={dataSet}
                             bordered
                             style={{height:380,marginTop:40}}
                             pagination = {{pageSize:10}} 
                            />
                        </Row>
                        {
                            this.state.surveyVisiable === true   ?
                                <Row style={{marginTop:10}}>
                                    <Col span={4}>
                                        <Table 
                                         columns={columns0} 
                                         dataSource={positionList}
                                         size="small"
                                         bordered
                                         pagination = {{pageSize:10}} 
                                        />
                                    </Col>
                                    <Col span={16}>
                                        <Tabs defaultActiveKey="1" onChange={this.handleChange.bind(this)}>
                                            <TabPane  tab="测值" key="1">
                                                <DatePicker
                                                  style={{marginLeft:10}}
                                                  format="YYYY-MM-DD"
                                                  onChange={(date,dateString)=>this.onPickerChange1(date,dateString)}
                                                  disabledDate={(value)=>this.disabledDate(value)}
                                                />
                                                <Table    
                                                 showHeader={true} 
                                                 dataSource={monitorVal} 
                                                 columns={columnsD} 
                                                 style={{marginLeft:10}}
                                                 size="small"
                                                 bordered
                                                 pagination = {{pageSize:10}} 
                                                />                     
                                            </TabPane>
                                            <TabPane tab="统计图" key="2">
                                            <RadioGroup 
                                             onChange={this.graphicalChange.bind(this)} 
                                             defaultValue="a"
                                             style={{marginLeft:10}}>
                                                <RadioButton value="a">位移</RadioButton>
                                                <RadioButton value="b">位移累计</RadioButton>
                                            </RadioGroup>
                                            <DatePicker.MonthPicker 
                                              format="YYYY-MM"
                                              style={{marginLeft:10}}
                                              onChange={(date,dateString)=>this.onPickerChange3(date,dateString)}
                                            />
                                            <Select 
                                             defaultValue="1" style={{ width: 200 }} 
                                             onChange={this.onSelectChange.bind(this)}
                                             style={{marginLeft:10}}>
                                              <Option value="1">最近一天</Option>
                                              <Option value="3">最近三天</Option>
                                              <Option value="7">最近七天</Option>
                                            </Select>
                                                 <div id='resultChangePie' style={{ width: '100%', height: '340px' }}></div>
                                            </TabPane>
                                            <TabPane tab="属性" key="3">
                                                {this.propertyRender(this.propertyDataFix(monitorVal))}
                                            </TabPane>
                                        </Tabs>
                                    </Col>
                                </Row>
                            :null
                        }
                        {
                            this.state.normalVisiable === true ?
                                <Row style={{marginTop:10}}>
                                    <Col span={4}>
                                        <Table 
                                         columns={columns0} 
                                         dataSource={positionList}
                                         size="small"
                                         bordered
                                         style={{marginLeft:10}}
                                         pagination = {{pageSize:10}} 
                                        />
                                    </Col>
                                    <Col span={16}>
                                        <Tabs defaultActiveKey="1" onChange={this.handleChange.bind(this)}>
                                            <TabPane  tab="测值" key="1">
                                                <Table    
                                                 showHeader={true} 
                                                 size="small"
                                                 dataSource={monitorVal} 
                                                 style={{marginLeft:10}}
                                                 columns={columnsN} 
                                                 pagination = {{pageSize:10}} 
                                                />                     
                                            </TabPane>
                                            <TabPane tab="统计图" key="2">
                                                 <Row className='mb10'>
                                                    <Col span={5}>
                                                         <DatePicker.MonthPicker 
                                                          format="YYYY-MM"
                                                          style={{marginLeft:10}}
                                                          onChange={(date,dateString)=>this.onPickerChange2(date,dateString)}
                                                        />
                                                    </Col>
                                                </Row>
                                                <div id='resultChangePie1' style={{ width: '100%', height: '340px' }}></div>
                                            </TabPane>
                                            <TabPane tab="属性" key="3">
                                                {this.propertyRender(this.propertyDataFix(monitorVal))}
                                            </TabPane>
                                        </Tabs>
                                    </Col>
                                </Row>
                            :null
                        }
                    </div>
                </Content>
            </div>
        );
    }
    graphicalChange(e){
        const {optionLine1,optionLine2} = this.state;
        if(!optionLine2.series||!optionLine1.series){
            return;
        }
        if(e.target.value==='a'){
            const myChart = echarts.init(document.getElementById('resultChangePie'));
            myChart.setOption(optionLine1,true);
        }else if(e.target.value==='b'){
            const myChart = echarts.init(document.getElementById('resultChangePie'));
            myChart.setOption(optionLine2,true);
        }
    }
    propertyDataFix(data) {
        const {unitProject,project} = this.state;
        let attrs = {};
        if (data && Object.keys(data).length > 0) {
            for(let key in data.attrs){
                if(data.attrs[key]){
                    attrs[key] = data.attrs[key];
                } 
            }
            return [{
                firtSpan: "监测点编号：",
                firtSpanVal: data[0].number,
                secSpan: "监测项目：",
                secSpanVal: data[0].monitorProject //
            }, {
                firtSpan: "所属项目：",
                firtSpanVal: project.name, //
                secSpan: "创建单位工程：",
                secSpanVal: unitProject.name,
            }, {
                firtSpan: "阈值：",
                firtSpanVal: data[0].threshold!==""?data[0].threshold:"无",
                secSpan: "变化量阈值：",
                secSpanVal: data[0].varthreshold!==""?data[0].varthreshold:"无" 
            }, {
                firtSpan: "变化率阈值：",
                firtSpanVal: data[0].thgradient!==""?data[0].thgradient:"无", 
                secSpan: "累计变化量阈值：",
                secSpanVal: data[0].lvarthreshold!==""?data[0].lvarthreshold:"无" 
            },{
                firtSpan: "坐标：",
                firtSpanVal: `${data[0].x} ${data[0].y} ${data[0].z}`, //
                secSpan: "工程部位：",
                secSpanVal: "暂无"
            }, {
                firtSpan: "仪器：",
                firtSpanVal: data[0].instrument, 
                secSpan: "创建时间：",
                secSpanVal: data[0].date1 
            },{
                attrs: attrs
            }]
        } else {
            return []
        }
    }
    propertyRender(data) {
        debugger
        if (data.length > 0) {
            return data.map((item, index) => {
                if(false){
                    let temp = item.attrs;
                    let columns =[];
                    console.log(Object.keys(temp));
                    Object.keys(temp).map((e) => {
                        columns.push({title:e,dataIndex:e});
                    })
                    return (
                        <Row  key={index+"r"}>
                            <Table 
                             columns={columns} 
                             dataSource={[temp]} 
                            />
                        </Row>
                        )
                }
                return (
                    <Row key={index+"r"}>
                        <Col key={index+"c1"} span={4} ><strong><span>{item.firtSpan}</span></strong></Col>
                        <Col key={index+"c2"} span={6} offset={1}><span>{item.firtSpanVal}</span></Col>
                        <Col key={index+"c3"} span={4} ><strong><span>{item.secSpan}</span></strong></Col>
                        <Col key={index+"c4"} span={7} offset={1}><span>{item.secSpanVal}</span></Col>     
                    </Row>
                )
            });
        } else {
            return <div>暂无数据...</div>;
        }
    }
}
export default Form.create()(DataQuery);