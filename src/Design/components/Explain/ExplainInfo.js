import React, {Component} from 'react';
import {Sidebar, Content} from '_platform/components/layout';
import ProjectUnitWrapper from '../../components/ProjectUnitWrapper';

export default class SubmitPanel extends Component {

	selectProject(project, unitProject, isAuto) {
		console.log('# project : ',project,'\n# unitP : ',unitProject,'\n# isAuto : ',isAuto );
	}

	render() {
		return (
			<div>
				<Sidebar>
					<div className="project-tree">
						<ProjectUnitWrapper {...this.props} onSelect={this.selectProject}></ProjectUnitWrapper>
					</div>
				</Sidebar>

				<Content></Content>
			</div>
		);
	}
}