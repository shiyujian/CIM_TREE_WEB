import React, {Component} from 'react';
import {Modal, Table, Checkbox,Spin, Input} from 'antd';

export default class Member extends Component {
	constructor(props){
		super(props);
		this.state={
			loading:false,
			orgSet:null
		}
	}
	render() {
		const Search = Input.Search;
		const {
			member: {members = [], visible, role = {}} = {}
		} = this.props;
		const title = `关联用户 | ${role ? role.name : ''}`;

		let { platform: { users = [] } = {} } = this.props;
		let { inpValue='' } = this.state;
		let users2 = users.map(ele=>{
			return {...ele};
		});
		if (inpValue) {
			users2 = users2.filter(v => {
				if (v.person_name.indexOf(inpValue) > -1) {
					return true;
				} else {
					return false;
				}
			})
		}
		this.state.orgSet && users2.forEach(ele=>{
			if(this.state.orgSet[ele.person_id]){
				ele.organization = this.state.orgSet[ele.person_id];
			}
		});
		return (
			<Modal title={title} visible={visible} width="90%"
			       onOk={this.ok.bind(this)} onCancel={this.cancel.bind(this)}>
					<Spin spinning = {this.state.loading}>
					<Search
						placeholder="请输入搜索的名称"
						style={{
							width: "200px",
							margin:"0 0 20px 5px"
						}}
						onSearch={value => {
							this.searchByName.bind(this, value)()
						}
						}
					/>
						<Table rowKey="id" columns={this.columns} dataSource={users2}/>
					</Spin>
			</Modal>
		);
	}
	searchByName(value){
		this.setState({inpValue:value})
	}
	ok() {
		const {
			actions: {changeMemberField, putMembers},
			member: {members = [], role = {}} = {}
		} = this.props;
		changeMemberField('visible', false);
		changeMemberField('members', undefined);
		console.log("members",members);
		putMembers({id: role.id}, {members})
	}

	cancel() {
		const {
			actions: {changeMemberField}
		} = this.props;
		changeMemberField('visible', false);
		changeMemberField('members', undefined);
	}
	componentDidMount() {
		const {
			member: {role: {id} = {}} = {},
			actions: {getMembers, getUsers,getOrgInfo},
			platform: { users = [] } = {}
		} = this.props;
		this.setState({ loading: true });
		id && getMembers({ id });
		getUsers().then(rst1 => {
			let promises = rst1.map((item, index) => {
				return getOrgInfo({ code: item.account.org_code })
			});
			let users2 = rst1.map(ele => {
				return { ...ele, ...ele.account };
			});
			Promise.all(promises).then(rst => {

				let set = new Object();
				if (rst && rst.length > 0) {
					users2.map((item, index) => {
						// console.log(item);
						if (typeof rst[index] !== "string") {
							set[item.person_id] = rst[index].parent ? rst[index].parent.name + "---" + item.organization : item.organization;
						} else {
							set[item.person_id] = item.organization;
						}
					})
				}
				this.setState({ orgSet: set, loading: false });
			})
		});

	}
	componentWillUnmount(){
		this.setState({orgSet:null});
	}
	columns = [{
		title: '序号',
		dataIndex: 'index',
	}, {
		title: '名称',
		dataIndex: 'person_name',
	}, {
		title: '所属部门',
		dataIndex: 'organization',
	}, {
		title: '职务',
		dataIndex: 'job',
	}, {
		title: '手机号码',
		dataIndex: 'person_telephone',
	}, {
		title: '管理权限',
		render: (user) => {
			const {member = {}} = this.props;
			const members = member.members || [];
			const checked = members.some(member => member === user.id);
			return <Checkbox checked={checked} onChange={this.check.bind(this, user)}/>
		},
	}];
	// user是关联用户里面的其中一行记录

	check(user) {
		const {actions: {changeMemberField}, member: {members = []}} = this.props;
		const has = members.some(member => member === user.id);
		let rst = [];
		if (has) {
			rst = members.filter(member => member !== user.id)
		} else {
			rst = [...members, user.id]
		}
		changeMemberField('members', rst);
	}
}
