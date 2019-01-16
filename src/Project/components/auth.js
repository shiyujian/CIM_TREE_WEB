
export const getCoordsArr = (wkt) => {
    let coords = [], str = '';
    if (wkt.indexOf('MULTIPOLYGON') !== -1) {
        let data = wkt.slice(wkt.indexOf('(') + 2, wkt.indexOf('))') + 1);
        let arr = data.split('),(');
        arr.map((a, index) => {
            if (index === 0) {
                str = a.slice(a.indexOf('(') + 1, a.length - 1);
            } else if (index === arr.length - 1) {
                str = a.slice(0, a.indexOf(')'));
            } else {
                str = a;
            }
            coords.push(str);
        });
    } else if (wkt.indexOf('POLYGON') !== -1) {
        str = wkt.slice(wkt.indexOf('(') + 3, wkt.indexOf(')'));
        coords.push(str);
    }
    return coords;
};

export const handleCoordinates = (str) => {
    let target = str.split(',').map(item => {
        return item.split(' ').map(_item => _item - 0);
    });
    let treearea = [];
    let arr = [];
    target.map((data, index) => {
        if ((data[1] > 30) && (data[1] < 45) && (data[0] > 110) && (data[0] < 120)) {
            arr.push([data[1], data[0]]);
        }
    });
    treearea.push(arr);
    return treearea;
};

export const fillAreaColor = (index) => {
    let colors = ['#c3c4f5', '#e7c8f5', '#c8f5ce', '#f5b6b8', '#e7c6f5'];
    return colors[index % 5];
};
