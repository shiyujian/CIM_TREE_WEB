$(function () {
    var $target = $('#property'),
        flow,
        $slider = $('#slider');

    var prefix = getUrlParam('serverURL'); // http://bimcd.ecidi.com:6544';
    var SERVER = prefix + '/service/workflow/api/instance/';
    var STATE_SERVICE = prefix + '/service/workflow/api//state/';
    var LINE_SERVICE = prefix + '/service/workflow/api//transition/';
    var ORGTREE = prefix + '/service/construction/api/org-tree/';
    var USERTREE = prefix + '/accounts/api/users/';

    var TEMP;

    var ORGS = [],
        USERS = [];

    var temp_id = getUrlParam('id');
    var h = document.documentElement.clientHeight - 20;
    var toolBts = [
        { 'start round': '起点' },
        { task: '普通节点' },
        { chat: '选择节点' },
        { fork: '分流节点' },
        { join: '合流节点' },
        { 'end round': '终点' }
    ];
    var btsList = toolBts.map(function (b) {
        var key;
        for (var i in b) {
            key = i;
        }
        return key;
    });
    var property = {
        width: 1000,
        height: h < 400 ? 400 : h,
        toolBtns: btsList,
        //            toolBtns:["start round mix","end round","task","node","chat","state","plug","join","fork","complex mix"],
        haveHead: false,
        headLabel: false, // 流程图标题是否需要
        //            headBtns:["new","open","save","undo","redo","reload","print"],//如果haveHead=true，则定义HEAD区的按钮
        headBtns: ['save', 'undo', 'redo', 'reload', 'print'], // 如果haveHead=true，则定义HEAD区的按钮
        haveTool: false,
        haveDashed: false,
        haveGroup: false,
        useOperStack: false,
        remark: {
            cursor: '选择指针',
            direct: '结点连线',
            dashed: '结点虚线',
            start: '起点',
            task: '普通',
            chat: '选择',
            fork: '分流',
            join: '合流',
            end: '结束',
            node: '自动',
            state: '状态',
            plug: '附加插件',
            complex: '复合结点',
            group: '组织划分框编辑开关'
        }
    };

    function getUrlParam (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); // 构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); // 匹配目标参数
        if (r != null) return decodeURIComponent(r[2]);
        return null; // 返回参数值
    }

    function initFlow () {
        $.get(SERVER + temp_id + '/', {}).success(function (rep) {
            // 添加图例
            setLegend('#flow');

            var exportName = 'export';
            TEMP = rep;
            flow = $.createGooFlow($('#flow'), property);
            // flow.setNodeRemarks(remark);
            flow.loadData(transData(rep.workflow));

            // 设置多个箭头类型
            var defs = flow.$draw.getElementsByTagName('defs')[0];
            defs.appendChild(
                GooFlow.prototype.getSvgMarker(
                    'arrow_done',
                    GooFlow.prototype.color.done
                )
            );
            defs.appendChild(
                GooFlow.prototype.getSvgMarker(
                    'arrow_undo',
                    GooFlow.prototype.color.undo
                )
            );
            defs.appendChild(
                GooFlow.prototype.getSvgMarker(
                    'arrow_processing',
                    GooFlow.prototype.color.processing
                )
            );

            // 修改进度 样式
            brushFlowWithColor();

            flow.onBtnSaveClick = function () {
                flow.blurItem();
                wholeUpdate({ nodes: flow.$nodeData, lines: flow.$lineData });
            };
            $('#loading').remove();
            $('#svg').remove();

            $('.Gooflow_extend_right').remove();
            $('.Gooflow_extend_bottom').remove();
        });
    }

    function transData (data) {
        var title = data.name;
        var nodes = {};
        var isNeedAutoLayout = false;
        for (var i in data.states) {
            var s = data.states[i];

            if (s.orgs.length > 0) {
                s.orgs = s.orgs.map(function (o) {
                    return o.id;
                });
            }

            if (s.participants.length > 0) {
                s.participants = s.participants.map(function (p) {
                    return p.executor.id;
                });
            }
            if (s.state_type == 0) {
                s.state_type = 6;
            }

            if (s.position) {
                nodes[s.id] = {
                    name: s.name,
                    height: s.position.height || 28,
                    width: s.position.width || 29,
                    top: s.position.top || 0,
                    left: s.position.left || 0,
                    alt: true,
                    type: btsList[s.state_type - 1],
                    detail: s
                };
            } else {
                nodes[s.id] = {
                    name: s.name,
                    height: 30,
                    width: 100,
                    alt: true,
                    type: btsList[s.state_type - 1],
                    detail: s
                };

                isNeedAutoLayout = true;
            }

            if (s.code) {
                nodes[s.id].code = s.code;
            }
        }

        var lines = {};
        for (var i in data.transitions) {
            var s = data.transitions[i];
            var lineType = s.to_state < s.from_state ? 'tb' : 'sl';
            lines[s.id] = {
                name: s.name == '连线' ? '' : s.name,
                from: s.from_state,
                to: s.to_state,
                type: s.position ? s.position.type : lineType,
                detail: s,
                M: null
            };
            if (s.position && s.position.M) {
                lines[s.id]['M'] = s.position.M;
            }
        }

        isNeedAutoLayout && layoutGraph(nodes, lines);

        return {
            title: title,
            nodes: nodes,
            lines: lines,
            areas: {},
            initNum: 0
        };
    }

    // 布局 流程图
    function layoutGraph (nodes, lines) {
        var offSet = {
            top: 100,
            left: 50
        };

        var g = new dagre.graphlib.Graph();

        g.setGraph({
            rankdir: 'LR'
        });

        g.setDefaultEdgeLabel(function () {
            return {
                label: '测试',
                width: 25,
                height: 25
            };
        });

        for (var key in nodes) {
            var node = nodes[key];
            g.setNode(key, node);
        }

        for (var key in lines) {
            var line = lines[key];
            g.setEdge(line.from, line.to);
        }

        dagre.layout(g);

        // update position
        for (var key in nodes) {
            var node = nodes[key];
            node.top = node.y + offSet.top;
            node.left = node.x + offSet.left;
        }

        var lineKeys = Object.keys(lines);

        g.edges().forEach(function (e, index) {
            var linePos = g.edge(e).points[1];
            var key = lineKeys[index];
            var line = lines[key];
            if (line.type === 'tb') {
                line.M = linePos.y + offSet.top;
            }
        });
    }

    // 根据流程状态 设置流程图颜色
    function brushFlowWithColor () {
        var nodes = flow.$nodeDom;
        var nodeData = flow.$nodeData;
        var lineDoms = flow.$lineDom;
        var lineData = flow.$lineData;
        for (var currNodeId in nodeData) {
            var currNodeData = nodeData[currNodeId];
            var markType = 'done';
            if (currNodeData.detail) {
                if (currNodeData.detail.status === 'processing') {
                    markType = 'processing';
                } else if (currNodeData.detail.status === 'undo') {
                    markType = 'undo';
                }
            }
            setItemColor(nodes[currNodeId], 'node', markType);

            // find next line
            var nextLines = [];
            for (var currLineId in lineData) {
                var currLine = lineData[currLineId];
                if (currLine.from === parseInt(currNodeId)) {
                    nextLines.push(currLineId);
                }
            }

            nextLines.forEach(function (lineId) {
                var currLineDom = lineDoms[lineId];
                setItemColor(currLineDom, 'line', markType);
            });
        }
    }

    function setItemColor (itemDom, type, markType) {
        if (type == 'node') {
            itemDom.css({
                'background-color': GooFlow.prototype.color[markType],
                'border-color': GooFlow.prototype.color[markType]
            });
        } else if (type == 'line') {
            if (GooFlow.prototype.useSVG != '') {
                itemDom.childNodes[1].setAttribute(
                    'stroke',
                    GooFlow.prototype.color[markType]
                );
                itemDom.childNodes[1].setAttribute(
                    'marker-end',
                    'url(#arrow_' + markType + ')'
                );
                itemDom.childNodes[1].setAttribute('stroke-width', 2.4);
            } else {
                itemDom.strokeColor = GooFlow.prototype.color[markType];
                itemDom.strokeWeight = '2.4';
            }
        }
    }

    function getOrgs (values, data) {
        let target = values.split(','),
            result = [];
        var loop = function (items) {
            items.forEach(function (o) {
                if (target.indexOf(o.id) > -1) {
                    result.push(o);
                }
                if (o.children && o.children.length > 0) {
                    loop(o.children);
                }
            });
        };

        loop(data);
        return result;
    }

    function transTree (data) {
        var loop = function (items) {
            items.forEach(function (o) {
                o.id = o.pk;
                o.text = o.name;
                if (o.children.length > 0) {
                    loop(o.children);
                }
            });
        };

        loop(data.children);
        return data.children;
    }

    // 图例 legend
    function setLegend (bgDiv) {
        $(bgDiv).append(
            '<div class="legend">\
            <span class="legend-done">已完成</span>\
            <span class="legend-processing">执行中</span>\
            <span class="legend-undo">未完成</span>\
        </div>'
        );
    }

    if (temp_id) {
        $.get(ORGTREE, {}).success(function (rep) {
            ORGS = transTree(rep);
            initFlow();
        });

        // $.get(USERTREE, {}).success(function (rep) {
        //     USERS = rep.map(function (item) {
        //         return {
        //             id: item.id,
        //             person_name: item.account.person_name,
        //             text: item.account.person_name,
        //             username: item.username,
        //             organization: item.account.organization,
        //             person_code: item.account.person_code
        //         };
        //     });
        // });
    } else {
        $('body').html(
            '<p style="text-align:center;padding-top:20px;color:#ccc">请先选择模板</p>'
        );
    }
});
