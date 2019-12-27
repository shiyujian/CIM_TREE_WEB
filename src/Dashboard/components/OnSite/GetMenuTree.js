import React, { Component } from 'react';
import moment from 'moment';
import {
    getAreaData,
    handleRiskData,
    handleTrackData,
    handleCuringTaskData,
    handleLocationDeviceData,
    getAreaDataGarden
} from '../auth';
import {
    TREETYPENO
} from '_platform/api';
import {
    getUser
} from '_platform/auth';

export default class GetMenuTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount = async () => {
        const {
            riskTree,
            trackTree,
            treetypesTree,
            curingTaskTree,
            deviceTreeDataDay,
            totalThinClassTreeGarden,
            // survivalRateTree,
            platform: {
                tree = {}
            },
            actions: {
                getAreaTreeLoading,
                getRiskTreeLoading,
                getTrackTreeLoading,
                getTreetypesTreeLoading,
                getCuringTaskTreeLoading,
                getSurvivalRateTreeLoading,
                getDeviceTreeLoading
            }
        } = this.props;
        await getAreaTreeLoading(true);
        await getRiskTreeLoading(true);
        await getTrackTreeLoading(true);
        await getTreetypesTreeLoading(true);
        await getCuringTaskTreeLoading(true);
        await getSurvivalRateTreeLoading(true);
        await getDeviceTreeLoading(true);
        if (tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 1) {
            await getAreaTreeLoading(false);
            await getSurvivalRateTreeLoading(false);
        } else if (tree && tree.onSiteThinClassTree && tree.onSiteThinClassTree instanceof Array && tree.onSiteThinClassTree.length > 0) {
            await getAreaTreeLoading(false);
            await getSurvivalRateTreeLoading(false);
        } else {
            await this.loadAreaData();
        }
        // 获取树种
        if (treetypesTree && treetypesTree instanceof Array && treetypesTree.length > 0) {
            await getTreetypesTreeLoading(false);
        } else {
            await this.getTreeType();
        }
        // 获取问题上报数据
        if (riskTree && riskTree instanceof Array && riskTree.length > 0) {
            await getRiskTreeLoading(false);
        } else {
            await this.getRiskTreeData();
        }
        // 获取巡检路线数据
        if (trackTree && trackTree instanceof Array && trackTree.length > 0) {
            await getTrackTreeLoading(false);
        } else {
            await this.getTrackData();
        }
        // 获取养护数据
        if (curingTaskTree && curingTaskTree instanceof Array && curingTaskTree.length > 0) {
            await getCuringTaskTreeLoading(false);
        } else {
            await this.getCuringTasks();
        }
        // 获取机械数据
        if (deviceTreeDataDay && deviceTreeDataDay instanceof Array && deviceTreeDataDay.length > 0) {
            await getDeviceTreeLoading(false);
        } else {
            await this.getLocationDevices();
        }
        // 获取园林施工包树
        if (!(totalThinClassTreeGarden && totalThinClassTreeGarden instanceof Array && totalThinClassTreeGarden.length > 0)) {
            await this.loadAreaDataGarden();
        }
    }
    // 获取地块树数据
    loadAreaData = async () => {
        const {
            actions: {
                getTreeNodeList,
                getThinClassList,
                getOnSiteThinClassTree,
                getSurvivalRateTree,
                getTotalThinClass,
                getAreaTreeLoading,
                getSurvivalRateTreeLoading
            }
        } = this.props;
        try {
            // loading开始
            await getAreaTreeLoading(true);
            await getSurvivalRateTreeLoading(true);
            let data = await getAreaData(getTreeNodeList, getThinClassList);
            let totalThinClass = data.totalThinClass || [];
            let survivalRateTree = data.survivalRateTree || [];
            let projectList = data.projectList || [];
            // 获取所有的小班数据，用来计算养护任务的位置
            await getTotalThinClass(totalThinClass);
            // 标段树
            await getSurvivalRateTree(survivalRateTree);
            // 区域地块树
            await getOnSiteThinClassTree(projectList);
            // loading结束
            await getAreaTreeLoading(false);
            await getSurvivalRateTreeLoading(false);
        } catch (e) {
            console.log('获取地块树数据', e);
        }
    }
    // 获取树种数据
    getTreeType = async () => {
        const {
            actions: {
                getTreeTypeAction,
                getTreetypesTree,
                getTreetypesTreeLoading
            }
        } = this.props;
        try {
            // loading开始
            await getTreetypesTreeLoading(true);
            let treeTypesTreeData = [];
            TREETYPENO.map((tree) => {
                treeTypesTreeData.push({
                    key: tree.id,
                    properties: {
                        name: tree.name
                    },
                    children: []
                });
            });
            let treeData = await getTreeTypeAction();
            if (!(treeData && treeData instanceof Array && treeData.length > 0)) {
                // loading结束
                await getTreetypesTreeLoading(false);
                return;
            }
            treeData.map(tree => {
                if (tree && tree.ID) {
                    for (let i = 0; i < treeTypesTreeData.length; i++) {
                        let code = tree.TreeTypeNo.substr(0, 1);
                        if (Number(code) === Number(treeTypesTreeData[i].key)) {
                            treeTypesTreeData[i].children.push({
                                key: tree.ID,
                                properties: {
                                    name: tree.TreeTypeName,
                                    TreeTypeNo: tree.PTreeTypeNo,
                                    TreeTypeGenera: tree.TreeTypeGenera,
                                    TreeParam: tree.TreeParam,
                                    SamplingParam: tree.SamplingParam,
                                    Pics: tree.Pics,
                                    NurseryParam: tree.NurseryParam,
                                    MorphologicalCharacter: tree.MorphologicalCharacter,
                                    IsLocation: tree.IsLocation,
                                    HaveQRCode: tree.HaveQRCode,
                                    GrowthHabit: tree.GrowthHabit
                                }
                            });
                        }
                    }
                }
            });
            await getTreetypesTree(treeTypesTreeData);
            // loading结束
            await getTreetypesTreeLoading(false);
        } catch (e) {
            console.log('树种', e);
        }
    }
    /* 获取安全隐患点 */
    getRiskTreeData = async () => {
        const {
            actions: {
                getRisk,
                getRiskTreeDay,
                getRiskTreeLoading
            }
        } = this.props;
        try {
            // loading开始
            await getRiskTreeLoading(true);
            let content = [];
            let stime = moment().format('YYYY-MM-DD 00:00:00');
            let etime = moment().format('YYYY-MM-DD 23:59:59');
            let postdata1 = {
                status: -1,
                stime,
                etime
            };
            let data1 = await getRisk({}, postdata1);

            let postdata2 = {
                status: 0,
                stime,
                etime
            };
            let data2 = await getRisk({}, postdata2);

            let postdata3 = {
                status: 1,
                stime,
                etime
            };
            let data3 = await getRisk({}, postdata3);
            if (data1 && data1.content) {
                content = content.concat(data1.content);
            }
            if (data2 && data2.content) {
                content = content.concat(data2.content);
            }
            if (data3 && data3.content) {
                content = content.concat(data3.content);
            }
            let risks = handleRiskData(content);
            await getRiskTreeDay(risks);
            // loading结束
            await getRiskTreeLoading(false);
        } catch (e) {
            console.log('getRisk', e);
        }
    }
    /* 查询巡检路线 */
    getTrackData = async () => {
        const {
            actions: {
                getInspectRouter,
                getTrackTreeDay,
                getTrackTreeLoading
            }
        } = this.props;
        try {
            let stime = moment().format('YYYY-MM-DD 00:00:00');
            let etime = moment().format('YYYY-MM-DD 23:59:59');
            // loading开始
            await getTrackTreeLoading(true);
            let routes = await getInspectRouter({}, {status: 2, stime, etime});
            let trackTree = handleTrackData(routes);
            await getTrackTreeDay(trackTree);
            // loading结束
            await getTrackTreeLoading(false);
        } catch (e) {
            console.log('获取巡检路线', e);
        }
    }
    // 获取养护任务
    getCuringTasks = async () => {
        const {
            actions: {
                getCuring,
                getCuringTypes,
                getCuringTaskTreeDay,
                getCuringTypeData,
                getCuringTaskTreeLoading
            },
            curingTypes
        } = this.props;
        try {
            // loading开始
            await getCuringTaskTreeLoading(true);
            let curingTypesData = [];
            if (curingTypes && curingTypes instanceof Array && curingTypes.length > 0) {
                curingTypesData = curingTypes;
            } else {
                let data = await getCuringTypes();
                curingTypesData = data && data.content;
            }
            let curingTaskTreeData = [];
            if (curingTypesData && curingTypesData.length > 0) {
                let curingTasks = [];
                let stime = moment().format('YYYY-MM-DD 00:00:00');
                let etime = moment().format('YYYY-MM-DD 23:59:59');
                // 有效和退回的任务都是都是属于未完成的任务，上报的任务才属于完成了的任务
                // 状态为有效
                let postdata1 = {
                    status: 0,
                    stime,
                    etime
                };
                let data1 = await getCuring({}, postdata1);

                // 状态为退回
                let postdata2 = {
                    status: 1,
                    stime,
                    etime
                };
                let data2 = await getCuring({}, postdata2);
                if (data1 && data1.content) {
                    curingTasks = curingTasks.concat(data1.content);
                }
                if (data2 && data2.content) {
                    curingTasks = curingTasks.concat(data2.content);
                }
                curingTaskTreeData = await handleCuringTaskData(curingTypesData, curingTasks);
            }
            await getCuringTaskTreeDay(curingTaskTreeData);
            await getCuringTypeData(curingTypesData);
            // loading结束
            await getCuringTaskTreeLoading(false);
        } catch (e) {

        }
    }
    // 获取机械定位设备
    getLocationDevices = async () => {
        const {
            actions: {
                getLocationDevices,
                getDeviceTreeLoading,
                getDeviceTreeDay
            },
            platform: {
                tree = {}
            }
        } = this.props;
        try {
            let thinClassTree = tree.thinClassTree || tree.onSiteThinClassTree || [];
            // loading开始
            await getDeviceTreeLoading(true);
            let data = await getLocationDevices();
            if (data && data.content) {
                let devices = handleLocationDeviceData(data.content, thinClassTree);
                await getDeviceTreeDay(devices);
            }
            // loading结束
            await getDeviceTreeLoading(false);
        } catch (e) {
            console.log('getLocationDevices', e);
        }
    }
    // 获取园林施工包数据
    loadAreaDataGarden = async () => {
        const {
            actions: {
                getTreeNodeListGarden,
                getThinClassListGarden,
                getTotalThinClassGarden
            }
        } = this.props;
        try {
            let data = await getAreaDataGarden(getTreeNodeListGarden, getThinClassListGarden);
            let totalThinClass = data.totalThinClass || [];
            // 获取所有的小班数据，用来计算养护任务的位置
            await getTotalThinClassGarden(totalThinClass);
        } catch (e) {
            console.log('获取园林施工包数据', e);
        }
    }

    render () {
        return (
            null
        );
    }
}
