/*
图纸页 
 */
import React, {Component} from 'react';
import {Table,Radio,Popover} from 'antd';
import {DOWNLOAD_FILE,PDF_FILE_API} from '../../../_platform/api';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


class DrawingTab extends Component{
    state={
        designStageEnum:{},
        columns: [
            {title: '卷册编号', dataIndex: 'juance', key: 'juance'},
            {title: '图纸卷册名称', dataIndex: 'name', key: 'name'},
            {title: '设计模型名称', dataIndex: 'modelName', key: 'modelName'},
            {title: '专业', dataIndex: 'profession', key: 'profession'},
            {title: '设计阶段', dataIndex: 'stage', key: 'stage',render:(text)=>{
                const {designStageEnum} = this.state;
                return designStageEnum[text];
            }},
            {title: '版本', dataIndex: 'version', key: 'version'},
            {title: '设计单位', dataIndex: 'designUnit', key: 'designUnit',render:(text)=>{
                return text?text.name:'';
            }},
            {title: '项目负责人', dataIndex: 'projectPrincipal', key: 'projectPrincipal',
                render:(text,record,index)=>{
                    return text.person_name?text.person_name:text;
                }
            },
            {title: '专业负责人', dataIndex: 'professionPrincipal', key: 'professionPrincipal',
                render:(text,record,index)=>{
                    return text.person_name?text.person_name:text;
                }
            },
            {title: '交付时间', dataIndex: 'actualDeliverTime', key: 'actualDeliverTime'},
            {title: '操作',dataIndex:'action',key:'action',render:(text,record)=>{
                let pdfs = this.getPDFFiles(record)
                return <span>
                        <Popover content={this.genDownload(record)}
                        placement="left">
                        <a href="javascript:;">下载</a>
                        </Popover>
                <span className="ant-divider"/>
                {pdfs.length?
                    <Popover content={this.genPreview(pdfs)}
                    placement="left">
                    <a href="javascript:;">预览</a>
                    </Popover>:''
                }
                </span>
            }}
        ],
        pagination:{
            pageSize:10,
            current:1,
            total:0
        },
        tabIndex:'1',
        data:[]
    }

    componentWillReceiveProps(nextProps){
        let {unit} = nextProps;
        if(unit !== this.props.unit){
            this.getData(1,unit);
        }
    }

    getPDFFiles = (text)=>{
        let res = [];
        if(text.CAD && text.CAD.name.indexOf('.pdf')!=-1){
            res.push(text.CAD);
        }
        if(text.PDF && text.PDF.name.indexOf('.pdf')!=-1){
            res.push(text.PDF);
        }
        if(text.BIM && text.BIM.name.indexOf('.pdf')!=-1){
            res.push(text.BIM);
        }
        if(text.attachmentFile && text.attachmentFile.name.indexOf('.pdf')!=-1){
            res.push(text.attachmentFile);
        }
        return res;
    }

    genPreview = (pdfs)=>{
        return (<div>
            {
                pdfs.map((pdf,i)=>{
                    return <p key={i}><a href='javascript:;' onClick={()=>{
                        let file = Object.assign({},pdf,{a_file:PDF_FILE_API + pdf.a_file});
                        this.previewFile(file)
                    }}>{pdf.name}</a></p>
                })
            }
        </div>)
    };

    previewFile(file){
        const {openPreview} = this.props.actions;
        openPreview(file);
    }

    genDownload = (text)=>{
        return (<div>
            {text.CAD?
                <p><a href={DOWNLOAD_FILE+text.CAD.download_url}>CAD:{text.CAD.name}</a></p>:''}
            {text.PDF?
                <p><a href={DOWNLOAD_FILE+text.PDF.download_url}>PDF:{text.PDF.name}</a></p>:''}
            {text.BIM?
                <p><a href={DOWNLOAD_FILE+text.BIM.download_url}>BIM:{text.BIM.name}</a></p>:''}
            {text.attachmentFile?
                <p><a href={DOWNLOAD_FILE+text.attachmentFile.download_url}>附件:{text.attachmentFile.name}</a></p>:''}
        </div>)
    };

    componentDidMount(){
        this.getData(1,this.props.unit);
        const {getDesignStage} = this.props.actions;
        getDesignStage().then((payload)=>{
            const {metalist} = payload;
            let designStageEnum = {};
            if(metalist){
                metalist.forEach(m=>{
                    designStageEnum[m.code] = m.name;
                });
            }
            this.setState({designStageEnum});
        });
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.getData(pagination.current,this.props.unit);
    };

    getData=(page,unit)=>{
        const {pagination,tabIndex} = this.state;
        let status = tabIndex === '1'?3:2;
        if(unit){
            const {getWks,getDocumentList} = this.props.actions;
            //获取流程信息
            getWks({code:'TEMPLATE_015'},{
                order_by:'-real_start_time',
                status:status,
                subject_unit__contains:unit.code,
                pagination:true,
                page_size:pagination.pageSize,
                page:page}).then((response)=>{
                    pagination.current = page;
                    pagination.total = response.count;
                    this.setState({pagination});
                    let reportWks = response.data;
                    let  drawingCodes = reportWks.map(wk=>{
                        let sb = wk.subject[0];
                        sb.planitem = JSON.parse(sb.planitem);
    
                        let docCode = sb.planitem.id;
                        return docCode;
                    })
                    let data = [];
                    //获取图纸信息
                    getDocumentList({}, {key_type: 'code', list: drawingCodes.join()})
                        .then((result)=>{
                            let drs = result.result;
                            drs.forEach((drawing,i)=>{
                                let wk = reportWks.find(w=>w.subject[0].planitem.id == drawing.code);
                                let extra = drawing.extra_params;
                                extra.xuhao = i + 1;
                                extra.key = drawing.code;
                                extra.processId = wk ? wk.id : '';
                                extra.stage = wk.subject[0].stage;
                                data[i] = extra;
                            })
                            this.setState({data});
                        })
                });
        }
    }

    render(){
        const {data=[],pagination} = this.state;
        return (
            <div style={{padding:'0 10px'}}>
                <RadioGroup defaultValue="1" size="small" onChange={(e)=>{
                    let val = e.target.value;
                    this.setState({tabIndex:val},()=>{
                        this.getData(1,this.props.unit);
                    });
                }}>
                    <RadioButton value="1">已交付图纸</RadioButton>
                    <RadioButton value="2">待交付图纸</RadioButton>
                </RadioGroup>
                <div>
                    <Table columns={this.state.columns} size="small" 
                 pagination={pagination}
                 dataSource={data} 
                 onChange={this.handleTableChange}
                 ></Table>
                </div>
                
            </div>
        )
    }
}

export default DrawingTab;

