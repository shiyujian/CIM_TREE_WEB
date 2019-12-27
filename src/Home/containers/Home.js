import React, {Component} from 'react';
import {Row, Col, TreeSelect} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { actions as platformActions } from '_platform/store/global';
import {
    getAreaTreeData,
    getDefaultProject
} from '_platform/auth';
import {News, Datum, Notice, Person, Machine} from '../components';
import * as previewActions from '_platform/store/global/preview';
import {actions as newsActions} from '../store/news';
import {actions as datumActions} from '../store/datum';
import banner from '../components/images/banner.png';
import ryzs from '../components/images/ryzs.png';
import chuqin from '../components/images/chuqin.png';
import queqin from '../components/images/queqin.png';
import chuchang from '../components/images/chuchang.png';
import jinchang from '../components/images/jinchang.png';
import anzhuang from '../components/images/anzhuang.png';
import chupu from '../components/images/chupu.png';
import mmjinchang from '../components/images/mmjinchang.png';
import zaizhi from '../components/images/zaizhi.png';
import dingwei from '../components/images/dingwei.png';
import jixiedj from '../components/images/jixiedj.png';
import zcjixie from '../components/images/zcjixie.png';
import './styles.less';

const { TreeNode } = TreeSelect;

@connect(
    state => {
        const {
            home: {
                news = {},
                datum = {}
            },
            platform
        } = state || {};
        return {...news, ...datum, platform};
    },
    dispatch => ({
        actions: bindActionCreators({...newsActions, ...datumActions, ...platformActions, ...previewActions}, dispatch)
    })
)

export default class Home extends Component {
    constructor (props) {
        super(props);
        this.state = {
            section: '', // 默认选中悦容公园北苑一区
            Total: 0, // 人员总数
            Approach: 0, // 进场人员
            Absence: 0, // 缺勤人员
            treeData: 0, // 栽植量
            outnurseryData: 0, // 出圃量
            nurseryData: 0, // 进场量
            locationData: 0, // 定位量
            aqi: '', // aqi
            pm25: '', // pm2.5
            pm10: '', // pm10
            nvh: '', // 噪声
            sp: '', // 风力
            temp: '', // 温度
            rh: '', // 湿度
            jxdj: 0, // 机械登记
            zcjx: 0, // 在场机械
            outputTotal: 0, // 出场量
            intputTotal: 0, // 进场量
            installTotal: 0 // 安装量
        };
    }

