$(function () {
    var flow,
        $sliderNode = $('#sliderNode'),
        $sliderLine = $('#sliderLine'),
        $nodeResetBtn = $('#nodeReset_btn'),
        $nodeOkBtn = $('#nodeOk_btn'),
        $lineResetBtn = $('#lineReset_btn'),
        $lineOkBtn = $('#lineOk_btn');

    var prefix = getUrlParam('serverURL'); // 接口IP
    // 节点查询列表
    var getNodeListUrl = prefix + '/flow/nodes';
    // 节点新增
    var postNodeUrl = prefix + '/flow/node';
    // 节点编辑
    var putNodeUrl = prefix + '/flow/node';
    // 节点删除
    var deleteNodeUrl = prefix + '/flow/node/';
    // 流向查询列表
    var getLineListUrl = prefix + '/flow/directions';
    // 流向新增
    var postDirectionUrl = prefix + '/flow/direction';
    // 流向编辑
    var putDirectionUrl = prefix + '/flow/direction';
    // 流向删除
    var deleteDirectionUrl = prefix + '/flow/direction/';
    // 新增流程节点和流向
    var postNodeDirection = prefix + '/flow/nodedirection';

    let originData = []; // 回显的节点和流向ID
    let actionEdit = false; // 是否为编辑
    var temp_name = getUrlParam('name');
    var temp_id = getUrlParam('id');
    var user_id = getUrlParam('userID');
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
        // toolBtns:["start round mix","end round","task","node","chat","state","plug","join","fork","complex mix"],
        haveHead: true,
        headLabel: true, // 流程图标题是否需要
        // headBtns:["new","open","save","undo","redo","reload","print"],//如果haveHead=true，则定义HEAD区的按钮
        headBtns: [
            'save',
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
            let $line_channel = $('#line_channel').val();
            let $line_describe = $('#line_describe').val();
            console.log('确认line', focusObj, $line_channel, $line_describe);
            flow.$lineData[focusObj.id].channel = $line_channel;
            flow.$lineData[focusObj.id].describe = $line_describe;
            flow.setName(focusObj.id, $line_name, 'line');
            $sliderLine.hide();
        }
        flow.blurItem();
    }
    function onResetLine () {
        $('#line_name').val(focusObj.name);
        $('#line_channel').val(focusObj.channel || '01');
        $('#line_describe').val(focusObj.describe);
    }
    function onResetNode () {
        $('#node_name').val(focusObj.name);
        $('#node_describe').val(focusObj.describe);
    }
    let focusObj = {}; // 焦点元素原值
    let focusMode = ''; // 焦点元素原值
    // 获取焦点
    function onItemFocus (id, mode) {
        if (mode === 'node') {
            $sliderNode.show();
            focusObj = this.$nodeData[id];
            focusObj.id = id;
            focusMode = 'node';
            $('#node_code').val(focusObj.code);
            $('#node_name').val(focusObj.name);
            $('#node_type').val(focusObj.type);
            $('#node_describe').val(focusObj.describe);
        } else if (mode === 'line') {
            $sliderLine.show();
            focusObj = this.$lineData[id];
            focusMode = 'line';
            $('#line_id').val(id);
            $('#line_name').val(focusObj.name);
            $('#line_channel').val(focusObj.channel || '01');
            $('#line_type').val(focusObj.type);
            $('#line_describe').val(focusObj.describe);
        }
        console.log('获得焦点', id, mode, focusObj);
        return true;
    }

    function onItemAdd (id, mode, obj) {
        console.log('添加节点', id, mode, obj);
        onItemBlur(); // 失去焦点
        return true;
    }

    function onItemBlur (id, mode) {
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

    // 保存
    function wholeUpdate (nodeData, lineData) {
        console.log('保存', lineData, nodeData, originData);
        let Nodes = [];
        let Directions = [];
        for (let item in nodeData) {
            // if (originData.includes(item)) {

            // } else {
            // 确定节点类型
            let NodeType = '';
            if (nodeData[item].type === 'start round mix') {
                NodeType = 1;
            } else if (nodeData[item].type === 'task') {
                NodeType = 2;
            } else if (nodeData[item].type === 'end round') {
                NodeType = 0;
            } else {
                NodeType = 2;
            }
            Nodes.push({
                Creater: parseInt(user_id), // 创建人
                FlowID: temp_id, // 流程ID
                FlowName: temp_name, // 流程名称
                X: nodeData[item].left, // left
                Y: nodeData[item].top, // top
                Width: nodeData[item].width, // width
                Height: nodeData[item].height, // height
                Name: nodeData[item].name, // 节点名称
                NodeDescribe: nodeData[item].describe || '', // 节点说明
                NodeType: NodeType // 节点类型
            });
            // }
        }
        for (let item in lineData) {
            // if (originData.includes(item)) {

            // } else {
            Directions.push({
                Creater: parseInt(user_id), // 创建人
                FlowID: temp_id, // 流程ID
                FlowName: temp_name, // 流程名称
                Name: lineData[item].name, // 流向名称
                DCondition: lineData[item].describe || '', // 流向条件
                FromNode: nodeData[lineData[item].from].name, // 节点起点
                ToNode: nodeData[lineData[item].to].name, // 节点终点
                DirectionChannel: lineData[item].channel // 流向通道 01进 11进退 10退
            });
            // }
        }
        console.log('新增', Nodes, Directions);
        let params = {
            Nodes,
            Directions
        };
        if (actionEdit) {
            $.ajax({
                url: postNodeDirection,
                data: JSON.stringify(params),
                contentType: 'application/json',
                type: 'POST',
                success: function (rep) {
                    if (rep.code === 1) {
                        alert('上传流程模板成功');
                        getLoadData(); // 刷新工作区
                    } else {
                        alert(`上传流程模板失败，${rep.msg}`);
                    }
                }
            });
        } else {
            $.ajax({
                url: postNodeDirection,
                data: JSON.stringify(params),
                contentType: 'application/json',
                type: 'POST',
                success: function (rep) {
                    if (rep.code === 1) {
                        alert('上传流程模板成功');
                        getLoadData(); // 刷新工作区
                    } else {
                        alert(`上传流程模板失败，${rep.msg}`);
                    }
                }
            });
        }
    }
    function onItemDel (id, mode) {
        console.log('删除', id, mode);
        if (originData.includes(id)) {
            if (focusMode === 'node') {
                $.ajax({
                    url: deleteNodeUrl + id,
                    type: 'DELETE',
                    contentType: 'application/json',
                    success: (rep) => {
                        if (rep.code === 1) {
                            onItemBlur(); // 丢失焦点
                            alert('删除节点成功');
                        } else {
                            alert('删除节点失败');
                        }
                    }
                });
            } else {
                $.ajax({
                    url: deleteDirectionUrl + id,
                    type: 'DELETE',
                    contentType: 'application/json',
                    success: (rep) => {
                        if (rep.code === 1) {
                            onItemBlur(); // 失去焦点
                            alert('删除流程成功');
                        } else {
                            alert('删除流程失败');
                        }
                    }
                });
            }
        }
        return true;
    }
    function getLoadData () {
        originData = [];
        flow.clearData(); // 先清空工作区
        console.log('更新前');
        $.get(getNodeListUrl, {
            flowid: temp_id, // 流程ID
            name: '', // 节点名称
            type: '', // 节点类型
            status: 1 // 节点状态
        }).success(function (rep) {
            let nodes = {};
            rep.map((item, index) => {
                originData.push(item.ID);
                if (item.NodeType === 1) {
                    nodes[item.ID] = {
                        id: item.ID,
                        name: item.Name,
                        describe: item.NodeDescribe,
                        code: item.Code,
                        height: item.Height,
                        width: item.Width,
                        top: item.Y,
                        left: item.X,
                        alt: true,
                        type: 'start round mix'
                    };
                } else if (item.NodeType === 2) {
                    nodes[item.ID] = {
                        id: item.ID,
                        name: item.Name,
                        describe: item.NodeDescribe,
                        code: item.Code,
                        height: item.Height,
                        width: item.Width,
                        top: item.Y,
                        left: item.X,
                        alt: true,
                        type: 'task'
                    };
                } else if (item.NodeType === 0) {
                    nodes[item.ID] = {
                        id: item.ID,
                        name: item.Name,
                        describe: item.NodeDescribe,
                        code: item.Code,
                        height: item.Height,
                        width: item.Width,
                        top: item.Y,
                        left: item.X,
                        alt: true,
                        type: 'end round'
                    };
                }
            });
            $.get(getLineListUrl, {
                flowid: temp_id, // 流程ID
                name: '', // 流程名称
                status: '', // 流向状态
                page: '', // 页码
                siez: '' // 每页数量
            }).success(rep => {
                let lines = {};
                rep.map((item, index) => {
                    originData.push(item.ID);
                    lines[item.ID] = {
                        id: item.ID,
                        name: item.Name,
                        channel: item.DirectionChannel,
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
                console.log('回显的数据999999', data);
                flow.loadData(data);
            });
        });
    }
    // 初始化
    function initFlow () {
        flow = $.createGooFlow($('#flow'), property);
        flow.setTitle(temp_name); // 设置流程名
        $('#loading').remove();
        $('#svg').remove();
        flow.onBtnSaveClick = function () {
            flow.blurItem();
            wholeUpdate(flow.$nodeData, flow.$lineData);
        };
        $nodeOkBtn.click(onSubmitNode);
        $nodeResetBtn.click(onResetNode);
        $lineOkBtn.click(onSubmitLine);
        $lineResetBtn.click(onResetLine);
        flow.onItemFocus = onItemFocus; // 获得焦点
        flow.onItemBlur = onItemBlur; // 失去焦点
        flow.onItemAdd = onItemAdd; // 添加节点和流向
        flow.onItemDel = onItemDel; // 删除节点
        // flow.onFullsreenClick = fullscreen;
        $.get(getNodeListUrl, {
            flowid: temp_id, // 流程ID
            name: '', // 节点名称
            type: '', // 节点类型
            status: 1 // 节点状态
        }).success(function (rep) {
            if (rep && rep.length) {
                actionEdit = true;
            }
            let nodes = {};
            rep.map((item, index) => {
                originData.push(item.ID);
                if (item.NodeType === 1) {
                    nodes[item.ID] = {
                        id: item.ID,
                        name: item.Name,
                        describe: item.NodeDescribe,
                        code: item.Code,
                        height: item.Height,
                        width: item.Width,
                        top: item.Y,
                        left: item.X,
                        alt: true,
                        type: 'start round mix'
                    };
                } else if (item.NodeType === 2) {
                    nodes[item.ID] = {
                        id: item.ID,
                        name: item.Name,
                        describe: item.NodeDescribe,
                        code: item.Code,
                        height: item.Height,
                        width: item.Width,
                        top: item.Y,
                        left: item.X,
                        alt: true,
                        type: 'task'
                    };
                } else if (item.NodeType === 0) {
                    nodes[item.ID] = {
                        id: item.ID,
                        name: item.Name,
                        describe: item.NodeDescribe,
                        code: item.Code,
                        height: item.Height,
                        width: item.Width,
                        top: item.Y,
                        left: item.X,
                        alt: true,
                        type: 'end round'
                    };
                }
            });
            $.get(getLineListUrl, {
                flowid: temp_id, // 流程ID
                name: '', // 流程名称
                status: '', // 流向状态
                page: '', // 页码
                siez: '' // 每页数量
            }).success(rep => {
                let lines = {};
                rep.map((item, index) => {
                    originData.push(item.ID);
                    lines[item.ID] = {
                        id: item.ID,
                        name: item.Name,
                        channel: item.DirectionChannel,
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
    }
    if (temp_id) {
        initFlow();
    } else {
        $('body').html(
            '<p style="text-align:center;padding-top:20px;color:#ccc">请先选择模板</p>'
        );
    }
});
