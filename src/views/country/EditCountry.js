import { CForm, CCol, CFormInput, CButton, CToaster, CFormSelect } from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';
import getstatus from '../status';

const CountryEdit = () => {
    const [toast, addToast] = useState(0)

    const toaster = React.useRef()

    const navigate = useNavigate();

    const location = useLocation();

    const [searchParams, setSearchParams] = useSearchParams();

    const isEdit = searchParams.get('edit');

    const id = searchParams.get('id');

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

    const [country, setCountry] = useState({
        country_name: "",
        country_abbr: "",
        country_code: "",
        status: "",
    });

    useEffect(() => {
        console.log("yes");
        if (isLoggedIn === false) {
            navigate('/login');
            window.location.reload();
        }
        if (isEdit) {
            getCountry();
        }
    }, [isLoggedIn]);

    const getCountry = () => {
        return userService.getCountry(id).then(
            (data) => {
                console.log(data.data.response_data);
                setCountry(data.data.response_data);
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
        const data = { "country_name": country.country_name, "country_code": country.country_code, "country_abbr": country.country_abbr, "status": country.status };
        if (isEdit) {
            return userService.editCountry(id, data).then(
                (data) => {
                    console.log(data.data.response_data);
                    navigate('/country');
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
            return userService.addCountry(data).then(
                (data) => {
                    console.log(data.data.response_data);
                    navigate('/country');
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

    };

    const onChangeName = (e) => {
        setCountry({ ...country, country_name: e.target.value, });
    };

    const onChangeCode = (e) => {
        setCountry({ ...country, country_code: e.target.value, });
    };

    const onChangeAbbr = (e) => {
        setCountry({ ...country, country_abbr: e.target.value, });
    };

    const onChangeStatus = (e) => {
        setCountry({ ...country, status: e.target.value, });
    };

    return (
        <>
            <CForm className="row g-3" onSubmit={handleSubmit}>
                <h2>{isEdit ? 'Update Country' : 'Add Country'}</h2>
                <CCol md={12}>
                    <CFormInput type="text" id="country_name" label="Country Name" onChange={onChangeName} value={country.country_name} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="number" id="country_code" label="Country Code" onChange={onChangeCode} value={country.country_code} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="text" id="country_abbr" label="Country Abbr" onChange={onChangeAbbr} value={country.country_abbr} />
                </CCol>
                <CCol xs={12}>
                    <CFormSelect label="Status" className="mb-3" onChange={onChangeStatus} value={country.status}>
                        <option value={""} key="">Select Status</option>
                        <option value={0} key="status_0">{getstatus(0)} </option>
                        <option value={1} key="status_1">{getstatus(1)} </option>
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

export default CountryEdit
