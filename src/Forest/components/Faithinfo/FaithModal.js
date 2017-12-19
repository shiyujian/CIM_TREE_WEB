import React, {Component} from 'react';
import {Icon, Table, Spin,Tabs,Modal,Row,Col,Select,Button,Input,InputNumber,Progress,message} from 'antd';
import moment from 'moment';
import { FOREST_API} from '../../../_platform/api';
import '../index.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;

export default class FaithModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tblData: [],
        	pagination: {},
        	loading: false,
            loading1: true,
        	size:10,
        	exportsize: 100,
        	leftkeycode: '',
			section: '',
    		treety: '',
    		treetype: '',
    		treetypename: '',
    		integrity: '',
    		percent:0,
    		nurseryname: '',
		}
	}

    componentWillReceiveProps(nextProps) {
        const {honestyList = []} = nextProps;
        if(honestyList.length != 0){
            this.setState({
                loading1:false
            })
        }else{
            this.setState({
                loading1:true
            })
        }
    }

	render(){
		const {tblData} = this.state;
		const {
			faith:{visibleModal} = false,
            honestyList = [],
            nurseryName =  ""
		} = this.props;
        let newList = [];
        honestyList.map((item) => {
            item.map((it,index)=>{
                it.order = index + 1;
                newList.push(it);
            })
        })
		return (
			<Modal
				closable = {false}
				visible = {visibleModal}
				onOk={this.hideModal.bind(this)}
		        onCancel={this.hideModal.bind(this)}
		        okText="确认"
		        cancelText="取消"
			>
                <Row>
                    <Col span={20}>
                        {`${nurseryName} 诚信度详情`}
                    </Col>
                    <Col span={2}>
        				<Button type='primary' onClick={this.exportexcel.bind(this)}>
        					导出
        				</Button>
                    </Col>
                </Row>
                <Row>
    				<Table bordered
    					className='foresttable'
    					columns={this.columns}
                        rowKey='order'
    					loading={{tip:<Progress style={{width:200}} percent={this.state.percent} status="active" strokeWidth={5}/>,spinning:this.state.loading1}}
    					locale={{emptyText:'当天无信息'}}
    					dataSource={newList}
				    />
                </Row>
			</Modal>
		)
	}
	
	columns = [{
			title:"序号",
			dataIndex: 'order',
		},{
			title:"标段",
			dataIndex: 'section',
		},{
			title:"树种",
			dataIndex: 'treetype',
		},{
			title:"诚信度",
			dataIndex: 'integrity',
		}];

	hideModal() {
	    const {actions:{changeModal1}} = this.props;
    	changeModal1(false);
	}

    exportexcel() {
        const {
            section = '',
            treetype = '',
            integrity = '',
        } = this.state;
        const {
            actions: {getHonestyNewDetailModal, getexportTree},
            keycode = '',
            nurseryName = '',
        } = this.props;
        
        let postdata = {
            nurseryname: nurseryName
        }
        this.setState({loading:true,percent:0})
        getHonestyNewDetailModal({}, postdata)
        .then(result => {
            if(!result) {
                this.setState({loading:false,percent:100})
                return
            }
            if(result instanceof Array) {
                let data = result[0].map((plan, i) => {
                    return [
                        ++i,
                        plan.section || '/',
                        plan.treetype || '/',
                        plan.integrity || '',
                    ]
                })
                const postdata = {
                    keys: ["序号", "标段", "树种" , "诚信度"],
                    values: data
                }
                getexportTree({},postdata)
                .then(rst3 => {
                    this.setState({loading:false,percent:100})
                    let url = `${FOREST_API}/${rst3.file_path}`
                    this.createLink("excel_link", url);
                })
            } else {
                this.setState({loading:false,percent:100})
            }
        })
    }

	createLink(name,url) {
        let link = document.createElement("a");
        // link.download = name;
        link.href = url;
        link.setAttribute('download', name);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

}