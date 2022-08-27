import React from 'react';

import { Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Error from './pages/Error';

import './App.css';
import Register from './pages/auth/Register';
import LoginU from './pages/auth/LoginU';
import NavOne from './component/navbar/NavOne';
import Dashboard from './pages/Dashboard';
import FileDet from './pages/FileDet';

const App = () => {
  return (
    <>
      <NavOne />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={LoginU} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/dashboard/:fileid" component={FileDet} />

        <Route component={Error} />
      </Switch>
    </>
  );
};

export default App;
