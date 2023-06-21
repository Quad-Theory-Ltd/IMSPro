import { authRoles } from 'app/auth/authRoles';
import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const AppSalesOrder = Loadable(lazy(() => import('./SalesOrder/AppSalesOrder')));
const AppSalesOrderApprove = Loadable(lazy(() => import('./SalesOrderApprove/AppSalesOrderApprove')));
const AppInternalWorkOrder = Loadable(lazy(() => import('./InternalWorkOrder/AppInternalWorkOrder')));

const posRoute = [
    { path: '/pos/SalesOrder', element: <AppSalesOrder />, auth: authRoles.editor },
    { path: '/pos/SalesOrderApprove', element: <AppSalesOrderApprove />, auth: authRoles.editor },
    { path: '/pos/InternalWorkOrder', element: <AppInternalWorkOrder />, auth: authRoles.editor },
];

export default posRoute;
