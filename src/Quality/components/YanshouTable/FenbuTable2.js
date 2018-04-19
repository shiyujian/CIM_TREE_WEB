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


export default class FenbuTable2 extends Component {

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
                        <td rowSpan={2}>序号</td>
                        <td rowSpan={2}>检验批部位、区段名称</td>
                        <td colSpan={2}>施工单位自检情况</td>
                        <td rowSpan={2}>监理（建设）单位验收情况或验收意见</td>
                    </tr>
                    <tr>
                        <td>合格率（%）</td>
                        <td>检验结论</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>16</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>17</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>18</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colSpan={2}>平均合格率（%）</td>
                        <td colSpan={3}></td>
                    </tr>
                    <tr>
                        <td colSpan={2}>质量控制资料</td>
                        <td colSpan={2}></td>
                        <td></td>
                    </tr>
                </table>
        );
    }

}
