import React, {Component} from 'react';
import {Sidebar, Content} from '_platform/components/layout';
import ProjectUnitWrapper from '../../components/ProjectUnitWrapper';
import ExplainList from './ExplainList';
import QueryCard from './QueryCard';
import TipsRender from './TipsRender';


export default class QueryPanel extends Component {

	constructor(props) {
		super(props);
	}		
	componentDidMount(){

	}

	selectProject(project, unitProject, isAuto) {
		
		const {setSelectedUnitProject
		} = this.props.actions;
		setSelectedUnitProject({project,unitProject});
		console.log('# project : ',project,'\n# unitP : ',unitProject,'\n# isAuto : ',isAuto );
	}

	render() {
		const {
			selectedUnitProject:{
				unitProject = {},
			} = {}
		} = this.props;

		console.log('p',this.props);

		return (
			<div>
				<Sidebar>
					<div className="project-tree">
						<ProjectUnitWrapper {...this.props} onSelect={this.selectProject.bind(this)}></ProjectUnitWrapper>
					</div>
				</Sidebar>

				<Content>
				{unitProject&&(Object.keys(unitProject).length>0)?
					<div>
					<QueryCard {...this.props}/>
                    <ExplainList {...this.props}/>
					</div>:<TipsRender container='请选择单位工程'/>
				}
                </Content>
			</div>
		);
	}
}