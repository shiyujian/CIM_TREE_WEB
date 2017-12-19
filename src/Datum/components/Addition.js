import React, {Component} from 'react';
import {FILE_API} from '_platform/api';
import {
	Form, Input, Select, Button, Row, Col, Modal, Upload,
	Cascader, Icon, message, Table,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const Dragger = Upload.Dragger;

export default class Addition extends Component {

	static propTypes = {};

	static layout = {
		labelCol: {span: 8},
		wrapperCol: {span: 16}
	};

	render() {
		const {
			addition = {},
			workPackageAdd: {
				projectTreeAdd = [],
				unitWorkPackagesAdd = [],
				subunitWorkPackagesAdd = [],
				sectionWorkPackagesAdd = [],
				subSectionWorkPackagesAdd = [],
				itemWorkPackagesAdd = []
			} = {},
			majors = [],
			stages = [],
			docTypes = [],
			docs = [],
			additionVisible = false,
			actions: {changeAdditionField} = {}
		} = this.props;
		return (
			<Modal title="新增资料"
			       width={920} visible={additionVisible}
			       onOk={this.save.bind(this)}
			       onCancel={this.cancel.bind(this)}>
				<Form>
					<Row gutter={24}>
						<Col span={8}>
							<FormItem {...Addition.layout}
							          label="建设项目">
								<Cascader placeholder="请选择建设项目"
								          displayRender={Addition.displayRender}
								          options={projectTreeAdd}
								          value={addition.project}
								          expandTrigger="hover"
								          onChange={this.changeProject.bind(
									          this)} changeOnSelect/>
							</FormItem>
						</Col>
						<Col span={8}>
							<FormItem {...Addition.layout}
							          label="单位工程">
								<Select placeholder="单位工程"
								        value={addition.unit} allowClear
								        options={unitWorkPackagesAdd}
								        onChange={this.changeUnitWorkPackage.bind(
									        this)}>
									{
										unitWorkPackagesAdd.map(pkg => {
											return <Option key={pkg.code}
											               value={pkg.code}>{pkg.name}</Option>;
										})
									}

								</Select>
							</FormItem>
						</Col>
						<Col span={8}>
							<FormItem {...Addition.layout}
							          label="子单位工程">
								<Select placeholder="请输入子单位工程"
								        value={addition.subunit} allowClear
								        onChange={this.changeSubunitWorkPackage.bind(
									        this)}>
									{
										subunitWorkPackagesAdd.map(pkg => {
											return <Option key={pkg.code}
											               value={pkg.code}>{pkg.name}</Option>;
										})
									}
								</Select>
							</FormItem>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={8}>
							<FormItem {...Addition.layout}
							          label="分部工程">
								<Select placeholder="分部工程"
								        value={addition.section} allowClear
								        onChange={this.changeSectionWorkPackage.bind(
									        this)}>
									{
										sectionWorkPackagesAdd.map(pkg => {
											return <Option key={pkg.code}
											               value={pkg.code}>{pkg.name}</Option>;
										})
									}
								</Select>
							</FormItem>
						</Col>
						<Col span={8}>
							<FormItem {...Addition.layout}
							          label="子分部工程">
								<Select placeholder="子分部工程"
								        value={addition.subSection} allowClear
								        onChange={this.changeSubSectionWorkPackage.bind(
									        this)}>
									{
										subSectionWorkPackagesAdd.map(pkg => {
											return <Option key={pkg.code}
											               value={pkg.code}>{pkg.name}</Option>;
										})
									}
								</Select>
							</FormItem>
						</Col>
						<Col span={8}>
							<FormItem {...Addition.layout}
							          label="分项工程">
								<Select placeholder="分项工程"
								        value={addition.item} allowClear
								        onChange={this.changeItemWorkPackage.bind(
									        this)}>
									{
										itemWorkPackagesAdd.map(pkg => {
											return <Option key={pkg.code}
											               value={pkg.code}>{pkg.name}</Option>;
										})
									}
								</Select>
							</FormItem>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={8}>
							<FormItem {...Addition.layout}
							          label="文档类型">
								<Select placeholder="文档类型"
								        value={addition.docType} allowClear
								        onChange={changeAdditionField.bind(this,
									        'docType')}>
									{
										docTypes.map((type, index) => {
											return <Option key={index}
											               value={type}>{type}</Option>;
										})
									}
								</Select>
							</FormItem>
						</Col>
						<Col span={8}>
							<FormItem {...Addition.layout}
							          label="工程阶段">
								<Select placeholder={'工程阶段'}
								        value={addition.stage} allowClear
								        onChange={changeAdditionField.bind(this,
									        'stage')}>
									{
										stages.map((stage, index) => {
											return <Option key={index}
											               value={stage}>{stage}</Option>;
										})
									}

								</Select>
							</FormItem>
						</Col>
						<Col span={8}>
							<FormItem {...Addition.layout}
							          label="专业">
								<Select placeholder="专业"
								        value={addition.major} allowClear
								        onChange={changeAdditionField.bind(this,
									        'major')}>
									{
										majors.map((major, index) => {
											return <Option key={index}
											               value={major}>{major}</Option>;
										})
									}
								</Select>
							</FormItem>
						</Col>
					</Row>
					<Row gutter={24}>
						<Col span={24} style={{marginTop: 16, height: 160}}>
							<Dragger {...this.uploadProps}
								// accept={fileTypes}
								     onChange={this.changeDoc.bind(this)}>
								<p className="ant-upload-drag-icon">
									<Icon type="inbox"/>
								</p>
								<p className="ant-upload-text">点击或者拖拽开始上传</p>
								<p className="ant-upload-hint">
									支持 pdf、doc、docx 文件

								</p>
							</Dragger>
						</Col>
					</Row>
					<Row gutter={24} style={{marginTop: 16}}>
						<Col span={24}>
							<Table columns={this.docCols}
							       dataSource={docs}
							       bordered rowKey="uid"/>
						</Col>
					</Row>
				</Form>
			</Modal>
		);
	}

	//TODO 选择需要更新数据和下级的数据
	changeProject(keys) {
		const {
			actions: {changeAdditionField, getWorkPackagesAdd, setUnitWorkPackagesAdd, setSubunitWorkPackagesAdd, setSectionWorkPackagesAdd, setSubSectionWorkPackagesAdd, setItemWorkPackagesAdd}
		} = this.props;

		//如果选择的父级，不更新单位工程,选择子级才更新
		//判断是否使用的是ant的clear清除数据的
		if (keys.length >= 1) {
			const key = keys[keys.length - 1];
			changeAdditionField('project', keys);
			getWorkPackagesAdd({code: key}).then(({workpackages}) => {
				setUnitWorkPackagesAdd(workpackages);
			});
		} else {
			changeAdditionField('unit', undefined);
			setUnitWorkPackagesAdd([]);

			changeAdditionField('subunit', undefined);
			setSubunitWorkPackagesAdd([]);

			changeAdditionField('section', undefined);
			setSectionWorkPackagesAdd([]);

			changeAdditionField('subSection', undefined);
			setSubSectionWorkPackagesAdd([]);

			changeAdditionField('item', undefined);
			setItemWorkPackagesAdd([]);
		}
	}

	changeUnitWorkPackage(key) {
		const {
			actions: {changeAdditionField, getChildrenWorkPackagesAdd, setSubunitWorkPackagesAdd, setSectionWorkPackagesAdd, setSubSectionWorkPackagesAdd, setItemWorkPackagesAdd}
		} = this.props;

		changeAdditionField('unit', key);

		if (key !== undefined) {
			getChildrenWorkPackagesAdd({code: key}).then(({children_wp}) => {
				setSubunitWorkPackagesAdd(children_wp);
			});
		} else {
			setSubunitWorkPackagesAdd([]);
		}
		changeAdditionField('subunit', undefined);

		changeAdditionField('section', undefined);
		setSectionWorkPackagesAdd([]);

		changeAdditionField('subSection', undefined);
		setSubSectionWorkPackagesAdd([]);

		changeAdditionField('item', undefined);
		setItemWorkPackagesAdd([]);
	}

	changeSubunitWorkPackage(key) {
		const {
			actions: {changeAdditionField, getChildrenWorkPackagesAdd, setSectionWorkPackagesAdd, setSubSectionWorkPackagesAdd, setItemWorkPackagesAdd}
		} = this.props;


		changeAdditionField('subunit', key);
		if (key !== undefined) {
			getChildrenWorkPackagesAdd({code: key}).then(({children_wp}) => {
				setSectionWorkPackagesAdd(children_wp);
			});
		} else {
			setSectionWorkPackagesAdd([]);
		}
		changeAdditionField('section', undefined);
		changeAdditionField('subSection', undefined);
		setSubSectionWorkPackagesAdd([]);

		changeAdditionField('item', undefined);
		setItemWorkPackagesAdd([]);
	}

	changeSectionWorkPackage(key) {
		const {
			actions: {changeAdditionField, getChildrenWorkPackagesAdd, setSubSectionWorkPackagesAdd, setItemWorkPackagesAdd}
		} = this.props;
		changeAdditionField('section', key);

		if (key !== undefined) {
			getChildrenWorkPackagesAdd({code: key}).then(({children_wp}) => {
				setSubSectionWorkPackagesAdd(children_wp);
			});
		} else {
			setSubSectionWorkPackagesAdd([]);
		}
		changeAdditionField('subSection', undefined);
		changeAdditionField('item', undefined);
		setItemWorkPackagesAdd([]);
	}

	changeSubSectionWorkPackage(key) {
		const {
			actions: {changeAdditionField, getChildrenWorkPackagesAdd, setItemWorkPackagesAdd}
		} = this.props;
		changeAdditionField('subSection', key);

		if (key !== undefined) {
			getChildrenWorkPackagesAdd({code: key}).then(({children_wp}) => {
				setItemWorkPackagesAdd(children_wp);
			});
		} else {
			setItemWorkPackagesAdd([]);
		}
		changeAdditionField('item', undefined);
	}

	changeItemWorkPackage(key) {
		const {
			actions: {changeAdditionField}
		} = this.props;
		changeAdditionField('item', key);
	}

	changeDoc({file, fileList}) {
		const {
			docs = [],
			actions: {changeDocs}
		} = this.props;
		if (file.status === 'done') {
			changeDocs([...docs, file]);
		}
		// console.log(file);
	}

	uploadProps = {
		name: 'file',
		action: `${FILE_API}/api/user/files/`,
		headers: {
			authorization: 'authorization-text'
		},
		showUploadList: false,
		data(file) {
			return {
				name: file.fileName,
				a_file: file
			};
		},
		beforeUpload(file) {
			// todo
			// const valid = fileTypes.indexOf(file.type) >= 0;
			const valid = true;
			if (!valid) {
				message.error('只能上传 pdf、doc、docx 文件！');
			}
			return valid;
		}
	};

	save() {
		const {
			tree: {current} = {},
			addition = {}, docs = [],
			actions: {toggleAddition, postDocument, getDocuments, resetAdditionField, filterLoad, changeDocs},
			workPackageAdd: {
				projectTreeAdd = [],
				unitWorkPackagesAdd = [],
			} = {}
		} = this.props;
		let nameUnit, nameProject;
		unitWorkPackagesAdd.map(pkg => {
			if (pkg.code === addition.unit) {
				nameUnit = pkg.name
			}
		});
		const loop = (data) => {
			data.map((project) => {
				if (project.value === addition.project[addition.project.length - 1]) {
					nameProject = project.label;
				} else {
					loop(project.children)
				}
			})
		};
		loop(projectTreeAdd);
		let searchProject = addition.project[addition.project.length - 1];
		const promises = docs.map(doc => {
			const response = doc.response;
			// let files=DeleteIpPort(doc);
			let files = doc;
			return postDocument({}, {
				code: `${current}_${response.id}`,
				name: doc.name,
				obj_type: 'C_DOC',
				profess_folder: {
					code: current, obj_type: 'C_DIR'
				},
				basic_params: {
					files: [files]
				},
				extra_params: {
					remark: doc.remark,
					type: doc.type,
					time: doc.lastModifiedDate,
					searchProject: searchProject,
					nameProject: nameProject,
					nameUnit: nameUnit,
					...addition
				}
			});

		});
		message.warning('新增文件中...');
		Promise.all(promises).then(rst => {
			message.success('新增文件成功！');
			changeDocs([]);
			filterLoad(true);
			toggleAddition(false);
			resetAdditionField();
			getDocuments({code: current})
				.then(() => {
					filterLoad(false);
				});
		});

	}

	cancel() {
		const {
			actions: {toggleAddition, resetAdditionField, changeDocs}
		} = this.props;
		toggleAddition(false);
		resetAdditionField();
		changeDocs([]);
	}

	static displayRender(label) {
		return label[label.length - 1];
	}

	docCols = [
		{
			title: '名称',
			dataIndex: 'name'
		}, {
			title: '备注',
			render: (doc) => {
				return <Input onChange={this.remark.bind(this, doc)}/>;
			}
		}, {
			title: '操作',
			render: doc => {
				return (
					<a onClick={this.remove.bind(this, doc)}>删除</a>
				);
			}
		}];

	remark(doc, event) {
		const {
			docs = [],
			actions: {changeDocs}
		} = this.props;
		doc.remark = event.target.value;
		changeDocs(docs);
	}

	remove(doc) {
		const {
			docs = [],
			actions: {changeDocs}
		} = this.props;
		changeDocs(docs.filter(d => d !== doc));
	}
}
