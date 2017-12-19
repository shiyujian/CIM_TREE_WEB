/**
 * Created by tinybear on 17/8/7.
 */
import  React,{Component} from 'react';
import {Select,Spin} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../../store/global/user';
const {Option} = Select;


@connect(
    state => {
        return {};
    },
    dispatch => ({
        actions: bindActionCreators({...actions}, dispatch),
    }),
)
class UserSelect extends Component{

    constructor(props){
        super(props);
        this.state = {
            fetching:false,
            data:[],
            value:[],
            users:[]
        }
        this.lastFetchId = 0;
    }

    handleChange = (value) => {
        let user = this.state.users.find(v=>{
            return v.id == value;
        });
        this.setState({
            value:user?
                user.account.person_name+ ' '+ user.account.organization :
                value ,
            data: [],
            fetching: false,
        });

        const {onChange} = this.props;
        if(user) {
            onChange(user);
        }
    }

    fetchUser = (value) => {
        const {getUserByKeyword} = this.props.actions;
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ fetching: true });
        getUserByKeyword({keyword:encodeURI(value)})
        .then((body)=>{
                if (fetchId !== this.lastFetchId) { // for fetch callback order
                    return;
                }
                const data = body.map(user => ({
                    text: user.account.person_name +' '+ user.account.organization,
                    value: user.id,
                    fetching: false,
                }));
                this.setState({ data ,users:body });
            });
    };

    render(){
        const {placeholder="选择用户",width='100%'} = this.props;
        return (
            <Select
                mode="combobox"
                value={this.state.value}
                placeholder={placeholder}
                notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onChange={this.handleChange}
                onSearch={this.fetchUser}
                style={{width:width,display:'inline-block'}}
                allowClear={true}
            >
                {this.state.data.map(d => <Option key={d.value}>{d.text}</Option>)}
            </Select>
        )
    }
}

export  default UserSelect;

