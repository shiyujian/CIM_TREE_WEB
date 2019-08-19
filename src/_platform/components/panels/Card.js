import React, {Component} from 'react';

export default class Card extends Component {
    render () {
        const {title = '', extra = '', children = ''} = this.props;
        return (
            <div className='qh-card'>
                <div style={{height: 35, paddingBottom: 5, borderBottom: 'solid 1px #e9e9e9', marginBottom: 10}}>
                    <span style={{display: 'inline-block', fontSize: 16}}>{title}</span>
                    <span style={{float: 'right'}}>{extra}</span>
                </div>
                <div>
                    {children}
                </div>
            </div>
        );
    }
}
