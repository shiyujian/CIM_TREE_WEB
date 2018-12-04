import React, { Component } from 'react';

export default class SumTotal extends Component {
    render () {
        const { search = '', title = '', title1 = '', children, children1 } = this.props;
        return (
            <div style={{ width: '190px', height: '107px', margin: '0 auto', boxShadow: ' 0 -2px 3px rgba(0, 0, 0, .1)', padding: '5px', float: 'left' }}>
                <div style={{ width: '35px', margin: '5px 5px 0 0', float: 'left' }}>
                    {search}
                </div>
                <div style={{ fontSize: '16px', float: 'left' }}>
                    <div>{title}</div>
                    <div style={{ fontSize: '14px' }}>{title1}</div>
                </div>
                <div style={{ fontSize: '28px', margin: '60px 0 0 40px' }}>
                    {children}
                </div>
            </div>
        );
    }
}
