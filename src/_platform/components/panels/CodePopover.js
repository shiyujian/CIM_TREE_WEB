import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './CodeStructure.less';
import * as actions from '_platform/store/global/dict';
import { Select, Input, Popover } from 'antd';
import CodeStructure from './CodeStructure';
import { CODE_PROJECT } from '_platform/api';

const Option = Select.Option;
@connect(
    state => {
        const { platform = {} } = state;
        return platform;
    },
    dispatch => ({
        actions: bindActionCreators(actions, dispatch)
    })
)
export default class CodePopover extends Component {
    static propTypes = {
        dataSource: PropTypes.object,
        name: PropTypes.string
    };

    constructor (props) {
        super(props);
        this.state = {
            value: '',
            visible: false,
            values: {},
            structure: {},
            fields: []
        };
    }

    componentWillReceiveProps (nextProps) {
        const { dataSource: { all_fields: nextFields = [] } = {} } = nextProps;
        const { dataSource: { all_fields = [] } = {} } = this.props;
        if (nextFields.length !== all_fields.length) {
            this.getFieldOptions(nextFields);
        }
    }

    componentDidMount () {
        const { dataSource: { all_fields = [] } = {} } = this.props;
        this.getFieldOptions(all_fields);
    }

    getFieldOptions (all_fields = []) {
        const { actions: { getProjectFieldValues } } = this.props;
        const fields = all_fields.filter((item, pos) => all_fields.indexOf(item) === pos);

        const promises = fields.map(field => {
            return getProjectFieldValues({}, { project: CODE_PROJECT, dict_field: field });
        });
        Promise.all(promises).then((rst = []) => {
            const state = {};
            fields.forEach((field, index) => {
                const { results = [] } = rst[index] || {};
                state[field] = results.map(item => {
                    return <Option key={item.value}>{item.value}</Option>;
                }
                );
            });
            this.setState({ fields: state });
        });
    }

    render () {
        const { value, dataSource = {} } = this.props;
        const { all_fields = [] } = dataSource || {};
        const { fields = [], values = {} } = this.state;
        return (
            <div className='code-picker'>
                <Popover style={{ width: '200%' }} placement='bottom' visible={this.state.visible}
                    content={
                        <CodeStructure {...this.props} trigger='focus' onChange={this.change.bind(this)}
                            onClose={this.close.bind(this)}>
                            <tr>
                                <td className='title'>字段值</td>
                                {
                                    all_fields.map((field, index) => {
                                        return (
                                            <td key={index}>
                                                <Select onChange={this.change.bind(this, field)} value={values[field]} style={{ width: '100%' }}>
                                                    {fields[field]}
                                                </Select>
                                            </td>);
                                    })
                                }
                            </tr>
                        </CodeStructure>}>
                    <Input size='default' readOnly value={value} onFocus={this.focus.bind(this)} />
                </Popover>
            </div>);
    }

    focus () {
        this.setState({ visible: true });
    }

    close () {
        this.setState({ visible: false });
    }

    change (field, value) {
        const { onChange } = this.props;
        let { values } = this.state;
        values = { ...values, [field]: value };
        const codes = this.getValues(values);
        const groupValues = this.getGroupValues(values);
        this.setState({ values, fieldValues: codes, groupValues, value: codes.join('') });
        console.log(values, value, groupValues);
        onChange && onChange(codes.join(''), { fieldValues: codes, groupValues });
    }

    getValues (values) {
        const { dataSource = {} } = this.props;
        const { all_fields = [] } = dataSource || {};
        const rst = [];
        all_fields.forEach((field, index) => {
            const value = values[field];
            if (value) {
                rst.push(value);
            }
        });
        return rst;
    }

    getGroupValues (values) {
        const { dataSource: { detailed_struct = {}, all_code_groups = [] } = {} } = this.props;
        const groupValues = [];
        this.loopGroup(detailed_struct, values, groupValues);
        let rst;
        rst = groupValues.filter(value => all_code_groups.some(group => group.code_type_name === value.group));
        return rst;
    }

    loopGroup (structure = {}, values, rst = []) {
        const { code_type, struct_list: structures = [] } = structure;
        if (code_type) {
            let codes = [];
            structures.forEach(s => {
                const fields = this.loopGroup(s, values, rst);
                if (Array.isArray(fields)) {
                    codes = codes.concat(fields);
                } else {
                    codes.push(fields);
                }
            });
            rst.push({
                group: code_type,
                values: codes
            });
            return codes;
        } else {
            return values[structure];
        }
    }
}
