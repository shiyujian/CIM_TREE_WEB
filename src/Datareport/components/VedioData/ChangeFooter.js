import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Select, Button, Input, message} from 'antd';
import './index.less';
import {getAllUsers} from './commonFunc';
const TextArea = Input.TextArea;
export default class ChangeFooter extends Component{
    constructor(props){
        super(props);
        this.state={
            checkUsers: []
        };
        Object.assign(this,{
            selectUser: null,
            description: null
        })
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
                <Button onClick={this.onSubmit} type="primary" className="spacing" >提交</Button>
            </div>
            <div>
                <div className="inlineBlock">备注: </div>
                <TextArea rows={2} onChange={this.onChange}/>
            </div>
        </div>)
    }

    selectCheckUser = (value)=>{
        this.selectUser = JSON.parse(value);
    }

    onChange = (e)=> {
        this.description = e.target.value
	}

    onSubmit = ()=>{
        const {selectUser,description} = this;
        if(!selectUser){
            message.error("请选择审核人！");
            return
        }
        
        const {onOk} = this.props;
        onOk(selectUser,description);
    }
}