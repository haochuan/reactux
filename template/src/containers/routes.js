import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import Counter from './Counter';
import TabOne from '../components/TabOne/';
import TabTwo from '../components/TabTwo/';

const routes =  (
    <Router history={hashHistory}>
        <Route name="home" path="/" component={Counter}>
            <Route path="tabone" component={TabOne} />
            <Route path="tabtwo" component={TabTwo} />
        </Route>

    </Router>  
);

export default routes;
