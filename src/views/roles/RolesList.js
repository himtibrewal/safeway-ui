import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge, CButton, CToaster } from '@coreui/react';
import * as React from 'react';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, createSearchParams } from 'react-router-dom'
import userService from 'src/services/user.service';
import ToastMessage from 'src/components/ToastMessage';
import getBadge from '../badge';
import getstatus from '../status';
import Paginate from 'src/components/Paginate';

const RoleList = () => {

  const [toast, addToast] = useState(0)

  const toaster = React.useRef()

  const navigate = useNavigate();

  const [role, setRole] = useState([])

  const [page, setPage] = useState({
    current_page: 0,
    total_items: 0,
    total_pages: 0,
  })

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

  useEffect(() => {
    if (isLoggedIn === false) {
      navigate('/login');
      window.location.reload();
    }
    fetchRoleList(true, 0);
  }, [isLoggedIn]);

  const fetchRoleList = (paginated, page_number) => {
    return userService.getRoles(paginated, page_number).then(
      (data) => {
        setRole(data.data.response_data);
        setPage({ ...page, current_page: data.data.current_page, total_items: data.data.total_items, total_pages: data.data.total_pages, });
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

  const deleteRole = (index, role_id) => {
    return userService.deleteRole(role_id).then(
      (data) => {
        console.log(data.data.response_data);
        addToast(ToastMessage('Deleted Successfully !!', 'primary'));
        role.splice(index, 1);
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
        pathname: "/role/addEdit",
        search: createSearchParams({}).toString(),
      },
      { state: {} },
    );
  };

  const handleEdit = (role_id) => {
    navigate(
      {
        pathname: "/role/addEdit",
        search: createSearchParams({ id: role_id, edit: true }).toString(),
      },
      { state: {} },
    );
  };

  const handleDelete = (index, role_id) => {
    deleteRole(index, role_id)
    console.log("deleted" + role_id);
  };

  const columns = [
    {
      key: 'id',
      label: '#',
    },
    {
      key: 'role_name',
      label: 'Role Name',
    },
    {
      key: 'role_code',
      label: 'Role Code',
    },
    {
      key: 'description',
      label: 'Description',
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
      return fetchRoleList(true, page_number);
    }
  }

  const paginateRender = () => {
    if (role.length > 0) {
      return (<Paginate data={role} page={page} handle={handlePaginate} />);
    }
  }


  return (
    <>
      <CToaster ref={toaster} push={toast} placement="top-center" />
      <CTable responsive hover >
        <CTableHead>
          <CTableRow>
            {columns.map((val, key) => {
              if (key == columns.length - 1) {
                return (
                  <CTableHeaderCell key="add_button">
                    <CButton type="button" color="success" variant="outline" onClick={() => handleAdd()}>
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
          {role.map((val, key) => {
            return (
              <CTableRow key={key}>
                <CTableDataCell>{(page.current_page) * Math.ceil(page.total_items / page.total_pages) + (key + 1)}</CTableDataCell>
                <CTableDataCell>{val.role_name}</CTableDataCell>
                <CTableDataCell>{val.role_code}</CTableDataCell>
                <CTableDataCell>{val.description}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={getBadge(val.status)}>{getstatus(val.status)}</CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton size="sm" color="primary" className="ml-1" onClick={() => handleEdit(val.id)}>
                    Edit
                  </CButton>
                  <CButton size="sm" color="danger" className="ml-1" onClick={() => handleDelete(key, val.id)}>
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

export default RoleList
