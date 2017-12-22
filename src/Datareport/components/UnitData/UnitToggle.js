// import React, {Component} from 'react';
// import {connect} from 'react-redux';
// import {bindActionCreators} from 'redux';
// import {actions as platformActions} from '_platform/store/global';
// import {actions} from '../../store/quality';
// import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,message} from 'antd';
// import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
// import WorkflowHistory from '../WorkflowHistory'
// import Preview from '../../../_platform/components/layout/Preview';
// import {getUser} from '_platform/auth';
// const {RangePicker} = DatePicker;
// const RadioGroup = Radio.Group;
// const {Option} = Select
// @connect(
// 	state => {
// 		const { platform} = state;
// 		return { platform}
// 	},
// 	dispatch => ({
// 		actions: bindActionCreators({ ...actions,...platformActions}, dispatch)
// 	})
// )
// export default class UnitToggle extends Component {

// 	constructor(props) {
// 		super(props);
// 		this.state = {
//             wk:null,
//             dataSource:[],
//             opinion:1,//1表示通过 2表示不通过
// 		};
//     }
//     async componentDidMount(){
//         const {wk} = this.props
//         //  const {actions:{ getWorkflow }} = this.props
//         //  getWorkflow({pk:wk.id}).then(rst => {
//         //      let dataSource = JSON.parse(rst.subject[0].data)
//         //      this.setState({dataSource,wk:rst})
//         //  })
//         let dataSource = JSON.parse(wk.subject[0].data)
//         this.setState({dataSource,wk})
//     }

