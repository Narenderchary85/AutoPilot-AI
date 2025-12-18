// components/layout/MainLayout.jsx
import LeftSidebar from './LeftSidebar';
import CenterPanel from './CenterPanel';
import RightSidebar from './RightSidebar';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left */}
      <aside className="hidden md:flex w-64 border-r border-slate-200 bg-white/80 backdrop-blur-sm">
        <LeftSidebar />
      </aside>

      {/* Center */}
      <main className="flex-1 flex">
        <CenterPanel />
      </main>

      {/* Right */}
      <aside className="hidden lg:flex w-72 border-l border-slate-200 bg-white/80 backdrop-blur-sm">
        <RightSidebar />
      </aside>
    </div>
  );
};

export default MainLayout;
