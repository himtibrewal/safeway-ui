import { CForm, CCol, CFormInput, CButton, CToaster, CFormCheck, CFormSelect } from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';

const UserEdit = () => {
    const [toast, addToast] = useState(0)

    const toaster = React.useRef()

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const isEdit = searchParams.get('edit');

    const id = searchParams.get('id');

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

    const [user, setUser] = useState({
        username: "",
        email: "",
        mobile: "",
        password: "",
        emergency_contact1: "",
        emergency_contact2: "",
        blood_group: "",
        roles: [],
    });

    const [selectedIds, setSelectedIds] = useState([]);

    const [role, setRole] = useState([]);

    useEffect(() => {
        if (isLoggedIn === false) {
            navigate('/login');
            window.location.reload();
        }
        if (isEdit) {
            getUser();
        }
        getAllRoles().then((rolesList) => {
            setRole(rolesList);
        });

    }, [isLoggedIn]);

    const getUser = () => {
        return userService.getUser(id).then(
            (data) => {
                console.log(data.data.response_data);
                setUser(data.data.response_data);
                setSelectedIds(data.data.response_data.roles.map(r => r.id));
                getAllRoles().then((rolesList) => {
                    setRole(rolesList);
                });
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

    const getAllRoles = () => {
        return userService.getRoles().then(
            (data) => {
                console.log(data.data.response_data);
                return data.data.response_data;
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
        console.log(user);
        const data = { "username": user.username, "email": user.email, "mobile": user.mobile, "password": user.password, "emergency_contact1": user.emergency_contact1, "emergency_contact2": user.emergency_contact2, "blood_group": user.blood_group, "role_ids": selectedIds };
        if (isEdit) {
            return userService.editUser(id, data).then(
                (data) => {
                    console.log(data.data.response_data);
                    navigate('/users');
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
            return userService.addUser(data).then(
                (data) => {
                    console.log(data.data.response_data);
                    navigate('/users');
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
        setUser({ ...user, username: e.target.value, });
    };

    const onChangeEmail = (e) => {
        setUser({ ...user, email: e.target.value, });
    };

    const onChangeMobile = (e) => {
        setUser({ ...user, mobile: e.target.value, });
    };

    const onChangePassword = (e) => {
        setUser({ ...user, password: e.target.value, });
    };

    const onChangeEmergencyContact1 = (e) => {
        setUser({ ...user, emergency_contact1: e.target.value, });
    };

    const onChangeEmergencyContact2 = (e) => {
        setUser({ ...user, emergency_contact2: e.target.value, });
    };

    const onChangeBloodGroup = (e) => {
        setUser({ ...user, blood_group: e.target.value, });
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
        const rolesArray = role.map(p => p.id);
        setSelectedIds(event.target.checked ? rolesArray : [])
    }



    return (
        <>
            <CForm className="row g-3" onSubmit={handleSubmit}>
                <h2>{isEdit ? 'Update User' : 'Add User'}</h2>
                <CCol md={12}>
                    <CFormInput type="text" id="username" label="User Name" onChange={onChangeName} value={user.username} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="text" id="email" label="User Email" onChange={onChangeEmail} value={user.email} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="text" id="mobile" label="User Mobile" onChange={onChangeMobile} value={user.mobile} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="text" id="password" label="User Password" onChange={onChangePassword} value={user.password} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="text" id="emergency_contact1" label="Emergencey Contact 1" onChange={onChangeEmergencyContact1} value={user.emergency_contact1} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="text" id="emergency_contact2" label="Emergencey Contact 2" onChange={onChangeEmergencyContact2} value={user.emergency_contact2} />
                </CCol>
                <CCol xs={12}>
                    <CFormSelect size="md" label="Blood Group" className="mb-3" onChange={onChangeBloodGroup} value={user.blood_group}>
                        <option>select</option>
                        <option value='1'>A+</option>
                        <option value='2'>B+</option>
                        <option value='3'>AB+</option>
                        <option value='4'>A-</option>
                        <option value='5'>B-</option>
                        <option value='6'>AB-</option>
                        <option value='7'>O+</option>
                        <option value='8'>O-</option>
                    </CFormSelect>
                </CCol>
                <CCol xs={12}>
                    <CFormCheck label="ALL" checked={selectedIds.length == role.length} onChange={(event) => { handleMultipleCheckboxChange(event) }} />
                    {role.map((val, key) => {
                        return (<CFormCheck key={key} id={val.role_code} label={val.role_name} value={val.id}
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

export default UserEdit
