import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../../store/orgdata';
import {actions as actions2} from '../../store/quality';
import {Input,Col, Card,Table,Row,Button,DatePicker,Radio,Select,Popconfirm,Modal,Upload,Icon,notification} from 'antd';
import {UPLOAD_API,SERVICE_API,FILE_API,STATIC_DOWNLOAD_API,SOURCE_API } from '_platform/api';
import WorkflowHistory from '../WorkflowHistory'
import Preview from '../../../_platform/components/layout/Preview';
import {getUser} from '_platform/auth';
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {Option} = Select
@connect(
	state => {
		const { platform} = state;
		return { platform}
	},
	dispatch => ({
		actions: bindActionCreators({ ...actions,...platformActions,...actions2}, dispatch)
	})
)
export default class OrgCheck extends Component {

	constructor(props) {
		super(props);
		this.state = {
            wk:null,
            dataSource:[],
            
            opinion:1,//1表示通过 2表示不通过
		};
    }
    async componentDidMount(){
        const {wk} = this.props
        let dataSource = JSON.parse(wk.subject[0].data)
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
        this.props.closeModal("dr_base_org_visible",false,"submit")
        notification.success({
            message:"操作成功"
        })
    }
    //通过
    async passon(){
        const {dataSource,wk} = this.state
        const {actions:{logWorkflowEvent, updateWpData, addDocList, putDocList, postOrgList, getOrgRoot, putUnit, putProject, getProject, getUnitAc, getUnit, getOrgPk}} = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        let doclist_a = [];
        let doclist_p = [];
        let wplist = [];
        let data_list = [];
        let promises = dataSource.map((o) => {
            return getOrgPk({code:o.direct})
        });
        let rst = await Promise.all(promises);
        dataSource.map((o, index) => {
            data_list.push({
                code: "" + o.code,
                name: o.depart,
                obj_type: "C_ORG",
                status: "A",
                version: "A",
                extra_params: {
                    org_type: o.type,
                    canjian: o.canjian,
                    direct: o.direct,
                    project: o.selectPro,
                    unit: o.selectUnit,
                    remarks: o.remarks
                },
                parent: {
                    code: ""+o.direct,
                    pk: rst[index].pk,
                    obj_type: "C_ORG"
                }
            })
        })
        await postOrgList({}, { data_list: data_list }).then(res => {
            dataSource.map((item, index) => {
                if (item.selectPro.length !== 0) {
                    item.selectPro.map(it => {
                        let proCode = it.split("--")[0];
                        // 取出项目中所的orgs
                        getProject({code:proCode}).then(rstPro => {
                            let pro_orgs = rstPro.response_orgs;
                            let pk = res.result[index].pk
                            pro_orgs.push({
                                code:""+item.code,
                                obj_type:"C_ORG",
                                pk:pk
                            });
                            putProject({ code: proCode }, {
                                version: "A",
                                response_orgs: pro_orgs
                            }).then(rst => {
                            }) 
                        });
                    }) 
                }
                if (item.selectUnit.length !== 0) {
                    item.selectUnit.map(it => {
                        let unitCode = it.split("--")[0];
                        getUnitAc({code:unitCode}).then(rstUnit => {
                            let unit_orgs = rstUnit.response_orgs;
                            let pk = res.result[index].pk
                            unit_orgs.push({
                                code:""+item.code,
                                obj_type:"C_ORG",
                                pk:pk
                            });
                            putUnit({ code: unitCode }, {
                                version: "A",
                                response_orgs: unit_orgs
                            }).then(rst => {
                            }) 
                        })
                    })
                }
            })
        });
        await logWorkflowEvent({pk:wk.id},{state:wk.current[0].id,action:'通过',note:'同意',executor:executor,attachment:null});
    }
    //不通过
    async reject(){
        const {wk} = this.props
        const {actions:{logWorkflowEvent}} = this.props
        let executor = {};
        let person = getUser();
        executor.id = person.id;
        executor.username = person.username;
        executor.person_name = person.name;
        executor.person_code = person.code;
        await logWorkflowEvent(
            {
                pk:wk.id
            }, {
                state: wk.current[0].id,
                executor: executor,
                action: '拒绝',
                note: '不通过',
                attachment: null,
            }
        );
        notification.success({
            message: "操作成功",
            duration: 2
        })
    };

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
	render() {
        const  columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'Index',
        }, {
            title: '组织机构编码',
            dataIndex: 'code',
            key: 'Code',
        }, {
            title: '组织机构类型',
            dataIndex: 'type',
            key: 'Type',
        }, {
            title: '参建单位名称',
            dataIndex: 'canjian',
            key: 'Canjian',
        }, {
            title: '组织机构部门',
            dataIndex: 'depart',
            key: 'depart',
        }, {
            title: '直属部门',
            dataIndex: 'direct',
            key: 'Direct',
        }, {
            title: '负责项目/子项目名称',
            render:(text, record, index) => {
                let nodes = [];
                if (record.selectPro) {
                    record.selectPro.map(item => {
                        nodes.push(<p>{item}</p>);
                    })
                }
                return nodes;
            }
        }, {
            title: '负责单位工程名称',
            render:(text, record, index) => {
                let nodes = [];
                if (record.selectUnit) {
                    record.selectUnit.map(item => {
                        nodes.push(<p>{item}</p>);
                    })
                }
                return nodes;
            }
        }, {
            title: '备注',
            dataIndex: 'remarks',
            key: 'Remarks'
        }]
		return (
            <Modal
            visible={true}
            okText = "确定"
            cancelText = "取消"
            onOk = {this.submit.bind(this)}
            width= {1280}
            onCancel = {this.props.closeModal.bind(this,"dr_base_org_visible",false)}
			maskClosable={false}>
                <div>
                    <h1 style ={{textAlign:'center',marginBottom:20}}>新增部门审核</h1>
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
                    </Row>
                    {
                        this.state.wk && <WorkflowHistory wk={this.state.wk}/>
                    }
                </div>
            </Modal>
		)
    }
}
