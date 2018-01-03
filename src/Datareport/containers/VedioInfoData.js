import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {message,Progress} from 'antd';

import {Main,Content, DynamicTitle} from '_platform/components/layout';
import { actions as platformActions } from '_platform/store/global';

import {InfoUploadModal,InfoChangeModal,InfoDeleteModal,VedioInfoTable,MainHeader} from '../components/VedioData';
import { actions } from '../store/vedioData';
import {addSerialNumber} from '../components/VedioData/commonFunc';
import {DataReportTemplate_ImageInformation} from '_platform/api.js';

@connect(
	state => {
		const {datareport: {vedioinfodata = {}} = {}, platform} = state;
		return {...vedioinfodata, platform}
	},
	dispatch => ({
		actions: bindActionCreators({...platformActions,...actions}, dispatch)
	})
)

export default class VedioInfoData extends Component {

	constructor(props){
		super(props);
		this.state={
			loading:true,
			uploadModal: false,
			changeModal: false,
			deleteModal: false,
			dataSource: [],
			selectRows: [],
			percent: 0
		}
		Object.assign(this,{
			num: 0
		})
	}

	async componentDidMount(){
        const {actions:{getScheduleDir}} = this.props;
        const topDir = await getScheduleDir({code:'the_only_main_code_datareport'});
        if(topDir.obj_type){
            let dir = await getScheduleDir({code:'datareport_safety_vedioinfodata'});
            if(dir.obj_type){
                if(dir.stored_documents.length>0){
                    this.generateTableData(dir.stored_documents);
                }
            }
        }
    }

	render() {
		const {uploadModal,changeModal,deleteModal,dataSource,loading,selectRows,percent} = this.state,
			{actions,actions:{jsonToExcel}} = this.props;

		return (<Main>
			<DynamicTitle title="影像信息" {...this.props} />
			<Content>
				<MainHeader
				 showModal={this.showModal}
				 selectJudge={this.selectJudge}
				 jsonToExcel={jsonToExcel}
				 deriveData={this.deriveData}
				 storeDateSource={this.storeDateSource}
				 modalDown={DataReportTemplate_ImageInformation}
				/>
				<VedioInfoTable
				dataSource={dataSource}
				loading={{tip:<Progress style={{width:200}} percent={percent} status="active" strokeWidth={5}/>,spinning:loading}}
				storeSelectRows={this.storeSelectRows}
				/>
			</Content>
			<InfoUploadModal
			 key={`uploadModal${uploadModal}`}
			 uploadModal={uploadModal}
			 actions = {actions}
			 closeModal={this.closeModal}
			/>
			<InfoChangeModal
			 key={`changeModal${changeModal}`}
			 changeModal={changeModal}
			 closeModal={this.closeModal}
			 dataSource={selectRows}
			 actions={actions}
			/>
			<InfoDeleteModal
			 key={`deleteModal${deleteModal}`}
			 deleteModal={deleteModal}
			 closeModal={this.closeModal}
			 dataSource={selectRows}
			 actions = {actions}
			/>
		</Main>)
	}

	showModal = (modal)=>{
		let a = {};
		a[modal] = true;
        this.setState(a);
    }
    closeModal= (modal)=>{
		let a = {};
		a[modal] = false;
        this.setState(a);
	}

	generateTableData = (data)=>{
        const {actions:{
            getDocument,
		}} = this.props;
		const total = data.length;
		this.num = 0;
		const all = data.map(item=>{
			return getDocument({code:item.code}).then(rst=>{
				this.num++;
				this.setState({percent: parseFloat( (this.num*100/total).toFixed(2) ) })
				if(!rst) {
					message.error(`数据获取失败`)
					return {}
				}else{
					return rst
				}
			})
		})
		Promise.all(all).then(item =>{
			let dataSource = [];
			try{
				dataSource = item.map((response,index)=>{
					let {extra_params:{projectName,enginner,ShootingDate,file},code} = response;
					return {index:index+1,
						projectName,enginner,ShootingDate,file,code}
				})
			}catch(e){
				message.error(`数据获取失败`);
			}
			
			this.setState({dataSource,loading:false});
		})
	}
	
	storeSelectRows = (selectRows)=>{
		this.setState({selectRows});
	}

	selectJudge = ()=>{
		const {selectRows} = this.state;
		if(selectRows.length == 0){
			message.error("请选择数据");
			return false
		}
		if(!selectRows.every((data)=> data.enginner == selectRows[0].enginner )){
			message.error("请选择相同单位工程下的数据");
			return false
		}
		return true
	}

	deriveData = ()=>{
		const {dataSource} = this.state;
		return dataSource.map(item=>{
			const {index,projectName,enginner,ShootingDate,file:{name},code} = item;
			return [index,projectName,enginner,ShootingDate,name,code]
		})
	}

	storeDateSource = (dataSource)=>{
		this.setState({dataSource});
	}
};