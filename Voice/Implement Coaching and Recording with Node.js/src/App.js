import React, { Component } from 'react';

import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';

import './custom.css'

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Dashboard} />
                <Route path='/dashboard' component={Dashboard} />
                
            </Layout>
        );
    }
}
