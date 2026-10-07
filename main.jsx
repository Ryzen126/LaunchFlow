import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3, Bell, CalendarDays, Check, ChevronDown, Clock3, FileText,
  Instagram, LayoutDashboard, Linkedin, Menu, MoreHorizontal, Plus,
  Search, Send, Settings, Sparkles, Trash2, TrendingUp, Users, Video,
  X, Youtube, Zap
} from "lucide-react";
import "./style.css";

const initialAccounts = [
  { id: "ig", name: "Instagram", handle: "@launchflow", color: "#e1306c", icon: Instagram, followers: "42.8K", status: "Connected" },
  { id: "tt", name: "TikTok", handle: "@launchflowapp", color: "#25f4ee", icon: Video, followers: "31.2K", status: "Connected" },
  { id: "yt", name: "YouTube", handle: "LaunchFlow", color: "#ff0033", icon: Youtube, followers: "18.6K", status: "Connected" },
  { id: "li", name: "LinkedIn", handle: "LaunchFlow", color: "#0a66c2", icon: Linkedin, followers: "22.4K", status: "Connected" },
  { id: "x", name: "X", handle: "@launchflow", color: "#e7e9ea", icon: X, followers: "13.4K", status: "Connected" }
];

const initialPosts = [
  { id: 1, date: "Today", time: "10:30 AM", title: "LaunchFlow is live 🚀", platforms: ["Instagram", "TikTok"], status: "Scheduled" },
  { id: 2, date: "Tomorrow", time: "9:00 AM", title: "Building smarter social workflows.", platforms: ["LinkedIn", "X"], status: "Scheduled" },
  { id: 3, date: "Oct 12", time: "6:00 PM", title: "Behind the scenes of LaunchFlow.", platforms: ["YouTube", "Instagram"], status: "Draft" }
];

const nav = [
  ["Overview", LayoutDashboard],
  ["Calendar", CalendarDays],
  ["Posts", FileText],
  ["Accounts", Users],
  ["Analytics", BarChart3],
  ["Settings", Settings]
];

