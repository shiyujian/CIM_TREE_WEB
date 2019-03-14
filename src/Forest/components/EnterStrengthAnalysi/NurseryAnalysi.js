import React, {Component} from 'react';
import { Card, Row, Col } from 'antd';
import moment from 'moment';
import XLSX from 'xlsx'
import DataShow from './DataShow'
export default class NurseryAnalysi extends Component {
    constructor (props) {
        super(props);
        this.state = {
            queryTime: 0,
        };
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            leftkeycode
        } = this.props;
        if (leftkeycode && leftkeycode !== prevProps.leftkeycode) {
            await this.query()
        }
    }
    componentDidMount = async () => {
    }

    query = () => {
        this.setState({
            queryTime: moment().unix()
        })
    }

    render () {
        const {
            NewUser,
            ActiveUser,
            SessionCount
        } = this.state;
        return (
            <div>
                <DataShow 
                    {...this.state}
                    {...this.props}/>
                hh
            </div>
        );
    }
}
