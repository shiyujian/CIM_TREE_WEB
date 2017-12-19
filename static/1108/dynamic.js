
var listData_temp, listData = [], todayMarker;

var demo_tasks = {
	"data": [],
	"links": []
};

function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) return decodeURIComponent(r[2]); return null; //返回参数值
}

function getDoc() {
	var url_port;
	if(window.parent.config != undefined){
		url_port=window.parent.config.DOMAIN+':'+window.parent.config.API_PORT
	}
	else{
		url_port='http://192.168.3.33:6530';
	}

    var code = getUrlParam("code");

	//获取模型数据的
	var arr_path = url_port+"/service/construction/api/documents/code/" + code + "/";

	// arr_path = [url_port + '0518/data/tempjson/result.json',url_port + '0518/data/tempjson/result.json'];
	$.getJSON(arr_path, null,function(doc){
		if (doc) {

			if(!doc){
				console.log("获取文档失败");
				return;
			}

			if(doc.extra_params) {
				var extra_params = doc.extra_params;
				
				var scheduleMaster = extra_params.scheduleMaster;

				var fdbConnectStr = extra_params.fdbConnectStr;
				
				if(!fdbConnectStr){
					console.log("fdbconnectSter is undefined");
					return;
				}

				for (var i = 0; i < scheduleMaster.length; i++) {
					listData.push(scheduleMaster[i]);
				}

				listData.sort(function (a, b) {
					return Date.parse(a.startTime) - Date.parse(b.startTime);//时间正序
                });
                
                listData_temp = listData;
                setRateBar();
                getGantt();
                var fisrtTime = listData[0] ? listData[0].startTime : '1900-01-01';
                initAndLoad(fdbConnectStr, fisrtTime);

			}
		}
	});
}

$(document).ready(function () {

    setTimeout("getDoc()",500);//设置三维初始化
    document.domain = "simulate.com";
});


var value = [];
var nName = [];
var nPos = [];
var Lis;


var playHandler = null;
var start_T;
var end_T;
var interval = null; //gantt图的玄幻
var idx = 0; //控制时间线的index
var rollIdx = 0; //控制是否gantt.scrollTo的执行
var stepLN;  //模拟的步长
var changeNum = parseInt($(window).width() / 100); //gantt图页面初始完成后能显示多少列
var stepTime; //模拟的时间间隔，默认是1s
var oneday = 1000 * 60 * 60 * 24;
var scale_cell_width = 70; // gantt columns Width

