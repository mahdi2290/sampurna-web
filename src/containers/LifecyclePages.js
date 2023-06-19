import React, { Component } from "react";
import { Button } from 'primereact/button';

// const RootContext = createContext();
// const Provider = RootContext.Provider;

class LifecyclePages extends Component {
    constructor (props) {
        super(props);

        this.state = {
            count: 1,
            name: ""
        }

        console.log("constructor");
    }

    static getDerivedStateFromProps(props, state) {
        console.log("getDerivedStateFromProps");
        return null;
    }

    componentDidMount () {
        console.log("componentDidMount");
        this.setState({
            name: "Bobby"
        });

        console.log(this.state.name);
    }

    shouldComponentUpdate (nextProps, nextState) {
        console.log("shouldComponentUpdate");
        console.log("next props", nextProps);
        console.log("next state", nextState);

        if (nextState.count >= 4) {
            return false;
        }
        return true;
    }

    getSnapshotBeforeUpdate (prevProps, prevState) {
        console.log("getSnapshotBeforeUpdate");
        return null;
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        console.log("componentDidUpdate");
    }

    componentWillUnmount() {
        console.log("componentWillUnmount");
    }

    changeCount = () => {
        this.setState({
            count: this.state.count + 1
        });
    }
    
    render() {
        return <div>
            <p>Lifecycle</p>
            <Button icon="pi pi-plus" className="p-button-success mr-2" label={ "Add " + this.state.count} onClick={this.changeCount}/>
        </div>
    }
}

export default LifecyclePages;