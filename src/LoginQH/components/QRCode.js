import PropTypes from 'prop-types';
import QRCodeImpl  from 'qr.js/lib/QRCode';
import ErrorCorrectLevel  from 'qr.js/lib/ErrorCorrectLevel';
import React, {Component} from 'react';
import './index.css';

function getBackingStorePixelRatio(ctx: CanvasRenderingContext2D): number {
	return (
		// $FlowFixMe
		ctx.webkitBackingStorePixelRatio ||
		// $FlowFixMe
		ctx.mozBackingStorePixelRatio ||
		// $FlowFixMe
		ctx.msBackingStorePixelRatio ||
		// $FlowFixMe
		ctx.oBackingStorePixelRatio ||
		// $FlowFixMe
		ctx.backingStorePixelRatio ||
		1
	);
}
  
type Props = {
	value: string,
	size: number,
	level: $Keys<typeof ErrorCorrectLevel>,
	bgColor: string,
	fgColor: string
};

export default class QRCode extends React.Component {
    props: Props;
	_canvas: ?HTMLCanvasElement;
    
    componentDidMount() {
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }

    update() {
		var {value} = this.props;
		let size = 150;
		let level = 'H';
		let bgColor = "#FFFFFF";
		let fgColor = "#000000";
		// We'll use type===-1 to force QRCode to automatically pick the best type
		var qrcode = new QRCodeImpl(-1, ErrorCorrectLevel[level]);
		qrcode.addData(value);
		qrcode.make();
	
		if (this._canvas != null) {
		  	var canvas = this._canvas;
	
		  	var ctx = canvas.getContext('2d');
		  	if (!ctx) {
				return;
		  	}	
		  	var cells = qrcode.modules;
		  	if (cells === null) {
				return;
		  	}
			var tileW = size / cells.length;
			var tileH = size / cells.length;
			var scale = (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx);
			canvas.height = canvas.width = size * scale;
			ctx.scale(scale, scale);
	
		  	cells.forEach(function(row, rdx) {
				row.forEach(function(cell, cdx) {
					ctx && (ctx.fillStyle = cell ? fgColor : bgColor);
					var w = Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW);
					var h = Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH);
					ctx && ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
				});
		  	});
		}
	}

    render() {
        console.log('value',this.props.value)
        return (
				<canvas
				 style={{height: this.props.size, width: this.props.size , marginTop:'10'}}
				 height={this.props.size}
				 width={this.props.size}
				 ref={(ref: ?HTMLCanvasElement): ?HTMLCanvasElement => this._canvas = ref}
				/>
			
			
        );
    }
}