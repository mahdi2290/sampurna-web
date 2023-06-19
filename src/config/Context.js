import React, { Component, createContext } from "react"

const RootContext = createContext();

// Parent / Provider
const Provider = RootContext.Provider;

const GlobalProvider = (Children) => {
    return (
        class ParentComp extends Component {     
            timeout = 250;

            constructor (props) {
                super(props);

                this.state = {
                    error: false,
                    data: [],
                    count: 0
                }

                this.dispatch = this.dispatch.bind(this);
            }

            findData = (id) => {
                let index = -1;
                for (let i = 0; i < this.state.data.length; i++) {
                    if (this.state.data[i].id === id) {
                        index = i;
                        break;
                    }
                }
        
                return index;
            }

            setStateAsync(state) {
                return new Promise((resolve) => {
                    this.setState(state, resolve)
                });
            }

            dispatch = (action) => {
                if (action.type === "error-true") {
                    this.setStateAsync({error: true});

                    return this.state.error;
                }
                if (action.type === "error-false") {
                    this.setStateAsync({error: false});

                    return this.state.error;
                }
                if (action.type === "count-default") {
                    this.setStateAsync({count: 0});

                    return this.state.count;
                }
                if (action.type === "count-plus") {
                    this.setState((prevState) => ({ 
                        count: prevState.count + 1 
                    }));

                    return this.state.count;
                }
                if (action.type === "count-minus") {   
                    this.setState((prevState) => ({ 
                        count: prevState.count - 1 
                    }));

                    return this.state.count;
                }
                if (action.type === "add-data") {   
                    const index = this.findData(action.id);
                    
                    if (index < 0) {
                        this.setState({ 
                            data: [
                                ...this.state.data,
                                {
                                id: action.id,
                                data: action.data
                            }]
                        });
                    } else {
                        if (action.data === []) {
                            let _before = this.state.data[index].filter(val => val.id !== action.id);
                            console.log(_before)
                            this.setState(
                                {
                                    data: _before
                                }
                            )
                        } else {
                            this.state.data[index] = {
                                id: action.id,
                                data: action.data
                            }
                        }
                    }

                    return this.state.data;
                }
                if (action.type === "get-data") { 
                    const index = this.findData(action.id);

                    if (index >= 0) return this.state.data[index];

                    return null
                }
            }

            render() {
                return (                 
                    <Provider value={
                        {
                            state: this.state,
                            dispatch: this.dispatch
                        }
                    }>
                        <Children {...this.props} />
                    </Provider>
                )
            }
        }
    )
}

export default GlobalProvider;

// Consumer
const Consumer = RootContext.Consumer;
export const GlobalConsumer = (Children) => {
    return (
        class ParentComp extends Component {
            render() {
                return (
                    <Consumer>
                        {
                            value => {                    
                                return (
                                    <Children {...this.props} {...value} />
                                )
                            }
                        }
                    </Consumer>
                )
            }
        }
    )
}