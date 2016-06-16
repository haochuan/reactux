import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import Counter from './Counter';

const routes =  (
    <Router history={hashHistory}>
        <Route name="home" path="/" component={Counter}></Route>
    </Router>  
);

export default routes;
