$(function () {
    var $target = $('#property'),
        flow,
        $sliderNode = $('#sliderNode'),
        $sliderLine = $('#sliderLine'),
        $nodeOkBtn = $('#nodeOk_btn'),
        $lineOkBtn = $('#lineOk_btn'),
        $sliderbtn = $('#sliderbtn');

    var prefix = getUrlParam('serverURL'); // http://bimcd.ecidi.com:6544';
    var SERVER = prefix + '/service/workflow/api/template/';
    var STATE_SERVICE = prefix + '/service/workflow/api/state/';
    var LINE_SERVICE = prefix + '/service/workflow/api/transition/';
    var ORGTREE = prefix + '/service/construction/api/org-tree/';
    var USERTREE = prefix + '/accounts/api/users/';
    var ROLESET = prefix + '/accounts/api/roles/';

    // 2019-7-22 两库合并新接口
    // 节点查询列表
    var getNodeListUrl = prefix + '/flow/nodes';
    // 节点新增
    var postNodeUrl = prefix + '/flow/node';
    // 节点编辑
    var putNodeUrl = prefix + '/flow/node';
    // 流向查询列表
    var getLineListUrl = prefix + '/flow/directions';
    // 流向新增
    var postDirectionUrl = prefix + '/flow/direction';
    // 流向编辑
    var putDirectionUrl = prefix + '/flow/direction';

    var CALLBACKSET = [];
    $.getJSON('./configData/yinghuan.json', function (data) {
        CALLBACKSET = data.map(function (item, index) {
            item.id = index;
            item.text = item.name;
            return item;
        });
    });

    var TEMP;

    var ORGS = [],
        USERS = [],
        ROLES = [];

    let originData = [];
    var temp_name = getUrlParam('name');
    var temp_id = getUrlParam('id');
    console.log('传值信息', prefix, temp_id, temp_name);
    var h = document.documentElement.clientHeight - 20;
    var w = document.documentElement.clientWidth - 20;
    var toolBts = [
        { 'start round mix': '起点' },
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
        width: h < 0 ? 1000 : w,
        height: h < 400 ? 400 : h,
        toolBtns: btsList,
        //            toolBtns:["start round mix","end round","task","node","chat","state","plug","join","fork","complex mix"],
        haveHead: true,
        headLabel: true, // 流程图标题是否需要
        //            headBtns:["new","open","save","undo","redo","reload","print"],//如果haveHead=true，则定义HEAD区的按钮
        headBtns: [
            'save',
            'undo',
            'redo',
            'reload',
            'print',
            'zoomin',
            'zoomout'
        ], // 如果haveHead=true，则定义HEAD区的按钮
        haveTool: true,
        haveDashed: true,
        haveGroup: false,
        useOperStack: true,
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

    var readOnlyProperty = {
        width: h < 0 ? 1000 : w,
        height: h < 400 ? 400 : h,
        haveHead: true,
        headLabel: true, // 流程图标题是否需要
        //            headBtns:["new","open","save","undo","redo","reload","print"],//如果haveHead=true，则定义HEAD区的按钮
        headBtns: ['edit', 'print', 'zoomin', 'zoomout'], // 如果haveHead=true，则定义HEAD区的按钮
        haveTool: false,
        haveDashed: false,
        haveGroup: false,
        useOperStack: false
    };
    
    function getProperty (data, id) {
        var type,
            detail = data.detail;
        for (var i in toolBts) {
            if (toolBts[i][data.type]) {
                type = toolBts[i][data.type];
            }
        }
        var config = [
            // {"name":"流程名称","value":temp_name,"group":"模板信息"},
            // {"name":"流程编码","value":"","group":"模板信息"},
            { name: '节点类型', field: 'type', value: type, group: '节点信息' },
            {
                name: '节点名称',
                field: 'name',
                value: data.name,
                group: '节点信息'
            },
            {
                name: '节点ID',
                field: 'no',
                value: id,
                group: '节点信息'
            },
            {
                name: '节点说明',
                field: 'orgs',
                value: '',
                group: '节点信息',
                editor: {
                    type: 'textbox',
                    onChange: function (value) {
                        data.NodeDescribe = value;
                    }
                }
            }
        ];

        $target.propertygrid({
            columns: [
                [
                    { field: 'name', title: 'Name', width: 50, sortable: true },
                    // {
                    //     field: 'value',
                    //     title: 'Value',
                    //     width: 100,
                    //     sortable: true,
                    //     formatter: function (value, rowData, rowIndex) {
                    //         var handleOnChange = rowData.editor
                    //             ? rowData.editor.onChange
                    //             : function () {};
                    //         switch (rowData.field) {
                    //             case 'allow_delegation':
                    //             case 'allow_abolish':
                    //             case 'allow_carbon_copy':
                    //             case 'deadline_warning':
                    //                 handleOnChange(value);
                    //                 return value == 'true' ? '是' : '否';
                    //             case 'orgs':
                    //                 handleOnChange(value.split(','));
                    //                 var orgs = getOrgs(
                    //                     value,
                    //                     rowData.editor.options.data
                    //                 );
                    //                 var orgNames = orgs.map(function (o) {
                    //                     return o.name;
                    //                 });
                    //                 return orgNames;
                    //             case 'roles':
                    //                 var rolesValue = value.split(',');
                    //                 handleOnChange(rolesValue);
                    //                 return ROLES.filter(function (role) {
                    //                     return rolesValue.some(function (
                    //                         roleId
                    //                     ) {
                    //                         return role.id == roleId;
                    //                     });
                    //                 }).map(function (resultRole) {
                    //                     return resultRole.text;
                    //                 });
                    //             default:
                    //                 return value;
                    //         }
                    //     }
                    // }
                ]
            ],
            data: config,
            scrollbarSize: 0,
            showGroup: true,
            showHeader: false
        });
    }
    // update line
    function getLineProperty (data) {
        var type;
        for (var i in toolBts) {
            if (toolBts[i][data.type]) {
                type = toolBts[i][data.type];
            }
        }
        var config = [
            // {"name":"流程名称","value":temp_name,"group":"模板信息"},
            // {"name":"流程编码","value":"","group":"模板信息"},
            { name: '线段类型', field: 'type', value: type, group: '线段信息' },
            {
                name: '线段名称',
                field: 'name',
                value: data.name,
                group: '线段信息'
            },
            {
                name: '业务操作',
                field: 'business',
                value: data.detail.callback && data.detail.callback.join(','),
                group: '事务信息',
                editor: {
                    type: 'combotree',
                    options: {
                        multiple: true,
                        data: CALLBACKSET
                    },
                    onChange: function (value) {
                        data.detail.callback = value;
                    }
                }
            }
        ];

        $target.propertygrid({
            columns: [
                [
                    { field: 'name', title: 'Name', width: 50, sortable: true },
                    {
                        field: 'value',
                        title: 'Value',
                        width: 100,
                        sortable: true,
                        formatter: function (value, rowData, rowIndex) {
                            var handleOnChange = rowData.editor
                                ? rowData.editor.onChange
                                : function () {};
                            switch (rowData.field) {
                                case 'business':
                                    if (!value) return '';
                                    var valueArray = value.split(',');
                                    handleOnChange(valueArray);
                                    return valueArray.map(function (item) {
                                        return CALLBACKSET[item].text;
                                    });
                                default:
                                    return value;
                            }
                        }
                    }
                ]
            ],
            data: config,
            scrollbarSize: 0,
            showGroup: true,
            showHeader: false
        });
    }

    function _getObj (id, mode) {
        var obj;
        if (mode == 'line') {
            obj = this.$lineData[id];
        } else {
            obj = this.$nodeData[id];
        }
        return obj;
    }
    // 确认节点
    function onSubmitNode () {
        console.log('确认node', focusObj, flow, flow.$nodeData);
        if (flow.$nodeData[focusObj.id]) {
            let $node_name = $('#node_name').val();
            let $node_describe = $('#node_describe').val();
            flow.$nodeData[focusObj.id].describe = $node_describe;
            console.log('确认值', flow.$nodeData);
            flow.setName(focusObj.id, $node_name, 'node');
            $sliderNode.hide();
        }
        flow.blurItem();
    }
    function onSubmitLine () {
        if (flow.$lineData[focusObj.id]) {
            let $line_name = $('#line_name').val();
            let $line_describe = $('#line_describe').val();
            console.log('确认line', focusObj, flow.$lineData, $line_name, $line_describe);
            flow.$lineData[focusObj.id].describe = $line_describe;
            flow.setName(focusObj.id, $line_name, 'line');
            $sliderLine.hide();
        }
        flow.blurItem();
    }
    let focusObj = {}; // 焦点元素原值
    // 获取焦点
    function onItemFocus (id, mode) {
        var obj = _getObj.call(this, id, mode);
        console.log('编辑节点', id, mode, obj);
        obj.id = id;
        if (mode === 'node') {
            $sliderNode.show();
            // getProperty(obj, id);
            focusObj = obj;
            $('#node_code').val(obj.code);
            $('#node_name').val(obj.name);
            $('#node_type').val(obj.type);
            $('#node_describe').val(obj.describe);
        } else if (mode === 'line') {
            $sliderLine.show();
            // getLineProperty(obj);
            focusObj = obj;
            $('#line_id').val(id);
            $('#line_name').val(obj.name);
            $('#line_type').val(obj.type);
            $('#line_describe').val(obj.describe);
        }
        return true;
    }

    function onItemAdd (id, mode, obj) {
        if (mode == 'node') {
            let type = btsList.indexOf(obj.type) + 1;
            if (type == 6) {
                type = 0;
            }
            var node = {
                name: obj.name,
                state_type: type,
                id: id,
                participants: [],
                orgs: [],
                roles: [],
                allow_delegation: true,
                allow_abolish: false,
                allow_carbon_copy: true,
                allow_state_edit: false,
                deadline_warning: true,
                callback: null,
                remark: null,
                position: {
                    left: obj.left,
                    top: obj.top,
                    height: 28,
                    width: 28
                }
            };
            obj.detail = node;

            // $.ajax({
            //     url:SERVER + temp_id +'/state/',
            //     data:JSON.stringify(node),
            //     contentType:'application/json',
            //     type:'POST',
            //     success:function(rep){
            //         console.log('创建节点成功');
            //     }
            // })
        } else {
            var trans = {
                name: '连线',
                condition: null,
                callback: null,
                from_state: obj.from,
                to_state: obj.to,
                position: {}
            };

            obj.detail = trans;

            // $.ajax({
            //     url:SERVER + temp_id +'/transition/',
            //     data:JSON.stringify(trans),
            //     contentType:'application/json',
            //     type:'POST',
            //     success:function(rep){
            //         console.log('创建连线成功');
            //     }
            // });
        }
        return true;
    }

    function guid () {
        function S4 () {
            return (((1 + Math.random()) * 0x10000) | 0)
                .toString(16)
                .substring(1);
        }
        return (
            S4() +
            S4() +
            '-' +
            S4() +
            '-' +
            S4() +
            '-' +
            S4() +
            '-' +
            S4() +
            S4() +
            S4()
        );
    }

    // 保存
    function wholeUpdate (nodeData, lineData) {
        for (let item in lineData) {
            console.log('保存', lineData, originData);
            if (originData.includes(item)) {
                let params = {
                    ID: item,
                    Name: lineData[item].name, // 流向名称
                    DCondition: lineData[item].describe, // 流向条件
                    FromNode: lineData[item].from, // 节点起点
                    ToNode: lineData[item].to // 节点终点
                };
                $.ajax({
                    url: putDirectionUrl,
                    data: JSON.stringify(params),
                    contentType: 'application/json',
                    type: 'PUT',
                    success: function (rep) {
                        if (rep.code === 1) {
                            alert('编辑流向成功');
                        } else {
                            alert(rep.msg);
                        }
                    }
                });
            } else {
                let params = {
                    Creater: 9, // 新增人ID
                    FlowID: temp_id, // 流程ID
                    FlowName: temp_name, // 流程名称
                    Name: lineData[item].name, // 流向名称
                    DCondition: lineData[item].describe, // 流向条件
                    FromNode: lineData[item].from, // 节点起点
                    ToNode: lineData[item].to // 节点终点
                };
                $.ajax({
                    url: postDirectionUrl,
                    data: JSON.stringify(params),
                    contentType: 'application/json',
                    type: 'POST',
                    success: function (rep) {
                        if (rep.code === 1) {
                            alert('创建流向成功');
                        } else {
                            alert(rep.msg);
                        }
                    }
                });
            }
        }
        for (let item in nodeData) {
            // 确定节点类型
            let NodeType = '';
            if (nodeData[item].type === 'start round mix') {
                NodeType = 1;
            } else if (nodeData[item].type === 'task') {
                NodeType = 2;
            }
            // 是否为编辑
            if (originData.includes(item)) {
                let params = {
                    ID: item, // 新增人ID
                    Name: nodeData[item].name, // 节点名称
                    NodeDescribe: nodeData[item].describe // 节点说明
                };
                $.ajax({
                    url: putNodeUrl,
                    data: JSON.stringify(params),
                    contentType: 'application/json',
                    type: 'PUT',
                    success: function (rep) {
                        if (rep.code === 1) {
                            alert('编辑节点成功');
                        } else {
                            alert(rep.msg);
                        }
                    }
                });
            } else {
                let params = {
                    Creater: 9, // 新增人ID
                    FlowID: temp_id, // 流程ID
                    FlowName: temp_name, // 流程名称
                    Name: nodeData[item].name, // 节点名称
                    NodeDescribe: nodeData[item].describe, // 节点说明
                    NodeType // 节点类型
                };
                $.ajax({
                    url: postNodeUrl,
                    data: JSON.stringify(params),
                    contentType: 'application/json',
                    type: 'POST',
                    success: function (rep) {
                        if (rep.code === 1) {
                            alert('创建节点成功');
                        } else {
                            alert(rep.msg);
                        }
                    }
                });
            }
        }
    }
    // function wholeUpdate (data) {
    //     data = JSON.parse(JSON.stringify(data));

    //     var states = [],
    //         transitions = [];
    //     for (var i in data.nodes) {
    //         var item = data.nodes[i].detail;

    //         if (item.orgs.length > 0) {
    //             var orgs = getOrgs(item.orgs.join(','), ORGS);
    //             console.log('orgs', orgs);
    //             console.log('item.orgs', item.orgs);
    //             item.orgs = orgs.map(function (o) {
    //                 // delete o.children;
    //                 return {
    //                     code: o.code || null,
    //                     id: o.id || null,
    //                     pk: o.pk || null,
    //                     name: o.name || null,
    //                     text: o.text || null
    //                 };
    //             });
    //         }

    //         // update roles
    //         if (item.roles.length > 0) {
    //             item.roles = ROLES.filter(function (r) {
    //                 return item.roles.indexOf(String(r.id)) > -1;
    //             }).map(function (newRole) {
    //                 delete newRole.text;
    //                 return newRole;
    //             });
    //         }
    //         if (item.state_type == 6) {
    //             item.state_type = 0;
    //         }

    //         // update Position
    //         var node = data.nodes[i];
    //         item.position = {
    //             height: node.height,
    //             width: node.width,
    //             top: node.top,
    //             left: node.left
    //         };

    //         // set code
    //         item.code = node.code || i;

    //         // name
    //         item.name = node.name;

    //         states.push(item);
    //     }

    //     for (var i in data.lines) {
    //         var item = data.lines[i];

    //         var fromNode = states.find(function (s) {
    //             return s.id == item.from;
    //         });
    //         item.from = fromNode.code;
    //         var to = states.find(function (s) {
    //             return s.id == item.to;
    //         });
    //         item.to = to.code;

    //         var transit = {
    //             name: item.name || '连线',
    //             from_state: item.from,
    //             to_state: item.to,
    //             condition: item.detail.condition,
    //             callback: item.detail.callback,
    //             position: {
    //                 type: item.type,
    //                 M: item.M,
    //                 marked: item.marked,
    //                 dash: item.dash
    //             }
    //         };

    //         if (transit.callback) {
    //             // line
    //             if (transit.callback.length > 0) {
    //                 transit.callback = transit.callback.map(function (index) {
    //                     delete CALLBACKSET[index].text;
    //                     return CALLBACKSET[index];
    //                 });
    //             }
    //         }

    //         transitions.push(transit);
    //     }

    //     var data = {
    //         template: true,
    //         workflow: {
    //             name: TEMP.name,
    //             code: TEMP.code,
    //             status: 0, // 默认设置为0
    //             position: {}
    //         },
    //         states: states,
    //         transitions: transitions
    //     };
    //     $.ajax({
    //         url: SERVER + temp_id + '/whole/',
    //         data: JSON.stringify(data),
    //         contentType: 'application/json',
    //         type: 'PUT',
    //         success: function (rep) {
    //             alert('更新成功');
    //         }
    //     });
    // }

    function updateNode (node) {
        if (!node) {
            return;
        }
        let data = node.detail;
        data.position.height = node.height;
        data.position.width = node.width;
        data.position.top = node.top;
        data.position.left = node.left;
        data.name = node.name;
        var t = $target.propertygrid('getData')['rows'];
        data.orgs = t[3].value.split(',');
        data.participants = t[4].value.split(',');
        data.allow_delegation = JSON.parse(t[5].value);
        data.allow_abolish = JSON.parse(t[6].value);
        data.allow_carbon_copy = JSON.parse(t[7].value);
        data.deadline_warning = JSON.parse(t[8].value);
        // $.ajax({
        //     url:STATE_SERVICE + data.id +'/',
        //     type:'PUT',
        //     contentType:'application/json',
        //     data:JSON.stringify(data),
        //     success:function(rep){
        //         console.log('更新节点成功');
        //     }
        // })
    }

    function updateLine (line, id) {
        if (!line) {
            return;
        }
        let data = { condition: null, callback: null };
        data.from_state = line.from;
        data.name = line.name || '连线';
        data.to_state = line.to;

        data.position = {
            dash: line.dash,
            alt: line.alt,
            type: line.type,
            M: line.M
        };

        // $.ajax({
        //     url:LINE_SERVICE + id +'/',
        //     type:'PUT',
        //     contentType:'application/json',
        //     data:JSON.stringify(data),
        //     success:function(rep){
        //         console.log('更新连线成功');
        //     }
        // })
    }

    function onItemDel (id) {
        // if(this.$nodeData[id]) {
        //     let data = this.$nodeData[id].detail;
        //     $.ajax({
        //         url:STATE_SERVICE + data.id +'/',
        //         type:'DELETE',
        //         contentType:'application/json',
        //         data:{},
        //         success:function(rep){
        //             console.log('删除节点成功');
        //         }
        //     })
        // }else{
        //     let data = this.$lineData[id];
        //     $.ajax({
        //         url:LINE_SERVICE + id +'/',
        //         type:'DELETE',
        //         contentType:'application/json',
        //         data:{},
        //         success:function(rep){
        //             console.log('删除连线成功');
        //         }
        //     })
        //
        // }

        return true;
    }

    function onItemBlur (id, mode) {
        if (mode == 'node') {
            updateNode(this.$nodeData[id]);
        } else {
            updateLine(this.$lineData[id], id);
        }
        $sliderNode.hide();
        $sliderLine.hide();
        return true;
    }

    function getUrlParam (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); // 构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); // 匹配目标参数
        if (r != null) return decodeURIComponent(r[2]);
        return null; // 返回参数值
    }

    // 初始化
    function initFlow () {
        flow = $.createGooFlow($('#flow'), property);
        $('#loading').remove();
        $('#svg').remove();
        flow.onBtnSaveClick = function () {
            console.log('保存节点');
            flow.blurItem();
            wholeUpdate(flow.$nodeData, flow.$lineData);
        };
        flow.onItemFocus = onItemFocus;
        $nodeOkBtn.click(onSubmitNode);
        $lineOkBtn.click(onSubmitLine);
        $.get(getNodeListUrl, {
            flowid: temp_id, // 流程ID
            name: '', // 节点名称
            type: '', // 节点类型
            status: '' // 节点状态
        }).success(function (rep) {
            let nodes = {};
            rep.map((item, index) => {
                originData.push(item.ID);
                if (item.NodeType === 1) {
                    nodes[item.ID] = {
                        name: item.Name,
                        describe: item.NodeDescribe,
                        code: item.Code,
                        height: 28,
                        width: 30,
                        top: 40,
                        left: 220,
                        alt: true,
                        type: 'start round mix'
                    };
                } else if (item.NodeType === 2) {
                    nodes[item.ID] = {
                        name: item.Name,
                        describe: item.NodeDescribe,
                        code: item.Code,
                        height: 28,
                        width: 30,
                        top: 180 + index * 140,
                        left: 180,
                        alt: true,
                        type: 'task'
                    };
                }
            });
            $.get(getLineListUrl, {
                flowid: temp_id, // 流程ID
                name: '', // 流程名称
                type: '', // 流向状态
                page: '', // 节点状态
                siez: '' // 每页数量
            }).success(rep => {
                let lines = {};
                rep.map((item, index) => {
                    originData.push(item.ID);
                    lines[item.ID] = {
                        id: item.ID,
                        name: item.Name,
                        describe: item.DCondition,
                        from: item.FromNode,
                        to: item.ToNode,
                        type: 'sl'
                    };
                });
                let data = {
                    title: '',
                    nodes: nodes,
                    lines: lines,
                    areas: {},
                    initNum: 0
                };
                console.log('回显的数据', data);
                flow.loadData(data);
            });
        });

        // $.get(SERVER + temp_id + '/', {}).success(function (rep) {
        //     var exportName = 'export';
        //     TEMP = rep;
        //     console.log('======= resp Data ====', rep);

        //     if (rep.status === 0) {
        //         flow = $.createGooFlow($('#flow'), property);
        //     } else if (rep.status === 1) {
        //         flow = $.createGooFlow($('#flow'), readOnlyProperty);
        //         $('.Gooflow_extend_right').remove();
        //         $('.Gooflow_extend_bottom').remove();

        //         flow.onEditClick = onEditClick;
        //     }

        //     // flow.setNodeRemarks(remark);
        //     flow.loadData(transData(rep));
        //     flow.onBtnSaveClick = function () {
        //         flow.blurItem();
        //         wholeUpdate({ nodes: flow.$nodeData, lines: flow.$lineData });
        //     };
        //     $('#loading').remove();
        //     $('#svg').remove();

        //     flow.onItemAdd = onItemAdd;
        //     // flow.onItemBlur = onItemBlur;
        //     flow.onItemDel = onItemDel;
        //     flow.onPrintClick = function () {
        //         flow.exportDiagram(exportName);
        //     };
        //     flow.onFullsreenClick = fullscreen;

        //     $sliderbtn.click(handleCloseProperty);
        // });
    }

    function fullscreen () {
        if (
            document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement
        ) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(
                    Element.ALLOW_KEYBOARD_INPUT
                );
            } else if (document.body.msRequestFullscreen) {
                document.body.msRequestFullscreen();
            }
        }
        setTimeout(function () {
            flow.reinitSize(
                document.documentElement.clientWidth - 40,
                document.documentElement.clientHeight - 40
            );
        }, 500);
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
            // 转换 role
            if (s.roles.length > 0) {
                s.roles = s.roles.map(function (r) {
                    return r.id;
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
            // line
            if (s.callback && s.callback.length > 0) {
                s.callback = s.callback.map(function (item) {
                    return CALLBACKSET.findIndex(function (c) {
                        return c.name == item.name;
                    });
                });
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

    function getOrgs (values, data) {
        console.log('getOrgsvalue', values);
        console.log('getOrgsdata', data);
        console.log('getOrgsORG', ORGS);
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

    // 开启编辑功能
    function onEditClick () {
        var openEdit = confirm('确定将改流程图切换为编辑状态吗？');
        if (openEdit) {
            var data = {
                status: 0
            };
            $.ajax({
                url: SERVER + temp_id + '/status/',
                data: JSON.stringify(data),
                contentType: 'application/json',
                type: 'patch',
                success: function (rep) {
                    alert('流程图已经切换为编辑状态');
                    document.location = '/gooflow/index.html?id=' + temp_id;
                }
            });
        }
    }

    // 关闭 Property
    function handleCloseProperty () {
        $slider.hide();
    }

    if (temp_id) {
        initFlow();
        // $.get(ORGTREE, {}).success(function (rep) {
        //     ORGS = transTree(rep);
        //     initFlow();
        // });

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
        $.get(ROLESET, {}).success(function (rep) {
            ROLES = rep.map(function (item) {
                return {
                    id: item.id,
                    text: item.name,
                    name: item.name,
                    code: item.code,
                    description: item.description
                };
            });
        });
    } else {
        $('body').html(
            '<p style="text-align:center;padding-top:20px;color:#ccc">请先选择模板</p>'
        );
    }
});
