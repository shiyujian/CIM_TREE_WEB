/**
 * Created by tinybear on 17/8/7.
 */
import React, { Component } from 'react';
import { Button, Row, Col, Select, Table, Input, DatePicker, message } from 'antd';
import './FillPlan.less';
import Dragger from '_platform/components/panels/Dragger';
import WorkFlowHistory from './WorkFlowHistory';
import UserTreeSelect from './UserTreeSelect';
import moment from 'moment';
import { getUser } from '_platform/auth';
import { DOWNLOAD_FILE } from '_platform/api';
import { transUser } from './util';
const uuidv4 = require('uuid/v4');
const { Option } = Select;
const JSON = window.JSON;

class FillPlanPanel extends Component {
    state = {
        mark: '',
        data: [],
        designStage: '',
        selectedPlan: null,
        selectedWK: null,
        attachmentFile: null,
        designUnit: [],
        busying: false,
        columns: [
            { title: '序号', dataIndex: 'xuhao', key: 'xuhao' },
            {
                title: '图纸卷册编号',
                dataIndex: 'juance',
                key: 'juance',
                render: (text, record, index) => {
                    return this.renderColumns(this.state.data, index, 'juance', text);
                }
            },
            {
                title: '图纸卷册名称',
                dataIndex: 'name',
                key: 'name',
                render: (text, record, index) => {
                    return this.renderColumns(this.state.data, index, 'name', text);
                }
            },
            {
                title: '设计模型名称',
                dataIndex: 'modelName',
                key: 'modelName',
                render: (text, record, index) => {
                    return this.renderColumns(this.state.data, index, 'modelName', text);
                }
            },
            {
                title: '专业',
                dataIndex: 'profession',
                key: 'profession',
                render: (text, record, index) => {
                    return this.renderSelect(this.state.data, index, 'profession', text);
                }
            },
            { title: '当前版本', dataIndex: 'version', key: 'version' },
            {
                title: '项目负责人',
                dataIndex: 'projectPrincipal',
                key: 'projectPrincipal',
                render: (text, record, index) => {
                    return this.renderUserTreeSelect(this.state.data, index, 'projectPrincipal', text);
                }
            },
            {
                title: '专业负责人',
                dataIndex: 'professionPrincipal',
                key: 'professionPrincipal',
                render: (text, record, index) => {
                    return this.renderUserTreeSelect(this.state.data, index, 'professionPrincipal', text);
                }
            },
            {
                title: '成果交付时间',
                dataIndex: 'deliverTime',
                key: 'deliverTime',
                width: 100,
                render: (text, record, index) => {
                    return this.renderDatePicker(this.state.data, index, 'deliverTime', text);
                }
            },
            {
                title: '操作',
                key: 'action',
                width: 80,
                render: (text, record, index) => {
                    return record.action === 'normal' ? (
                        <span>
                            <a
                                href="javascript:;"
                                onClick={() => {
                                    this.setEdit(index);
                                }}
                            >
                                编辑
                            </a>
                            <span className="ant-divider" />
                            <a
                                href="javascript:;"
                                className="ant-dropdown-link"
                                onClick={() => {
                                    this.removeRow(index);
                                }}
                            >
                                删除
                            </a>
                        </span>
                    ) : (
                        <span>
                            {/*<a href="javascript:;" onClick={()=>{this.exitEdit(index);}}>保存</a>
                         <span className="ant-divider"/>*/}
                            <a
                                href="javascript:;"
                                className="ant-dropdown-link"
                                onClick={() => {
                                    this.exitEdit(index);
                                }}
                            >
                                完成
                            </a>
                        </span>
                    );
                }
            }
        ]
    };

    componentWillMount() {
        //获取专业
        const { getProfessionlist } = this.props.actions;
        const { selectedWK } = this.props;
        this.setState({ selectedWK: selectedWK });

        getProfessionlist().then(() => {
            this.getPlan(selectedWK);
        });

        const { readonly } = this.props;
        if (readonly) {
            let columns = this.state.columns;
            columns.pop();
            this.setState({ columns });
        }

        this.getDesignStage();
    }

