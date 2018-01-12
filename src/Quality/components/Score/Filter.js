/**
 * Created by du on 2017/6/7.
 */
import React, {Component} from 'react';
import {
	Form, Input, Select, Button, Row, Col, Table
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
export default class Filter extends Component {

	static propTypes = {};

	static layout = {
		labelCol: {span: 8},
		wrapperCol: {span: 10},
	};

	render() {
		const {
			filter = [],
			platform: {
				wp:{
                    sections = [],
                    subsections = [],
                    items = [],
				} = {}
			} = {}
		} = this.props;

		console.log('props',this.props);

		return (
			<div>
				<Form>
					<Row gutter={24}>
						<Col span={6}>
							<FormItem {...Filter.layout}
							          label="分部">
								<Select placeholder="请选择分部" allowClear
								        style={{width: 100}}
										value={filter.section}
								        onChange={this.changeSectionWorkPackage.bind(
									        this)}>
									{
										sections.map(pkg => {
											return <Option key={pkg.code}
											               value={pkg.code}>{pkg.name}</Option>;
										})
									}
								</Select>
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem {...Filter.layout}
							          label="子分部">
								<Select placeholder="请选择子分部" allowClear
								        style={{width: 100}}
										value={filter.subSection}
								        onChange={this.changeSubSectionWorkPackage.bind(
									        this)}>
									{
                                        subsections.map(pkg => {
											return <Option key={pkg.code}
											               value={pkg.code}>{pkg.name}</Option>;
										})
									}
								</Select>
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem {...Filter.layout}
							          label="分项">
								<Select placeholder="请选择分项" allowClear labelInValue
								        style={{width: 100}}
										value={filter.item}
								        onChange={this.changeItemWorkPackage.bind(this)}>
									{
										items.map(pkg => {
											return <Option key={pkg.code}
											               value={pkg.code}>{pkg.name}</Option>;
										})
									}
								</Select>
							</FormItem>
						</Col>
						<Col span={6}>
							<FormItem {...Filter.layout}
									  label="状态">
								<Select placeholder="状态" allowClear labelInValue
										style={{width: 100}}
										onChange={this.changestatus.bind(this)}>
									<option value="true">审核中</option>
									<option value="false">已审核</option>
								</Select>
							</FormItem>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}

	changeSectionWorkPackage(key) {
		const {
			actions: {changeFilterField,getSubsections, setSubsection, setItem},
		} = this.props;
        changeFilterField('section', key);
		if (key !== undefined) {
            getSubsections({code: key}).then(({children_wp}) => {
                setSubsection(children_wp);
			});
		} else {
            setSubsection([]);
		}
		setItem([]);
        changeFilterField('subSection', undefined);
        changeFilterField('item', undefined);
	}

	changeSubSectionWorkPackage(key) {
		const {
			actions: {changeFilterField,getItems, setItem},
		} = this.props;
        changeFilterField('subSection', key);
		if (key !== undefined) {
            getItems({code: key}).then(({children_wp}) => {
				setItem(children_wp);
			});
		} else {
			setItem([]);
		}
        changeFilterField('item', undefined);
	}

	changeItemWorkPackage(key) {
		const {actions: {changeFilterField,getPartPackages, setPartPackages, getFormdocument}} = this.props;
        changeFilterField('item', key);
		const querylist = {
			"code": "TEMPLATE_007",
			"order_by": "-real_start_time",
			"subject_qilocation": key
		};
		if (key !== undefined) {
			getPartPackages({code: key.key}).then(({children_wp}) => {
				setPartPackages(children_wp);
				const requests = children_wp.map(cell => {  //请求多个流程 返回请求本身，请求本身为 promise
					const {name} = cell; //获取name
					return getFormdocument({}, {
						"code": "TEMPLATE_007",
						"order_by": "-real_start_time",
						"subject_qilocation": name
					})
				});
				Promise.all(requests).then(rst => { // Promise.all 是把多个promise 合称为一个 promise，并把他们的返回值组成数组返回,1+N次
					console.log(rst);

				})
			});
		} else {
			setPartPackages([]);
		}
	}

    changestatus(key){
        const {oldpart} =this.props;
        let bool = key.key ==='true';  //点击时候的bool状态
        const newpartone =[];
        const newparttwo = [];
        oldpart.map((item)=>{
            if(item.status == bool){
                newpartone.push(item);
            }
        });
        oldpart.map((item)=>{
            if(item.status == false){
                newparttwo.push(item);
            }
        });
        const {actions:{getnewpart}} =this.props;
        console.log('newpartone',newpartone);
        console.log('newparttwo',newparttwo);
        if(bool == true){
            getnewpart(newpartone)
        }else{
            getnewpart(newparttwo)
        }
    }
}
