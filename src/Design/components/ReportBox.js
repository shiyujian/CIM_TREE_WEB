/**
 * Created by tinybear on 17/9/1.
 */
import React, { Component } from 'react';
import { Row, Col, Button, message, Input, Popover } from 'antd';
import Dragger from '_platform/components/panels/Dragger';
import moment from 'moment';
import WorkFlowHistory from './WorkFlowHistory';
import { DOWNLOAD_FILE } from '_platform/api';

class ReportBox extends Component {
    state = {
        CAD: null,
        PDF: null,
        BIM: null,
        attachmentFile: null,
        selectedWK: null,
        busying: false,
        mark: '',
        isUploading: false,
    };

    componentDidMount() {
        let { CAD, PDF, BIM, attachmentFile, processId } = this.props.drawing.extra_params;
        this.setState({ CAD, PDF, BIM, attachmentFile });
        //获取流程
        const { getWorkflow } = this.props.actions;
        getWorkflow({ id: processId }).then(wk => {
            let subject = wk.subject[0];
            subject.model_checker = JSON.parse(subject.model_checker);
            subject.drawing_checker = JSON.parse(subject.drawing_checker);
            subject.design_unit = JSON.parse(subject.design_unit);
            subject.drawing_ch_unit = JSON.parse(subject.drawing_ch_unit);
            subject.modal_ch_unit = JSON.parse(subject.modal_ch_unit);
            this.setState({ selectedWK: wk });
        });
        this.getDesignStage();
    }

    getDesignStage = () => {
        const { getDesignStage } = this.props.actions;
        const { designStageEnum } = this.props.plan;
        if (!designStageEnum) {
            getDesignStage();
        }
    };

    componentWillReceiveProps(nextProps) {
        let { CAD, PDF, BIM, attachmentFile } = nextProps.drawing;
        this.setState({ CAD, PDF, BIM, attachmentFile });
    }

    onSubmit = () => {
        const { onSubmit, drawing } = this.props;
        const { selectedWK, isUploading } = this.state;
        let extra_params = drawing.extra_params;

        if (isUploading === true) {
            message.error('无法在文件上传中时进行提交');
            return;
        }
        extra_params.CAD = this.state.CAD;
        extra_params.PDF = this.state.PDF;
        extra_params.BIM = this.state.BIM;
        extra_params.attachmentFile = this.state.attachmentFile;
        extra_params.status = 0;
        extra_params.actualDeliverTime = moment().format('YYYY-MM-DD');
        extra_params.mark = this.state.mark;
        //指定审查人
        onSubmit(extra_params, selectedWK);
    };

    genDownload = text => {
        return (
            <div>
                {text.CAD ? (
                    <p>
                        <a href={DOWNLOAD_FILE + text.CAD.download_url}>CAD:{text.CAD.name}</a>
                    </p>
                ) : (
                    ''
                )}
                {text.PDF ? (
                    <p>
                        <a href={DOWNLOAD_FILE + text.PDF.download_url}>PDF:{text.PDF.name}</a>
                    </p>
                ) : (
                    ''
                )}
                {text.BIM ? (
                    <p>
                        <a href={DOWNLOAD_FILE + text.BIM.download_url}>BIM:{text.BIM.name}</a>
                    </p>
                ) : (
                    ''
                )}
                {text.attachmentFile ? (
                    <p>
                        <a href={DOWNLOAD_FILE + text.attachmentFile.download_url}>附件:{text.attachmentFile.name}</a>
                    </p>
                ) : (
                    ''
                )}
            </div>
        );
    };

