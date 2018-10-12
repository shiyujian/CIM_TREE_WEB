
import React, {Component} from 'react';
import { FOREST_API } from '_platform/api';
import { Form, Card } from 'antd';

class Menu extends Component {
    constructor (props) {
        super(props);
        this.state = {
            a: 1,
            param: '',

        };
    }
    componentDidMount () {
        const { record } = this.props;
        if (record && record.TreeTypeNo) {
            let str = record.TreeTypeNo.slice(0, 1);
            if (str === 5) {
                this.setState({
                    param: '自然高',
                    minParam: record.MinHeight,
                    maxParam: record.MaxHeight
                });
            } else if (str === 4) {
                this.setState({
                    param: '地径',
                    minParam: record.MinGroundDiameter,
                    maxParam: record.MaxGroundDiameter
                });
            } else {
                this.setState({
                    param: '胸径',
                    minParam: record.MinDBH,
                    maxParam: record.MaxDBH
                });
            }
        }
        if (record && record.NurseryBase) {
            let NurseryName = record.NurseryBase.NurseryName;
            let TreePlace = record.NurseryBase.TreePlace;
            this.setState({
                NurseryName,
                TreePlace
            });
        }
    }
    render () {
        const { param, minParam, maxParam, NurseryName, TreePlace } = this.state;
        const { record } = this.props;
        let UpdateTime = '';
        if (record) {
            UpdateTime = record.UpdateTime.split(' ')[0];
        }
        console.log(this.props.record.TreeTypeName);
        return (
            <div className='menu'>
                <Card bodyStyle={{ padding: 0 }} bordered={false}>
                    <div>
                        <img src={FOREST_API + '/' + record.Photo} alt='图片找不到了' width='100%' height='150' />
                    </div>
                    <div style={{padding: '0 10px', height: 120}}>
                        <h3>
                            {record.TreeTypeName}（{record.SKU}株）
                            <span style={{float: 'right', fontSize: 12, color: '#888'}}>{UpdateTime}</span>
                        </h3>
                        <p>{param}：{minParam}-{maxParam}厘米</p>
                        <p>{NurseryName}</p>
                        <p>
                            价格：<span style={{color: '#ff5b05', fontWeight: 'bold'}}>{record.MinPrice}-{record.MaxPrice}元</span>
                            <span style={{float: 'right'}}>{TreePlace}</span>
                        </p>
                    </div>
                </Card>
            </div>
        );
    }
}

export default Form.create()(Menu);
