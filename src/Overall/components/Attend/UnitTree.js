import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tree,Spin} from 'antd';
import './Tree.less';

const TreeNode = Tree.TreeNode;
export default class UnitTree extends Component {

	static propTypes = {
		dataSource: PropTypes.array,
		selectedKey: PropTypes.string,
		onSelect: PropTypes.func,
	};
	_getOptionsArr(code, fromyear, frommonth, toyear, tomonth) {
		let arr = [];
		let l_y=Number(toyear) - Number(fromyear);
		let l_m=Number(tomonth) - Number(frommonth);
		if(l_y === 0){ //同一年
			for(let j = 0;j <= l_m;j++){
				let obj = {
					code: code,
					fromyear: fromyear,
					frommonth: frommonth+j,
					toyear: fromyear,
					tomonth: frommonth+j,
				}
				arr.push(obj)
			}
		}else{ //不同年
			for(let i = 0;i <= l_y;i++){
				if(Number(fromyear) + i === Number(fromyear)){ //开头年
					for(let k = 0;k <= 12-Number(frommonth);k++){
						let obj = {
							code: code,
							fromyear: Number(fromyear),
							frommonth: Number(frommonth)+k,
							toyear: Number(fromyear),
							tomonth: Number(frommonth)+k,
						}
						arr.push(obj)
					}
				}else if(Number(fromyear) + i === Number(toyear)){ //结束年
					for(let l = 1;l <= Number(tomonth);l++){
						let obj = {
							code: code,
							fromyear: Number(toyear),
							frommonth: l,
							toyear: Number(toyear),
							tomonth: l,
						}
						arr.push(obj)
					}
				}else{ //中间年
					for(let m = 1;m <= 12;m++){
						let obj = {
							code: code,
							fromyear: Number(fromyear) + i,
							frommonth: m,
							toyear: Number(fromyear) + i,
							tomonth: m,
						}
						arr.push(obj)
					}
				}
			}
		}
		return arr;
	}
	//选择单位
	onSelect(code) {
		if(code.length === 0){
			return
		}
		const {
			tabValue = '1',
		} = this.props;
		const {
			countTime,
			actions: {
				setCountSelectedAc,
				setSearchSelectedAc,
				getCountInfoAc,
				setLoadingAc,
				getSearchInfoAc,
				getPersonsAc,
				setCountInfoAc,
			}
		} = this.props;
		//	判断当前是统计还是查询
		if(tabValue == 1){
		//	设置统计选择的单位
			setCountSelectedAc(code[0]);
			setLoadingAc(true);


			let allMonth=this._getOptionsArr(code[0].split('--')[0],countTime.fromyear,countTime.frommonth,countTime.toyear,countTime.tomonth)
			let allPromises=allMonth.map((item)=>{
				return getCountInfoAc(item)
			})
			setLoadingAc(true);
			Promise.all(allPromises).then(rst=>{
				let allData=[]
				rst.map((itm)=>{
					allData=allData.concat(itm)
				})
				setCountInfoAc(allData)
				setLoadingAc(false);
			}).catch(()=>{
				setLoadingAc(false);
			})

		}else{
		//	设置查询选择的单位
			setSearchSelectedAc(code[0]);
			setLoadingAc(true);
			//查询所有的人员信息
			getPersonsAc({
				code:code[0].split('--')[0]
			});
			//获取当前的数据
			getSearchInfoAc({
				code:code[0].split('--')[0],
				year:countTime.fromyear,
				month:countTime.frommonth
			})
				.then(()=>{
					setLoadingAc(false);
				});
		}
	}

	render() {
		const {tabValue = '1',orgList = [], countSelectedKey,searchSelectedKey,loading} = this.props;
		return (
			<Spin spinning={loading} >
				<Tree className='global-tree-list' showLine
					selectedKeys={[tabValue == '1' ? countSelectedKey : searchSelectedKey]} onSelect={this.onSelect.bind(this)}>
					{
						UnitTree.loop(orgList)
					}
				</Tree>
			</Spin>
		);
	}

	static loop(data = []) {
		return data.map((item) => {
			if (item.children && item.children.length) {
				return (
					<TreeNode key={`${item.code}--${item.name}`}
							  title={item.name}>
						{
							UnitTree.loop(item.children)
						}
					</TreeNode>
				);
			}
			return <TreeNode key={`${item.code}--${item.name}`}
							 title={item.name}/>;
		});
	};
}
