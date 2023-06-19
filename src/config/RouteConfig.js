import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import Auth from './AuthConfig';

export const ProtectedRoute = ({ component: Component, ...rest}) => {
    return (
        <Route
            {...rest}
            render={
                props => {
                    if (Auth.isAuthenticated()) {
                        return <Component {...props} />
                    } else {
                        return <Redirect to={
                            {
                                pathname:"/login",
                                state: {
                                    from: props.location
                                }
                            }
                        }
                        />
                    }
                }
            }
        />
    )
}

export const GlobalRoute = ({ component: Component, ...rest}) => {
    return (
        <Route
            {...rest}
            render={
                props => {
                    if (Auth.isAuthenticated()) {
                        return <Redirect to={
                            {
                                pathname:"/",
                                state: {
                                    from: props.location
                                }
                            }
                        }
                        />
                    } else {
                        return <Component {...props} />
                    }
                }
            }
        />
    )
}
