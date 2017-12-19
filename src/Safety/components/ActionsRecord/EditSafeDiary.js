import React, {Component} from 'react';
import {Input, Select, Upload, Icon, Button, message, Row, Popconfirm, Table, Modal} from 'antd';
import {SOURCE_API} from '../../../_platform/api'
const Option = Select.Option;

class EditSafeDiary extends Component {

	constructor(props) {
		super(props);
		this.state = {
			images:[],
			dataSource:[],
			selectOptions:null,//下拉选择框
			project_unit:null,
			log_diary:{}
		};
	}
	componentDidMount(){
		this.initOptions()
		let { record } = this.props
		this.setState({images:record.images,dataSource:record.log_objects,log_diary:record.log_diary,currInitialData:record.log_diary})
	}
    coverPicFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		}
		this.props.form.setFieldsValue({attachment: [e.file]});
		return e && e.fileList;
	}
    covertURLRelative = (originUrl) => {
    	return originUrl.replace(/^http(s)?:\/\/[\w\-\.:]+/, '');
    }

	beforeUploadPic = (type,file) => {
		const fileName = file.name;
		if(/.+?\.png/.test(fileName)|| /.+?\.jpg/.test(fileName)|| /.+?\.bmp/.test(fileName)|| /.+?\.gif/.test(fileName) || /.+?\.svg/.test(fileName)){
			
		}else{
			message.error('请上传常见格式的图片');
			return false;
		}
		// 上传图片到静态服务器
		const {actions:{uploadStaticFile}} = this.props.props;

		const formdata = new FormData();
		formdata.append('a_file', file);
		formdata.append('name', fileName);

		uploadStaticFile({}, formdata).then(resp => {
            if (!resp || !resp.id) {
                message.error('文件上传失败')
                return;
            };
            const filedata = resp;
            filedata.a_file = this.covertURLRelative(filedata.a_file);
            const livePhotos = {
				id:resp.id,
                uid: file.uid,
                name: resp.name,
                status: 'done',
				a_file:filedata.a_file,
				thumbUrl: SOURCE_API + resp.a_file,
				download_url:filedata.a_file,
				mime_type:resp.mime_type
            };
			this.state[type].push(livePhotos);
			//this.forceUpdate()
			let files = {};
			files[type] = this.state[type]
			this.setState(files)
		});
		return false;
	}
	beforeUploadPicFile  = (type,file) => {
		const fileName = file.name;
		// 上传图片到静态服务器
		const { actions:{uploadStaticFile, deleteStaticFile} } = this.props.props;

		const formdata = new FormData();
		formdata.append('a_file', file);
		formdata.append('name', fileName);

		uploadStaticFile({}, formdata).then(resp => {
            console.log('uploadStaticFile: ', resp)
            if (!resp || !resp.id) {
                message.error('文件上传失败')
                return;
            };
            const filedata = resp;
            filedata.a_file = this.covertURLRelative(filedata.a_file);
            filedata.download_url = this.covertURLRelative(filedata.a_file);
            const attachment = {
                size: resp.size,
                uid: filedata.id,
                name: resp.name,
                status: 'done',
                url: SOURCE_API + resp.a_file,
				thumbUrl: SOURCE_API + resp.a_file,
				a_file:filedata.a_file,
				download_url:filedata.download_url,
				mime_type:resp.mime_type
            };
    		// 删除 之前的文件
    		if(this.state.currInitialData) {
    			deleteStaticFile({ id: this.state.currInitialData.uid })
    		}
			this.setState({currInitialData: attachment})
			let files = {};
			files[type] = attachment
            this.setState(files)
		});
		return false;
	}
	handleRemove = (type,file) => {
		const {actions:{deleteStaticFile}} = this.props.props;
		deleteStaticFile({id:file.id});
		let fileList = [];
		let fileArray = this.state[type];
		for(let i = fileArray.length-1; i >= 0; i--){
			if(fileArray[i].id !== file.id){
				fileList.push(fileArray[i])
			}
		}
		this.state[type] = fileList;
		//this.forceUpdate();
		let img = {};
		img[type] = fileList
		this.setState(img)
	}
	removePicFile = (file) => {
		// 上传图片到静态服务器
		const {
			actions:{deleteStaticFile}
		} = this.props.props;
		deleteStaticFile({id:file.uid});
		this.setState({log_diary:{}})
		return true;
    }
	//table input 输入
    tableDataChange(index, key ,e ){
		const { dataSource } = this.state;
		dataSource[index][key] = e.target['value'];
	  	this.setState({dataSource});
	}
	   //初始化下拉框选项
	async initOptions(){
        const {actions:{ getWkByCode }} = this.props.props
        let selectOptions = []
        if(this.props.state.code){
            let rst = await getWkByCode({code:this.props.state.code})
            rst.children_wp.map(item => {
                selectOptions.push(<Option value={item.pk}>{item.name}</Option>)
            })
            this.setState({project_unit:rst,selectOptions})
        }else{
            return ''
        }
    }
	//下拉框变化
	selectChange(index, value ,option){
		const { dataSource } = this.state;
		dataSource[index]['pk'] = value;
		dataSource[index]['project'] = option.props.children;
	  	this.setState({dataSource});

	}

	//新增一行
	addRow(){
		let {dataSource} = this.state
		dataSource.push({
			"project": "", 
			"pk": "", 
			"location": "", 
			"team": "", 
			"workernum": "", 
			"progress": ""
		})
		this.setState({dataSource})
	}
	//删除一行
	delete(index){
        let datas = this.state.dataSource;
        datas.splice(index,1);
        this.setState({dataSource:datas});
	}
	//TIJIAO提交
	onok(){
		this.props.setEditData(this.state.dataSource,this.state.log_diary,this.state.images)
	}
	render() {
		//安全目标表格
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            // width: '5%',
            render:(text,record,index) => {
                return <div>{index+1}</div>
            }
        }, {
            title: '分项工程',
			dataIndex: 'project',
			width: '16%',
			render: (text, record, index) => (
                <Select value={this.state.dataSource[index].pk} onSelect={this.selectChange.bind(this,index)}>
					{
						this.state.selectOptions
					}
				</Select>
            ),
        }, {
            title: '层段位置',
			dataIndex: 'location',
			width: '16%',
			render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['location']} onChange={this.tableDataChange.bind(this,index,'location')}/>
            ),
        }, {
            title: '工作班组',
			dataIndex: 'team',
			width: '16%',
			render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['team']} onChange={this.tableDataChange.bind(this,index,'team')}/>
            ),
        }, {
            title: '工作人数',
			dataIndex: 'workernum',
			width: '16%',
			render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['workernum']} onChange={this.tableDataChange.bind(this,index,'workernum')}/>
            ),
        }, {
            title: '进度情况',
            dataIndex: 'progress',
            width: '15%',
            render: (text, record, index) => (
                <Input value={this.state.dataSource[index]['progress']} onChange={this.tableDataChange.bind(this,index,'progress')}/>
            ),
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            // width: '10%',
            render: (text, record, index) => (
                <span>
                    <Popconfirm
                        placement="rightTop"
                        title="确定删除吗？"
                        onConfirm={this.delete.bind(this, index)}
                        okText="确认"
                        cancelText="取消">
                        <a>删除</a>
                    </Popconfirm>
                </span>
            ),
		}]
		let log_diarys = this.state.log_diary.a_file ? [this.state.log_diary] : []
		return (
			<Modal 
				title="新增施工安全日志"
				width={760}
				maskClosable={false}
				key={this.props.state.newKey1}
				visible={true}
				onOk={this.onok.bind(this)}
				onCancel={this.props.goCancel}
				>
				<div>
					<Row>
						<span style={{marginRight:'20px'}}><label>工程名称：</label>{this.state.project_unit && this.state.project_unit.name}</span>
						<span><label>专职安全员：</label>{this.props.state.user && this.props.state.user.name}</span>
						<Button onClick={this.addRow.bind(this)} style={{float:'right', marginRight:'10px'}}>新增</Button>
					</Row>
					<Table style={{ marginTop: '10px', marginBottom:'10px' }}
							columns={columns}
							dataSource={this.state.dataSource}
							bordered />
					<div style={{marginBottom:'10px'}}>
						<Upload fileList={log_diarys} beforeUpload={this.beforeUploadPicFile.bind(this,"log_diary")} onRemove={this.removePicFile.bind(this)}>
							<Button>
								<Icon type="upload" />添加施工安全日记
							</Button>
						</Upload>
					</div>
					<Upload fileList={this.state.images} listType="picture-card" beforeUpload={this.beforeUploadPic.bind(this,"images")} onRemove={this.handleRemove.bind(this,"images")}>
						<div>
							<Icon type="plus"/>
							<div className="ant-upload-text">上传图片</div>
						</div>
						</Upload>
				</div>
			</Modal>
            
		)
	}
}
export default EditSafeDiary;