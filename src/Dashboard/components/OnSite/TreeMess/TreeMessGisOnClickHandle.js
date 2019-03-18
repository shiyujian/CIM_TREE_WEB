import React, {
    Component
} from 'react';
import {
    FOREST_GIS_API
} from '_platform/api';
import TreeMessModal from './TreeMessModal';
import {
    getSeedlingMess,
    getTreeMessFun,
    getCuringMess
} from './TreeInfo';
import {
    getThinClassName,
    handleGetAddressByCoordinate,
    getIconType
} from '../../auth';
import {
    getCompanyDataByOrgCode
} from '_platform/auth';

export default class TreeMessGisOnClickHandle extends Component {
    static propTypes = {};
    constructor (props) {
        super(props);
        this.state = {
            treeMessModalVisible: false,
            treeMessModalLoading: false,
            seedlingMess: '',
            treeMess: '',
            flowMess: '',
            curingMess: '',
            treeMarkerLayer: ''
        };
    }

    componentDidMount = async () => {
        const {
            map
        } = this.props;
        if (map) {
            await map.on('click', this.handleTreeMessGisClickFunction);
        }
    }
    componentWillUnmount = async () => {
        const {
            map
        } = this.props;
        const {
            treeMarkerLayer
        } = this.state;
        map.off('click', this.handleTreeMessGisClickFunction);
        if (treeMarkerLayer) {
            map.removeLayer(treeMarkerLayer);
        }
    }

    // 查看苗木信息点击事件
    handleTreeMessGisClickFunction = (e) => {
        try {
            const {
                dashboardTreeMess
            } = this.props;
            if (dashboardTreeMess === 'dashboardTreeMess' && e) {
                this.getSxmByLocation(e.latlng.lng, e.latlng.lat);
            }
        } catch (e) {
            console.log('handleTreeMessGisClickFunction', e);
        }
    }

