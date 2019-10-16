import React, { Component } from 'react';
import TaskStatisGis from './TaskStatisGis';
import TaskStatisTable from './TaskStatisTable';
import '../Conservation.less';

export default class TaskStatisPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount () {
        const {
            actions: {
                changeTaskStatisGisVisible,
                changeTaskStatisSelectTask
            }
        } = this.props;
        changeTaskStatisGisVisible(false);
        changeTaskStatisSelectTask();
    }

    render () {
        const {
            taskStatisGisVisible
        } = this.props;
        return (
            <div >
                <TaskStatisTable
                    {...this.props}
                    {...this.state}
                />
                {
                    taskStatisGisVisible
                        ? (<TaskStatisGis
                            {...this.props}
                            {...this.state}
                        />)
                        : ''
                }
            </div>);
    }
}
