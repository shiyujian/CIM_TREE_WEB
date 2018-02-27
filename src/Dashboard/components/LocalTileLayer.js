

function pad(num, n) {
	var i = (num + "").length;
	while(i++ < n) num = "0" + num;
	return num;
}

var LocalTileLayer =  L.TileLayer.extend({
    getTileUrl: function (coords) {

        let lZoom = this._getZoomForUrl();
        if (this.options.tiletype && this.options.tiletype == "arcgis") {
            var x = coords.x.toString(16);
            var y = coords.y.toString(16);
            x = "C" + pad(x,8);
            y = "R" + pad(y,8);
            return this._url + "/" + (lZoom - 1) + "/" + y + "/" + x + ".png";
        }

        var data = {
			r: retina ? '@2x' : '',
			s: this._getSubdomain(coords),
			x: coords.x,
			y: coords.y,
			z: this._getZoomForUrl()
		};
		if (this._map && !this._map.options.crs.infinite) {
			var invertedY = this._globalTileRange.max.y - coords.y;
			if (this.options.tms) {
				data['y'] = invertedY;
			}
			data['-y'] = invertedY;
		}

		return template(this._url, extend(data, this.options));
	},
});

function localTileLayer(url, options) {
	return new LocalTileLayer(url, options);
}

exports.localTileLayer = localTileLayer;
