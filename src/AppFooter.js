import React from 'react';

export const AppFooter = (props) => {

    return (
        <div className="layout-footer">
            <img src={props.layoutColorMode === 'light' ? process.env.PUBLIC_URL + "/assets/layout/images/logo-black.png" : process.env.PUBLIC_URL + "/assets/layout/images/logo-white.png"} alt="logo" height="20" className="mr-2 -my-1" />            
            <span className="mt-2">
                Copyright © 2022 
                <span className="font-small font-bold ml-2 mr-2">Sampurna Group</span>
                All rights reserved.
            </span>
        </div>
    );
}
