import { CTable, CTableHead, CTableRow, CFormSelect, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CButton, CToaster, CPagination, CPaginationItem } from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';
import getBadge from '../badge';
import getstatus from '../status';
import Paginate from 'src/components/Paginate';

const StateList = () => {

    const [toast, addToast] = useState(0)

    const toaster = React.useRef()

    const navigate = useNavigate();

    const [state, setState] = useState([])

    const [country, setCountry] = useState([])

    const [page, setPage] = useState({
        current_page: 0,
        total_items: 0,
        total_pages: 0,
        per_page: 0,
    })

    const [countryNameSelected, setCountryNameSelected] = useState("");

    const [countrySelected, setCountrySelected] = useState(0);

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    const permissions = useSelector((state) => state.auth.permissions);

    useEffect(() => {
        if (isLoggedIn === false) {
            navigate('/login');
            window.location.reload();
        }
        getAllCountry();
    }, [isLoggedIn]);

    const fetchStateList = (paginated, page_number, countryId) => {
        return userService.getStates(paginated, page_number, countryId).then(
            (data) => {
                console.log(data.data.response_data);
                setState(data.data.response_data);
                setPage({ ...page, current_page: data.data.current_page, total_items: data.data.total_items, total_pages: data.data.total_pages, per_page: data.data.per_page});
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

    const onChangeCountry = (e) => {
        var countryId = e.target.value;
        let country_name = "";
        for (let x in country) {
            if(country[x].id == countryId){
                country_name = country[x].country_name;
                break;
            }
        }
        setCountrySelected(countryId);
        setCountryNameSelected(country_name);
        if (countryId > 0) {
            setState([]);
            fetchStateList(true, 0, countryId);
        } else {
            addToast(ToastMessage("Please Select Country", 'danger'));
        }
    };


    const getAllCountry = () => {
        return userService.getCountries(false, 0).then(
            (data) => {
                setCountry(data.data.response_data.filter(v => v.status == 1));
            },
            (error) => {
                console.log(error)
                const message =
                    (error.response && error.response.data && error.response.data.response_message) || error.message || error.toString();
                addToast(ToastMessage(message, 'danger'))
                if(error.response.data.response_status == 401){
                    localStorage.removeItem("user");
                    navigate('/login');
                    window.location.reload();
                }
                return message;
            }
        );
    };

    const deleteState = (index, state_id) => {
        return userService.deleteState(state_id).then(
            (data) => {
                console.log(data.data.response_data);
                addToast(ToastMessage('Deleted Successfully !!', 'primary'));
                state.splice(index, 1);
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
                pathname: "/state/addEdit",
                search: createSearchParams({}).toString(),
            },
            { state: {} },
        );
    };

    const handleEdit = (index, state_id) => {
        navigate(
            {
                pathname: "/state/addEdit",
                search: createSearchParams({ id: state_id, edit: true }).toString(),
            },
            { state: {} },
        );
    };

    const handleDelete = (index, state_id) => {
        deleteState(index, state_id)
        console.log("deleted" + state_id);
    };

    const columns = [
        {
            key: 'id',
            label: '#',
        },
        {
            key: 'state_name',
            label: 'State Name',
        },
        {
            key: 'state_code',
            label: 'State Code',
        },
        {
            key: 'country',
            label: 'Country',
        },
        {
            key: 'status',
            label: 'Status',
        },
        {
            key: 'Action',
            label: 'Action',
        },
    ]

    const handlePaginate = (page_number) => {
        if (page_number < 0 || page_number >= page.total_pages) {
            addToast(ToastMessage("Page Not Availble", 'danger'));
        } else {
            return fetchStateList(true, page_number, countrySelected);
        }
    }

    const paginateRender = () => {
        if (state.length > 0) {
            return (<Paginate data={state} page={page} handle={handlePaginate}/>);
        }
    }


    const isAdd = () => {
        return !permissions.includes("ADD_STATE");
    }

    const isEdit = () => {
        return !permissions.includes("EDIT_STATE");
    }

    const isDelete = () => {
        return !permissions.includes("DELETE_STATE");
    }


    return (
        <>
            <CToaster ref={toaster} push={toast} placement="top-center" />
            <CTable responsive hover>
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
                    {state.map((val, key) => {
                        return (
                            <CTableRow key={key}>
                                <CTableDataCell>{(page.current_page * page.per_page) + (key + 1)}</CTableDataCell>
                                <CTableDataCell>{val.state_name}</CTableDataCell>
                                <CTableDataCell>{val.state_code}</CTableDataCell>
                                <CTableDataCell>{countryNameSelected}</CTableDataCell>
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

export default StateList