    getDesignStage = () => {
        const { getDesignStage } = this.props.actions;
        const { designStageEnum } = this.props.plan;
        if (!designStageEnum) {
            getDesignStage();
        }
    };

    setEdit(index) {
        const { data } = this.state;
        data[index].action = 'edit';
        Object.keys(data[index]).forEach(v => {
            if (data[index][v].hasOwnProperty('editable')) data[index][v]['editable'] = true;
        });
        this.setState({ data });
    }

    exitEdit(index) {
        const { data } = this.state;
        data[index].action = 'normal';
        Object.keys(data[index]).forEach(v => {
            if (data[index][v].hasOwnProperty('editable')) data[index][v]['editable'] = false;
        });
        this.setState({ data });
    }

    removeRow(index) {
        const { data } = this.state;
        data.splice(index, 1);
        this.setState({ data });
    }

    handleChange(key, index, value) {
        const { data } = this.state;
        data[index][key].value = value;
        this.setState({ data });
    }

    renderColumns(data, index, key, text) {
        const { editable } = data[index][key];
        if (typeof editable === 'undefined') {
            return text;
        }
        return (
            <div>
                {!editable ? (
                    <span>{text.value}</span>
                ) : (
                    <Input
                        value={text.value}
                        size="small"
                        onChange={e => this.handleChange(key, index, e.target.value)}
                    />
                )}
            </div>
        );
    }

    handleDateChange(key, index, value) {
        const { data } = this.state;
        data[index][key].value = !value ?'' :value.format('YYYY-MM-DD');
        this.setState({ data });
    }

    disabledDate(current) {
        let now = new Date();
        let now_1 = now.setDate(now.getDate() - 1);
        return current && current.valueOf() < now_1.valueOf();
    }

    renderDatePicker(data, index, key, text) {
        const { editable } = data[index][key];
        if (typeof editable === 'undefined') {
            return text;
        }
        return (
            <div>
                {!editable ? (
                    <span>{text.value}</span>
                ) : (
                    <DatePicker
                        value={text.value ? moment(text.value, 'YYYY-MM-DD') : null}
                        size="small"
                        disabledDate={this.disabledDate}
                        onChange={date => this.handleDateChange(key, index, date)}
                    />
                )}
            </div>
        );
    }

    handleSelectChange(key, index, value) {
        const { data } = this.state;
        data[index][key].value = value;
        this.setState({ data });
    }

    renderSelect(data, index, key, text) {
        const { editable } = data[index][key];
        if (typeof editable === 'undefined') {
            return text;
        }
        const { professlist } = this.props.plan;
        return (
            <div>
                {!editable ? (
                    <span>{text.value ? text.value.name : ''}</span>
                ) : (
                    <Select
                        style={{ width: '120px' }}
                        value={text.value ? text.value.code : null}
                        size="small"
                        onSelect={value => {
                            let item = professlist.find(v => v.code === value);
                            this.handleSelectChange(key, index, item);
                        }}
                    >
                        {professlist.map((p, i) => {
                            return (
                                <Option value={p.code} key={i}>
                                    {p.name}
                                </Option>
                            );
                        })}
                    </Select>
                )}
            </div>
        );
    }

    handleUserSelectChange(key, index, value) {
        const { data } = this.state;
        data[index][key].value = value;
        this.setState({ data });
    }

    renderUserTreeSelect(data, index, key, text) {
        const { editable } = data[index][key];
        if (typeof editable === 'undefined') {
            return text;
        }
        let selectValue = text.value.id ? text.value.id.toString() : '';

        return (
            <div>
                {!editable ? (
                    <span>{text.value ? (text.value.person_name ? text.value.person_name : '') : ''}</span>
                ) : (
                    <UserTreeSelect
                        rootCode={this.state.designUnit.code}
                        valueId={selectValue}
                        onSelect={user => {
                            this.handleUserSelectChange(key, index, transUser(user));
                        }}
                    />
                )}
            </div>
        );
    }