    render() {
        const { drawing, project, unit, readonly } = this.props;
        const { designStageEnum } = this.props.plan;
        const { selectedWK, busying, mark } = this.state;
        const { professionPrincipal, projectPrincipal } = drawing.extra_params;
        let subject = selectedWK ? selectedWK.subject[0] : null;
        return (
            <div>
                {!readonly ? (
                    <Row>
                        <Button style={{ float: 'right' }} loading={busying} onClick={this.onSubmit}>
                            提交
                        </Button>
                    </Row>
                ) : (
                    ''
                )}
                <Row style={{ margin: '10px 0' }}>
                    <Col span={8}>
                        <label htmlFor="">项目名称:</label>
                        <span>{project ? project.label : ''}</span>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">单位工程:</label>
                        <span>{unit ? unit.label : ''}</span>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">设计阶段:</label>
                        <span>{subject && designStageEnum ? designStageEnum[subject.stage] : ''}</span>
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
                        <label htmlFor="">
                            图纸卷册编号: <span>{drawing.extra_params.juance}</span>
                        </label>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">
                            图纸卷册名称: <span>{drawing.extra_params.name}</span>
                        </label>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">
                            专业: <span>{drawing.extra_params.profession}</span>
                        </label>
                    </Col>
                </Row>
                <Row style={{ margin: '10px 0' }}>
                    <Col span={8}>
                        <label htmlFor="">
                            项目负责人:
                            <span>
                                {projectPrincipal.person_name ? projectPrincipal.person_name : projectPrincipal}
                            </span>
                        </label>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">
                            专业负责人:
                            <span>
                                {professionPrincipal.person_name
                                    ? professionPrincipal.person_name
                                    : professionPrincipal}
                            </span>
                        </label>
                    </Col>
                    <Col span={8}>
                        <label htmlFor="">
                            成果交付时间: <span>{drawing.extra_params.deliverTime}</span>
                        </label>
                    </Col>
                </Row>
                {readonly ? (
                    <Row style={{ margin: '10px 0' }}>
                        <label htmlFor="">成果下载:</label>
                        <Popover content={this.genDownload(drawing.extra_params)} placement="right">
                            <a href="javascript:;">下载</a>
                        </Popover>
                    </Row>
                ) : (
                    ''
                )}
                {!readonly ? (
                    <Row style={{ margin: '10px 0' }} gutter={16}>
                        <Col span={12}>
                            CAD图:
                            {this.state.CAD ? (
                                <p>
                                    {this.state.CAD.name}
                                    <a
                                        href="javascript:;"
                                        style={{ marginLeft: '5px' }}
                                        onClick={() => {
                                            this.setState({ CAD: null });
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
                                    this.setState({ CAD: val });
                                }}
                                handleUploading={status => {
                                    this.setState({isUploading: status})
                                }}
                            >
                                <p className="ant-upload-text">点击或者拖拽开始上传</p>
                            </Dragger>
                        </Col>
                        <Col span={12}>
                            PDF:
                            {this.state.PDF ? (
                                <p>
                                    {this.state.PDF.name}
                                    <a
                                        href="javascript:;"
                                        style={{ marginLeft: '5px' }}
                                        onClick={() => {
                                            this.setState({ PDF: null });
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
                                    this.setState({ PDF: val });
                                }}
                                handleUploading={status => {
                                    this.setState({isUploading: status})
                                }}
                            >
                                <p className="ant-upload-text">点击或者拖拽开始上传</p>
                            </Dragger>
                        </Col>
                    </Row>
                ) : (
                    ''
                )}
                {!readonly ? (
                    <Row style={{ margin: '10px 0' }} gutter={16}>
                        <Col span={12}>
                            BIM模型:
                            {this.state.BIM ? (
                                <p>
                                    {this.state.BIM.name}
                                    <a
                                        href="javascript:;"
                                        style={{ marginLeft: '5px' }}
                                        onClick={() => {
                                            this.setState({ BIM: null });
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
                                    this.setState({ BIM: val });
                                }}
                                handleUploading={status => {
                                    this.setState({isUploading: status})
                                }}
                            >
                                <p className="ant-upload-text">点击或者拖拽开始上传</p>
                            </Dragger>
                        </Col>
                        <Col span={12}>
                            附件:
                            {this.state.attachmentFile ? (
                                <p>
                                    {this.state.attachmentFile.name}
                                    <a
                                        href="javascript:;"
                                        style={{ marginLeft: '5px' }}
                                        onClick={() => {
                                            this.setState({ attachmentFile: null });
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
                                handleUploading={status => {
                                    this.setState({isUploading: status})
                                }}
                            >
                                <p className="ant-upload-text">点击或者拖拽开始上传</p>
                            </Dragger>
                        </Col>
                    </Row>
                ) : (
                    ''
                )}
                {!readonly ? (
                    <Row style={{ margin: '10px 0' }}>
                        <label htmlFor="">备注:</label>
                        <Input
                            type="textarea"
                            disabled={readonly}
                            value={mark}
                            onChange={e => {
                                this.setState({ mark: e.target.value });
                            }}
                        />
                    </Row>
                ) : (
                    ''
                )}
                <Row style={{ margin: '10px 0' }}>
                    <WorkFlowHistory wk={selectedWK} />
                </Row>
            </div>
        );
    }
}

export default ReportBox;
