import * as SalesTypeMaster from '../../service/Sales/SalesType';
import * as OrderTypeMaster from '../../service/Sales/OrderTypeService';
import * as FleetTypeMaster from '../../service/Fleet/FleetTypeService';
import * as FleetService from '../../service/Fleet/FleetService';
import * as OriginMaster from '../../service/Origin/OriginService';
import * as PlantMaster from '../../service/Customer/PlantService';
import * as EmployeeMaster from '../../service/Employee/EmployeeService';
import * as CashierTypeMaster from '../../service/Employee/CashierTypeService';
import * as BusinessService from '../../service/Master/BusinessService';
import * as ProductMaster from '../../service/Master/ProductService';
import * as DepartmentService from "../../service/Master/DepartmentService";
import * as PoolService from '../../service/Master/PoolService';
import * as FleetFormationService from '../../service/Fleet/FleetFormationService';
import * as CustomerService from '../../service/Customer/CustomerService';
import * as FormationService from '../../service/Fleet/FormationService';
import * as CashierList from '../../service/Finance/CashierFilter'

export async function APICompany (keyword) {
    const res = await BusinessService.GetAll(keyword);

    if (res.status === 200) { return res.data.list }

    return null;
}

export async function APIDepartment (keyword) {
    const res = await DepartmentService.GetList(keyword);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APIBisnisUnit (keyword) {
    const res = await SalesTypeMaster.GetList(keyword);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APIOrderType (company_id, keyword) {
    const res = await OrderTypeMaster.GetList(company_id, keyword);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APIFleetTypeAll (keyword) {
    const res = await FleetTypeMaster.GetListAll(keyword);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APIFleetType (company_id, keyword) {
    const res = await FleetTypeMaster.GetList(company_id, keyword);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APIOriginChild (keyword) {
    const res = await OriginMaster.GetChildList(keyword);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APIOriginParent (keyword) {
    const res = await OriginMaster.GetParentList(keyword);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APIPlant (keyword) {
    const res = await PlantMaster.GetAll(keyword);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APIProduct (keyword) {
    const res = await ProductMaster.GetList(keyword);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APIEmployeeCompany (company_id, keyword) {
    const res = await EmployeeMaster.GetListCompany(company_id, keyword);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APIEmployeeAll (params) {
    const res = await EmployeeMaster.GetListAll(params);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APICashierTypeLoan (keyword) {
    const res = await CashierTypeMaster.GetListLoan(keyword);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APICashierTypeUJT (keyword) {
    const res = await CashierTypeMaster.GetListUJT(keyword);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APIPool (keyword) {
    const res = await PoolService.GetList(keyword);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APIPoolWithToken (token, keyword) {
    const res = await PoolService.GetListWithToken(token, keyword);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APIFleet (business_id, params) {
    const res = await FleetService.GetList(business_id, params);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APIDriverFormation (issue_date, order_id, plate_no) {
    const params = { issue_date: issue_date, order_id: order_id, plate_no: plate_no }

    const res = await FleetFormationService.GetDriverList(params);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APICustomer (keyword) {
    const res = await CustomerService.GetList(keyword);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APIFormation (business_id, keyword) {
    const res = await FormationService.GetList(business_id, keyword);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APICompanies (keyword) {
    const res = await CashierList.GetList(keyword);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APIPools (keyword) {
    const res = await PoolService.GetList(keyword);

    if (res.status === 200) { return res.data }

    return null;
}

export async function APIFormationData (keyword) {
    const res = await FormationService.GetList(keyword);

    if (res.status === 200) { return res.data }

    return null;
}
