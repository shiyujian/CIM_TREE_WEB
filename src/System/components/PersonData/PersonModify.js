import React, { Component } from 'react';
import { Modal, Input, Form, Button, Notification, Table, Radio, Row, Col, Select } from 'antd';
import { CODE_PROJECT } from '_platform/api';
// import { getProjectUnits } from '../../../_platform/auth'
import '../index.less';
import { getUser, getProjectUnits } from '_platform/auth';
import { getNextStates } from '_platform/components/Progress/util';
import { WORKFLOW_CODE } from '_platform/api'
import { flattenDeep } from 'lodash';
const RadioGroup = Radio.Group;
const { Option, OptGroup } = Select;

const { TextArea } = Input;
var moment = require('moment');

export default class PersonModify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            users: [],
            projects: [],
            checkers: [],
            defaultPro: "",
            defaultchecker: "",
            // units: [],
            selectPro: [],
            selectUnit: [],
            subErr: true,
            description: '',
            id: '',
        }
    }

    componentDidMount() {
        const { Modvisible, modifyPer, actions: { getAllUsers, getProjects } } = this.props;

        this.setState({
            dataSource: [modifyPer]
        })

    }
    //获取项目的标段
    getUnits(record) {
        const {
			listStore = []
		} = this.props;
        let projectName = ''
        console.log("this.props", this.props)
        listStore.map((item, index) => {
            item.map((rst) => {
                if ((rst.name === record.orgname) && (rst.code === record.orgcode)) {
                    projectName = listStore[index] ? listStore[index][0].name : ''
                }
            })

        })
        console.log('projectName', projectName)
        return getProjectUnits(projectName)
    }
    changeRolea(record, value) {
        const { actions: { changeAdditionField } } = this.props;
        console.log("value", value)
        record.sections = value
        changeAdditionField('sections', value)
    }
    changeRoles(record, value) {
        const { actions: { changeAdditionField } } = this.props;
        console.log("value111111", value)
        record.groups = value
        changeAdditionField('groups', value)
    }
    renderContent() {

        const user = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        const { platform: { roles = [] } } = this.props;
        var systemRoles = []
        if (user.is_superuser) {
            systemRoles.push({ name: '苗圃角色', value: roles.filter(role => role.grouptype === 0) });
            systemRoles.push({ name: '施工角色', value: roles.filter(role => role.grouptype === 1) });
            systemRoles.push({ name: '监理角色', value: roles.filter(role => role.grouptype === 2) });
            systemRoles.push({ name: '业主角色', value: roles.filter(role => role.grouptype === 3) });
        }
        else {
            for (let i = 0; i < user.groups.length; i++) {
                const rolea = user.groups[i].grouptype
                switch (rolea) {
                    case 0:
                        systemRoles.push({ name: '苗圃角色', value: roles.filter(role => role.grouptype === 0) });
                        break;
                    case 1:
                        systemRoles.push({ name: '苗圃角色', value: roles.filter(role => role.grouptype === 0) });
                        systemRoles.push({ name: '施工角色', value: roles.filter(role => role.grouptype === 1) });
                        break;
                    case 2:
                        systemRoles.push({ name: '监理角色', value: roles.filter(role => role.grouptype === 2) });
                        break;
                    case 3:
                        systemRoles.push({ name: '业主角色', value: roles.filter(role => role.grouptype === 3) });
                        break;
                    default:
                        break;
                }
            }
        }

        const objs = systemRoles.map(roless => {
            return (<OptGroup label={roless.name}>
                {
                    roless.value.map(role => {
                        return (<Option key={role.id} value={String(role.id)}>{role.name}</Option>)
                    })
                }
            </OptGroup>)
        })
        return objs
    }
    changeNursery(value,record){
		const { actions: { changeAdditionField }, tags = [] } = this.props;
		let defaultTags = []
		//对于从select组建传过来的value，进行判断，如果是ID，直接push，如果是苗圃名字，那么找到对应的ID，再push
		record.map((item)=>{
			let data = item.toString().split('-');
			if(data.length===2){
				tags.map((rst)=>{
					if(rst && rst.ID){
						if(rst.NurseryName === data[0] && rst.Factory === data[1]){
							defaultTags.push(rst.ID.toString())
						}
					}
				})
			}else{
				defaultTags.push(item.toString())
			}
        })
        defaultTags = [...new Set(defaultTags)]
        value.tags=defaultTags
		changeAdditionField('tags', defaultTags)
	}
    query(record){
		if(record && record.tags){
			const {
				tags = []
			}= this.props
            let array = record.tags || []
			let defaultNurse = []
			array.map((item)=>{
				tags.map((rst)=>{
					if(rst && rst.ID){
						if(rst.ID.toString() === item){
							defaultNurse.push(rst.NurseryName+'-'+rst.Factory)
						}
					}
				})
			})
			return defaultNurse
		}
	}
    //初始化苗圃
    initopthins(list) {
        const ops = [];
        for (let i = 0; i < list.length; i++) {
            ops.push(<Option key={list[i].ID} value={list[i].ID} title={list[i].NurseryName + '-' + list[i].Factory}>{list[i].NurseryName + '-' + list[i].Factory}</Option>)
        }
        return ops;
    }
    render() {
        const { Modvisible, actions: { getOrgReverse }, tags = [] } = this.props;
        const { platform: { roles = [] } } = this.props;
        const tagsOptions = this.initopthins(tags);
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            key: 'Index',
        }
            // , {
            //     title: '人员编码',
            //     dataIndex: 'code',
            //     key: 'Code',
            // }
            , {
            title: '姓名',
            dataIndex: 'name',
            key: 'Name',
            render: (text, record, index) => {
                return <Input value={record.name || ""} onChange={ele => {
                    record.name = ele.target.value
                    this.forceUpdate();
                }} />
            }
        },
        //  {
        //     title: '所在组织机构单位',
        //     dataIndex: 'type',
        //     key: 'Org',
        //     render: (text, record, index) => {
        //         if (record.type !== '') {
        //             return (<span>{record.type}</span>)
        //         } else {
        //             return (<span>暂无</span>)
        //         }
        //     }
        // },
        {
            title: '所属部门',
            dataIndex: 'orgcode',
            key: 'Depart',
            width: "15%",

            render: (test, record, index) => {
                if (record.type === "") {
                    return <Input
                        style={{ color: 'red' }}
                        value={record.orgcode || ""}
                        onChange={this.tableDataChange.bind(this, record, index)}
                    // onBlur={this.fixOrg.bind(this, index)}
                    />
                } else {
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
            render: (text, record, index) => {
                return <Input value={record.job || ""} onChange={ele => {
                    record.job = ele.target.value
                    this.forceUpdate();
                }} />
            }
        }, {
            title: '性别',
            dataIndex: 'sexr',
            key: 'Sex',
            render: (text, record, index) => {
                return <Select style={{ width: 42 }} value={record.sex} onChange={ele => {
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
            render: (text, record, index) => {
                return <Input type='number' value={record.tel || ""} onChange={ele => {
                    record.tel = ele.target.value
                    this.forceUpdate();
                }} />
            }
        }, {
            title: '邮箱',
            dataIndex: 'email',
            key: 'Email',
            render: (text, record, index) => {
                return <Input value={record.email || ""} onChange={ele => {
                    record.email = ele.target.value
                    this.forceUpdate();
                }} />
            }
        }
            , {
            title: '标段',
            dataIndex: 'sections',
            key: 'sections',
            render: (text, record, index) => {
                console.log("record", record)
                let units = this.getUnits(record)
                console.log("units", units)
                return <Select   value={record.sections} onChange={this.changeRolea.bind(this, record)}
                    mode="multiple" style={{ width: '100%',minWidth:"50px" }}>
                    {
                        units ?
                            units.map((item) => {
                                return <Option key={item.code} value={item.code} >{item.value}</Option>
                            }) :
                            ''
                    }
                </Select>
            }
        }
            , {
            title: '角色',
            dataIndex: 'groups',
            key: 'groups',
            render: (text, record, index) => {
                return <Select  value={record.groups} onChange={this.changeRoles.bind(this, record)}
                    mode="multiple" style={{ width: '100%' ,minWidth:"50px"}}>
                    {
                        this.renderContent()
                    }
                </Select>
            }
        }
        //     , {
        //     title: '苗圃',
        //     dataIndex: 'tags',
        //     key: 'tags',
        //     render: (text, record, index) => {
        //         let defaultNurse = this.query(record)
        //         return <Select placeholder="苗圃" showSearch
        //             value={defaultNurse}
        //             optionFilterProp='children'
        //             filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        //             onChange={this.changeNursery.bind(this,record)}
        //             mode="multiple" style={{ width: '100%' }} >
        //             {tagsOptions}
        //         </Select>
        //     }
        // }
            // , {
            //     title: '用户名',
            //     dataIndex: 'username',
            //     key: 'username',
            //     render: (text, record, index) => {
            //         // console.log("record",record.username)
            //         return <Input value={record.username || ""} onChange={ele => {
            //             record.username = ele.target.value
            //         // console.log("222",record.username)

            //             this.forceUpdate();
            //         }} />
            //     }
            // }
            // ,{
            //     title: '密码',
            //     dataIndex: 'passwords',
            //     key: 'Passwords',
            //     render: (text, record, index) => {
            //         return <Input value={record.passwords || ""} onChange={ele => {
            //             record.passwords = ele.target.value
            //             this.forceUpdate();
            //         }} />
            //     }
            // }
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
            //     , {
            //     title: '是否为用户',
            //     render: (record) => {
            //         if (record.is_user) {
            //             return (<span>是</span>)
            //         } else {
            //             return (<span>否</span>)
            //         }
            //     }
            // }
        ]

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
        this.setState({ description: e.target.value })
    }

    onChange = (e) => {
        console.log("2222", e.target.value)
        this.setState({
            value: e.target.value,
        });
    }

    async onok(id) {
        if (this.state.dataSource[0].type === "") {
            Notification.warning({
                message: "该部门不存在！！"
            })
            return;
        }
        const {
			addition = {}, sidebar: { node } = {},
            actions: { postUser, clearAdditionField, getUsers, putUser }
        } = this.props;
        console.log(this.props)

        // console.log(addition)
        const { actions: { ModifyVisible, PutPeople, getOrgName, putPersons, reverseFind, is_fresh } } = this.props;
        let obj = this.state.dataSource;
        let data_list = {};
        let pks = [];
        for (let i = 0; i < this.state.dataSource.length; i++) {
            let rst = await getOrgName({ code: this.state.dataSource[i].orgcode })
            console.log("rst", rst)
            pks.push(rst.pk);
        }
        console.log("pks", pks)
        // 是用户
        if (obj[0].is_user) {
            // let rst = await reverseFind({pk:obj[0].personPk})
            console.log(obj)
            console.log("addition", addition)
            // return
            obj.map((item, index) => {
                console.log("item.username", item)

                putUser({}, {
                    id: item.id,
                    username: item.username,
                    email: item.email,
                    // password: item.passwords, // 密码不能变？信息中没有密码
                    account: {
                        person_name: item.name || '',
                        person_type: "C_PER",
                        person_avatar_url: "",
                        organization: {
                            pk: pks[0],
                            code: item.orgcode || '',
                            obj_type: "C_ORG",
                            rel_type: "member",
                            name: item.orgname,
                            // name: item.name || ''
                        },
                    },
                    tags: item.tags,
                    sections: item.sections,
                    groups: item.groups,
                    is_active: true,
                    basic_params: {
                        info: {
                            '电话': item.tel || '',
                            '性别': item.sex || '',
                            '技术职称': item.title || '',
                            'phone': item.tel || '',
                            'sex': item.sex || '',
                            'duty': ''
                        }
                    },
                    extra_params: {},
                    title: item.job || '',
                }).then(item => {
                    console.log(item)
                    if (item) {
                        is_fresh(true);
                        // clearAdditionField();
                        // const codes = Addition.collect(node);
                        // console.log("codes",codes)
                        // getUsers({}, {org_code: item.account.org_code});
                        Notification.success({
                            message: "修改成功！"
                        })
                    }
                })
            })
            console.log("11111", obj[0].id)


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
        } else {
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
    mapCodes(arr) {
        return arr.map(item => {
            if (item.children && item.children.length) {
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
    tableDataChange(record, index, e) {
        const { actions: { getOrgReverse } } = this.props;
        const { dataSource } = this.state;
        // dataSource[index].depart = e.target.value;
        record.orgcode = e.target.value;
        this.forceUpdate();
        getOrgReverse({ code: record.orgcode }).then(rst => {
            if (rst.children.length !== 0) {
                record.type = rst.children[0].name
            } else {
                record.type = ''
            }
            this.forceUpdate();
        })
    }
    //校验部门
    fixOrg(index) {
        const { actions: { getOrgReverse } } = this.props;
        let { dataSource } = this.state
        getOrgReverse({ code: dataSource[index].depart }).then(rst => {
            if (rst.children.length !== 0) {
                dataSource[index]['orgname'] = {
                    org: rst.children[0].name
                }
                this.setState({ dataSource })
            } else {
                Notification.Warning("部门不存在！")
            }
        })
    }

    //删除
    delete() {

    }
    cancel() {
        const { actions: { ModifyVisible } } = this.props;
        ModifyVisible(false);
    }
}
