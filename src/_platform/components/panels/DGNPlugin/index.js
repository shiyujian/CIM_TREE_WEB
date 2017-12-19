/**
*
* Copyright (c) 2016-present, ecidi.
* All rights reserved.
* 
* This source code is licensed under the GPL-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
import React, {Component} from 'react';
import createFetchAction from '../../fetchAction';
import {Modal,notification} from 'antd';

const getPlugins = () =>{
    $.support.cors = true;
    return new Promise(function(resolve, reject){
        $.ajax({
            "async": true,
            "crossDomain": true,
            "url": API_CONFIG.pluginAddress,
            "method": "GET",
            beforeSend: function auth(xhr) {
                xhr.setRequestHeader('Authorization', `Basic ${btoa(API_CONFIG.pp)}`);
            },
            success: function successCallback(data) {
                resolve(data);
            },
            error: function errorCallback(xhr) {
                reject(xhr);
            },
        });
    });
}

//模型插件下载及更新判断
export const DGNPlugin = (dgnPlugin) =>{
	dgnPlugin = dgnPlugin || window.dgn;
	//监测插件及模型是否下载了
    try {
        let v = dgnPlugin.GetOCXVersion();
        //检查IE active插件是否需要更新
        notification.info({
            message: '当前插件版本：'+v,
            duration: 2
        })
        // message.info('当前插件版本：'+v);
        getPlugins().then((ele) => {
            //debugger
            console.log('pluginsData:',ele);
            const plugins = ele;
            //debugger
            let data;
            for (var i = 0; i < plugins.length; i++) {
                if(plugins[i].name.indexOf('WebBIM') > -1)
                    data = plugins[i];
            };
            if(!data){
                Modal.warning({
                    title: '三维模型插件下载更新',
                    content: (<div>
                        <p>服务器端找不到DGN插件,请联系管理员！</p>
                    </div>),
                    okText: '确定',
                    onOk() {
                    },
                });
            }else{
                //debugger;
                let name = data.name.split('_')[2];
                let v1 = name.substring(0, name.length - 4);
                if (v1 > v) {
                    Modal.warning({
                        title: '三维模型插件下载更新',
                        content: (<div>
                            <p>当前版本：<span style={{color: 'blue'}}>{v}</span></p>
                            <p>最新版本：<span style={{color: 'green'}}>{v1}</span>
                            </p>
                            <p>为了更好的体验三维模型，请点击“确定”下载最新版本，并在下载安装完成之后重启浏览器。</p>
                        </div>),
                        okText: '确定',
                        onOk() {
                            let link = document.createElement('a');
                            link.download = data.name;
                            link.href = data.download_url;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            link = null;
                        },
                    });
                }
            }
        });
    }catch (err) {
        notification.warning({
            message: 'DGN插件未安装或未成功加载!',
            duration: 2
        })
        //未安装IE active控件，下载控件
        /*try{
            Modal.warning({
                title: '三维模型插件下载安装',
                content: '为了更好的体验三维模型，请点击“确定”下载最新版本，并在下载安装完成之后重启浏览器。',
                okText: '确定',
                onOk() {
                    getPlugins().then((ele) => {
                        const plugins = ele;
                        let data;
                        for (var i = 0; i < plugins.length; i++) {
                            if(plugins[i].name.indexOf('WebBIM') > -1)
                                data = plugins[i];
                        };
                        if(!data){
                            Modal.warning({
                                title: '三维模型插件下载更新',
                                content: (<div>
                                    <p>服务器端找不到DGN插件,请联系管理员！</p>
                                </div>),
                                okText: '确定',
                                onOk() {
                                },
                            });
                        }else{
                            let link = document.createElement('a');
                            link.download = data.name;
                            link.href = data.download_url;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            link = null;
                        }
                    });
                },
            });
        }catch(err2){
            Modal.warning({
                title: '插件下载',
                content: '三维模型浏览插件下载失败',
                okText: '确定',
                onOk() {
                }
            });
        }*/
    }
}

(function checkWindowBtoaCompatibility() {
	if ('btoa' in window) {
		return;
	}

	var digits =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	window.btoa = function windowBtoa(chars) {
		var buffer = '';
		var i, n;
		for (i = 0, n = chars.length; i < n; i += 3) {
			var b1 = chars.charCodeAt(i) & 0xFF;
			var b2 = chars.charCodeAt(i + 1) & 0xFF;
			var b3 = chars.charCodeAt(i + 2) & 0xFF;
			var d1 = b1 >> 2, d2 = ((b1 & 3) << 4) | (b2 >> 4);
			var d3 = i + 1 < n ? ((b2 & 0xF) << 2) | (b3 >> 6) : 64;
			var d4 = i + 2 < n ? (b3 & 0x3F) : 64;
			buffer += (digits.charAt(d1) + digits.charAt(d2) +
			digits.charAt(d3) + digits.charAt(d4));
		}
		return buffer;
	};
})();