    //获取计划
    getPlan = (wk) => {
        const { getPlan, getWorkflow } = this.props.actions;

        if (wk) {
            getWorkflow({ id: wk.id }).then(wkflow => {
                let subject = wkflow.subject[0];
                subject.unit = JSON.parse(subject.unit);
                subject.project = JSON.parse(subject.project);
                subject.model_checker = JSON.parse(subject.model_checker);
                subject.drawing_checker = JSON.parse(subject.drawing_checker);
                subject.design_unit = JSON.parse(subject.design_unit);
                subject.drawing_ch_unit = JSON.parse(subject.drawing_ch_unit);
                subject.modal_ch_unit = JSON.parse(subject.modal_ch_unit);
                subject.plan_writer = JSON.parse(subject.plan_writer);
                this.setState({ selectedWK: wkflow, designUnit: subject.design_unit });
            });

            let code = wk.subject[0].plans[0].code;
            getPlan({ code }).then(plan => {
                this.setState({ selectedPlan: plan });
                //转换表格数据
                let extra = plan.extra_params;
                // extra.plans
                let data = [];
                if (extra.plans) {
                    extra.plans.forEach((v, i) => {
                        data.push({
                            id: v.id,
                            key: i + 1,
                            xuhao: i + 1,
                            juance: { editable: false, value: v.juance },
                            name: { editable: false, value: v.name },
                            modelName: { editable: false, value: v.modelName },
                            profession: { editable: false, value: v.profession },
                            version: v.version,
                            projectPrincipal: { editable: false, value: v.projectPrincipal },
                            professionPrincipal: { editable: false, value: v.professionPrincipal },
                            deliverTime: { editable: false, value: v.deliverTime },
                            action: 'normal'
                        });
                    });
                }
                this.setState({ data, attachmentFile: plan.extra_params.attachmentFile, mark: extra.mark });
            });
        }
    }

    //新增数据行
    addPlan = () => {
        let newRow = {
            juance: { editable: true, value: '' },
            name: { editable: true, value: '' },
            modelName: { editable: true, value: '' },
            profession: { editable: true, value: '' },
            version: 'A',
            projectPrincipal: { editable: true, value: '' },
            professionPrincipal: { editable: true, value: '' },
            deliverTime: { editable: true, value: null },
            action: 'edit' //edit || normal
        };
        let { data } = this.state;
        let l = data.length + 1;
        newRow.key = l;
        newRow.xuhao = l;
        newRow.id = uuidv4();
        data.push(newRow);
        this.setState({ data });
    };

