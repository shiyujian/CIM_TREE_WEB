import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select} from 'antd';
import * as actions from '../store';
import {PkCodeTree} from '../components';
import {PROJECT_UNITS} from '_platform/api';
import {NursOverallTable} from '../components/Nursoverallinfo';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {getUser} from '_platform/auth'
const Option = Select.Option;
@connect(
	state => {
		const {forest,platform} = state;
		return {...forest,platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions}, dispatch),
	}),
)
export default class Nursoverallinfo extends Component {
    biaoduan = [];
    currentSection = '';
	constructor(props) {
        super(props)
        this.state = {
            resetkey: 0,
        }
    }

    componentDidMount() {
    
    }

	render() {
  		const {
            resetkey,
        } = this.state;
        return (
				<Body>
					<Main>
						<DynamicTitle title="苗木综合信息" {...this.props}/>
						<Content>
							<NursOverallTable 
                             key={resetkey} 
                             {...this.props} 
                             resetinput={this.resetinput.bind(this)}
                            />
						</Content>
					</Main>
				</Body>);
	}


    //重置
    resetinput() {
        this.setState({
            resetkey:++this.state.resetkey
        })
    }

}