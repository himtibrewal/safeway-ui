import { CForm, CCol, CFormInput, CButton, CToaster, CFormSelect } from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';
import getstatus from '../status';

const CityEdit = () => {
    const [toast, addToast] = useState(0)

    const toaster = React.useRef()

    const navigate = useNavigate();

    const location = useLocation();

    const [searchParams, setSearchParams] = useSearchParams();

    const bodyData = location.state;

    const isEdit = searchParams.get('edit');

    const id = searchParams.get('id');

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

    const [district, setDistrict] = useState({
        district_name: "",
        district_code: "",
        district_abbr: "",
        status: "",
        state_id: 0,
        country_id: 0
    });

    const [country, setCountry] = useState([]);

    const [state, setState] = useState([]);

    useEffect(() => {
        if (isLoggedIn === false) {
            navigate('/login');
            window.location.reload();
        }
        if (isEdit) {
            getDistrict();
        }
        getAllCountry();
    }, [isLoggedIn]);

    const getDistrict = () => {
        return userService.getDistrict(id).then(
            (data) => {
                console.log(data.data.response_data);
                setDistrict(data.data.response_data);
                getAllState(false, 0, data.data.response_data.country_id);
            },
            (error) => {
                console.log(error)
                const message =
                    (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                addToast(ToastMessage(message, 'danger'))
                return message;
            }
        );
    };

    const getAllState = (paginated, page_number, country_id) => {
        return userService.getStates(paginated, page_number, country_id).then(
            (data) => {
                setState(data.data.response_data.filter(v => v.status == 1));
            },
            (error) => {
                console.log(error)
                const message =
                    (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                addToast(ToastMessage(message, 'danger'))
                return message;
            }
        );
    };

    const getAllCountry = () => {
        return userService.getCountries(false, 0).then(
            (data) => {
                console.log(data.data.response_data);
                setCountry(data.data.response_data.filter(v => v.status == 1));
            },
            (error) => {
                console.log(error)
                const message =
                    (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                addToast(ToastMessage(message, 'danger'))
                return message;
            }
        );
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (district.district_name == null || district.district_name.length < 1) {
            addToast(ToastMessage("Plese Enter District Name", 'danger'))
        } else if (district.state_id == null || district.state_id < 1) {
            addToast(ToastMessage("Please Select State", 'danger'))
        } else {
            const data = { "district_name": district.district_name, "district_code": district.district_code, "district_abbr": district.district_abbr, "status": district.status };
            if (isEdit) {
                return userService.editDistrict(district.state_id, id, data).then(
                    (data) => {
                        console.log(data.data.response_data);
                        navigate('/city');
                    },
                    (error) => {
                        console.log(error)
                        const message =
                            (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                        addToast(ToastMessage(message, 'danger'))
                        return message;
                    }
                );
            } else {
                return userService.addDistrict(district.state_id, data).then(
                    (data) => {
                        console.log(data.data.response_data);
                        navigate('/city');
                    },
                    (error) => {
                        console.log(error)
                        const message =
                            (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                        addToast(ToastMessage(message, 'danger'))
                        return message;
                    }
                );
            }
        }

    };

    const onChangeName = (e) => {
        setDistrict({ ...district, district_name: e.target.value, });
    };

    const onChangeCode = (e) => {
        setDistrict({ ...district, district_code: e.target.value, });
    };

    const onChangeAbbr = (e) => {
        setDistrict({ ...district, district_abbr: e.target.value, });
    };

    const onChangeStatus = (e) => {
        setDistrict({ ...district, status: e.target.value, });
    };

    const onChangeState = (e) => {
        setDistrict({ ...district, state_id: e.target.value, });
    };

    const onChangeCountry = (e) => {
        setDistrict({...district, country_id: e.target.value});
        console.log(district);
        if(e.target.value > 0){
            console.log(e.target.value);
            getAllState(false, 0, e.target.value);
        }
    };



    return (

        <>
            <CForm className="row g-3" onSubmit={handleSubmit}>
                <h2>{isEdit ? 'Update District' : 'Add District'}</h2>
                <CCol md={12}>
                    <CFormInput type="text" id="district_name" label="District Name" onChange={onChangeName} value={district.district_name} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="number" id="district_code" label="District Code" onChange={onChangeCode} value={district.district_code} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="text" id="district_abbr" label="District Abbr" onChange={onChangeAbbr} value={district.district_abbr} />
                </CCol>
                <CCol xs={12}>
                    <CFormSelect label="Status" className="mb-3" onChange={onChangeStatus} value={district.status}>
                        <option value={""} key="">Select Status</option>
                        <option value={0} key="status_0">{getstatus(0)} </option>
                        <option value={1} key="status_1">{getstatus(1)} </option>
                    </CFormSelect>
                </CCol>
                <CCol xs={12}>
                    <CFormSelect label="Country" className="mb-3" onChange={onChangeCountry} value={district.country_id}>
                        <option value={0} key="">Select Country</option>
                        {country.map((val, key) => {
                            return (<option value={val.id} key={key}>{val.country_name} </option>)
                        })}
                    </CFormSelect>
                </CCol>
                <CCol xs={12}>
                    <CFormSelect label="State" className="mb-3" onChange={onChangeState} value={district.state_id}>
                        <option value={0} key="">Select State</option>
                        {state.map((val, key) => {
                            return (<option value={val.id} key={key}>{val.state_name} </option>)
                        })}
                    </CFormSelect>
                </CCol>
                <CCol xs={12}>
                    <CButton type="submit" color="success" variant="outline" className="me-2">{isEdit ? 'UPDATE' : 'ADD'}</CButton>
                </CCol>
            </CForm>
            <CToaster ref={toaster} push={toast} placement="top-center" />
        </>
    )
}

export default CityEdit
