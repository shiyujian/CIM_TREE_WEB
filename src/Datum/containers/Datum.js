import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import reducer, {actions} from '../store/index';
import {actions as platformActions} from '_platform/store/global';
import {Main, Aside, Body, Sidebar, Content, DynamicTitle} from '_platform/components/layout';
import {Filter, Table,Addition,Updatemodal,DatumTree} from '../components/Datum'
import Preview from '_platform/components/layout/Preview';
import * as previewActions from '_platform/store/global/preview';
import moment from 'moment';
export const Datumcode = window.DeathCode.DATUM_DATUM;

@connect(
	state => {
		const {datum = {}, platform} = state || {};
		return {...datum, platform};
	},
	dispatch => ({
		actions: bindActionCreators({...actions, ...platformActions,...previewActions}, dispatch)
	})
)
export default class Datum extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isTreeSelected: false,
			loading:false
        }
    }

	render() {
        const {
            tree=[],
            Doc=[],
            keycode,
        } = this.props;
		return (
			<Body>
			<Main>
				<DynamicTitle title="制度标准" {...this.props}/>
				<Sidebar>
					<DatumTree treeData={tree}
								selectedKeys={keycode}
								onSelect={this.onSelect.bind(this)}
								{...this.state}/>
				</Sidebar>
				<Content>
					<Filter  {...this.props} {...this.state}/>
					<Table {...this.props}/>
				</Content>
				<Addition {...this.props}/>
			</Main>
			<Updatemodal {...this.props} doc_type = {this.doc_type}/>
			<Preview/>
			</Body>
		);
	}
	
    componentDidMount() {
		const {actions: {getTree}} = this.props;
		this.setState({loading:true});
        getTree({code:Datumcode}).then(({children}) => {
			this.setState({loading:false});
		});
		if(this.props.Doc){
			this.setState({isTreeSelected:true})
		}
    }

    onSelect(value = [],e) {
        const [code] = value;
		const {actions:{getdocument,setcurrentcode,setkeycode}} =this.props;
		setkeycode(code);
	    if(code === undefined){
		    return
		}
		this.doc_type = e.node.props.title;
		this.setState({isTreeSelected:e.selected})
        setcurrentcode({code:code.split("--")[1]});
        getdocument({code:code.split("--")[1]});
    }
}
