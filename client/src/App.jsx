import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import LoginPage from './features/Login/Login'
import RegistrationPage from './features/Registration/Registration'
import HomePage from './features/HomePage/HomePage'

import './App.css'

export default function App() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/login" component={ LoginPage } />
                    <Route path="/register" component={ RegistrationPage } />
                    <Route path="/home" component={ HomePage } />
                </Switch>
                <Footer />
            </div>
        </Router>
    )
}

