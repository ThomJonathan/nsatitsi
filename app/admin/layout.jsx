// app/admin/layout.tsx
import AppShell from '../../components/appShell';

export default function AdminLayout({ children }) {
    return (
        <AppShell variant="admin">
            {children}
        </AppShell>
    );
}