/**
 * Created by tinybear on 17/5/22.
 */

import EventEmitter from "wolfy87-eventemitter";


export default class Track extends EventEmitter{
    constructor(map,options={}){
        super();
        this.tick = null;
        this.map = map;
        this.state = false;
        this.track = null;
        this.marker = null;
        //解析数据
        this._originData = null;
        this.times = [];
        this.coordinates = [];
        this.startTime = '';
        this.endTime = '';
        this.curIndex = -1;//当前播放的点
        this.user = "";
    }

    _drawMarker(){
        let [a,b] = this.coordinates[this.curIndex];
        let time = this.times[this.curIndex];
        let coord = [b,a];
        let popupContent= `<p>${this.user}</p><p>${time}</p>`;
        if(!this.marker) {
            let iconType = L.divIcon({className: styles['peopleIcon']});
            this.marker = L.marker(coord,{icon:iconType}).bindPopup(popupContent);
            this.marker.addTo(this.map);
            this.marker.openPopup();
        }else{
            this.marker.setLatLng(coord);
            this.marker.setPopupContent(popupContent);
        }
        this.emit('change',this.curIndex);
    }

    /*绘制点*/
    _drawTrack(){
        if(this.curIndex>=this.coordinates.length-1) {
            this.stop();
            return;
        }
        //取到下一个坐标点地图展示
        this.curIndex++;
        this._drawMarker();
    }

    setData(geojson,startTime,endTime,user){
        if(!this.state){
            //清理老数据
            this.dispose();
            this._originData = geojson;
            this.times = geojson.properties.times;
            this.coordinates = geojson.geometry.coordinates;
            this.curIndex = -1;//当前播放的点
            this.startTime = startTime;
            this.endTime = endTime;
            this.user = user;
        }
    }

    forceDrawNext(step){
        this.curIndex = step;
        this._drawMarker();
    }

    start(){
        if(this.curIndex>=this.coordinates.length-1){
            //重新开始
            this.curIndex = -1;
        }
        this._drawTrack();
        this.tick =  setInterval(this._drawTrack.bind(this),1000);
        this.state = true;
        this.emit('stateChange',this.state);
    }

    stop(){
        clearInterval(this.tick);
        this.state = false;
        this.emit('stateChange',this.state);
    }

    dispose(){
        this.stop();
        this.marker && this.marker.remove();
        this.marker = null;
        this.track && this.track.remove();
    }

    showAndHideTrack(isShow = true){
        //绘制轨迹线和点
        if(isShow)
            this.track = L.geoJSON(this._originData, {
                style: function () {
                    return {color: "red"};
                }
            }).addTo(this.map);
        else
            this.track && this.track.remove();
    }

    /*地图缩放至轨迹图形区域*/
    zoomToTrack(){
        this.map.fitBounds(this.track.getBounds(),{padding:[120,120]});
    }

}

