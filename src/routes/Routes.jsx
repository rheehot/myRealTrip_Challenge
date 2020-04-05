import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from '../pages/home/HomePage'
import HotelListPage from '../pages/list/HotelListPage'

export default () => (
    <Router>
        <Route exact path="/" component={HomePage} />
        <Route path="/hotels/" component={HotelListPage} />
    </Router>
)




