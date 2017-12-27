import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Button, Row, Col, Input, message} from 'antd';
const Search = Input.Search;
import './index.less'

export default class MainHeader extends Component{
    render(){
        const {showModal, selectJudge} = this.props;
        return(
            <Row>
                <Col span={24}>
                    <Button className="spacing">模板下载</Button>
                    <Button className="spacing" onClick={()=>showModal("uploadModal")}>发起填报</Button>
                    <Button className="spacing" onClick={()=>{selectJudge() && showModal("changeModal")} }>申请变更</Button>
                    <Button className="spacing" onClick={()=>{selectJudge() && showModal("deleteModal")} }>申请删除</Button>
                    <Button className="spacing">导出表格</Button>
                    <Search
                     placeholder="输入搜索条件"
                     className="spacing"
                     style={{ width: 200}}
                    />
                </Col>
            </Row>
        )
    }
}

MainHeader.PropTypes ={
    showModal:PropTypes.func.isRequired
}