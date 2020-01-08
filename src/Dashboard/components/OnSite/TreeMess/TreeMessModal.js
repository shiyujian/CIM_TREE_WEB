import React, { Component } from 'react';
import { Button, Modal, Form, Row, Input, Tabs, Spin, Carousel, Col } from 'antd';
import Scrollbar from 'smooth-scrollbar';
import './TreeMessModal.less';
import nextImg from './TreeMessImg/next2.png';
import previousImg from './TreeMessImg/previous2.png';
import closeViewImg from './TreeMessImg/icon_close2.png';
import closeImg from './TreeMessImg/close.png';

const TabPane = Tabs.TabPane;

class TreeMessModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            tabSelect: 'nursery',
            imgViewSrc: '',
            imgViewModalVisible: false,
            selectImg: '',
            selectImgIndex: ''
        };
    }

    componentDidMount = async () => {
        if (document.querySelector('#TreeMessAsideDom')) {
            let TreeMessAsideDom = Scrollbar.init(document.querySelector('#TreeMessAsideDom'));
            console.log('TreeMessAsideDom', TreeMessAsideDom);
        }
    };
    componentDidUpdate (prevProps, prevState) {
    }

    handleTreeModalCancel = async () => {
        await this.props.onCancel();
    }
    //  切换标签页
    tabChange (key) {
    }

    handleImgView = async (type, src) => {
        const {
            seedlingMess,
            treeMess,
            curingMess
        } = this.props;
        let imgList = [];
        for (let key in seedlingMess) {
            if (key.indexOf('FJ') !== -1) {
                if (seedlingMess[key]) {
                    seedlingMess[key].map((imgsrc) => {
                        imgList.push(imgsrc);
                    });
                }
            }
        }
        for (let key in treeMess) {
            if (key.indexOf('FJ') !== -1) {
                if (treeMess[key]) {
                    treeMess[key].map((imgsrc) => {
                        imgList.push(imgsrc);
                    });
                }
            }
        }
        curingMess.map((curing) => {
            if (curing.Pics && curing.Pics.length > 0) {
                curing.Pics.map(
                    src => {
                        imgList.push(src);
                    }
                );
            }
        });
        let selectImgIndex = 0;
        imgList.map((img, index) => {
            if (img === src) {
                selectImgIndex = index;
            }
        });
        this.setState({
            imgList,
            selectImg: src,
            imgViewModalVisible: true,
            selectImgIndex: selectImgIndex
        });
    }

    handleViewPrevImg = () => {
        const {
            imgList,
            selectImgIndex
        } = this.state;
        if (selectImgIndex > 0) {
            this.setState({
                selectImgIndex: selectImgIndex - 1,
                selectImg: imgList[selectImgIndex - 1]
            });
        } else {
            this.setState({
                selectImgIndex: imgList.length - 1,
                selectImg: imgList[imgList.length - 1]
            });
        }
    }

    handleViewNextImg = () => {
        const {
            imgList,
            selectImgIndex
        } = this.state;
        if (selectImgIndex === imgList.length - 1) {
            this.setState({
                selectImgIndex: 0,
                selectImg: imgList[0]
            });
        } else {
            this.setState({
                selectImgIndex: selectImgIndex + 1,
                selectImg: imgList[selectImgIndex + 1]
            });
        }
    }

    handleImgViewModalCancel () {
        this.setState({
            imgViewSrc: '',
            imgViewModalVisible: false,
            selectImgIndex: '',
            selectImg: ''
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

    render () {
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
            tabSelect,
            imgList = [],
            selectImg
        } = this.state;

        let arr = [
            <Button key='back' size='large' onClick={this.handleTreeModalCancel.bind(this)}>
                关闭
            </Button>
        ];
        let footer = arr;
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
                                                                                    onClick={this.handleImgView.bind(this, 'seedlingMess', src)}
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
                                                                                    onClick={this.handleImgView.bind(this, 'seedlingMess', src)}
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
                                                                                    onClick={this.handleImgView.bind(this, 'seedlingMess', src)}
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
                                                                                    onClick={this.handleImgView.bind(this, 'seedlingMess', src)}
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
                                                                                    onClick={this.handleImgView.bind(this, 'seedlingMess', src)}
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
                                                                                    onClick={this.handleImgView.bind(this, 'seedlingMess', src)}
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
                                                                                    onClick={this.handleImgView.bind(this, 'treeMess', src)}
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
                                                                                    onClick={this.handleImgView.bind(this, 'treeMess', src)}
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
                                                                                    onClick={this.handleImgView.bind(this, 'treeMess', src)}
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
                                                                                    onClick={this.handleImgView.bind(this, 'treeMess', src)}
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
                                                                                    onClick={this.handleImgView.bind(this, 'treeMess', src)}
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
                                                                                    onClick={this.handleImgView.bind(this, 'treeMess', src)}
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
                                                                                    onClick={this.handleImgView.bind(this, 'treeMess', src)}
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
                                                                                    onClick={this.handleImgView.bind(this, 'treeMess', src)}
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
                                                    {
                                                        curingMess.length > 0
                                                            ? <div>
                                                                <span className='TreeMessPage-aside-Mess-title'>
                                                                    顺序码:
                                                                    <span className='TreeMessPage-aside-Mess-text'>
                                                                        {treeMess.sxm ? treeMess.sxm : ''}
                                                                    </span>
                                                                </span>
                                                            </div> : ''
                                                    }
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
                                                                                                onClick={this.handleImgView.bind(this, 'curing', src)}
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
                        苗圃信息
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
                    title={null}
                    footer={null}
                    width={900}
                    closable={false}
                    wrapClassName={'Carousel'}
                    maskClosable={false}
                    visible={imgViewModalVisible}
                    onOk={this.handleImgViewModalCancel.bind(this)}
                    onCancel={this.handleImgViewModalCancel.bind(this)}
                >
                    <div>
                        <img src={closeViewImg}
                            onClick={this.handleImgViewModalCancel.bind(this)}
                            className='TreeMessPage-modal-closeImg' />
                        <Row className='TreeMessPage-modal-top-layout'>
                            <div style={{ paddingTop: 152 }}>
                                <img
                                    onClick={this.handleViewPrevImg.bind(this)}
                                    src={previousImg}
                                    style={{width: 96, height: 96}} />
                            </div>
                            <div className='TreeMessPage-modal-top-adopt' >
                                <div className='TreeMessPage-modal-top-time'>
                                    <img src={selectImg}
                                        style={{ width: 400, height: 400 }}
                                        alt='图片' />
                                </div>
                            </div>
                            <div style={{ paddingTop: 152 }}>
                                <img
                                    onClick={this.handleViewNextImg.bind(this)}
                                    src={nextImg}
                                    style={{width: 96, height: 96}} />
                            </div>
                        </Row>
                    </div>
                    {/* <Carousel autoplay>
                        {
                            imgList.map((img) => {
                                return (
                                    <div key={img}>
                                        <img src={img} style={{ width: 400, height: 400 }} alt='图片' />
                                    </div>
                                );
                            })
                        }
                    </Carousel> */}
                </Modal>
            </div>
        );
    }
}
export default Form.create()(TreeMessModal);
