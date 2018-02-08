import React, { Component } from 'react';
import { Modal, Input, Form, Button, Notification, Table, Radio, Row, Col, Select } from 'antd';
import { CODE_PROJECT } from '_platform/api';
import '../index.less'; 
import {getUser} from '_platform/auth';
import {getNextStates} from '_platform/components/Progress/util';
import {WORKFLOW_CODE} from '_platform/api'
import {flattenDeep} from 'lodash';
const RadioGroup = Radio.Group;
const { TextArea } = Input;
var moment = require('moment');

export default class PersonModify extends Component {
	constructor(props){
        super(props);
        this.state = {
            dataSource: [],
            users: [],
            projects: [],
            checkers: [],
            defaultPro: "",
            defaultchecker: "",
            units:[],
            selectPro:[],
            selectUnit:[],
            subErr: true,
            description: '',
        }
    }

    componentDidMount(){
        const {Modvisible, modifyPer, actions:{getAllUsers, getProjects}} = this.props;

        this.setState({
            dataSource:[modifyPer]
        })
        
    }

	render() {
		const {Modvisible, actions: {getOrgReverse}} = this.props;
		const columns = [{
			title: '序号',
			dataIndex: 'index',
			key: 'Index',
		}, {
			title: '人员编码',
			dataIndex: 'code',
			key: 'Code',
		}, {
			title: '姓名',
			dataIndex: 'name',
			key: 'Name',
			render:(text, record, index) =>{
	            return <Input value = {record.name || ""} onChange={ele => {
	                record.name = ele.target.value
	                this.forceUpdate();
	            }}/>
	        }
		}, {
			title: '所在组织机构单位',
			// dataIndex: 'type',
            // key: 'Org',
            render:(text, record, index) =>{
                if(record.type !== '') {
                    return (<span>{record.type}</span>)
                }else {
                    return (<span>暂无</span>)
                }
            }
		}, {
			title: '所属部门',
			dataIndex: 'orgcode',
            key: 'Depart',
            width:"15%",
            
            render:(test,record,index) => {
                if (record.type === "") {
                    return <Input
                    style={{ color: 'red' }}
                    value={record.orgcode || ""}
                    onChange={this.tableDataChange.bind(this, record,index)}
                    // onBlur={this.fixOrg.bind(this, index)}
                />
                }else{
                    return <Input
                    value={record.orgcode || ""}
                    onChange={this.tableDataChange.bind(this, record, index)}
                    // onBlur={this.fixOrg.bind(this, index)}
                />
                }
            }
		}, {
			title: '职务',
			dataIndex: 'job',
			key: 'Job',
			render:(text, record, index) =>{
	            return <Input value = {record.job || ""} onChange={ele => {
	                record.job = ele.target.value
	                this.forceUpdate();
	            }}/>
	        }
		}, {
			title: '性别',
			dataIndex: 'sexr',
			key: 'Sex',
			render:(text, record, index) =>{
	            return <Select style={{width: 42}} value = {record.sex} onChange={ele => {
	                record.sex = ele
	                this.forceUpdate();
	            }}>
	            	<Option value="男">男</Option>
	            	<Option value="女">女</Option>
	            </Select>
	        }
		}, {
			title: '手机号码',
			dataIndex: 'tel',
			key: 'Tel',
			render:(text, record, index) =>{
	            return <Input type='number' value = {record.tel || ""} onChange={ele => {
	                record.tel = ele.target.value
	                this.forceUpdate();
	            }}/>
	        }
		}, {
			title: '邮箱',
			dataIndex: 'email',
			key: 'Email',
			render:(text, record, index) =>{
	            return <Input value = {record.email || ""} onChange={ele => {
	                record.email = ele.target.value
	                this.forceUpdate();
	            }}/>
	        }
        }
        // , {
		// 	title: '二维码',
		// 	// dataIndex: 'signature',
		// 	// key: 'Signature',
		// 	render:(record) => {
	    //         if(record.signature.indexOf("document") !== -1) {
        //             return <img style={{width: 60}} src={record.signature}/>
        //         }else {
        //             return <span>暂无</span>
        //         }
	    //     }
        // }
        , {
            title: '是否为用户',
            render:(record) => {
                if (record.is_user) {
                    return (<span>是</span>)
                }else{
                    return (<span>否</span>)
                }
            }
		}]
		
		return (
            <Modal
                onCancel={this.cancel.bind(this)}
                visible={Modvisible}
                width={1280}
                onOk={this.onok.bind(this)}
            >
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>申请变更</h1>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={this.state.dataSource}
                />
                {/* <span>
                    审核人：
                    <Select style={{ width: '200px' }} className="btn" onSelect={ele => {
                        this.setState({ passer: JSON.parse(ele) })
                    }} >
                        {
                            this.state.checkers || []
                        }
                    </Select>

                </span>
		    	<TextArea rows={2} style={{margin: '10px 0'}} onChange={this.description.bind(this)} placeholder='请输入变更原因'/> */}
            </Modal>
        )
	}

	description(e) {
		this.setState({description:e.target.value})
	}

	onChange = (e) => {
	    this.setState({
	    	value: e.target.value,
	    });
	}

