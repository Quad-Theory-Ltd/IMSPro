import { authRoles } from 'app/auth/authRoles';
import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const AppPurchaseOrder = Loadable(lazy(() => import('./PurchaseOrder/AppPurchaseOrder')));
const AppPurchaseBill = Loadable(lazy(() => import('./PurchaseBill/AppPurchaseBill')));
const AppPurchaseAcknowledgement = Loadable(lazy(() => import('./PurchaseAcknowledgement/AppPurchaseAcknowledgement')));
const AppStockReceive = Loadable(lazy(() => import('./StockReceive/AppStockReceive')));
const AppStockIssue = Loadable(lazy(() => import('./StockIssue/AppStockIssue')));
const AppStockAdjustment = Loadable(lazy(() => import('./StockAdjustment/AppStockAdjustment')));
const AppPurchaseBillCancellation = Loadable(lazy(() => import('./PurchaseBillCancellation/AppPurchaseBillCancellation')));
const AppPurchaseBillReturn = Loadable(lazy(() => import('./PurchaseBillReturn/AppPurchaseBillReturn')));
const AppOpening = Loadable(lazy(() => import('./Opening/AppOpening')));

const purchaseRoute = [
    { path: '/purchase/PurchaseOrder', element: <AppPurchaseOrder />, auth: authRoles.editor },
    { path: '/purchase/PurchaseBill', element: <AppPurchaseBill />, auth: authRoles.editor },
    { path: '/purchase/PurchaseAcknowledgement', element: <AppPurchaseAcknowledgement />, auth: authRoles.editor },
    { path: '/purchase/StockReceive', element: <AppStockReceive />, auth: authRoles.editor },
    { path: '/purchase/StockIssue', element: <AppStockIssue />, auth: authRoles.editor },
    { path: '/purchase/StockAdjustment', element: <AppStockAdjustment />, auth: authRoles.editor },
    { path: '/purchase/PurchaseBillCancellation', element: <AppPurchaseBillCancellation />, auth: authRoles.editor },
    { path: '/purchase/PurchaseBillReturn', element: <AppPurchaseBillReturn />, auth: authRoles.editor },
    { path: '/purchase/Opening', element: <AppOpening />, auth: authRoles.editor },
];

export default purchaseRoute;
