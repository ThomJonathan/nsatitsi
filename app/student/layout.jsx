// app/(student)/layout.tsx
import AppShell from '../../components/appShell';

export default function StudentLayout({ children }) {
    return (
        <AppShell variant="student">
            {children}
        </AppShell>
    );
}