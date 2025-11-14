/**
 * Layout for navigation buttons.
 * This layout is located at the bottom of the screen. (Mobile friendly)
 * main.tsx handles the routes with(and without) this bottom navigatin layout
 */

import { Outlet } from "react-router-dom";
import BottomRadialNav from "../../components/nav/BottomNav.tsx";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[420px] px-5 pb-[120px]">
        <Outlet />
      </div>
      {<BottomRadialNav />}
    </div>
  );
}
