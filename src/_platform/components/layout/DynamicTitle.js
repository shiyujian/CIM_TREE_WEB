import React, {Component} from 'react';

export default class DynamicTitle extends Component {
    render () {
        return null;
    }

    componentDidMount () {
        const {title, match: {url} = {}, actions: {openTab}, location: {search = ''}} = this.props;
        openTab({title, path: url, search});
    }

    componentWillReceiveProps (nextProps) {
        const {title, match: {url} = {}, actions: {openTab}} = this.props;
        const {title: nextTitle} = nextProps;
        if (title !== nextTitle) {
            // todo update title
        }
    }
}