function App() {
  const [page, setPage] = useState("Overview");
  const [accounts, setAccounts] = useState(initialAccounts);
  const [posts, setPosts] = useState(initialPosts);
  const [composerOpen, setComposerOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  const addPost = (post) => {
    setPosts(p => [{ ...post, id: Date.now(), date: "Today", status: "Draft" }, ...p]);
    setComposerOpen(false);
    setPage("Posts");
  };

  const toggleAccount = (id) => {
    setAccounts(a => a.map(x => x.id === id ? { ...x, status: x.status === "Connected" ? "Available" : "Connected" } : x));
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Zap size={18} fill="currentColor" /></div>
          <span>LaunchFlow</span>
        </div>
        <div className="workspace">
          <div className="workspace-avatar">L</div>
          <div><strong>LaunchFlow</strong><span>Workspace</span></div>
          <ChevronDown size={15} />
        </div>
        <nav>
          <div className="nav-label">WORKSPACE</div>
          {nav.map(([label, Icon]) => (
            <button key={label} className={page === label ? "nav-item active" : "nav-item"} onClick={() => { setPage(label); setMobileNav(false); }}>
              <Icon size={18} /><span>{label}</span>
              {label === "Posts" && posts.length > 0 && <em>{posts.length}</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="pro-card">
            <div className="pro-icon"><Sparkles size={17} /></div>
            <strong>LaunchFlow Pro</strong>
            <p>Unlock advanced analytics and automation.</p>
            <button>Upgrade plan</button>
          </div>
          <button className="user-card">
            <div className="user-avatar">RC</div>
            <div><strong>Ryan</strong><span>Admin</span></div>
            <MoreHorizontal size={17} />
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNav(v => !v)}><Menu size={21}/></button>
          <div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{page}</strong></div>
          <div className="top-actions">
            <button className="icon-button"><Search size={18}/></button>
            <button className="icon-button notification"><Bell size={18}/><i /></button>
            <button className="create-button" onClick={() => setComposerOpen(true)}><Plus size={17}/> Create post</button>
          </div>
        </header>

        <section className="content">
          {page === "Overview" && <Overview posts={posts} accounts={accounts} onCreate={() => setComposerOpen(true)} />}
          {page === "Calendar" && <Calendar posts={posts} />}
          {page === "Posts" && <Posts posts={posts} onCreate={() => setComposerOpen(true)} setPosts={setPosts} />}
          {page === "Accounts" && <Accounts accounts={accounts} toggleAccount={toggleAccount} />}
          {page === "Analytics" && <Analytics />}
          {page === "Settings" && <SettingsPage />}
        </section>
      </main>

      {composerOpen && <Composer accounts={accounts} onClose={() => setComposerOpen(false)} onSave={addPost} />}
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action }) {
  return <div className="page-header">
    <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>
    {action}
  </div>;
}

function Overview({ posts, accounts, onCreate }) {
  return <>
    <PageHeader eyebrow="Wednesday, October 7" title="Good morning, Ryan 👋" description="Here's what's happening across your social channels." action={<button className="primary" onClick={onCreate}><Plus size={17}/> Create post</button>} />
    <div className="stats-grid">
      <Stat icon={Users} label="Total followers" value="128.4K" delta="+8.2%" />
      <Stat icon={TrendingUp} label="Engagement rate" value="7.8%" delta="+1.4%" />
      <Stat icon={Clock3} label="Scheduled posts" value={String(posts.filter(p=>p.status==="Scheduled").length)} delta="Next: 10:30 AM" />
      <Stat icon={BarChart3} label="Reach this month" value="842K" delta="+18.6%" />
    </div>
    <div className="dashboard-grid">
      <section className="panel large">
        <div className="panel-head"><div><h2>Performance</h2><p>Reach and engagement over the last 30 days.</p></div><button className="select">Last 30 days <ChevronDown size={14}/></button></div>
        <MiniChart />
      </section>
      <section className="panel">
        <div className="panel-head"><div><h2>Connected accounts</h2><p>{accounts.filter(a=>a.status==="Connected").length} of {accounts.length} active</p></div><button className="text-button">Manage</button></div>
        <div className="account-list">{accounts.slice(0,4).map(AccountRow)}</div>
      </section>
    </div>
    <section className="panel">
      <div className="panel-head"><div><h2>Upcoming posts</h2><p>Stay ahead of your content schedule.</p></div><button className="text-button">View calendar</button></div>
      <PostTable posts={posts} />
    </section>
  </>;
}

function Stat({ icon: Icon, label, value, delta }) {
  return <div className="stat-card"><div className="stat-icon"><Icon size={19}/></div><span>{label}</span><strong>{value}</strong><small>{delta}</small></div>;
}

function MiniChart() {
  const bars = [32, 44, 38, 55, 47, 62, 51, 69, 58, 76, 66, 83, 73, 91, 80, 96];
  return <div className="chart"><div className="chart-grid"><span>100K</span><span>75K</span><span>50K</span><span>25K</span><span>0</span></div><div className="bars">{bars.map((h,i)=><div className="bar-wrap" key={i}><div className="bar" style={{height:`${h}%`}} /></div>)}</div><div className="chart-labels"><span>Sep 8</span><span>Sep 15</span><span>Sep 22</span><span>Sep 29</span><span>Oct 7</span></div></div>;
}

function AccountRow(a) {
  const Icon = a.icon;
  return <div className="account-row" key={a.id}><div className="social-icon" style={{"--brand":a.color}}><Icon size={16}/></div><div className="account-copy"><strong>{a.name}</strong><span>{a.handle}</span></div><b>{a.followers}</b><span className="status-dot">●</span></div>;
}

function PostTable({ posts }) {
  return <div className="post-table"><div className="table-head"><span>CONTENT</span><span>CHANNELS</span><span>DATE</span><span>STATUS</span></div>{posts.map(p=><div className="table-row" key={p.id}><div className="post-title"><div className="post-thumb"><Sparkles size={15}/></div><strong>{p.title}</strong></div><div className="platforms">{p.platforms.map(x=><span key={x}>{x}</span>)}</div><span>{p.date} · {p.time}</span><span className={`pill ${p.status.toLowerCase()}`}>{p.status}</span></div>)}</div>;
}

function Calendar({ posts }) {
  const days = Array.from({length:31},(_,i)=>i+1);
  return <><PageHeader eyebrow="Content planning" title="Calendar" description="Plan and visualize your publishing schedule." action={<button className="primary"><Plus size={17}/> Create post</button>} />
    <div className="calendar-toolbar"><button>‹</button><strong>October 2026</strong><button>›</button><div className="spacer"/><button className="select">Month <ChevronDown size={14}/></button></div>
    <section className="calendar-grid"><div className="calendar-week">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=><b key={d}>{d}</b>)}</div><div className="days">{days.map(d=><div className={`day ${d===7?"today":""}`} key={d}><span>{d}</span>{posts.filter(p => (d===7 && p.date==="Today") || (d===8 && p.date==="Tomorrow") || (d===12 && p.date==="Oct 12")).map(p=><div className="calendar-post" key={p.id}><small>{p.time}</small>{p.title}</div>)}</div>)}</div></section>
  </>;
}

function Posts({ posts, onCreate, setPosts }) {
  const [filter,setFilter] = useState("All");
  const shown = filter==="All" ? posts : posts.filter(p=>p.status===filter);
  return <><PageHeader eyebrow="Content library" title="Posts" description="Create, review, and manage everything you're publishing." action={<button className="primary" onClick={onCreate}><Plus size={17}/> Create post</button>} />
    <div className="tabs">{["All","Draft","Scheduled"].map(x=><button className={filter===x?"selected":""} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div>
    <section className="panel"><PostTable posts={shown}/>{shown.length===0 && <div className="empty">No posts in this view.</div>}</section>
    {posts.length>0 && <button className="danger-link" onClick={()=>setPosts([])}><Trash2 size={15}/> Clear demo posts</button>}
  </>;
}

function Accounts({ accounts, toggleAccount }) {
  return <><PageHeader eyebrow="Social presence" title="Accounts" description="Connect and manage all of your social channels in one place." action={<button className="primary"><Plus size={17}/> Connect account</button>} />
    <div className="account-cards">{accounts.map(a=>{const Icon=a.icon; return <div className="account-card" key={a.id}><div className="account-card-top"><div className="social-icon big" style={{"--brand":a.color}}><Icon size={21}/></div><span className={a.status==="Connected"?"connected":"available"}>{a.status==="Connected" && <Check size={13}/>} {a.status}</span></div><h3>{a.name}</h3><p>{a.handle}</p><div className="account-meta"><span>Followers</span><strong>{a.followers}</strong></div><button className="outline" onClick={()=>toggleAccount(a.id)}>{a.status==="Connected"?"Disconnect":"Connect"}</button></div>})}</div>
  </>;
}

function Analytics() {
  return <><PageHeader eyebrow="Insights" title="Analytics" description="Understand what is working across your social channels." action={<button className="select">Last 30 days <ChevronDown size={14}/></button>} />
    <div className="stats-grid"><Stat icon={Users} label="Followers" value="128.4K" delta="+8.2%" /><Stat icon={TrendingUp} label="Engagement" value="7.8%" delta="+1.4%" /><Stat icon={BarChart3} label="Impressions" value="1.26M" delta="+21.3%" /><Stat icon={Send} label="Posts published" value="84" delta="+12 this month" /></div>
    <div className="dashboard-grid"><section className="panel large"><div className="panel-head"><div><h2>Audience growth</h2><p>Follower growth across all channels.</p></div></div><MiniChart /></section><section className="panel"><div className="panel-head"><div><h2>Top channels</h2><p>By engagement rate</p></div></div><div className="ranking"><Rank name="Instagram" value="9.4%" width="94%"/><Rank name="TikTok" value="8.7%" width="87%"/><Rank name="LinkedIn" value="6.2%" width="62%"/><Rank name="YouTube" value="5.8%" width="58%"/><Rank name="X" value="4.1%" width="41%"/></div></section></div>
  </>;
}
function Rank({name,value,width}) { return <div className="rank"><div><span>{name}</span><b>{value}</b></div><i style={{width}}/></div> }

function SettingsPage() {
  return <><PageHeader eyebrow="Workspace" title="Settings" description="Manage your workspace preferences and publishing defaults." />
    <section className="settings-panel"><div className="setting"><div><h3>Workspace name</h3><p>The name shown to your team.</p></div><input defaultValue="LaunchFlow" /></div><div className="setting"><div><h3>Default timezone</h3><p>Used for scheduled posts.</p></div><select defaultValue="Central"><option>Central Time (US & Canada)</option><option>Eastern Time (US & Canada)</option><option>Pacific Time (US & Canada)</option></select></div><div className="setting"><div><h3>Notifications</h3><p>Get notified when scheduled posts are published.</p></div><label className="switch"><input type="checkbox" defaultChecked/><span/></label></div><div className="setting"><div><h3>Auto-save drafts</h3><p>Keep composer changes automatically.</p></div><label className="switch"><input type="checkbox" defaultChecked/><span/></label></div><button className="primary">Save changes</button></section>
  </>;
}

function Composer({ accounts, onClose, onSave }) {
  const [text,setText]=useState("");
  const [selected,setSelected]=useState(accounts.filter(a=>a.status==="Connected").slice(0,2).map(a=>a.id));
  const toggle=id=>setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="composer"><div className="composer-head"><div><div className="eyebrow">New content</div><h2>Create post</h2></div><button className="icon-button" onClick={onClose}><X size={18}/></button></div><label className="field-label">Post content</label><textarea autoFocus value={text} onChange={e=>setText(e.target.value)} placeholder="What do you want to share with your audience?" /><div className="composer-count">{text.length}/2,200</div><label className="field-label">Publish to</label><div className="platform-picker">{accounts.map(a=>{const Icon=a.icon;return <button className={selected.includes(a.id)?"platform selected":"platform"} onClick={()=>toggle(a.id)} key={a.id}><span className="social-icon" style={{"--brand":a.color}}><Icon size={15}/></span>{a.name}{selected.includes(a.id)&&<Check size={14}/>}</button>})}</div><div className="composer-footer"><button className="secondary" onClick={onClose}>Cancel</button><button className="primary" disabled={!text.trim() || !selected.length} onClick={()=>onSave({title:text.trim(),platforms:accounts.filter(a=>selected.includes(a.id)).map(a=>a.name)})}>Save draft</button></div></div></div>;
}

createRoot(document.getElementById("root")).render(<App />);
