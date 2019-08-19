import React, { Component } from 'react';
import { Select } from 'antd';
import { getUser } from '_platform/auth';
export const CuringDocCode = window.DeathCode.CURING_TEAM;
const Option = Select.Option;

export default class PersonTree extends Component {
    constructor (props) {
        super(props);
        this.state = {
            UserOptions: [],
            users: [],
            docList: [],
            optionArr: []
        };
    }

    async componentDidMount () {
        const {
            actions: { getCuringGroup }
        } = this.props;
        let user = getUser();
        let section = user.section;
        if (!section) {
            return;
        }
        let taskTeams = await getCuringGroup({}, {section: section});
        console.log('taskTeams', taskTeams);
        if (taskTeams && taskTeams instanceof Array && taskTeams.length > 0) {
            let optionArr = taskTeams.map((team) => {
                return <Option key={team.ID} value={team.ID} title={team.GroupName}>{team.GroupName}</Option>;
            });
            console.log('optionArr', optionArr);
            this.setState({
                optionArr
            });
        }
    };

    render () {
        const {
            optionArr
        } = this.state;
        return (
            <Select
                style={{ width: '100%' }}
                showSearch
                // allowClear
                optionFilterProp='children'
                filterOption={(input, option) =>
                    option.props.children
                        .toLowerCase()
                        .indexOf(
                            input.toLowerCase()
                        ) >= 0
                }
                onSelect={this._handleSelectPer.bind(this)}
            >
                {optionArr}
            </Select>
        );
    }

    _handleSelectPer (value) {
        this.props.onSelect(value);
    }
}
