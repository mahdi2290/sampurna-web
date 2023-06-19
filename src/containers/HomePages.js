import React, { Component } from "react";
import LifecyclePages from './LifecyclePages';

class HomePages extends Component {
    state = {
        showComponent: true
    }

    componentDidMount() {
        // setTimeout(() => {
        //     this.setState({
        //         showComponent: false
        //     });
        // }, 15000);
    }

    render() {
        return <div>
            {
                this.state.showComponent ?
                <LifecyclePages />
                : null
            }
        </div>
    }
}

export default HomePages;