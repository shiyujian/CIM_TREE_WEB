
export const getUnits = (code, array) => {
    let total = [];
    let datas = [];
    datas[0] = new Array();
    datas[1] = new Array();
    datas[2] = new Array();
    datas[3] = new Array();
    datas[4] = new Array();
    datas[5] = new Array();
    if (code === 'P009') {
        array.map(item => {
            if (item && item.Section) {
                switch (item.Section) {
                    case 'P009-01-01' :
                        datas[0].push(item);
                        break;
                    case 'P009-01-02' :
                        datas[1].push(item);
                        break;
                    case 'P009-01-03' :
                        datas[2].push(item);
                        break;
                    case 'P009-01-04' :
                        datas[3].push(item);
                        break;
                    case 'P009-01-05' :
                        datas[4].push(item);
                        break;
                }
            }
        });
    } else if (code === 'P010') {

    }
};
