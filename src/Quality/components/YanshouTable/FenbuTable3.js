import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Link} from 'react-router-dom';



import { actions as platformActions } from '_platform/store/global';
import { message, Select, Table, Input, Button, Radio ,Spin,Modal} from 'antd';
import { Main, Content, Sidebar, DynamicTitle } from '_platform/components/layout';

import Approval from '_platform/components/singleton/Approval';


import './fenbu.less';


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;


export default class FenbuTable3 extends Component {

    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
                <table className='tbl_td2' style={{width:'99%',marginTop:'10px'}}>
                    <tr>
                        <td style={{width:'20%'}}>施工单位检查意见</td>
                        <td style={{width:'30%'}} align='center'>
                            <div className='table-foot'>
                                <p>质检员：</p>
                                <p>项目技术负责人:</p>
                                <p style={{alignSelf:'flex-end'}}> 年 月 日 </p>
                            </div>
                        </td>
                        <td style={{width:'20%'}}>监理（建设）单位验收结论</td>
                        <td style={{width:'30%'}} align='center'>
                            <div className='table-foot'>
                                <p>监理工程师:</p>
                                <p style={{alignSelf:'flex-end'}}> 年 月 日 </p>
                            </div>
                        </td>
                    </tr>
                </table>
        );
    }

}
