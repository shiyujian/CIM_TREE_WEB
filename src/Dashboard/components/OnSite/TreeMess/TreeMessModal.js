import React, { Component } from 'react';
import { Button, Modal, Form, Row, Input, Tabs, Spin } from 'antd';
import Scrollbar from 'smooth-scrollbar';
import './TreeMessModal.less';
import closeImg from './TreeMessImg/close.png';
const TabPane = Tabs.TabPane;

class TreeMessModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabSelect: 'nursery',
            imgViewSrc: '',
            imgViewModalVisible: false
        };
    }

    componentDidMount = async () => {
        if (document.querySelector('#TreeMessAsideDom')) {
            let TreeMessAsideDom = Scrollbar.init(document.querySelector('#TreeMessAsideDom'));
            console.log('TreeMessAsideDom', TreeMessAsideDom);
        }
    };
    componentDidUpdate(prevProps, prevState) {
    }

    handleTreeModalCancel = async () => {
        await this.props.onCancel();
    }
    //  切换标签页
    tabChange(key) {
    }

    handleImgView(src) {
        this.setState({
            imgViewSrc: src,
            // imgViewModalVisible: true
        });
    }

    handleImgViewModalCancel() {
        this.setState({
            imgViewSrc: '',
            imgViewModalVisible: false
        });
    }
    // 切换标签页
    handleTabChange = (e) => {
        let target = e.target;
        let buttonID = target.getAttribute('id');
        this.setState({
            tabSelect: buttonID
        });
    }

    render() {
        const {
            seedlingMess,
            treeMess,
            flowMess,
            curingMess,
            treeMessModalLoading
        } = this.props;
        const {
            imgViewSrc = '',
            imgViewModalVisible = false,
            tabSelect
        } = this.state;

        let arr = [
            <Button key='back' size='large' onClick={this.handleTreeModalCancel.bind(this)}>
                关闭
            </Button>
        ];
        let footer = arr;
        let imgViewBut = [
            <Button key='back' size='large' onClick={this.handleImgViewModalCancel.bind(this)}>
                关闭
            </Button>
        ];
        let imgViewFooter = imgViewBut;
        return (
            <div>
                <div className='TreeMessPage-container'>
                    <div className='TreeMessPage-r-main'>
                        <div className={`TreeMessPage-menuPanel`}>
                            <div className='TreeMessPage-menuBackground' />
                            <aside className='TreeMessPage-aside' id='TreeMessAsideDom'>
                                <div className='TreeMessPage-aside-MessLayout'>
                                    <img src={closeImg}
                                        onClick={this.handleTreeModalCancel.bind(this)}
                                        className='TreeMessPage-closeImg' />
                                    <Spin spinning={treeMessModalLoading}>
                                        {
                                            tabSelect === 'nursery'
                                                ? <div style={{ width: 450 }}>
                                                    <div>
                                                        <span className='TreeMessPage-aside-Mess-title'>
                                                            顺序码:
                                                            <span className='TreeMessPage-aside-Mess-text'>
                                                                {seedlingMess.sxm
                                                                    ? seedlingMess.sxm
                                                                    : ''}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className='TreeMessPage-aside-Mess-title'>
                                                            打包车牌:
                                                            <span className='TreeMessPage-aside-Mess-text'>
                                                                {seedlingMess.car ? seedlingMess.car : ''}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className='TreeMessPage-aside-Mess-title'>
                                                            树种:
                                                            <span className='TreeMessPage-aside-Mess-text'>
                                                                {seedlingMess.TreeTypeName
                                                                    ? seedlingMess.TreeTypeName
                                                                    : ''}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className='TreeMessPage-aside-Mess-title'>
                                                            产地:
                                                            <span className='TreeMessPage-aside-Mess-text'>
                                                                {seedlingMess.TreePlace
                                                                    ? seedlingMess.TreePlace
                                                                    : ''}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className='TreeMessPage-aside-Mess-title'>
                                                            供应商:
                                                            <span className='TreeMessPage-aside-Mess-text'>
                                                                {seedlingMess.Factory
                                                                    ? seedlingMess.Factory
                                                                    : ''}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className='TreeMessPage-aside-Mess-title'>
                                                            苗圃名称:
                                                            <span className='TreeMessPage-aside-Mess-text'>
                                                                {seedlingMess.NurseryName
                                                                    ? seedlingMess.NurseryName
                                                                    : ''}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className='TreeMessPage-aside-Mess-title'>
                                                            起苗时间:
                                                            <span className='TreeMessPage-aside-Mess-text'>
                                                                {seedlingMess.LifterTime
                                                                    ? seedlingMess.LifterTime
                                                                    : ''}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className='TreeMessPage-aside-Mess-title'>
                                                            起苗地点:
                                                            <span className='TreeMessPage-aside-Mess-text'>
                                                                {seedlingMess.nurserysAddressName
                                                                    ? (seedlingMess.location
                                                                        ? `${seedlingMess.nurserysAddressName}(${seedlingMess.location})`
                                                                        : seedlingMess.nurserysAddressName)
                                                                    : (seedlingMess.location
                                                                        ? seedlingMess.location
                                                                        : '')}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    {seedlingMess.GD ? (
                                                        <div>
                                                            <div>
                                                                <span className='TreeMessPage-aside-Mess-title'>
                                                                    高度(cm):
                                                                    <span className='TreeMessPage-aside-Mess-text'>
                                                                        {seedlingMess.GD}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            {seedlingMess.GDFJ
                                                                ? seedlingMess.GDFJ.map(
                                                                    src => {
                                                                        return (
                                                                            <div key={src}>
                                                                                <img
                                                                                    style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        display: 'block',
                                                                                        marginTop: '10px'
                                                                                    }}
                                                                                    onClick={this.handleImgView.bind(this, src)}
                                                                                    src={
                                                                                        src
                                                                                    }
                                                                                    alt='图片'
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                                : ''}
                                                        </div>) : ''}
                                                    {seedlingMess.GF ? (
                                                        <div>
                                                            <div>
                                                                <span className='TreeMessPage-aside-Mess-title'>
                                                                    冠幅(cm):
                                                                    <span className='TreeMessPage-aside-Mess-text'>
                                                                        {seedlingMess.GF}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            {seedlingMess.GFFJ
                                                                ? seedlingMess.GFFJ.map(
                                                                    src => {
                                                                        return (
                                                                            <div key={src}>
                                                                                <img
                                                                                    style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        display: 'block',
                                                                                        marginTop: '10px'
                                                                                    }}
                                                                                    onClick={this.handleImgView.bind(this, src)}
                                                                                    src={
                                                                                        src
                                                                                    }
                                                                                    alt='图片'
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                                : ''}
                                                        </div>) : ''}
                                                    {seedlingMess.XJ ? (
                                                        <div>
                                                            <div>
                                                                <span className='TreeMessPage-aside-Mess-title'>
                                                                    胸径(cm):
                                                                    <span className='TreeMessPage-aside-Mess-text'>
                                                                        {seedlingMess.XJ}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            {seedlingMess.XJFJ
                                                                ? seedlingMess.XJFJ.map(
                                                                    src => {
                                                                        return (
                                                                            <div key={src}>
                                                                                <img
                                                                                    style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        display: 'block',
                                                                                        marginTop: '10px'
                                                                                    }}
                                                                                    onClick={this.handleImgView.bind(this, src)}
                                                                                    src={
                                                                                        src
                                                                                    }
                                                                                    alt='图片'
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                                : ''}
                                                        </div>) : ''}
                                                    {seedlingMess.TQHD ? (
                                                        <div>
                                                            <div>
                                                                <span className='TreeMessPage-aside-Mess-title'>
                                                                    土球厚度(cm):
                                                                    <span className='TreeMessPage-aside-Mess-text'>
                                                                        {seedlingMess.TQHD}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            {seedlingMess.TQHDFJ
                                                                ? seedlingMess.TQHDFJ.map(
                                                                    src => {
                                                                        return (
                                                                            <div key={src}>
                                                                                <img
                                                                                    style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        display: 'block',
                                                                                        marginTop: '10px'
                                                                                    }}
                                                                                    onClick={this.handleImgView.bind(this, src)}
                                                                                    src={
                                                                                        src
                                                                                    }
                                                                                    alt='图片'
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                                : ''}
                                                        </div>) : ''}
                                                    {seedlingMess.TQZJ ? (
                                                        <div>
                                                            <div>
                                                                <span className='TreeMessPage-aside-Mess-title'>
                                                                    土球直径(cm):
                                                                    <span className='TreeMessPage-aside-Mess-text'>
                                                                        {seedlingMess.TQZJ}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            {seedlingMess.TQZJFJ
                                                                ? seedlingMess.TQZJFJ.map(
                                                                    src => {
                                                                        return (
                                                                            <div key={src}>
                                                                                <img
                                                                                    style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        display: 'block',
                                                                                        marginTop: '10px'
                                                                                    }}
                                                                                    onClick={this.handleImgView.bind(this, src)}
                                                                                    src={
                                                                                        src
                                                                                    }
                                                                                    alt='图片'
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                                : ''}
                                                        </div>) : ''}
                                                    {seedlingMess.DJ ? (
                                                        <div>
                                                            <div>
                                                                <span className='TreeMessPage-aside-Mess-title'>
                                                                    地径(cm):
                                                                    <span className='TreeMessPage-aside-Mess-text'>
                                                                        {seedlingMess.DJ}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            {seedlingMess.DJFJ
                                                                ? seedlingMess.DJFJ.map(
                                                                    src => {
                                                                        return (
                                                                            <div key={src}>
                                                                                <img
                                                                                    style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        display: 'block',
                                                                                        marginTop: '10px'
                                                                                    }}
                                                                                    onClick={this.handleImgView.bind(this, src)}
                                                                                    src={
                                                                                        src
                                                                                    }
                                                                                    alt='图片'
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                                : ''}
                                                        </div>) : ''}
                                                </div> : ''
                                        }
                                        {
                                            tabSelect === 'tree'
                                                ? <div style={{ width: 450 }}>
                                                    <div>
                                                        <span className='TreeMessPage-aside-Mess-title'>
                                                            顺序码:
                                                            <span className='TreeMessPage-aside-Mess-text'>
                                                                {treeMess.sxm ? treeMess.sxm : ''}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className='TreeMessPage-aside-Mess-title'>
                                                            地块:
                                                            <span className='TreeMessPage-aside-Mess-text'>
                                                                {treeMess.landName ? treeMess.landName : ''}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className='TreeMessPage-aside-Mess-title'>
                                                            标段:
                                                            <span className='TreeMessPage-aside-Mess-text'>
                                                                {treeMess.sectionName ? treeMess.sectionName : ''}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className='TreeMessPage-aside-Mess-title'>
                                                            小班:
                                                            <span className='TreeMessPage-aside-Mess-text'>
                                                                {treeMess.SmallClass ? treeMess.SmallClass : ''}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className='TreeMessPage-aside-Mess-title'>
                                                            细班:
                                                            <span className='TreeMessPage-aside-Mess-text'>
                                                                {treeMess.ThinClass ? treeMess.ThinClass : ''}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className='TreeMessPage-aside-Mess-title'>
                                                            树种:
                                                            <span className='TreeMessPage-aside-Mess-text'>
                                                                {treeMess.TreeTypeName ? treeMess.TreeTypeName : ''}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className='TreeMessPage-aside-Mess-title'>
                                                            位置:
                                                            <span className='TreeMessPage-aside-Mess-text'>
                                                                {treeMess.Location
                                                                    ? `${treeMess.LocationX},${
                                                                    treeMess.LocationY
                                                                    }`
                                                                    : (
                                                                        treeMess.locationCoord
                                                                            ? treeMess.locationCoord
                                                                            : ''
                                                                    )}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    {treeMess.GD ? (
                                                        <div>
                                                            <div>
                                                                <span className='TreeMessPage-aside-Mess-title'>
                                                                    高度(cm):
                                                                    <span className='TreeMessPage-aside-Mess-text'>
                                                                        {treeMess.GD}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            {treeMess.GDFJ
                                                                ? treeMess.GDFJ.map(
                                                                    src => {
                                                                        return (
                                                                            <div key={src}>
                                                                                <img
                                                                                    style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        display: 'block',
                                                                                        marginTop: '10px'
                                                                                    }}
                                                                                    onClick={this.handleImgView.bind(this, src)}
                                                                                    src={
                                                                                        src
                                                                                    }
                                                                                    alt='图片'
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                                : ''}
                                                        </div>) : ''}
                                                    {treeMess.GF ? (
                                                        <div>
                                                            <div>
                                                                <span className='TreeMessPage-aside-Mess-title'>
                                                                    冠幅(cm):
                                                                    <span className='TreeMessPage-aside-Mess-text'>
                                                                        {treeMess.GF}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            {treeMess.GFFJ
                                                                ? treeMess.GFFJ.map(
                                                                    src => {
                                                                        return (
                                                                            <div key={src}>
                                                                                <img
                                                                                    style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        display: 'block',
                                                                                        marginTop: '10px'
                                                                                    }}
                                                                                    onClick={this.handleImgView.bind(this, src)}
                                                                                    src={
                                                                                        src
                                                                                    }
                                                                                    alt='图片'
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                                : ''}
                                                        </div>) : ''}
                                                    {treeMess.XJ ? (
                                                        <div>
                                                            <div>
                                                                <span className='TreeMessPage-aside-Mess-title'>
                                                                    胸径(cm):
                                                                    <span className='TreeMessPage-aside-Mess-text'>
                                                                        {treeMess.XJ}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            {treeMess.XJFJ
                                                                ? treeMess.XJFJ.map(
                                                                    src => {
                                                                        return (
                                                                            <div key={src}>
                                                                                <img
                                                                                    style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        display: 'block',
                                                                                        marginTop: '10px'
                                                                                    }}
                                                                                    onClick={this.handleImgView.bind(this, src)}
                                                                                    src={
                                                                                        src
                                                                                    }
                                                                                    alt='图片'
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                                : ''}
                                                        </div>) : ''}
                                                    {treeMess.DJ ? (
                                                        <div>
                                                            <div>
                                                                <span className='TreeMessPage-aside-Mess-title'>
                                                                    地径(cm):
                                                                    <span className='TreeMessPage-aside-Mess-text'>
                                                                        {treeMess.DJ}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            {treeMess.DJFJ
                                                                ? treeMess.DJFJ.map(
                                                                    src => {
                                                                        return (
                                                                            <div key={src}>
                                                                                <img
                                                                                    style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        display: 'block',
                                                                                        marginTop: '10px'
                                                                                    }}
                                                                                    onClick={this.handleImgView.bind(this, src)}
                                                                                    src={
                                                                                        src
                                                                                    }
                                                                                    alt='图片'
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                                : ''}
                                                        </div>) : ''}
                                                    {treeMess.MD ? (
                                                        <div>
                                                            <div>
                                                                <span className='TreeMessPage-aside-Mess-title'>
                                                                    密度(棵/m^3):
                                                                    <span className='TreeMessPage-aside-Mess-text'>
                                                                        {treeMess.MD}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            {treeMess.MDFJ
                                                                ? treeMess.MDFJ.map(
                                                                    src => {
                                                                        return (
                                                                            <div key={src}>
                                                                                <img
                                                                                    style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        display: 'block',
                                                                                        marginTop: '10px'
                                                                                    }}
                                                                                    onClick={this.handleImgView.bind(this, src)}
                                                                                    src={
                                                                                        src
                                                                                    }
                                                                                    alt='图片'
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                                : ''}
                                                        </div>) : ''}
                                                    {treeMess.MJ ? (
                                                        <div>
                                                            <div>
                                                                <span className='TreeMessPage-aside-Mess-title'>
                                                                    面积(m^2):
                                                                    <span className='TreeMessPage-aside-Mess-text'>
                                                                        {treeMess.MJ}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            {treeMess.MJFJ
                                                                ? treeMess.MJFJ.map(
                                                                    src => {
                                                                        return (
                                                                            <div key={src}>
                                                                                <img
                                                                                    style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        display: 'block',
                                                                                        marginTop: '10px'
                                                                                    }}
                                                                                    onClick={this.handleImgView.bind(this, src)}
                                                                                    src={
                                                                                        src
                                                                                    }
                                                                                    alt='图片'
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                                : ''}
                                                        </div>) : ''}
                                                    {treeMess.TQHD ? (
                                                        <div>
                                                            <div>
                                                                <span className='TreeMessPage-aside-Mess-title'>
                                                                    土球厚度(cm):
                                                                    <span className='TreeMessPage-aside-Mess-text'>
                                                                        {treeMess.TQHD}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            {treeMess.TQHDFJ
                                                                ? treeMess.TQHDFJ.map(
                                                                    src => {
                                                                        return (
                                                                            <div key={src}>
                                                                                <img
                                                                                    style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        display: 'block',
                                                                                        marginTop: '10px'
                                                                                    }}
                                                                                    onClick={this.handleImgView.bind(this, src)}
                                                                                    src={
                                                                                        src
                                                                                    }
                                                                                    alt='图片'
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                                : ''}
                                                        </div>) : ''}
                                                    {treeMess.TQZJ ? (
                                                        <div>
                                                            <div>
                                                                <span className='TreeMessPage-aside-Mess-title'>
                                                                    土球直径(cm):
                                                                    <span className='TreeMessPage-aside-Mess-text'>
                                                                        {treeMess.TQZJ}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            {treeMess.TQZJFJ
                                                                ? treeMess.TQZJFJ.map(
                                                                    src => {
                                                                        return (
                                                                            <div key={src}>
                                                                                <img
                                                                                    style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        display: 'block',
                                                                                        marginTop: '10px'
                                                                                    }}
                                                                                    onClick={this.handleImgView.bind(this, src)}
                                                                                    src={
                                                                                        src
                                                                                    }
                                                                                    alt='图片'
                                                                                />
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                                : ''}
                                                        </div>) : ''}
                                                </div> : ''
                                        }
                                        {
                                            tabSelect === 'flow'
                                                ? <div style={{ width: 450 }}>
                                                    {flowMess.length > 0
                                                        ? flowMess.map(flow => {
                                                            let flowName = '';
                                                            if (flow.Status) {
                                                                if (flow.Status === -1) {
                                                                    flowName = '施工提交';
                                                                } else if (flow.Status === 0) {
                                                                    flowName = '监理大数据未通过';
                                                                } else if (flow.Status === 1) {
                                                                    flowName = '监理大数据合格';
                                                                } else if (flow.Status === 2) {
                                                                    flowName = '业主合格';
                                                                } else if (flow.Status === 3) {
                                                                    flowName = '业主不合格';
                                                                } else if (flow.Status === 4) {
                                                                    flowName = '施工结缘入库';
                                                                } else if (flow.Status === 5) {
                                                                    flowName = '监理质量不合格';
                                                                } else if (flow.Status === 6) {
                                                                    flowName = '监理质量合格';
                                                                } else if (flow.Status === 100) {
                                                                    flowName = '苗圃提交';
                                                                } else if (flow.Node === '补种') {
                                                                    flowName = '施工补录扫码';
                                                                }
                                                            }
                                                            return (
                                                                <div key={flow.ID}>
                                                                    <Row
                                                                        style={{
                                                                            marginTop: '10px'
                                                                        }}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                float: 'left'
                                                                            }}
                                                                            className='TreeMessPage-aside-Mess-title'
                                                                        >
                                                                            {`${flowName}:`}
                                                                        </div>
                                                                        <div
                                                                            style={{
                                                                                float: 'right'
                                                                            }}
                                                                            className='TreeMessPage-aside-Mess-flowtext'
                                                                        >
                                                                            {flow.CreateTime
                                                                                ? flow.CreateTime
                                                                                : ''}
                                                                        </div>
                                                                    </Row>
                                                                    <Row
                                                                        style={{
                                                                            marginTop: '10px'
                                                                        }}
                                                                    >
                                                                        <div
                                                                            className='TreeMessPage-aside-Mess-flowtext'
                                                                            style={{
                                                                                float: 'left'
                                                                            }}>
                                                                            {
                                                                                `${
                                                                                    flow.FromUserObj
                                                                                        ? flow
                                                                                            .FromUserObj
                                                                                            .Full_Name
                                                                                        : ''
                                                                                } : ${
                                                                                    flow.Info
                                                                                        ? flow.Info
                                                                                        : ''
                                                                                }`
                                                                            }
                                                                        </div>
                                                                        <div
                                                                            className='TreeMessPage-aside-Mess-flowtext'
                                                                            style={{
                                                                                float: 'right'
                                                                            }}>
                                                                            {`【${flow.companyName}】`}
                                                                        </div>
                                                                    </Row>
                                                                    <hr
                                                                        className='hrstyle'
                                                                        style={{
                                                                            marginTop: '10px'
                                                                        }}
                                                                    />
                                                                </div>
                                                            );
                                                        })
                                                        : ''}
                                                    <div>
                                                        <Row
                                                            style={{
                                                                marginTop: '10px'
                                                            }}
                                                        >
                                                            <h3
                                                                className='TreeMessPage-aside-Mess-title'
                                                                style={{ float: 'left' }}>
                                                                {'苗圃提交'}
                                                            </h3>
                                                            <div
                                                                className='TreeMessPage-aside-Mess-flowtext'
                                                                style={{
                                                                    float: 'right'
                                                                }}
                                                            >
                                                                {seedlingMess.CreateTime
                                                                    ? seedlingMess.CreateTime
                                                                    : ''}
                                                            </div>
                                                        </Row>
                                                        <Row
                                                            style={{
                                                                marginTop: '10px'
                                                            }}
                                                        >
                                                            <div
                                                                className='TreeMessPage-aside-Mess-flowtext'
                                                                style={{
                                                                    float: 'left'
                                                                }}>
                                                                {
                                                                    `${
                                                                        seedlingMess.InputerObj
                                                                            ? seedlingMess
                                                                                .InputerObj
                                                                                .Full_Name
                                                                            : ''
                                                                    } : `
                                                                }
                                                            </div>
                                                            <div
                                                                className='TreeMessPage-aside-Mess-flowtext'
                                                                style={{
                                                                    float: 'right'
                                                                }}>
                                                                {`【${seedlingMess.Factory
                                                                    ? seedlingMess.Factory
                                                                    : ''}】`}
                                                            </div>
                                                        </Row>
                                                    </div>
                                                </div> : ''
                                        }
                                        {
                                            tabSelect === 'conservation'
                                                ? <div style={{ width: 450 }}>
                                                    <div>
                                                        <span className='TreeMessPage-aside-Mess-title'>
                                                            顺序码:
                                                            <span className='TreeMessPage-aside-Mess-text'>
                                                                {treeMess.sxm ? treeMess.sxm : ''}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    {
                                                        curingMess.length > 0
                                                            ? curingMess.map((curing) => {
                                                                return (
                                                                    <div key={curing.ID}>
                                                                        <div>
                                                                            <span className='TreeMessPage-aside-Mess-title'>
                                                                                养护类型:
                                                                                <span className='TreeMessPage-aside-Mess-text'>
                                                                                    {curing.typeName}
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <span className='TreeMessPage-aside-Mess-title'>
                                                                                起止时间:
                                                                                <span className='TreeMessPage-aside-Mess-text'>
                                                                                    {`${curing.StartTime} ~ ${curing.EndTime}`}
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <span className='TreeMessPage-aside-Mess-title'>
                                                                                养护人员:
                                                                                <span className='TreeMessPage-aside-Mess-text'>
                                                                                    {curing.CuringMans}
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                        {curing.Pics && curing.Pics.length > 0
                                                                            ? curing.Pics.map(
                                                                                src => {
                                                                                    return (
                                                                                        <div key={src}>
                                                                                            <img
                                                                                                style={{
                                                                                                    width: '150px',
                                                                                                    height: '150px',
                                                                                                    display: 'block',
                                                                                                    marginTop: '10px'
                                                                                                }}
                                                                                                onClick={this.handleImgView.bind(this, src)}
                                                                                                src={
                                                                                                    src
                                                                                                }
                                                                                                alt='图片'
                                                                                            />
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                            )
                                                                            : ''}
                                                                        {/* 为每一个养护任务底部添加虚线作为分隔 */}
                                                                        <hr
                                                                            className='hrstyle'
                                                                            style={{
                                                                                marginTop: '10px'
                                                                            }}
                                                                        />
                                                                    </div>
                                                                );
                                                            }) : ''
                                                    }
                                                </div> : ''
                                        }
                                    </Spin>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
                <div className='TreeMessPage-Tab-Layout'>
                    <a id='nursery'
                        onClick={this.handleTabChange.bind(this)}
                        className={tabSelect === 'nursery'
                            ? 'TreeMessPage-Tab-tablabelSel'
                            : 'TreeMessPage-Tab-tablabel'}>
                        苗木信息
                    </a>
                    <a id='tree'
                        onClick={this.handleTabChange.bind(this)}
                        className={tabSelect === 'tree'
                            ? 'TreeMessPage-Tab-tablabelSel'
                            : 'TreeMessPage-Tab-tablabel'}>
                        树木信息
                    </a>
                    <a id='flow'
                        onClick={this.handleTabChange.bind(this)}
                        className={tabSelect === 'flow'
                            ? 'TreeMessPage-Tab-tablabelSel'
                            : 'TreeMessPage-Tab-tablabel'}>
                        审批流程
                    </a>
                    <a id='conservation'
                        onClick={this.handleTabChange.bind(this)}
                        className={tabSelect === 'conservation'
                            ? 'TreeMessPage-Tab-tablabelSel'
                            : 'TreeMessPage-Tab-tablabel'}>
                        养护任务
                    </a>
                </div>
                <Modal
                    title='图片详情'
                    visible={imgViewModalVisible}
                    footer={imgViewFooter}
                    width={495}
                    onOk={this.handleImgViewModalCancel.bind(this)}
                    onCancel={this.handleImgViewModalCancel.bind(this)}
                >
                    <img src={imgViewSrc} style={{ width: '450px', height: '650px' }} alt='图片' />
                </Modal>
                <Modal
                    title='树木详情'
                    visible={false}
                    footer={footer}
                    width={570}
                    onOk={this.handleTreeModalCancel.bind(this)}
                    onCancel={this.handleTreeModalCancel.bind(this)}
                >
                    <Spin spinning={treeMessModalLoading}>
                        <Tabs
                            defaultActiveKey='1'
                            onChange={this.tabChange.bind(this)}
                            size='large'
                        >
                            <TabPane tab='苗木信息' key='1'>
                                <Input
                                    readOnly
                                    style={{ marginTop: '10px' }}
                                    size='large'
                                    addonBefore='顺序码'
                                    value={
                                        seedlingMess.sxm
                                            ? seedlingMess.sxm
                                            : ''
                                    }
                                />
                                <Input
                                    readOnly
                                    style={{ marginTop: '10px' }}
                                    size='large'
                                    addonBefore='打包车牌'
                                    value={
                                        seedlingMess.car
                                            ? seedlingMess.car
                                            : ''
                                    }
                                />
                                <Input
                                    readOnly
                                    style={{ marginTop: '10px' }}
                                    size='large'
                                    addonBefore='树种'
                                    value={
                                        seedlingMess.TreeTypeName
                                            ? seedlingMess.TreeTypeName
                                            : ''
                                    }
                                />
                                <Input
                                    readOnly
                                    style={{ marginTop: '10px' }}
                                    size='large'
                                    addonBefore='产地'
                                    value={
                                        seedlingMess.TreePlace
                                            ? seedlingMess.TreePlace
                                            : ''
                                    }
                                />
                                <Input
                                    readOnly
                                    style={{ marginTop: '10px' }}
                                    size='large'
                                    addonBefore='供应商'
                                    value={
                                        seedlingMess.Factory
                                            ? seedlingMess.Factory
                                            : ''
                                    }
                                />
                                <Input
                                    readOnly
                                    style={{ marginTop: '10px' }}
                                    size='large'
                                    addonBefore='苗圃名称'
                                    value={
                                        seedlingMess.NurseryName
                                            ? seedlingMess.NurseryName
                                            : ''
                                    }
                                />
                                <Input
                                    readOnly
                                    style={{ marginTop: '10px' }}
                                    size='large'
                                    addonBefore='起苗时间'
                                    value={
                                        seedlingMess.LifterTime
                                            ? seedlingMess.LifterTime
                                            : ''
                                    }
                                />
                                <Input
                                    readOnly
                                    style={{ marginTop: '10px' }}
                                    size='large'
                                    addonBefore='起苗地点'
                                    value={
                                        seedlingMess.nurserysAddressName
                                            ? (seedlingMess.location
                                                ? `${seedlingMess.nurserysAddressName}(${seedlingMess.location})`
                                                : seedlingMess.nurserysAddressName)
                                            : (seedlingMess.location
                                                ? seedlingMess.location
                                                : '')
                                    }
                                />
                                {seedlingMess.GD ? (
                                    <div>
                                        <Input
                                            readOnly
                                            style={{
                                                marginTop: '10px'
                                            }}
                                            size='large'
                                            addonBefore='高度(cm)'
                                            value={seedlingMess.GD}
                                        />
                                        {seedlingMess.GDFJ
                                            ? seedlingMess.GDFJ.map(
                                                src => {
                                                    return (
                                                        <div key={src}>
                                                            <img
                                                                style={{
                                                                    width: '150px',
                                                                    height: '150px',
                                                                    display: 'block',
                                                                    marginTop: '10px'
                                                                }}
                                                                onClick={this.handleImgView.bind(this, src)}
                                                                src={
                                                                    src
                                                                }
                                                                alt='图片'
                                                            />
                                                        </div>
                                                    );
                                                }
                                            )
                                            : ''}
                                    </div>
                                ) : (
                                        ''
                                    )}
                                {seedlingMess.GF ? (
                                    <div>
                                        <Input
                                            readOnly
                                            style={{
                                                marginTop: '10px'
                                            }}
                                            size='large'
                                            addonBefore='冠幅(cm)'
                                            value={seedlingMess.GF}
                                        />
                                        {seedlingMess.GFFJ
                                            ? seedlingMess.GFFJ.map(
                                                src => {
                                                    return (
                                                        <div key={src}>
                                                            <img
                                                                style={{
                                                                    width: '150px',
                                                                    height: '150px',
                                                                    display: 'block',
                                                                    marginTop: '10px'
                                                                }}
                                                                src={
                                                                    src
                                                                }
                                                                alt='图片'
                                                            />
                                                        </div>
                                                    );
                                                }
                                            )
                                            : ''}
                                    </div>
                                ) : (
                                        ''
                                    )}
                                {seedlingMess.XJ ? (
                                    <div>
                                        <Input
                                            readOnly
                                            style={{
                                                marginTop: '10px'
                                            }}
                                            size='large'
                                            addonBefore='胸径(cm)'
                                            value={seedlingMess.XJ}
                                        />
                                        {seedlingMess.XJFJ
                                            ? seedlingMess.XJFJ.map(
                                                src => {
                                                    return (
                                                        <div key={src}>
                                                            <img
                                                                style={{
                                                                    width: '150px',
                                                                    height: '150px',
                                                                    display: 'block',
                                                                    marginTop: '10px'
                                                                }}
                                                                onClick={this.handleImgView.bind(this, src)}
                                                                src={
                                                                    src
                                                                }
                                                                alt='图片'
                                                            />
                                                        </div>
                                                    );
                                                }
                                            )
                                            : ''}
                                    </div>
                                ) : (
                                        ''
                                    )}
                                {seedlingMess.DJ ? (
                                    <div>
                                        <Input
                                            readOnly
                                            style={{
                                                marginTop: '10px'
                                            }}
                                            size='large'
                                            addonBefore='地径(cm)'
                                            value={seedlingMess.DJ}
                                        />
                                        {seedlingMess.DJFJ
                                            ? seedlingMess.DJFJ.map(
                                                src => {
                                                    return (
                                                        <div key={src}>
                                                            <img
                                                                style={{
                                                                    width: '150px',
                                                                    height: '150px',
                                                                    display: 'block',
                                                                    marginTop: '10px'
                                                                }}
                                                                onClick={this.handleImgView.bind(this, src)}
                                                                src={
                                                                    src
                                                                }
                                                                alt='图片'
                                                            />
                                                        </div>
                                                    );
                                                }
                                            )
                                            : ''}
                                    </div>
                                ) : (
                                        ''
                                    )}
                                {seedlingMess.TQHD ? (
                                    <div>
                                        <Input
                                            readOnly
                                            style={{
                                                marginTop: '10px'
                                            }}
                                            size='large'
                                            addonBefore='土球厚度(cm)'
                                            value={seedlingMess.TQHD}
                                        />
                                        {seedlingMess.TQHDFJ
                                            ? seedlingMess.TQHDFJ.map(
                                                src => {
                                                    return (
                                                        <div key={src}>
                                                            <img
                                                                style={{
                                                                    width: '150px',
                                                                    height: '150px',
                                                                    display: 'block',
                                                                    marginTop: '10px'
                                                                }}
                                                                onClick={this.handleImgView.bind(this, src)}
                                                                src={
                                                                    src
                                                                }
                                                                alt='图片'
                                                            />
                                                        </div>
                                                    );
                                                }
                                            )
                                            : ''}
                                    </div>
                                ) : (
                                        ''
                                    )}
                                {seedlingMess.TQZJ ? (
                                    <div>
                                        <Input
                                            readOnly
                                            style={{
                                                marginTop: '10px'
                                            }}
                                            size='large'
                                            addonBefore='土球直径(cm)'
                                            value={seedlingMess.TQZJ}
                                        />
                                        {seedlingMess.TQZJFJ
                                            ? seedlingMess.TQZJFJ.map(
                                                src => {
                                                    return (
                                                        <div key={src}>
                                                            <img
                                                                style={{
                                                                    width: '150px',
                                                                    height: '150px',
                                                                    display: 'block',
                                                                    marginTop: '10px'
                                                                }}
                                                                onClick={this.handleImgView.bind(this, src)}
                                                                src={
                                                                    src
                                                                }
                                                                alt='图片'
                                                            />
                                                        </div>
                                                    );
                                                }
                                            )
                                            : ''}
                                    </div>
                                ) : (
                                        ''
                                    )}
                            </TabPane>
                            <TabPane tab='树木信息' key='2'>
                                <Input
                                    readOnly
                                    style={{ marginTop: '10px' }}
                                    size='large'
                                    addonBefore='顺序码'
                                    value={
                                        treeMess.sxm ? treeMess.sxm : ''
                                    }
                                />
                                <Input
                                    readOnly
                                    style={{ marginTop: '10px' }}
                                    size='large'
                                    addonBefore='地块'
                                    value={
                                        treeMess.landName
                                            ? treeMess.landName
                                            : ''
                                    }
                                />
                                <Input
                                    readOnly
                                    style={{ marginTop: '10px' }}
                                    size='large'
                                    addonBefore='标段'
                                    value={
                                        treeMess.sectionName
                                            ? treeMess.sectionName
                                            : ''
                                    }
                                />
                                <Input
                                    readOnly
                                    style={{ marginTop: '10px' }}
                                    size='large'
                                    addonBefore='小班'
                                    value={
                                        treeMess.SmallClass
                                            ? treeMess.SmallClass
                                            : ''
                                    }
                                />
                                <Input
                                    readOnly
                                    style={{ marginTop: '10px' }}
                                    size='large'
                                    addonBefore='细班'
                                    value={
                                        treeMess.ThinClass
                                            ? treeMess.ThinClass
                                            : ''
                                    }
                                />
                                <Input
                                    readOnly
                                    style={{ marginTop: '10px' }}
                                    size='large'
                                    addonBefore='树种'
                                    value={
                                        treeMess.TreeTypeName
                                            ? treeMess.TreeTypeName
                                            : ''
                                    }
                                />
                                <Input
                                    readOnly
                                    style={{ marginTop: '10px' }}
                                    size='large'
                                    addonBefore='位置'
                                    value={
                                        // treeMess.queryTreeAddressName
                                        //     ? treeMess.queryTreeAddressName
                                        //     : (treeMess.Location
                                        //         ? `${treeMess.LocationX},${
                                        //             treeMess.LocationY
                                        //         }`
                                        //         : '')
                                        treeMess.Location
                                            ? `${treeMess.LocationX},${
                                            treeMess.LocationY
                                            }`
                                            : (
                                                treeMess.locationCoord
                                                    ? treeMess.locationCoord
                                                    : ''
                                            )
                                    }
                                />
                                {treeMess.GD ? (
                                    <div>
                                        <Input
                                            readOnly
                                            style={{
                                                marginTop: '10px'
                                            }}
                                            size='large'
                                            addonBefore='高度(cm)'
                                            value={treeMess.GD}
                                        />
                                        {treeMess.GDFJ
                                            ? treeMess.GDFJ.map(src => {
                                                return (
                                                    <div key={src}>
                                                        <img
                                                            style={{
                                                                width: '150px',
                                                                height: '150px',
                                                                display: 'block',
                                                                marginTop: '10px'
                                                            }}
                                                            onClick={this.handleImgView.bind(this, src)}
                                                            src={src}
                                                            alt='图片'
                                                        />
                                                    </div>
                                                );
                                            })
                                            : ''}
                                    </div>
                                ) : (
                                        ''
                                    )}
                                {treeMess.GF ? (
                                    <div>
                                        <Input
                                            readOnly
                                            style={{
                                                marginTop: '10px'
                                            }}
                                            size='large'
                                            addonBefore='冠幅(cm)'
                                            value={treeMess.GF}
                                        />
                                        {treeMess.GFFJ
                                            ? treeMess.GFFJ.map(src => {
                                                return (
                                                    <div key={src}>
                                                        <img
                                                            style={{
                                                                width: '150px',
                                                                height: '150px',
                                                                display: 'block',
                                                                marginTop: '10px'
                                                            }}
                                                            onClick={this.handleImgView.bind(this, src)}
                                                            src={src}
                                                            alt='图片'
                                                        />
                                                    </div>
                                                );
                                            })
                                            : ''}
                                    </div>
                                ) : (
                                        ''
                                    )}
                                {treeMess.XJ ? (
                                    <div>
                                        <Input
                                            readOnly
                                            style={{
                                                marginTop: '10px'
                                            }}
                                            size='large'
                                            addonBefore='胸径(cm)'
                                            value={treeMess.XJ}
                                        />
                                        {treeMess.XJFJ
                                            ? treeMess.XJFJ.map(src => {
                                                return (
                                                    <div key={src}>
                                                        <img
                                                            style={{
                                                                width: '150px',
                                                                height: '150px',
                                                                display: 'block',
                                                                marginTop: '10px'
                                                            }}
                                                            onClick={this.handleImgView.bind(this, src)}
                                                            src={src}
                                                            alt='图片'
                                                        />
                                                    </div>
                                                );
                                            })
                                            : ''}
                                    </div>
                                ) : (
                                        ''
                                    )}
                                {treeMess.DJ ? (
                                    <div>
                                        <Input
                                            readOnly
                                            style={{
                                                marginTop: '10px'
                                            }}
                                            size='large'
                                            addonBefore='地径(cm)'
                                            value={treeMess.DJ}
                                        />
                                        {treeMess.DJFJ
                                            ? treeMess.DJFJ.map(src => {
                                                return (
                                                    <div key={src}>
                                                        <img
                                                            style={{
                                                                width: '150px',
                                                                height: '150px',
                                                                display: 'block',
                                                                marginTop: '10px'
                                                            }}
                                                            onClick={this.handleImgView.bind(this, src)}
                                                            src={src}
                                                            alt='图片'
                                                        />
                                                    </div>
                                                );
                                            })
                                            : ''}
                                    </div>
                                ) : (
                                        ''
                                    )}
                                {treeMess.MD ? (
                                    <div>
                                        <Input
                                            readOnly
                                            style={{
                                                marginTop: '10px'
                                            }}
                                            size='large'
                                            addonBefore='密度(棵/m^3)'
                                            value={treeMess.MD}
                                        />
                                        {treeMess.MDFJ
                                            ? treeMess.MDFJ.map(src => {
                                                return (
                                                    <div key={src}>
                                                        <img
                                                            style={{
                                                                width: '150px',
                                                                height: '150px',
                                                                display: 'block',
                                                                marginTop: '10px'
                                                            }}
                                                            onClick={this.handleImgView.bind(this, src)}
                                                            src={src}
                                                            alt='图片'
                                                        />
                                                    </div>
                                                );
                                            })
                                            : ''}
                                    </div>
                                ) : (
                                        ''
                                    )}
                                {treeMess.MJ ? (
                                    <div>
                                        <Input
                                            readOnly
                                            style={{
                                                marginTop: '10px'
                                            }}
                                            size='large'
                                            addonBefore='面积(m^2)'
                                            value={treeMess.MJ}
                                        />
                                        {treeMess.MJFJ
                                            ? treeMess.MJFJ.map(src => {
                                                return (
                                                    <div key={src}>
                                                        <img
                                                            style={{
                                                                width: '150px',
                                                                height: '150px',
                                                                display: 'block',
                                                                marginTop: '10px'
                                                            }}
                                                            onClick={this.handleImgView.bind(this, src)}
                                                            src={src}
                                                            alt='图片'
                                                        />
                                                    </div>
                                                );
                                            })
                                            : ''}
                                    </div>
                                ) : (
                                        ''
                                    )}
                                {treeMess.TQHD ? (
                                    <div>
                                        <Input
                                            readOnly
                                            style={{
                                                marginTop: '10px'
                                            }}
                                            size='large'
                                            addonBefore='土球厚度(cm)'
                                            value={treeMess.TQHD}
                                        />
                                        {treeMess.TQHDFJ
                                            ? treeMess.TQHDFJ.map(
                                                src => {
                                                    return (
                                                        <div key={src}>
                                                            <img
                                                                style={{
                                                                    width: '150px',
                                                                    height: '150px',
                                                                    display: 'block',
                                                                    marginTop: '10px'
                                                                }}
                                                                onClick={this.handleImgView.bind(this, src)}
                                                                src={
                                                                    src
                                                                }
                                                                alt='图片'
                                                            />
                                                        </div>
                                                    );
                                                }
                                            )
                                            : ''}
                                    </div>
                                ) : (
                                        ''
                                    )}
                                {treeMess.TQZJ ? (
                                    <div>
                                        <Input
                                            readOnly
                                            style={{
                                                marginTop: '10px'
                                            }}
                                            size='large'
                                            addonBefore='土球直径(cm)'
                                            value={treeMess.TQZJ}
                                        />
                                        {treeMess.TQZJFJ
                                            ? treeMess.TQZJFJ.map(
                                                src => {
                                                    return (
                                                        <div key={src}>
                                                            <img
                                                                style={{
                                                                    width: '150px',
                                                                    height: '150px',
                                                                    display: 'block',
                                                                    marginTop: '10px'
                                                                }}
                                                                onClick={this.handleImgView.bind(this, src)}
                                                                src={
                                                                    src
                                                                }
                                                                alt='图片'
                                                            />
                                                        </div>
                                                    );
                                                }
                                            )
                                            : ''}
                                    </div>
                                ) : (
                                        ''
                                    )}
                            </TabPane>
                            <TabPane tab='审批流程' key='3'>
                                <div>
                                    {flowMess.length > 0
                                        ? flowMess.map(flow => {
                                            let flowName = '';
                                            if (flow.Status) {
                                                if (flow.Status === -1) {
                                                    flowName = '施工提交';
                                                } else if (flow.Status === 0) {
                                                    flowName = '监理大数据未通过';
                                                } else if (flow.Status === 1) {
                                                    flowName = '监理大数据合格';
                                                } else if (flow.Status === 2) {
                                                    flowName = '业主合格';
                                                } else if (flow.Status === 3) {
                                                    flowName = '业主不合格';
                                                } else if (flow.Status === 4) {
                                                    flowName = '施工结缘入库';
                                                } else if (flow.Status === 5) {
                                                    flowName = '监理质量不合格';
                                                } else if (flow.Status === 6) {
                                                    flowName = '监理质量合格';
                                                } else if (flow.Status === 100) {
                                                    flowName = '苗圃提交';
                                                } else if (flow.Node === '补种') {
                                                    flowName = '施工补录扫码';
                                                }
                                            }
                                            return (
                                                <div key={flow.ID}>
                                                    <Row
                                                        style={{
                                                            marginTop: '10px'
                                                        }}
                                                    >
                                                        <h3
                                                            style={{
                                                                float: 'left'
                                                            }}
                                                        >
                                                            {`${flowName}:`}
                                                        </h3>
                                                        <div
                                                            style={{
                                                                float: 'right'
                                                            }}
                                                        >
                                                            {flow.CreateTime
                                                                ? flow.CreateTime
                                                                : ''}
                                                        </div>
                                                    </Row>
                                                    <Row
                                                        style={{
                                                            marginTop: '10px'
                                                        }}
                                                    >
                                                        <div style={{
                                                            float: 'left'
                                                        }}>
                                                            {`${
                                                                flow.FromUserObj
                                                                    ? flow
                                                                        .FromUserObj
                                                                        .Full_Name
                                                                    : ''
                                                                } : ${
                                                                flow.Info
                                                                    ? flow.Info
                                                                    : ''
                                                                }`}
                                                        </div>
                                                        <div style={{
                                                            float: 'right'
                                                        }}>
                                                            {`【${flow.companyName}】`}
                                                        </div>
                                                    </Row>
                                                    <hr
                                                        className='hrstyle'
                                                        style={{
                                                            marginTop: '10px'
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })
                                        : ''}
                                    <div>
                                        <Row
                                            style={{
                                                marginTop: '10px'
                                            }}
                                        >
                                            <h3 style={{ float: 'left' }}>{'苗圃提交'}</h3>
                                            <div
                                                style={{
                                                    float: 'right'
                                                }}
                                            >
                                                {seedlingMess.CreateTime
                                                    ? seedlingMess.CreateTime
                                                    : ''}
                                            </div>
                                        </Row>
                                        <Row
                                            style={{
                                                marginTop: '10px'
                                            }}
                                        >
                                            {/* {`${
                                            seedlingMess.InputerObj
                                                ? seedlingMess
                                                    .InputerObj
                                                    .Full_Name
                                                : ''
                                        }:${
                                            seedlingMess.Factory
                                                ? seedlingMess.Factory
                                                : ''
                                        }`} */}
                                            <div style={{
                                                float: 'left'
                                            }}>
                                                {`${
                                                    seedlingMess.InputerObj
                                                        ? seedlingMess
                                                            .InputerObj
                                                            .Full_Name
                                                        : ''
                                                    } : `}
                                            </div>
                                            <div style={{
                                                float: 'right'
                                            }}>
                                                {`【${seedlingMess.Factory
                                                    ? seedlingMess.Factory
                                                    : ''}】`}
                                            </div>
                                        </Row>
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab='养护任务' key='4'>
                                {
                                    curingMess.length > 0
                                        ? curingMess.map((curing) => {
                                            return (
                                                <div key={curing.ID}>
                                                    <Input
                                                        readOnly
                                                        style={{
                                                            marginTop: '10px'
                                                        }}
                                                        size='large'
                                                        addonBefore='养护类型'
                                                        value={curing.typeName}
                                                    />
                                                    <Input
                                                        readOnly
                                                        style={{
                                                            marginTop: '10px'
                                                        }}
                                                        size='large'
                                                        addonBefore='起止时间'
                                                        value={`${curing.StartTime} ~ ${curing.EndTime}`}
                                                    />
                                                    <Input
                                                        readOnly
                                                        style={{
                                                            marginTop: '10px'
                                                        }}
                                                        size='large'
                                                        addonBefore='养护人员'
                                                        value={curing.CuringMans}
                                                        title={curing.CuringMans}
                                                    />
                                                    {curing.Pics && curing.Pics.length > 0
                                                        ? curing.Pics.map(
                                                            src => {
                                                                return (
                                                                    <div key={src}>
                                                                        <img
                                                                            style={{
                                                                                width: '150px',
                                                                                height: '150px',
                                                                                display: 'block',
                                                                                marginTop: '10px'
                                                                            }}
                                                                            onClick={this.handleImgView.bind(this, src)}
                                                                            src={
                                                                                src
                                                                            }
                                                                            alt='图片'
                                                                        />
                                                                    </div>
                                                                );
                                                            }
                                                        )
                                                        : ''}
                                                    {/* 为每一个养护任务底部添加虚线作为分隔 */}
                                                    <div style={{ marginTop: '10px', borderBottom: '1px dashed #8c8383' }} />
                                                </div>
                                            );
                                        }) : ''
                                }

                            </TabPane>
                        </Tabs>
                    </Spin>
                </Modal>
            </div>
        );
    }
}
export default Form.create()(TreeMessModal);
