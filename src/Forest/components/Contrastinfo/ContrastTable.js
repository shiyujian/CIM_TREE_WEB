import React, {Component} from 'react';
import {Icon, Table, Spin,Tabs,Modal,Row,Col,Select,DatePicker,Button,Input,InputNumber,Progress,message} from 'antd';
import moment from 'moment';
import { FOREST_API} from '../../../_platform/api';
import '../index.less';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {RangePicker} = DatePicker;

export default class ContrastTable extends Component {
	constructor(props) {
        super(props)
        this.state = {
        	imgvisible:false,
        	tblData: [],
        	pagination: {},
        	loading: false,
        	size:12,
        	exportsize: 100,
        	leftkeycode: '',
        	stime: moment().format('2017-11-23 00:00:00'),
			etime: moment().format('2017-11-23 23:59:59'),
			zzbm: '',
			section: '',
    		treety: '',
    		treetype: '',
    		treetypename: '',
    		factory: '',
    		isstandard: '',
    		percent:0,
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
			standardoption,
		} = this.props;
		const {
			zzbm, 
			factory,
			section,
			treety,
			treetypename,
			isstandard,
		} = this.state;
		//清除
		const suffix1 = zzbm ? <Icon type="close-circle" onClick={this.emitEmpty1} /> : null;
		const suffix2 = factory ? <Icon type="close-circle" onClick={this.emitEmpty2} /> : null;
		let columns = [];
		let header = '';
		columns = [{
			title:"序号",
			dataIndex: 'order',
		},{
			title:"编码",
			dataIndex: 'attrs.zzbm',
		},{
			title:"标段",
			dataIndex: 'section',
		},{
			title:"位置",
			dataIndex: 'place',
		},{
			title:"树种",
			dataIndex: 'treetype',
		},{
			title:"供苗商",
			dataIndex: 'factory',
		},{
			title:"苗圃名称",
			dataIndex: 'nurseryname',
		},{
			title: "起苗时间",
			render: (text,record) => {
				const {liftertime1 = '',liftertime2 = '' } = record;
				return <div><div>{liftertime1}</div><div>{liftertime2}</div></div>
			}
		},{
			title:<div><div>树高</div><div>(供苗商)</div></div>,
			render: (text,record) => {
				if(record.n_gd && record.n_gd != 0)
					return <a disabled={!record.n_gdfj} onClick={this.onImgClick.bind(this,record.n_gdfj)}>{record.n_gd}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>土球高度</div><div>(供苗商)</div></div>,
			render: (text,record) => {
				if(record.n_tqhd && record.n_tqhd != 0)
					return <a disabled={!record.n_tqhdfj} onClick={this.onImgClick.bind(this,record.n_tqhdfj)}>{record.n_tqhd}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>土球直径</div><div>(供苗商)</div></div>,
			render: (text,record) => {
				if(record.n_tqzj && record.n_tqzj != 0)
					return <a disabled={!record.n_tqzjfj} onClick={this.onImgClick.bind(this,record.n_tqzjfj)}>{record.n_tqzj}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>树高</div><div>(监理)</div></div>,
			render: (text,record) => {
				const {attrs = {} } = record;
				if(attrs.gd && attrs.gd != 0)
					return <a disabled={!attrs.gdfj} onClick={this.onImgClick.bind(this,attrs.gdfj)}>{attrs.gd}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>土球高度</div><div>(监理)</div></div>,
			render: (text,record) => {
				const {attrs = {} } = record;
				if(attrs.tqhd && attrs.tqhd != 0)
					return <a disabled={!attrs.tqhdfj} onClick={this.onImgClick.bind(this,attrs.tqhdfj)}>{attrs.tqhd}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title:<div><div>土球直径</div><div>(监理)</div></div>,
			render: (text,record) => {
				const {attrs = {} } = record;
				if(attrs.tqzj && attrs.tqzj != 0)
					return <a disabled={!attrs.tqzjfj} onClick={this.onImgClick.bind(this,attrs.tqzjfj)}>{attrs.tqzj}</a>
				else {
					return <span>/</span>
				}
			}
		},{
			title: "是否合标",
			render: (text,record) => {
				return <div>
					{
						record.isstandard == 1
						? <span>合标</span>
						: <span style={{color: 'red'}}>不合标</span>
					}
				</div>
			}
		},{
			title:"监理人",
			render: (text,record) => {
				const {attrs = {}}= record;
				return <span>{attrs.supervisor || '/'}</span>
				
			}
		}];
		header = <div >
					<Row>
						<Col xl={3} lg={4} md={5} className='mrg10'>
							<span>编码：</span>
							<Input suffix={suffix1} value={zzbm} className='forestcalcw2 mxw100' onChange={this.zzbmchange.bind(this)}/>
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
							<span>供苗商：</span>
							<Input suffix={suffix2} value={factory} className='forestcalcw3 mxw200' onChange={this.factorychange.bind(this)}/>
						</Col>
						<Col xl={4} lg={5} md={6} className='mrg10'>
							<span>是否合标：</span>
							<Select allowClear className='forestcalcw4 mxw100' defaultValue='全部' value={isstandard} onChange={this.standardchange.bind(this)}>
								{standardoption}
							</Select>
						</Col>
						<Col xl={10} lg={12} md={14} className='mrg10'>
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
					<Row >
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
						 locale={{emptyText:'当天无信息'}}
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
	    this.setState({factory: ''});
  	}

	zzbmchange(value) {
		this.setState({zzbm:value.target.value})
	}

	onsectionchange(value) {
		const {sectionselect} = this.props;
		const {treety} = this.state;
		sectionselect(value || '',treety)
		this.setState({section:value || '', treetype:'', treetypename:''})
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

    factorychange(value) {
		this.setState({factory: value.target.value})
	}

	standardchange(value) {
		this.setState({isstandard:value || ''})
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
        this.qury(pagination.current)
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
    		isstandard = '',
    		stime = '',
    		etime = '',
    		size,
    	} = this.state;
    	const {actions: {getfactoryAnalyse},keycode = ''} = this.props;
    	let postdata = {
    		no:keycode,
    		zzbm,
    		section,
    		treety,
    		treetype,
    		factory,
    		isstandard,
    		liftime_min:stime&&moment(stime).add(8, 'h').unix(),
    		liftime_max:etime&&moment(etime).add(8, 'h').unix(),
    		page,
    		per_page:size
    	}
    	this.setState({loading:true,percent:0})
    	getfactoryAnalyse({},postdata)
    	.then(rst => {
    		this.setState({loading:false,percent:100})
    		if(!rst)
    			return
    		let tblData = rst.result;
    		if(tblData instanceof Array) {
	    		tblData.forEach((plan, i) => {
	    			const {attrs = {}} = plan;
	    			tblData[i].order = ((page - 1) * size) + i + 1;
	    			let place = `${~~plan.land.replace('P','')}地块${~~plan.region}区块${~~attrs.smallclass}小班${~~attrs.thinclass}细班`;
	    			tblData[i].place = place;
					let liftertime1 = !!plan.liftertime ? moment(plan.liftertime).format('YYYY-MM-DD') : '/';
					let liftertime2 = !!plan.liftertime ? moment(plan.liftertime).format('HH:mm:ss') : '/';
					tblData[i].liftertime1 = liftertime1;
					tblData[i].liftertime2 = liftertime2;
	    		})
		    	const pagination = { ...this.state.pagination };
				pagination.total = rst.total;
				pagination.pageSize = size;
				this.setState({ tblData,pagination:pagination });	
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
    		isstandard = '',
    		stime = '',
    		etime = '',
    		exportsize,
    	} = this.state;
    	const {actions: {getfactoryAnalyse,getexportTree},keycode = ''} = this.props;
    	let postdata = {
    		no:keycode,
    		zzbm,
    		section,
    		treety,
    		treetype,
    		factory,
    		isstandard,
    		liftime_min:stime&&moment(stime).add(8, 'h').unix(),
    		liftime_max:etime&&moment(etime).add(8, 'h').unix(),
    		page:1,
    		per_page:exportsize
    	}
    	this.setState({loading:true,percent:0})
    	getfactoryAnalyse({},postdata)
    	.then(result => {
    		let rst = result.result;
    		let total = result.pages;
    		this.setState({percent:parseFloat((100/total).toFixed(2)),num:1});
    		if(total !== undefined) {
    			let all = [Promise.resolve(rst)];
    			for(let i=2; i<=total; i++)
                {
                	postdata.page = i;
                    all.push(getfactoryAnalyse({},postdata)
                        .then(rst1 => {
                            let {num} = this.state;
                            num++;
                            this.setState({percent:parseFloat((num*100/total).toFixed(2)),num:num});
                            if(!rst1) {
                            	message.error(`数据获取失败,丢失100条数据`)
				    			return []
				    		} else {
                            	return rst1.result
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
		    				let place = `${~~plan.land.replace('P','')}地块${~~plan.region}区块${~~attrs.smallclass}小班${~~attrs.thinclass}细班`;
							let liftertime = !!plan.liftertime ? moment(plan.liftertime).format('YYYY-MM-DD HH:mm:ss') : '/';
							let isstandard = plan.isstandard == 1 ? '合标' : '不合标';
		    				return [
		    					++i,
		    					attrs.zzbm || '/',
		    					plan.section || '/',
		    					place,
		    					plan.treetype || '/',
		    					plan.factory || '',
		    					plan.nurseryname || '/',
		    					liftertime,
		    					plan.n_gd || '/',
		    					plan.n_tqhd || '/',
		    					plan.n_tqzj || '/',
		    					attrs.gd || '/',
		    					attrs.tqhd || '/',
		    					attrs.tqzj || '/',
		    					isstandard,
		    					attrs.supervisor || '/',
		    				]
		    			})
			    		const postdata = {
			    			keys: ["序号", "编码", "标段", "位置", "树种", "供苗商", "苗圃名称", "起苗时间", "树高（供苗商）","土球高度（供苗商）","土球直径（供苗商）","树高（监理）","土球高度（监理）","土球直径（监理）","是否合标", "监理人"],
			    			values: data
			    		}
			    		getexportTree({},postdata)
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