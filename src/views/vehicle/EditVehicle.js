import { CForm, CCol, CFormInput, CButton, CToaster, CFormSelect } from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';
import getstatus from '../status';

const VehicleEdit = () => {
    const [toast, addToast] = useState(0)

    const toaster = React.useRef()

    const navigate = useNavigate();

    const location = useLocation();

    const [searchParams, setSearchParams] = useSearchParams();

    const bodyData = location.state;

    const isEdit = searchParams.get('edit');

    const id = searchParams.get('id');

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    const permissions = useSelector((state) => state.auth.permissions);

    const [vehicle, setVehicle] = useState({
        registration_no: "",
        type: "",
        brand: "",
        model: "",
        status: "",
    });

    useEffect(() => {
        if (isLoggedIn === false) {
            navigate('/login');
            window.location.reload();
        }
        if (isEdit) {
            getVehicle();
        }
    }, [isLoggedIn]);

    const getVehicle = () => {
        return userService.getVehicle(id).then(
            (data) => {
                console.log(data.data.response_data);
                setVehicle(data.data.response_data);
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

        const data = { "registration_no": vehicle.registration_no, "brand": vehicle.brand, "model": vehicle.model, "type": vehicle.type, "status": vehicle.status };
        if (isEdit) {
            return userService.editVehicle(id, data).then(
                (data) => {
                    console.log(data.data.response_data);
                    navigate('/vehicle');
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
            return userService.addVehicle(data).then(
                (data) => {
                    console.log(data.data.response_data);
                    navigate('/vehicle');
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

    const onChangeRegNo = (e) => {
        setVehicle({ ...vehicle, registration_no: e.target.value, });
    };

    const onChangeType = (e) => {
        setVehicle({ ...vehicle, type: e.target.value, });
    };

    const onChangeBrand = (e) => {
        setVehicle({ ...vehicle, brand: e.target.value, });
    };

    const onChangeModel = (e) => {
        setVehicle({ ...vehicle, model: e.target.value, });
    };

    const onChangeStatus = (e) => {
        setVehicle({ ...vehicle, status: e.target.value, });
    };

    const isAddEdit = () => {
        if (isEdit) {
            return !permissions.includes("EDIT_VEHICLE");
        }
        return !permissions.includes("ADD_VEHICLE");
    }


    return (

        <>
            <CForm className="row g-3" onSubmit={handleSubmit}>
                <h2>{isEdit ? 'Update Vehicle' : 'Add Vehicle'}</h2>
                <CCol md={12}>
                    <CFormInput type="text" id="registration_no" label="Registration Number" onChange={onChangeRegNo} value={vehicle.registration_no} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="text" id="type" label="Type" onChange={onChangeType} value={vehicle.type} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="text" id="brand" label="Brand" onChange={onChangeBrand} value={vehicle.brand} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="text" id="model" label="Model" onChange={onChangeModel} value={vehicle.model} />
                </CCol>
                <CCol xs={12}>
                    <CFormSelect label="Status" className="mb-3" onChange={onChangeStatus} value={vehicle.status}>
                        <option value={""} key="">Select Status</option>
                        <option value={0} key="status_0">{getstatus(0)} </option>
                        <option value={1} key="status_1">{getstatus(1)} </option>
                    </CFormSelect>
                </CCol>
                <CCol xs={12}>
                    <CButton type="submit" color="success" variant="outline" className="me-2" disabled={isAddEdit()} >{isEdit ? 'UPDATE' : 'ADD'}</CButton>
                </CCol>
            </CForm>
            <CToaster ref={toaster} push={toast} placement="top-center" />
        </>
    )
}

export default VehicleEdit
