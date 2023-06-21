import { authRoles } from 'app/auth/authRoles';
import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const AppSalesOrder = Loadable(lazy(() => import('./SalesOrder/AppSalesOrder')));
const AppInvoice = Loadable(lazy(() => import('./Invoice/AppInvoice')));
const AppSalesAcknowledgement = Loadable(lazy(() => import('./SalesAcknowledgement/AppSalesAcknowledgement')));
const AppSalesCancellation = Loadable(lazy(() => import('./SalesCancellation/AppSalesCancellation')));
const AppSalesReturn = Loadable(lazy(() => import('./SalesReturn/AppSalesReturn')));

const salesRoute = [
    { path: '/sales/SalesOrder', element: <AppSalesOrder />, auth: authRoles.editor },
    { path: '/sales/Invoice', element: <AppInvoice />, auth: authRoles.editor },
    { path: '/sales/SalesAcknowledgement', element: <AppSalesAcknowledgement />, auth: authRoles.editor },
    { path: '/sales/SalesCancellation', element: <AppSalesCancellation />, auth: authRoles.editor },
    { path: '/sales/SalesReturn', element: <AppSalesReturn />, auth: authRoles.editor }
];

export default salesRoute;
