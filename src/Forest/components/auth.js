
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
