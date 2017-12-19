import {injectReducer} from '../store';
import React, {Component} from 'react';
import {Route,Switch} from 'react-router-dom';
import {Main, Aside, Body} from '_platform/components/layout';
import Submenu from '_platform/components/panels/Submenu';
import {Icon} from 'react-fa';

export default class DrawingcareContainer extends Component {

	async componentDidMount() {
		const {default: reducer} = await import('./store');
		const Containers = await import('./containers');
		injectReducer('drawingcare', reducer);
		this.setState({
			...Containers
		});
	}

	render() {
		const {
			Recordmanage = null,
			Filemanage = null,
			Drawinglist = null,
			Recordlist = null,
			Techbooklist = null,
			Topographicmaplist = null,
			Standardspecificationlist = null,
			Openrecordlist = null,
			Audiovisualrecordlist = null,
		} = this.state || {};
		return (
			<Body>
			<Aside>
				<Submenu {...this.props} menus={DrawingcareContainer.menus}/>
			</Aside>
			<Main>
				<div style={{
						"position": "absolute",
						"top": 80,
						"bottom": 37,
						"left": 160,
						"right": 0,
						"zIndex": 1000
					}}
				>
					{Recordmanage && <Route exact path="/drawingcare/recordmanage" component={Recordmanage}/>}
					{Filemanage && <Route exact path="/drawingcare/Filemanage" component={Filemanage}/>}
					{Drawinglist && <Route exact path="/drawingcare/Drawinglist" component={Drawinglist}/>}
					{Recordlist && <Route exact path="/drawingcare/Recordlist" component={Recordlist}/>}
					{Techbooklist && <Route exact path="/drawingcare/Techbooklist" component={Techbooklist}/>}
					{Topographicmaplist && <Route exact path="/drawingcare/Topographicmaplist" component={Topographicmaplist}/>}
					{Standardspecificationlist && <Route exact path="/drawingcare/Standardspecificationlist" component={Standardspecificationlist}/>}
					{Openrecordlist && <Route exact path="/drawingcare/Openrecordlist" component={Openrecordlist}/>}
					{Audiovisualrecordlist && <Route exact path="/drawingcare/Audiovisualrecordlist" component={Audiovisualrecordlist}/>}
				</div>
			</Main>
			</Body>);
	}

	static menus = [{
		key: 'projectarchives',
		id: 'DRAWINGCARE.PROJECTARCHIVES',
		path: '/drawingcare/projectarchives',
		name: '工程档案',
		icon: <Icon name="book"/>,
		children: [
			{
				key: 'recordmanage',
				id: 'DRAWINGCARE.RECORDMANAGE',
				name: '工程文档案卷管理',
				path: '/drawingcare/recordmanage',
				icon: <Icon name="book"/>
			},
			{
				key: 'filemanage',
				id: 'DRAWINGCARE.FILEMANAGE',
				name: '工程文档文件管理',
				path: '/drawingcare/filemanage',
				icon: <Icon name="book"/>
			}]
	},{
		key: 'drawingrecordmanage',
		id: 'DRAWINGCARE.DRAWINGRECORDMANAGE',
		path: '/drawingcare/drawingrecordmanage',
		name: '图纸文档管理',
		icon: <Icon name="book"/>,
		children: [
			{
				key: 'drawinglist',
				id: 'DRAWINGCARE.DRAWINGLIST',
				name: '图纸编目',
				path: '/drawingcare/drawinglist',
				icon: <Icon name="book"/>
			},
			{
				key: 'recordlist',
				id: 'DRAWINGCARE.RECORDLIST',
				name: '档案编目',
				path: '/drawingcare/recordlist',
				icon: <Icon name="book"/>
			}]
	},{
		key: 'bookdatamanageme',
		id: 'DRAWINGCARE.BOOKDATAMANAGEME',
		path: '/drawingcare/bookdatamanageme',
		name: '图书资料管理',
		icon: <Icon name="book"/>,
		children: [
			{
				key: 'techbooklist',
				id: 'DRAWINGCARE.TECHBOOKLIST',
				name: '科技图书编目',
				path: '/drawingcare/techbooklist',
				icon: <Icon name="book"/>
			},
			{
				key: 'topographicmaplist',
				id: 'DRAWINGCARE.TOPOGRAPHICMAPLIST',
				name: '地形图编目',
				path: '/drawingcare/topographicmaplist',
				icon: <Icon name="book"/>
			}]
	},{
		key: 'standardspecification',
		id: 'DRAWINGCARE.STANDARDSPECIFICATION',
		path: '/drawingcare/standardspecification',
		name: '标准规范',
		icon: <Icon name="book"/>,
		children: [
			{
				key: 'standardspecificationlist',
				id: 'DRAWINGCARE.STANDARDSPECIFICATIONLIST',
				name: '标准规范编目',
				path: '/drawingcare/standardspecificationlist',
				icon: <Icon name="book"/>
			}]
	},{
		key: 'openrecord',
		id: 'DRAWINGCARE.OPENRECORD',
		path: '/drawingcare/openrecord',
		name: '公开档案',
		icon: <Icon name="book"/>,
		children: [
			{
				key: 'openrecordlist',
				id: 'DRAWINGCARE.OPENRECORDLIST',
				name: '公开档案编目',
				path: '/drawingcare/openrecordlist',
				icon: <Icon name="book"/>
			}]
	},{
		key: 'audiovisualrecord',
		id: 'AUDIOVISUALRECORD',
		path: '/drawingcare/audiovisualrecord',
		name: '声像档案',
		icon: <Icon name="book"/>,
		children: [
			{
				key: 'audiovisualrecordlist',
				id: 'DRAWINGCARE.AUDIOVISUALRECORDLIST',
				name: '声像档案编目',
				path: '/drawingcare/audiovisualrecordlist',
				icon: <Icon name="book"/>
			}]
	}];
};
