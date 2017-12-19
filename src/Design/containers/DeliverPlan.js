/**
 * Created by tinybear on 17/8/7.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as platformActions} from '_platform/store/global';
import {actions as planActions} from '../store/plan';
import {actions as userActions} from '../store/userSelect';
import {DynamicTitle} from '_platform/components/layout';
import DeliverPlanPanel from '../components/DeliverPlanPanel';
import CreatePlanPanel from '../components/CreatePlan';
import PlanList from '../components/PlanList';

@connect(
    state => {
        const {platform,overall:{plan={}}} = state;
        return {platform,plan};
    },
    dispatch => ({
        actions: bindActionCreators({...platformActions,...planActions,
            ...userActions}, dispatch),
    }),
)
class DeliverPlan extends Component{

    state={
        selectedTab:1,
        title:'交付计划'
    };

    componentWillMount() {
        const {match} = this.props;
        let items = match.path.split('/');
        let id = items[items.length-1];
        let title = this.getTitle(id);
        this.setState({selectedTab:id,title});
    }

    genTab(selectedTab){
        switch (selectedTab){
            case '1':
                return (<DeliverPlanPanel {...this.props}></DeliverPlanPanel>)
                break;
            case '2':
                return (<CreatePlanPanel {...this.props}></CreatePlanPanel>)
                break;
            case '3':
                return (
                    <div>
                        <PlanList {...this.props} role={1}></PlanList>
                    </div>
                )
                break;
            case '4':
                return (
                    <div>
                        <PlanList {...this.props} role={2}></PlanList>
                    </div>
                )
                break;
            case '5':
                return (
                    <div>
                        <PlanList {...this.props} role={3}></PlanList>
                    </div>
                )
                break;
            case '6':
                return (
                    <div>
                        <PlanList {...this.props} role={4}></PlanList>
                    </div>);
                break;
        }
    }

    getTitle(id){
        switch (id){
            case '1':
                return "交付计划";
                break;
            case '2':
                return "发起计划";
                break;
            case '3':
                return "填报计划";
                break;
            case '4':
                return "审查计划";
                break;
            case '5':
                return "计划变更";
                break;
            case '6':
                return "审查计划变更";
                break;
        }
    }

    render(){
        const {selectedTab,title} = this.state;
        return (<div>
            <DynamicTitle title={title} {...this.props}/>
            <div style={{marginLeft:'160px'}}>
                {
                    this.genTab(selectedTab)
                }
            </div>
        </div>)
    }
}

export default DeliverPlan;
