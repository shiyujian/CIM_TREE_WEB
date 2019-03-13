
// 从 MULTIPOLYGON(((116.0316566299076 38.99911578423726,116.03163110851324 38.99911806579688)))中
// 得到116.0316566299076 38.99911578423726, 116.03163110851324 38.99911806579688]
export const getCoordsArr = (wkt) => {
    let coordsArr = [], str = '';
    if (wkt.indexOf('MULTIPOLYGON') !== -1) {
        str = wkt.slice(wkt.indexOf('(((') + 3, wkt.indexOf(')))'));
        coordsArr = str.split(',');
    } else if (wkt.indexOf('POLYGON') !== -1) {
        str = wkt.slice(wkt.indexOf('((') + 2, wkt.indexOf('))'));
        coordsArr = str.split(',');
    }
    return coordsArr;
};

// 根据[116.0316566299076 38.99911578423726, 116.03163110851324 38.99911806579688]得到MULTIPOLYGON
export const getWulPolygonByCoordArr = (coordinates) => {
    let muitiPolygon = 'MULTIPOLYGON(((';
    if (coordinates.length > 0) {
        coordinates[0].map(item => {
            muitiPolygon += item[0] + ' ' + item[1] + ',';
        });
    }
    muitiPolygon = muitiPolygon.slice(0, -1);
    muitiPolygon += ')))';
    return muitiPolygon;
};

// 根据[116.0316566299076 38.99911578423726, 116.03163110851324 38.99911806579688]得到POLYGON
export const getPolygonByCoordArr = (CoordArr) => {
    let polygon = 'POLYGON ((';
    CoordArr.map(item => {
        polygon += item + ',';
    });
    polygon = polygon.slice(0, -1) + '))';
    return polygon;
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
