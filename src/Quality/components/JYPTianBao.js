import React, {Component} from 'react'; 
import PropTypes from 'prop-types';
import { message, Select, Table, Input, Button, Radio ,Spin,Modal,Upload,Carousel,Card} from 'antd';
import { connect } from 'react-redux';
import {actions as hyjactions} from '../store/subitem';
import { bindActionCreators } from 'redux';
import {actions as actions2} from '../store/cells';
import * as previewActions from '_platform/store/global/preview';
import Preview from '_platform/components/layout/Preview';
import {STATIC_DOWNLOAD_API,USER_API, SERVICE_API, WORKFLOW_API,JYPMOD_API,UPLOADFILE_API,DOWNLOAD_FILE,PDF_FILE_API} from '_platform/api';
import {getUser} from '_platform/auth'
@connect(
    state => {
            return {wholeStore:state};
    },
    dispatch => ({
        actions: bindActionCreators({...previewActions,...hyjactions}, dispatch),
        cellActions: bindActionCreators({...actions2}, dispatch),
    }),
)
export  class JYPTianBao2 extends Component {
    constructor(props){
        super(props);
        this.state = {
            imgList:[],
            fileList:[],
            allUsers:[],
            jianli:null,
            jianliCompany:null,
            peoples:null,
           // workUnitOptions:[]
        }
    }
    componentWillReceiveProps(props){//不会无限刷
        console.log('willup',props);
        if(!props.tianbaoing){
            this.setState({fileList:[]});
        }
    }
    componentDidMount(){
        console.log('fenbu',this.props.targetFenbu)
        let {getAllUsers} = this.props;
        getAllUsers().then(rst=>{
            this.setState({allUsers:rst});
        });
        let {getOrgTree} = this.props.cellActions;
        getOrgTree().then(rst=>{
            let set = {};
            rst.children.forEach(group=>{
                set[group.name] = group.children?group.children:[];
            });
            // console.log('set',set);
            this.setState({orgs:set});
           // console.log(set);
        });
    }
    generateLoc(){
        console.log('LOC',this.props.targetFenbu.children)
        let locs =this.props.targetFenbu.children.filter(ele=>{
           return ele.obj_type === 'C_WP_LOC';
        });
        console.log('LOC',arr)
        let arr =  locs.map(ele=>{
            return(<Select.Option value = {JSON.stringify(ele)}>{ele.name}</Select.Option>)
        })
        return arr;
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
        // console.log(this.state)
    }
    beforeUpload(file){
      //  console.log(file);
        let fname = file.name;
        /*if(/.+?\.pdf/.test(fname) || /.+?\.docx/.test(fname) || /.+?\.doc/.test(fname)|| /.+?\.xlsx/.test(fname)|| /.+?\.xls/.test(fname)|| /.+?\.png/.test(fname)|| /.+?\.jpg/.test(fname)|| /.+?\.bmp/.test(fname)|| /.+?\.txt/.test(fname)){

        }else{
            message.error('请上传pdf或者office文件或常见格式的图片或txt文件');
            return false;
        }*/
        let {postFile} = this.props;
        const formdata = new FormData();
        formdata.append('a_file',file);
        formdata.append('name',file.name);
        //debugger;
       // console.log(file,formdata.get('a_file'));
        postFile({},formdata).then(rst=>{
         //   console.log(rst);
            if(rst.id){
                message.success('上传成功');
                let {fileList} = this.state;
                fileList.push(rst);
                this.setState({fileList});
            }else{
                message.error('上传失败');
            }
        });
        return false;
    }
    beforeUpload2(file){
        //  console.log(file);
          let fname = file.name.toLowerCase();
          if(/.+?\.png/.test(fname) || /.+?\.jpg/.test(fname) || /.+?\.bmp/.test(fname) ){
  
          }else{
              message.error('请上传png、bmp或jpg');
              return false;
          }
          let {postFile} = this.props;
          const formdata = new FormData();
          formdata.append('a_file',file);
          formdata.append('name',file.name);
          //debugger;
         // console.log(file,formdata.get('a_file'));
          postFile({},formdata).then(rst=>{
           //   console.log(rst);
              if(rst.id){
                  message.success('上传成功');
                  let {imgList} = this.state;
                  imgList.push(rst);
                  this.setState({imgList:imgList});
              }else{
                  message.error('上传失败');
              }
          });
          return false;
      }
    ok(){
        if(!this.state.jianli){
            message.info("请选择监理工程师");
            return;
        }
        if(!this.state.jianliCompany){
            message.info("请选择监理单位");
            return;
        }
        if(!this.state.qualifiedCounts){
            message.info("请填写合格数");
            return;
        }
        if(!this.state.totalCounts){
            message.info("请填写检验数");
            return;
        }
        if(!this.state.remark){
            message.info("请填写备注");
            return;
        }
        this.props.setData(this.state);
    }
    generateAllUsers2(filter){
        filter = '监理'
        let arr = [];
        this.state.allUsers.forEach((user, index) => {
            let have = false;
            let groups = user.groups;
            console.log(groups);
            if (groups) {
                groups.forEach(ele => {
                    if (ele.name.indexOf(filter) >= 0) {
                        have = true;
                    }
                });
            }
            if (!have) {
                return;
            }
            if (user.account.person_name) {
                arr.push(<Select.Option key={index} value={JSON.stringify(user)}>{user.account.person_name}</Select.Option>);
            }
        });
        return arr;
    }
    selectUser(userstr) {
        let jianli = JSON.parse(userstr);
        this.setState({ jianli: jianli });
    }
    generateImgs() {
    }
    previewDoc(index) {
        let { openPreview } = this.props.actions;
        let file = this.state.fileList[index];
        let fname = file.name;
        if (/.+?\.pdf/.test(fname) || /.+?\.docx/.test(fname) || /.+?\.doc/.test(fname)) {
            file.a_file = file.a_file.replace(/^http(s)?:\/\/[\w\-\.:]+/, '')
            file.a_file = PDF_FILE_API + file.a_file;
            openPreview(file);
        } else {
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
        console.log('props',this.props)
        let orgs = this.state.orgs;
        let fileName = '暂无文件';
        let { fileList } = this.state;
        let { imgList } = this.state;
        let jyp = this.props.tianbaojianyanpi;
        let [qc,tc] = [+this.state.qualifiedCounts,+this.state.totalCounts];
        let rate = 0 ;
        try {
            rate =Number.parseInt((qc/ tc)*100) +'%'
        }catch(e){
            rate = '0'
        }
        return (
            !jyp ? <div /> : <div>
                <Modal
                    width={880}
                    okText='申请审批'
                    onOk={this.ok.bind(this)}
                    onCancel={this.props.cancel}
                    visible={this.props.tianbaoing}>
                    <div style={{ width: '800px' }}>
                        <Card style={{ width: '800px' }} title={this.props.tianbaojianyanpi.name + '验收表'}>
                            <Input addonBefore='工程名称' value={jyp.extra_params.XiangMu} style={InputStyle} />
                            <Input addonBefore='单位名称' value={jyp.extra_params.DanWei} style={InputStyle} />
                            <Input addonBefore='分部名称' value={jyp.extra_params.FenBu} style={InputStyle} />
                            <Input addonBefore='分项名称' value={jyp.extra_params.FenXiang} style={InputStyle} />
                            <Select placeholder = '工程部位'
                            onChange = {this.setField.bind(this,'location')}
                            style={InputStyle} >
                            {this.generateLoc()}
                            </Select>
                            <Input addonBefore='质检员' value = {this.props.userData.name}  style={InputStyle} />
                        </Card>

                        <Card style={{ width: '800px' }} title={'合格率信息'}>
                            <Input addonBefore='合格数' onChange = {this.setField.bind(this,'qualifiedCounts')} style={InputStyle} />
                            <Input addonBefore='检验数' onChange = {this.setField.bind(this,'totalCounts')}  style={InputStyle} />
                            <Input addonBefore='合格率' value = {rate}  style={InputStyle} />
                        </Card>
                        {
                            // jyp.extra_params.img &&
                            // <div style={{ marginBottom: '10px' }}>
                            //     <Carousel autoplay>
                            //         {
                            //             jyp.extra_params.img.map(x => (
                            //                 <div className="picDiv">
                            //                     <img className="picImg" src={`${STATIC_DOWNLOAD_API}${x}`} alt="" />
                            //                 </div>
                            //                 ))
                            //             }
                            //         </Carousel>
                            //     </div>
                        }
                        <Card style={{ width: '800px' }} title={'备注'}>
                            <Input size='large' addonBefore='备注'  onChange = {this.setField.bind(this,'remark')} style={{ width: '46%', margin: '10px' }} />
                            <div>
                                <Upload
                                    style={{ margin: '10px' }}
                                    showUploadList={true}
                                    action={this.props.fileUpLoadAddress}
                                    beforeUpload={this.beforeUpload.bind(this)}
                                >
                                    <Button style={{ marginRight: '10px' }}>上传附件</Button>
                                </Upload>
                                {
                                    fileList.map((item, index) => {
                                        return (<div><a style={{ margin: '10px' }} href={item.download_url}>{item.name}</a>
                                            <span style={{ marginLeft: '20px', color: 'red', cursor: 'pointer' }}
                                                onClick={() => {
                                                    const { deleteStaticFile } = this.props.cellActions;
                                                    deleteStaticFile({ id: fileList[index].id });
                                                    fileList.splice(index, 1);
                                                    this.setState({ fileList });
                                                }}
                                            >x</span>
                                           
                                        </div>)
                                    })
                                }
                                <Upload
                                    style={{ margin: '10px' }}
                                    showUploadList={true}
                                    action={this.props.fileUpLoadAddress}
                                    beforeUpload={this.beforeUpload2.bind(this)}
                                >
                                    <Button style={{ marginRight: '10px', marginTop: '10px' }}>上传图片</Button>
                                </Upload>
                                {
                                    this.state.imgList.length > 0 && <div style={{ width: '90%', height: '150px', overflow: 'hidden', overflowY: 'scroll' }}>
                                        {
                                            this.state.imgList.map((aimg, index) => {
                                                console.log(aimg);
                                                return (
                                                    <div style={{ position: 'relative', height: '140px', width: '140px', display: 'inline-block' }}>
                                                        <span style={{
                                                            marginLeft: '20px', color: 'red', cursor: 'pointer',
                                                            position: 'absolute', top: '0', right: '0'
                                                        }}
                                                            onClick={() => {
                                                                const { deleteStaticFile } = this.props.cellActions;
                                                                deleteStaticFile({ id: imgList[index].id });
                                                                imgList.splice(index, 1);
                                                                this.setState({ imgList });
                                                            }}
                                                        >x</span>
                                                        <img
                                                            onClick={(e, index) => {
                                                                console.log(aimg);
                                                                let downliad_iframe = document.createElement('iframe');
                                                                downliad_iframe.src = aimg.download_url;
                                                                downliad_iframe.style.display = 'none';
                                                                document.getElementById('root').appendChild(downliad_iframe);
                                                                downliad_iframe.onload = () => {
                                                                    downliad_iframe.parentElement.removeChild(downliad_iframe);
                                                                }
                                                            }}
                                                            style={{ cursor: 'pointer', height: '140px', width: '140px' }} src={aimg.a_file} />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                }
                            </div>
                            <span>监理单位</span>
                            <Select
                                onChange = {this.setField.bind(this,'jianliCompany')}
                                style={{ width: '200px', margin: '10px' }}
                                onSelect={this.selectChange.bind(this)}>
                                {/*orgs && orgs['监理单位'].map(ele => {
                                    return <Select.Option value={ele.name}>{ele.name}</Select.Option>
                                })*/
                                    this.props.targetDanwei && 
                                    this.selectRender(this.props.targetDanwei.extra_params.unit,"监理单位")
                                }
                            </Select>
                            <span>监理工程师</span>
                            <Select
                                style={{ margin: '10px', width: '100px' }}
                                onChange = {this.setField.bind(this,'jianli')}
                            >
                                {//this.generateAllUsers2()
                                    this.state.peoples &&
                                    this.peopleRender(this.state.peoples,"监理")
                                }
                            </Select>
                        </Card>
                    </div>
                </Modal>
                <Preview />
            </div>
        );
    }
    async selectChange (value){
        let peoples = await this.getAllUsersByOrgcode(value)
        this.setState({peoples})
    }
    //获取某个单位下的所有人员，包括其一级zi子单位
    getAllUsersByOrgcode = async(orgcode) => {
        const {getOrgTreeByCode,fetchUsersByOrgCode} = this.props.cellActions
        let org_code = orgcode
        let rst = await getOrgTreeByCode({code:orgcode});
        rst.children.map((item) => {
            org_code += `,${item.code}`        
        })
        let res = await fetchUsersByOrgCode({org_code:org_code})
        return res;
    }

    //渲染组织机构
    selectRender = (data,type) => {
        let nodes = []
        data.filter(item => item.type === type).map(o => {
            nodes.push(<Select.Option key={o.code}>{o.name}</Select.Option>)
        })
        return nodes
    }

    peopleRender = (data,type) => {
        let arr = [];
        data.forEach((user, index) => {
            let have = false;
            let groups = user.groups;
            console.log(groups);
            if (groups) {
                groups.forEach(ele => {
                    if (ele.name.indexOf(type) >= 0) {
                        have = true;
                    }
                });
            }
            if (!have) {
                return;
            }
            if (user.account.person_name) {
                arr.push(<Select.Option key={index} value={JSON.stringify(user)}>{user.account.person_name}</Select.Option>);
            }
        });
        return arr;
    }
}

const InputStyle = {
    width: '30%',
    margin: '10px'
}