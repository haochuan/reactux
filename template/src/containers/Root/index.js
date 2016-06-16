import style from './style.css';
import React from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import routes from '../routes';

const Root = ({ store }) => (
    <Provider store={store}>
        { routes }
    </Provider>
);

export default Root;
