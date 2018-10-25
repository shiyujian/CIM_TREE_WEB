import React, {Component} from 'react';
import { Form, Button, Card, Row, Col, Table, Modal } from 'antd';
import { CULTIVATIONMODE, FOREST_API } from '_platform/api';
class OfferDetails extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            dataList: [], // 表格数据
            ProjectName: '', // 项目名称
            Section: '', // 标段
            projectList: [], // 项目标段列表
            treetypename: '',
            organizationName: '', // 发布单位
            Status: '', // 采购单的状态
            showModal: false, // 显示附件弹窗
            OfferFiles: '' // 附件地址
        };
        this.purchaseid = ''; // 采购单ID
        this.grouptype = ''; // 组织机构类型
        this.org_code = ''; // 组织机构code
        this.toReturn = this.toReturn.bind(this); // 返回
        this.handleCancel = this.handleCancel.bind(this); // 取消弹框
        this.columns = [{
            title: '树种',
            key: '1',
            dataIndex: 'TreeTypeName'
        }, {
            title: '规格',
            width: 200,
            key: '2',
            dataIndex: 'CultivationMode',
            render: (text, record) => {
                let CultivationModeName = '';
                CULTIVATIONMODE.map(item => {
                    if (item.id === text) {
                        CultivationModeName = item.name;
                    }
                });
                return <span>{`胸径${record.DBH}cm 地径${record.GroundDiameter}cm 自然高${record.Height}cm 冠幅${record.CrownWidth}cm 培育方式：${CultivationModeName}`}</span>;
            }
        }, {
            title: '到货单价',
            key: '3',
            dataIndex: 'Price'
        }, {
            title: '投标数',
            key: '4',
            dataIndex: 'OfferNum'
        }, {
            title: '中标数',
            key: '5',
            dataIndex: 'WinNum'
        }, {
            title: '苗源地',
            key: '6',
            dataIndex: 'Source'
        }, {
            title: '备注',
            key: '7',
            dataIndex: 'SpecDescribe'
        }, {
            title: '附件',
            key: '8',
            dataIndex: 'OfferFiles',
            render: (text, record) => {
                return <a onClick={this.toSeeFile.bind(this, text)}>查看</a>;
            }
        }, {
            title: '状态',
            key: '9',
            width: 100,
            dataIndex: 'WinNum',
            render: (text) => {
                let strStatus = '';
                console.log(text, '中标数');
                switch (this.state.Status) {
                    case 1:
                        strStatus = <span style={{color: '#ff4d4f'}}>报价中</span>;
                        break;
                    case 2:
                        strStatus = <span style={{color: '#ff4d4f'}}>选标中</span>;
                        break;
                    case 3:
                        if (text === 0) {
                            strStatus = <span style={{color: '#ffe58f'}}>落选</span>;
                        } else {
                            strStatus = <span style={{color: '#1890ff'}}>中标</span>;
                        }
                        break;
                }
                return strStatus;
            }
        }];
    }
    componentDidMount () {
        const { getPurchaseById, getOrgTree_new, getWpunittree, getOffersById } = this.props.actions;
        this.purchaseid = this.props.offerDetailsKey;
        // 获得登陆用户的 苗圃基地/供应商的code
        const userData = JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
        if (userData && userData.account && userData.groups.length > 0) {
            userData.groups.map(item => {
                if (item.grouptype === 0 || item.grouptype === 6) {
                    this.grouptype = item.grouptype;
                }
            });
            this.org_code = userData.account.org_code;
        }
        console.log(this.grouptype, this.org_code, '222');
        // 根据ID采购单详情
        getPurchaseById({id: this.purchaseid}).then((rep) => {
            let SpecsType = [];
            rep.Specs.map(item => {
                CULTIVATIONMODE.map(row => {
                    if (item.CultivationMode === row.id) {
                        item.name = row.name;
                    }
                });
                SpecsType.push(item.TreeTypeName);
            });
            this.setState({
                purchaseInfo: rep,
                ProjectName: rep.ProjectName,
                Section: rep.Section,
                StartTime: rep.StartTime.split(' ')[0],
                EndTime: rep.EndTime.split(' ')[0],
                UseNurseryAddress: rep.UseNurseryAddress,
                Contacter: rep.Contacter,
                Phone: rep.Phone,
                OfferNun: rep.OfferNun,
                CreaterOrg: rep.CreaterOrg,
                Status: rep.Status,
                SpecsType
            });
            // 获取发布单位
            getOrgTree_new({code: rep.CreaterOrg}).then(rep => {
                this.setState({
                    organizationName: rep.name
                });
            });
        });
        // 根据id获取报价单信息
        getOffersById({}, {
            SupplierID: this.grouptype === 6 ? this.org_code : '',
            NurseryBaseID: this.grouptype === 0 ? this.org_code : '',
            id: this.purchaseid
        }).then(rep => {
            console.log(rep);
            let dataList = [];
            rep.map(item => {
                item.DetailOfferSpecs.map(row => {
                    dataList.push({
                        ID: row.ID,
                        CrownWidth: row.CrownWidth,
                        CultivationMode: row.CultivationMode,
                        DBH: row.DBH,
                        GroundDiameter: row.GroundDiameter,
                        Height: row.Height,
                        TreeTypeName: row.TreeTypeName,
                        Price: row.Price,
                        Num: row.Num,
                        OfferNum: row.OfferNum,
                        Source: row.Source,
                        SpecDescribe: row.SpecDescribe,
                        OfferFiles: row.OfferFiles,
                        WinNum: row.WinNum
                    });
                });
            });
            console.log(dataList, '表格数据');
            this.setState({
                dataList
            });
        });
        // 获得所有项目
        getWpunittree().then(rep => {
            this.setState({
                projectList: rep
            });
        });
    }
    render () {
        const { projectList, ProjectName, Section, StartTime, EndTime, UseNurseryAddress, SpecsType, Contacter, Phone, organizationName, dataList, showModal, OfferFiles } = this.state;
        let projectName = '', section = '';
        projectList.map(item => {
            if (item.No === ProjectName) {
                projectName = item.Name;
            }
            if (item.No === Section) {
                section = item.Name;
            }
        });
        return (
            <div className='offer-details'>
                <Button type='primary' style={{marginBottom: 5}} onClick={this.toReturn.bind(this)}>返 回</Button>
                <Card>
                    <Row>
                        <Col span={16}>
                            <h2>{projectName} {section} 采购单</h2>
                            <p className='text-p'>报价起止时间：{StartTime} 至 {EndTime}</p>
                            <p className='text-p'>起苗地：{UseNurseryAddress}</p>
                            <p className='text-p'>采购品种：{SpecsType}</p>
                        </Col>
                        <Col span={8}>
                            <p className='text-p'>供应商：{organizationName}</p>
                            <p className='text-p'>联系人：{Contacter}</p>
                            <p className='text-p'>联系电话：{Phone}</p>
                            <p className='text-p'>发布单位：{organizationName}</p>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Table columns={this.columns} dataSource={dataList} rowKey='ID' />
                </Card>
                <Modal
                    title='查 看'
                    visible={showModal}
                    onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                >
                    <img width='100%' src={FOREST_API + '/' + OfferFiles} alt='文件没找到' />
                </Modal>
            </div>
        );
    }
    toReturn () {
        this.props.actions.changeOfferDetailsVisible(false);
    }
    toSeeFile (OfferFiles, e) {
        e.preventDefault();
        this.setState({
            showModal: true,
            OfferFiles
        });
    }
    handleCancel () {
        this.setState({
            showModal: false
        });
    }
}

export default Form.create()(OfferDetails);
