import React, {Component} from 'react';
import {Icon, Table, Spin,Tabs,Modal,Row,Col,Select,DatePicker,Button,Input,InputNumber,Progress,message,Cascader} from 'antd';
import moment from 'moment';
import { FOREST_API} from '../../../_platform/api';
import '../index.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class NursmeasureTable extends Component {
	constructor(props) {
        super(props)
        this.state = {
        	imgvisible:false,
        	tblData: [],
        	pagination: {},
        	loading: false,
        	size:10,
        	exportsize:100,
        	leftkeycode: '',
        	stime: moment().format('2017-11-23 00:00:00'),
			etime: moment().format('2017-11-23 23:59:59'),
			zzbm: '',
    		section: '',
    		treety: '',
    		treetype: '',
    		treetypename: '',
    		treeplace: '',
    		nurseryname: '',
    		factory: '',
    		role: 'inputer',
    		rolename: '',
    		percent: 0,
    		supervisorcheck: '',
    		checkstatus: '',
    		status: '',
        }
    }
    componentDidMount() {
    	
    }
    componentWillReceiveProps(nextProps){
    	if(nextProps.leftkeycode != this.state.leftkeycode) {
			this.setState({
				leftkeycode: nextProps.leftkeycode,
    		},()=> {
    			this.qury(1);
    		})
    	} 
    }
	render() {
		const {tblData} = this.state;
		return (
			<div>
				{this.treeTable(tblData)}
				<Modal
					width={522}
					title='详细信息'
					style={{textAlign:'center'}}
					visible={this.state.imgvisible}
					onOk={this.handleCancel.bind(this)}
					onCancel={this.handleCancel.bind(this)}
				>
					<img style={{width:"490px",height:"300px"}} src={this.state.src} alt="图片"/>
				</Modal>
			</div>
		);
	}
	treeTable(details) {
		const {
			treetypeoption,
			sectionoption,
			typeoption,
			leftkeycode,
			keycode,
			statusoption,
		} = this.props;
		const {
			zzbm, 
			rolename, 
			factory, 
			treeplace, 
			nurseryname,
			section,
			treety,
			treetypename,
			status,
		} = this.state;
		console.log('state', this.state)
		const suffix1 = zzbm ? <Icon type="close-circle" onClick={this.emitEmpty1} /> : null;
		const suffix2 = rolename ? <Icon type="close-circle" onClick={this.emitEmpty2} /> : null;
		const suffix3 = factory ? <Icon type="close-circle" onClick={this.emitEmpty3} /> : null;
		const suffix4 = treeplace ? <Icon type="close-circle" onClick={this.emitEmpty4} /> : null;
		const suffix5 = nurseryname ? <Icon type="close-circle" onClick={this.emitEmpty5} /> : null;
		let columns = [];
		let header = '';
		columns = [{
			title:"序号",
			dataIndex: 'order',
		},{
			title:"编码",
			dataIndex: 'zzbm',
		},{
			title:"标段",
			dataIndex: 'section',
		},{
			title:"树种",
			dataIndex: 'treetype',
		},{
			title:"产地",
			dataIndex: 'treeplace',
		},{
			title:"供苗商",
			dataIndex: 'factory',
		},{
			title:"苗圃名称",
			dataIndex: 'nurseryname',
		},{
			title:"填报人",
			dataIndex: 'inputer',
		},{
			title:"起苗时间",
			render: (text,record) => {
				const {liftertime1 = '',liftertime2 = '' } = record;
				return <div><div>{liftertime1}</div><div>{liftertime2}</div></div>
			}
		},{
			title:"状态",
			dataIndex: 'status',
		},{
			title:<div><div>树高</div><div>(cm)</div></div>,
			render: (text,record) => {
				const {attrs = {}}= record;
				if(attrs.gd != 0)
					return <a disabled={!attrs.gdfj} onClick={this.onImgClick.bind(this,attrs.gdfj)}>{attrs.gd}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>胸径</div><div>(cm)</div></div>,
			render: (text,record) => {
				const {attrs = {}}= record;
				if(attrs.xj != 0)
					return <a disabled={!attrs.xjfj} onClick={this.onImgClick.bind(this,attrs.xjfj)}>{attrs.xj}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>冠幅</div><div>(cm)</div></div>,
			render: (text,record) => {
				const {attrs = {}}= record;
				if(attrs.gf != 0)
					return <a disabled={!attrs.gffj} onClick={this.onImgClick.bind(this,attrs.gffj)}>{attrs.gf}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>地径</div><div>(cm)</div></div>,
			render: (text,record) => {
				const {attrs = {}}= record;
				if(attrs.dj != 0)
					return <a disabled={!attrs.djfj} onClick={this.onImgClick.bind(this,attrs.djfj)}>{attrs.dj}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>土球高度</div><div>(cm)</div></div>,
			dataIndex: 'tqhd',
			render: (text,record) => {
				const {attrs = {}}= record;
				if(attrs.tqhd != 0)
					return <a disabled={!attrs.tqhdfj} onClick={this.onImgClick.bind(this,attrs.tqhdfj)}>{attrs.tqhd}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>土球直径</div><div>(cm)</div></div>,
			dataIndex: 'tqzj',
			render: (text,record) => {
				const {attrs = {}}= record;
				if(attrs.tqzj != 0)
					return <a disabled={!attrs.tqzjfj} onClick={this.onImgClick.bind(this,attrs.tqzjfj)}>{attrs.tqzj}</a>
				else {
					return <span>/</span>
				}
			}
		}];
		header = <div >
					<Row >
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>编码：</span>
							<Input suffix={suffix1} value={zzbm}  className='forestcalcw2 mxw100' onChange={this.zzbmchange.bind(this)}/>
						</Col>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>标段：</span>
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={section} onChange={this.onsectionchange.bind(this)}>
								{sectionoption}
							</Select>
						</Col>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>类型：</span>
							<Select allowClear className='forestcalcw2 mxw100' defaultValue='全部' value={treety} onChange={this.ontypechange.bind(this)}>
								{typeoption}
							</Select>
						</Col>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>树种：</span>
							<Select allowClear showSearch className='forestcalcw2 mxw100' defaultValue='全部' value={treetypename} onChange={this.ontreetypechange.bind(this)}>
								{treetypeoption}
							</Select>
						</Col>
						<Col xl={5} lg={6} md={7} className='mrg10'>
							<span>苗圃：</span>
							<Input suffix={suffix5} value={nurseryname} className='forestcalcw2 mxw200' onChange={this.nurschange.bind(this)}/>
						</Col>
						<Col xl={4} lg={5} md={6} className='mrg10'>
							<span>填报人：</span>
							<Input suffix={suffix2} value={rolename} className='forestcalcw3 mxw150' onChange={this.onrolenamechange.bind(this)}/>
						</Col>
						<Col xl={5} lg={6} md={7} className='mrg10'>
							<span>供苗商：</span>
							<Input suffix={suffix3} value={factory} className='forestcalcw3 mxw200' onChange={this.factorychange.bind(this)}/>
						</Col>
						<Col xl={5} lg={6} md={7} className='mrg10'>
							<span>产地：</span>
							<Input suffix={suffix4} value={treeplace} className='forestcalcw2 mxw200' onChange={this.placechange.bind(this)}/>
						</Col>
						<Col xl={4} lg={5} md={6} className='mrg10'>
							<span>状态：</span>
							<Cascader 
								allowClear
								className='forestcalcw2 mxw150' 
								defaultValue={['']}
								// value={[status]}
								options={statusoption} 
								expandTrigger='hover' 
								onChange={this.onstatuschange.bind(this)} 
								changeOnSelect 
							/>
						</Col>
						<Col xl={10} lg={11} md={12} className='mrg10'>
							<span>起苗时间：</span>
							<RangePicker 
							 style={{verticalAlign:"middle"}} 
							 defaultValue={[moment(this.state.stime, 'YYYY-MM-DD HH:mm:ss'),moment(this.state.etime, 'YYYY-MM-DD HH:mm:ss')]} 
							 showTime={{ format: 'HH:mm:ss' }}
							 format={'YYYY/MM/DD HH:mm:ss'}
							 onChange={this.datepick.bind(this)}
							 onOk={this.datepick.bind(this)}
							>
							</RangePicker>
						</Col>
					</Row>
					<Row>
						<Col span={2} className='mrg10'>
							<Button type='primary' onClick={this.handleTableChange.bind(this,{current:1})}>
								查询
							</Button>
						</Col>
						<Col span={18} className='quryrstcnt mrg10'>
							<span >此次查询共有苗木：{this.state.pagination.total}棵</span>
						</Col>
						<Col span={2} className='mrg10'>
							<Button type='primary' onClick={this.resetinput.bind(this)}>
								重置
							</Button>
						</Col>
						<Col span={2} className='mrg10'>
							<Button type='primary' onClick={this.exportexcel.bind(this)}>
								导出
							</Button>
						</Col>
					</Row>
				</div> 
		return <div>
					<Row>
						{header}
					</Row>
					<Row>
						<Table bordered
						 className='foresttable'
						 columns={columns}  
						 rowKey='order'
						 loading={{tip:<Progress style={{width:200}} percent={this.state.percent} status="active" strokeWidth={5}/>,spinning:this.state.loading}}
						 locale={{emptyText:'当天无苗圃测量信息'}}
						 dataSource={details} 
						 onChange={this.handleTableChange.bind(this)}
						 pagination={this.state.pagination}
						/>
					</Row>
					
				</div>
	}

	emitEmpty1 = () => {
	    this.setState({zzbm: ''});
  	}

  	emitEmpty2 = () => {
	    this.setState({rolename: ''});
  	}

  	emitEmpty3 = () => {
	    this.setState({factory: ''});
  	}

  	emitEmpty4 = () => {
	    this.setState({treeplace: ''});
  	}

  	emitEmpty5 = () => {
	    this.setState({nurseryname: ''});
  	}

	zzbmchange(value) {
		this.setState({zzbm:value.target.value})
	}

	onsectionchange(value) {
		const {sectionselect} = this.props;
		const {treety} = this.state;
		sectionselect(value || '',treety)
		this.setState({section:value || '', treetype:'', treetypename: ''})
	}

	ontypechange(value) {
		const {typeselect,keycode = ''} = this.props;
		const {section} = this.state;
		typeselect(value || '',keycode,section)
		this.setState({treety:value || '', treetype:'', treetypename:''})
	}

	ontreetypechange(value) {
    	const {treetypelist} = this.props;
		let treetype = treetypelist.find(rst => rst.name == value)
		this.setState({treetype:treetype?treetype.oid:'',treetypename:value || ''})
    }

    onstatuschange(value) {    	
    	let status = '';
    	if (value.length === 2) {
    		switch(value[1]){
    			// 监理退回
				case "1": 
					status = 1;
					break;
				// 业主退回
				case "2": 
					status = 2;
					break;
				// 进场退回
				case "3": 
					status = 3;
					break;
				default:
					break;
			}
    	} else {
    		switch(value[0]) {
    			//已种植
    			case "0":
    				status = 0;
    				break;
    			//未种植
    			case "4":
    				status = 4;
    				break;
    			default:
    				break;
    		}
    	}
		this.setState({status: value[1] || value[0] || ''})
	}

	onrolenamechange(value) {
		this.setState({rolename:value.target.value})
	}

	factorychange(value) {
		this.setState({factory: value.target.value})
	}

	placechange(value) {
		this.setState({treeplace: value.target.value})
	}
	
	nurschange(value) {
		this.setState({nurseryname: value.target.value})
	} 
	datepick(value){
		this.setState({stime:value[0]?moment(value[0]).format('YYYY-MM-DD HH:mm:ss'):''})
		this.setState({etime:value[1]?moment(value[1]).format('YYYY-MM-DD HH:mm:ss'):''})
    }

	handleTableChange(pagination){
        const pager = { ...this.state.pagination};
        pager.current = pagination.current;
    	this.setState({
        	pagination: pager,
        });
        this.qury(pagination.current);
    }

	onImgClick(src) {
		src = src.replace(/\/\//g,'/')
		src =  `${FOREST_API}/${src}`
		this.setState({src},() => {
			this.setState({imgvisible:true,})
		})
	}

	handleCancel(){
    	this.setState({imgvisible:false})
    }

    resetinput(){
    	const {resetinput,leftkeycode} = this.props;
		resetinput(leftkeycode)
    }

    qury(page) {
    	const {
    		zzbm = '',
    		section = '',
    		treety = '',
    		treetype = '',
    		factory = '',
    		treeplace = '',
    		nurseryname = '',
    		role = '',
    		rolename = '',
    		stime = '',
    		etime = '',
    		size,
    		supervisorcheck = '',
    		checkstatus = '',
    		status = '',
    	} = this.state;
    	const {actions: {getnurserys},keycode = ''} = this.props;
    	let postdata = {
    		no:keycode,
    		zzbm,
    		section,
    		treety,
    		treetype,
    		factory,
    		treeplace,
    		nurseryname,
    		liftime_min:stime&&moment(stime).add(8, 'h').unix(),
    		liftime_max:etime&&moment(etime).add(8, 'h').unix(),
    		page,
    		per_page:size,
    		supervisorcheck,
    		checkstatus,
    		status,
    	}
    	if(!!role)
    		postdata[role] = rolename;
    	this.setState({loading:true,percent:0})
    	getnurserys({},postdata)
    	.then(rst => {
    		this.setState({loading:false,percent:100})
    		if(!rst)
    			return
    		let tblData = rst.results;
    		if(tblData instanceof Array) {
	    		tblData.forEach((plan, i) => {
	    			let status = plan.status;
	    			if(postdata.status === '0') 
	    				status = '已种植'
	    			else if(postdata.status === '1')
	    				status = '监理退回'
	    			else if(postdata.status === '2')
	    				status = '业主退回'
	    			else if(postdata.status === '3')
	    				status = '进场退回'
	    			else
	    				status = '未种植'
	    			tblData[i].status = status;
	    			tblData[i].order = ((page - 1) * size) + i + 1;
	    			tblData[i].liftertime1 = !!plan.liftertime ? moment(plan.liftertime).utc().format('YYYY-MM-DD') : '/';
					tblData[i].liftertime2 = !!plan.liftertime ? moment(plan.liftertime).utc().format('HH:mm:ss') : '/';
	    		})
		    	const pagination = { ...this.state.pagination };
				pagination.total = rst.total;
				pagination.pageSize = size;
				this.setState({ tblData,pagination });	
	    	}
    	})
    }

	exportexcel() {
		const {
    		zzbm = '',
    		section = '',
    		treety = '',
    		treetype = '',
    		factory = '',
    		treeplace = '',
    		nurseryname = '',
    		role = '',
    		rolename = '',
    		stime = '',
    		etime = '',
    		exportsize,
    		status = '',
    	} = this.state;
    	const {actions: {getnurserys,getexportTree},keycode = ''} = this.props;
    	let postdata = {
    		no:keycode,
    		zzbm,
    		section,
    		treety,
    		treetype,
    		factory,
    		treeplace,
    		nurseryname,
    		liftime_min:stime&&moment(stime).add(8, 'h').unix(),
    		liftime_max:etime&&moment(etime).add(8, 'h').unix(),
    		page: 1,
    		per_page: exportsize,
    		status,
    	}
    	if(!!role)
    		postdata[role] = rolename;
    	this.setState({loading:true,percent:0})
    	getnurserys({},postdata)
    	.then(result => {
    		let rst = result.results;
    		let total = result.pages;
    		this.setState({percent:parseFloat((100/total).toFixed(2)),num:1});
    		if(total !== undefined) {
    			let all = [Promise.resolve(rst)];
    			for(let i=2; i<=total; i++)
                {
                	postdata.page = i;
                    all.push(getnurserys({},postdata)
                        .then(rst1 => {
                            let {num} = this.state;
                            num++;
                            this.setState({percent:parseFloat((num*100/total).toFixed(2)),num:num});
                            if(!rst1) {
                            	message.error(`数据获取失败,丢失100条数据`)
				    			return []
				    		} else {
                            	return rst1.results
                            }
                        }))
                }
    			Promise.all(all)
                .then(rst2 => {
                    if(!rst2) {
                    	this.setState({loading:false})
		    			return
		    		}
		    		let allData = rst2.reduce((a,b) => {
                        return a.concat(b)
                    })
		    		if(allData instanceof Array) {
		    			let data = allData.map((plan, i) => {
		    				const {attrs = {}}= plan;
		    				let liftertime = !!plan.liftertime ? moment(plan.liftertime).utc().format('YYYY-MM-DD HH:mm:ss') : '/';
		    				let status = plan.status;
			    			if(postdata.status === '0') 
			    				status = '已种植'
			    			else if(postdata.status === '1')
			    				status = '监理退回'
			    			else if(postdata.status === '2')
			    				status = '业主退回'
			    			else if(postdata.status === '3')
			    				status = '进场退回'
			    			else
			    				status = '未种植'
		    				return [
		    					++i,
		    					plan.zzbm || '/',
		    					plan.section || '/',
		    					plan.treetype || '/',
		    					plan.treeplace || '/',
		    					plan.factory || '/',
		    					plan.nurseryname || '/',
		    					plan.inputer || '/',
		    					liftertime,
		    					plan.status = status,
		    					attrs.gd || '/',
		    					attrs.xj || '/',
		    					attrs.gf || '/',
		    					attrs.dj || '/',
		    					attrs.tqhd || '/',
		    					attrs.tqzj || '/',
		    				]
		    			})
			    		const postdata1 = {
			    			keys: ["序号", "编码", "标段", "树种", "产地","供苗商", "苗圃名称", "填报人","起苗时间","状态","树高（cm）", "胸径（cm）", "冠幅（cm）", "地径（cm）", "土球高度（cm）", "土球直径（cm）"],
			    			values: data
			    		}
			    		getexportTree({},postdata1)
			    		.then(rst3 => {
			    			this.setState({loading:false})
			    			let url = `${FOREST_API}/${rst3.file_path}`
							this.createLink("excel_link", url);
			    		})
                    } else {
                    	this.setState({loading:false})
                    }
    		    })
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