import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilLaptop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavGroup,
    name: 'Admin',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Permissions',
        code: "GET_PERMISSION",
        to: '/permission',
        icon: <CIcon icon={cilLaptop} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Roles',
        to: '/roles',
        code: "GET_ROLE",
        icon: <CIcon icon={cilLaptop} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Country',
        to: '/country',
        code: "GET_COUNTRY",
        icon: <CIcon icon={cilLaptop} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'State',
        to: '/state',
        code: "GET_STATE",
        icon: <CIcon icon={cilLaptop} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'City',
        to: '/city',
        code: "GET_CITY",
        icon: <CIcon icon={cilLaptop} customClassName="nav-icon" />,
      },
    ] 
  },
  {
    component: CNavTitle,
    name: 'Admin',
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    code: "GET_USER",
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Vehicle',
    to: '/vehicle',
    code: "GET_VEHICLE",
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'QR Code',
    to: '/qr',
    code: "GET_QR",
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Assign Vehicle',
    to: '/assign/vehicle',
    code: "ASSIGN_VEHICLE",
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  
  // {
  //   component: CNavTitle,
  //   name: 'Extras',
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Pages',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Login',
  //       to: '/login',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Register',
  //       to: '/register',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 404',
  //       to: '/404',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 500',
  //       to: '/500',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
]

export default _nav
