import React, {Component} from 'react';

import {Card, Form, Calendar,Col,Button,Row,Select,Modal} from 'antd';
import AddScheduler from './CheckPlan';
import {UPLOAD_API} from '_platform/api';
const FormItem = Form.Item;
const {Option} = Select

class CheckPlan extends Component {

	constructor(props) {
		super(props);
		this.state = {
            setAddVisiable:false,
            datas:[],//the data belong to scheduler
            checkContentVisivle:false,//新建表格
		};
	}
    dateCellRender(value) {
        const listData = this.getListData(value);
        return (
          <ul className="events">
            {
              listData.map(item => (
                <li key={item.content}>
                  <span className={`event-${item.type}`}>●</span>
                  {item.content}
                </li>
              ))
            }
          </ul>
        );
      }
      getMonthData(value) {
        if (value.month() === 8) {
          return 1394;
        }
      }
      getListData(value) {
        let listData = [];
        const {datas} = this.state;
        for(let i=0;i<datas.length;i++){
          if(value.format('YYYY-MM-DD') === datas[i].date){
              listData.push({type:'normal',content:datas[i].projectname});
          }
        }
        if(listData.length>0){
          return listData;
        }
        switch (value.format("YYYY-MM-DD")) {
          case '2017-10-10':
            listData = [
              { type: 'warning', content: '10点进行进度填报.' },
              { type: 'normal', content: '开一个半小时的短会.' }
            ]; break;
          case '2017-10-20':
            listData = [
              { type: 'warning', content: '今天出差到北京' },
              { type: 'normal', content: '到了北京吃烤鸭.' },
              { type: 'error', content: '吃完烤鸭睡一觉.' }
            ]; break;
          case '2017-10-25':
            listData = [
              { type: 'warning', content: '今天从北京回杭州' },
              { type: 'normal', content: '做经验交流总结。' }
            ]; break;
          default:
        }
        return listData || [];
      }
      monthCellRender(value) {
        const num = this.getMonthData(value);
        return num ? <div className="notes-month">
          <section>{num}</section>
          <span>Backlog number</span>
        </div> : null;
      }

      onEditClick = () => {
        this.setState({newKey3:Math.random(),setAddVisiable:true});
    }
    setData(){

    }
	render() {
		return (
            <div>
               <Row>
                    <Col span={23}>
                        <Card>
                        <Calendar 
                            dateCellRender={(value)=>this.dateCellRender(value)} 
                            monthCellRender={(value)=>this.monthCellRender(value)}
                            />
                        </Card>
                    </Col>
                    <Col span={1}>
                        <Button 
                        style={{float:'right',paddingLeft:5}} 
                        type="primary"
                        onClick={()=>this.onEditClick()}>新增</Button>
                    </Col>
                    </Row>
                    <Modal
                        title="新建日程"
                        key={this.state.newKey3}
                        visible={this.state.setAddVisiable}
                        onOk={()=>this.setData("scheduler")}
                        maskClosable={false}
                        onCancel={()=>this.setState({setAddVisiable:false})}>
                        <AddScheduler props={this.props} state={this.state} />
                    </Modal>
            </div>
		)
	}
}
export default Form.create()(CheckPlan)