//     componentWillReceiveProps(props){
//         const {wk} = props
//         let dataSource = JSON.parse(wk.subject[0].data)
//         this.setState({dataSource,wk})
//    }
//    //提交
//     async submit(){
//         if(this.state.opinion === 1){
//             await this.passon();
//         }else{
//             await this.reject();
//         }
//         this.props.closeModal("dr_qua_jyp_visible",false)
//         message.info("操作成功")
//     }
//     //通过
//     async passon(){
//         const {dataSource,wk} = this.state
//         const {actions:{logWorkflowEvent,updateWpData,addDocList,putDocList}} = this.props
//         let executo
//         r = {};
//         let person = getUser();
//         executor.id = person.id;
//         executor.username = person.username;
//         executor.person_name = person.name;
//         executor.person_code = person.code;
//         await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor:executor,attachment:null});
//         let doclist_a = [];
//         let doclist_p = [];
//         let wplist = [];
//         dataSource.map((o) => {
//             //创建文档对象
//             console.log(o)
//             let doc = o.related_documents.find(x => {
//                 return x.rel_type === 'many_jyp_rel'
//             })
//             if(doc){
//                 doclist_p.push({
//                     code:doc.code,
//                     extra_params:{
//                         ...o
//                     }
//                 })
//             }else{
//                 doclist_a.push({
//                     code:`rel_doc_${o.code}`,
//                     name:`rel_doc_${o.pk}`,
//                     obj_type:"C_DOC",
//                     status:"A",
//                     version:"A",
//                     "basic_params": {
//                         "files": [
//                             o.file
//                         ]
//                     },
//                     workpackages:[{
//                         code:o.code,
//                         obj_type:o.obj_type,
//                         pk:o.pk,
//                         rel_type:"many_jyp_rel"
//                     }],
//                     extra_params:{
//                         ...o
//                     }
//                 })
//             }
//             //施工包批量
//             wplist.push({
//                 code:o.code,
//                 extra_params:{
//                     rate:o.rate,
//                     check_status:2
//                 }
//             })
//         })
//         await addDocList({},{data_list:doclist_a});
//         await putDocList({},{data_list:doclist_p})
//         await updateWpData({},{data_list:wplist});
//     }
//     //不通过
//     async reject(){
//         const {wk} = this.props
//         const {actions:{deleteWorkflow}} = this.props
//         await deleteWorkflow({pk:wk.id})
//         // let executor = {};
//         // let person = getUser();
//         // executor.id = person.id;
//         // executor.username = person.username;
//         // executor.person_name = person.name;
//         // executor.person_code = person.code;
//         // await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'退回',note:'滚',executor:executor,attachment:null});
//     }
//     //预览
//     handlePreview(index){
//         const {actions: {openPreview}} = this.props;
//         let f = this.state.dataSource[index].file
//         let filed = {}
//         filed.misc = f.misc;
//         filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
//         filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
//         filed.name = f.name;
//         filed.mime_type = f.mime_type;
//         openPreview(filed);
//     }
//     handlePreview(index){
//         const {actions: {openPreview}} = this.props;
//         let f = this.state.dataSource[index].file
//         let filed = {}
//         filed.misc = f.misc;
//         filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
//         filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
//         filed.name = f.name;
//         filed.mime_type = f.mime_type;
//         openPreview(filed);
//     }
//     //radio变化
//     onChange(e){
//         this.setState({opinion:e.target.value})
//     }
// 	render() {
//         const  columns = [{
//             title: '序号',
//             dataIndex: 'index',
//             // key: 'Index',
//           }, {
//             title: '单位工程名称',
//             dataIndex: 'code',
//             // key: 'Code',
//           }, {
//             title: '所属项目/子项目名称',
//             dataIndex: 'genus',
//             key: 'Genus',
//           },{
//             title: '项目类型',
//             dataIndex: 'area',
//             // key: 'Area',
//           },{
//              title: '项目阶段',
//              dataIndex :'type',
//             //  key: 'Type',
//           },{
//             title: '项目红线坐标',
//             dataIndex :'address',
//             // key: 'Address',
//           },{
//             title: '计划开工日期',
//             dataIndex :'coordinate',
//             // key: 'Coordinate',
//           },{
//             title: '计划竣工日期',
//             dataIndex :'duty',
//             // key:'Duty'
//           },{
//             title: '建设单位',
//             dataIndex :'stime',
//             // key:'Stime'
//           },{
//             title: '单位工程简介',
//             dataIndex :'etime',
//             // key:'Etime'
//           },{
//             title:'附件',
//             key:'nearby',
//             render:(record) => (
//               <Upload
//               beforeUpload = {this.beforeUpload.bind(this,record)}
//               >
//                   <a> {record.file?record.file.name:'上传附件'}</a>
//               </Upload>
//             )
      
//           }]
// 		return (
//             <Modal
// 			title="检验批信息审批表"
// 			key={Math.random()}
//             visible={true}
//             width= {1280}
// 			footer={null}
// 			maskClosable={false}>
//                 <div>
//                     <h1 style ={{textAlign:'center',marginBottom:20}}>结果审核</h1>
//                     <Table style={{ marginTop: '10px', marginBottom:'10px' }}
//                         columns={this.columns}
//                         dataSource={this.state.dataSource}
//                         bordered />
//                     <Row>
//                         <Col span={2}>
//                             <span>审查意见：</span>
//                         </Col>
//                         <Col span={4}>
//                             <RadioGroup onChange={this.onChange.bind(this)} value={this.state.opinion}>
//                                 <Radio value={1}>通过</Radio>
//                                 <Radio value={2}>不通过</Radio>
//                             </RadioGroup>
//                         </Col>
//                         <Col span={2} push={14}>
//                             <Button type='primary'>
//                                 导出表格
//                             </Button>
//                         </Col>
//                         <Col span={2} push={14}>
//                             <Button type='primary' onClick={this.submit.bind(this)}>
//                                 确认提交
//                             </Button>
//                             <Preview />
//                         </Col>
//                     </Row>
//                     {
//                         this.state.wk && <WorkflowHistory wk={this.state.wk}/>
//                     }
//                 </div>
//             </Modal>
// 		)
//     }


