import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { startLogin } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Archive,
  CheckSquare2,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Moon,
  PanelLeft,
  Plus,
  Settings2,
  Sun,
  Users,
  WandSparkles,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { Button } from "./ui/button";

const menuGroups = [
  {
    label: "Workspace",
    items: [
      { icon: LayoutDashboard, label: "Ringkasan", path: "/" },
      { icon: FileText, label: "Semua rapat", path: "/rapat" },
      { icon: CheckSquare2, label: "Action item", path: "/action-item", badge: "6" },
    ],
  },
  {
    label: "Alat bantu",
    items: [
      { icon: WandSparkles, label: "Rekam rapat", path: "/rekaman" },
      { icon: Archive, label: "Arsip", path: "/rapat?status=arsip" },
    ],
  },
];

const SIDEBAR_WIDTH_KEY = "notulen-sidebar-width";
const DEFAULT_WIDTH = 264;
const MIN_WIDTH = 220;
const MAX_WIDTH = 380;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) return <DashboardLayoutSkeleton />;

  if (!user) {
    return (
      <div className="min-h-screen overflow-hidden bg-[#f5f7fb] text-[#1e293b] dark:bg-[#0e1118] dark:text-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(103,93,229,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(63,180,176,0.12),transparent_32%)]" />
        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 py-8 lg:px-10">
          <div className="grid w-full gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-xl">
              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#655bd7] text-white shadow-lg shadow-[#655bd7]/25">
                  <WandSparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold tracking-[0.18em] text-[#655bd7]">NOTULEN AI</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Aank PRO workspace</p>
                </div>
              </div>
              <p className="mb-5 inline-flex rounded-full border border-[#d9d6fb] bg-white/70 px-3 py-1 text-xs font-semibold text-[#655bd7] shadow-sm dark:border-white/10 dark:bg-white/5">
                Sekretaris AI untuk setiap rapat
              </p>
              <h1 className="font-display text-5xl font-semibold leading-[1.04] tracking-[-0.05em] text-[#162033] dark:text-white md:text-6xl">
                Ubah percakapan menjadi <span className="text-[#655bd7]">keputusan.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-500 dark:text-slate-400">
                Rekam, transkripsikan, dan tindak lanjuti rapat tanpa kehilangan konteks. Semua tersusun rapi dalam satu ruang kerja yang tenang.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Button onClick={() => startLogin()} size="lg" className="h-12 rounded-xl bg-[#655bd7] px-6 shadow-lg shadow-[#655bd7]/20 hover:bg-[#554bc5]">
                  Masuk ke workspace
                </Button>
                <span className="text-sm text-slate-500 dark:text-slate-400">Login aman dengan akun organisasi</span>
              </div>
              <div className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-slate-200/80 pt-6 dark:border-white/10">
                {[['01', 'Rekam'], ['02', 'Analisis'], ['03', 'Tindak lanjut']].map(([number, label]) => (
                  <div key={number}>
                    <p className="font-display text-2xl font-semibold text-[#162033] dark:text-white">{number}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden min-h-[520px] lg:block">
              <div className="absolute right-0 top-4 h-[470px] w-[430px] rotate-[-4deg] rounded-[2rem] bg-[#dcdaf8]" />
              <div className="absolute right-6 top-0 w-[430px] rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-2xl shadow-indigo-900/10 backdrop-blur dark:border-white/10 dark:bg-[#181d28]/90">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5 dark:border-white/10">
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#655bd7]" /><span className="text-sm font-semibold">Rapat mingguan product</span></div>
                  <span className="text-xs text-slate-400">Hari ini, 09:30</span>
                </div>
                <div className="py-6">
                  <div className="flex items-end gap-1.5">
                    {[28, 48, 36, 68, 44, 74, 55, 82, 46, 64, 38, 72, 50, 80, 34, 57, 43, 70, 48, 62].map((height, index) => <span key={index} className="w-2 rounded-full bg-[#b7b1f1]" style={{ height }} />)}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400"><span>00:12:38</span><span>Transkripsi berjalan</span></div>
                </div>
                <div className="space-y-3 rounded-2xl bg-[#f7f7fc] p-4 dark:bg-white/5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#655bd7]">Insight AI</p>
                  <p className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-200">"Tim menyepakati peluncuran beta pada minggu ketiga Oktober."</p>
                  <div className="flex items-center gap-2 pt-1"><span className="rounded-full bg-[#e6f7f2] px-2.5 py-1 text-[11px] font-semibold text-[#2a8d72]">Keputusan</span><span className="text-xs text-slate-400">Confidence 96%</span></div>
                </div>
                <div className="mt-4 flex items-center gap-3"><div className="flex -space-x-2">{['NA','BS','AR'].map(initial => <div key={initial} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#dedcf8] text-[10px] font-bold text-[#655bd7] dark:border-[#181d28]">{initial}</div>)}</div><span className="text-xs text-slate-400">3 peserta aktif</span></div>
              </div>
              <div className="absolute bottom-10 left-2 w-52 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl shadow-indigo-900/10 dark:border-white/10 dark:bg-[#181d28]">
                <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-500">Action item</span><CheckSquare2 className="h-4 w-4 text-[#2a8d72]" /></div>
                <p className="mt-3 text-sm font-semibold">6 tugas masih aktif</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full w-[68%] rounded-full bg-[#2a8d72]" /></div>
                <p className="mt-2 text-[11px] text-slate-400">68% selesai bulan ini</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}>
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = { children: React.ReactNode; setSidebarWidth: (width: number) => void };

function DashboardLayoutContent({ children, setSidebarWidth }: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const activeMenuItem = menuGroups.flatMap(group => group.items).find(item => location === item.path || (item.path !== "/" && location.startsWith(item.path.split('?')[0])));

  useEffect(() => {
    if (isCollapsed) setIsResizing(false);
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isResizing) return;
      const left = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const width = event.clientX - left;
      if (width >= MIN_WIDTH && width <= MAX_WIDTH) setSidebarWidth(width);
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  const go = (path: string) => setLocation(path);
  const initials = (user?.name || "A").split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <div ref={sidebarRef} className="relative">
        <Sidebar collapsible="icon" className="border-r border-[#e7e9f1] bg-white dark:border-white/10 dark:bg-[#141821]" disableTransition={isResizing}>
          <SidebarHeader className="h-[76px] justify-center border-b border-[#eef0f5] px-4 dark:border-white/10">
            <div className="flex items-center gap-3">
              <button onClick={toggleSidebar} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#655bd7] text-white shadow-md shadow-[#655bd7]/20 transition hover:bg-[#554bc5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#655bd7]" aria-label="Buka atau tutup navigasi"><WandSparkles className="h-4 w-4" /></button>
              {!isCollapsed && <div className="min-w-0"><p className="truncate text-sm font-bold tracking-[0.12em] text-[#655bd7]">NOTULEN AI</p><p className="truncate text-[10px] font-medium text-slate-400">Aank PRO workspace</p></div>}
            </div>
          </SidebarHeader>
          <SidebarContent className="gap-0 px-3 py-5">
            <Button onClick={() => go('/rekaman')} className="mb-6 h-10 w-full justify-center gap-2 rounded-xl bg-[#655bd7] text-sm font-semibold shadow-lg shadow-[#655bd7]/15 hover:bg-[#554bc5]"><Plus className="h-4 w-4" /><span>Rapat baru</span></Button>
            {menuGroups.map(group => <div key={group.label} className="mb-6"><p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 group-data-[collapsible=icon]:hidden">{group.label}</p><SidebarMenu>{group.items.map(item => { const active = item.path === '/' ? location === '/' : location.startsWith(item.path.split('?')[0]); return <SidebarMenuItem key={item.path}><SidebarMenuButton isActive={active} onClick={() => go(item.path)} tooltip={item.label} className="h-10 rounded-xl font-medium text-slate-500 transition-all data-[active=true]:bg-[#f0effd] data-[active=true]:text-[#655bd7] dark:text-slate-400 dark:data-[active=true]:bg-[#272442] dark:data-[active=true]:text-[#b9b3f5]"><item.icon className="h-[17px] w-[17px]" /><span>{item.label}</span>{item.badge && <span className="ml-auto rounded-full bg-[#e7f5f1] px-2 py-0.5 text-[10px] font-bold text-[#2a8d72] group-data-[collapsible=icon]:hidden">{item.badge}</span>}</SidebarMenuButton></SidebarMenuItem>; })}</SidebarMenu></div>)}
            <div className="mt-auto"><p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 group-data-[collapsible=icon]:hidden">Workspace</p><SidebarMenu><SidebarMenuItem><SidebarMenuButton isActive={location.startsWith('/pengaturan')} onClick={() => go('/pengaturan')} tooltip="Pengaturan" className="h-10 rounded-xl font-medium text-slate-500 data-[active=true]:bg-[#f0effd] data-[active=true]:text-[#655bd7]"><Settings2 className="h-[17px] w-[17px]" /><span>Pengaturan</span></SidebarMenuButton></SidebarMenuItem></SidebarMenu></div>
          </SidebarContent>
          <SidebarFooter className="border-t border-[#eef0f5] p-3 dark:border-white/10">
            <DropdownMenu><DropdownMenuTrigger asChild><button className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#655bd7] dark:hover:bg-white/5"><Avatar className="h-9 w-9 border border-[#dedcf8] bg-[#f0effd]"><AvatarFallback className="bg-[#f0effd] text-xs font-bold text-[#655bd7]">{initials}</AvatarFallback></Avatar><div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden"><p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.name || "Pengguna"}</p><p className="mt-0.5 truncate text-[11px] text-slate-400">{user?.email || "Workspace member"}</p></div><ChevronDown className="h-4 w-4 text-slate-400 group-data-[collapsible=icon]:hidden" /></button></DropdownMenuTrigger><DropdownMenuContent align="end" sideOffset={8} className="w-52 rounded-xl"><DropdownMenuItem onClick={toggleTheme} className="cursor-pointer gap-2">{theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}<span>{theme === 'dark' ? 'Mode terang' : 'Mode gelap'}</span></DropdownMenuItem><DropdownMenuItem onClick={() => go('/pengaturan')} className="cursor-pointer gap-2"><Settings2 className="h-4 w-4" /><span>Pengaturan</span></DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={logout} className="cursor-pointer gap-2 text-destructive focus:text-destructive"><LogOut className="h-4 w-4" /><span>Keluar</span></DropdownMenuItem></DropdownMenuContent></DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div className={`absolute right-0 top-0 h-full w-1 cursor-col-resize transition-colors hover:bg-[#655bd7]/20 ${isCollapsed ? 'hidden' : ''}`} style={{ zIndex: 50 }} onMouseDown={() => !isCollapsed && setIsResizing(true)} />
      </div>
      <SidebarInset className="bg-[#f7f8fc] dark:bg-[#0e1118]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#e7e9f1]/80 bg-[#f7f8fc]/90 px-5 backdrop-blur-xl dark:border-white/10 dark:bg-[#0e1118]/85 lg:px-8">
          <div className="flex items-center gap-3"><SidebarTrigger className="h-9 w-9 rounded-xl text-slate-400 hover:bg-white hover:text-[#655bd7] dark:hover:bg-white/5" /><div className="hidden h-5 w-px bg-slate-200 dark:bg-white/10 sm:block" /><div><p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{activeMenuItem?.label || 'Ringkasan'}</p><p className="text-[11px] text-slate-400">Selamat datang kembali di ruang kerja Anda</p></div></div>
          <div className="flex items-center gap-3"><div className="hidden items-center gap-2 rounded-xl border border-[#e7e9f1] bg-white px-3 py-2 text-xs text-slate-400 shadow-sm md:flex dark:border-white/10 dark:bg-white/5"><span className="h-1.5 w-1.5 rounded-full bg-[#2a8d72]" /> Semua sistem normal</div><Button onClick={() => go('/rekaman')} className="h-9 rounded-xl bg-[#655bd7] px-3 text-xs font-semibold hover:bg-[#554bc5] sm:px-4"><Plus className="mr-1.5 h-4 w-4" /> Rapat baru</Button><Avatar className="h-9 w-9 border border-[#dedcf8] bg-[#f0effd] sm:hidden"><AvatarFallback className="bg-[#f0effd] text-xs font-bold text-[#655bd7]">{initials}</AvatarFallback></Avatar></div>
        </header>
        {isMobile && <div className="flex items-center gap-2 border-b border-[#e7e9f1] bg-white px-4 py-3 dark:border-white/10 dark:bg-[#141821]"><PanelLeft className="h-4 w-4 text-[#655bd7]" /><span className="text-sm font-semibold">{activeMenuItem?.label || 'Ringkasan'}</span></div>}
        <main className="min-h-[calc(100vh-76px)] flex-1 px-5 py-7 lg:px-8">{children}</main>
      </SidebarInset>
    </>
  );
}
