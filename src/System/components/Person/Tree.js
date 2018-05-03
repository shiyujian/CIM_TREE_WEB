import React, {Component} from 'react';
import SimpleTree from '_platform/components/panels/SimpleTree';

export default class Tree extends Component {
	static propTypes = {};
	constructor(props) {
		super(props);
		this.state = {
			childList:[],
			listVisible:true
		}
	}

	render() {
		const {
			platform: {org: {children = []} = {}},
			sidebar: {node = {}} = {},
		} = this.props;
		const {
			childList,
			listVisible
		}=this.state
		const {code} = node || {};
		return (<SimpleTree dataSource={children} selectedKey={code} onSelect={this.select.bind(this)}/>);
	}

	componentDidMount() {
		const {actions: {getOrgTree, changeSidebarField, getUsers,getTreeModal}} = this.props;
		getOrgTree({}, {depth: 3}).then(rst => {
			if(rst && rst.children){
				this.getList(rst.children)
			}
			const {children: [first] = []} = rst || {};
			if (first) {
				changeSidebarField('node', first);
				const codes = Tree.collect(first);
				getUsers({}, {org_code: codes}).then((e) =>{
					getTreeModal(false)
				});
			}
		});
	}

	//将二维数组传入store中
	setListStore(){
		const{
			actions:{getListStore}
		}=this.props
		const{
			childList
		}=this.state
		getListStore(childList)
		this.setState({
			listVisible:false
		})

	}

	//获取项目下的所有节点的名字和code
	getChildrenArr(data = [],List=[]){
		return data.map((item) => {
			if (item.children && item.children.length) {
				List.push({
					code:item.code,
					name:item.name
				})
				
				return (
					this.getChildrenArr(item.children,List)
				);
			}else{
				List.push({
					code:item.code,
					name:item.name
				})
				
				return
			}
		});
	}
	//将项目分为二维数组，以项目的个数来划分
	getList(data = []){
		const {
			childList
		}=this.state
		return data.map((item,index)=>{
			childList[index] = new Array()
			if(item.children && item.children.length){
				childList[index].push({
					code:item.code,
					name:item.name
				})
				this.getChildrenArr(item.children,childList[index])
			}
		})
	}

	componentDidUpdate(){
		const {
			childList,
			listVisible
		}=this.state
		if(childList && childList.length>0 && listVisible){
			this.setListStore()
		}
	}

	select(s, node) {
		const user=JSON.parse(window.localStorage.getItem('QH_USER_DATA'));
		const {node: {props: {eventKey = ''} = {}} = {}} = node || {};
		const {
			platform: {org: {children = []} = {}},
			actions: {changeSidebarField, getUsers,getTreeModal,setUpdate,getTablePage,getTreeCode,getIsBtn,getUsersBlackListOK}
		} = this.props;
		const o = Tree.loop(children, eventKey);
		let ucode
		// if(user.account.org_code.length>17){
		// 	 ucode=user.account.org_code.substring(0,17);

		// }else{
		// 	 ucode=user.account.org_code.substring(0,9);
		// }

		const ucodes=user.account.org_code.split("_");
		if(ucodes.length>5){
			ucodes.pop()
			const codeu=ucodes.join()
			ucode=codeu.replace(/,/g,'_')
		}else{
			ucode=user.account.org_code.substring(0,9);
			// ucodes.pop()
			// const codeu=ucodes.join()
			// ucode=codeu.replace(/,/g,'_')
		}
		if(this.compare(user,ucode,o.code)){
			if(o.code){
				getTreeModal(true)
			}else{
				getTreeModal(false)
				
			}
			changeSidebarField('node', o);
			const codes = Tree.collect(o);
			getTreeCode(codes)
			getUsers({}, {org_code: codes,page:1}).then((e) =>{
				let pagination = {
					current: 1,
					total:e.count,
				};
				getTreeModal(false)
				setUpdate(true);
				getTablePage(pagination)
				// 控制是否通过角色条件分页
				getIsBtn(true)
			
			});
		}
	}
	//人员标段和组织机构标段比较器，如果满足条件返回true
	// compare(user,l1,s){
	// 	if(user.is_superuser){
	// 		return true;
	// 	}
	// 	if(l1==undefined||s==undefined){
	// 		return false
	// 	}
	// 	let l2=s.split(',')
	// 	for (let i = 0; i < l1.length; i++) {
	// 		const e1 = l1[i];
	// 		for (let j = 0; j < l2.length; j++) {
	// 			const e2 = l2[j];
	// 			if(e1==e2){
	// 				return true
	// 			}
	// 		}
	// 	}
	// 	return false;
	// }
	compare(user, l1, s) {		
		if(user.is_superuser){
			return true;
		}
		// console.log(11111111,l1,s)
		if (l1 == undefined || s == undefined) {
			return false
		}
		// let l2 = s.split(',')
		// for (let i = 0; i < l1.length; i++) {
		// 	const e1 = l1[i];
		// 	for (let j = 0; j < l2.length; j++) {
		// 		const e2 = l2[j];
		// 		if (e1 == e2) {
		// 			return true
		// 		}
		// 	}
		// }
		// if(l1>)
		if(s.startsWith(l1)){
				return true;	
		}

		return false;
	}
	static loop = (list, code) => {
		let rst = null;
		list.forEach((item = {}) => {
			const {code: value, children = []} = item;
			if (value === code) {
				rst = item;
			} else {
				const tmp = Tree.loop(children, code);
				if (tmp) {
					rst = tmp;
				}
			}
		});
		return rst;
	};

	static collect = (node = {}) => {
		const {children = [], code} = node;
		let rst = [];
		rst.push(code);
		// children.forEach(n => {
		// 	const codes = Tree.collect(n);
		// 	rst = rst.concat(codes);
		// });
		return rst;
	}
}
