/*
 * Inspired by Tom Mac Wright article :
 * http://mapbox.com/osmdev/2012/11/20/getting-serious-about-svg/
 */

var PolylineTextPath = {

    __updatePath: L.Polyline.prototype._updatePath,
    __bringToFront: L.Polyline.prototype.bringToFront,
    __onAdd: L.Polyline.prototype.onAdd,
    __onRemove: L.Polyline.prototype.onRemove,

    onAdd: function (map) {
        this.__onAdd.call(this, map);
        this._textRedraw();
    },

    onRemove: function (map) {
        map = map || this._map;
        if (map && this._textNode)
            map._pathRoot.removeChild(this._textNode);
        this.__onRemove.call(this, map);
    },

    bringToFront: function () {
        this.__bringToFront.call(this);
        this._textRedraw();
    },

    _updatePath: function () {
        this.__updatePath.call(this);
        this._textRedraw();
    },

    _textRedraw: function () {
        var text = this._text,
            options = this._textOptions;
        if (text) {
            this.setText(null).setText(text, options);
        }
    },

    setText: function (text, options) {
        this._text = text;
        this._textOptions = options;

        var defaults = { repeat: false, fillColor: 'black', attributes: {} };
        options = L.Util.extend(defaults, options);

        /* If empty text, hide */
        if (!text) {

            if (this._textNode) {
                try{
                    this._map._pathRoot.removeChild(this._textNode);
                } catch (e) {
                    
                }
            }
            return this;
        }

        text = text.replace(/ /g, '\u00A0');  // Non breakable spaces
        var id = 'pathdef-' + L.Util.stamp(this);
        var svg = this._map._pathRoot;
        this._path.setAttribute('id', id);

        if (options.repeat) {
            /* Compute single pattern length */
            var pattern = L.Path.prototype._createElement('text');
            for (var attr in options.attributes)
                pattern.setAttribute(attr, options.attributes[attr]);
            pattern.appendChild(document.createTextNode(text));
            svg.appendChild(pattern);
            try {
                var alength = pattern.getComputedTextLength();
                svg.removeChild(pattern);
            } catch (e) { }

            /* Create string as long as path */
            text = new Array(Math.ceil(this._path.getTotalLength() / alength)).join(text);
        }

        /* Put it along the path using textPath */
        var textNode = L.Path.prototype._createElement('text'),
            textPath = L.Path.prototype._createElement('textPath');

        var dy = options.offset || this._path.getAttribute('stroke-width');
        var dx = options.offsetX || 0;

        textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", '#' + id);
        textNode.setAttribute('dy', dy);
        textNode.setAttribute('dx', dx);
        for (var attr in options.attributes)
            textNode.setAttribute(attr, options.attributes[attr]);
        textPath.appendChild(document.createTextNode(text));
        textNode.appendChild(textPath);
        svg.appendChild(textNode);
        this._textNode = textNode;
        return this;
    }
};

L.Polyline.include(PolylineTextPath);

L.LayerGroup.include({
    setText: function (text, options) {
        var label = this.labeltemplate;
        if (label != "") {
            var aLabel = label.split("{");
            var flds = [];
            for (var i = 1; i < aLabel.length; i++) {
                flds.push(aLabel[i].split("}")[0]);
            }
            for (var layer in this._layers) {
                if (typeof this._layers[layer].setText === 'function') {
                    var fea = this._layers[layer];
                    if (text != "") {
                        var labl = this.labeltemplate;
                        for (var i = 0; i < flds.length; i++) {
                            var fldValue = "";
                            for (var key in fea.attribute) {
                                if (key == flds[i]) {
                                    fldValue = fea.attribute[key];
                                    break;
                                }
                            }
                            labl = labl.replace("{" + flds[i] + "}", fldValue);
                        }
                        fea.setText(labl, options);
                    } else {
                        fea.setText("", options);
                    }

                }
            }
        }

        return this;
    }
});
