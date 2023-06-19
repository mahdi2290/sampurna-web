import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Switch, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppConfig } from './AppConfig';

import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';

import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './assets/demo/flags/flags.css';
import './assets/demo/Demos.scss';
import './assets/layout/layout.scss';
import './App.scss';
import "./assets/css/slip_payroll.scss";
import "./assets/css/report_invoice.scss";

import Auth from './config/AuthConfig';
import { ProtectedRoute, GlobalRoute } from './config/RouteConfig';
import { MenuService } from './service/MenuService';
import Login from './components/Login/Login';
import Login_2 from './components/Login/Login_2';
import Logout from './components/Login/Logout';
import Dashboard from './components/Dashboard';
import PayslipPage from './components/report/payslip';
import AttendancePage from './components/report/attendance';
import OvertimePage from './components/report/overtime';

import HomePages from './containers/HomePages';

import PoolList from './containers/Master/PoolList';
import ProductList from './containers/Master/ProductList';
import DepartmentList from './containers/Master/DepartmentList';
import DivisionList from './containers/Master/DivisionList';
import OccupationList from './containers/Master/OccupationList';
import EmployeeList from './containers/Employee/List';
import EmployeeDetail from './containers/Employee/Detail';

import LoanList from './containers/Loan/List';
import LoanEntry from './containers/Loan/Entry';

import CustomerList from './containers/Customer/CustomerList';
import CustomerDetail from './containers/Customer/CustomerDetail';

import PriceList from './containers/Sales/PriceList';
import PriceDetail from './containers/Sales/PriceDetail';

import UjtList from './containers/Ujt/UjtList';
import UjtDetail from './containers/Ujt/UjtDetail';

import PoSalesList from './containers/Sales/PurchaseOrderList';
import PoSalesDetail from './containers/Sales/PurchaseOrderDetail';

import FleetTypeList from './containers/Master/FleetTypeList';
import FleetFormationList from './containers/Fleet/FleetFormationList';

import BankList from './containers/Bank/List';
import BankDetail from './containers/Bank/Detail';
import CashierList from './containers/Cashier/cashier_list';
import ClosingShift from './containers/Cashier/closing_shift';
import CashierDailyReport from './containers/Cashier/cashier_report_daily';
import CashierDropList from './containers/Cashier/cashier_drop_list';

import FleetList from './containers/Fleet/FleetList';
import FleetEntry from './containers/Fleet/FleetEntry';
import OrderList from './containers/TMS/OrderList';

import POIPages from './containers/TMS/POIPages';
import GlobalProvider from './config/Context';

import CargoList from './containers/Sales/Cargo/List';
import DOModify from './containers/Sales/Cargo/DOModify';
import MDModify from './containers/Sales/Cargo/MDModify';

import OrderCargoDetailNonUJT from './containers/Sales/OrderCargoDetailNonUJT';
import OrderCargoListNonUJT from './containers/Sales/OrderCargoListNonUJT';

import OriginList from './containers/Purchase/OriginList';
import OriginDetail from './containers/Purchase/OriginDetail';

import TransporterList from './containers/Purchase/TransporterList';
import TransporterDetail from './containers/Purchase/OriginDetail';

import SupplierList from './containers/Purchase/SupplierList';
import SupplierDetail from './containers/Purchase/SupplierDetail';

import CostList from './containers/Purchase/CostList';
import CostListDetail from './containers/Purchase/CostListDetail';

import PayrollList from './containers/Payroll/list';
import PayrollEntry from './containers/Payroll/entry';
import SlipPage from './containers/Payroll/slip';
import MapsIndex from './containers/Maps/MapsIndex';
import ScheduleList from './containers/Schedule/list';
import ScheduleCreate from './containers/Schedule/create';
import ScheduleCreateNew from './containers/Schedule/create_new';
import FleetFormationModify from './containers/Fleet/FleetFormationModify';
import InvoiceList from './containers/Sales/Invoice/InvoiceList';
import InvoiceManualList from './containers/Sales/Invoice/InvoiceManualList';
import InvoiceCreate from './containers/Sales/Invoice/InvoiceCreate';
import InvoiceManualCreate from './containers/Sales/Invoice/InvoiceManualCreate';
import Mixer from './containers/Mixer/List';
import FinanceCashierList from './containers/Finance/cashier-list';



