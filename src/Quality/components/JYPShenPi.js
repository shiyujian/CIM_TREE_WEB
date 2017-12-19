import React, {Component} from 'react'; 
import PropTypes from 'prop-types';
import { message, Select, Table, Input, Button, Radio ,Spin,Modal,Upload,Carousel,Card} from 'antd';
import {PDF_FILE_API,STATIC_DOWNLOAD_API, SERVICE_API, WORKFLOW_API,JYPMOD_API,UPLOADFILE_API,DOWNLOAD_FILE,SERVICE_USER_PWD,SOURCE_API} from '_platform/api';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as previewActions from '_platform/store/global/preview';
import Preview from '_platform/components/layout/Preview';
import {actions as actions2} from '../store/cells';
import WorkflowHistory from './WorkflowHistory';
@connect(
    state => {
            return {wholeStore:state};
    },
    dispatch => ({
        actions: bindActionCreators({...previewActions}, dispatch),
        cellActions: bindActionCreators({...actions2}, dispatch),
    }),
)
export  class JYPShenPi extends Component {
    constructor(props){
        super(props);
        this.state = {
            fileList:[],
            allUsers:[],
            jianli:null,
            imgList:[]
        }
    }
    componentWillReceiveProps(props){//不会无限刷
        console.log('willup',props);
        if(!props.tianbaoing){
            this.setState({fileList:[]});
        }
    }
    componentDidMount(){
        let {getAllUsers} = this.props;
        let {getUserById} = this.props.cellActions;
        getAllUsers().then(rst=>{
            this.setState({allUsers:rst});
        });
        getUserById({pk:this.props.tianbaojianyanpi.extra_params.qualifier}).then(rst=>{
            this.setState({qualifier:rst.account.person_name})
        });
        getUserById({pk:this.props.tianbaojianyanpi.extra_params.JianLiID}).then(rst=>{
            this.setState({jianli:rst.account.person_name})
        });
        let img = this.props.tianbaojianyanpi.extra_params.img || [];
        this.setState({imgList:img});
    }
    componentDidUpdate(){
        if(!this.props.tianbaoing){
            // document.getElementsByClassName('tianbaoInput').forEach(ele=>{
            //     ele.value= '';
            // });
            let arr = document.getElementsByClassName('tianbaoInput');
            for(let i = 0;i<arr.length;i++)
            {
                arr[i].value='';
            }
        }
    }
    ok(){
        this.props.setData(this.state);
    }
    previewDoc(index,fileList){
        let {openPreview} = this.props.actions;
        let file = fileList[index]; 
        let fname = file.name;
        if(/.+?\.pdf/.test(fname) || /.+?\.docx/.test(fname) || /.+?\.doc/.test(fname)){
            file.a_file = file.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, '')
            file.a_file = PDF_FILE_API + file.a_file;
            openPreview(file);
        }else{
            message.warning('该类型文件不支持预览，请下载查看');
        }

        

    }
    setField(p1,p2){
        // console.log(p1,p2.target.value);
        if(typeof p2 === 'string'){
            this.setState({[p1]:p2});
            return;
        }
        this.setState({[p1]:p2.target.value});
    }
	render() {
        // let auth =  btoa('admin:adminadmin')
        let fileName = '相关文件下载';
        let jyp = this.props.tianbaojianyanpi;
        let fileList = jyp.extra_params.file||[];
        let imgList = jyp.extra_params.img;
        return(
            !jyp ? <div /> : <div>
            <Modal
                width={880}
                okText='审批通过'
                onOk={this.ok.bind(this)}
                onCancel={this.props.cancel}
                visible={this.props.tianbaoing}>
                <div style={{ width: '800px' }}>
                    <Card style={{ width: '800px' }} title={jyp.name + '验收表'}>
                        <Input addonBefore='工程名称' value={jyp.extra_params.XiangMu} style={InputStyle} />
                        <Input addonBefore='单位名称' value={jyp.extra_params.DanWei} style={InputStyle} />
                        <Input addonBefore='分部名称' value={jyp.extra_params.FenBu} style={InputStyle} />
                        <Input addonBefore='分项名称' value={jyp.extra_params.FenXiang} style={InputStyle} />
                        <Input addonBefore='工程部位' value={jyp.extra_params.location} style={InputStyle} />
                        <Input addonBefore='质检员' value = {this.state.qualifier||''}  style={InputStyle} />
                    </Card>

                    <Card style={{ width: '800px' }} title={'合格率信息'}>
                        <Input addonBefore='合格数' value = {jyp.extra_params.total_count} style={InputStyle} />
                        <Input addonBefore='检验数' value = {jyp.extra_params.qualified_count} style={InputStyle} />
                        <Input addonBefore='合格率' value = {Number.parseInt(100*(+jyp.extra_params.qualified_count)/(+jyp.extra_params.total_count)) + '%'}  style={InputStyle} />
                    </Card>
                    <Card style={{ width: '800px' }} title={''}>
                        <Input size='large' addonBefore='备注' value = {jyp.extra_params.remark} />
                        <div style={{margin:'10px'}}> 
                        <span>附件:</span>
                            {
                                fileList.map((item, index) => {
                                    return (<div><a style={{ margin: '10px' }} href={DOWNLOAD_FILE+item.download_url}>{item.name}</a>
                                    </div>)
                                })
                            }
                           
                        </div>
                        <div>
                                <span>现场图片:</span>
                                {
                                this.state.imgList.length > 0 &&
                                    <div style={{marginBottom:'10px'}}>
                                        <Carousel autoplay>
                                            {
                                                this.state.imgList.map(x => (
                                                    <div className="picDiv">
                                                        <img className="picImg" src={`${STATIC_DOWNLOAD_API}${x}`} alt=""/>
                                                    </div>
                                                ))
                                            }
                                        </Carousel>
                                    </div>
                                }
                            </div>
                            <span>监理单位</span>
                            <Input style={InputStyle} value={jyp.extra_params.jianliCompany || ''} />
                            <span>监理工程师</span>
                            <Input style={InputStyle} value={this.state.jianli || ''} />    
                            <WorkflowHistory wk={this.props.wk}/>           
                        </Card>
                    </div>
                </Modal>
                <Preview />
            </div>
        );
    }
}

const InputStyle = {
    width:'200px',
    margin:'10px'
}