    componentDidMount = async () => {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getTotalThinClass,
                getThinClassTree
            },
            platform: { tree = {} }
        } = this.props;

        // 避免反复获取施工包数据
        if (!(tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 0)) {
            let data = await getAreaTreeData(getTreeNodeList, getThinClassList);
            let totalThinClass = data.totalThinClass || [];
            let projectList = data.projectList || [];
            // 获取所有的区段数据，用来计算养护任务的位置
            await getTotalThinClass(totalThinClass);
            // 区域地块树
            await getThinClassTree(projectList);
        }
        let defaultProject = await getDefaultProject();
        this.getStatworkmans(defaultProject);
        this.getGardentotalstat(defaultProject);
        this.getTotalstat(defaultProject);
        this.getEnvs(defaultProject);
        this.getStatdevice4total(defaultProject);
        this.setState({
            section: defaultProject
        });
    }

    getStatworkmans (params) { // 获取人员每日进离场统计
        const {
            actions: { getStatworkmans }
        } = this.props;
        let now = new Date(); // 获取当前日期
        let year = now.getFullYear(); // 得到年份
        let month = now.getMonth() + 1;// 得到月份
        month = month < 10 ? '0' + month : month;
        let date = now.getDate();// 得到日期
        date = date < 10 ? '0' + date : date;
        let section = params && params != '0' ? params : '';
        let stime = year + '-' + month + '-' + date + ' ' + '00:00:00';
        let etime = year + '-' + month + '-' + date + ' ' + '24:00:00';
        getStatworkmans({}, {
            section: section,
            stime: stime,
            etime: etime
        }).then(rep => {
            if (rep) {
                let Register, Approach, Absence, Attendance;
                for (let i = 0; i < rep.length; i++) {
                    if (rep[i].Status == 0) {
                        Register = rep[i].Num;
                    } else if (rep[i].Status == 1) {
                        Attendance = rep[i].Num;
                    } else if (rep[i].Status == 2) {
                        Approach = rep[i].Num;
                    } else if (rep[i].Status == 3) {
                        Absence = rep[i].Num;
                    }
                }
                this.setState({
                    Total: Register + Attendance + Approach + Absence, // 人员总数
                    Approach: Attendance + Approach, // 进场人员
                    Absence: Absence // 缺勤人员
                });
            }
        });
    }

    getGardentotalstat (params) { // 获取园林附属设施相关统计信息
        const {
            actions: { getGardentotalstat }
        } = this.props;
        let section = params && params != '0' ? params : '';
        getGardentotalstat({}, {
            section: section,
            stattype: 'outfactory'
        }).then(rep => {
            if (rep || rep == 0) {
                this.setState({
                    outputTotal: rep
                });
            }
        });
        getGardentotalstat({}, {
            section: section,
            stattype: 'product'
        }).then(rep => {
            if (rep || rep == 0) {
                this.setState({
                    intputTotal: rep
                });
            }
        });
        getGardentotalstat({}, {
            section: section,
            stattype: 'facility'
        }).then(rep => {
            if (rep || rep == 0) {
                this.setState({
                    installTotal: rep
                });
            }
        });
    }

    getTotalstat (params) { // 获取苗木相关统计信息
        const {
            actions: { getTotalstat }
        } = this.props;
        let section = params && params != '0' ? params : '';
        getTotalstat({}, {
            section: section,
            stattype: 'tree'
        }).then(rep => {
            if (rep || rep == 0) {
                this.setState({
                    treeData: rep
                });
            }
        });
        getTotalstat({}, {
            section: section,
            stattype: 'outnursery'
        }).then(rep => {
            if (rep || rep == 0) {
                this.setState({
                    outnurseryData: rep
                });
            }
        });
        getTotalstat({}, {
            section: section,
            stattype: 'nursery'
        }).then(rep => {
            if (rep || rep == 0) {
                this.setState({
                    nurseryData: rep
                });
            }
        });
        getTotalstat({}, {
            section: section,
            stattype: 'location'
        }).then(rep => {
            if (rep || rep == 0) {
                this.setState({
                    locationData: rep
                });
            }
        });
    }

    getEnvs (params) { // 根据标段获取天气相关信息
        const {
            actions: { getEnvs }
        } = this.props;
        let now = new Date(); // 获取当前日期
        let year = now.getFullYear(); // 得到年份
        let month = now.getMonth() + 1;// 得到月份
        month = month < 10 ? '0' + month : month;
        let date = now.getDate();// 得到日期
        date = date < 10 ? '0' + date : date;
        let section = params && params != '0' ? params : '';
        let stime = year + '-' + month + '-' + date + ' ' + '00:00:00';
        let etime = year + '-' + month + '-' + date + ' ' + '24:00:00';
        getEnvs({}, {
            section: section,
            stime: stime,
            etime: etime
        }).then(rep => {
            if (rep.code == 200) {
                let data = rep.content[0];
                if (data) {
                    this.setState({
                        aqi: data.AQILevel, // aqi
                        pm25: data.PM25, // pm2.5
                        pm10: data.PM10, // pm10
                        nvh: data.NVH, // 噪声
                        sp: data.SP, // 风力
                        temp: data.Temp, // 温度
                        rh: data.RH // 湿度
                    });
                } else {
                    this.setState({
                        aqi: '无', // aqi
                        pm25: 0, // pm2.5
                        pm10: 0, // pm10
                        nvh: 0, // 噪声
                        sp: 0, // 风力
                        temp: 0, // 温度
                        rh: 0 // 湿度
                    });
                }
            }
        });
    }

    getStatdevice4total (params) { // 根据标段获取机械相关信息
        const {
            actions: { getStatdevice4total }
        } = this.props;
        let section = params && params != '0' ? params : '';
        getStatdevice4total({}, {
            section: section
        }).then(rep => {
            if (rep) {
                this.setState({
                    jxdj: rep.All,
                    zcjx: rep.In
                });
            }
        });
    }

    onChangeSection (value) { // 标段切换查询数据
        this.getStatworkmans(value);
        this.getGardentotalstat(value);
        this.getTotalstat(value);
        this.getEnvs(value);
        this.getStatdevice4total(value);
        this.setState({
            section: value
        });
    }

    render () {
        const props = this.props;
        const bannerUrl = banner;
        const {
            section,
            Total,
            Approach,
            Absence,
            treeData,
            outnurseryData,
            nurseryData,
            locationData,
            aqi, // aqi
            pm25, // pm2.5
            pm10, // pm10
            nvh, // 噪声
            sp, // 风力
            temp, // 温度
            rh, // 湿度
            jxdj,
            zcjx,
            outputTotal,
            intputTotal,
            installTotal
        } = this.state;
        let sectionList = [];
        const {
            platform: { tree = {} }
        } = this.props;
        if (tree && tree.thinClassTree) {
            sectionList = tree.thinClassTree.map((item, index) => {
                return <TreeNode value={item.No} title={item.Name} key={index} />;
            });
        }
        return (
            <div style={{background: '#F0F0F0'}}>
                <div className='SectionBox'>
                    <span style={{width: '15%', marginRight: '10px', marginLeft: '25px'}}>项目</span>
                    <TreeSelect
                        style={{ width: '30%' }}
                        value={section}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder='请选择项目'
                        // allowClear
                        treeDefaultExpandAll
                        onChange={this.onChangeSection.bind(this)}
                    >
                        {sectionList}
                    </TreeSelect>
                </div>
                <Row style={{paddingTop: 10, paddingBottom: 10, height: '50%'}}>
                    <Col span={15} style={{paddingRight: 5}}>
                        {/* <img style={{width: '100%', height: '100%'}}src={bannerUrl} /> */}
                        <div className='HomeLeftTop'>
                            <div className='LeftTopBox' style={{width: '51%'}}>
                                <div className='LeftTopBox'>
                                    <img src={ryzs} />
                                    <div className='BoxDiv'>
                                        <p>{Total}</p>
                                        <p>人员总数</p>
                                    </div>
                                </div>
                                <div className='LeftTopBox'>
                                    <img src={chuqin} />
                                    <div className='BoxDiv'>
                                        <p>{Approach}</p>
                                        <p>今日进场人员</p>
                                    </div>
                                </div>
                                <div className='LeftTopBox'>
                                    <img src={queqin} />
                                    <div className='BoxDiv'>
                                        <p>{Absence}</p>
                                        <p>今日缺勤人员</p>
                                    </div>
                                </div>
                            </div>
                            <div className='LeftTopBox' style={{width: '49%'}}>
                                <div style={{float: 'right', width: '100%'}}>
                                    <div className='RightBoxDiv'>
                                        <p style={{color: '#34CEFE'}}>{rh}</p>
                                        <p>湿度</p>
                                    </div>
                                    <div className='RightBoxDiv'>
                                        <p style={{color: '#F06EA2'}}>{temp}</p>
                                        <p>温度</p>
                                    </div>
                                    <div className='RightBoxDiv'>
                                        <p style={{color: '#48E0BA'}}>{nvh}</p>
                                        <p>噪声</p>
                                    </div>
                                    <div className='RightBoxDiv'>
                                        <p style={{color: '#FF4C64'}}>{sp}</p>
                                        <p>风力</p>
                                    </div>
                                    <div className='RightBoxDiv'>
                                        <p style={{color: '#48E055'}}>{pm10}</p>
                                        <p>PM10</p>
                                    </div>
                                    <div className='RightBoxDiv'>
                                        <p style={{color: '#7578FF'}}>{pm25}</p>
                                        <p>PM2.5</p>
                                    </div>
                                    <div className='RightBoxDiv'>
                                        <p style={{color: '#F06EA2', fontSize: '16px'}}>{aqi}</p>
                                        <p>AQI</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='HomeLeftCenter'>
                            <div className='CenterBoxDiv' style={{width: '68%', height: '100%'}}>
                                <div className='BoxTitle'>苗木</div>
                                <div style={{margin: '0 20px'}}>
                                    <div className='MmBoxDiv'>
                                        <div className='Box' style={{marginBottom: '10px'}}>
                                            <img src={chupu} />
                                            <div className='PBox'>
                                                <p>{outnurseryData}</p>
                                                <p>出圃量</p>
                                            </div>
                                        </div>
                                        <div className='Box'>
                                            <img src={zaizhi} />
                                            <div className='PBox' >
                                                <p>{treeData}</p>
                                                <p>栽植量</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='MmBoxDiv'>
                                        <div className='Box' style={{marginBottom: '10px'}}>
                                            <img src={chupu} />
                                            <div className='PBox'>
                                                <p>{nurseryData}</p>
                                                <p>进场量</p>
                                            </div>
                                        </div>
                                        <div className='Box'>
                                            <img src={zaizhi} />
                                            <div className='PBox'>
                                                <p>{locationData}</p>
                                                <p>定位量</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='CenterBoxDiv' style={{marginLeft: '2%', width: '28%'}}>
                                <div className='JXBox'>
                                    <img src={jixiedj} />
                                    <div className='PBox'>
                                        <p>{jxdj}</p>
                                        <p>机械登记总数</p>
                                    </div>
                                </div>
                                <div className='JXBox'>
                                    <img src={zcjixie} />
                                    <div className='PBox'>
                                        <p>{zcjx}</p>
                                        <p>在场机械数</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col span={9} style={{paddingLeft: 5}}>
                        {Notice && <Notice {...props} style={{height: '100%'}} />}
                    </Col>
                </Row>
                <Row>
                    <Col span={12} style={{paddingRight: 5}}>
                        {News && <News {...props} />}
                    </Col>
                    <Col span={12} style={{paddingLeft: 5}}>
                        {Datum && <Datum {...props} />}
                    </Col>
                </Row>
                <Row style={{paddingTop: 10}}>
                    <Col span={12} style={{paddingRight: 5}}>
                        {Person && <Person {...props} section={this.state.section} />}
                    </Col>
                    <Col span={12} style={{paddingLeft: 5}}>
                        {Machine && <Machine {...props} section={this.state.section} />}
                    </Col>
                </Row>
            </div>

        );
    }
}
