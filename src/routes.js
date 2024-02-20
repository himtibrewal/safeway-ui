import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const UserList = React.lazy(() => import('./views/users/UserList'))
const UserEdit = React.lazy(() => import('./views/users/EditUser'))
const PermissionList = React.lazy(() => import('./views/permission/PermissionList'))
const PermissionEdit = React.lazy(() => import('./views/permission/EditPermission'))
const RolesList = React.lazy(() => import('./views/roles/RolesList'))
const RoleEdit = React.lazy(() => import('./views/roles/EditRole'))
const VehicleList = React.lazy(() => import('./views/vehicle/VehicleList'))
const VehicleEdit = React.lazy(() => import('./views/vehicle/EditVehicle'))
const CountryList = React.lazy(() => import('./views/country/CountryList'))
const CountryEdit = React.lazy(() => import('./views/country/EditCountry'))
const StateList = React.lazy(() => import('./views/state/StateList'))
const StateEdit = React.lazy(() => import('./views/state/EditState'))
const CityList = React.lazy(() => import('./views/city/CityList'))
const CityEdit = React.lazy(() => import('./views/city/EditCity'))
const AssignByUser = React.lazy(() => import('./views/assign/AssignByUser'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/country', name: 'Country', element: CountryList },
  { path: '/country/addEdit', name: 'ADD Edit Country', element: CountryEdit },
  { path: '/state', name: 'State', element: StateList },
  { path: '/state/addEdit', name: 'ADD Edit Country', element: StateEdit },
  { path: '/city', name: 'District', element: CityList },
  { path: '/city/addEdit', name: 'District', element: CityEdit },
  { path: '/users', name: 'Users', element: UserList },
  { path: '/user/addEdit', name: 'ADD Edit User', element: UserEdit },
  { path: '/vehicle', name: 'Users', element: VehicleList },
  { path: '/vehicle/addEdit', name: 'ADD Edit Vehicle', element: VehicleEdit },
  { path: '/permission', name: 'Permission', element: PermissionList },
  { path: '/permission/addEdit', name: 'ADD Edit Permission', element: PermissionEdit },
  { path: '/roles', name: 'Roles', element: RolesList },
  { path: '/role/addEdit', name: 'ADD Edit Role', element: RoleEdit },
  { path: '/assign/vehicle', name: 'Assign Vehicle', element: AssignByUser },
]

export default routes
