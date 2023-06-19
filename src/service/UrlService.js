class UrlService {
    static UserUrl() {
        return "https://jsonplaceholder.typicode.com/users";
    }
    static PostsUrl() {
        return "http://localhost:3004/posts";
    }
    static LoginUrl() {
        return "v1/users/login";
    }
    static RefreshUrl() {
        return "v1/users/refresh";
    }

    static CityUrl() {
        return "v1/city/list";
    }
    static StateUrl() {
        return "v1/city/state";
    }
    static DistrictUrl() {
        return "v1/city/district";
    }

    static BusinessPostUrl() {
        return "v1/company";
    }

    static BankUrl() {
        return "v1/bank";
    }
    static BankPICUrl() {
        return "v1/bankpic";
    }
    static CashierUrl() {
        return "v1/cashier";
    }
    static CashierDropUrl() {
        return "v1/cashier/drop";
    }
    static ClosingShiftUrl() {
        return "v1/cashier/order/closeshift";
    }

    static FormationUrl() {
        return "v1/formation";
    }
    static FleetUrl() {
        return "v1/fleet";
    }
    static FleetTypeUrl() {
        return "v1/fleettype";
    }
    static FleetFormationUrl() {
        return "v1/fleetformation";
    }
    static FleetFormationDetailUrl() {
        return "v1/fleetformation/detail";
    }

    // Related to sales module
    static UjtUrl() {
        return "v1/ujt";
    }

    static ProductUrl() {
        return "v1/product";
    }

    //data multichips hanya utk company internal
    static InternalUrl() {
        return "v1/internal";
    }

    static CustomerUrl() {
        return "v1/customer";
    }
    static PlantUrl() {
        return "v1/plant";
    }

    static OriginUrl() {
        return "v1/origin";
    }

    static Pool() {
        return "v1/pool";
    }

    static Product() {
        return "v1/product";
    }

    static Schedule() {
        return "v1/order/schedule"
    }

    static SalesType() {
        return "v1/order/salestype"
    }
    static OrderTypeUrl() {
        return "v1/order/ordertype";
    }
    static OrderCargoUrl() {
        return "v1/order/cargo";
    }
    static OrderCargoDetailUrl() {
        return "v1/order/cargo/detail";
    }
    static OrderCargoProductUrl() {
        return "v1/order/cargo/product";
    }
    static OrderCargoStatementUrl() {
        return "v1/order/cargo/statement";
    }

    static PoSales() {
        return "v1/po/sales";
    }

    //semua data multichips untuk input master customer, origin, transporter, supplier, sparepart
    static CompanyType() {
        return "v1/companytypes"
    }

    static SalesPrice() {
        return "v1/price/sales"
    }
    // end of sales module

    // Department, Employee
    static Department() {
        return "v1/department"
    }
    static Division() {
        return "v1/division"
    }
    static Occupation() {
        return "v1/occupation"
    }
    static Employee() {
        return "v1/employee"
    }
    static EmployeeSkor() {
        return "v1/employee/skor"
    }
    static EmployeeLoan() {
        return "v1/employee/loan"
    }
    static EmployeeMemoPot() {
        return "v1/employee/memopot"
    }
    static EmployeeLoanDetail() {
        return "v1/employee/loan/detail"
    }
    static CashierTypeLoan() {
        return "v1/cashiertype/loan"
    }
    static CashierTypeUjt() {
        return "v1/cashiertype/ujt"
    }

    static PayrollDriver() {
        return "v1/payroll/driver"
    }

    static FinanceCashier() {
        return "v1/cashier/report/cashierreport"
    }

}

export default UrlService;