function tableTab() {
    if (Date.parse($("#datenow").val()) >= Date.parse($("#enddate").val())) {
        // if (($("#datenow").val()).toString() >= (endDates[endDates.length - 1]).toString()) {
        var oIpt = document.getElementById('datescroll');
        oIpt.value = 100;
        $("#btnPlay").attr("src", "images/播放.png");
        $("#btnPlay").attr("title", "播放");
        $("#btnStop").hide();
        clearInterval(playHandler);
        clearInterval(interval);
        playHandler = null;
        interval = null;
        var nextTime = $("#enddate").val();
        console.log('nextTime ', nextTime);
        setTime(nextTime);
        $("#datenow").val($("#enddate").val())
        // gantt.scrollTo(null, (endDates.length - 1) * 27);
        var daysLength = Date.parse(new Date($("#enddate").val())) - Date.parse(new Date(S_E_TIMES[0].startTime));
        // var daysLength = Date.parse(new Date(S_E_TIMES[S_E_TIMES.length - 1].endTime)) - Date.parse(new Date(S_E_TIMES[0].startTime));
        // $('.gantt_marker_content').css('top', (endDates.length - 1) * 27 + 'px');
        $('.status_line').delay(stepTime * 1000 - 100).animate({left: (daysLength / oneday) * scale_cell_width + 'px'}, stepTime * 1000);
        gantt.scrollTo((daysLength / oneday - 2) * scale_cell_width, null);
        // $('.status_line').delay(stepTime * 1000 - 100).animate({left: (daysLength / oneday + 1) * 100 + 'px'}, stepTime * 1000);
        // $('.status_line').css('left', (daysLength / oneday + 1) * 100 + 'px');
        var start_end_key = true;
        for (var k = 0; k < S_E_TIMES.length; k++) {
            var key_start = Date.parse(new Date(S_E_TIMES[k].startTime)) <= (Date.parse(new Date($("#datenow").val())));
            var key_end = Date.parse(new Date(S_E_TIMES[k].endTime)) >= (Date.parse(new Date($("#datenow").val())));
            if (key_start && key_end && start_end_key) {
                start_end_key = false;
                if (k !== 0) {
                    gantt.scrollTo(null, (k - 1) * 27);
                    $('.gantt_marker_content').css('top', (k - 1) * 27 + 'px');
                }
            }
        }
        return
    }
    idx++;
    rollIdx++;
    var daysLength = Date.parse(new Date($("#datenow").val())) - Date.parse(new Date(S_E_TIMES[0].startTime));
    //控制timeline的位置
    if(daysLength == 0){
        $('.status_line').animate({left:  scale_cell_width + 'px'}, stepTime * 1000 - 100);
    }else{
        $('.status_line').animate({left: (daysLength/oneday) * scale_cell_width + 'px'}, stepTime * 1000 - 100);
    }

    // $('.status_line').animate({left: idx * stepLN * 100 + 'px'}, stepTime * 1000 - 100);
    function gantScroll() {
        gantt.scrollTo((daysLength/oneday - 2) * scale_cell_width, null);
        // gantt.scrollTo((idx * stepLN - 2) * 100, null);
    }

    if ((rollIdx * stepLN) >= parseInt((changeNum * 0.8))) {
        setTimeout(gantScroll(), stepTime * 1000 - 100);
        rollIdx = 0;
    }
    var start_end_key = true;
    for (var k = 0; k < S_E_TIMES.length; k++) {
        var key_start = Date.parse(new Date(S_E_TIMES[k].startTime)) <= (Date.parse(new Date($("#datenow").val())) + oneday);
        var key_end = Date.parse(new Date(S_E_TIMES[k].endTime)) >= (Date.parse(new Date($("#datenow").val())) + oneday);
        if (key_start && key_end && start_end_key) {
            start_end_key = false;
            if (k !== 0) {
                gantt.scrollTo(null, (k - 1) * 27);
                $('.gantt_marker_content').css('top', (k - 1) * 27 + 'px');
            }

        }
    }
}
//停止按钮之后还原gantt图的相关参数
function intTimeLine() {
    var daysLength = Date.parse(new Date($("#startdate").val())) - Date.parse(new Date(S_E_TIMES[0].startTime));
    //gantt图移动X位置的改变
    gantt.scrollTo((daysLength / oneday - 1) * scale_cell_width, null);
    //线条位置的改变
    $('.status_line').css('left', (daysLength / oneday) * scale_cell_width + 'px');
    //让idx的值也改变，对应tableTab()
    idx = daysLength / oneday;
    // alert(idx)
    var start_end_key = true;
    for (var k = 0; k < S_E_TIMES.length; k++) {
        var key_start = Date.parse(new Date(S_E_TIMES[k].startTime)) <= (Date.parse(new Date($("#startdate").val())) + oneday);
        var key_end = Date.parse(new Date(S_E_TIMES[k].endTime)) >= (Date.parse(new Date($("#startdate").val())) + oneday);
        if (key_start && key_end && start_end_key) {
            start_end_key = false;
            if (k !== 0) {
                //gantt图移动位置的改变
                gantt.scrollTo(null, (k - 1) * 27);
                //gantt时间线文字位置的改变
                $('.gantt_marker_content').css('top', (k - 1) * 27 + 'px');
            }else{
                gantt.scrollTo(null, k * 27);
                $('.gantt_marker_content').css('top', k * 27 + 'px');
            }
        }
    }
    //gantt图的时间线还原默认值
    // idx = 0;
    // rollIdx = 0;
    // $('.status_line').css('left', '0px');
    // $('.gantt_marker_content').css('top', '0px');
    // gantt.scrollTo(0, 0);
}