    submitPlan = () => {
        let plans = [];
        const { data, designStage, selectedWK } = this.state;
        const subject = selectedWK.subject[0];
        // let planStart = moment(subject.plan_write_date).valueOf();
        // let drawingChTime = moment(subject.drawingReviewTime).valueOf();
        // let modelChTime = moment(subject.modalReviewTime).valueOf();
        //数据校验 是否重复 计划时间不能空
        let isDeliverTime = true;
        let isjuance = true;
        let isRepeat = false;
        // let isTimeOk = true;
        data.forEach((d, i) => {
            if (!d.deliverTime.value) {
                isDeliverTime = false;
            }
            if (!d.juance.value) {
                isjuance = false;
            }
            //编号是否重复
            if (data.findIndex(v => d.juance.value === v.juance.value) !== i) {
                isRepeat = true;
            }

            //验证计划时间是否合理
            // let deliverTime = moment(d.deliverTime.value).valueOf();
            // if (deliverTime < planStart || deliverTime > drawingChTime || deliverTime > modelChTime) {
            //     isTimeOk = false;
            // }

            const deliverTime = d.deliverTime.value;
            const drawingApprovalTime = moment(deliverTime).add(subject.drawingReviewDayLimit, 'days').format('YYYY-MM-DD');
            const modelApprovalTime = moment(deliverTime).add(subject.modalReviewDayLimit, 'days').format('YYYY-MM-DD');

            plans.push({
                id: d.id,
                juance: d.juance.value,
                name: d.name.value,
                modelName: d.modelName.value,
                profession: d.profession.value,
                version: d.version,
                projectPrincipal: d.projectPrincipal.value,
                professionPrincipal: d.professionPrincipal.value,
                deliverTime: deliverTime,
                stage: designStage,
                // todo
                // approvalTime = deliverTime + dayLimit ?
                drawingApprovalTime: drawingApprovalTime,
                modelApprovalTime: modelApprovalTime,
                approvalTime: ''
            });
        });

        if (!isDeliverTime) {
            message.error('请选择计划交付时间');
            // return Promise.reject(new Error('invalid deliver time'));
            return Promise.reject()
        }
        if (!isjuance) {
            message.error('请输入卷册编号');
            // return Promise.reject(new Error('invalid juance serial'));
            return Promise.reject()
        }
        if (isRepeat) {
            message.error('卷册编号不能重复');
            // return Promise.reject(new Error('dulplicatied juance serial'));
            return Promise.reject()
        }
        if(this.state.data.length===0){
            message.error('你还没有新增内容，不能发起提交');
            return Promise.reject()
        }
        // if (!isTimeOk) {
        //     message.error('成果交付时间不能早于计划发起时间，不能晚于审查时间');
        //     // return Promise.reject(new Error('invalid approval time'));
        //     return Promise.reject()
        // }
        //更新计划
        const { selectedPlan, attachmentFile, mark } = this.state;
        const { updatePlan } = this.props.actions;
        return new Promise((resolve, reject) => {
            selectedPlan.extra_params.plans = plans;
            selectedPlan.extra_params.status = 1;
            selectedPlan.extra_params.attachmentFile = attachmentFile;
            selectedPlan.extra_params.mark = mark;
            updatePlan({ code: selectedPlan.code }, { extra_params: selectedPlan.extra_params }).then(data => {
                message.success('保存计划成功');
                resolve(data);
            });
        });
    };

    submitWorkFlow = () => {
        //流转流程
        const { putFlow } = this.props.actions;
        const { selectedWK, attachmentFile, mark } = this.state;

        const usr = getUser();
        const executor = {
            username: usr.username,
            organization: usr.org,
            person_code: usr.code,
            person_name: usr.name,
            id: parseInt(usr.id)
        };
        const nextUser = selectedWK.creator;
        this.setState({ busying: true });
        //获取节点id
        const { id, workflow: { states = [] } = {} } = selectedWK;
        const [{ id: state_id }, { id: next_id }] = states;
        this.submitPlan().then((res) => {
            if (!res) {
                throw new Error('invalid data');
            }
            putFlow(
                { pk: id },
                {
                    next_states: [
                        {
                            state: next_id,
                            participants: [nextUser],
                            deadline: null,
                            remark: null
                        }
                    ],
                    state: state_id,
                    executor: executor,
                    action: '提交',
                    note: mark ? mark : '',
                    attachment: attachmentFile
                }
            ).then(data => {
                //todo 待处理提交流程失败
                this.setState({ busying: false });
                message.success('交付计划流程提交成功,待审批');
                const { close, updateDataTable } = this.props;
                close();
                updateDataTable(id, { status: '待审查', action: 0 });
            });
        }).catch(err => {
            this.setState({ busying: false });
        });
    };

