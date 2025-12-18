// components/layout/MainLayout.jsx
import LeftSidebar from './LeftSidebar';
import CenterPanel from './CenterPanel';
import RightSidebar from './RightSidebar';

const MainLayout = () => {
  return (
    <div className="flex max-h-screen">
      {/* Left */}
      <aside className="hidden md:flex w-80 border-r border-slate-200 bg-white/80 backdrop-blur-sm overflow-y-auto">
        <LeftSidebar />
      </aside>

      {/* Center */}
      <main className="flex-1 flex overflow-y-auto ">
        <CenterPanel />
      </main>

      {/* Right */}
      <aside className="hidden lg:flex w-80 border-l border-slate-200 bg-white/80 backdrop-blur-sm overflow-y-auto">
        <RightSidebar />
      </aside>
    </div>
  );
};

export default MainLayout;
