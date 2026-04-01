import { Outlet } from 'react-router-dom';
import { StorefrontHeader } from './StorefrontHeader';
import { StorefrontFooter } from './StorefrontFooter';

export function StorefrontLayout() {
    return (
        <div className="storefront-app bg-effect">
            <StorefrontHeader />
            <main className="storefront-main">
                <Outlet />
            </main>
            <StorefrontFooter />
        </div>
    );
}
