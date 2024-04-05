import { CTable, CTableHead, CTableRow, CFormSelect, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CButton, CToaster } from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';
import getBadge from '../badge';
import getstatus from '../status';
import Paginate from 'src/components/Paginate';

const DistrictList = () => {

    const [toast, addToast] = useState(0)

    const toaster = React.useRef()

    const navigate = useNavigate();

    const [country, setCountry] = useState([])

    const [state, setState] = useState([])

    const [countryNameSelected, setCountryNameSelected] = useState("");

    const [countrySelected, setCountrySelected] = useState(0);

    const [stateNameSelected, setStateNameSelected] = useState("");

    const [stateSelected, setStateSelected] = useState(0);

    const [district, setDistrict] = useState([])

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    const permissions = useSelector((state) => state.auth.permissions);

    const [page, setPage] = useState({
        current_page: 0,
        total_items: 0,
        total_pages: 0,
        per_page: 0, 
    })

    useEffect(() => {
        if (isLoggedIn === false) {
            navigate('/login');
            window.location.reload();
        }
        getAllCountry();
    }, [isLoggedIn]);

    const getAllCountry = () => {
        return userService.getCountries(false, 0).then(
            (data) => {
                console.log(data.data.response_data);
                setCountry(data.data.response_data.filter(v => v.status == 1));
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

    const onChangeCountry = (e) => {
        var countryId = e.target.value;
        let country_name = "";
        for (let x in country) {
            if (country[x].id == countryId) {
                country_name = country[x].country_name;
                break;
            }
        }
        setCountrySelected(countryId);
        setCountryNameSelected(country_name);
        if (countryId > 0) {
            setState([]);
            setDistrict([]);
            fetchStateList(false, 0, countryId);
        } else {
            addToast(ToastMessage("Please Select Country", 'danger'));
        }
    };

    const fetchStateList = (paginated, page_number, countryId) => {
        return userService.getStates(paginated, page_number, countryId).then(
            (data) => {
                console.log(data.data.response_data);
                setState(data.data.response_data.filter(v => v.status == 1));
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

    const onChangeState = (e) => {
        var stateId = e.target.value;
        let state_name = "";
        for (let x in state) {
            if (state[x].id == stateId) {
                state_name = state[x].state_name;
                break;
            }
        }
        setStateSelected(stateId);
        setStateNameSelected(state_name);
        if (stateId > 0) {
            setDistrict([]);
            fetchDistrictList(true, 0, stateId);
        } else {
            addToast(ToastMessage("Please Select State", 'danger'));
        }
    };

    const fetchDistrictList = (paginated, current_page, stateId) => {
        return userService.getDistricts(paginated, current_page, stateId).then(
            (data) => {
                console.log(data.data.response_data);
                setDistrict(data.data.response_data);
                setPage({ ...page, current_page: data.data.current_page, total_items: data.data.total_items, total_pages: data.data.total_pages, per_page: data.data.per_page });
            },
            (error) => {
                console.log(error)
                const message =
                    (error.response && error.response.data && error.response.data.response_message) || error.message || error.toString();
                addToast(ToastMessage(message, 'danger'));
                return message;
            }
        );
    };

    const deleteDistrict = (index, district_id) => {
        return userService.deleteDistrict(district_id).then(
            (data) => {
                console.log(data.data.response_data);
                addToast(ToastMessage('Deleted Successfully !!', 'primary'));
                district.splice(index, 1);
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

       
    const handleAdd = () => {
        navigate(
            {
                pathname: "/city/addEdit",
                search: createSearchParams({}).toString(),
            },
            { state: {} },
        );
    };

    const handleEdit = (index, district_id) => {
        navigate(
            {
                pathname: "/city/addEdit",
                search: createSearchParams({ id: district_id, edit: true }).toString(),
            },
            { state: {} },
        );
    };

    const handleDelete = (index, district_id) => {
        deleteDistrict(index, district_id)
        console.log("deleted" + district_id);
    };

    const columns = [
        {
            key: 'id',
            label: '#',
        },
        {
            key: 'district_name',
            label: 'District Name',
        },
        {
            key: 'district_code',
            label: 'District Code',
        },
        {
            key: 'state',
            label: 'State',
        },
        {
            key: 'status',
            label: 'Status',
        },
        {
            key: 'Action',
            label: 'Action',
        },
    ];

    const handlePaginate = (page_number) => {
        if (page_number < 0 || page_number >= page.total_pages) {
            addToast(ToastMessage("Page Not Availble", 'danger'));
        } else {
            return fetchDistrictList(true, page_number, stateSelected);
        }
    }

    const paginateRender = () => {
        if (district.length > 0) {
            return (<Paginate data={district} page={page} handle={handlePaginate}/>);
        }
    }

    const isAdd = () => {
        return !permissions.includes("ADD_CITY");
    }

    const isEdit = () => {
        return !permissions.includes("EDIT_CITY");
    }

    const isDelete = () => {
        return !permissions.includes("DELETE_CITY");
    }

    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-center" />
            <CTable responsive hover >
                <CTableHead>
                    <CTableRow>
                        {columns.map((val, key) => {
                            if (key == 0) {
                                return (
                                    <CTableHeaderCell key="select_country">
                                        <CFormSelect label="" className="mb-3" onChange={onChangeCountry} defaultValue={countrySelected}>
                                            <option value={0} key="">Select Country</option>
                                            {country.map((val, key) => {
                                                return (<option value={val.id} key={key}>{val.country_name}</option>)
                                            })}
                                        </CFormSelect>
                                    </CTableHeaderCell>
                                );
                            }

                            if (key == 1 && state.length > 0) {
                                return (
                                    <CTableHeaderCell key="select_state">
                                        <CFormSelect label="" className="mb-3" onChange={onChangeState} defaultValue={stateSelected}>
                                            <option value={0} key="">Select State</option>
                                            {state.map((val, key) => {
                                                return (<option value={val.id} key={key}>{val.state_name}</option>)
                                            })}
                                        </CFormSelect>
                                    </CTableHeaderCell>
                                );
                            }

                            if (key == columns.length - 1) {
                                return (
                                    <CTableHeaderCell key="add_button">
                                        <CButton type="button" color="success" variant="outline" disabled={isAdd()} onClick={() => handleAdd()}>
                                            Add
                                        </CButton>
                                    </CTableHeaderCell>
                                );
                            }
                            return (<CTableHeaderCell key={key}></CTableHeaderCell>);
                        })}
                    </CTableRow>
                    <CTableRow>
                        {columns.map((val, key) => {
                            return (
                                <CTableHeaderCell key={key}>{val.label}</CTableHeaderCell>
                            )
                        })}
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {district.map((val, key) => {
                        return (
                            <CTableRow key={key}>
                                <CTableDataCell>{(page.current_page * page.per_page) + (key + 1)}</CTableDataCell>
                                <CTableDataCell>{val.district_name}</CTableDataCell>
                                <CTableDataCell>{val.district_code}</CTableDataCell>
                                <CTableDataCell>{val.state_name}</CTableDataCell>
                                <CTableDataCell>
                                    <CBadge color={getBadge(val.status)}>{getstatus(val.status)}</CBadge>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton size="sm" color="primary" className="ml-1" disabled={isEdit()} onClick={() => handleEdit(key, val.id)}>
                                        Edit
                                    </CButton>
                                    <CButton size="sm" color="danger" className="ml-1" disabled={isDelete()} onClick={() => handleDelete(key, val.id)}>
                                        Delete
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        )
                    })}
                </CTableBody>
            </CTable>
            {paginateRender()}
        </>
    )
}

export default DistrictList
