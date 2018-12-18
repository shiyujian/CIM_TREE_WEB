import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as platformActions } from '_platform/store/global';
import { actions } from '../store/projectImage';
import {ProjectImageGis} from '../components/ProjectImage';

@connect(
    state => {
        const { project: { projectImage = {} } = {}, platform } = state;
        return { ...projectImage, platform };
    },
    dispatch => ({
        actions: bindActionCreators(
            {
                ...actions,
                ...platformActions
            },
            dispatch
        )
    })
)
export default class ProjectImage extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount () {
        console.log('ssssss');
    }

    render () {
        return (
            <div>
                <ProjectImageGis {...this.props} {...this.state} />
            </div>
        );
    }
}
