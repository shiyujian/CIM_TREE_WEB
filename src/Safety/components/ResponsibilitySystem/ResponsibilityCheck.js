import React, { Component } from 'react';
import { Table, Tabs, Button, Row, Col, message, Modal, 
    notification,Popconfirm, Card, Select, Form, Radio, Cascader } from 'antd';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import AddCheck from './AddCheck';
import EditCheck from './EditCheck';
import { STATIC_DOWNLOAD_API } from '../../../_platform/api';

const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ResponsibilityCheck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataValue:[],
            unitProject:{},
            project:{},
            index: '-1',
            newKey: Math.random(),
            newKey1: Math.random()*5,
            setVisible: false,
            setEditVisible: false,
            type: 'm',
            dataSource: [],
            dataSourceY: [],
            options:[{
                value: 2017,
                label: '2017年',
                children: [{
                    value: 1,
                    label: '1月',
                }, {
                    value: 2,
                    label: '2月',
                }, {
                    value: 3,
                    label: '3月',
                }, {
                    value: 4,
                    label: '4月',
                }, {
                    value: 5,
                    label: '5月',
                }, {
                    value: 6,
                    label: '6月',
                }, {
                    value: 7,
                    label: '7月',
                }, {
                    value: 8,
                    label: '8月',
                }, {
                    value: 9,
                    label: '9月',
                }, {
                    value: 10,
                    label: '10月',
                },{
                    value:11,
                    label:'11月'
                },{
                    value:12,
                    label:'12月'
                }],
            }, {
                value: 2018,
                label: '2018年',
                children: [{
                    value: 1,
                    label: '1月',
                }, {
                    value: 2,
                    label: '2月',
                }, {
                    value: 3,
                    label: '3月',
                }, {
                    value: 4,
                    label: '4月',
                }, {
                    value: 5,
                    label: '5月',
                }, {
                    value: 6,
                    label: '6月',
                }, {
                    value: 7,
                    label: '7月',
                }, {
                    value: 8,
                    label: '8月',
                }, {
                    value: 9,
                    label: '9月',
                }, {
                    value: 10,
                    label: '10月',
                },{
                    value:11,
                    label:'11月'
                },{
                    value:12,
                    label:'12月'
                }],
            }, {
                value: 2019,
                label: '2019年',
                children: [{
                    value: 1,
                    label: '1月',
                }, {
                    value: 2,
                    label: '2月',
                }, {
                    value: 3,
                    label: '3月',
                }, {
                    value: 4,
                    label: '4月',
                }, {
                    value: 5,
                    label: '5月',
                }, {
                    value: 6,
                    label: '6月',
                }, {
                    value: 7,
                    label: '7月',
                }, {
                    value: 8,
                    label: '8月',
                }, {
                    value: 9,
                    label: '9月',
                }, {
                    value: 10,
                    label: '10月',
                },{
                    value:11,
                    label:'11月'
                },{
                    value:12,
                    label:'12月'
                }],
            }, {
                value: 2020,
                label: '2020年',
                children: [{
                    value: 1,
                    label: '1月',
                }, {
                    value: 2,
                    label: '2月',
                }, {
                    value: 3,
                    label: '3月',
                }, {
                    value: 4,
                    label: '4月',
                }, {
                    value: 5,
                    label: '5月',
                }, {
                    value: 6,
                    label: '6月',
                }, {
                    value: 7,
                    label: '7月',
                }, {
                    value: 8,
                    label: '8月',
                }, {
                    value: 9,
                    label: '9月',
                }, {
                    value: 10,
                    label: '10月',
                },{
                    value:11,
                    label:'11月'
                },{
                    value:12,
                    label:'12月'
                }],
            }, {
                value: 2021,
                label: '2021年',
                children: [{
                    value: 1,
                    label: '1月',
                }, {
                    value: 2,
                    label: '2月',
                }, {
                    value: 3,
                    label: '3月',
                }, {
                    value: 4,
                    label: '4月',
                }, {
                    value: 5,
                    label: '5月',
                }, {
                    value: 6,
                    label: '6月',
                }, {
                    value: 7,
                    label: '7月',
                }, {
                    value: 8,
                    label: '8月',
                }, {
                    value: 9,
                    label: '9月',
                }, {
                    value: 10,
                    label: '10月',
                },{
                    value:11,
                    label:'11月'
                },{
                    value:12,
                    label:'12月'
                }],
            }, {
                value: 2022,
                label: '2022年',
                children: [{
                    value: 1,
                    label: '1月',
                }, {
                    value: 2,
                    label: '2月',
                }, {
                    value: 3,
                    label: '3月',
                }, {
                    value: 4,
                    label: '4月',
                }, {
                    value: 5,
                    label: '5月',
                }, {
                    value: 6,
                    label: '6月',
                }, {
                    value: 7,
                    label: '7月',
                }, {
                    value: 8,
                    label: '8月',
                }, {
                    value: 9,
                    label: '9月',
                }, {
                    value: 10,
                    label: '10月',
                },{
                    value:11,
                    label:'11月'
                },{
                    value:12,
                    label:'12月'
                }],
            }, {
                value: 2023,
                label: '2023年',
                children: [{
                    value: 1,
                    label: '1月',
                }, {
                    value: 2,
                    label: '2月',
                }, {
                    value: 3,
                    label: '3月',
                }, {
                    value: 4,
                    label: '4月',
                }, {
                    value: 5,
                    label: '5月',
                }, {
                    value: 6,
                    label: '6月',
                }, {
                    value: 7,
                    label: '7月',
                }, {
                    value: 8,
                    label: '8月',
                }, {
                    value: 9,
                    label: '9月',
                }, {
                    value: 10,
                    label: '10月',
                },{
                    value:11,
                    label:'11月'
                },{
                    value:12,
                    label:'12月'
                }],
            }],
            optionsM:[{
                value: 2017,
                label: '2017年',
                children: [{
                    value: 1,
                    label: '1月',
                }, {
                    value: 2,
                    label: '2月',
                }, {
                    value: 3,
                    label: '3月',
                }, {
                    value: 4,
                    label: '4月',
                }, {
                    value: 5,
                    label: '5月',
                }, {
                    value: 6,
                    label: '6月',
                }, {
                    value: 7,
                    label: '7月',
                }, {
                    value: 8,
                    label: '8月',
                }, {
                    value: 9,
                    label: '9月',
                }, {
                    value: 10,
                    label: '10月',
                },{
                    value:11,
                    label:'11月'
                },{
                    value:12,
                    label:'12月'
                }],
            }, {
                value: 2018,
                label: '2018年',
                children: [{
                    value: 1,
                    label: '1月',
                }, {
                    value: 2,
                    label: '2月',
                }, {
                    value: 3,
                    label: '3月',
                }, {
                    value: 4,
                    label: '4月',
                }, {
                    value: 5,
                    label: '5月',
                }, {
                    value: 6,
                    label: '6月',
                }, {
                    value: 7,
                    label: '7月',
                }, {
                    value: 8,
                    label: '8月',
                }, {
                    value: 9,
                    label: '9月',
                }, {
                    value: 10,
                    label: '10月',
                },{
                    value:11,
                    label:'11月'
                },{
                    value:12,
                    label:'12月'
                }],
            }, {
                value: 2019,
                label: '2019年',
                children: [{
                    value: 1,
                    label: '1月',
                }, {
                    value: 2,
                    label: '2月',
                }, {
                    value: 3,
                    label: '3月',
                }, {
                    value: 4,
                    label: '4月',
                }, {
                    value: 5,
                    label: '5月',
                }, {
                    value: 6,
                    label: '6月',
                }, {
                    value: 7,
                    label: '7月',
                }, {
                    value: 8,
                    label: '8月',
                }, {
                    value: 9,
                    label: '9月',
                }, {
                    value: 10,
                    label: '10月',
                },{
                    value:11,
                    label:'11月'
                },{
                    value:12,
                    label:'12月'
                }],
            }, {
                value: 2020,
                label: '2020年',
                children: [{
                    value: 1,
                    label: '1月',
                }, {
                    value: 2,
                    label: '2月',
                }, {
                    value: 3,
                    label: '3月',
                }, {
                    value: 4,
                    label: '4月',
                }, {
                    value: 5,
                    label: '5月',
                }, {
                    value: 6,
                    label: '6月',
                }, {
                    value: 7,
                    label: '7月',
                }, {
                    value: 8,
                    label: '8月',
                }, {
                    value: 9,
                    label: '9月',
                }, {
                    value: 10,
                    label: '10月',
                },{
                    value:11,
                    label:'11月'
                },{
                    value:12,
                    label:'12月'
                }],
            }, {
                value: 2021,
                label: '2021年',
                children: [{
                    value: 1,
                    label: '1月',
                }, {
                    value: 2,
                    label: '2月',
                }, {
                    value: 3,
                    label: '3月',
                }, {
                    value: 4,
                    label: '4月',
                }, {
                    value: 5,
                    label: '5月',
                }, {
                    value: 6,
                    label: '6月',
                }, {
                    value: 7,
                    label: '7月',
                }, {
                    value: 8,
                    label: '8月',
                }, {
                    value: 9,
                    label: '9月',
                }, {
                    value: 10,
                    label: '10月',
                },{
                    value:11,
                    label:'11月'
                },{
                    value:12,
                    label:'12月'
                }],
            }, {
                value: 2022,
                label: '2022年',
                children: [{
                    value: 1,
                    label: '1月',
                }, {
                    value: 2,
                    label: '2月',
                }, {
                    value: 3,
                    label: '3月',
                }, {
                    value: 4,
                    label: '4月',
                }, {
                    value: 5,
                    label: '5月',
                }, {
                    value: 6,
                    label: '6月',
                }, {
                    value: 7,
                    label: '7月',
                }, {
                    value: 8,
                    label: '8月',
                }, {
                    value: 9,
                    label: '9月',
                }, {
                    value: 10,
                    label: '10月',
                },{
                    value:11,
                    label:'11月'
                },{
                    value:12,
                    label:'12月'
                }],
            }, {
                value: 2023,
                label: '2023年',
                children: [{
                    value: 1,
                    label: '1月',
                }, {
                    value: 2,
                    label: '2月',
                }, {
                    value: 3,
                    label: '3月',
                }, {
                    value: 4,
                    label: '4月',
                }, {
                    value: 5,
                    label: '5月',
                }, {
                    value: 6,
                    label: '6月',
                }, {
                    value: 7,
                    label: '7月',
                }, {
                    value: 8,
                    label: '8月',
                }, {
                    value: 9,
                    label: '9月',
                }, {
                    value: 10,
                    label: '10月',
                },{
                    value:11,
                    label:'11月'
                },{
                    value:12,
                    label:'12月'
                }],
            }],
            optionsY: [{
                value: 2016,
                label: '2016年',
            }, {
                value: 2017,
                label: '2017年',
            }, {
                value: 2018,
                label: '2018年',
            }, {
                value: 2019,
                label: '2019年',
            }, {
                value: 2020,
                label: '2020年',
            }, {
                value:2021,
                label:'2021年'
            }, {
                value:2022,
                label:'2022年'
            }, {
                value:2023,
                label:'2023年'
            }]
        }
    }
    componentWillReceiveProps(nextProps){
        console.log("componentWillReceiveProps");
        if(nextProps.unitProject){
            this.setState({unitProject:nextProps.unitProject});
        }
        if(nextProps.project){
            this.setState({project:nextProps.project});
        }
    }

    addClick = (record, index) => {
        this.setState({
            setVisible: true,
            newKey: Math.random(),
            record:record
        });
    }

    editClick = (record, index) => {
        this.setState({
            setEditVisible: true,
            newKey1: Math.random()*5,
            record: record
        });
    }

    setEditData(){
        const {
            actions: {
                postMonthResponse,
                patchMonthResponse,
                getResponsibility,
            },
            unitProject,
            project
        } = this.props;
        const {dataValue,record} = this.state;
        this.props.form.validateFields((err,values) => {
            if(!err){
                let postData = {
                    check_year:dataValue[0],
                    check_month:dataValue[1],
                    check_result:values.result,
                    remark:values.remark,
                    check_person:{
                        name:values.checkman
                    }
                }
                if(record.mid){
                    patchMonthResponse({pk:record.mid},postData).then(rst=>{
                        if(rst.id){
                            notification.info({
                                message: '编辑月考核成功',
                                duration: 2
                            });
                            let datas = [];
                            getResponsibility({},{project_unit_pk:unitProject.pk,year:dataValue[0],month:dataValue[1]}).then(rst=>{
                                if(rst.length!==0){
                                    rst.map((item)=>{
                                        let data = {};
                                        data.id = item.id;
                                        data.name = item.responsor.name;
                                        data.duties = item.responsor.duty;
                                        data.result = item.monthcheck[0].check_result;
                                        data.examiner = item.monthcheck[0].check_person.name;
                                        data.remark = item.monthcheck[0].remark;
                                        datas.push(data);
                                    });
                                    this.setState({dataSource:datas});
                                }else{
                                    this.setState({dataSource:[]});
                                }
                            });
                        }else{
                            notification.info({
                                message: '编辑月考核失败',
                                duration: 2
                            });
                        }
                    });
                }else{
                    postMonthResponse({pk:record.id},postData).then(rst=>{
                        if(rst.id){
                            notification.info({
                                message: '编辑月考核成功',
                                duration: 2
                            });
                            let datas = [];
                            getResponsibility({},{project_unit_pk:unitProject.pk,year:dataValue[0],month:dataValue[1]}).then(rst=>{
                                if(rst.length!==0){
                                    rst.map((item)=>{
                                        let data = {};
                                        data.id = item.id;
                                        data.name = item.responsor.name;
                                        data.duties = item.responsor.duty;
                                        data.result = item.monthcheck[0].check_result;
                                        data.examiner = item.monthcheck[0].check_person.name;
                                        data.remark = item.monthcheck[0].remark;
                                        datas.push(data);
                                    });
                                    this.setState({dataSource:datas});
                                }else{
                                    this.setState({dataSource:[]});
                                }
                            });
                        }else{
                            notification.info({
                                message: '编辑月考核失败',
                                duration: 2
                            });
                        }
                    });
                }
                this.setState({
                    setEditVisible:false,
                });
            }
        }); 
    }

    delete(index){
        let datas = this.state.dataSource;
        datas.splice(index,1);
        this.setState({dataSource:datas});
    }

    setAddData(){
        const {
            actions: {
                postYearResponse,
                patchYearResponse,
                getResponsibility,
            },
            unitProject,
            project
        } = this.props;
        const {dataValue,record} = this.state;
        this.props.form.validateFields((err,values) => {
            if(!err){
                let postData = {
                    check_year:dataValue[0],
                    year_check_result:values.result,
                    year_remark:values.remark,
                }
                if(record.yid){
                    patchYearResponse({pk:record.yid},postData).then(rst=>{
                        if(rst.id){
                            notification.info({
                                message: '编辑年考核成功',
                                duration: 2
                            });
                            let datas = [];
                            getResponsibility({},{project_unit_pk:unitProject.pk,year:dataValue[0]}).then(rst=>{
                                if(rst.length!==0){
                                    rst.map((item)=>{
                                        let data = {};
                                        data.id = item.id;
                                        data.yid = item.yearcheck[0].id;
                                        data.principal = item.responsor.name;
                                        data.comment = item.yearcheck[0].year_check_result;
                                        data.remark = item.yearcheck[0].year_remark;
                                        for(let i=1;i<13;i++){
                                            if(i===1){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Jan = month.check_result;
                                                    }
                                                })
                                            }else if(i===2){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Feb = month.check_result;
                                                    }
                                                })
                                            }else if(i===3){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Mar = month.check_result;
                                                    }
                                                })
                                            }else if(i===4){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Apr = month.check_result;
                                                    }
                                                })
                                            }else if(i===5){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.May = month.check_result;
                                                    }
                                                })
                                            }else if(i===6){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Jun = month.check_result;
                                                    }
                                                })
                                            }else if(i===7){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.July = month.check_result;
                                                    }
                                                })
                                            }else if(i===8){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Aug = month.check_result;
                                                    }
                                                })
                                            }else if(i===9){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Sept = month.check_result;
                                                    }
                                                })
                                            }else if(i===10){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Oct = month.check_result;
                                                    }
                                                })
                                            }else if(i===11){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Nov = month.check_result;
                                                    }
                                                })
                                            }else if(i===12){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Dec = month.check_result;
                                                    }
                                                })
                                            }
                                        }
                                        datas.push(data);
                                        this.setState({dataSourceY:datas});
                                    });
                                }else{
                                    this.setState({dataSourceY:[]});
                                }
                            });
                        }else{
                            notification.info({
                                message: '编辑年考核失败',
                                duration: 2
                            });
                        }
                    });
                }else{
                    postYearResponse({pk:record.id},postData).then(rst=>{
                        if(rst.id){
                            notification.info({
                                message: '编辑年考核成功',
                                duration: 2
                            });
                            let datas = [];
                            getResponsibility({},{project_unit_pk:unitProject.pk,year:dataValue[0]}).then(rst=>{
                                if(rst.length!==0){
                                    rst.map((item)=>{
                                        let data = {};
                                        data.id = item.id;
                                        data.yid = item.yearcheck[0].id;
                                        data.principal = item.responsor.name;
                                        data.comment = item.yearcheck[0].year_check_result;
                                        data.remark = item.yearcheck[0].year_remark;
                                        for(let i=1;i<13;i++){
                                            if(i===1){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Jan = month.check_result;
                                                    }
                                                })
                                            }else if(i===2){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Feb = month.check_result;
                                                    }
                                                })
                                            }else if(i===3){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Mar = month.check_result;
                                                    }
                                                })
                                            }else if(i===4){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Apr = month.check_result;
                                                    }
                                                })
                                            }else if(i===5){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.May = month.check_result;
                                                    }
                                                })
                                            }else if(i===6){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Jun = month.check_result;
                                                    }
                                                })
                                            }else if(i===7){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.July = month.check_result;
                                                    }
                                                })
                                            }else if(i===8){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Aug = month.check_result;
                                                    }
                                                })
                                            }else if(i===9){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Sept = month.check_result;
                                                    }
                                                })
                                            }else if(i===10){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Oct = month.check_result;
                                                    }
                                                })
                                            }else if(i===11){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Nov = month.check_result;
                                                    }
                                                })
                                            }else if(i===12){
                                                item.monthcheck.map(month=>{
                                                    if(month.check_month===i){   //has current month data
                                                        data.Dec = month.check_result;
                                                    }
                                                })
                                            }
                                        }
                                        datas.push(data);
                                        this.setState({dataSourceY:datas});
                                    });
                                }else{
                                    this.setState({dataSourceY:[]});
                                }
                            });
                        }else{
                            notification.info({
                                message: '编辑年考核失败',
                                duration: 2
                            });
                        }
                    });
                }
                this.setState({
                    setVisible:false,
                });
            }
        }); 
    }
    goCancel(){
        this.setState({
            setVisible:false,
            setEditVisible: false,
        });
    }

    onChange(e) {
        if(e.target.value == 'y'){
            this.setState({
                options:this.state.optionsY,
                type: 'y'
            })
        }
        if(e.target.value == 'm'){
            this.setState({
                options:this.state.optionsM,
                type: 'm'
            })
        }
    }

    onChange2(value) {
        const {
            actions: {
                patchResponsibility,
                getResponsibility
            },
            unitProject,
            project
        } = this.props;
        const {type} = this.state;
        let datas = [];
        this.setState({dataValue:value});
        if(value.length===2&&type==='m'){
            getResponsibility({},{project_unit_pk:unitProject.pk,year:value[0],month:value[1]}).then(rst=>{
                if(rst.length!==0){
                    rst.map((item)=>{
                        if(item.monthcheck.length!==0){
                            let data = {};
                            data.id = item.id;
                            data.mid = item.monthcheck[0].id;
                            data.name = item.responsor.name;
                            data.duties = item.responsor.duty;
                            data.result = item.monthcheck[0].check_result;
                            data.examiner = item.monthcheck[0].check_person.name;
                            data.remark = item.monthcheck[0].remark;
                            datas.push(data);
                        }else{   //没有查询到
                            let data = {};
                            data.id = item.id;
                            data.name = item.responsor.name;
                            data.duties = item.responsor.duty;
                            datas.push(data);
                        }
                    });
                    this.setState({dataSource:datas});
                }else{
                    this.setState({dataSource:[]});
                }
            });
            this.setState({dataSource:datas});
        }else if(value.length===1&&type==='y'){
            getResponsibility({},{project_unit_pk:unitProject.pk,year:value[0]}).then(rst=>{
                if(rst.length!==0){
                    rst.map((item)=>{
                        if(item.yearcheck.length!==0){
                            let data = {};
                            data.id = item.id;
                            data.yid = item.yearcheck[0].id;
                            data.principal = item.responsor.name;
                            data.comment = item.yearcheck[0].year_check_result;
                            data.remark = item.yearcheck[0].year_remark;
                            for(let i=1;i<13;i++){
                                if(i===1){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Jan = month.check_result;
                                        }
                                    })
                                }else if(i===2){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Feb = month.check_result;
                                        }
                                    })
                                }else if(i===3){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Mar = month.check_result;
                                        }
                                    })
                                }else if(i===4){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Apr = month.check_result;
                                        }
                                    })
                                }else if(i===5){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.May = month.check_result;
                                        }
                                    })
                                }else if(i===6){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Jun = month.check_result;
                                        }
                                    })
                                }else if(i===7){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.July = month.check_result;
                                        }
                                    })
                                }else if(i===8){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Aug = month.check_result;
                                        }
                                    })
                                }else if(i===9){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Sept = month.check_result;
                                        }
                                    })
                                }else if(i===10){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Oct = month.check_result;
                                        }
                                    })
                                }else if(i===11){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Nov = month.check_result;
                                        }
                                    })
                                }else if(i===12){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Dec = month.check_result;
                                        }
                                    })
                                }
                            }
                            datas.push(data);
                            this.setState({dataSourceY:datas});
                        }else{
                            let data = {};
                            data.id = item.id;
                            data.principal = item.responsor.name;
                            for(let i=1;i<13;i++){
                                if(i===1){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Jan = month.check_result;
                                        }
                                    })
                                }else if(i===2){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Feb = month.check_result;
                                        }
                                    })
                                }else if(i===3){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Mar = month.check_result;
                                        }
                                    })
                                }else if(i===4){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Apr = month.check_result;
                                        }
                                    })
                                }else if(i===5){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.May = month.check_result;
                                        }
                                    })
                                }else if(i===6){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Jun = month.check_result;
                                        }
                                    })
                                }else if(i===7){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.July = month.check_result;
                                        }
                                    })
                                }else if(i===8){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Aug = month.check_result;
                                        }
                                    })
                                }else if(i===9){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Sept = month.check_result;
                                        }
                                    })
                                }else if(i===10){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Oct = month.check_result;
                                        }
                                    })
                                }else if(i===11){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Nov = month.check_result;
                                        }
                                    })
                                }else if(i===12){
                                    item.monthcheck.map(month=>{
                                        if(month.check_month===i){   //has current month data
                                            data.Dec = month.check_result;
                                        }
                                    })
                                }
                            }
                            datas.push(data);
                            this.setState({dataSourceY:datas});
                        }
                    });
                }else{
                    this.setState({dataSourceY:[]});
                }
            });
        }else{
            return;
        }
    }

    render() {
        const { 
            form: {getFieldDecorator}, 
        } = this.props;
        //月表格
        const columns = [{
            title: '序号',
            dataIndex: 'index',
            //width: '5%',
            render:(text,record,index) => {
                return <div>{index+1}</div>
            }
        },{
            title:'姓名',
            dataIndex:'name',
            //width:'15%'
        }, {
            title:'职务',
            dataIndex:'duties',
            //width:'15%'
        },{
            title:'考核结果',
            children:[{
                title:'合格',
                dataIndex:'qualified',
                // width:'10%'
                render:(text,record,index)=>{
                    if(record.result===1){
                        return <p>√</p>
                    }
                }
            },{
                title:'不合格',
                dataIndex:'unqualified',
                // width:'10%'
                render:(text,record,index)=>{
                    if(record.result===0){
                        return <p>√</p>
                    }
                }
            }],
        },{
            title:'考核负责人',
            dataIndex:'examiner',
            //width:'15%'
        },{
            title:'备注',
            dataIndex:'remark',
            //width:'15%'
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            //width: '10%',
            render: (text, record, index) => (
                <span>
                    <a onClick={() => this.editClick(record,index)}>编辑</a>
                </span>
            ),
        }]
        //目标分解年表格
        const columnsY = [{
            title: '序号',
            dataIndex: 'index',
            //width: '5%',
            render:(text,record,index) => {
                return <div>{index+1}</div>
            }
        }, {
            title:'被考核班组、部门负责人',
            dataIndex:'principal',
            //width:'15%'
        },{
            title:'考核结果',
            children:[{
                title:'一月',
                dataIndex:'Jan',
                render: (text, record, index) => {
                    if(text===0){
                        return <p>不合格</p>
                    }else if(text===1){
                        return <p>合格</p>
                    }
                }
            },{
                title:'二月',
                dataIndex:'Feb',
                render: (text, record, index) => {
                    if(text===0){
                        return <p>不合格</p>
                    }else if(text===1){
                        return <p>合格</p>
                    }
                }
            },{
                title:'三月',
                dataIndex:'Mar',
                render: (text, record, index) => {
                    if(text===0){
                        return <p>不合格</p>
                    }else if(text===1){
                        return <p>合格</p>
                    }
                }
            },{
                title:'四月',
                dataIndex:'Apr',
                render: (text, record, index) => {
                    if(text===0){
                        return <p>不合格</p>
                    }else if(text===1){
                        return <p>合格</p>
                    }
                }
            },{
                title:'五月',
                dataIndex:'May',
                render: (text, record, index) => {
                    if(text===0){
                        return <p>不合格</p>
                    }else if(text===1){
                        return <p>合格</p>
                    }
                }
            },{
                title:'六月',
                dataIndex:'Jun',
                render: (text, record, index) => {
                    if(text===0){
                        return <p>不合格</p>
                    }else if(text===1){
                        return <p>合格</p>
                    }
                }
            },{
                title:'七月',
                dataIndex:'July',
                render: (text, record, index) => {
                    if(text===0){
                        return <p>不合格</p>
                    }else if(text===1){
                        return <p>合格</p>
                    }
                }
            },{
                title:'八月',
                dataIndex:'Aug',
                render: (text, record, index) => {
                    if(text===0){
                        return <p>不合格</p>
                    }else if(text===1){
                        return <p>合格</p>
                    }
                }
            },{
                title:'九月',
                dataIndex:'Sept',
                render: (text, record, index) => {
                    if(text===0){
                        return <p>不合格</p>
                    }else if(text===1){
                        return <p>合格</p>
                    }
                }
            },{
                title:'十月',
                dataIndex:'Oct',
                render: (text, record, index) => {
                    if(text===0){
                        return <p>不合格</p>
                    }else if(text===1){
                        return <p>合格</p>
                    }
                }
            },{
                title:'十一月',
                dataIndex:'Nov',
                render: (text, record, index) => {
                    if(text===0){
                        return <p>不合格</p>
                    }else if(text===1){
                        return <p>合格</p>
                    }
                }
            },{
                title:'十二月',
                dataIndex:'Dec',
                render: (text, record, index) => {
                    if(text===0){
                        return <p>不合格</p>
                    }else if(text===1){
                        return <p>合格</p>
                    }
                }
            }],
        },{
            title:'总评',
            dataIndex:'comment',
            render: (text, record, index) => {
                if(text===0){
                    return <p>不合格</p>
                }else if(text===1){
                    return <p>合格</p>
                }
            }
        },{
            title:'备注',
            dataIndex:'remark',
            //width:'15%'
        },{
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            //width: '10%',
            render: (text, record, index) => (
                <span>
                    <a onClick={() => this.addClick(record,index)}>编辑</a>
                </span>
            ),
        }]

        let types = this.state.type;
        debugger
        let col = types === 'm' ? columns : columnsY ;
        let dataS = types === 'm' ? this.state.dataSource : this.state.dataSourceY ;
        return (
            <div>
                <Card>
                    <Row>
                        <RadioGroup onChange={this.onChange.bind(this)} defaultValue="m">
                            <RadioButton value="y">年</RadioButton>
                            <RadioButton value="m">月</RadioButton>
                        </RadioGroup>
                        <Cascader style={{marginLeft:'20px',width:'115px'}} 
                            defaultValue={['2017', '10']}
                            options={this.state.options} 
                            onChange={this.onChange2.bind(this)} 
                            changeOnSelect />
                    </Row>
                    <Table style={{ marginTop: '10px' }}
                        columns={col}
                        dataSource={dataS}
                        bordered />
                </Card>
                <Modal 
                    title="编辑年安全责任制考核"
                    width={760}
                    maskClosable={false}
                    key={this.state.newKey} 
                    visible={this.state.setVisible}
                    onOk={this.setAddData.bind(this)}
                    onCancel={this.goCancel.bind(this)}
                    >
                    <AddCheck props={this.props} state={this.state} />
                </Modal>
                <Modal 
                    title="编辑月安全责任制考核"
                    width={760}
                    maskClosable={false}
                    key={this.state.newKey1} 
                    visible={this.state.setEditVisible}
                    onOk={this.setEditData.bind(this)}
                    onCancel={this.goCancel.bind(this)}
                    >
                    <EditCheck props={this.props} state={this.state} />
                </Modal>
                
            </div>
        )
    }
}

export default Form.create()(ResponsibilityCheck);