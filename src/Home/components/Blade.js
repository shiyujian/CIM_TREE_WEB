import React, {Component} from 'react';
import './Blade.less';

export default class Blade extends Component {
    render () {
        const {title = '', children} = this.props;
        return (
            <div className={this.props.extClass ? 'blade2' : 'blade'}>
                <div className='title'>
                    {title}
                    <span className='extra' />
                </div>
                <div className='content'>
                    {children}
                </div>
            </div>
        );
    }
}
