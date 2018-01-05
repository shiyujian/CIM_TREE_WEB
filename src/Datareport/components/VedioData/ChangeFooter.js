import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Select, Button, Input} from 'antd';
import './index.less';
import {getAllUsers} from './commonFunc';
const TextArea = Input.TextArea;
export default class ChangeFooter extends Component{
    constructor(props){
        super(props);
        this.state={
            checkUsers: []
        };
    }

    async componentDidMount(){
        const checkUsers = await getAllUsers(); //获取所有的用户
        this.setState({checkUsers});
    }

    render(){
        const {checkUsers} = this.state;
        return (<div>
            <div>
                <div className="inlineBlock">审核人: </div>
                <Select onSelect={this.selectCheckUser} className="select" defaultValue={"请选择"} >
                    {checkUsers}
                </Select>
            </div>
            <div>
                <div className="inlineBlock">备注: </div>
                <TextArea rows={2} onChange={this.onChange}/>
            </div>
        </div>)
    }

    selectCheckUser = (value)=>{
        const {storeState} = this.props;
        storeState({selectUser:JSON.parse(value)});
    }

    onChange = (e)=> {
        const {storeState} = this.props;
        storeState({description:e.target.value});
	}
}