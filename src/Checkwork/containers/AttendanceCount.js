import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../store/attendanceCount';
import { actions as platformActions } from '_platform/store/global';
import {
    Main,
    Body,
    Content,
    DynamicTitle
} from '_platform/components/layout';
import {Spin} from 'antd';
import { CountFilter, CountTable } from '../components/AttendanceCount';
@connect(
    state => {
        
        const { checkwork: { attendanceCount = {} }, platform } = state;
        return { ...attendanceCount, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            { ...actions, ...platformActions },
            dispatch
        )
    })
)
export default class AttendanceCount extends Component {
    constructor (props) {
        super(props);
        this.state = {
            allcheckrecord: [], //考勤列表
            loading: false,
        };
    }
    
    componentWillMount () {
        this.getCheckRecord();
    }

    componentDidMount () {

    }


    getCheckRecord () {
        const { getCheckRecord } = this.props.actions; // 获取所有考勤信息
        getCheckRecord().then(rep => {
            this.setState({
                allcheckrecord: rep,
                loading: false
            });
        });
    }

    query = (queryParams) => {  //考勤查询
        const {actions: {getCheckRecord}} = this.props;
        let params = []; 
        if (queryParams) {
            for (let key in queryParams) {
                if(queryParams[key] !=undefined){
                    params.push(key + '=' + encodeURI(queryParams[key]));
                }
            }
        }
        params = params.join('&');
        this.setState({
            loading:true
        })
        getCheckRecord({params})
          .then((data) => {
              this.setState({
                  allcheckrecord: data,
                  loading: false
              });
          });

    };

    render () {
        return (
            <div style={{overflow:'hidden', padding:'0 20px',marginLeft:'160px',marginTop:'20px'}}>
                <CountFilter {...this.props} {...this.state} query={this.query.bind(this)}/>
                <Spin spinning={this.state.loading} tip='数据加载中，请稍等...'>
                    <CountTable {...this.props} {...this.state} /> 
                </Spin>
            </div>     
        );
    }
}
