import { CForm, CCol, CFormInput, CButton, CToaster, CFormSelect } from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';
import getstatus from '../status';

const StateEdit = () => {
    const [toast, addToast] = useState(0)

    const toaster = React.useRef()

    const navigate = useNavigate();

    const location = useLocation();

    const [searchParams, setSearchParams] = useSearchParams();

    const isEdit = searchParams.get('edit');

    const id = searchParams.get('id');

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    const permissions = useSelector((state) => state.auth.permissions);

    const [state, setState] = useState({
        state_name: "",
        state_code: "",
        state_abbr: "",
        status: "",
        country_id: "",
    });

    const [country, setCountry] = useState([]);

    useEffect(() => {
        if (isLoggedIn === false) {
            navigate('/login');
            window.location.reload();
        }
        if (isEdit) {
            getState();
        }
        getAllCountry().then((countries) => {
            setCountry(countries.filter(v => v.status == 1));
        });
    }, [isLoggedIn]);

    const getState = () => {
        return userService.getState(id).then(
            (data) => {
                console.log(data.data.response_data);
                setState(data.data.response_data);
            },
            (error) => {
                console.log(error)
                const message =
                    (error.response && error.response.data && error.response.data.response_message) || error.message || error.toString();
                addToast(ToastMessage(message, 'danger'))
                return message;
            }
        );
    };

    const getAllCountry = () => {
        return userService.getCountries(false, 0).then(
            (data) => {
                console.log(data.data.response_data);
                return data.data.response_data;
            },
            (error) => {
                console.log(error)
                const message =
                    (error.response && error.response.data && error.response.data.response_message) || error.message || error.toString();
                addToast(ToastMessage(message, 'danger'))
                return message;
            }
        );
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (state.state_name == null || state.state_name.length < 1) {
            addToast(ToastMessage("Plese Enter State Name", 'danger'))
        } else if (state.country_id == null || state.country_id < 1) {
            addToast(ToastMessage("Please Select Country", 'danger'))
        } else {
            const data = { "state_name": state.state_name, "state_code": state.state_code, "state_abbr": state.state_abbr, "status": state.status };
            if (isEdit) {
                return userService.editState(state.country_id, id, data).then(
                    (data) => {
                        console.log(data.data.response_data);
                        navigate('/state');
                    },
                    (error) => {
                        console.log(error)
                        const message =
                            (error.response && error.response.data && error.response.data.response_message) || error.message || error.toString();
                        addToast(ToastMessage(message, 'danger'))
                        return message;
                    }
                );
            } else {
                return userService.addState(state.country_id, data).then(
                    (data) => {
                        console.log(data.data.response_data);
                        navigate('/state');
                    },
                    (error) => {
                        console.log(error)
                        const message =
                            (error.response && error.response.data && error.response.data.response_message) || error.message || error.toString();
                        addToast(ToastMessage(message, 'danger'))
                        return message;
                    }
                );
            }
        }

    };

    const onChangeName = (e) => {
        setState({ ...state, state_name: e.target.value, });
    };

    const onChangeCode = (e) => {
        setState({ ...state, state_code: e.target.value, });
    };

    const onChangeAbbr = (e) => {
        setState({ ...state, state_abbr: e.target.value, });
    };

    const onChangeCountry = (e) => {
        setState({ ...state, country_id: e.target.value, });
    };

    const onChangeStatus = (e) => {
        setState({ ...state, status: e.target.value, });
    };

    const isAddEdit = () => {
        if(isEdit){
            return !permissions.includes("EDIT_STATE");
        }
        return !permissions.includes("ADD_STATE");
    }

    return (
        <>
            <CForm className="row g-3" onSubmit={handleSubmit}>
                <h2>{isEdit ? 'Update State' : 'Add State'}</h2>
                <CCol md={12}>
                    <CFormInput type="text" id="state_name" label="State Name" onChange={onChangeName} value={state.state_name} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="number" id="state_code" label="State Code" onChange={onChangeCode} value={state.state_code} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="text" id="state_abbr" label="State Abbr" onChange={onChangeAbbr} value={state.state_abbr} />
                </CCol>
                <CCol xs={12}>
                    <CFormSelect label="Status" className="mb-3" onChange={onChangeStatus} value={state.status}>
                        <option value={""} key="">Select Status</option>
                        <option value={0} key="status_0">{getstatus(0)} </option>
                        <option value={1} key="status_1">{getstatus(1)} </option>
                    </CFormSelect>
                </CCol>
                <CCol xs={12}>
                    <CFormSelect label="Country" className="mb-3" onChange={onChangeCountry} value={state.country_id}>
                        <option value={0} key="">Select Country</option>
                        {country.map((val, key) => {
                            return (<option value={val.id} key={key}>{val.country_name} </option>)
                        })}
                    </CFormSelect>
                </CCol>

                <CCol xs={12}>
                    <CButton type="submit" color="success" variant="outline" className="me-2" disabled={isAddEdit()}>{isEdit ? 'UPDATE' : 'ADD'}</CButton>
                </CCol>
            </CForm>
            <CToaster ref={toaster} push={toast} placement="top-center" />
        </>
    )
}

export default StateEdit
