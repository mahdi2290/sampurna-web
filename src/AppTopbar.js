import React  from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { BiLogOut } from "react-icons/bi";

export const AppTopbar = (props) => {
    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <img src={props.layoutColorMode === 'light' ? process.env.PUBLIC_URL + "/assets/layout/images/logo-black.png" : process.env.PUBLIC_URL + "/assets/layout/images/logo-white.png"} alt="logo" height="20" className="mr-2 mb-2"/>
                <span>Sampurna Group</span>
            </Link>

            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars"/>
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>

                <ul className={classNames("layout-topbar-menu lg:flex origin-top", {'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                    <li>
                        <Link to="/logout">
                            <button className="p-link layout-topbar-button">
                                <BiLogOut />
                                <span>Logout</span>
                            </button>
                        </Link>
                    </li>
                </ul>
        </div>
    );
}
