import React, { Component } from 'react';
import moment from 'moment';
import {getAreaData, handleRiskData, handleTrackData, handleCuringTaskData} from '../auth';
import {TREETYPENO} from '_platform/api';

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
                getSurvivalRateTreeLoading
            }
        } = this.props;
        if (tree && tree.thinClassTree && tree.thinClassTree instanceof Array && tree.thinClassTree.length > 1) {
            await getAreaTreeLoading(false);
            await getSurvivalRateTreeLoading(false);
        } else if (tree && tree.onSiteThinClassTree && tree.onSiteThinClassTree instanceof Array && tree.onSiteThinClassTree.length > 0) {
            await getAreaTreeLoading(false);
            await getSurvivalRateTreeLoading(false);
        } else {
            await this.loadAreaData();
        }
        if (treetypesTree && treetypesTree instanceof Array && treetypesTree.length > 0) {
            await getTreetypesTreeLoading(false);
        } else {
            await this.getTreeType();
        }
        if (riskTree && riskTree instanceof Array && riskTree.length > 0) {
            await getRiskTreeLoading(false);
        } else {
            await this.getRiskTreeData();
        }
        if (trackTree && trackTree instanceof Array && trackTree.length > 0) {
            await getTrackTreeLoading(false);
        } else {
            await this.getTrackData();
        }
        if (curingTaskTree && curingTaskTree instanceof Array && curingTaskTree.length > 0) {
            await getCuringTaskTreeLoading(false);
        } else {
            await this.getCuringTasks();
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
                getRiskTree,
                getRiskTreeLoading
            }
        } = this.props;
        try {
            // loading开始
            await getRiskTreeLoading(true);
            let content = [];
            let stime = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
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
            await getRiskTree(risks);
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
                getTrackTree,
                getTrackTreeLoading
            }
        } = this.props;
        try {
            let stime = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
            let etime = moment().format('YYYY-MM-DD 23:59:59');
            // loading开始
            await getTrackTreeLoading(true);
            let routes = await getInspectRouter({}, {status: 2, stime, etime});
            let trackTree = handleTrackData(routes);
            await getTrackTree(trackTree);
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
                getCuringTaskTree,
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
                let stime = moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00');
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
            await getCuringTaskTree(curingTaskTreeData);
            await getCuringTypeData(curingTypesData);
            // loading结束
            await getCuringTaskTreeLoading(false);
        } catch (e) {

        }
    }

    render () {
        return (
            null
        );
    }
}
