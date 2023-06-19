import React, { Component } from "react";
import * as AuthService from '../../service/AuthService';

class Logout extends Component {
    componentDidMount() {
        AuthService.Logout();

        this.props.history.push('login');
    }

    render() {
        return <div>
        </div>
    }
}

export default Logout;
