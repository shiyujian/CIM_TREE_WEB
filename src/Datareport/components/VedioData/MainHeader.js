import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Button, Row, Col, Input, message} from 'antd';
import {NODE_FILE_EXCHANGE_API} from '_platform/api.js';
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
                    <Button className="spacing" onClick={this.getExcel}>导出表格</Button>
                    <Search
                     placeholder="输入搜索条件"
                     className="spacing"
                     style={{ width: 200}}
                    />
                </Col>
            </Row>
        )
    }

    getExcel = ()=>{
        const {jsonToExcel,deriveData} = this.props;
        jsonToExcel({},{rows:deriveData()}).then(rst => {
            const url = `${NODE_FILE_EXCHANGE_API}/api/download/${rst.filename}`
            window.open(url)
            //createLink(this,NODE_FILE_EXCHANGE_API+'/api/download/'+rst.filename);
        })
    }
}

MainHeader.PropTypes ={
    showModal:PropTypes.func.isRequired
}

const createLink = (name, url) => {    //下载未应用
    let link = document.createElement("a");
    link.href = url;
    link.setAttribute('download', this);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}