    render () {
        const {
            treeMessModalVisible
        } = this.state;
        return (<div > { // 点击某个树节点展示该节点信息
            treeMessModalVisible
                ? (<TreeMessModal
                    {...this.props}
                    {...this.state}
                    onCancel={this.handleCancelTreeMessModal.bind(this)}
                />
                ) : ''
        } </div>
        );
    }
    // 苗木信息Modal关闭
    handleCancelTreeMessModal () {
        this.handleModalMessData();
        this.setState({
            treeMessModalVisible: false,
            treeMessModalLoading: true
        });
    }
    // 清除苗木结缘弹窗内用到的数据
    handleModalMessData () {
        this.setState({
            seedlingMess: '',
            treeMess: '',
            flowMess: '',
            curingMess: ''
        });
    }
    // 根据点击的地图坐标与实际树的定位进行对比,根据树节点获取树节点信息
    getSxmByLocation (x, y) {
        const {
            map
        } = this.props;
        const {
            treeMarkerLayer
        } = this.state;
        let resolutions = [
            0.703125,
            0.3515625,
            0.17578125,
            0.087890625,
            0.0439453125,
            0.02197265625,
            0.010986328125,
            0.0054931640625,
            0.00274658203125,
            0.001373291015625,
            6.866455078125e-4,
            3.4332275390625e-4,
            1.71661376953125e-4,
            8.58306884765625e-5,
            4.291534423828125e-5,
            2.1457672119140625e-5,
            1.0728836059570312e-5,
            5.364418029785156e-6,
            2.682209014892578e-6,
            1.341104507446289e-6,
            6.705522537231445e-7,
            3.3527612686157227e-7
        ];
        let zoom = map.getZoom();
        let resolution = resolutions[zoom];
        let col = (x + 180) / resolution;
        // 林总说明I和J必须是整数
        let colp = Math.floor(col % 256);
        // let colp = col % 256;
        col = Math.floor(col / 256);
        let row = (90 - y) / resolution;
        // 林总说明I和J必须是整数
        let rowp = Math.floor(row % 256);
        // let rowp = row % 256;
        row = Math.floor(row / 256);
        let url =
            FOREST_GIS_API +
            '/geoserver/gwc/service/wmts?VERSION=1.0.0&LAYER=xatree:treelocation&STYLE=&TILEMATRIX=EPSG:4326:' +
            zoom +
            '&TILEMATRIXSET=EPSG:4326&SERVICE=WMTS&FORMAT=image/png&SERVICE=WMTS&REQUEST=GetFeatureInfo&INFOFORMAT=application/json&TileCol=' +
            col +
            '&TileRow=' +
            row +
            '&I=' +
            colp +
            '&J=' +
            rowp;
        jQuery.getJSON(url, null, async (data) => {
            if (data.features && data.features.length) {
                await this.setState({
                    treeMessModalVisible: true,
                    treeMessModalLoading: true
                });
                if (treeMarkerLayer) {
                    map.removeLayer(treeMarkerLayer);
                }
                await this.getTreeMessData(data, x, y);
                await this.handleOkTreeMessModal(data, x, y);
            }
        });
    }
    // 显示苗木信息Modal 和 图标
    handleOkTreeMessModal (data, x, y) {
        const {
            map
        } = this.props;
        const {
            treeMarkerLayer
        } = this.state;
        try {
            if (data && data.features && data.features.length > 0 && data.features[0].properties) {
                let postdata = {
                    sxm: data.features[0].properties.SXM
                    // sxm: 'AUT9860'
                };
                if (treeMarkerLayer) {
                    map.removeLayer(treeMarkerLayer);
                }
                let iconType = L.divIcon({
                    className: getIconType('tree')
                });
                let treeMarkerLayerNew = L.marker([y, x], {
                    icon: iconType,
                    title: postdata.sxm
                });
                treeMarkerLayerNew.addTo(map);
                this.setState({
                    treeMarkerLayer: treeMarkerLayerNew,
                    treeMessModalLoading: false
                });
            }
        } catch (e) {
            console.log('handleOkTreeMessModal', e);
        }
    }
    // 获取树木详情信息
    getTreeMessData = async (data, x, y) => {
        const {
            actions: {
                getTreeflows,
                getNurserys,
                getCarpackbysxm,
                getTreeMess,
                getCuringTreeInfo,
                getCuringTypes,
                getCuringMessage,
                getForestUserDetail,
                getUserDetail,
                getOrgTreeByCode,
                getTreeLocationCoord,
                getLocationNameByCoordinate
            },
            platform: {
                tree = {}
            },
            curingTypes
        } = this.props;
        try {
            let postdata = {
                sxm: data.features[0].properties.SXM
                // sxm: 'CAF2578'
            };
            let totalThinClass = tree.totalThinClass || [];
            let bigTreeList = (tree && tree.bigTreeList) || [];
            let queryTreeData = await getTreeMess(postdata);
            if (!queryTreeData) {
                queryTreeData = {};
            }
            let treeflowDatas = {};
            // 树木审批流程信息
            treeflowDatas = await getTreeflows({}, postdata);
            // 苗圃数据
            let nurserysDatas = await getNurserys({}, postdata);
            // 车辆打包数据
            let carData = await getCarpackbysxm(postdata);
            // 养护树木信息
            let curingTreeData = await getCuringTreeInfo({}, postdata);
            // 获取树的地理坐标信息
            let treeLocationData = await getTreeLocationCoord(postdata);

            let curingTypeArr = [];
            if (!curingTypes) {
                let curingTypesData = await getCuringTypes();
                curingTypeArr = curingTypesData && curingTypesData.content;
            } else {
                curingTypeArr = curingTypes;
            };

            let SmallClassName = queryTreeData.SmallClass
                ? queryTreeData.SmallClass + '号小班'
                : '';
            let ThinClassName = queryTreeData.ThinClass
                ? queryTreeData.ThinClass + '号细班'
                : '';
            // 获取小班细班名称
            if (queryTreeData && queryTreeData.Section && queryTreeData.SmallClass && queryTreeData.ThinClass) {
                let sections = queryTreeData.Section.split('-');
                let No =
                    sections[0] +
                    '-' +
                    sections[1] +
                    '-' +
                    queryTreeData.SmallClass +
                    '-' +
                    queryTreeData.ThinClass;
                let regionData = getThinClassName(No, queryTreeData.Section, totalThinClass, bigTreeList);
                SmallClassName = regionData.SmallName;
                ThinClassName = regionData.ThinName;
            }

            let treeflowData = [];
            let nurserysData = {};
            let curingTaskData = [];
            let curingTaskArr = [];
            if (
                treeflowDatas && treeflowDatas.content && treeflowDatas.content instanceof Array &&
                treeflowDatas.content.length > 0
            ) {
                treeflowData = treeflowDatas.content;
            }
            if (
                nurserysDatas && nurserysDatas.content && nurserysDatas.content instanceof Array &&
                nurserysDatas.content.length > 0
            ) {
                nurserysData = nurserysDatas.content[0];
            }
            if (
                curingTreeData && curingTreeData.content && curingTreeData.content instanceof Array &&
                curingTreeData.content.length > 0
            ) {
                let content = curingTreeData.content;
                content.map((task) => {
                    if (curingTaskArr.indexOf(task.CuringID) === -1) {
                        curingTaskData.push(task);
                        curingTaskArr.push(task.CuringID);
                    }
                });
            }
            // 根据苗圃的起苗坐标获取起苗地址
            let nurserysAddressData = await handleGetAddressByCoordinate(nurserysData.location, getLocationNameByCoordinate);
            let nurserysAddressName = (nurserysAddressData && nurserysAddressData.regeocode && nurserysAddressData.regeocode.formatted_address) || '';
            nurserysData.nurserysAddressName = nurserysAddressName;
            // 根据树木的定位坐标获取定位地址
            let location = '';
            if (treeLocationData && treeLocationData.X && treeLocationData.Y) {
                location = `${treeLocationData.X},${treeLocationData.Y}`;
            }
            queryTreeData.locationCoord = location;
            // let treeAddressData = await handleGetAddressByCoordinate(location, getLocationNameByCoordinate);
            // let queryTreeAddressName = (treeAddressData && treeAddressData.regeocode && treeAddressData.regeocode.formatted_address) || '';
            // queryTreeData.queryTreeAddressName = queryTreeAddressName;

            let seedlingMess = getSeedlingMess(queryTreeData, carData, nurserysData);
            let treeMess = getTreeMessFun(SmallClassName, ThinClassName, queryTreeData, nurserysData, bigTreeList);
            for (let i = 0; i < treeflowData.length; i++) {
                let userForestData = await getForestUserDetail({
                    id: treeflowData[i].FromUser
                });
                if (userForestData && userForestData.PK) {
                    let userEcidiData = await getUserDetail({
                        pk: userForestData.PK
                    });
                    let orgCode = userEcidiData && userEcidiData.account && userEcidiData.account.org_code;
                    let parent = await getCompanyDataByOrgCode(orgCode, getOrgTreeByCode);
                    let companyName = parent.name;
                    treeflowData[i].companyName = companyName;
                    treeflowData[i].orgData = parent;
                }
            }
            let flowMess = treeflowData;
            let curingMess = await getCuringMess(curingTaskData, curingTypeArr, getCuringMessage);
            this.setState({
                seedlingMess,
                treeMess,
                flowMess,
                curingMess
            });
        } catch (e) {
            console.log('getTreeMessData', e);
        }
    }
}