   async onok(id) {
        if (this.state.dataSource[0].type === "") {
            Notification.warning({
                message:"该部门不存在！！"
            })
            return;
        }
        const {
			addition = {}, sidebar: {node} = {},
			actions: {postUser, clearAdditionField, getUsers, putUser}
        } = this.props;
        console.log(this.props)
        console.log(addition)
        const { actions: { ModifyVisible ,PutPeople,getOrgName,putPersons,reverseFind,is_fresh} } = this.props;
        let obj = this.state.dataSource;
        let data_list = {};
        let pks = [];
        // for(let i = 0; i < this.state.dataSource.length;i++){
        //     let rst = await getOrgName({code:this.state.dataSource[i].orgcode})
        //     pks.push(rst.pk);
        // }
        // 是用户
        if (obj[0].is_user) {
            // let rst = await reverseFind({pk:obj[0].personPk})
            console.log(obj)
            obj.map((item, index) => {
                console.log(item)
                data_list={
					username: item.usernames,
					email: item.email ,
					// password: addition.password, // 密码不能变？信息中没有密码
					account: {
						person_name: item.person_name || '',
						person_type: "C_PER",
						person_avatar_url: "",
						organization: {
							// pk: "119677274701" || '',
							code: item.code || '',
							obj_type: "C_ORG",
							rel_type: "member",
							name: item.name || ''
						},
					},
					// groups: roles.map(role => +role),
					is_active: true,
					basic_params: {
						info: {
							'电话': item.tel || '',
							'性别': item.sex || '',
							'技术职称': item.title || '',
							'phone':item.tel || '',
							'sex':item.sex || '',
							'duty':''
						}
					},
					extra_params: {},
					title: item.job || ''
				}
            })
            console.log("11111", obj[0].id)
            
            PutPeople({id: obj[0].id }, data_list).then(item => {
                console.log(item)
                if (item) {
                    is_fresh(true);
                    // clearAdditionField();
                    // const codes = Addition.collect(node);
                    // console.log("codes",codes)
                    // getUsers({}, {org_code: codes});
                    Notification.success({
                        message:"修改成功！"
                    })
                }
            })
            // 修改人员
            // putPersons({pk:rst[0].user.id},data_list).then(rst => {
            //     obj.map((item, index) => {
            //         data_list={
            //             "basic_params":{
            //                 "info":{
            //                     "电话":item.tel,
            //                     "性别":item.sex,
            //                     "邮箱":item.email
            //                 },
            //                 "signature":"/media"+item.signature.split("/media")[1],
            //                 "photo":""
            //             },
            //             "status":"A",
            //             "title":item.job,
            //             "first_name":"",
            //             "last_name":"",
            //             "name":item.name,
            //             "org":{
            //                 "code":item.depart,
            //                 "pk":pks[index],
            //                 "obj_type":"C_ORG",
            //                 "rel_type":"member"
            //             },
            //         }
            //     })
            //     PutPeople({ code: obj[0].code }, data_list).then(item => {
            //         if (item) {
            //             is_fresh(true);
            //             Notification.success({
            //                 message:"修改成功！"
            //             })
            //         }
            //     })
            // })
        }else{
            // 只修改人员
            // obj.map((item, index) => {
            //     data_list={
            //         "basic_params":{
            //             "info":{
            //                 "电话":item.tel,
            //                 "性别":item.sex,
            //                 "邮箱":item.email
            //             },
            //             "signature":"/media"+item.signature.split("/media")[1],
            //             "photo":""
            //         },
            //         "status":"A",
            //         "title":item.job,
            //         "first_name":"",
            //         "last_name":"",
            //         "name":item.name,
            //         "org":{
            //             "code":item.depart,
            //             "pk":pks[index],
            //             "obj_type":"C_ORG",
            //             "rel_type":"member"
            //         },
            //     }
            // })
            // PutPeople({code:obj[0].code},data_list).then(item=> {
            //     console.log("item:",item)
            //     is_fresh(true);
            //     Notification.success({
            //         message:"修改成功！"
            //     })
            // })
        }
        ModifyVisible(false);
    }
    mapCodes (arr) {
		return arr.map(item => {
			if(item.children && item.children.length) {
				return [
					item.code,
					this.mapCodes(item.children)
				]
			} else {
				return item.code;
			}
		})
		// if(arr.children && arr.children.length) {
		// 	return arr.map()
		// }
	}
    tableDataChange(record,index ,e ){
        const {actions: {getOrgReverse}} = this.props;
        const { dataSource } = this.state;
        // dataSource[index].depart = e.target.value;
        record.orgcode = e.target.value;
        this.forceUpdate();
        getOrgReverse({code:record.orgcode}).then(rst => {
            if(rst.children.length !== 0) {
                record.type = rst.children[0].name
            }else {
                record.type = ''
            }
            this.forceUpdate();
        })
    }
    //校验部门
    fixOrg(index){
        const {actions: {getOrgReverse}} = this.props;
        let {dataSource} = this.state
        getOrgReverse({code:dataSource[index].depart}).then(rst => {
            if(rst.children.length !== 0){
                dataSource[index]['orgname'] = {
                    org: rst.children[0].name
                }
                this.setState({dataSource})
            }else{
                Notification.Warning("部门不存在！")
            }
        })
    }

	//删除
    delete(){
        
    }
	cancel() {
        const { actions: { ModifyVisible } } = this.props;
        ModifyVisible(false);
    }
}
