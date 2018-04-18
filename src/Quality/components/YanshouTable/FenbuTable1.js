import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Link} from 'react-router-dom';



import { actions as platformActions } from '_platform/store/global';
import { message, Select, Table, Input, Button, Radio ,Spin,Modal} from 'antd';
import { Main, Content, Sidebar, DynamicTitle } from '_platform/components/layout';



import './fenbu.less';


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;


export default class FenbuTable1 extends Component {

    static propTypes = {};
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
                <table className='tbl_td' style={{width:'99%',marginTop:'10px'}}>
                    <tr>
                        <td colSpan='6' align='center'>
                            <div className='fenbu-title'>
                                <p><b>市政基础设施工程</b></p><br/>
                            </div>
                            <div className='fenbu-title'>
                               <h1>分项工程质量验收记录</h1>
                            </div>
                            <div style={{float:'right',marginRight:'10px'}}>
                                <p>市政质检·0·15</p>
                                <p>第  页，共  页</p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>工程名称</td>
                        <td colSpan={5}></td>
                    </tr>
                    <tr>
                        <td>单位工程名称</td>
                        <td colSpan={5}></td>
                    </tr>
                    <tr>
                        <td>施工单位</td>
                        <td colSpan={2}></td>
                        <td>分包单位</td>
                        <td colSpan={2}></td>
                    </tr>
                    <tr>
                        <td>分部（子分部）工程名称</td>
                        <td colSpan={2}></td>
                        <td>分项工程名称</td>
                        <td colSpan={2}></td>
                    </tr>
                    <tr>
                        <td>检验批数</td>
                        <td colSpan={5}></td>
                    </tr>
                    <tr>
                        <td>项目经理</td>
                        <td></td>
                        <td>项目技术负责人</td>
                        <td></td>
                        <td>质检负责人</td>
                        <td></td>
                    </tr>
                     <tr>
                        <td>分包项目经理</td>
                        <td></td>
                        <td>分包项目技术负责人</td>
                        <td></td>
                        <td>分包质检负责人</td>
                        <td></td>
                    </tr>
                </table>
        );
    }

}
