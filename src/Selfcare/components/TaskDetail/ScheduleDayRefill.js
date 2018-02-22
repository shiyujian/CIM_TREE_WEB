import React, {PropTypes, Component} from 'react';
import {FILE_API} from '../../../_platform/api';
import {
    Form, Input, Row, Col, Modal, Upload, Button,
    Icon, message, Table,DatePicker,Progress,Select,Checkbox,Popconfirm,notification,Card,Steps
} from 'antd';
import moment from 'moment';
import {DeleteIpPort} from '../../../_platform/components/singleton/DeleteIpPort';
import PerSearch from '../../../Scheduleqh/components/stagereport/PerSearch';
import { getUser } from '../../../_platform/auth';
import { WORKFLOW_CODE, UNITS } from '../../../_platform/api';
import { getNextStates } from '../../../_platform/components/Progress/util';
import { base, SOURCE_API, DATASOURCECODE } from '../../../_platform/api';
import queryString from 'query-string';
const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const Step = Steps.Step;


class ScheduleDayRefill extends Component {

    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
			isCopyMsg: false, //接收人员是否发短信
			treedataSource: [],
            treetype: [],//树种
            key:6
        };
    }

    columns1 = [
		{
			title: '序号',
			dataIndex: 'key',
			key: 'key',
			width: '10%',
		}, {
			title: '项目',
			dataIndex: 'project',
			key: 'project',
		}, {
			title: '单位',
			dataIndex: 'units',
			key: 'units',
		}, {
			title: '数量',
			dataIndex: 'number',
			key: 'number',
			render: (text, record, index) => {
				return <Input value={record.number || ""} onChange={ele => {
					record.number = ele.target.value
					this.forceUpdate();
				}} />
			}
		}, {
			title: '操作',
			dataIndex: 'operation',
			key: 'operation',
			width: '10%',
			render: (text, record, index) => {
				if (index >= 6) {
					return <div>
						<Popconfirm
							placement="rightTop"
							title="确定删除吗？"
							onConfirm={this.delTreeClick.bind(this, record, index + 1)}
							okText="确认"
							cancelText="取消">
							<a>删除</a>
						</Popconfirm>
					</div>
				}
			}
		}
    ];
    
    componentDidMount() {
		const { actions: { gettreetype } } = this.props;
		let treedata = [{
			key: 1,
			project: '便道施工',
			units: 'm',
		}, {
			key: 2,
			project: '给排水沟槽开挖',
			units: 'm',
		}, {
			key: 3,
			project: '给排水管道安装',
			units: 'm',
		}, {
			key: 4,
			project: '给排水回填',
			units: 'm',
		}, {
			key: 5,
			project: '绿地平整',
			units: '亩',
		}, {
			key: 6,
			project: '种植穴工程',
			units: '个',
		},];
		this.setState({
			treedataSource: treedata
		})
		gettreetype({})
			.then(rst => {
				let treetype = rst.map((o, index) => {
					return (
						<Option key={index} value={JSON.stringify(o)}>{o.TreeTypeNo}</Option>
					)
				})
				this.setState({ treetype });
			})
	}

    render() {

        const { platform: { task = {}, users = {} } = {}, location, actions, form: { getFieldDecorator } } = this.props;
		const { history = [], transitions = [], states = [] } = task;
		const user = getUser();
        
        const FormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        }
        return (
            <div>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Card title='流程详情'>
                        <Row>
                            <Col span={24}>
                                <Row>
                                    <Col span={8}>
                                        <FormItem {...FormItemLayout} label='单位工程'>
                                            {
                                                getFieldDecorator('unit', {
                                                    rules: [
                                                        { required: true, message: '请选择单位工程' }
                                                    ]
                                                })
                                                    (<Select placeholder='请选择单位工程' allowClear>
                                                        {UNITS.map(d => <Option key={d.value} value={d.value}>{d.value}</Option>)}
                                                    </Select>)
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem {...FormItemLayout} label='编号'>
                                            {
                                                getFieldDecorator('numbercode', {
                                                    rules: [
                                                        { required: true, message: '请输入编号' }
                                                    ]
                                                })
                                                    (<Input placeholder='请输入编号' />)
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem {...FormItemLayout} label='文档类型'>
                                            {
                                                getFieldDecorator('daydocument', {
                                                    rules: [
                                                        { required: true, message: '请选择文档类型' }
                                                    ]
                                                })
                                                    (<Select placeholder='请选择文档类型' allowClear>
                                                        <Option key={1} value='开发文档'>开发文档</Option>
                                                        <Option key={2} value='测试文档'>测试文档</Option>
                                                    </Select>)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <FormItem {...FormItemLayout} label='日期'>
                                            {
                                                getFieldDecorator('timedate', {
                                                    rules: [
                                                        { required: true, message: '请输入日期' }
                                                    ]
                                                })
                                                    (<DatePicker placeholder='请输入日期'/>)
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem {...FormItemLayout} label='监理单位'>
                                            {
                                                getFieldDecorator('superunit', {
                                                    rules: [
                                                        { required: true, message: '请选择审核人员' }
                                                    ]
                                                })
                                                    (<Input placeholder='系统自动识别，无需手输' readOnly/>)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Table
                                        columns={this.columns1}
                                        dataSource={this.state.treedataSource}
                                        className='foresttable'
                                    />
                                    <Button onClick={this.addTreeClick.bind(this)} style={{ marginLeft: 20, marginRight: 10 }} type="primary" ghost>添加</Button>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                    <Card title={'审批流程'} style={{marginTop:10}}>
                        <Steps direction="vertical" size="small" current={history.length - 1}>
                            {
                                history.map((step, index) => {
                                    const { state: { participants: [{ executor = {} } = {}] = [] } = {} } = step;
                                    const { id: userID } = executor || {};
                                    if (step.status === 'processing') { // 根据历史状态显示
                                        const state = this.getCurrentState();
                                        return (
                                            <Step 
                                                title={
                                                    <div style={{ marginBottom: 8 }}>
                                                        <span>{step.state.name}-(执行中)</span>
                                                        <span style={{ paddingLeft: 20 }}>当前执行人: </span>
                                                        <span style={{ color: '#108ee9' }}> {`${executor.person_name}` || `${executor.username}`}</span>
                                                    </div>}
                                                description={
                                                    <div>
                                                        <Row>
                                                            <Col span={8} offset={4}>
                                                                <FormItem {...FormItemLayout} label='审核人'>
                                                                    {
                                                                        getFieldDecorator('dataReview', {
                                                                            rules: [
                                                                                { required: true, message: '请选择审核人员' }
                                                                            ]
                                                                        })
                                                                            (
                                                                            <PerSearch selectMember={this.selectMember.bind(this)} />
                                                                            )
                                                                    }
                                                                </FormItem>
                                                            </Col>
                                                            <Col span={8} offset={4}>
                                                                <Checkbox onChange={this._cpoyMsgT.bind(this)}>短信通知</Checkbox>
                                                            </Col>
                                                        </Row>
                                                        <FormItem>
                                                            <Row>
                                                                <Col span={24} style={{ textAlign: 'center' }}>
                                                                    <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">提交</Button>
                                                                </Col>
                                                            </Row>
                                                        </FormItem>
                                                    </div>} 
                                                key={index} 
                                            />

                                        )
                                    } else {
                                        const { records: [record] } = step;
                                        const { log_on = '', participant: { executor = {} } = {}, note = '' } = record || {};
                                        const { person_name: name = '', organization = '' } = executor;
                                        return (
                                            <Step key={index} title={`${step.state.name}-(${step.status})`}
                                                description={
                                                    <div style={{ lineHeight: 2.6 }}>
                                                        <div>审核意见：{note}</div>
                                                        <div>
                                                            <span>审核人:{`${name}` || `${executor.username}`} [{organization}]</span>
                                                            <span
                                                                style={{ paddingLeft: 20 }}>审核时间：{moment(log_on).format('YYYY-MM-DD HH:mm:ss')}</span>
                                                        </div>
                                                    </div>} />);
                                    }
                                }).filter(h => !!h)
                            }
                        </Steps>
                    </Card>
                </Form>
            </div>
            
				
        );
    }

    getCurrentState() {
		const { platform: { task = {} } = {}, location = {} } = this.props;
		const { state_id = '0' } = queryString.parse(location.search) || {};
		const { states = [] } = task;
		return states.find(state => state.status === 'processing' && state.id === +state_id);
	}


    handleSubmit = (e) =>{
        e.preventDefault();
        const {
            platform: { task = {} } = {},
            actions: {
                putFlow,
                postSubject
            },
            location
        } = this.props;
        const{
            treedataSource
        } = this.state
        let user = getUser();//当前登录用户
        let me = this;
        let postData = {};
        me.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
            if (!err) {
                // 共有信息
                for (let value in values) {
					if (value === 'unit') {
						postData.unit = values[value];
					} else if (value === 'superunit') {
						postData.superunit = values[value];
					} else if (value === 'dataReview') {
						postData.dataReview = values[value];
					} else if (value === 'numbercode') {
						postData.numbercode = values[value];
					} else if (value === 'timedate') {
						postData.timedate = values[value];
					} else if (value === 'daydocument') {
						postData.daydocument = values[value];
					} else {
						console.log(1111)
					}
				}
				postData.upload_unit = user.org ? user.org : '';
				postData.type = '每日计划进度';
				postData.upload_person = user.name ? user.name : user.username;
				postData.upload_time = moment().format('YYYY-MM-DDTHH:mm:ss');

                let subject = [{
                    //共有属性
					"postData": JSON.stringify(postData),
					//数据清单
					"treedataSource": JSON.stringify(treedataSource),
                    
                }];
                let newSubject = {
                    subject:subject
                }

                const { state_id = '0' } = queryString.parse(location.search) || {};
                console.log('state_id', state_id)
                let executor = {
                    "username": user.username,
                    "person_code": user.code,
                    "person_name": user.name,
                    "id": parseInt(user.id)
                };
                let nextUser = {};
                
                nextUser = values.dataReview;
                // 获取流程的action名称
                let action_name = '';
                let nextStates = getNextStates(task, Number(state_id));
                console.log('nextStates',nextStates)
                let stateid = 0
                action_name = nextStates[0].action_name
                stateid = nextStates[0].to_state[0].id
                console.log('nextStates', nextStates)

                
                let note = action_name + '。';
                
                let state = task.current[0].id;
                let postdata = {
                    next_states: [
                        {
                            state: stateid,
                            participants: [nextUser],
                            dealine: null,
                            remark: null,
                        }
                    ],
                    state: state,
                    executor: executor,
                    action: action_name,
                    note: note,
                    attachment: null
                }


                
                let data = {
                    pk: task.id
                }
                postSubject(data,newSubject).then( value=>{
                    console.log('value',value)
                })

                putFlow(data,postdata).then( rst=>{
                    console.log('rst',rst)
                    if(rst && rst.creator){
                        notification.success({
                            message: '流程提交成功',
                            duration: 2
                        }) 
                        let to = `/selfcare`;
                        me.props.history.push(to)
                    } else {
                        notification.error({
                            message: '流程通过失败',
                            duration: 2
                        })
                        return
                    }
                })
            }
        })
        
    }

    //选择人员
    selectMember(memberInfo) {
        const {
            form: {
                setFieldsValue
            }
        } = this.props
        this.member = null;
        if (memberInfo) {
            let memberValue = memberInfo.toString().split('#');
            if (memberValue[0] === 'C_PER') {
                this.member = {
                    "username": memberValue[4],
                    "person_code": memberValue[1],
                    "person_name": memberValue[2],
                    "id": parseInt(memberValue[3]),
                    org: memberValue[5],
                }
            }
        } else {
            this.member = null
        }

        setFieldsValue({
            dataReview: this.member,
            superunit: this.member.org
        });
    }

    // 添加树列表
	addTreeClick() {
		const { treedataSource, key } = this.state;
		let num = key + 1;
		let project = [
			<Select style={{ width: '200px' }} placeholder='请选择树种' onSelect={this.handleSelect.bind(this, key, 'project')}>
				{
					this.state.treetype
				}
			</Select>
		]
		let addtree = {
			key: num,
			project: project,
			units: '棵'
		}
		treedataSource.push(addtree);
		console.log('treedataSource', treedataSource)
		this.setState({ treedataSource, key: num })
    }
    
    //下拉框选择变化
	handleSelect(index, key, value) {
		const { treedataSource } = this.state;
		value = JSON.parse(value);
		treedataSource[index][key] = value.TreeTypeNo;
		this.setState({ treedataSource });
	}
	// 删除树列表
	delTreeClick(index) {
		alert('暂时无法删除')
	}

    // 短信
    _cpoyMsgT(e) {
        this.setState({
            isCopyMsg: e.target.checked,
        })
    }

}
export default Form.create()(ScheduleDayRefill)