//开始时间和sroll拖动，gantt图的更改
function changeTimeFunc() {
    var daysLength = Date.parse(new Date($("#datenow").val())) - Date.parse(new Date(S_E_TIMES[0].startTime));
    //gantt图移动X位置的改变
    gantt.scrollTo((daysLength / oneday - 1) * scale_cell_width, null);
    //线条位置的改变
    $('.status_line').css('left', (daysLength / oneday) * scale_cell_width + 'px');
    //让idx的值也改变，对应tableTab()
    idx = daysLength / oneday;
    var start_end_key = true;
    for (var k = 0; k < S_E_TIMES.length; k++) {
        var key_start = Date.parse(new Date(S_E_TIMES[k].startTime)) <= (Date.parse(new Date($("#datenow").val())));
        var key_end = Date.parse(new Date(S_E_TIMES[k].endTime)) >= (Date.parse(new Date($("#datenow").val())));
        if (key_start && key_end && start_end_key) {
            start_end_key = false;
            if (k !== 0) {
                //gantt图移动位置的改变
                gantt.scrollTo(null, (k - 1) * 27);
                //gantt时间线文字位置的改变
                $('.gantt_marker_content').css('top', (k - 1) * 27 + 'px');
            }else{
                gantt.scrollTo(null, k * 27);
                $('.gantt_marker_content').css('top', k * 27 + 'px');
            }
            // if (k !== 0) {
            // 	alert(k)
            // 	//gantt图移动位置的改变
            // 	gantt.scrollTo(null, (k - 1) * 27);
            // 	//gantt时间线文字位置的改变
            // 	$('.gantt_marker_content').css('top', (k - 1) * 27 + 'px');
            // }
        }
    }
}

function setRateBar() {//设置进度模拟事件
    start_T = Date.parse(listData[0].startTime);//当前时间
    var oneday = 1000 * 60 * 60 * 24;
    start_T = new Date(start_T);
    end_T = new Date(listData[listData.length - 1].endTime);
    // start_T = new Date(start_T - oneday);
    if (start_T.getMonth() < 9) {
        start_T = start_T.getFullYear() + "/0" + (start_T.getMonth() + 1) + "/" + start_T.getDate();
        end_T = end_T.getFullYear() + "/0" + (end_T.getMonth() + 1) + "/" + end_T.getDate();
    } else {
        start_T = start_T.getFullYear() + "/" + (start_T.getMonth() + 1) + "/" + start_T.getDate();
        end_T = end_T.getFullYear() + "/" + (end_T.getMonth() + 1) + "/" + end_T.getDate();
    }
    //开始结束按钮事件
    var flag_pause = false;
    $("#btnPlay").click(function () {
        document.getElementById('datescroll').value = 0;
        stepLN = getstepLength();
        if (stepLN == null || stepLN == "" || stepLN == undefined) {
            stepLN = 1;
        }

        stepTime = getstepTime();
        if (stepTime == null || stepTime == "" || stepTime == undefined) {
            stepTime = 1;
        }
        //停止按钮
        if (playHandler != null) {
            $("#btnPlay").attr("src", "images/播放.png");
            $("#btnPlay").attr("title", "播放");
            $("#btnStop").hide();
            clearInterval(playHandler);
            clearInterval(interval);
            playHandler = null;
            interval = null;
            updataFrom();
            setTimeout("intTimeLine()", stepTime * 1010)
            $("#datenow").val($("#startdate").val());
            setTime($("#startdate").val());
            document.getElementById('datescroll').value = 0;
            step = 0;
            var oTime = document.getElementById('datenow');
            oTime.vaiue = listData_temp[0].startTime.substring(0, 10);
        }
        //播放按钮
        else {
            intTimeLine();
            updataFrom();
            $("#btnPlay").attr("src", "images/停止.png");
            $("#btnPlay").attr("title", "停止");
            $("#btnStop").show();
            step = 0;
            i_listData_temp = 1;
            document.getElementById('datescroll').value = 0;
            $("#datenow").val($("#startdate").val());
            setTime($("#startdate").val());
            var daysLength = Date.parse(new Date($("#startdate").val())) - Date.parse(new Date(S_E_TIMES[0].startTime));
            idx = daysLength / oneday;
            changeScroll()
            tableTab()
            playHandler = setInterval("changeScroll()", stepTime * 1000);//开启速度
            interval = setInterval("tableTab()", stepTime * 1000)
        }
    });
    //暂停按钮
    $("#btnStop").click(function () {
        stepTime = getstepTime();
        if (!flag_pause) {
            $("#btnStop").attr("src", "images/播放.png");
            $("#btnStop").attr("title", "播放");
            clearInterval(playHandler);
            clearInterval(interval);
            // setTimeout("intTimeLine()", stepTime * 1010)
            flag_pause = true;
        } else {
            $("#btnStop").attr("src", "images/暂停.png");
            $("#btnStop").attr("title", "暂停");
            var daysLength = Date.parse(new Date($("#datenow").val())) - Date.parse(new Date(S_E_TIMES[0].startTime));
            idx = daysLength / oneday;
            playHandler = setInterval("changeScroll()", stepTime * 1000);//开启速度
            interval = setInterval("tableTab()", stepTime * 1000)
            flag_pause = false;
        }
    });
    //时间选择器
    $("#startdate").val(start_T);
    $("#enddate").val(end_T);
    $.jeDate("#startdate", {
        format: "YYYY/MM/DD",
        isTime: false,
        minDate: start_T,
        maxDate: listData[listData.length - 1].endTime,
        choosefun: function (elem, datas) {
            // updataFrom();
            // document.getElementById('datescroll').value = 0;
            updataFrom();
            document.getElementById('datescroll').value = 0;
            setTime(listData_temp[0].startTime.substring(0, 10));
            clearInterval(playHandler);
            clearInterval(interval);
            var oTime = document.getElementById('datenow');
            oTime.value = $("#startdate").val();
            changeTimeFunc();
        }
    });

    $.jeDate("#enddate", {
        format: "YYYY/MM/DD",
        isTime: false,
        minDate: start_T,
        maxDate: listData[listData.length - 1].endTime,
        choosefun: function (elem, datas) {
            updataFrom();
            document.getElementById('datescroll').value = 0;
        }
    });
    updataFrom();
    // getTimeNow(0);
    // var oTime = document.getElementById('datenow');
    // oTime.value = listData_temp[0].startTime.substring(0, 10).replace('-', '/').replace('-', '/');
    $("#datenow").val(start_T);
}

