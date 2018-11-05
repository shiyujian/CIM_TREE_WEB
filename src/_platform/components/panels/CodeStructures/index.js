/**
 * Copyright (c) 2016-present, ecidi.
 * All rights reserved.
 *
 * This source code is licensed under the GPL-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import { object, bool, array, func } from 'prop-types';

import './styles.less';

export class CodeStructure extends Component {
    static propTypes = {
        structure: object,
        fieldConnects: array, // 链接符
        editable: bool,
        editableConnect: bool, // 链接符是否可编辑
        handleFieldConnectChange: func // 响应 链接符改变 事件
    };

    static defaultProps = {
        structure: {},
        fieldConnects: [],
        editable: false,
        editableConnect: false // 链接符是否可编辑
    };

    maxDeepNum = 0; // initial  Count of group + field structure deep

    // 添加 侧边标题
    leftTitle = ['层级', '编码组名称', '字段名称'];

    // 设置最底层的 field struct深度
    setDeepNumOfLastFieldStrcut = (structure, numCounter = -1) => {
        if (structure.struct_type == 'group') {
            if (numCounter == -1) {
                numCounter = 0;
            }
            numCounter = numCounter + 1;
            structure.struct.forEach(item => {
                this.setDeepNumOfLastFieldStrcut(item, numCounter);
            });
        } else if (structure.struct_type == 'field') {
            if (numCounter !== -1) {
                structure.deepNum = numCounter + 1;
            } else {
                structure.deepNum = 1;
            }
            if (this.maxDeepNum < structure.deepNum) {
                this.maxDeepNum = structure.deepNum;
            }
        }
    }

    // 临时 字段属性，字段类型，字符类型，字符位数，是否可缺省
    getPropsOfFieldByName = (fieldName, editable) => {
        const fieldProps = {
            '字段类型': '常规字段',
            '字符类型': 'A',
            '字符位数': '2-3',
            '是否可缺省': '是'
        };

        const flowProps = {
            '字段类型': '常规字段',
            '字符类型': 'N',
            '字符位数': '3',
            '是否可缺省': '是'
        };

        if (editable) {
            const charType = ['A', 'N', 'C'];
            const charBit = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const nullAble = ['是', '否'];
            const selectProps = {
                '字段类型': '常规字段',
                '字符类型': <select className='structcellselect'>{charType.map((item, index) => <option key={index}>{item}</option>)}</select>,
                '字符位数': <select className='structcellselect'>{charBit.map((item, index) => <option key={index}>{item}</option>)}</select>,
                '是否可缺省': <select className='structcellselect'>{nullAble.map((item, index) => <option key={index}>{item}</option>)}</select>
            };
            return selectProps;
        }

        switch (fieldName) {
            case '流水码': return flowProps;
            default: return fieldProps;
        }
    }

    funCreateTdSet = (struct = {}, index, rowNum) => {
        if (typeof struct === 'string' && rowNum == this.maxDeepNum) {
            // 字符
            return (<td className='structtd' key={`${struct}${index}${rowNum}`}>{struct}</td>);
        } else if (struct.struct_type == 'group') {
            return (
                <td
                    className='structtd'
                    key={`${struct.code_type}->${struct.name}${index}${rowNum}`}
                    colSpan={struct.all_fields.length}
                >
                    {struct.name}
                </td>);
        } else if (struct.struct_type == 'field') {
            const rowSpan = this.maxDeepNum - struct.deepNum + 1;
            delete struct.deepNum;
            return (
                <td
                    className='structtd'
                    key={`${struct.code_type}->${struct.name}${index}${rowNum}`}
                    colSpan={struct.all_fields.length}
                    rowSpan={rowSpan}
                >
                    {struct.name}
                </td>);
        } else {
            return null;
        }
    }

    getLeftTitleTd = (index, leftTitle) => {
        if (index === 0) {
            return leftTitle[0];
        } else if (index < this.maxDeepNum) {
            return leftTitle[1];
        } else if (index === this.maxDeepNum) {
            return leftTitle[2];
        }
    }

    handleChangeConnectSelect = (e, index) => {
        if (this.props.handleFieldConnectChange) {
            const value = e.target.value;
            this.props.handleFieldConnectChange(value, index);
        }
    }

    render () {
        const {
            structure,
            fieldConnects,
            editable,
            editableConnect
        } = this.props;
        if (!structure.struct) {
            return (<div />);
        }

        // 获取编码结构的深度 值
        this.maxDeepNum = 0;
        this.setDeepNumOfLastFieldStrcut(structure);

        const trSet = [];

        let hasNextRow = true;
        let nextStruct = structure.struct; // 编码结构 的 下一层 结构;

        let rowNum = 0;
        // trSet.push(<tr key={++rowNum}>{funCreateTdSet(structure, 0)}</tr>);
        // 添加层级 标题
        trSet.push(<tr key={++rowNum}>
            {
                [
                    (<td key={`left${rowNum}`} className='structleftTitle'>层级</td>),
                    ...nextStruct.map((item, index) => {
                        return (<td key={index} className='structtd' colSpan={item.all_fields ? item.all_fields.length : 1}>{`${index + 1}级`}</td>);
                    })
                ]
            }</tr>);

        // 因为是用的是 nextStruct 因而 maxDeepNum 比实际渲染的 个数多一个，因此记录的是 maxDeepNum 相对于 rowNum多一行，指向 字符名称
        // 当rowNum == maxDeepNum 时，rowNum为 字段名称

        let noLeftTitle = true; // 是否已经添加 左标题
        while (hasNextRow) {
            let tempArr = [];
            hasNextRow = false;

            const nextTd = nextStruct.map((stt, index) => {
                if (typeof stt === 'object') {
                    hasNextRow = true;
                    tempArr = tempArr.concat(stt.struct);
                } else {
                    tempArr = tempArr.concat(stt);
                }
                return this.funCreateTdSet(stt, index, rowNum);
            }).filter(td => td !== null);
            if (noLeftTitle && rowNum < this.maxDeepNum) {
                // 添加 侧边标题
                const tdLeft = (<td
                    key={`left${rowNum}`}
                    className='structleftTitle'
                    rowSpan={this.maxDeepNum - 1}
                >
                    {
                        this.getLeftTitleTd(rowNum, this.leftTitle)
                    }
                </td>);
                trSet.push(<tr key={++rowNum}>{[tdLeft, ...nextTd]}</tr>);
                noLeftTitle = false;
            } else if (rowNum === this.maxDeepNum) {
                // 添加 侧边标题
                const tdLeft = (<td
                    key={`left${rowNum}`}
                    className='structleftTitle'
                >字段名称</td>);
                trSet.push(<tr key={++rowNum}>{[tdLeft, ...nextTd]}</tr>);
            } else {
                trSet.push(<tr key={++rowNum}>{nextTd}</tr>);
            }

            nextStruct = tempArr;
        }

        // 添加 链接符
        const connects = [
            '',
            '|',
            ' ',
            '~',
            '-',
            '_',
            '+',
            ',',
            '.',
            '#'
        ];
        if (!editableConnect) {
            const leftTitle = (<td key='leftC' className='structleftTitle'>该字段后连接符</td>);

            const nextTd = nextStruct.map((field, colIndex) => {
                const connectValue = fieldConnects[colIndex];
                const cellContent = connectValue || (field == '流水码' ? '/' : '无');
                return (<td key={colIndex} className='structtd'>{cellContent}</td>);
            });

            trSet.push(<tr key={++rowNum}>{[leftTitle, ...nextTd]}</tr>);
        } else {
            const leftTitle = (<td key='leftC' className='structleftTitle'>该字段后连接符</td>);
            const nextTd = nextStruct.map((field, colIndex) => {
                const cellContent = field == '流水码' ? '/' : '无';

                if (field !== '流水码') {
                    const selectContent = (
                        <select
                            className='structcellselect'
                            onChange={(value) => { this.handleChangeConnectSelect(value, colIndex); }}
                        >
                            {connects.map((item, index) => <option key={index} value={item}>{item}</option>)}
                        </select>);
                    return (<td key={colIndex} className='structtd'>{selectContent}</td>);
                }
                return (<td key={colIndex} className='structtd'>{cellContent}</td>);
            });
            trSet.push(<tr key={++rowNum}>{[leftTitle, ...nextTd]}</tr>);
        }

        const trProps = ['字段类型', '字符类型', '字符位数', '是否可缺省'];
        trProps.forEach((item, index) => {
            const leftTitle = (<td key={`left${index}`} className='structleftTitle'>{item.toString()}</td>);
            const nextTd = nextStruct.map((field, colIndex) => {
                return (<td key={colIndex} className='structtd'>{this.getPropsOfFieldByName(field, editable)[item]}</td>);
            });
            trSet.push(<tr key={++rowNum}>{[leftTitle, ...nextTd]}</tr>);
        });

        return (
            <table className='structtable'>
                <tbody>
                    {trSet}
                </tbody>
            </table>);
    }
}
