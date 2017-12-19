import React, { Component } from 'react';
import { Table, Tabs, Button, Row, Col, message, Modal, Popconfirm, 
    notification,Card, Select, Form, Radio, Cascader } from 'antd';
import moment from 'moment';
import { getUser } from '../../../_platform/auth';
import AddCheck from './AddCheck';
import EditCheck from './EditCheck';
import { STATIC_DOWNLOAD_API } from '../../../_platform/api';

const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class GoalCheck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataValue:[],
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

    addClick = () => {
        this.setState({
            setVisible: true,
            newKey: Math.random(),
        });
    }

    editClick = (record, index) => {  //月份
        this.setState({
            setVisible: true,
            newKey: Math.random()*5,
            record: record,
        });
    }

    editClick2 = (record, index) => {   //年
        this.setState({
            setEditVisible: true,
            newKey1: Math.random()*5,
            record: record,
        });
    }

    setEditData(){    //编辑月份的考核
        const {
            actions: {
                postMonthSafetyGoal,
                patchMonthSafetyGoal,
                getPersonSafetyGoal,
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
                    goalone:values.target,
                    goaltwo:values.wounded,
                    goalthree:values.standard,
                    goalfour:values.civilizationConstruction,
                    check_result:values.assessmentResults,
                    check_person:{
                        name:values.assessment
                    },
                    remark:values.remark,
                }
                if(record.mid){
                    patchMonthSafetyGoal({pk:record.mid},postData).then(rst=>{
                        if(rst.id){
                            notification.info({
                                message: '编辑月考核成功',
                                duration: 2
                            });
                            let datas = [];
                            getPersonSafetyGoal({},{project_unit_pk:unitProject.pk,year:dataValue[0],month:dataValue[1]}).then((rst=>{
                                if(rst.length!==0){
                                    rst.map(item=>{
                                        if(item.monthcheck.length!==0){
                                            let data = {};
                                            data.id = item.id;
                                            data.mid = item.monthcheck[0].id;
                                            data.principal = item.responsor.name;
                                            data.target = item.monthcheck[0].goalone;
                                            data.wounded = item.monthcheck[0].goaltwo;
                                            data.standard = item.monthcheck[0].goalthree;
                                            data.civilization = item.monthcheck[0].goalfour;
                                            data.assessmentResults = item.monthcheck[0].check_result;
                                            data.assessment = item.monthcheck[0].check_person.name;
                                            datas.push(data);
                                        }else{
                                            let data = {};
                                            data.id = item.id;
                                            data.principal = item.responsor.name;
                                            datas.push(data);
                                        }
                                    });
                                    this.setState({dataSource:datas,setVisible:false});
                                }
                            }));
                        }else{
                            notification.info({
                                message: '编辑月考核失败',
                                duration: 2
                            });
                            this.setState({setVisible:false});
                        }
                    });
                }else{
                    postMonthSafetyGoal({pk:record.id},postData).then(rst=>{
                        if(rst.id){
                            notification.info({
                                message: '编辑月考核成功',
                                duration: 2
                            });
                            let datas = [];
                            getPersonSafetyGoal({},{project_unit_pk:unitProject.pk,year:dataValue[0],month:dataValue[1]}).then((rst=>{
                                if(rst.length!==0){
                                    rst.map(item=>{
                                        if(item.monthcheck.length!==0){
                                            let data = {};
                                            data.id = item.id;
                                            data.mid = item.monthcheck[0].id;
                                            data.principal = item.responsor.name;
                                            data.target = item.monthcheck[0].goalone;
                                            data.wounded = item.monthcheck[0].goaltwo;
                                            data.standard = item.monthcheck[0].goalthree;
                                            data.civilizationConstruction = item.monthcheck[0].goalfour;
                                            data.assessmentResults = item.monthcheck[0].check_result;
                                            data.assessment = item.monthcheck[0].check_person.name;
                                            datas.push(data);
                                        }else{
                                            let data = {};
                                            data.id = item.id;
                                            data.principal = item.responsor.name;
                                            datas.push(data);
                                        }
                                    });
                                    this.setState({dataSource:datas,setVisible:false});
                                }
                            }));
                        }else{
                            notification.info({
                                message: '编辑月考核失败',
                                duration: 2
                            });
                            this.setState({setVisible:false});
                        }
                    })
                }
            }
        }); 
    }

    setAddData(){    //编辑年的考核
        const {
            actions: {
                postYearSafetyGoal,
                patchYearSafetyGoal,
                getPersonSafetyGoal,
            },
            unitProject,
            project
        } = this.props;
        const {dataValue,record} = this.state;
        this.props.form.validateFields((err,values) => {
            if(!err){
                let postData = {
                    check_year:dataValue[0],
                    check_result:values.comment,
                    remark:values.remark,
                }
                if(record.yid){
                    patchYearSafetyGoal({pk:record.yid},postData).then(rst=>{
                        if(rst.id){
                            notification.info({
                                message: '编辑年考核成功',
                                duration: 2
                            });
                            let datas = [];
                            getPersonSafetyGoal({},{project_unit_pk:unitProject.pk,year:dataValue[0]}).then(rst=>{
                                if(rst.length!==0){
                                    rst.map(item=>{
                                        if(item.yearcheck.length!==0){
                                            let data = {};
                                            data.id = item.id;
                                            data.yid = item.yearcheck[0].id;
                                            data.principal = item.responsor.name;
                                            data.comment = item.yearcheck[0].check_result;
                                            data.remark = item.yearcheck[0].remark;
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
                                            this.setState({dataSourceY:datas,setEditVisible:false});
                                        }
                                    });
                                }else{
                                    this.setState({dataSourceY:[],setEditVisible:false});
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
                   postYearSafetyGoal({pk:record.id},postData).then(rst=>{
                       if(rst.id){
                            notification.info({
                                message: '编辑年考核成功',
                                duration: 2
                            });
                            let datas = [];
                            getPersonSafetyGoal({},{project_unit_pk:unitProject.pk,year:dataValue[0]}).then(rst=>{
                                if(rst.length!==0){
                                    rst.map(item=>{
                                        if(item.yearcheck.length!==0){
                                            let data = {};
                                            data.id = item.id;
                                            data.yid = item.yearcheck[0].id;
                                            data.principal = item.responsor.name;
                                            data.comment = item.yearcheck[0].check_result;
                                            data.remark = item.yearcheck[0].remark;
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
                                            this.setState({dataSourceY:datas,setEditVisible:false});
                                        }
                                    });
                                }else{
                                    this.setState({dataSourceY:datas,setEditVisible:false});
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
        console.log(`radio checked:${e.target.value}`);
        debugger
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
                getPersonSafetyGoal,
            },
            unitProject,
            project
        } = this.props;
        debugger
        const {type} = this.state;
        let datas = [];
        this.setState({dataValue:value});
        if(value.length===2&&type==='m'){
            getPersonSafetyGoal({},{project_unit_pk:unitProject.pk,year:value[0],month:value[1]}).then((rst=>{
                if(rst.length!==0){
                    rst.map(item=>{
                        if(item.monthcheck.length!==0){
                            let data = {};
                            data.id = item.id;
                            data.mid = item.monthcheck[0].id;
                            data.principal = item.responsor.name;
                            data.target = item.monthcheck[0].goalone;
                            data.wounded = item.monthcheck[0].goaltwo;
                            data.standard = item.monthcheck[0].goalthree;
                            data.civilizationConstruction = item.monthcheck[0].goalfour;
                            data.assessmentResults = item.monthcheck[0].check_result;
                            data.assessment = item.monthcheck[0].check_person.name;
                            datas.push(data);
                        }else{
                            let data = {};
                            data.id = item.id;
                            data.principal = item.responsor.name;
                            datas.push(data);
                        }
                    });
                    this.setState({dataSource:datas});
                }
            }));
        }else if(value.length===1&&type==='y'){
            getPersonSafetyGoal({},{project_unit_pk:unitProject.pk,year:value[0]}).then(rst=>{
                if(rst.length!==0){
                    rst.map(item=>{
                        if(item.yearcheck.length!==0){
                            let data = {};
                            data.id = item.id;
                            data.yid = item.yearcheck[0].id;
                            data.principal = item.responsor.name;
                            data.comment = item.yearcheck[0].check_result;
                            data.remark = item.yearcheck[0].remark;
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
            width: '5%',
            render:(text,record,index) => {
                return <div>{index+1}</div>
            }
        }, {
            title:'被考核班组、部门负责人',
            dataIndex:'principal',
            width:'15%'
        },{
            title:'伤亡控制指标',
            children:[{
                title:'“五无”目标',
                dataIndex:'target',
                render: (text, record, index) => {
                    if(text===false){
                        return <p>不合格</p>
                    }else if(text===true){
                        return <p>合格</p>
                    }
                }
            },{
                title:'轻伤年负伤≤11%',
                dataIndex:'wounded',
                render: (text, record, index) => {
                    if(text===false){
                        return <p>不合格</p>
                    }else if(text===true){
                        return <p>合格</p>
                    }
                }
            }],
        },{
            title:'安全达标',
            dataIndex:'standard',
            width:'15%',
            render: (text, record, index) => {
                if(text===0){
                    return <p>不合格</p>
                }else if(text===1){
                    return <p>合格</p>
                }else if(text===2){
                    return <p>优良</p>
                }
            }
        },{
            title:'文明施工目标',
            dataIndex:'civilizationConstruction',
            width:'15%',
            render: (text, record, index) => {
                if(text===0){
                    return <p>不合格</p>
                }else if(text===1){
                    return <p>合格</p>
                }else if(text===2){
                    return <p>优良</p>
                }
            }
        },{
            title:'考核结果',
            dataIndex:'assessmentResults',
            render: (text, record, index) => {
                if(text===0){
                    return <p>不合格</p>
                }else if(text===1){
                    return <p>合格</p>
                }else if(text===2){
                    return <p>优良</p>
                }
            }
        },{
            title:'考核人',
            dataIndex:'assessment',
            width:'15%'
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: '10%',
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
                    }else if(text===2){
                        return <p>优良</p>
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
                    }else if(text===2){
                        return <p>优良</p>
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
                    }else if(text===2){
                        return <p>优良</p>
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
                    }else if(text===2){
                        return <p>优良</p>
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
                    }else if(text===2){
                        return <p>优良</p>
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
                    }else if(text===2){
                        return <p>优良</p>
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
                    }else if(text===2){
                        return <p>优良</p>
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
                    }else if(text===2){
                        return <p>优良</p>
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
                    }else if(text===2){
                        return <p>优良</p>
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
                    }else if(text===2){
                        return <p>优良</p>
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
                    }else if(text===2){
                        return <p>优良</p>
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
                    }else if(text===2){
                        return <p>优良</p>
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
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: '10%',
            render: (text, record, index) => (
                <span>
                    <a onClick={() => this.editClick2(record,index)}>编辑</a>
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
                        <Cascader 
                         style={{marginLeft:'20px',width:'115px'}} 
                         defaultValue={['2017', '10']}
                         options={this.state.options} 
                         onChange={this.onChange2.bind(this)} 
                         changeOnSelect />
                    </Row>
                    <Table 
                     style={{ marginTop: '10px' }}
                     columns={col}
                     dataSource={dataS}
                     bordered />
                </Card>
                <Modal 
                 title="编辑目标考核表（月）"
                 width={760}
                 maskClosable={false}
                 key={this.state.newKey} 
                 visible={this.state.setVisible}
                 onOk={this.setEditData.bind(this)}
                 onCancel={this.goCancel.bind(this)}
                 >
                    <EditCheck props={this.props} state={this.state} />
                </Modal>
                <Modal 
                 title="编辑目标考核表（年）"
                 width={760}
                 maskClosable={false}
                 key={this.state.newKey1} 
                 visible={this.state.setEditVisible}
                 onOk={this.setAddData.bind(this)}
                 onCancel={this.goCancel.bind(this)}
                 >
                    <AddCheck props={this.props} state={this.state} />
                </Modal>
            </div>
        )
    }
}

export default Form.create()(GoalCheck);