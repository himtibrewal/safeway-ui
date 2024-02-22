import { CForm, CCol, CFormInput, CButton, CToaster, CFormSelect} from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';
import getstatus from '../status';

const PermissionEdit = () => {
    const [toast, addToast] = useState(0)

    const toaster = React.useRef()

    const navigate = useNavigate();

    const location = useLocation();

    const [searchParams, setSearchParams] = useSearchParams();

    // const bodyData = location.state;

    const isEdit = searchParams.get('edit');

    const id = searchParams.get('id');

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

    const [permission, setPermission] = useState({
        permission_name: "",
        permission_code: "",
        description: "",
        status:"",
    });

    useEffect(() => {
        console.log("yes");
        if (isLoggedIn === false) {
            navigate('/login');
            window.location.reload();
        }
        if (isEdit) {
            getPermissison();
        }
    }, [isLoggedIn]);

    const getPermissison = () => {
        return userService.getPermisison(id).then(
            (data) => {
                console.log(data.data.response_data);
                setPermission(data.data.response_data);
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
        const data = { "permission_name": permission.permission_name, "permission_code": permission.permission_code, "description": permission.description, "status": permission.status};
        if (isEdit) {
            return userService.editPermisison(id, data).then(
                (data) => {
                    console.log(data.data.response_data);
                    navigate('/permission');
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
            return userService.addPermisisons(data).then(
                (data) => {
                    console.log(data.data.response_data);
                    navigate('/permission');
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

    };

    const onChangeName = (e) => {
        setPermission({ ...permission, permission_name: e.target.value, });
    };

    const onChangeCode = (e) => {
        setPermission({ ...permission, permission_code: e.target.value, });
    };

    const onChangeDescription = (e) => {
        setPermission({ ...permission, description: e.target.value, });
    };

    const onChangeStatus = (e) => {
        setPermission({ ...permission, status: e.target.value, });
    };

    return (
        <>
            <CForm className="row g-3" onSubmit={handleSubmit}>
                <h2>{isEdit ? 'Update Permission' : 'Add Permission'}</h2>
                <CCol md={12}>
                    <CFormInput type="text" id="permission_name" label="Permisison Name" placeholder="Name for permission "  onChange={onChangeName} value={permission.permission_name} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="text" id="permission_code" label="Permisison Code" placeholder="Code for permission"  onChange={onChangeCode} value={permission.permission_code} />
                </CCol>
                <CCol xs={12}>
                    <CFormInput id="description" type="text" label="Desciption" placeholder="Add some more details" onChange={onChangeDescription} value={permission.description} />
                </CCol>
                <CCol xs={12}>
                    <CFormSelect label="Status" className="mb-3" onChange={onChangeStatus} value={permission.status}>
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

export default PermissionEdit
