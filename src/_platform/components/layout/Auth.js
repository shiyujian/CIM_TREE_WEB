import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import login from '../../auth';

const noAuthModules = ['login'];
export default ({match: {params: {module = ''} = {}} = {}}) => {
    const log = login();
    const ignore = noAuthModules.some(m => m === module);
    // if (!log && !ignore) {
    //     return <Redirect to='/login' />;
    // }
    return null;
};
