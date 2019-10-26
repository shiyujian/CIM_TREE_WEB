// 根据标段，区段，组团的数据获取区段组团的Name
// 此处的区段数据为 001  组团数据为001 类型   不为具体的区段组团No
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
