
export const getSectionNameBySection = (section, thinClassTree) => {
    try {
        let sectionArr = section.split('-');
        let sectionName = '';
        if (sectionArr instanceof Array && sectionArr.length === 3) {
            thinClassTree.map((projectData) => {
                if (sectionArr[0] === projectData.No) {
                    let sectionData = projectData.children;
                    sectionData.map((child) => {
                        if (section === child.No) {
                            sectionName = child.Name;
                        }
                    });
                }
            });
        }
        return sectionName;
    } catch (e) {
        console.log('getSectionNameBySection', e);
    }
};

export const getProjectNameBySection = (section, thinClassTree) => {
    try {
        let projectName = '';
        let sectionArr = section.split('-');
        if (sectionArr instanceof Array && sectionArr.length === 3) {
            thinClassTree.map((projectData) => {
                if (sectionArr[0] === projectData.No) {
                    projectName = projectData.Name;
                }
            });
        }
        return projectName;
    } catch (e) {
        console.log('getProjectNameBySection', e);
    }
};

// 根据标段，小班，细班的数据获取小班细班的Name
// 此处的小班数据为 001  细班数据为001 类型   不为具体的小班细班No
export const getSmallThinNameByPlaceData = (section, smallClass, thinClass, thinClassTree) => {
    let smallClassName = '';
    let thinClassName = '';
    let smallThinName = '';
    try {
        let sectionArr = section.split('-');
        thinClassTree.map((projectData) => {
            if (projectData.No === sectionArr[0]) {
                let sectionDatas = projectData.children;
                sectionDatas.map((sectionData) => {
                    if (section === sectionData.No) {
                        let smallClassDatas = sectionData.children;
                        smallClassDatas.map((smallClassData) => {
                            let smallClassDataArr = smallClassData.No.split('-');
                            if (smallClass === smallClassDataArr[3]) {
                                smallClassName = smallClassData.Name;
                                let thinClassDatas = smallClassData.children;
                                thinClassDatas.map((thinClassData) => {
                                    let thinClassDataArr = thinClassData.No.split('-');
                                    if (thinClass === thinClassDataArr[4]) {
                                        thinClassName = thinClassData.Name;
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
        smallThinName = smallClassName + thinClassName;
        return smallThinName;
    } catch (e) {
        console.log('getSmallThinNameByPlaceData', e);
    }
};

export const getTreeTypeNameByTreeTypeID = (TreeType, treetypes) => {
    try {
        let treeTypeName = '';
        treetypes.map((tree) => {
            if (tree.ID === TreeType) {
                treeTypeName = tree.TreeTypeName;
            }
        });
        return treeTypeName;
    } catch (e) {
        console.log('getTreeTypeNameByTreeTypeID', e);
    }
};
