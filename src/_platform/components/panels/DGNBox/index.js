/**
*
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
*
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, {PropTypes, Component} from 'react';
import {Modal} from 'antd';
import $ from 'jquery';
import './index.css';

let dgn = window.dgn;
var count = 0;

export default class DGNBox extends React.Component {
    constructor (props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount () {
        dgn.style.height = this.props.height;
        dgn.style.width = this.props.width;
        dgn.style.display = 'block';
        dgn.style.border = '1px solid';
        $(this.refs.innerdgndbbox).html(dgn);
        this.initDgn();
    }

    componentWillUnmount () {
    }
    // LocCode定位,通过code来显示model
    createCuboidClipByNameOrCode (locCode, topViewRotation, bSaveView) {
        if (locCode) {
            dgn.CreateCuboidClipByNameOrCode(0, 'code', locCode, topViewRotation, bSaveView);
        }
    }
    // locCode,MatchCode,topViewRotation,hilited,marked,true
    // 通过locCode和matchCode(kkscode/encode/compecd/wbscode)来定位模型
    LocateElement (locCode, matchCode, topViewRotation, hilited, marked, bSaveView) {
        if (matchCode) {
            dgn.LocateElement(0, 'code', locCode, matchCode, topViewRotation, hilited, marked, bSaveView);
        }
    }
    // locationCodes,matchcodes
    LocateMultiElements (locationCodes, topViewRotation, hilited, marked, bSaveView) {
        var elmsInfo = [];
        var locationCode;
        if (locationCodes) {
            for (var i = 0; i < locationCodes.length; i++) {
                locationCode = locationCodes[i];
                elmsInfo.push({
                    matchcode: locationCode.tag,
                    locCode: locationCode.loc
                });
            };
            if (elmsInfo) {
                dgn.LocateMultiElements(0, JSON.stringify(elmsInfo),
                    topViewRotation, hilited, marked, bSaveView);
            }
        }
    }
    // dgn变换
    dgndbOpenTranslate () {
        let jsxThis = this;
        setTimeout(function () {
	        jsxThis.OnPanView();
	        jsxThis.OnStandardISOView();
	        jsxThis.OnFitView();
	    }, 2000);
    }

    shouldComponentUpdate (nextProps, nextState) {
        if (this.props.model == nextProps.model &&
        this.props.locCode == nextProps.locCode &&
        this.props.matchCode == nextProps.matchCode &&
        this.props.locationCodes == nextProps.locationCodes) {
            return false;
        } else {
            return true;
        }
        return true;
    }

    componentDidUpdate () {
        this.initDgn();
    }

    initDgn () {
        try {
            let model = this.props.model;
            let locCode = this.props.locCode;
            let matchCode = this.props.matchCode;
            let locationCodes = this.props.locationCodes;
    		dgn.OpenDgnDbProject(encodeURI(model));
            console.log('--------------');
            console.log('count: ', count++);
    		console.log('model-name', model);
            console.log('locCode: ', locCode);
            console.log('matchCode: ', matchCode);
            console.log('locationCodes: ', locationCodes);
            console.log('--------------');
    		//
    		switch (this.props.typename) {
    			case 'sysext':
                    try {
                        // if(locCode.length && locCode.length !== 0 && matchCode.length && matchCode.length !== 0) {
                        // if(locCode !== null && matchCode ) {
        				    this.LocateElement(locCode, matchCode, true, false, true, true);
                        // }
        				this.dgndbOpenTranslate();
                    } catch (error) {}
    				break;
    			case 'subsysext':
                    try {
                        if (locationCodes.length && locationCodes.length !== 0) {
        				    this.LocateMultiElements(locationCodes, false, false, true, true);
                        }
        				this.dgndbOpenTranslate();
                    } catch (error) {}
    				break;
    			case 'tagext':
                    try {
                        // if(locCode.length && locCode.length !== 0 && matchCode.length && matchCode.length !== 0) {
        				    this.LocateElement(locCode, matchCode, true, false, true, true);
                        // }
        				this.dgndbOpenTranslate();
                    } catch (error) {}
    				break;
    			case 'locext':
                    try {
                        if (locCode.length && locCode.length !== 0) {
            				this.createCuboidClipByNameOrCode(locCode, true, true);
                        }
        				this.dgndbOpenTranslate();
                    } catch (error) {}
    				break;
    			default :
    				this.dgndbOpenTranslate();
    				break;
    		}
        } catch (exception) {

        }
    }

    // 窗口放大,放大内容需要重新修改
    OnFullView () {
        const to = `/dgnmaxview/dgn-max/${this.props.model}`;
        let {router} = this.props;
        const title = '放大-' + this.props.model;
        try {
            router.push(to);
        } catch (e) {
            console.log(e);
        }
        // openTab({title, to});
    }
    // 前一视图
    OnUndoView () {
        dgn.ViewOperation(4, 1);
    }
    // 后一视图
    OnRedoView () {
        dgn.ViewOperation(5, 1);
    }
    // 平移视图
    OnPanView () {
        dgn.ViewOperation(7, 1);
    }
    // 旋转视图
    OnRotateView () {
        dgn.ViewOperation(3, 1);
    }
    // 选择对象
    OnSelectElement () {
        dgn.ViewOperation(1, 1);
    }
    // 轴测视图
    OnStandardISOView () {
        dgn.ViewOperation(6, 1);
    }
    // 全局视图
    OnFitView () {
        dgn.ViewOperation(2, 1);
    }
    render () {
        console.log('DGNBox render!');
        const dgndbmaxImg = require('./btn-dgn.png');
        const dgndbpreviewImg = require('./btn-dgn1.png');
        const dgndbnextviewImg = require('./btn-dgn2.png');
        const dgndbspinImg = require('./btn-dgn3.png');
        const dgndbtranslateImg = require('./btn-dgn4.png');
        const dgndbselectImg = require('./btn-dgn5.png');
        return (
            <div className='t3d-dgn'>
                <div className='t3d-box' ref='innerdgndbbox' />
                <div className='dgndb-top-btn'>
                    <a onClick={this.OnFullView.bind(this)} href='javascript:;'>
                        <img src={dgndbmaxImg} style={{width: '20px', height: '20px', border: '1px solid #000'}} />
                    </a>
                </div>
                <div style={{padding: '3px'}} className='dgndb-bottom-btn'>
                    <a onClick={this.OnUndoView.bind(this)} href='javascript:;'>
                        <img src={dgndbpreviewImg} style={{width: '24px', height: '24px'}} />
                    </a>
                    <a onClick={this.OnRedoView.bind(this)} href='javascript:;'>
                        <img src={dgndbnextviewImg} style={{width: '24px', height: '24px'}} />
                    </a>
                    <a onClick={this.OnRotateView.bind(this)} href='javascript:;'>
                        <img src={dgndbspinImg} style={{width: '24px', height: '24px', border: '1px solid #000'}} />
                    </a>
                    <a onClick={this.OnPanView.bind(this)} href='javascript:;'>
                        <img src={dgndbtranslateImg} style={{width: '24px', height: '24px', border: '1px solid #000'}} />
                    </a>
                    <a onClick={this.OnSelectElement.bind(this)} href='javascript:;'>
                        <img src={dgndbselectImg} style={{width: '24px', height: '24px', border: '1px solid #000'}} />
                    </a>
                </div>
                <iframe className='dgndb-top-mark' />
                <iframe className='dgndb-bottom-mark' />
            </div>
        );
    }
}