function updataFrom() {//更新属性表
    listData_temp = [];
    var flag = false;
    for (var i = 0; i < listData.length; i++) {
        if ($("#startdate").val() != "" && Date.parse(listData[i].startTime) >= Date.parse($("#startdate").val())) {
            flag = true;
        }
        if (flag) {
            listData_temp.push(listData[i]);
        }
        if ($("#enddate").val() != "" && Date.parse(listData[i].startTime) <= Date.parse($("#enddate").val())) {
            flag = false;
        }

    }
}

//滚动条设置
function changeScroll() {
    try {
        var oIpt = document.getElementById('datescroll');
        var days = getdays();
        var stepLength = getstepLength();
        if (stepLength == null || stepLength == "") {
            stepLength = 1;
        }
        step++;
        oIpt.value = step * stepLength / days * 100;
        var nowTime = getTimeNow(step * stepLength / days * 100);
        parseInt(i_listData_temp) > parseInt(listData_temp.length)
        if ((i_listData_temp < listData_temp.length)) {
            var i_start = i_listData_temp;
            while (Date.parse(nowTime) >= Date.parse(listData_temp[i_listData_temp].startTime)) {
                var strTime = listData_temp[i_listData_temp].startTime.substring(0, 10);
                setTime(strTime);
                i_listData_temp++;
            }
            if (i_start != i_listData_temp) { 
                var glowTime = DateDiff(listData_temp[i_listData_temp].startTime.substring(0, 10), listData_temp[i_listData_temp].endTime.substring(0, 10)) / stepLength * 1000;
                //search1(i_start, i_listData_temp, glowTime);
            }

        }
        if (step * stepLength >= days) {
            oIpt.value = 100;
            clearInterval(playHandler);
            console.log('nowTime ', nextTime);
            setTime(nowTime);
            playHandler = null;
            step = 0;
            $("#btnPlay").attr("src", "images/播放.png");
            $("#btnStop").hide();
            return;
        }
    } catch (e) {
    }
}
function getdays() {
    var startTime = $("#startdate").val();//当前时间
    var endTime = $("#enddate").val();
    var days = DateDiff(startTime, endTime) + 1;
    return days * 1;
}
//获取当前时间点
function getTimeNow(val) {
    var oTime = document.getElementById('datenow');
    var nowTime = $("#startdate").val();//当前时间
    var now = new Date(nowTime);
    if ($("#datenow").val() != "") {
        now.setDate(now.getDate() + Math.round(getdays() * val / 100));
        nowTime = getstrdate(now);
    }
    oTime.value = nowTime;
    return nowTime;
}
function getstrdate(now) {
    var year = now.getFullYear();
    var month = (now.getMonth() + 1).toString();
    var day = (now.getDate()).toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    var dateTime = year + "/" + month + "/" + day;
    return dateTime;
}
function DateDiff(sDate1, sDate2) {    //sDate1和sDate2是2006/12/18格式  
    var aDate, oDate1, oDate2, iDays;
    // aDate = sDate1.split("-");
    // oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);  //转换为12-18-2006格式  
    // aDate = sDate2.split("-");
    // oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);

    oDate1 = Date.parse(sDate1);
    oDate2 = Date.parse(sDate2);
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);   //把相差的毫秒数转换为天数  
    return iDays
}
function scrollchange(val) {
    var datanow = getTimeNow(val);
    step = Math.round(getdays() * val / 100) * 1;
    document.getElementById('datenow').value = datanow;
    setTime(datanow);
    $("#datenow").val(datanow);
    updataFrom();
    changeTimeFunc();
}

