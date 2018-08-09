import React, { Component } from 'react';
import { Button, Modal, Form, Row, Input, Tabs } from 'antd';
const TabPane = Tabs.TabPane;

class TreeMessModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount = async () => {
    };
    componentDidUpdate (prevProps, prevState) {
    }

    handleTreeModalCancel = async () => {
        await this.props.onCancel();
    }
    //  切换标签页
    tabChange (key) {
    }

    render () {
        const {
            seedlingMess,
            treeMess,
            flowMess
        } = this.props;

        let arr = [
            <Button key='back' size='large' onClick={this.handleTreeModalCancel.bind(this)}>
                关闭
            </Button>
        ];
        let footer = arr;
        return (
            <Modal
                title='树木详情'
                visible
                footer={footer}
                onOk={this.handleTreeModalCancel.bind(this)}
                onCancel={this.handleTreeModalCancel.bind(this)}
            >
                <Tabs
                    defaultActiveKey='1'
                    onChange={this.tabChange.bind(this)}
                    size='large'
                >
                    <TabPane tab='苗木信息' key='1'>
                        <Input
                            readOnly
                            style={{ marginTop: '10px' }}
                            size='large'
                            addonBefore='顺序码'
                            value={
                                seedlingMess.sxm
                                    ? seedlingMess.sxm
                                    : ''
                            }
                        />
                        <Input
                            readOnly
                            style={{ marginTop: '10px' }}
                            size='large'
                            addonBefore='打包车牌'
                            value={
                                seedlingMess.car
                                    ? seedlingMess.car
                                    : ''
                            }
                        />
                        <Input
                            readOnly
                            style={{ marginTop: '10px' }}
                            size='large'
                            addonBefore='树种'
                            value={
                                seedlingMess.TreeTypeName
                                    ? seedlingMess.TreeTypeName
                                    : ''
                            }
                        />
                        <Input
                            readOnly
                            style={{ marginTop: '10px' }}
                            size='large'
                            addonBefore='产地'
                            value={
                                seedlingMess.TreePlace
                                    ? seedlingMess.TreePlace
                                    : ''
                            }
                        />
                        <Input
                            readOnly
                            style={{ marginTop: '10px' }}
                            size='large'
                            addonBefore='供应商'
                            value={
                                seedlingMess.Factory
                                    ? seedlingMess.Factory
                                    : ''
                            }
                        />
                        <Input
                            readOnly
                            style={{ marginTop: '10px' }}
                            size='large'
                            addonBefore='苗圃名称'
                            value={
                                seedlingMess.NurseryName
                                    ? seedlingMess.NurseryName
                                    : ''
                            }
                        />
                        <Input
                            readOnly
                            style={{ marginTop: '10px' }}
                            size='large'
                            addonBefore='起苗时间'
                            value={
                                seedlingMess.LifterTime
                                    ? seedlingMess.LifterTime
                                    : ''
                            }
                        />
                        <Input
                            readOnly
                            style={{ marginTop: '10px' }}
                            size='large'
                            addonBefore='起苗地点'
                            value={
                                seedlingMess.location
                                    ? seedlingMess.location
                                    : ''
                            }
                        />
                        {seedlingMess.GD ? (
                            <div>
                                <Input
                                    readOnly
                                    style={{
                                        marginTop: '10px'
                                    }}
                                    size='large'
                                    addonBefore='高度(cm)'
                                    value={seedlingMess.GD}
                                />
                                {seedlingMess.GDFJ
                                    ? seedlingMess.GDFJ.map(
                                        src => {
                                            return (
                                                <div>
                                                    <img
                                                        style={{
                                                            width:
                                                                                  '150px',
                                                            height:
                                                                                  '150px',
                                                            display:
                                                                                  'block',
                                                            marginTop:
                                                                                  '10px'
                                                        }}
                                                        src={
                                                            src
                                                        }
                                                        alt='图片'
                                                    />
                                                </div>
                                            );
                                        }
                                    )
                                    : ''}
                            </div>
                        ) : (
                            ''
                        )}
                        {seedlingMess.GF ? (
                            <div>
                                <Input
                                    readOnly
                                    style={{
                                        marginTop: '10px'
                                    }}
                                    size='large'
                                    addonBefore='冠幅(cm)'
                                    value={seedlingMess.GF}
                                />
                                {seedlingMess.GFFJ
                                    ? seedlingMess.GFFJ.map(
                                        src => {
                                            return (
                                                <div>
                                                    <img
                                                        style={{
                                                            width:
                                                                                  '150px',
                                                            height:
                                                                                  '150px',
                                                            display:
                                                                                  'block',
                                                            marginTop:
                                                                                  '10px'
                                                        }}
                                                        src={
                                                            src
                                                        }
                                                        alt='图片'
                                                    />
                                                </div>
                                            );
                                        }
                                    )
                                    : ''}
                            </div>
                        ) : (
                            ''
                        )}
                        {seedlingMess.XJ ? (
                            <div>
                                <Input
                                    readOnly
                                    style={{
                                        marginTop: '10px'
                                    }}
                                    size='large'
                                    addonBefore='胸径(cm)'
                                    value={seedlingMess.XJ}
                                />
                                {seedlingMess.XJFJ
                                    ? seedlingMess.XJFJ.map(
                                        src => {
                                            return (
                                                <div>
                                                    <img
                                                        style={{
                                                            width:
                                                                                  '150px',
                                                            height:
                                                                                  '150px',
                                                            display:
                                                                                  'block',
                                                            marginTop:
                                                                                  '10px'
                                                        }}
                                                        src={
                                                            src
                                                        }
                                                        alt='图片'
                                                    />
                                                </div>
                                            );
                                        }
                                    )
                                    : ''}
                            </div>
                        ) : (
                            ''
                        )}
                        {seedlingMess.DJ ? (
                            <div>
                                <Input
                                    readOnly
                                    style={{
                                        marginTop: '10px'
                                    }}
                                    size='large'
                                    addonBefore='地径(cm)'
                                    value={seedlingMess.DJ}
                                />
                                {seedlingMess.DJFJ
                                    ? seedlingMess.DJFJ.map(
                                        src => {
                                            return (
                                                <div>
                                                    <img
                                                        style={{
                                                            width:
                                                                                  '150px',
                                                            height:
                                                                                  '150px',
                                                            display:
                                                                                  'block',
                                                            marginTop:
                                                                                  '10px'
                                                        }}
                                                        src={
                                                            src
                                                        }
                                                        alt='图片'
                                                    />
                                                </div>
                                            );
                                        }
                                    )
                                    : ''}
                            </div>
                        ) : (
                            ''
                        )}
                        {seedlingMess.TQHD ? (
                            <div>
                                <Input
                                    readOnly
                                    style={{
                                        marginTop: '10px'
                                    }}
                                    size='large'
                                    addonBefore='土球厚度(cm)'
                                    value={seedlingMess.TQHD}
                                />
                                {seedlingMess.TQHDFJ
                                    ? seedlingMess.TQHDFJ.map(
                                        src => {
                                            return (
                                                <div>
                                                    <img
                                                        style={{
                                                            width:
                                                                                  '150px',
                                                            height:
                                                                                  '150px',
                                                            display:
                                                                                  'block',
                                                            marginTop:
                                                                                  '10px'
                                                        }}
                                                        src={
                                                            src
                                                        }
                                                        alt='图片'
                                                    />
                                                </div>
                                            );
                                        }
                                    )
                                    : ''}
                            </div>
                        ) : (
                            ''
                        )}
                        {seedlingMess.TQZJ ? (
                            <div>
                                <Input
                                    readOnly
                                    style={{
                                        marginTop: '10px'
                                    }}
                                    size='large'
                                    addonBefore='土球直径(cm)'
                                    value={seedlingMess.TQZJ}
                                />
                                {seedlingMess.TQZJFJ
                                    ? seedlingMess.TQZJFJ.map(
                                        src => {
                                            return (
                                                <div>
                                                    <img
                                                        style={{
                                                            width:
                                                                                  '150px',
                                                            height:
                                                                                  '150px',
                                                            display:
                                                                                  'block',
                                                            marginTop:
                                                                                  '10px'
                                                        }}
                                                        src={
                                                            src
                                                        }
                                                        alt='图片'
                                                    />
                                                </div>
                                            );
                                        }
                                    )
                                    : ''}
                            </div>
                        ) : (
                            ''
                        )}
                    </TabPane>
                    <TabPane tab='树木信息' key='2'>
                        <Input
                            readOnly
                            style={{ marginTop: '10px' }}
                            size='large'
                            addonBefore='顺序码'
                            value={
                                treeMess.sxm ? treeMess.sxm : ''
                            }
                        />
                        <Input
                            readOnly
                            style={{ marginTop: '10px' }}
                            size='large'
                            addonBefore='地块'
                            value={
                                treeMess.landName
                                    ? treeMess.landName
                                    : ''
                            }
                        />
                        <Input
                            readOnly
                            style={{ marginTop: '10px' }}
                            size='large'
                            addonBefore='标段'
                            value={
                                treeMess.sectionName
                                    ? treeMess.sectionName
                                    : ''
                            }
                        />
                        <Input
                            readOnly
                            style={{ marginTop: '10px' }}
                            size='large'
                            addonBefore='小班'
                            value={
                                treeMess.SmallClass
                                    ? treeMess.SmallClass
                                    : ''
                            }
                        />
                        <Input
                            readOnly
                            style={{ marginTop: '10px' }}
                            size='large'
                            addonBefore='细班'
                            value={
                                treeMess.ThinClass
                                    ? treeMess.ThinClass
                                    : ''
                            }
                        />
                        <Input
                            readOnly
                            style={{ marginTop: '10px' }}
                            size='large'
                            addonBefore='树种'
                            value={
                                treeMess.TreeTypeName
                                    ? treeMess.TreeTypeName
                                    : ''
                            }
                        />
                        <Input
                            readOnly
                            style={{ marginTop: '10px' }}
                            size='large'
                            addonBefore='位置'
                            value={
                                treeMess.Location
                                    ? `${treeMess.LocationX},${
                                        treeMess.LocationY
                                    }`
                                    : ''
                            }
                        />
                        {treeMess.GD ? (
                            <div>
                                <Input
                                    readOnly
                                    style={{
                                        marginTop: '10px'
                                    }}
                                    size='large'
                                    addonBefore='高度(cm)'
                                    value={treeMess.GD}
                                />
                                {treeMess.GDFJ
                                    ? treeMess.GDFJ.map(src => {
                                        return (
                                            <div>
                                                <img
                                                    style={{
                                                        width:
                                                                              '150px',
                                                        height:
                                                                              '150px',
                                                        display:
                                                                              'block',
                                                        marginTop:
                                                                              '10px'
                                                    }}
                                                    src={src}
                                                    alt='图片'
                                                />
                                            </div>
                                        );
                                    })
                                    : ''}
                            </div>
                        ) : (
                            ''
                        )}
                        {treeMess.GF ? (
                            <div>
                                <Input
                                    readOnly
                                    style={{
                                        marginTop: '10px'
                                    }}
                                    size='large'
                                    addonBefore='冠幅(cm)'
                                    value={treeMess.GF}
                                />
                                {treeMess.GFFJ
                                    ? treeMess.GFFJ.map(src => {
                                        return (
                                            <div>
                                                <img
                                                    style={{
                                                        width:
                                                                              '150px',
                                                        height:
                                                                              '150px',
                                                        display:
                                                                              'block',
                                                        marginTop:
                                                                              '10px'
                                                    }}
                                                    src={src}
                                                    alt='图片'
                                                />
                                            </div>
                                        );
                                    })
                                    : ''}
                            </div>
                        ) : (
                            ''
                        )}
                        {treeMess.XJ ? (
                            <div>
                                <Input
                                    readOnly
                                    style={{
                                        marginTop: '10px'
                                    }}
                                    size='large'
                                    addonBefore='胸径(cm)'
                                    value={treeMess.XJ}
                                />
                                {treeMess.XJFJ
                                    ? treeMess.XJFJ.map(src => {
                                        return (
                                            <div>
                                                <img
                                                    style={{
                                                        width:
                                                                              '150px',
                                                        height:
                                                                              '150px',
                                                        display:
                                                                              'block',
                                                        marginTop:
                                                                              '10px'
                                                    }}
                                                    src={src}
                                                    alt='图片'
                                                />
                                            </div>
                                        );
                                    })
                                    : ''}
                            </div>
                        ) : (
                            ''
                        )}
                        {treeMess.DJ ? (
                            <div>
                                <Input
                                    readOnly
                                    style={{
                                        marginTop: '10px'
                                    }}
                                    size='large'
                                    addonBefore='地径(cm)'
                                    value={treeMess.DJ}
                                />
                                {treeMess.DJFJ
                                    ? treeMess.DJFJ.map(src => {
                                        return (
                                            <div>
                                                <img
                                                    style={{
                                                        width:
                                                                              '150px',
                                                        height:
                                                                              '150px',
                                                        display:
                                                                              'block',
                                                        marginTop:
                                                                              '10px'
                                                    }}
                                                    src={src}
                                                    alt='图片'
                                                />
                                            </div>
                                        );
                                    })
                                    : ''}
                            </div>
                        ) : (
                            ''
                        )}
                        {treeMess.MD ? (
                            <div>
                                <Input
                                    readOnly
                                    style={{
                                        marginTop: '10px'
                                    }}
                                    size='large'
                                    addonBefore='密度(棵/m^3)'
                                    value={treeMess.MD}
                                />
                                {treeMess.MDFJ
                                    ? treeMess.MDFJ.map(src => {
                                        return (
                                            <div>
                                                <img
                                                    style={{
                                                        width:
                                                                              '150px',
                                                        height:
                                                                              '150px',
                                                        display:
                                                                              'block',
                                                        marginTop:
                                                                              '10px'
                                                    }}
                                                    src={src}
                                                    alt='图片'
                                                />
                                            </div>
                                        );
                                    })
                                    : ''}
                            </div>
                        ) : (
                            ''
                        )}
                        {treeMess.MJ ? (
                            <div>
                                <Input
                                    readOnly
                                    style={{
                                        marginTop: '10px'
                                    }}
                                    size='large'
                                    addonBefore='面积(m^2)'
                                    value={treeMess.MJ}
                                />
                                {treeMess.MJFJ
                                    ? treeMess.MJFJ.map(src => {
                                        return (
                                            <div>
                                                <img
                                                    style={{
                                                        width:
                                                                              '150px',
                                                        height:
                                                                              '150px',
                                                        display:
                                                                              'block',
                                                        marginTop:
                                                                              '10px'
                                                    }}
                                                    src={src}
                                                    alt='图片'
                                                />
                                            </div>
                                        );
                                    })
                                    : ''}
                            </div>
                        ) : (
                            ''
                        )}
                        {treeMess.TQHD ? (
                            <div>
                                <Input
                                    readOnly
                                    style={{
                                        marginTop: '10px'
                                    }}
                                    size='large'
                                    addonBefore='土球厚度(cm)'
                                    value={treeMess.TQHD}
                                />
                                {treeMess.TQHDFJ
                                    ? treeMess.TQHDFJ.map(
                                        src => {
                                            return (
                                                <div>
                                                    <img
                                                        style={{
                                                            width:
                                                                                  '150px',
                                                            height:
                                                                                  '150px',
                                                            display:
                                                                                  'block',
                                                            marginTop:
                                                                                  '10px'
                                                        }}
                                                        src={
                                                            src
                                                        }
                                                        alt='图片'
                                                    />
                                                </div>
                                            );
                                        }
                                    )
                                    : ''}
                            </div>
                        ) : (
                            ''
                        )}
                        {treeMess.TQZJ ? (
                            <div>
                                <Input
                                    readOnly
                                    style={{
                                        marginTop: '10px'
                                    }}
                                    size='large'
                                    addonBefore='土球直径(cm)'
                                    value={treeMess.TQZJ}
                                />
                                {treeMess.TQZJFJ
                                    ? treeMess.TQZJFJ.map(
                                        src => {
                                            return (
                                                <div>
                                                    <img
                                                        style={{
                                                            width:
                                                                                  '150px',
                                                            height:
                                                                                  '150px',
                                                            display:
                                                                                  'block',
                                                            marginTop:
                                                                                  '10px'
                                                        }}
                                                        src={
                                                            src
                                                        }
                                                        alt='图片'
                                                    />
                                                </div>
                                            );
                                        }
                                    )
                                    : ''}
                            </div>
                        ) : (
                            ''
                        )}
                    </TabPane>
                    <TabPane tab='审批流程' key='3'>
                        <div>
                            {flowMess.length > 0
                                ? flowMess.map(flow => {
                                    let flowName = '';
                                    if (flow.Node) {
                                        if (
                                            flow.Node ===
                                                              '种树'
                                        ) {
                                            flowName =
                                                                  '施工提交';
                                        } else if (
                                            flow.Node ===
                                                              '监理'
                                        ) {
                                            if (
                                                flow.Status ===
                                                                  1
                                            ) {
                                                flowName =
                                                                      '监理通过';
                                            } else {
                                                flowName =
                                                                      '监理拒绝';
                                            }
                                        } else if (
                                            flow.Node ===
                                                              '业主'
                                        ) {
                                            if (
                                                flow.Status ===
                                                                  2
                                            ) {
                                                flowName =
                                                                      '业主抽查通过';
                                            } else {
                                                flowName =
                                                                      '业主抽查拒绝';
                                            }
                                        } else if (
                                            flow.Node ===
                                                              '补种'
                                        ) {
                                            flowName =
                                                                  '施工补录扫码';
                                        }
                                    }
                                    return (
                                        <div>
                                            <Row
                                                style={{
                                                    marginTop:
                                                                          '10px'
                                                }}
                                            >
                                                <h3
                                                    style={{
                                                        float:
                                                                              'left'
                                                    }}
                                                >
                                                    {`${flowName}:`}
                                                </h3>
                                                <div
                                                    style={{
                                                        float:
                                                                              'right'
                                                    }}
                                                >
                                                    {flow.CreateTime
                                                        ? flow.CreateTime
                                                        : ''}
                                                </div>
                                            </Row>
                                            <Row
                                                style={{
                                                    marginTop:
                                                                          '10px'
                                                }}
                                            >
                                                {`${
                                                    flow.FromUserObj
                                                        ? flow
                                                            .FromUserObj
                                                            .Full_Name
                                                        : ''
                                                }:${
                                                    flow.Info
                                                        ? flow.Info
                                                        : ''
                                                }`}
                                            </Row>
                                            <hr
                                                className='hrstyle'
                                                style={{
                                                    marginTop:
                                                                          '10px'
                                                }}
                                            />
                                        </div>
                                    );
                                })
                                : ''}
                            <div>
                                <div
                                    style={{
                                        marginTop: '10px'
                                    }}
                                >
                                    <h3>{'苗圃提交'}</h3>
                                </div>
                                <div
                                    style={{
                                        marginTop: '10px'
                                    }}
                                >
                                    {`${
                                        seedlingMess.InputerObj
                                            ? seedlingMess
                                                .InputerObj
                                                .Full_Name
                                            : ''
                                    }:${
                                        seedlingMess.Factory
                                            ? seedlingMess.Factory
                                            : ''
                                    }`}
                                </div>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </Modal>

        );
    }
}
export default Form.create()(TreeMessModal);