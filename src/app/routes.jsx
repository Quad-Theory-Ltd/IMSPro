import AuthGuard from 'app/auth/AuthGuard';
import chartsRoute from 'app/views/charts/ChartsRoute';
import adminRoute from 'app/views/Admin/AdminRoute';
import securityRoute from 'app/views/Security/SecurityRoute';
import purchaseRoute from 'app/views/Purchase/PurchaseRoute';
import salesRoute from 'app/views/Sales/SalesRoute';
import posRoute from 'app/views/pos/PosRoute';
import dashboardRoutes from 'app/views/dashboard/DashboardRoutes';
import materialRoutes from 'app/views/material-kit/MaterialRoutes';
import NotFound from 'app/views/sessions/NotFound';
import sessionRoutes from 'app/views/sessions/SessionRoutes';
import { Navigate } from 'react-router-dom';
import MatxLayout from './components/MatxLayout/MatxLayout';

const routes = [
    {
        element: (
            <AuthGuard>
                <MatxLayout />
            </AuthGuard>
        ),
        children: [...dashboardRoutes, ...chartsRoute, ...adminRoute, ...securityRoute, ...purchaseRoute, ...salesRoute, ...posRoute, ...materialRoutes],
    },
    ...sessionRoutes,
    { path: '/', element: <Navigate to="dashboard/default" /> },
    { path: '*', element: <NotFound /> },
];

export default routes;
