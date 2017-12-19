import React, {Component} from 'react';
import {Select} from 'antd';
import SimpleTree from '_platform/components/panels/SimpleTree';
const Option = Select.Option;

export default class DocTree extends Component {

	static propTypes = {};

	render() {
		const {sidebar: {node, stage} = {}, dir = [], blueprintStages = []} = this.props;
		return (
			<div>
				<Select placeholder="图纸阶段" style={{width: 212, margin: 12}} value={stage} onChange={this.toggleStage.bind(this)}>
					{
						blueprintStages.map(
							(stage) => {
								return <Option key={stage.code} disabled={stage.disabled} value={stage.code}>{stage.name}</Option>;
							})
					}
				</Select>
				<SimpleTree onSelect={this.onSelect.bind(this)} selectedKey={node} dataSource={dir}/>
			</div>

		);
	}

	toggleStage(stage) {
		const {
			actions: {getDir, changeSidebarField},
		} = this.props;
		changeSidebarField('stage', stage);
		getDir({code: stage}).then(({children}) => {
			const [{code}] = children;
			this.onSelect([code]);
		});
	}

	onSelect([code]) {
		const {actions: {changeSidebarField, getDocuments}} = this.props;
		changeSidebarField('node', code);
		getDocuments({code})

	}

	componentDidMount() {
		const {actions: {getBlueprintstageMeta, changeSidebarField, getDir}} = this.props;
		getBlueprintstageMeta().then(({metalist = []}) => {
			// todo 暂时默认值为施工图阶段
			const {code} = metalist[metalist.length - 2];
			changeSidebarField('stage', code);
			this.toggleStage(code);
		});
	}
}
