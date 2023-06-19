import React, { Fragment, useState, useRef, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { Toast } from "primereact/toast";
import MenubarComp from "../../components/standard/Menu/MenubarComp";

import * as CrudEmployee from "../../service/Employee/EmployeeService";

import * as DivisionService from "../../service/Master/DivisionService";
import * as OccupationService from "../../service/Master/OccupationService";
import * as CityService from '../../service/Master/CityService';
import * as BankService from '../../service/Bank/BankService';

import EmployeeInformation from "./Employee";
import { formatDateString } from "../../helpers/FormatHelpers";

import { APICompany, APIDepartment } from "../../components/api/APIMaster";
import PostPutValidationComp from "../../components/standard/Validation/PostPutValidationComp";

const EmployeeDetail = (props) => {
    const { id } = useParams();
    const history = useHistory();
    const toast = useRef();
    const [statusValidate, setStatusValidate] = useState(false);
    const [statusNew, setStatusNew] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [waiting, setWaiting] = useState(false);
    const [validateVisible, setValidateVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    const religionList = [
        { name: "Islam" },
        { name: "Katolik" },
        { name: "Kristen" },
        { name: "Hindu" },
        { name: "Budha" }
    ];

    const sexList = [
        { name: "Male" },
        { name: "Female" },
    ];

    const statusList = [
        { name: "Tetap" },
        { name: "Kontrak" },
        { name: "Magang" },
        { name: "Percobaan" },
        { name: "Mitra Kerja" },
    ];

    const npwpList = [
        { name: "TK0" },
        { name: "TK1" },
        { name: "TK2" },
        { name: "TK3" },
        { name: "K0" },
        { name: "K1" },
        { name: "K2" },
        { name: "K3" },
    ];

    const licenseList = [
        { name: "A" },
        { name: "A Umum" },
        { name: "B1" },
        { name: "B1 Umum" },
        { name: "B2" },
        { name: "B2 Umum" },
        { name: "C" },
        { name: "D" },
        { name: "D1" },
    ];

    // table
    const [skorModels, setSkorModels] = useState(null);

    // autocomplete state
    const [companyData, setCompanyData] = useState(null);
    const [companySelect, setCompanySelect] = useState();
    const [departmentData, setDepartmentData] = useState(null);
    const [departmentSelect, setDepartmentSelect] = useState();
    const [divisionData, setDivisionData] = useState(null);
    const [divisionSelect, setDivisionSelect] = useState();
    const [positionData, setPositionData] = useState(null);
    const [positionSelect, setPositionSelect] = useState();
    const [cityData, setCityData] = useState(null);
    const [citySelect, setCitySelect] = useState(null);
    const [licenseCitySelect, setLicenseCitySelect] = useState(null);
    const [bankData, setBankData] = useState(null);
    const [bankSelect, setBankSelect] = useState(null);
    const [religionData, setReligionData] = useState(religionList);
    const [religionSelect, setReligionSelect] = useState([]);
    const [sexData, setSexData] = useState(sexList);
    const [sexSelect, setSexSelect] = useState([]);
    const [statusData, setStatusData] = useState(statusList);
    const [statusSelect, setStatusSelect] = useState([]);
    const [npwpData, setNpwpData] = useState(npwpList);
    const [npwpSelect, setNpwpSelect] = useState([]);
    const [licenseData, setLicenseData] = useState(licenseList);
    const [licenseSelect, setLicenseSelect] = useState([]);

    // calendar state
    const [marriage, setMarriage] = useState(null);
    const [card, setCard] = useState(null);
    const [onHold, setOnHold] = useState(null);
    const [status, setStatus] = useState(null);

    let emptyModel = {
        company_id: { id: 0 },
        department_id: { id: 0 },
        division_id: { id: 0 },
        occupation_id: { id: 0 },
        city_id: { id: 0 },
        bank_id: { id: 0 },
        nik: "",
        name: "",
        alias: "",
        living_address: "",
        phone: "",
        emergency_phone: "",
        emergency_name: "",
        emergency_relation: "",
        emergency_inhouse_phone: "",
        emergency_inhouse_name: "",
        emergency_inhouse_relation: "",
        ktp: "",
        kartu_keluarga: "",
        husband_wife_name: "",
        children: 0,
        zip: "",
        bpjs: "",
        bpjs_tk: "",
        nama_kenek: "",
        ktp_address: "",
        marriage: 0,
        sex: "",
        religion: "",
        place_of_birth: "",
        date_of_birth: "",
        npwp: "",
        npwp_status: "",
        license_no: "",
        license_type: "",
        license_exp_date: "",
        license_card: 0,
        license_on_hold: 0,
        license_issue_date: "",
        license_handover_date: "",
        license_city_id: { id:0 },
        status_employee: "",
        bank_no: "",
        bank_name: "",
        bank_account_name: "",
        join_date: "",
        resign_date: "",
        resign_memo: "",
        pass_code: "",
        file: "",
        status: 0
    };

    let emptySkorModel = {
        id: 0,
        employee_id: "",
        start_date: null,
        end_date: null,
        memo: ""
    };

    const backURL = () => {
        return history.push({
            pathname: "/employee/list",
        });
    }

    const backDialog = () => {
        if (statusValidate === false) {
            backURL();
        } else {
            setValidateVisible(true);
        }
    };

    const getCompany = async(keyword) => {
        const res = await APICompany(keyword);

        setCompanyData(res);

        return res;
    }

    const getDepartment = async(keyword) => {
        const res = await APIDepartment(keyword);

        setDepartmentData(null);

        return res;
    }

    const getDivision = async(keyword) => {
        const res = await DivisionService.GetList(keyword);

        setDivisionData(null);

        return res.data;
    }

    const getPosition = async(keyword) => {
        const res = await OccupationService.GetList(keyword);

        setPositionData(null);

        return res.data;
    }

    const getCity = async(keyword) => {
        const res = await CityService.GetAll(keyword);

        setCityData(null);

        return res.data;
    }

    const getBank = async(keyword) => {
        const params = { keyword: keyword };

        const res = await BankService.GetAll(params);

        setBankData(null);

        return res.data.list;
    }

    const QueryData = async () => {
        setWaiting(true);

        if (id) {
            const res = await CrudEmployee.GetByID(id);

            const image = res.data.image_data;

            if (image !== null) {
                setImagePreview(image);
                setImageFile(null);
            } else {
                setImagePreview("/images/image-placeholder.jpg");
                setImageFile(null);
            }

            const data = res.data;

            setValues(data);

            setNpwpSelect(data.npwp_status);
            setStatusSelect(data.status_employee);
            setSexSelect(data.sex);
            setReligionSelect(data.religion);
            setCompanySelect(data.company_id);
            setDepartmentSelect(data.department_id);
            setDivisionSelect(data.division_id);
            setPositionSelect(data.occupation_id);
            setBankSelect(data.bank_id);
            setCitySelect(data.city_id);
            setLicenseCitySelect(data.license_city_id);
            setMarriage(data.marriage === 1 ? true : false );
            setCard(data.license_card === 1 ? true : false );
            setOnHold(data.license_on_hold === 1 ? true : false );
            setStatus(data.status === 1 ? true : false );
            setLicenseSelect(data.license_type);

            setSkorModels(data.employee_skorsing);

            setStatusNew(false);
        } else {
            setImagePreview("/images/image-placeholder.jpg");

            setStatusNew(true);

            setValues(emptyModel);

            setReligionSelect(religionList[0].name);
            setStatusSelect(statusList[0].name);
            setSexSelect(sexList[0].name);
            setNpwpSelect(npwpList[0].name);

            values.status_employee = statusList[0].name;
            values.religion = religionList[0].name;
            values.sex = sexList[0].name;
            values.npwp_status = npwpList[0].name;

            setCompanySelect(null);
            setDepartmentSelect(null);
            setDivisionSelect(null);
            setPositionSelect(null);
            setBankSelect(null);
            setCitySelect(null);
            setLicenseCitySelect(null);
            setMarriage(false);
            setCard(false);
            setOnHold(false);
            setLicenseSelect(null);

            setStatusValidate(false);

            setSkorModels(null);
        }

        setCompanyData(null);
        setBankData(null);
        setCityData(null);
        setDepartmentData(null);
        setDivisionData(null);
        setPositionData(null);

        setWaiting(false);
    }

    const getSex = async() => {
        setSexData(sexList);
    }

    const getReligion = async() => {
        setReligionData(religionList);
    }

    const getStatus = async() => {
        setStatusData(statusList);
    }

    const getNpwp = async() => {
        setNpwpData(npwpList);
    }

    const getLicense = async() => {
        setLicenseData(licenseList);
    }

    const setAutoCompleteSelect = (field, e) => {
        if (!e) {
            return;
        }

        switch (field) {
            case "department":
                setDepartmentSelect(e);
                values.department_id.id = e.id;
                break;
            case "division":
                setDivisionSelect(e);
                values.division_id.id = e.id;
                break;
            case "position":
                setPositionSelect(e);
                values.occupation_id.id = e.id;
                break;
            case "company":
                setCompanySelect(e);
                values.company_id.id = e.id;
                break;
            case "city":
                setCitySelect(e);
                values.city_id.id = e.id;
                break;
            case "bank":
                setBankSelect(e);
                values.bank_id.id = e.id;
                values.bank_name = e.name;
                break;
            case "sex":
                setSexSelect(e);
                values.sex = e.name;
                break;
            case "religion":
                setReligionSelect(e);
                values.religion= e.name;
                break;
            case "status":
                setStatusSelect(e);
                values.status_employee = e.name;
                break;
            case "npwp":
                setNpwpSelect(e);
                values.npwp_status = e.name;
                break;
            case "license":
                setLicenseSelect(e);
                values.license_type = e.name;
                break;
            case "license-city":
                setLicenseCitySelect(e);
                values.license_city_id.id = e.id;
                break;
            default:
                break;
        }
    }

    const getAutoCompleteQueryData = (field, e) => {
        switch (field) {
            case "department":
                return getDepartment(e);
            case "division":
                return getDivision(e);
            case "position":
                return getPosition(e);
            case "city":
                return getCity(e);
            case "bank":
                return getBank(e);
            case "company":
                return getCompany(e);
            case "sex":
                return getSex();
            case "religion":
                return getReligion();
            case "status":
                return getStatus();
            case "npwp":
                return getNpwp();
            case "license":
                return getLicense();
            case "license-city":
                return getCity(e);
            default:
                break;
        }
    }

    const onSubmited = async (values, actions) => {
        setWaiting(true);

        let form = null;
        let result = null;

        form = new FormData();

        Object.keys(emptyModel).map(key => {
            let valueData = "";
            if (values.hasOwnProperty(key)) {
                if (values[key] === null ) {
                    valueData = "";
                } else {
                    if (key.includes("date")) {
                        if (!statusNew) {
                            valueData = formatDateString(new Date(values[key]));
                        } else {
                            valueData = values[key];
                        }
                    } else {
                        valueData = values[key];
                    }
                }
            }

            if (valueData.hasOwnProperty('id')) {
                form.append(key, valueData.id);
            } else {
                if (key === "file") {
                    if (imageFile) {
                        form.append(key, imageFile);
                    } else {
                        const filename = values['image_data']
                        const url = window.URL.createObjectURL(new Blob([filename]), { type: "image/*" });
                        const file = new File([url], 'blob.jpg', { type:"image/*" });

                        form.append(key, file);
                    }
                } else {
                    form.append(key, valueData);
                }
            }

            return key;
        });

        // console.log([...form])

        if (id) {
            result = await CrudEmployee.PutData(id, form);
        } else {
            result = await CrudEmployee.PostData(form);
        }

        if (result.status === 200) {
            let data_id = 0;
            if (id) {
                data_id = id;
            } else {
                data_id = result.data.id;
            }

            setStatusValidate(false);
            setWaiting(false);

            toast.current.show({ severity: "success", summary: "Successfully", detail: result.message, life: 3000 });

            if (statusNew === false) {
                QueryData();
            } else {
                history.push({
                    pathname: "/employee/edit/" + data_id,
                    state: {}
                });
            }
        } else if (result.status === 400) {
            result.message.map((row) => {
                const field = row.field;
                const value = row.message;

                return actions.setFieldError(field, value);
            });

            setWaiting(false);
            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.title, life: 3000 });
        } else if (result.status === 401) {
            setWaiting(false);
            toast.current.show({ severity: "error", summary: "Error!!!", detail: result.message, life: 3000 });
        } else if (result.status === 402) {
            setWaiting(false);
            setErrorVisible(true);
            setErrorMessage(result.message);
        } else {
            setWaiting(false);
            setErrorVisible(true);
            setErrorMessage(result.message);
        }
    }

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } = useFormik({
        initialValues: emptyModel,
        onSubmit: onSubmited,
    });

    const onImageUpload = async({files}) => {
        const file = files[0];
        const preview = file.objectURL;

        setImagePreview(preview);

        setImageFile(file);
    }

    const callMasterData = () => {
        getSex();
        getReligion();
        getStatus();
        getNpwp();
        getLicense();
    }

    const actionSave = (field) => {

    }

    const onSetToast = (errors, message) => {
        if (errors) {
            toast.current.show({ severity: "error", summary: "Error!!!", detail: message, life: 3000 });
        } else {
            toast.current.show({ severity: "success", summary: "Successfully", detail: message, life: 3000 });
        }
    }

    useEffect(() => {
        callMasterData();

        QueryData();
    }, [props]); // eslint-disable-line react-hooks/exhaustive-deps

    const actionButtonToolbar = (e) => {
        switch (e) {
            case "back":
                backDialog();
                break;

            case "save":
                handleSubmit();
                break;

            case "new":
                if (statusNew) {
                    QueryData();
                } else {
                    history.push({
                        pathname: "/employee/create",
                    });
                }
                window.location.reload();
                break;

            default:
                break;
        }
    }

    return (
        <Fragment>
            <div className="card">
                <div className="grid crud-demo">
                    <div className="col-12">
                        <Toast ref={toast} />
                        <MenubarComp field="toolbar-detail" action="crud" actionButton={(e) => actionButtonToolbar(e)} />
                    </div>
                </div>
            </div>

            <EmployeeInformation id={id} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} values={values} handleSubmit={handleSubmit} setStatusValidate={(e) => setStatusValidate(e)}
                onSetAutoCompleteSelect={setAutoCompleteSelect} onGetAutoCompleteQueryData={getAutoCompleteQueryData} getData={QueryData}
                departmentData={departmentData} departmentValue={departmentSelect} divisionData={divisionData} divisionValue={divisionSelect}
                positionData={positionData} positionValue={positionSelect} companyData={companyData} companyValue={companySelect}
                sexData={sexData} sexValue={sexSelect} religionData={religionData} religionValue={religionSelect} statusData={statusData} statusValue={statusSelect}
                npwpData={npwpData} npwpValue={npwpSelect} licenseData={licenseData} licenseValue={licenseSelect} cityData={cityData} cityValue={citySelect} licenseCityData={cityData} licenseCityValue={licenseCitySelect}
                bankData={bankData} bankValue={bankSelect} actionSave={actionSave} skorModels={skorModels} emptySkorModel={emptySkorModel}
                marriage={marriage} setMarriage={(e) => { setMarriage(e); values.marriage = e ? 1 : 0 }}
                card={card} setCard={(e) => { setCard(e); values.license_card = e ? 1 : 0 }} status={status} setStatus={(e) => { setStatus(e); values.status = e ? 1 : 0 }}
                onHold={onHold} setOnHold={(e) => { setOnHold(e); values.license_on_hold = e ? 1 : 0 }} imagePreview={imagePreview} imageUpload={onImageUpload} setToast={onSetToast} />

            <PostPutValidationComp waitingDialog={waiting} validationVisible={validateVisible} setValidationVisible={(e) => setValidateVisible(e)} errorVisible={errorVisible} setErrorVisible={(e) => setErrorVisible(e)} message={errorMessage} actionSave={handleSubmit} backURL={backURL}/>
        </Fragment>
    )
}

export default EmployeeDetail;
