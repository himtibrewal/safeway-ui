import { CForm, CCol, CFormInput, CButton, CToaster, CFormCheck, CFormSelect, CFormLabel } from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';
import getstatus from '../status';

const UserEdit = () => {
    const [toast, addToast] = useState(0)

    const toaster = React.useRef()

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const isEdit = searchParams.get('edit');

    const id = searchParams.get('id');

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    const permissions = useSelector((state) => state.auth.permissions);

    const [user, setUser] = useState({
        username: "",
        email: "",
        mobile: "",
        password: "",
        emergency_contact1: "",
        emergency_contact2: "",
        status: "",
        address1: "",
        address2: "",
        country_id: "",
        state_id: "",
        district_id: "",
        blood_group: "",
        roles: [],
        vehicles: [],
    });


    const [country, setCountry] = useState([]);

    const [state, setState] = useState([]);

    const [district, setDistrict] = useState([]);

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
        getAllCountry();
        getAllRoles();

    }, [isLoggedIn]);

    const getUser = () => {
        return userService.getUser(id).then(
            (data) => {
                setUser(data.data.response_data);
                if(data.data.response_data.country_id != null){
                    getAllState(false, 0, data.data.response_data.country_id);
                }
                
                if(data.data.response_data.state_id != null){
                    getAllDistrict(false, 0, data.data.response_data.state_id);
                }
            
                setSelectedIds(data.data.response_data.roles.map(r => r.id));
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

    const getAllDistrict = (paginated, page_number, state_id) => {
        return userService.getDistricts(paginated, page_number, state_id).then(
            (data) => {
                setDistrict(data.data.response_data.filter(v => v.status == 1));
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
                setRole(data.data.response_data.filter(v => v.status == 1));
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
        const data = {
            "username": user.username,
            "email": user.email,
            "mobile": user.mobile,
            "password": user.password,
            "emergency_contact1": user.emergency_contact1,
            "emergency_contact2": user.emergency_contact2,
            "status": user.status,
            "address1": user.address1,
            "address2": user.address2,
            "country_id": user.country_id,
            "state_id": user.state_id,
            "district_id": user.district_id,
            "blood_group": user.blood_group,
            "role_ids": selectedIds,
        };
        if (isEdit) {
            return userService.editUser(id, data).then(
                (data) => {
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

    const onChangeStatus = (e) => {
        setUser({ ...user, status: e.target.value, });
    };

    const onChangeEmergencyContact1 = (e) => {
        setUser({ ...user, emergency_contact1: e.target.value, });
    };

    const onChangeEmergencyContact2 = (e) => {
        setUser({ ...user, emergency_contact2: e.target.value, });
    };
    const onChangeAddress1 = (e) => {
        setUser({ ...user, address1: e.target.value, });
    };

    const onChangeAddress2 = (e) => {
        setUser({ ...user, address2: e.target.value, });
    };

    const onChangeBloodGroup = (e) => {
        setUser({ ...user, blood_group: e.target.value, });
    };

    const onChangeCountry = (e) => {
        setUser({ ...user, country_id: e.target.value });
        if (e.target.value > 0) {
            getAllState(false, 0, e.target.value);
        }
    };

    const onChangeState = (e) => {
        setUser({ ...user, state_id: e.target.value, });
        if (e.target.value > 0) {
            getAllDistrict(false, 0, e.target.value);
        }
    };

    const onChangeDistrict = (e) => {
        setUser({ ...user, district_id: e.target.value, });
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

    const isAddEdit = () => {
        if(isEdit){
            return !permissions.includes("EDIT_USER");
        }
        return !permissions.includes("ADD_USER");
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
                {/* <CCol md={12}>
                    <CFormInput type="text" id="password" label="User Password" onChange={onChangePassword} value={user.password} />
                </CCol> */}
                <CCol xs={12}>
                    <CFormSelect label="Status" className="mb-3" onChange={onChangeStatus} value={user.status}>
                        <option value={""} key="">Select Status</option>
                        <option value={0} key="status_0">{getstatus(0)} </option>
                        <option value={1} key="status_1">{getstatus(1)} </option>
                    </CFormSelect>
                </CCol>
                <CCol md={12}>
                    <CFormInput type="text" id="emergency_contact1" label="Emergencey Contact 1" onChange={onChangeEmergencyContact1} value={user.emergency_contact1} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="text" id="emergency_contact2" label="Emergencey Contact 2" onChange={onChangeEmergencyContact2} value={user.emergency_contact2} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="text" id="address1" label="Address 1" onChange={onChangeAddress1} value={user.address1} />
                </CCol>
                <CCol md={12}>
                    <CFormInput type="text" id="address2" label="Address 2" onChange={onChangeAddress2} value={user.address2} />
                </CCol>
                <CCol xs={12}>
                    <CFormSelect label="Country" className="mb-3" onChange={onChangeCountry} value={user.country_id}>
                        <option value={0} key="">Select Country</option>
                        {country.map((val, key) => {
                            return (<option value={val.id} key={key}>{val.country_name} </option>)
                        })}
                    </CFormSelect>
                </CCol>
                <CCol xs={12}>
                    <CFormSelect label="State" className="mb-3" onChange={onChangeState} value={user.state_id}>
                        <option value={0} key="">Select State</option>
                        {state.map((val, key) => {
                            return (<option value={val.id} key={key}>{val.state_name} </option>)
                        })}
                    </CFormSelect>
                </CCol>
                <CCol xs={12}>
                    <CFormSelect label="State" className="mb-3" onChange={onChangeDistrict} value={user.district_id}>
                        <option value={0} key="">Select City</option>
                        {district.map((val, key) => {
                            return (<option value={val.id} key={key}>{val.district_name} </option>)
                        })}
                    </CFormSelect>
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
                    <CFormLabel>Roles</CFormLabel>
                    <CFormCheck label="ALL" checked={selectedIds.length == role.length} onChange={(event) => { handleMultipleCheckboxChange(event) }} />
                    {role.map((val, key) => {
                        return (<CFormCheck key={key} id={val.role_code} label={val.role_name} value={val.id}
                            checked={selectedIds.includes(val.id)} onChange={(event) => { handleCheckboxChange(event) }} />)
                    })}
                </CCol>
                <CCol xs={12}>
                    <CButton type="submit" color="success" variant="outline" className="me-2" disabled={isAddEdit()}>{isEdit ? 'UPDATE' : 'ADD'}</CButton>
                </CCol>
            </CForm>
            <CToaster ref={toaster} push={toast} placement="top-center" />
        </>
    )
}

export default UserEdit
