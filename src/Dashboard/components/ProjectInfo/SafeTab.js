
import React, {Component} from 'react';
import {Radio,Table,Row,Col} from 'antd';
import {DOWNLOAD_FILE,PDF_FILE_API,DefaultZoomLevel} from '_platform/api';
import L from 'leaflet';
import { Map, Marker, Popup, TileLayer,WMSTileLayer } from 'react-leaflet';
import moment from 'moment';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class SafeTab extends Component{

    state={
        tabIndex:"1",
        rulesData:[],
        risksData:[],
        position:window.config.initLeaflet.center
    }

    rulesColumns=[
        {title: '规则制度', dataIndex: 'institutionName', key: 'institutionName'},
        {title: '操作', dataIndex: 'action', key: 'action',render:(text,record)=>{
            let pdf = record.files[0];
            let previewPath = PDF_FILE_API+pdf.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/,'');
            return <span><a href="javascript:;" onClick={()=>{
                let file = Object.assign({},pdf,{a_file:previewPath});
                this.previewFile(file)
            }}>预览</a></span>
        }}
    ]

    risksColumns=[
        {title: '编号', dataIndex: 'id', key: 'id'},
        {title: '隐患内容', dataIndex: 'risk_content', key: 'risk_content',width: 180},
        // {title: '负责人', dataIndex: 'person', key: 'person'},
        {title: '上报时间', dataIndex: 'created_on', key: 'created_on',width: 80},
        // {title: '处理时间', dataIndex: 'processTime', key: 'processTime'},
        {title: '处理状态', dataIndex: 'status', key: 'status',render:(text)=>{
            switch(text){
                case 3:
                    return "已整改";
                case 2:
                    return "整改不通过";
                case 1:
                    return "整改中";
            }
        }}
    ]

    WMSTileLayerUrl = window.config.WMSTileLayerUrl;
    subDomains = ['7'];
    imgLayerUrl = window.config.IMG_W;
    iconType = L.divIcon({className: 'dangerIcon'});

    genTab(){ 
        const {tabIndex,rulesData,risksData,position} = this.state;
        switch(tabIndex){
            case "1":
                return <div>
                    <Table columns={this.rulesColumns} size="small" dataSource={rulesData}></Table>
                </div>
            case "2":
                return <div style={{display:'flex'}}>
                    <div style={{width:'50%',flex:'1 1 50%'}}>
                        <Table columns={this.risksColumns} size="small" 
                        scroll={{y:200}}
                        dataSource={risksData} rowKey="id"></Table>
                    </div>
                    <div style={{width:'50%',flex:'1 1 50%'}}>
                    <Map center={position} zoom={DefaultZoomLevel} style={{height:'100%'}}>
                        <TileLayer
                        url={this.imgLayerUrl}
                        subdomains={['7']}
                        />
                        <WMSTileLayer
                        url={this.WMSTileLayerUrl}
                        subdomains={['7']}
                        />
                        {
                            this.state.risksData.map(rs=>{
                                return <Marker position={rs.position} icon={this.iconType}>
                                    <Popup>
                                        <span>{rs.risk_content}</span>
                                    </Popup>
                                </Marker>
                            })
                        }
                    </Map>
                    </div>
                    </div>
            case "3":
                return <div>安全监测</div>
        }
    }

    previewFile(file){
        const {openPreview} = this.props.actions;
        openPreview(file);
    }

    componentDidMount(){
        this.getRiskData();
    }

    componentWillReceiveProps(nextProps){
        let {unit} = nextProps;
        if(unit !== this.props.unit){
            this.getSafeDocs(unit);
        }
    }

    //加载单位工程数据
    getSafeDocs=(unit)=>{
        const {getWorkpackages,getDocumentList} = this.props.actions;
        if(unit){
            let code = unit.code;
            getWorkpackages({code:code}).then(rst=>{
                if(!rst.related_documents){
                    this.setState({rulesData:[]});
                    return ;
                }
                //AQGLZD
                let ruleDocs = rst.related_documents.filter(rd=>{
                    return rd.name === 'AQGLZD';
                });
                let codes = ruleDocs.map(r=>r.code);
                getDocumentList({},{key_type: 'code', list: codes.join()})
                    .then(rst=>{
                        let result = rst.result;
                        let rules = result.map((rm,i)=>{
                            return {
                                key:i+1,
                                institutionName:rm.extra_params.institutionName,
                                files:rm.files
                            }
                        });
                        this.setState({rulesData:rules});
                    });
            });
        }
    }

    //获取安全隐患
    getRiskData=()=>{
        const {getRiskAll} = this.props.actions;
        getRiskAll().then(risks=>{
            console.log('risks',risks);
            risks.forEach((rk)=>{
                rk.created_on = moment(rk.created_on).format('YYYY-MM-DD HH:mm:ss');
                rk.position = [rk.coordinate.latitude,rk.coordinate.longitude];
            });
            this.setState({risksData:risks});
        });
    }

    render(){
        return <div>
            <RadioGroup defaultValue="1" size="small" onChange={(e)=>{
                    let val = e.target.value;
                    this.setState({tabIndex:val},()=>{
                        // this.getData(1,this.props.unit);
                    });
                }}>
                    <RadioButton value="1">规则制度</RadioButton>
                    <RadioButton value="2">安全隐患</RadioButton>
                    <RadioButton value="3">安全监测</RadioButton>
            </RadioGroup>
            <div>
                {this.genTab()}
            </div>
        </div>
    }
}

export default SafeTab;
