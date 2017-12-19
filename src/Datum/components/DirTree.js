import React, {Component} from 'react';
import SimpleTree from '_platform/components/panels/SimpleTree';

export default class DatumDirTree extends Component {

	static propTypes = {};

	render() {
		const {
			tree: {list = [], current} = {}
		} = this.props;
		return (
			<SimpleTree dataSource={list}
			            selectedKey={current}
			            onSelect={this.onSelect.bind(this)}/>
		);
	}

	onSelect(value) {
		if (value.length === 0) {
			return;
		}
		const [code] = value;
		const {actions: {setCurrentNode, getDocuments, filterLoad, resetFilterField}} = this.props;
		resetFilterField();
		filterLoad(true);
		setCurrentNode(code);
		getDocuments({code})
			.then(() => {
				filterLoad(false);
			});
	}
}