    render() {
        let { selectedWK, columns, busying } = this.state;
        let subject = selectedWK ? selectedWK.subject[0] : {};
        let creator = selectedWK ? selectedWK.creator : '';
        const { readonly } = this.props;
        const { designStageEnum = {} } = this.props.plan;
        return (
            <div className="fill-plan">
                {!readonly ? (
                    <Row>
                        <Col span={24}>
                            <Button style={{ float: 'right' }} onClick={this.submitWorkFlow} loading={busying}>
                                提交
                            </Button>
                            <Button style={{ float: 'right' }} onClick={this.submitPlan}>
                                暂存
                            </Button>
                        </Col>
                    </Row>
                ) : (
                    ''
                )}
                <Row style={{ margin: '10px 0' }}>
                    <Col span={8}>
                        <label htmlFor="">项目名称:</label>
                        <span>{subject ? subject.project.name : ''}</span>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">单位工程:</label>
                        <span>{subject ? subject.unit.name : ''}</span>
                    </Col>
                    <Col span={4}>
                        <label htmlFor="">设计阶段:</label>
                        <span>{designStageEnum[subject.stage]}</span>
                    </Col>
                    <Col span={4}>
                        <label htmlFor="">建设负责人:</label>
                        <span>{creator ? creator.person_name : ''}</span>
                    </Col>
                </Row>
                <Row style={{ margin: '10px 0' }}>
                    <Col span={8}>
                        <label htmlFor="">设计单位:</label>
                        <span>{subject ? subject.design_unit.name : ''}</span>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">图纸审查单位:</label>
                        <span>{subject ? subject.drawing_ch_unit.name : ''}</span>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">模型审查单位:</label>
                        <span>{subject ? subject.modal_ch_unit.name : ''}</span>
                    </Col>
                </Row>
                <Row style={{ margin: '10px 0' }}>
                    <Col span={8}>
                        <label htmlFor="">设计负责人:</label>
                        <span>{subject ? subject.plan_writer.person_name : ''}</span>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">图纸审查负责人:</label>
                        <span>{subject ? subject.drawing_checker.person_name : ''}</span>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">模型审查负责人:</label>
                        <span>{subject ? subject.model_checker.person_name : ''}</span>
                    </Col>
                </Row>
                <Row style={{ margin: '10px 0' }}>
                    <Table columns={columns} pagination={false} size="small" dataSource={this.state.data} />
                    {!readonly ? (
                        <div style={{ padding: '10px', textAlign: 'center' }}>
                            <Button onClick={this.addPlan}>新增</Button>
                        </div>
                    ) : (
                        ''
                    )}
                </Row>
                {!readonly ? (
                    <Row style={{ margin: '10px 0' }}>
                        备注:
                        <Input
                            type="textarea"
                            placeholder=""
                            disabled={readonly}
                            autosize={{ minRows: 2 }}
                            value={this.state.mark}
                            onChange={e => {
                                this.setState({ mark: e.target.value });
                            }}
                        />
                    </Row>
                ) : (
                    ''
                )}
                {readonly && this.state.attachmentFile ? (
                    <Row>
                        附件:
                        <a href={DOWNLOAD_FILE + this.state.attachmentFile.download_url}>
                            {this.state.attachmentFile.name}
                        </a>
                    </Row>
                ) : (
                    ''
                )}
                {!readonly ? (
                    <Row>
                        附件:
                        {this.state.attachmentFile ? (
                            <p>
                                {this.state.attachmentFile.name}
                                <a
                                    href="javascript:;"
                                    style={{ marginLeft: '5px' }}
                                    onClick={() => {
                                        this.setState({ attachmentFile: '' });
                                    }}
                                >
                                    删除
                                </a>
                            </p>
                        ) : (
                            ''
                        )}
                        <Dragger
                            style={{ height: '50px' }}
                            isShowProgress={true}
                            accept={null}
                            onChange={val => {
                                this.setState({ attachmentFile: val });
                            }}
                        >
                            <p>支持上传word、pdf等格式文档</p>
                            <p className="ant-upload-text">点击或者拖拽开始上传</p>
                        </Dragger>
                    </Row>
                ) : (
                    ''
                )}
                <Row style={{ marginTop: 10 }}>
                    <WorkFlowHistory wk={selectedWK} />
                </Row>
            </div>
        );
    }
}

export default FillPlanPanel;