function json2str(o) {
    var arr = [];
    var fmt = function (s) {
        if (typeof s == 'object' && s != null) return json2str(s);
        return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s;
    }
    for (var i in o) arr.push("'" + i + "':" + fmt(o[i]));
    return '{' + arr.join(',') + '}';
}

function getstepLength() {
    var val = document.getElementById("stepLength").value;
    return Number(val);
}
function getstepTime() {
    var val = document.getElementById("stepTime").value;
    return Number(val);
}

var S_E_TIMES = [];
function getGantt() {
	function updateMode(){
		gantt.config.smart_rendering = true;
		demo_tasks.data = [];
		for (var j = 0; j < listData.length; j++) {
			var for_in_startTime = listData[j].startTime.slice(0, 10).split('-');
			var for_in_end_time = listData[j].endTime.slice(0, 10).split('-');
			var start_date = for_in_startTime[2] + '-' + for_in_startTime[1] + '-' + for_in_startTime[0];
			var end_date = for_in_end_time[0] + '-' + for_in_end_time[1] + '-' + for_in_end_time[2];
			var duration = DateDiff(for_in_startTime[0] + '-' + for_in_startTime[1] + '-' + for_in_startTime[2], end_date);
			var obj = {
				"id": listData[j]['code'],
				"text": listData[j]['name'],
				"start_date": start_date,
				"progress": 1,
				"open": true,
				"duration": duration,
				"priority": "1"
			};
			demo_tasks.data.push(obj);
			var obj_time = {
				"startTime": listData[j].startTime.slice(0, 10).replace('-', '/').replace('-', '/'),
				"endTime": listData[j].endTime.slice(0, 10).replace('-', '/').replace('-', '/')
			};
			S_E_TIMES.push(obj_time);
		}
		//gantt图的rowClick事件
		gantt.attachEvent("onTaskRowClick", function (id, row) {
			console.log(id, row)
			//id是code
			//row是当前行
			//以上代码是通过点击gantt图显示模型的闪烁，功能未加

			//以下代码主要是通过模型点击后显示相应的gantt图中位置要用到的代码
			// gantt.selectTask(demo_tasks.data[i]['id']);
			// document.getElementsByClassName('gantt_row')[i].click()
		});
		gantt.parse(demo_tasks);
	}
	var gant_startTime = listData[0].startTime.slice(0, 10).split('-');
	var gant_end_time = listData[listData.length - 1].endTime.slice(0, 10).split('-');
	gantt.config.start_date = new Date(gant_startTime[0], gant_startTime[1] - 1, gant_startTime[2]);
	gantt.config.end_date = new Date(gant_end_time[0], gant_end_time[1] - 1, gant_end_time[2]);
	//初始化添加第一条数据的时间线到甘特图上
	var start = new Date(gant_startTime[0], gant_startTime[1] - 1, gant_startTime[2]);
	todayMarker = gantt.addMarker({
		start_date: start,
		css: "status_line",
		text: "当前节点"
	});
    gantt.config.max_column_width = 70;
    gantt.config.min_column_width = 70;
	gantt.config.date_scale = "%Y年 %m月";
	gantt.config.scale_unit = "month";
	gantt.config.readonly = true;
	gantt.config.subscales = [{
		unit: "day",
		step: 1,
		date: "%d日"
	}];
	gantt.config.scale_height = 60;
	gantt.config.columns = [
		{
			name: "text",
			label: "任务名称",
			tree: true,
            maxWidth: "100"
		}
	];
	gantt.config.static_background = true;
	gantt.init("gantt");
    updateMode();
    var days = getdays() - 1;
    if(days !== 0){
        scale_cell_width = $(".gantt_scale_line").width() / days;
    } else {
        scale_cell_width = $(".gantt_scale_line").width();
    }
    
}