import './OnSite.less';
import { PROJECT_UNITS, FOREST_API } from '_platform/api';
import moment from 'moment';
export const getSeedlingMess = (queryTreeData, carData, nurserysData) => {
    let seedlingMess = {
        sxm: queryTreeData.ZZBM ? queryTreeData.ZZBM : '',
        car: carData.LicensePlate ? carData.LicensePlate : '',
        TreeTypeName: nurserysData.TreeTypeObj
            ? nurserysData.TreeTypeObj.TreeTypeName
            : '',
        TreePlace: nurserysData.TreePlace
            ? nurserysData.TreePlace
            : '',
        Factory: nurserysData.Factory ? nurserysData.Factory : '',
        NurseryName: nurserysData.NurseryName
            ? nurserysData.NurseryName
            : '',
        LifterTime: nurserysData.LifterTime
            ? moment(nurserysData.LifterTime).format(
                'YYYY-MM-DD HH:mm:ss'
            )
            : '',
        location: nurserysData.location
            ? nurserysData.location
            : '',
        InputerObj: nurserysData.InputerObj
            ? nurserysData.InputerObj
            : '',
        GD: nurserysData.GD ? nurserysData.GD : '',
        GDFJ: nurserysData.GDFJ
            ? onImgClick(nurserysData.GDFJ)
            : '',
        GF: nurserysData.GF ? nurserysData.GF : '',
        GFFJ: nurserysData.GFFJ
            ? onImgClick(nurserysData.GFFJ)
            : '',
        TQZJ: nurserysData.TQZJ ? nurserysData.TQZJ : '',
        TQZJFJ: nurserysData.TQZJFJ
            ? onImgClick(nurserysData.TQZJFJ)
            : '',
        TQHD: nurserysData.TQHD ? nurserysData.TQHD : '',
        TQHDFJ: nurserysData.TQHDFJ
            ? onImgClick(nurserysData.TQHDFJ)
            : '',
        DJ: nurserysData.DJ ? nurserysData.DJ : '',
        DJFJ: nurserysData.DJFJ
            ? onImgClick(nurserysData.DJFJ)
            : '',
        XJ: nurserysData.XJ ? nurserysData.XJ : '',
        XJFJ: nurserysData.XJFJ
            ? onImgClick(nurserysData.XJFJ)
            : ''
    };
    return seedlingMess;
};

export const getTreeMessFun = (SmallClassName, ThinClassName, queryTreeData, nurserysData) => {
    // 项目code
    let land = queryTreeData.Land ? queryTreeData.Land : '';
    // 项目名称
    let landName = '';
    // 项目下的标段
    let sections = [];
    // 查到的标段code
    let Section = queryTreeData.Section
        ? queryTreeData.Section
        : '';
    // 标段名称
    let sectionName = '';

    PROJECT_UNITS.map(unit => {
        if (land === unit.code) {
            sections = unit.units;
            landName = unit.value;
        }
    });
    sections.map(section => {
        if (section.code === Section) {
            sectionName = section.value;
        }
    });
    let treeMess = {
        sxm: queryTreeData.ZZBM ? queryTreeData.ZZBM : '',
        landName: landName,
        sectionName: sectionName,
        SmallClass: SmallClassName,
        ThinClass: ThinClassName,
        TreeTypeName: nurserysData.TreeTypeObj
            ? nurserysData.TreeTypeObj.TreeTypeName
            : '',
        Location: queryTreeData.LocationTime
            ? queryTreeData.LocationTime
            : '',
        LocationX: queryTreeData.Location
            ? queryTreeData.Location.X
            : '',
        LocationY: queryTreeData.Location
            ? queryTreeData.Location.Y
            : '',
        DJ: queryTreeData.DJ ? queryTreeData.DJ : '',
        DJFJ: queryTreeData.DJFJ
            ? onImgClick(queryTreeData.DJFJ)
            : '',
        GD: queryTreeData.GD ? queryTreeData.GD : '',
        GDFJ: queryTreeData.GDFJ
            ? onImgClick(queryTreeData.GDFJ)
            : '',
        GF: queryTreeData.GF ? queryTreeData.GF : '',
        GFFJ: queryTreeData.GFFJ
            ? onImgClick(queryTreeData.GFFJ)
            : '',
        MD: queryTreeData.MD ? queryTreeData.MD : '',
        MDFJ: queryTreeData.MDFJ
            ? onImgClick(queryTreeData.MDFJ)
            : '',
        MJ: queryTreeData.MJ ? queryTreeData.MJ : '',
        MJFJ: queryTreeData.MJFJ
            ? onImgClick(queryTreeData.MJFJ)
            : '',
        TQHD: queryTreeData.TQHD ? queryTreeData.TQHD : '',
        TQHDFJ: queryTreeData.TQHDFJ
            ? onImgClick(queryTreeData.TQHDFJ)
            : '',
        TQZJ: queryTreeData.TQZJ ? queryTreeData.TQZJ : '',
        TQZJFJ: queryTreeData.TQZJFJ
            ? onImgClick(queryTreeData.TQZJFJ)
            : '',
        XJ: queryTreeData.XJ ? queryTreeData.XJ : '',
        XJFJ: queryTreeData.XJFJ
            ? onImgClick(queryTreeData.XJFJ)
            : ''
    };
    return treeMess;
};

// 树节点信息查看图片时格式转换
export const onImgClick = (data) => {
    let srcs = [];
    try {
        let arr = data.split(',');
        arr.map(rst => {
            let src = rst.replace(/\/\//g, '/');
            src = `${FOREST_API}/${src}`;
            srcs.push(src);
        });
    } catch (e) {
        console.log('处理图片', e);
    }
    return srcs;
};