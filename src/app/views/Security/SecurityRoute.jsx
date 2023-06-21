import { authRoles } from 'app/auth/authRoles';
import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const AppUserSetup = Loadable(lazy(() => import('./UserSetup/AppUserSetup')));
const AppUserGroupSetup = Loadable(lazy(() => import('./UserGroupSetup/AppUserGroupSetup')));
const AppPermission = Loadable(lazy(() => import('./Permission/AppPermission')));

const securityRoute = [
    { path: '/security/UserSetup', element: <AppUserSetup />, auth: authRoles.editor },
    { path: '/security/UserGroupSetup', element: <AppUserGroupSetup />, auth: authRoles.editor },
    { path: '/security/Permission', element: <AppPermission />, auth: authRoles.editor },
];

export default securityRoute;
