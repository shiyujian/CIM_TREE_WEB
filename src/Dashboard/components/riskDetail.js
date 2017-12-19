
import React ,{Component} from 'react';
import {Row,Col,Timeline,Carousel,Spin} from 'antd';
import {PDF_FILE_API} from '_platform/api';
import styles from './style.css';
const  reg = /^http:/g;

export default class RiskDetail extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
    }

    render(){
        const {risk} = this.props;
        return (<Row gutter={28}>
            <Col span={12}>
                <h3>整改前</h3>
                <div className={`mb`}>
                    {
                        risk.detail.properties.beforeImgs&&risk.detail.properties.beforeImgs.length ?
                            (<Carousel >
                                {
                                    risk.detail.properties.beforeImgs.map((img, index)=> {
                                        if(reg.test(img)){
                                            return <img src={`${img}`} key={index}/>
                                        }else {
                                            return <img src={`${PDF_FILE_API}${img}`} key={index}/>
                                        }
                                    })
                                }
                            </Carousel>) :
                            (<div className="noImg"></div>)
                    }
                </div>
                <h3>整改后</h3>
                <div className={`mb`}>
                    {
                        risk.detail.properties.afterImgs&&risk.detail.properties.afterImgs.length ?
                            (<Carousel >
                                {
                                    risk.detail.properties.afterImgs.map((img, index)=> {
                                        if(reg.test(img)){
                                            return <img src={`${img}`} key={index}/>
                                        } else {
                                            return <img src={`${PDF_FILE_API}${img}`} key={index}/>
                                        }
                                    })
                                }
                            </Carousel>) :
                            (<div className="noImg"></div>)
                    }
                </div>
            </Col>
            <Col span={12}>
                <div className={styles.mb}>
                    <h3>危险源信息</h3>
                    <p><span>危险源内容：</span>{risk.detail.properties.content}</p>
                    <p><span>风险级别：</span>{risk.detail.properties.level}</p>
                    <p><span>整改状态：</span>未整改</p>
                    <p><span>整改措施：</span>{risk.detail.properties.measure}</p>
                </div>

                <div className={`${styles.divLine} ${styles.mb}`}></div>
                <div className={styles.mb}>
                    <h3>处理过程</h3>
                    <Timeline>
                        {
                            risk.processHistory.length?
                            risk.processHistory.map((node,index)=>{
                                return (<Timeline.Item key={index}>{node}</Timeline.Item>)
                            }):
                            <div style={{textAlign: 'center'}}>
                                <Spin />
                           </div>
                        }
                    </Timeline>
                </div>
            </Col>

        </Row>)
    }
}