const App = () => {
    const [menuModel, setMenuModel] = useState();
    const [layoutMode, setLayoutMode] = useState('overlay');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        let inputStyleStorage = localStorage.getItem("inputStyle");
        let localModeStorage = localStorage.getItem("layoutMode");
        let rippleStorage = localStorage.getItem("ripple");

        if (inputStyleStorage) {
            setInputStyle(inputStyleStorage);
        } else {
            setInputStyle("outlined");
        }

        if (localModeStorage && Auth.isAuthenticated()) {
            setLayoutMode(localModeStorage);
        } else {
            if (Auth.isAuthenticated()) {
                setLayoutMode("static");
            } else {
                setLayoutMode("overlay");
            }
        }

        if (rippleStorage) {
            setRipple(rippleStorage);
        } else {
            setRipple(true);
        }

        const menuService = new MenuService();

        menuService.getMenu().then(res => setMenuModel(res.data));
    }, [localStorage]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);

        localStorage.setItem("inputStyle", inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)

        localStorage.setItem("ripple", e.value);
    }

    const onLayoutModeChange = (mode) => {
        if (Auth.isAuthenticated()) {
            setLayoutMode(mode);
        } else {
            setLayoutMode("overlay");
        }

        localStorage.setItem("layoutMode", mode);
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

    return (
        <>
            { Auth.isAuthenticated() ?
                <div className={wrapperClass} onClick={onWrapperClick}>
                    <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

                    <div>
                        <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
                            mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />

                        <div className="layout-sidebar" onClick={onSidebarClick}>
                            <AppMenu model={menuModel} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
                        </div>

                        <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                            layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />
                    </div>

                    <div className="layout-main-container">
                        <div className="layout-main">
                            <Switch>
                                <ProtectedRoute path="/" exact component={Dashboard} />
                                <ProtectedRoute path="/slip" exact component={SlipPage} />
                                <ProtectedRoute path="/pool/list" exact component={PoolList} />
                                <ProtectedRoute path="/department/list" exact component={DepartmentList} />
                                <ProtectedRoute path="/division/list" exact component={DivisionList} />
                                <ProtectedRoute path="/occupation/list" exact component={OccupationList} />

                                <ProtectedRoute path="/product/list" exact component={ProductList} />
                                <ProtectedRoute path="/customer/list" exact component={CustomerList} />
                                <ProtectedRoute path="/customer/create" exact component={CustomerDetail} />
                                <ProtectedRoute path="/customer/edit/:id" exact component={CustomerDetail} />

                                <ProtectedRoute path="/price/list" exact component={PriceList} />
                                <ProtectedRoute path="/price/create" exact component={PriceDetail} />
                                <ProtectedRoute path="/price/edit/:id" exact component={PriceDetail} />

                                <ProtectedRoute path="/ujt/list" exact component={UjtList} />
                                <ProtectedRoute path="/ujt/create" exact component={UjtDetail} />
                                <ProtectedRoute path="/ujt/edit/:id" exact component={UjtDetail} />

                                <ProtectedRoute path="/po/sales/list" exact component={PoSalesList} />
                                <ProtectedRoute path="/po/sales/create" exact component={PoSalesDetail} />
                                <ProtectedRoute path="/po/sales/edit/:id" exact component={PoSalesDetail} />

                                <ProtectedRoute path="/purchase/master/origin/list" exact component={OriginList} />
                                <ProtectedRoute path="/purchase/master/origin/create" exact component={OriginDetail} />

                                <ProtectedRoute path="/purchase/master/transporter/list" exact component={TransporterList} />
                                <ProtectedRoute path="/purchase/master/transporter/create" exact component={TransporterDetail} />

                                <ProtectedRoute path="/purchase/master/supplier/list" exact component={SupplierList} />
                                <ProtectedRoute path="/purchase/master/supplier/create" exact component={SupplierDetail} />

                                <ProtectedRoute path="/purchase/master/cost/list" exact component={CostList} />
                                <ProtectedRoute path="/purchase/master/cost/create" exact component={CostListDetail} />

                                <ProtectedRoute path="/sales/cargo/order/list" exact component={CargoList} />
                                <ProtectedRoute path="/sales/cargo/order/create" exact component={DOModify} />
                                <ProtectedRoute path="/sales/cargo/order/edit/:id" exact component={DOModify} />

                                <ProtectedRoute path="/sales/cargo/order-nonujt/list" exact component={OrderCargoListNonUJT} />
                                <ProtectedRoute path="/sales/cargo/order-nonujt/detail" exact component={OrderCargoDetailNonUJT} />

                                <ProtectedRoute path="/sales/schedule/list" exact component={ScheduleList} />
                                <ProtectedRoute path="/sales/schedule/create" exact component={ScheduleCreate} />
                                <ProtectedRoute path="/sales/schedule/create_new" exact component={ScheduleCreateNew} />
                                <ProtectedRoute path="/sales/schedule/edit/:id" exact component={ScheduleCreate} />

                                <ProtectedRoute path="/sales/office/invoice/list" exact component={InvoiceList} />
                                <ProtectedRoute path="/sales/office/invoice/create" exact component={InvoiceCreate} />
                                <ProtectedRoute path="/sales/office/invoice/edit/:id" exact component={InvoiceCreate} />
                                <ProtectedRoute path="/sales/office/invoice-manual/list" exact component={InvoiceManualList} />
                                <ProtectedRoute path="/sales/office/invoice-manual/create" exact component={InvoiceManualCreate} />
                                <ProtectedRoute path="/sales/office/invoice-manual/edit/:id" exact component={InvoiceManualCreate} />
                                <ProtectedRoute path="/sales/order/MultiDrop" exact component={MDModify} />

                                <ProtectedRoute path="/employee/list" exact component={EmployeeList} />
                                <ProtectedRoute path="/employee/create" exact component={EmployeeDetail} />
                                <ProtectedRoute path="/employee/edit/:id" exact component={EmployeeDetail} />

                                <ProtectedRoute path="/loan/list" exact component={LoanList} />
                                <ProtectedRoute path="/loan/create" exact component={LoanEntry} />
                                <ProtectedRoute path="/loan/edit/:id" exact component={LoanEntry} />

                                <ProtectedRoute path="/fleet-type/list" exact component={FleetTypeList} />
                                <ProtectedRoute path="/fleet-formation/list" exact component={FleetFormationList} />
                                <ProtectedRoute path="/fleet-formation/create" exact component={FleetFormationModify} />
                                <ProtectedRoute path="/fleet-formation/edit/:id" exact component={FleetFormationModify} />

                                <ProtectedRoute path="/fleet/list" exact component={FleetList} />
                                <ProtectedRoute path="/fleet/create" exact component={FleetEntry} />
                                <ProtectedRoute path="/fleet/edit/:id" exact component={FleetEntry} />

                                <ProtectedRoute path="/bank/list" exact component={BankList} />
                                <ProtectedRoute path="/bank/create" exact component={BankDetail} />
                                <ProtectedRoute path="/bank/edit/:id" exact component={BankDetail} />

                                <ProtectedRoute path="/cashier" exact component={CashierList} />
                                <ProtectedRoute path="/closing-shift" exact component={ClosingShift} />
                                <ProtectedRoute path="/cashier/report" exact component={CashierDailyReport} />

                                <ProtectedRoute path="/cashier/drop" exact component={CashierDropList} />

                                <ProtectedRoute path="/finance/cashier-list" exact component={FinanceCashierList} />

                                <ProtectedRoute path="/payroll/list" exact component={PayrollList} />
                                <ProtectedRoute path="/payroll/create" exact component={PayrollEntry} />
                                <ProtectedRoute path="/payroll/edit/:id" exact component={PayrollEntry} />

                                <ProtectedRoute path="/mixer/list" exact component={Mixer} />

                                <ProtectedRoute path="/home" exact component={HomePages} />
                                <ProtectedRoute path="/payslip" exact component={PayslipPage} />
                                <ProtectedRoute path="/attendance" exact component={AttendancePage} />
                                <ProtectedRoute path="/overtime" exact component={OvertimePage} />
                                <ProtectedRoute path="/order/list" exact component={OrderList} />
                                <ProtectedRoute path="/poi" exact component={POIPages} />
                                <ProtectedRoute path="/map" exact component={MapsIndex} />
                                <ProtectedRoute path="/logout" exact component={Logout} />
                            </Switch>
                        </div>

                        <AppFooter layoutColorMode={layoutColorMode} />
                    </div>

                    <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                        <div className="layout-mask p-component-overlay"></div>
                    </CSSTransition>
                </div>
                :
                <div className='background'>
                    <Switch>
                        <GlobalRoute path="/" exact component={Login} />
                        <GlobalRoute path="/login" exact component={Login} />
                        <GlobalRoute path="/login_refresh" exact component={Login_2} />
                        <GlobalRoute path="*" exact component={Login} />
                    </Switch>
                </div>
            }
        </>
    );

}

export default GlobalProvider(App);
