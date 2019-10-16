// 对苗圃基地和供应商按照行政区划进行划分
export const addGroup = (childrenList, str) => {
    const regionCode_name = JSON.parse(window.sessionStorage.getItem('regionCode_name'));
    if (str === '供应商') {
        childrenList.map(item => {
            if (regionCode_name[item.RegionCode]) {
                const regionNameArr = regionCode_name[item.RegionCode].split(',');
                item.province = regionNameArr[1];
                item.city = regionNameArr[2];
                item.county = regionNameArr[3];
                item.OrgName = item.SupplierName;
                item.OrgCode = item.OrgPK;
            }
        });
    } else {
        childrenList.map(item => {
            if (regionCode_name[item.RegionCode]) {
                const regionNameArr = regionCode_name[item.RegionCode].split(',');
                item.province = regionNameArr[1];
                item.city = regionNameArr[2];
                item.county = regionNameArr[3];
                item.OrgName = item.NurseryName;
                item.OrgCode = item.OrgPK;
            }
        });
    }
    let provinceArr = [];
    childrenList.map(item => {
        if (!provinceArr.includes(item.province)) {
            provinceArr.push(item.province);
        }
    });
    let newChildren = [];
    provinceArr.map((item) => {
        let cityArr = [];
        childrenList.map(row => {
            if (item === row.province && !cityArr.includes(row.city)) {
                cityArr.push(row.city);
            }
        });
        let provinceChildren = [];
        cityArr.map((row) => {
            let cityChildren = [];
            let countyArr = [];
            childrenList.map(record => {
                if (row === record.city && !countyArr.includes(record.county)) {
                    countyArr.push(record.county);
                }
            });
            countyArr.map(record => {
                let countyChildren = [];
                childrenList.map(ite => {
                    if (row === ite.city && record === ite.county) {
                        countyChildren.push(ite);
                    }
                });
                cityChildren.push({
                    OrgName: record || '其他',
                    OrgCode: str + item + row + record,
                    ID: str + item + row + record,
                    children: countyChildren
                });
            });
            provinceChildren.push({
                OrgName: row || '其他',
                OrgCode: str + item + row,
                ID: str + item + row,
                children: cityChildren
            });
        });
        newChildren.push({
            OrgName: item || '其他',
            OrgCode: str + item,
            ID: str + item,
            children: provinceChildren
        });
    });
    return newChildren;
};
