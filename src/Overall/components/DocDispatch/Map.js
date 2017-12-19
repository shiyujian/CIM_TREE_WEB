import React, {Component} from 'react';
import {Button} from 'antd';
import './Map.less'
export default class Map extends Component {
	constructor(props) {
		super(props);
	}

	render() {

		return (
			<div className='flow-tree'>
				<div className='flow-one-line' style={{height:"60px"}}>
					<div className="box-left first-box">工可研</div>
					<div className="box-right first-box">
						<div>
							<Button>1、立项</Button>
						</div>
					</div>
				</div>
				<div className='flow-one-line' style={{height:"120px"}}>
					<div className="box-left second-box" style={{lineHeight:"120px"}}>方案设计</div>
					<div className="box-right second-box">
						<div style={{marginTop:"10px"}}>
							<Button>2、方案设计核查+3-1、选址意见书</Button>
						</div>
						<div style={{marginTop:"10px",marginLeft:"40px",position:"relative"}}>
							<Button>3-2、用地预审+5、用地方案图</Button>
							<div className="line-1"></div>
							<div className="line-1-1"></div>
						</div>
						<div style={{marginTop:"10px",marginLeft:"80px",position:"relative"}}>
							<Button>6、用地规划许可+8-1、消防设计第三方审查</Button>
							<div className="line-2"></div>
							<div className="line-2-1"></div>
						</div>
					</div>
				</div>
				<div className='flow-one-line' style={{height:"260px",borderBottom:'none'}}>
					<div className="box-left third-box" style={{lineHeight:"260px"}}>方案设计</div>
					<div className="box-right third-box">
						<div style={{marginTop:"10px",marginLeft:"120px",position:"relative"}}>
							<Button>11-1施工图强审-施工图设计审查合格书</Button>
							<div className="line-3"></div>
						</div>
						<div style={{marginTop:"10px",marginLeft:"160px",overflow:"hidden"}}>
							<div style={{marginTop:"10px",display:"inline-block",float:"left"}}>
								<Button>11-1开工备案</Button>
							</div>
							<div style={{marginTop:"10px",marginLeft:"50px",display:"inline-block",float:"left"}}>
								<Button>10施工图总预算</Button>
							</div>
						</div>
						<div style={{marginTop:"10px",marginLeft:"160px",overflow:"hidden"}}>
							<div style={{marginTop:"10px",display:"inline-block",float:"left",position:"relative"}}>
								<Button>8工程规划许可</Button>
								<div className="line-4-1"></div>
							</div>
							<div style={{marginTop:"10px",marginLeft:"40px",display:"inline-block",float:"left"}}>
								<Button>消防审查</Button>
							</div>
						</div>
						<div style={{marginTop:"10px",marginLeft:"160px",overflow:"hidden"}}>
							<div style={{marginTop:"10px",display:"inline-block",float:"left",position:"relative"}}>
								<Button>环评批复</Button>
								<div className="line-5"></div>
							</div>
						</div>
						<div style={{marginTop:"10px",marginLeft:"312px",position:"relative"}}>
							<Button>11-2施工许可</Button>
							<div className="line-6"></div>
						</div>
					</div>
				</div>
			</div>
		);

	}

}