import { authRoles } from 'app/auth/authRoles';
import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const AppItemSetup = Loadable(lazy(() => import('./ItemSetup/AppItemSetup')));
const AppMeasurementUnitSetup = Loadable(lazy(() => import('./MeasurementUnitSetup/AppMeasurementUnitSetup')));
const AppPricingSetup = Loadable(lazy(() => import('./PricingSetup/AppPricingSetup')));

const adminRoute = [
    { path: '/admin/ItemSetup', element: <AppItemSetup />, auth: authRoles.editor },
    { path: '/admin/MeasurementUnitSetup', element: <AppMeasurementUnitSetup />, auth: authRoles.editor },
    { path: '/admin/PricingSetup', element: <AppPricingSetup />, auth: authRoles.editor },
];

export default adminRoute;
