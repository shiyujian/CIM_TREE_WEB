import React, {Component} from 'react';

export default class DocView extends Component{
    constructor(props) {
		super(props);
		this.state = {
			visible: false,
			container: null,
		}
    }
    
    render(){

        return (
            // TODO:此处需要展示文档预览
            <p>XXXX事项展示<br/>
                事项正文<br/>
                附件：<br/>
                接收自：<br/>
                抄送至：<br/>

                XXXXX机构<br/>
                XXXX年XX月XX日<br/>
            </p>);

    }

}