// }

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../../store/UnitData';
import {actions as actions2} from '../../store/quality';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,message} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory'
import Preview from '../../../_platform/components/layout/Preview';
import {getUser} from '_platform/auth';

const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option
@connect(
	state => {
		const { platform} = state;
		return { platform}
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions,...platformActions,...actions2}, dispatch)
	})
)
export default class UnitToggle extends Component {

	constructor(props) {
		super(props);
		this.state = {
            wk:null,
            dataSource:[],
            opinion:1,//1表示通过 2表示不通过
		};
    }
    async componentDidMount(){
        const {wk} = this.props;
        console.log(wk);
        let dataSource = JSON.parse(wk.subject[0].data)
        console.log(dataSource)
        this.setState({dataSource,wk})
    }
    componentWillReceiveProps(props){
        const {wk} = props
        let dataSource = JSON.parse(wk.subject[0].data)
        this.setState({dataSource,wk})
   }
   //提交
    async submit(){
        if(this.state.opinion === 1){
            await this.passon();
        }else{
            await this.reject();
        }
        this.props.closeModal("dr_base_unit_visible",false)
        message.info("操作成功")
    }
    //通过
    async passon(){
        const {dataSource,wk} = this.state
        console.log("dataSource",dataSource);
        console.log("wk",wk);
        const {actions:{logWorkflowEvent,updateWpData,addDocList,putDocList,postOrgList,getOrgRoot}} = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor:executor,attachment:null});
        let doclist_a = [];
        let doclist_p = [];
        let wplist = [];
        console.log("dataSource",dataSource);
        let data_list = [];
        // getOrgRoot().then(rst => {
        //     console.log("rst:",rst);
            dataSource.map((o) => {
                console.log(o)
                data_list.push({
                    code:"" + o.code,
                    name: o.name,
                    obj_type: "C-WP_CEL",
                    status: "A",
                    version: "A",
                    extra_params: {
                        coordinate:o.coordinate
                    },
                    basic_params:{
                        nearby:o.nearby
                    },
                    parent:{
                        code:"ORG_ROOT",
                        pk:"403050400306",
                        obj_type:"C_ORG"
                    }
                })
            })
            const {actions:{postUnitRoot}} = this.props;
            postUnitRoot({},{data_list:data_list}).then(res => {
                console.log(res)
                    message.success("审核成功");
            });
        // })
    }
    beforeUpload(record,file){
        console.log(record,file);
        const fileName = file.name;
		// 上传到静态服务器
		const { actions:{uploadStaticFile} } = this.props;
		const formdata = new FormData();
		formdata.append('a_file', file);
        formdata.append('name', fileName);
        let myHeaders = new Headers();
        let myInit = { method: 'POST',
                       headers: myHeaders,
                       body: formdata
                     };
                     //uploadStaticFile({}, formdata)
        fetch(`${FILE_API}/api/user/files/`,myInit).then(async resp => {
            let loadedFile = await resp.json();
            loadedFile.a_file = this.covertURLRelative(loadedFile.a_file);
            loadedFile.download_url = this.covertURLRelative(loadedFile.download_url);
            record.file = loadedFile;
            record.code = file.name.substring(0,file.name.lastIndexOf('.'));
            this.forceUpdate();
        });
        return false;
    }
    //不通过
    async reject(){
        const {wk} = this.props
        const {actions:{deleteWorkflow}} = this.props
        await deleteWorkflow({pk:wk.id})
    }
    //预览
    handlePreview(index){
        const {actions: {openPreview}} = this.props;
        let f = this.state.dataSource[index].file
        let filed = {}
        filed.misc = f.misc;
        filed.a_file = `${SOURCE_API}` + (f.a_file).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.download_url = `${STATIC_DOWNLOAD_API}` + (f.download_url).replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
        filed.name = f.name;
        filed.mime_type = f.mime_type;
        openPreview(filed);
    }
    //radio变化
    onChange(e){
        this.setState({opinion:e.target.value})
    }
    beforeUpload(record,file){
        console.log(record,file);
        const fileName = file.name;
		// 上传到静态服务器
		const { actions:{uploadStaticFile} } = this.props;
		const formdata = new FormData();
		formdata.append('a_file', file);
        formdata.append('name', fileName);
        let myHeaders = new Headers();
        let myInit = { method: 'POST',
                       headers: myHeaders,
                       body: formdata
                     };
                     //uploadStaticFile({}, formdata)
        fetch(`${FILE_API}/api/user/files/`,myInit).then(async resp => {
            let loadedFile = await resp.json();
            loadedFile.a_file = this.covertURLRelative(loadedFile.a_file);
            loadedFile.download_url = this.covertURLRelative(loadedFile.download_url);
            record.file = loadedFile;
            record.code = file.name.substring(0,file.name.lastIndexOf('.'));
            this.forceUpdate();
        });
        return false;
    }
	render() {
     const  columns = [{
        title: '序号',
        dataIndex: 'index',
      }, {
        title: '单位工程名称',
        dataIndex: 'unitName',
      }, {
        title: '所属项目/子项目名称',
        dataIndex: 'subItem',
      },{
        title: '项目类型',
        dataIndex: 'projectType',
        render:(record)=>{
            return(
            <Select style={{ width: '70px' }} onSelect={ele => {
                // record.projType = ele;
                this.forceUpdate();
            }} >
                <Option value = 'construct'>建筑</Option>
                <Option value = 'city'>市政</Option>
            </Select>)
        },
      },{
         title: '项目阶段',
         dataIndex :'projectPhase',
         render:(record)=>{
            return(
            <Select style={{ width: '70px' }} onSelect={ele => {
                // record.projType = ele;
                this.forceUpdate();
            }} >
                <Option value = 'construct'>初涉阶段</Option>
                <Option value = 'city'>施工图阶段</Option>
                <Option value = 'city'>竣工阶段</Option>
            </Select>)
        },
      },{
        title: '项目红线坐标',
        dataIndex :'coordinate',
      },{
        title: '计划开工日期',
        dataIndex :'planStartDate',
      },{
        title: '计划竣工日期',
        dataIndex :'planCompletionDate',
      },{
        title: '建设单位',
        dataIndex :'constructionUnit',
      },{
        title: '单位工程简介',
        dataIndex :'brief',
      },{
        title:'附件',
        dataIndex :'nearby',        
        render:(record) => (
          <Upload
          beforeUpload = {this.beforeUpload.bind(this,record)}
          >
              <a> {record.file?record.file.name:'上传附件'}</a>
          </Upload>
        )
  
      }]
		return (
            <Modal
			title="单位工程信息审批表"
			key={Math.random()}
            visible={true}
            width= {1280}
			footer={null}
			maskClosable={false}>
                <div>
                    <h1 style ={{textAlign:'center',marginBottom:20}}>结果审核</h1>
                    <Table style={{ marginTop: '10px', marginBottom:'10px' }}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered />
                    <Row>
                        <Col span={2}>
                            <span>审查意见：</span>
                        </Col>
                        <Col span={4}>
                            <RadioGroup onChange={this.onChange.bind(this)} value={this.state.opinion}>
                                <Radio value={1}>通过</Radio>
                                <Radio value={2}>不通过</Radio>
                            </RadioGroup>
                        </Col>
                        <Col span={2} push={14}>
                            <Button type='primary'>
                                导出表格
                            </Button>
                        </Col>
                        <Col span={2} push={14}>
                            <Button type='primary' onClick={this.submit.bind(this)}>
                                确认提交
                            </Button>
                            <Preview />
                        </Col>
                    </Row>
                    {
                        this.state.wk && <WorkflowHistory wk={this.state.wk}/>
                    }
                </div>
            </Modal>
		)
    }
}
