import React, { Component } from 'react';
import {
    Icon,
    Table,
    Row,
    Col,
    Select,
    Button,
    Input,
    Progress,
    message
} from 'antd';
import { FOREST_API } from '../../../_platform/api';
import '../index.less';

export default class FaithinfoTable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            imgvisible: false,
            tblData: [],
            loading: false,
            loading1: false,
            leftkeycode: '',
            pagination: {},
            section: '',
            bigType: '',
            treetype: '',
            treetypename: '',
            percent: 0,
            visible: false,
            factory: ''
        };
    }
    componentDidMount () {
        console.log('hi man i am here again!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    }
    componentWillUnmount () {
        console.log('oh why you got destroy');
    }

    render () {
        const { tblData } = this.state;
        return <div>{this.treeTable(tblData)}</div>;
    }
    treeTable (details) {
        const {
            sectionoption,
            typeoption
        } = this.props;
        const { factory, section, bigType } = this.state;
        // 清除
        const suffix = factory ? (
            <Icon type='close-circle' onClick={this.emitEmpty} />
        ) : null;
        let columns = [];
        let header = '';
        columns = [
            {
                title: '序号',
                dataIndex: 'order',
                width: '5%'
            },
            {
                title: '供应商',
                dataIndex: 'Factory',
                width: '26%'
            },
            {
                title: '树种',
                dataIndex: 'TreeTypeName',
                width: '52%'
            },
            {
                title: '总诚信度',
                dataIndex: 'Sincerity',
                width: '8%',
                render: (text, record) => {
                    return <span>{text.toFixed(2) * 1}</span>;
                }
            },
            {
                title: '详情',
                render: record => {
                    return (
                        <div>
                            <a
                                onClick={this.showModal.bind(
                                    this,
                                    record.Factory
                                )}
                            >
                                详情
                            </a>
                        </div>
                    );
                }
            }
        ];
        header = (
            <div>
                <Row className='forest-search-layout'>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>标段：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={section}
                            onChange={this.onSectionChange.bind(this)}
                        >
                            {sectionoption}
                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>类型：</span>
                        <Select
                            allowClear
                            className='forest-forestcalcw4'
                            defaultValue='全部'
                            value={bigType}
                            onChange={this.onTypeChange.bind(this)}
                        >
                            {typeoption}
                        </Select>
                    </div>
                    <div className='forest-mrg10'>
                        <span className='forest-search-span'>供应商：</span>
                        <Input
                            suffix={suffix}
                            value={factory}
                            className='forest-forestcalcw4'
                            onChange={this.factorychange.bind(this)}
                        />
                    </div>
                </Row>
                <Row>
                    <Col span={2}>
                        <Button
                            type='primary'
                            onClick={this.handleTableChange.bind(this, {
                                current: 1
                            })}
                        >
                            查询
                        </Button>
                    </Col>
                    <Col span={20}>
                        <Button
                            type='primary'
                            style={{ display: 'none' }}
                            onClick={this.exportexcel.bind(this)}
                        >
                            导出
                        </Button>
                    </Col>
                    <Col span={2}>
                        <Button
                            type='primary'
                            onClick={this.resetinput.bind(this)}
                        >
                            重置
                        </Button>
                    </Col>
                </Row>
            </div>
        );
        return (
            <div>
                <Row>{header}</Row>
                <Row>
                    <Table
                        bordered
                        className='foresttable'
                        columns={columns}
                        rowKey='order'
                        loading={{
                            tip: (
                                <Progress
                                    style={{ width: 200 }}
                                    percent={this.state.percent}
                                    status='active'
                                    strokeWidth={5}
                                />
                            ),
                            spinning: this.state.loading
                        }}
                        locale={{ emptyText: '当天无信息' }}
                        dataSource={details}
                        pagination={this.state.pagination}
                        onChange={this.handleTableChange.bind(this)}
                    />
                </Row>
            </div>
        );
    }

    emitEmpty = () => {
        this.setState({ factory: '' });
    };
    showModal (name) {
        console.log('name', name);
        this.setState({ loading1: true });
        const {
            actions: {
                changeModal1,
                getHonestyNewDetail,
                clearList,
                nurseryName
            }
        } = this.props;
        getHonestyNewDetail({ name: name }).then(rst => {
            this.setState({ loading1: false });
        });
        clearList();
        nurseryName(name);
        changeModal1(true);
    }

    onSectionChange (value) {
        const { sectionSelect } = this.props;
        sectionSelect(value || '');
        this.setState({
            section: value || ''
        });
    }

    onTypeChange (value) {
        const { typeselect } = this.props;
        typeselect(value || '');
        this.setState({ bigType: value || '', treetype: '', treetypename: '' });
    }

    factorychange (value) {
        this.setState({ factory: value.target.value });
    }

    handleTableChange (pagination) {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        });
        this.query(pagination.current);
    }
    handleCancel () {
        this.setState({ imgvisible: false });
    }

    resetinput () {
        const { resetinput, leftkeycode } = this.props;
        resetinput(leftkeycode);
    }

    query (page) {
        const {
            section = '',
            bigType = '',
            treetype = '',
            factory = ''
        } = this.state;
        if ((section === '' || bigType === '') && factory === '') {
            message.info('请选择项目,标段及类型信息或输入供应商');
            return;
        }
        const {
            actions: { getHonestyNew },
            keycode = ''
        } = this.props;
        let postdata = {
            section,
            bigType,
            treetype,
            factory
        };
        this.setState({ loading: true, percent: 0 });
        getHonestyNew({}, postdata).then(rst => {
            this.setState({ loading: false, percent: 100 });
            if (!rst) return;
            let tblData = rst.content;
            if (tblData instanceof Array) {
                tblData.forEach((plan, i) => {
                    tblData[i].order = ++i;
                });
                this.setState({ tblData });
            }
        });
    }

    exportexcel () {
        const {
            treetype = '',
            factory = '',
            section = '',
            bigType = ''
        } = this.state;
        const {
            actions: { getexportFactoryAnalyseInfo }
        } = this.props;
        let postdata = {
            treetype,
            factory,
            section,
            bigType
        };
        this.setState({ loading: true, percent: 0 });
        getexportFactoryAnalyseInfo({}, postdata).then(rst3 => {
            if (rst3 === '') {
                message.info('没有符合条件的信息');
            } else {
                this.createLink(this, `${FOREST_API}/${rst3}`);
            }
            this.setState({ loading: false });
        });
    }

    // exportexcel() {
    // 	const {
    //    		treetype = '',
    //    		factory = '',
    //    		section = '',
    //    		bigType = '',

    //    	} = this.state;
    //    	const {actions: {getHonestyNew,getexportTree},keycode = ''} = this.props;
    //    	let postdata = {
    //    		treetype,
    //    		factory,
    //    		section,
    //    		bigType,
    //    	}
    //    	this.setState({loading:true,percent:0})
    //    	getHonestyNew({},postdata)
    //    	.then(result => {
    //            if(!result) {
    //            	this.setState({loading:false,percent:100})
    //    			return
    //    		}
    //    		if(result instanceof Array) {
    //    			let data = result.map((plan, i) => {

    //    				return [
    //    					++i,
    //    					plan.Factory || '/',
    //    					plan.TreeTypeName || '/',
    //    					plan.Sincerity || '',
    //    				]
    //    			})
    //     		const postdata = {
    //     			keys: ["序号", "供应商", "树种" , "总诚信度"],
    //     			values: data
    //     		}
    //     		getexportTree({},postdata)
    //     		.then(rst3 => {
    //     			console.log('rst3',rst3)
    //     			this.setState({loading:false,percent:100})
    //     			// window.location.href =
    //     		})
    //            } else {
    //            	this.setState({loading:false,percent:100})
    //            }
    //    	})
    // }

    createLink (name, url) {
        let link = document.createElement('a');
        // link.download = name;
        link.href = url;
        link.setAttribute('download', name);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
