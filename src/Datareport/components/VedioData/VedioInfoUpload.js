import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Row, Col} from 'antd';

import VedioInfoTable from './VedioInfoTable';
import UploadFooter from './UploadFooter'
import './index.less';

export default class VedioInfoUpload extends Component{
    constructor(props){
        super(props);
        this.state={
        }
    }

    render(){

        return(<div>
            <Row type='flex' justify='center' >
                <p className="titleFont">结果预览</p>
            </Row>
            <VedioInfoTable/>
            <UploadFooter/>
        </div>)
    }
}

VedioInfoUpload.PropTypes ={
    //showChange:PropTypes.func.isRequired
}