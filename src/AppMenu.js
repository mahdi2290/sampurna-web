import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import {Ripple} from "primereact/ripple";
import { Badge } from 'primereact/badge';
import * as FaIcons from "react-icons/fa";
import * as FcIcons from "react-icons/fc";
import * as CiIcons from "react-icons/ci";
import * as BiIcons from "react-icons/bi";
import * as HiIcons from "react-icons/hi2";

const CustomFaIcon = ({ name }) => {
    const FaIcon = FaIcons[name];
    if (!FaIcon) return <p></p>;
    
    return <FaIcon size={16} />;
};

const CustomFcIcon = ({ name }) => {
    const FcIcon = FcIcons[name];
    if (!FcIcon) return <p></p>;
    
    return <FcIcon size={16} />;
};

const CustomCiIcon = ({ name }) => {
    const CircumIcon = CiIcons[name];
    if (!CircumIcon) return <p></p>;
    
    return <CircumIcon size={16} />;
};

const CustomBiIcon = ({ name }) => {
    const BiIcon = BiIcons[name];
    if (!BiIcon) return <p></p>;
    
    return <BiIcon size={16} />;
};

const CustomHiIcon = ({ name }) => {
    const HiIcon = HiIcons[name];
    if (!HiIcon) return <p></p>;
    
    return <HiIcon key={name} size={16} />;
};

const AppSubmenu = (props) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const onMenuItemClick = (event, item, index) => {
        //avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        //execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }

        if (index === activeIndex)
            setActiveIndex(null);
        else
            setActiveIndex(index);

        if (props.onMenuItemClick) {
            props.onMenuItemClick({
                originalEvent: event,
                item: item
            });
        }
    }

    const onKeyDown = (event) => {
        if (event.code === 'Enter' || event.code === 'Space'){
            event.preventDefault();
            event.target.click();
        }
    }

    const setIconMenu = (icon) => {
        const iconType = icon.substring(0, 2).toLowerCase();
        
        if (iconType === "pi") {
            return <i className={icon}></i>
        } else if (iconType === "ci") {
            return <CustomCiIcon name={icon} />
        } else if (iconType === "fa") {
            return <CustomFaIcon name={icon} />
        } else if (iconType === "fc") {
            return <CustomFcIcon name={icon} />
        } else if (iconType === "bi") {
            return <CustomBiIcon name={icon} />
        } else if (iconType === "hi") {
            return <CustomHiIcon name={icon} />
        }
    }

    const renderLinkContent = (item) => {
        let submenuIcon = item.items && <i className="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>;
        let badge = item.badge && <Badge value={item.badge} />     

        return (
            <React.Fragment>
                {setIconMenu(item.icon)}                                
                <span className='mt-1'>{item.label}</span>
                {submenuIcon}
                {badge}
                <Ripple/>
            </React.Fragment> 
        );
    }

    const renderLink = (item, i) => {
        let content = renderLinkContent(item);

        if (item.to) {
            return (
                <NavLink aria-label={item.label} onKeyDown={onKeyDown} role="menuitem" className="p-ripple" activeClassName="router-link-active router-link-exact-active" to={item.to} onClick={(e) => onMenuItemClick(e, item, i)} exact target={item.target}>
                    {content}
                </NavLink>
            )
        }
        else {
            return (
                <a tabIndex="0" aria-label={item.label} onKeyDown={onKeyDown} role="menuitem" href={item.url} className="p-ripple" onClick={(e) => onMenuItemClick(e, item, i)} target={item.target}>
                    {content}
                </a>
            );
        }
    }

    let items = props.items && props.items.map((item, i) => {
        let active = activeIndex === i;
        let styleClass = classNames(item.badgeStyleClass, {'layout-menuitem-category': props.root, 'active-menuitem': active && !item.to });

        if(props.root) {
            return (
                <li className={styleClass} key={i} role="none">
                    {props.root === true && <React.Fragment>
                        <div className="layout-menuitem-root-text" aria-label={item.label}>{item.label}</div>
                        <AppSubmenu items={item.items} onMenuItemClick={props.onMenuItemClick} />
                    </React.Fragment>}
                </li>
            );
        }
        else {
            return (
                <li className={styleClass} key={i} role="none">
                    {renderLink(item, i)}
                    <CSSTransition classNames="layout-submenu-wrapper" timeout={{ enter: 1000, exit: 450 }} in={active} unmountOnExit>
                        <AppSubmenu items={item.items} onMenuItemClick={props.onMenuItemClick} />
                    </CSSTransition>
                </li>
            );
        }
    });

    return items ? <ul className={props.className} role="menu">{items}</ul> : null;
}

export const AppMenu = (props) => {
    return (
        <div className="layout-menu-container">
            <AppSubmenu items={props.model} className="layout-menu"  onMenuItemClick={props.onMenuItemClick} root={true} role="menu" />
            {/* <a href="https://www.primefaces.org/primeblocks-react" className="block mt-3">
                <img alt="primeblocks" className="w-full"
                     src={props.layoutColorMode === 'light' ? 'assets/layout/images/banner-primeblocks.png' : 'assets/layout/images/banner-primeblocks-dark.png'}/>
            </a> */}
        </div>
    );
}