import { CForm, CCol, CFormInput, CButton, CToaster, CFormCheck, CFormSelect } from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';
import getstatus from '../status';

const RoleEdit = () => {
    const [toast, addToast] = useState(0)

    const toaster = React.useRef()

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const isEdit = searchParams.get('edit');

    const id = searchParams.get('id');

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

    const [role, setRole] = useState({
        role_name: "",
        role_code: "",
        description: "",
        status: "",
        permissions: [],
    });

    const [selectedIds, setSelectedIds] = useState([]);

    const [permission, setPermission] = useState([]);

    useEffect(() => {
        if (isLoggedIn === false) {
            navigate('/login');
            window.location.reload();
        }

        if (isEdit) {
            getRole();
        }else{
            getAllPermisison(false, 0).then((permissionList) => {
                setPermission(permissionList);
            });
        }
    }, [isLoggedIn]);

    const getRole = () => {
        return userService.getRole(id).then(
            (data) => {
                console.log(data.data.response_data);
                setRole(data.data.response_data);
                setSelectedIds(data.data.response_data.permissions.map(s => s.id));
                getAllPermisison(false, 0).then((permissionList) => {
                    setPermission(permissionList);
                });
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

    const getAllPermisison = (paginated, page_number) => {
        return userService.getPermisisons(paginated, page_number).then(
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
        const data = { "role_name": role.role_name, "role_code": role.role_code, "description": role.description, "status": role.status, "permission_id": selectedIds };
        if (isEdit) {
            return userService.editRole(id, data).then(
                (data) => {
                    console.log(data.data.response_data);
                    navigate('/roles');
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
            return userService.addRole(data).then(
                (data) => {
                    console.log(data.data.response_data);
                    navigate('/roles');
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
        setRole({ ...role, role_name: e.target.value, });
    };

    const onChangeCode = (e) => {
        setRole({ ...role, role_code: e.target.value, });
    };

    const onChangeDescription = (e) => {
        setRole({ ...role, description: e.target.value, });
    };

    const onChangeStatus = (e) => {
        setRole({ ...role, status: e.target.value, });
    };


    const handleCheckboxChange = (event) => {
        const checkedId = parseInt(event.target.value);
        if (event.target.checked) {
            setSelectedIds([...selectedIds, checkedId])
        } else {
            setSelectedIds(selectedIds.filter(id => id !== checkedId))
        }
    }

    const handleMultipleCheckboxChange = (event) => {
        //getting an array of all roleIds
        const permissionArray = permission.map(p => p.id);
        //on check of the master checkbox, return all roleIds and on uncheck, an empty array
        setSelectedIds(event.target.checked ? permissionArray : [])
    }



    return (
        <>
            <CForm className="row g-3" onSubmit={handleSubmit}>
                <h2>{isEdit ? 'Update Role' : 'Add Role'}</h2>
                <CCol md={12}>
                    <CFormInput type="text" id="role_name" label="Role Name" onChange={onChangeName} value={role.role_name} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="text" id="role_code" label="Role Code" onChange={onChangeCode} value={role.role_code} />
                </CCol>
                <CCol xs={12}>
                    <CFormInput id="description" label="Desciption" placeholder="Add some more details" onChange={onChangeDescription} value={role.description} />
                </CCol>
                <CCol xs={12}>
                    <CFormSelect label="Status" className="mb-3" onChange={onChangeStatus} value={role.status}>
                        <option value={""} key="">Select Status</option>
                        <option value={0} key="status_0">{getstatus(0)} </option>
                        <option value={1} key="status_1">{getstatus(1)} </option>
                    </CFormSelect>
                </CCol>
                <CCol xs={12}>
                    <CFormCheck label="ALL" checked={selectedIds.length == permission.length} onChange={(event) => { handleMultipleCheckboxChange(event) }} />
                    {permission.map((val, key) => {
                        return (<CFormCheck key={key} id={val.permission_code} label={val.permission_name} value={val.id}
                            checked={selectedIds.includes(val.id)} onChange={(event) => { handleCheckboxChange(event) }} />)
                    })}
                </CCol>
                <CCol xs={12}>
                    <CButton type="submit" color="success" variant="outline" className="me-2">{isEdit ? 'UPDATE' : 'ADD'}</CButton>
                </CCol>
            </CForm>
            <CToaster ref={toaster} push={toast} placement="top-center" />
        </>
    )
}

export default RoleEdit
