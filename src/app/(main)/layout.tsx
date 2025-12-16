import DashboardPage from "./dashboard/page";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <DashboardPage/>
    </div>
  );
}