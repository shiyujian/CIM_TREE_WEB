import React, {Component} from 'react';
import {DynamicTitle} from '_platform/components/layout';
import {actions as platformActions} from '_platform/store/global';
import {actions} from '../store/dataMaintenance';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Table, Upload, Button, Row, Col, Modal, message, Select, Card, Input, TreeSelect, Radio, DatePicker, Icon } from 'antd';
import {WORKT,SERVICE_API,NODE_FILE_EXCHANGE_API} from '_platform/api';

const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
@connect(
    state => {
        const {cost:{dataMaintenance = {jxka:'1213'}},platform} = state;
        return {...dataMaintenance,platform};
    },
    dispatch => ({
        actions: bindActionCreators({...actions,...platformActions}, dispatch),
    }),
)
export default class WorkEstimate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],
            editable: {}
        }    
        this.header = ['主要材料',"材料编码","是否甲供","单位","进货批次/编码"
                        ,"进货日期","计划使用时间","理论使用量","实际进货量","进货价格","材料实际使用总量",
                        "实际费用","库存量"];
        this.editCache = {};

        this.columns = [{
            title: '主要材料',
            dataIndex: 'material',
            key: 'material',
            subProject:'',//分部
            render: (text, record, index) => {
                return (
                        <div>
                        {
                            this.state.editable[index] ?
                            <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'material', e.target.value)} />
                            :
                            <span>{text}</span>
                        }
                        </div>
                    );
            }
          }, {
            title: '材料编码',
            dataIndex: 'materialCode',
            key: 'materialCode',
            render: (text, record, index) => {
                return (
                        <div>
                        {
                            this.state.editable[index] ?
                            <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'materialCode', e.target.value)} />
                            :
                            <span>{text}</span>
                        }
                        </div>
                    );
            }
          }, {
            title: '是否甲供',
            dataIndex: 'PartyA',
            key: 'PartyA',
            render: (text, record, index) => {
                return (
                        <div>
                        {
                            this.state.editable[index] ?
                            <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'PartyA', e.target.value)} />
                            :
                            <span>{text}</span>
                        }
                        </div>
                    );
            }
          },{
            title: '单位',
            dataIndex: 'unit',
            key: 'unit',
            render: (text, record, index) => {
                return (
                        <div>
                        {
                            this.state.editable[index] ?
                            <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'unit', e.target.value)} />
                            :
                            <span>{text}</span>
                        }
                        </div>
                    );
            }
          }, {
            title: '进货批次/编码',
            dataIndex: 'layer',
            key: 'layer',
            render: (text, record, index) => {
                return (
                        <div>
                        {
                            this.state.editable[index] ?
                            <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'layer', e.target.value)} />
                            :
                            <span>{text}</span>
                        }
                        </div>
                    );
            }
          }, {
            title: '进货日期',
            dataIndex: 'purchaseDate',
            key: 'purchaseDate',
            render: (text, record, index) => {
                return (
                    <div>
                    {
                        this.state.editable[index] ?
                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'purchaseDate', e.target.value)} />
                        :
                        <span>{text}</span>
                    }
                    </div>
                );
            }
          },{
            title: '计划使用时间',
            dataIndex: 'planDate',
            key: 'planDate',
            render: (text, record, index) => {
                return (
                    <div>
                    {
                        this.state.editable[index] ?
                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'planDate', e.target.value)} />
                        :
                        <span>{text}</span>
                    }
                    </div>
                );
            }
          },{
            title: '理论使用量',
            dataIndex: 'theoreticalUse',
            key: 'theoreticalUse',
            render: (text, record, index) => {
                return (
                    <div>
                    {
                        this.state.editable[index] ?
                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'theoreticalUse', e.target.value)} />
                        :
                        <span>{text}</span>
                    }
                    </div>
                );
            }
          },{
            title: '实际进货量',
            dataIndex: 'actualQuantity',
            key: 'actualQuantity',
            render: (text, record, index) => {
                return (
                    <div>
                    {
                        this.state.editable[index] ?
                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'actualQuantity', e.target.value)} />
                        :
                        <span>{text}</span>
                    }
                    </div>
                );
            }
          },{
            title: '进货价格',
            dataIndex: 'primeCost',
            key: 'primeCost',
            render: (text, record, index) => {
                return (
                    <div>
                    {
                        this.state.editable[index] ?
                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'primeCost', e.target.value)} />
                        :
                        <span>{text}</span>
                    }
                    </div>
                );
            }
          },{
            title: '材料实际使用总量',
            dataIndex: 'actualAmount',
            key: 'actualAmount',
            render: (text, record, index) => {
                return (
                    <div>
                    {
                        this.state.editable[index] ?
                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'actualAmount', e.target.value)} />
                        :
                        <span>{text}</span>
                    }
                    </div>
                );
            }
          },{
            title: '实际费用',
            dataIndex: 'actualCost',
            key: 'actualCost',
            render: (text, record, index) => {
                return (
                    <div>
                    {
                        this.state.editable[index] ?
                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'actualCost', e.target.value)} />
                        :
                        <span>{text}</span>
                    }
                    </div>
                );
            }
          },{
            title: '库存量',
            dataIndex: 'inventory',
            key: 'inventory',
            render: (text, record, index) => {
                return (
                    <div>
                    {
                        this.state.editable[index] ?
                        <Input type="text" defaultValue={text} onChange={(e) => this.handleEdit(index, 'inventory', e.target.value)} />
                        :
                        <span>{text}</span>
                    }
                    </div>
                );
            }
          },{
            title: '编辑',
            dataIndex: 'edit',
            key: 'edit',
            width: 100,
            render: (text, record, index) => {
                return (
                  <div>
                    {
                        this.state.editable[index]  ?
                        <div >
                          <a title='保存' onClick={ () => this.changeEditState('save', index) } ><Icon type="save" ></Icon></a>
                          <span style={ { color: '#DEDEDE', display: 'inline-block', padding: '0 5px', transform: 'scale(1, 0.6)' } } > | </span>
                          <a title='取消' onClick={ () => this.changeEditState('cancel', index) } ><Icon type="cross" ></Icon></a>
                        </div>
                        :
                        <div >
                            <span style={ { color: '#DEDEDE', display: 'inline-block', padding: '0 5px', transform: 'scale(1, 0.6)' } } >  </span>
                            <a title='编辑' onClick={ () => this.changeEditState('edit', index) } ><Icon type="edit" ></Icon></a>
                        </div>
                    }
                  </div>
                );
            }   
          }];
    }
    //表格操作
    handleEdit(index, key, value ,type) {
    // 暂存编辑中数据
    // if(type == 1){
        if (!this.editCache[index]) {
            this.editCache[index] = { ...this.state.tableData[index] };
        }
        this.editCache[index][key] = value;
    }
    changeEditState(type, index, record) {
        switch (type) {
            case 'edit':
            this.setState({
                editable: { ...this.state.editable, [index]: true },
            });
            break;
            case 'save':
                // 如果有更新, 则更新数据
                // 发送异步请求也在这里
                // 需要注意重复点击, 请自行控制
                if(!this.editCache[index]){
                    this.setState({
                        editable: { ...this.state.editable, [index]: false },
                    });
                    return;
                }
                let self = this;
                let dataSource = this.state.tableData;
                dataSource[index] = this.editCache[index];
                this.setState({
                    editable: { ...this.state.editable, [index]: false, tableData: dataSource },
                });


            break;
            case 'cancel':
                // 清空数据缓存
                this.editCache[index] = undefined;
                this.setState({
                    editable: { ...this.state.editable, [index]: false },
                });
            break;
            default:
            break;
        }
    }
    //提交
    submit(){
        const {actions:{updateWpData}} = this.props;
        let {tableData,subProject} = this.state;
        let data = {};
        let data_list = [];
        let extra = {};
        extra['workEstimate'] = tableData;
        let temp = {
            pk:subProject,
            'extra_params':extra
        }
        data_list.push(temp);
        data['data_list'] = data_list;
        updateWpData({},data).then(rst => {
            console.log(rst);
            message.info('导入成功');
            /*if(rst.result.length === tableData.length){
                
            }*/
        })
    }
    //下载
    createLink = (name, url) => {    //下载
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', this);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    // 下载
    downloadT(){
        let {type} = this.props;
        this.createLink(this,WORKT);
        
    }
    //下拉款选择变化
    handleChange(value) {
        const {actions:{getEstimateData}} = this.props;
        getEstimateData({pk:value}).then((rst) => {
            //console.log(rst);
            let tableData = rst.extra_params.workEstimate || [];
            this.setState({tableData,subProject:value});
        });
    }
    //将Excel数据解析
    dealExcelData(data){
        let {tableData} = this.state;
        data.map((item,index) => {
            if(index > 1 ){
                let temp = {};
                temp = {
                    material: item[0],
                    materialCode: item[1],
                    PartyA: item[2],
                    unit: item[3],
                    layer: item[4],
                    purchaseDate: item[5],
                    planDate:item[6],
                    theoreticalUse:item[7],
                    actualQuantity:item[8],
                    primeCost:item[9],
                    actualAmount:item[10],
                    actualCost:item[11],
                    inventory:item[12],
                }
                tableData[index-2] = {...temp};
            }
        })
        this.setState({tableData});
    }
    //数据导出
    getExcel(){
        let {actions:{jsonToExcel}} = this.props;
        const {tableData} = this.state;
        let rows = [];
        rows.push(this.header);
        tableData.map(item => {
            rows.push(this.objToArray(item,this.columns));
        })
        jsonToExcel({},{rows:rows}).then(rst => {
            console.log(NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
            this.createLink(this,NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
        })
    }
    //将对象按照一定顺序转化为数组
    objToArray(o,columns){
        return columns.map(item => {
            return o[item.dataIndex];
        })
    }
    render() {
        const { subsection=[] } = this.props;
        let jthis = this;
        //上传
        const props = {
            name: 'file',
            action: `${SERVICE_API}` + '/excel/upload-api/' /*+ '?t_code=zjt-05'*/,
            headers: {
            },
            showUploadList: false,
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    let importData = info.file.response.Sheet1;
                    console.log(info.file.response);
                    jthis.dealExcelData(importData);
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name}解析失败，请检查输入`);
                }
            },
        };
        return (
            <div>
                <DynamicTitle title="重要工程量预估" {...this.props}/>
                <div style={{marginLeft:'22px'}}>
                    <Card>
                        <h3 style={{marginBottom:'10px'}}>单位/分部工程选择</h3>
                        <Row>
                            <Col span={10}>
                                <label style={{marginRight:'10px'}}>单位工程名称:</label>  
                                <Select style={{width:'200px',marginRight:'20px'}} value={this.state.subProject} onChange={this.handleChange.bind(this)}>
                                    {
                                        subsection.map((item) => {
                                            return <Option value={item.pk}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            </Col>
                        </Row>
                    </Card>
                    <Card>
                        <h3 style={{marginBottom:'10px'}}>主材料对照统计表</h3>
                        <Row style={{marginBottom:'10px'}}>
                            <Upload {...props} style={{marginRight:'15px'}}>
                                <Button type="primary" style={{marginBottom:'10px'}}>
                                    <Icon type="upload" /> 批量导入
                                </Button>
                            </Upload>
                            <Button type="primary"  onClick={this.downloadT.bind(this)} style={{marginRight:'15px'}} >模板下载</Button>
                            <Button type="primary"  onClick={this.getExcel.bind(this)} >数据导出</Button>
                        </Row>
                        <Table columns={this.columns} dataSource={this.state.tableData}/>
                </Card>
                <Row style={{marginTop:'10px'}}><Col span={4}><Button type="primary" onClick={this.submit.bind(this)}>提交</Button></Col></Row>
                </div>
            </div>
        );
    }
}
