import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import Counter from './containers/Counter';

const routes =  (
    <Router history={browserHistory}>
        <Route name="home" path="/" component={Counter}></Route>
    </Router>  
);

export default routes;
