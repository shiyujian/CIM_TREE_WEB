import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleAside } from '_platform/store/global/aside';
import Scrollbar from 'smooth-scrollbar';

@connect(
    state => {
        const { aside } = state;
        return { aside };
    },
    dispatch => ({
        actions: bindActionCreators({ toggleAside }, dispatch)
    })
)
export default class Sidebar extends Component {
    constructor (props) {
        super(props);
        this.state = { minHeight: 10 };
    }

    static propTypes = {};

    componentWillMount () {
        const width = window.innerWidth;
        const height = window.innerHeight;
        let minHeight = height - 188;
        if (width > 1200) {
            minHeight = height - 170;
        }
        this.setState({ minHeight });
    }

    componentDidMount = async () => {
        if (document.querySelector('#SideBarAsideDom')) {
            let SideBarAsideDom = Scrollbar.init(document.querySelector('#SideBarAsideDom'));
            console.log('SideBarAsideDom', SideBarAsideDom);
        }
    }

    render () {
        const width = this.props.width;
        return (
            <div
                style={{
                    float: 'left',
                    width: width || 220,
                    position: 'relative',
                    minHeight: this.state.minHeight
                }}
                id='SideBarAsideDom'
            >
                <div
                    style={{
                        width: '100%',
                        height: 'calc(100vh - 170px)',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        backgroundColor: '#f5f5f5'
                    }}
                />
                <div
                    style={{
                        width: 220,
                        // overflowX: 'hidden',
                        zIndex: '1',
                        position: 'relative',
                        padding: '20px 10px',
                        maxHeight: document.documentElement.clientHeight - 40 - 80 - 40
                    }}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }
}
