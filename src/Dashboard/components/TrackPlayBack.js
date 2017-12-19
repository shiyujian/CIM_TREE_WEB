/**
 * Created by tinybear on 17/5/23.
 */

import React ,{Component} from 'react';
import {Slider,Icon,Checkbox,DatePicker,message} from 'antd';
import Track from "./leaflet-track";
const {  RangePicker } = DatePicker;

export default class TrackPlayBack extends Component {

    constructor(props){
        super(props);
        this.state = {
            trackState:false,
            minStep:0,
            maxStep:0,
            curStep:0
        };
        this.track = null;
        this.startTime = null;
        this.endTime = null;
    }

    componentDidMount(){
        this.initTrack();
    }

    componentWillUnmount(){
        this.track && this.track.dispose();
    }

    /*轨迹回放*/
    initTrack(){
        let me = this;
        this.track = new Track(this.props.map);
        this.track.on('stateChange',(trackState)=>{
            this.state.trackState = trackState;
            me.setState({trackState:this.state.trackState});
        });
        this.track.on('change',(curStep)=>{
            me.setState({curStep:curStep});
        });
    }
    startAndStopTrack(){
        let me = this;
        if(this.state.trackState) {
            this.track.stop();
            return;
        }

        this.track.start()
    }

    queryTrack(){
        let me = this;
        //判断是否需要请求数据 时间变更请求
        if(!this.startTime || !this.endTime){
            //提示选择时间
            message.error('请选择查看哪个时间段的轨迹');
            return;
        }

        if(this.track.startTime.valueOf() == this.startTime.valueOf() &&
            this.track.endTime.valueOf() == this.endTime.valueOf()) {
            return;
        }

        const {getTrack} = this.props.actions;
        getTrack({ID:this.props.trackId},{
            "start_time":this.startTime.format("YYYY-MM-DD HH:mm:ss"),
            "end_time":this.endTime.format("YYYY-MM-DD HH:mm:ss")
        }).then(data=> {
            if (!data.length) {
                me.track.dispose();
                message.error(`未查询到【${me.props.trackUser}】在该时间段内的轨迹点`);
                return;
            }
            let geoJson = {
                "type": "Feature",
                "properties": {
                    times: []
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": []
                }
            };
            //转换数据
            data.forEach(v=> {
                geoJson.properties.times.push(v["upload_time"]);
                geoJson.geometry.coordinates.push([v.lng, v.lat]);
            });
            me.track.setData(geoJson, me.startTime, me.endTime, this.props.trackUser);
            me.track.showAndHideTrack();
            me.track.zoomToTrack();
            me.setState({minStep: 0, maxStep: this.track.coordinates.length - 1});

        })
    }

    showTrack(e){
        this.track.showAndHideTrack(e.target.checked);
    }
    
    sliderChange(step){
        this.track.forceDrawNext(step);
    }

    close(){
        let {close} = this.props;
        this.track.dispose();
        close();
    }

    dateChange(dates){
        this.startTime = dates[0];
        this.endTime = dates[1];
    }

    render() {
        return (
            <div className="trackPanel">
                <div className="track">
                    <div className="timeRange" >
                        <RangePicker showTime={true}
                                     onOk={this.queryTrack.bind(this)}
                                     onChange={this.dateChange.bind(this)}
                                     format="YYYY-MM-DD HH:mm:ss"/>
                    </div>
                    <div className="btnCtronl" onClick={this.startAndStopTrack.bind(this)}>
                        <Icon type="caret-right"  style={{display:this.state.trackState?"none":"inline-block"}}/>
                        <Icon type="pause" style={{display:this.state.trackState?"inline-block":"none"}}/>
                    </div>
                    <div className="slider">
                        <Slider defaultValue={10} min={this.state.minStep} max={this.state.maxStep}
                            value={this.state.curStep} onChange={this.sliderChange.bind(this)}
                        />
                    </div>
                    <div className="isShow">
                        <Checkbox defaultChecked={true} onChange={this.showTrack.bind(this)}>显示轨迹</Checkbox>
                    </div>
                    <div className="trackClose">
                    <a href="javascript:;" onClick={this.close.bind(this)}><Icon type="close"/></a>
                    </div>
                </div>
            </div>
        );
    }
}

