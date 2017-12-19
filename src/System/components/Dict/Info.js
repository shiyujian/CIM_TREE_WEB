import React, {Component} from 'react';
import Card from '_platform/components/panels/Card';
import {Row,Col,Button} from 'antd';

export default class Info extends Component {
	componentDidMount() {
		const {actions: {getFields, getSystemFields, setFieldName,getDictValues,setDictLoading}} = this.props;
		getFields();
		getSystemFields()
		.then(rst => {
			try {
				setFieldName(rst.results[0].name)
				setDictLoading(true)
				getDictValues({},{dict_field:rst.results[0].name,per_page:100})
				.then(rst => {
					setDictLoading(false)
				})
			} catch(e){
				console.log(e)
			}
		});
	}
	render() {
		const {fields = [], systemFields = []} = this.props;
		const rst = this.sort(fields);
		return (
			<div style={{marginTop: 16}}>
				<Row>
					<Col span={3} offset={21}>
						<Button onClick={this.toggle.bind(this)} style={{marginRight: '1em'}} type="primary">新增字段</Button>
					</Col>
				</Row>
				<Card title="系统字段">
					{
						systemFields.map((field, index) => {
							return <span style={this.fieldstyle(field.name)} key={index} onClick={this.getdictvlue.bind(this,field.name)}>{field.name}</span>
						})
					}
				</Card>
				<Card title="普通字段">
					{
						rst.map((category, index) => {
							const {data = [], letter} = category;
							return (
								<div key={index} style={{borderBottom: '1px solid #e9e9e9', position: 'relative'}}>
									<div style={{marginRight: 80}}>
										{
											data.map((field = {}, i) => {
												return <span style={this.fieldstyle(field.name)} key={i} onClick={this.getdictvlue.bind(this,field.name)}>{field.name}</span>
											})
										}
									</div>
									<div style={{
										borderLeft: '1px solid #e9e9e9',
										lineHeight: '57px',
										position: 'absolute',
										right: 0,
										top: 0,
										width: 78,
										textAlign: 'center',
										color: '#c2ebff',
										fontSize: 20,
										fontWeight: 900
									}}>{letter}</div>
								</div>);
						})
					}
				</Card>
			</div>
		);
	}
	toggle(event) {
		const {actions: {changeAdditionField}} = this.props;
		changeAdditionField('visible', true);
	}
	fieldstyle(name){
		const {fieldname} = this.props
		if (fieldname != name){
			return {display: 'inline-block',
				height: 32,
				width: 120,
				margin: '12px 24px',
				backgroundColor: '#e9e9e9',
				textAlign: 'center',
				lineHeight: '32px',
				cursor: "pointer"
			}
		}
		else 
			return {
				display: 'inline-block',
				height: 32,
				width: 120,
				margin: '12px 24px',
				backgroundColor: '#D2F4FF',
				textAlign: 'center',
				lineHeight: '32px',
				cursor: "pointer"
			}

	}

	getdictvlue(name){
		const {actions:{getDictValues,setFieldName,setDictLoading }} = this.props;
		setFieldName(name)
		setDictLoading(true)
		getDictValues({},{dict_field:name,per_page:100})
		.then(rst => {
			setDictLoading(false)
		})
	}
	remove(name, event) {
		event.preventDefault();
		const {actions: {deleteField}} = this.props;
		deleteField({name});
	}

	sort(arr) {
		if (!String.prototype.localeCompare)
			return;
		const letters = "*0123456789ABCDEFGHJKLMNOPQRSTWXYZ".split('');
		const zh = "阿八嚓哒妸发旮哈讥咔垃呣拏噢妑七呥扨它穵夕丫帀".split('');
		const segs = [];
		let curr;
		const strChinese = /[\u4E00-\u9FA5\uF900-\uFA2D]/; //中文匹配正则
		const strLetter = /[_a-zA-Z]/; //字母匹配正则
		letters.forEach((letter, index) => {
			curr = {letter: letter, data: []};
			arr.forEach(record => {
				if (strChinese.test(record.name[0])) { // 中文
					if (strLetter.test(letter)
						&& (!zh[index - 11] || zh[index - 11].localeCompare(record.name[0], 'zh-CN') <= 0)
						&& record.name[0].localeCompare(zh[index - 10], 'zh-CN') === -1) {
						curr.data.push(record);
					}
				} else if (strLetter.test(record.name[0])) {
					if (strLetter.test(letter) && record.name[0].toUpperCase() === letter)
						curr.data.push(record);
				} else if (!isNaN(record.name[0])) {
					if (!isNaN(letter) && record.name[0] === letter)
						curr.data.push(record);
				} else {
					if (letter === '*') curr.data.push(record);
				}
			});
			if (curr.data.length) {
				curr.data.sort(function (a, b) {
					return a.name[0].localeCompare(b.name[0]);
				});
				segs.push(curr);
			}
		});
		return segs;
	}
}
