import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowRight, BarChart3, Bell, Check, ChevronRight, CirclePlus,
  Edit3, LayoutDashboard, Menu, Plus, Rocket, Save, Settings as SettingsIcon,
  Sparkles, Target, Trash2, Users, X, Zap
} from "lucide-react";
import "./style.css";

const uid = () => Date.now() + Math.floor(Math.random() * 10000);

const defaults = {
  tasks: [
    { id: 1, title: "Set up your business profile", done: true, due: "Today" },
    { id: 2, title: "Connect your social profiles", done: true, due: "Today" },
    { id: 3, title: "Create your launch plan", done: false, due: "Oct 10" },
    { id: 4, title: "Define your first audience", done: false, due: "Oct 12" },
    { id: 5, title: "Publish your first campaign", done: false, due: "Oct 21" }
  ],
  milestones: [
    { id: 1, name: "Foundation", due: "2026-10-10", status: "Complete" },
    { id: 2, name: "Build audience", due: "2026-10-14", status: "In progress" },
    { id: 3, name: "Campaign launch", due: "2026-10-21", status: "Upcoming" }
  ],
  audiences: [
    { id: 1, name: "Early adopters", age: "25–44", location: "United States", interests: "Startups, productivity", notes: "People actively looking for better launch tools." }
  ],
  campaigns: [
    { id: 1, name: "Launch announcement", channel: "Instagram", status: "Scheduled", reach: 1240, engagement: 8.4, conversions: 42 },
    { id: 2, name: "Founder story", channel: "Facebook", status: "Draft", reach: 820, engagement: 6.1, conversions: 19 },
    { id: 3, name: "Product teaser", channel: "TikTok", status: "Live", reach: 2180, engagement: 11.8, conversions: 67 }
  ],
  settings: {
    businessName: "My Business",
    owner: "Launch Founder",
    website: "",
    email: "",
    timezone: "America/Chicago",
    notifications: true
  }
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(`launchflow_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function LogoMark() {
  return (
    <div className="logo-mark" aria-label="LaunchFlow logo">
      <svg viewBox="0 0 72 72" role="img">
        <defs>
          <radialGradient id="lfSky" cx="50%" cy="35%">
            <stop offset="0%" />
            <stop offset="100%" />
          </radialGradient>
          <linearGradient id="lfRocket" x1="0" x2="1">
            <stop offset="0%" />
            <stop offset="100%" />
          </linearGradient>
        </defs>
        <rect width="72" height="72" rx="20" fill="url(#lfSky)" />
        <path d="M7 48c15-8 29-3 40-13 7-6 10-14 18-19" fill="none" stroke="currentColor" strokeWidth="2.4" opacity=".65"/>
        <path d="M4 57c17-5 29-1 43-9 8-5 14-12 20-20" fill="none" stroke="currentColor" strokeWidth="1.7" opacity=".4"/>
        <g fill="currentColor">
          <circle cx="13" cy="17" r="1.5"/><circle cx="27" cy="10" r="1.1"/><circle cx="52" cy="15" r="1.4"/>
          <circle cx="59" cy="30" r="1"/><circle cx="18" cy="31" r="1"/>
        </g>
        <g transform="translate(34 34) rotate(35)">
          <path d="M0-17c7 4 12 11 11 19-1 8-7 12-11 15-4-3-10-7-11-15-1-8 4-15 11-19z" fill="url(#lfRocket)" stroke="currentColor" strokeWidth="1.4"/>
          <circle cx="0" cy="-4" r="3" fill="none" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M-9 9l-8 4 6-9M9 9l8 4-6-9" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M-4 15c1 5 3 8 4 10 1-2 3-5 4-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </g>
      </svg>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={e => e.stopPropagation()}>
        <div className="modal-head"><h3>{title}</h3><button className="icon-btn" onClick={onClose}><X size={18}/></button></div>
        {children}
      </div>
    </div>
  );
}

function Dashboard({ tasks, setTasks, go, toast }) {
  const completed = tasks.filter(t => t.done).length;
  const progress = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  const addTask = () => {
    if (!title.trim()) return;
    setTasks(t => [...t, { id: uid(), title: title.trim(), done: false, due: "New" }]);
    setTitle(""); setAdding(false); toast("Task added");
  };

  return <div className="page">
    <div className="hero">
      <div>
        <div className="eyebrow"><Sparkles size={14}/> LAUNCH CONTROL CENTER</div>
        <h1>Turn your idea into <span>momentum.</span></h1>
        <p>Everything you need to plan, reach your audience, and launch with confidence.</p>
        <div className="hero-actions">
          <button className="primary" onClick={() => go("Launch Plan")}>Continue launch <ArrowRight size={17}/></button>
          <button className="secondary" onClick={() => go("Analytics")}>View analytics</button>
        </div>
      </div>
      <div className="progress-ring" style={{"--p": `${progress}%`}}>
        <div><strong>{progress}%</strong><small>launch ready</small></div>
      </div>
    </div>

    <div className="stat-grid">
      <Stat icon={<Target/>} label="Tasks complete" value={`${completed}/${tasks.length}`} />
      <Stat icon={<Rocket/>} label="Milestones" value="3" />
      <Stat icon={<Users/>} label="Audience segments" value="1" />
      <Stat icon={<Activity/>} label="Conversions" value="128" />
    </div>

    <div className="two-col">
      <Panel title="Today's tasks" action={<button className="text-btn" onClick={() => setAdding(true)}><Plus size={16}/> Add task</button>}>
        <div className="task-list">
          {tasks.map(t => <div className={`task ${t.done ? "done" : ""}`} key={t.id}>
            <button className="check" onClick={() => setTasks(all => all.map(x => x.id === t.id ? {...x, done: !x.done} : x))}>{t.done && <Check size={15}/>}</button>
            <div className="task-copy"><strong>{t.title}</strong><small>{t.due}</small></div>
            <button className="icon-btn subtle" onClick={() => setTasks(all => all.filter(x => x.id !== t.id))}><Trash2 size={15}/></button>
          </div>)}
        </div>
      </Panel>
      <Panel title="Quick actions">
        <div className="quick-grid">
          <Quick icon={<Rocket/>} title="Plan launch" onClick={() => go("Launch Plan")}/>
          <Quick icon={<Users/>} title="Build audience" onClick={() => go("Audience")}/>
          <Quick icon={<BarChart3/>} title="Review analytics" onClick={() => go("Analytics")}/>
          <Quick icon={<SettingsIcon/>} title="Business settings" onClick={() => go("Settings")}/>
        </div>
      </Panel>
    </div>

    {adding && <Modal title="Add a task" onClose={() => setAdding(false)}>
      <label>Task name<input autoFocus value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} placeholder="e.g. Write launch email"/></label>
      <button className="primary full" onClick={addTask}><Plus size={17}/> Add task</button>
    </Modal>}
  </div>;
}

function Stat({icon,label,value}) { return <div className="stat"><div className="stat-icon">{icon}</div><div><small>{label}</small><strong>{value}</strong></div></div> }
function Panel({title, action, children}) { return <section className="panel"><div className="panel-head"><h2>{title}</h2>{action}</div>{children}</section> }
function Quick({icon,title,onClick}) { return <button className="quick" onClick={onClick}><span>{icon}</span><strong>{title}</strong><ChevronRight size={16}/></button> }

function LaunchPlan({ milestones, setMilestones, tasks, setTasks, toast }) {
  const [modal, setModal] = useState(null);
  const [name, setName] = useState("");
  const [due, setDue] = useState("");
  const [status, setStatus] = useState("Upcoming");

  const save = () => {
    if (!name.trim()) return;
    if (modal?.edit) setMilestones(ms => ms.map(m => m.id === modal.edit ? {...m, name: name.trim(), due, status} : m));
    else setMilestones(ms => [...ms, {id: uid(), name: name.trim(), due, status}]);
    setModal(null); toast(modal?.edit ? "Milestone updated" : "Milestone added");
  };
  const open = (m) => { setName(m?.name || ""); setDue(m?.due || ""); setStatus(m?.status || "Upcoming"); setModal({edit:m?.id}); };

  return <div className="page">
    <PageTitle eyebrow="YOUR ROADMAP" title="Launch Plan" text="Turn your launch into clear milestones and manageable tasks."/>
    <div className="plan-grid">
      {milestones.map((m, i) => <div className="milestone" key={m.id}>
        <div className="milestone-top"><span className={`status ${m.status.toLowerCase().replace(" ","-")}`}>{m.status}</span><button className="icon-btn" onClick={() => open(m)}><Edit3 size={16}/></button></div>
        <div className="milestone-number">{String(i+1).padStart(2,"0")}</div>
        <h3>{m.name}</h3><small>Due {m.due || "No date"}</small>
        <div className="mini-progress"><i style={{width:m.status==="Complete"?"100%":m.status==="In progress"?"55%":"10%"}}/></div>
      </div>)}
      <button className="add-card" onClick={() => open()}><CirclePlus size={25}/><strong>Add milestone</strong><span>Build the next step</span></button>
    </div>
    <Panel title="Launch checklist" action={<span className="muted">{tasks.filter(t=>t.done).length}/{tasks.length} complete</span>}>
      <div className="task-list">
        {tasks.map(t => <div className={`task ${t.done?"done":""}`} key={t.id}>
          <button className="check" onClick={() => setTasks(all=>all.map(x=>x.id===t.id?{...x,done:!x.done}:x))}>{t.done&&<Check size={15}/>}</button>
          <div className="task-copy"><strong>{t.title}</strong><small>{t.due}</small></div>
        </div>)}
      </div>
    </Panel>
    {modal && <Modal title={modal.edit ? "Edit milestone" : "Add milestone"} onClose={() => setModal(null)}>
      <label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Content launch"/></label>
      <label>Due date<input type="date" value={due} onChange={e=>setDue(e.target.value)}/></label>
      <label>Status<select value={status} onChange={e=>setStatus(e.target.value)}><option>Upcoming</option><option>In progress</option><option>Complete</option></select></label>
      <button className="primary full" onClick={save}><Save size={17}/> Save milestone</button>
    </Modal>}
  </div>;
}

function Audience({ audiences, setAudiences, toast }) {
  const blank = {name:"", age:"", location:"", interests:"", notes:""};
  const [form,setForm]=useState(blank);
  const [editing,setEditing]=useState(null);
  const save=()=>{
    if(!form.name.trim()) return;
    if(editing) setAudiences(a=>a.map(x=>x.id===editing?{...form,id:editing}:x));
    else setAudiences(a=>[...a,{...form,id:uid()}]);
    setForm(blank);setEditing(null);toast(editing?"Audience updated":"Audience segment added");
  };
  const edit=a=>{setForm({...a});setEditing(a.id)};
  return <div className="page">
    <PageTitle eyebrow="KNOW YOUR PEOPLE" title="Audience" text="Create focused audience segments so every campaign has a clear target."/>
    <div className="content-grid">
      <Panel title={editing?"Edit segment":"New audience segment"}>
        <div className="form-grid">
          <label>Name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Early adopters"/></label>
          <label>Age range<input value={form.age} onChange={e=>setForm({...form,age:e.target.value})} placeholder="25–44"/></label>
          <label>Location<input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="United States"/></label>
          <label>Interests<input value={form.interests} onChange={e=>setForm({...form,interests:e.target.value})} placeholder="Startups, fitness..."/></label>
        </div>
        <label>Notes<textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="What makes this audience valuable?"/></label>
        <div className="form-actions">{editing&&<button className="secondary" onClick={()=>{setEditing(null);setForm(blank)}}>Cancel</button>}<button className="primary" onClick={save}><Save size={17}/> Save segment</button></div>
      </Panel>
      <div className="cards-list">
        {audiences.map(a=><div className="audience-card" key={a.id}>
          <div className="audience-avatar"><Users size={20}/></div><div className="audience-body"><div className="row"><h3>{a.name}</h3><div><button className="icon-btn" onClick={()=>edit(a)}><Edit3 size={15}/></button><button className="icon-btn" onClick={()=>{setAudiences(all=>all.filter(x=>x.id!==a.id));toast("Segment deleted")}}><Trash2 size={15}/></button></div></div>
          <p>{a.location} · {a.age}</p><div className="chips">{a.interests.split(",").filter(Boolean).map(x=><span key={x}>{x.trim()}</span>)}</div><small>{a.notes}</small></div>
        </div>)}
        {!audiences.length&&<div className="empty"><Users size={28}/><strong>No audience segments yet</strong><span>Create your first segment on the left.</span></div>}
      </div>
    </div>
  </div>;
}

function Analytics({campaigns,setCampaigns,toast}) {
  const totalReach=campaigns.reduce((n,c)=>n+Number(c.reach||0),0);
  const conversions=campaigns.reduce((n,c)=>n+Number(c.conversions||0),0);
  const avg=campaigns.length?(campaigns.reduce((n,c)=>n+Number(c.engagement||0),0)/campaigns.length).toFixed(1):"0.0";
  const [show,setShow]=useState(false); const [name,setName]=useState(""); const [channel,setChannel]=useState("Instagram");
  const add=()=>{if(!name.trim())return;setCampaigns(c=>[...c,{id:uid(),name:name.trim(),channel,status:"Draft",reach:0,engagement:0,conversions:0}]);setName("");setShow(false);toast("Campaign added")};
  return <div className="page">
    <PageTitle eyebrow="MEASURE MOMENTUM" title="Analytics" text="Track the signals that matter and see which campaigns are moving your launch forward."/>
    <div className="stat-grid">
      <Stat icon={<Users/>} label="Total reach" value={totalReach.toLocaleString()}/>
      <Stat icon={<Activity/>} label="Avg. engagement" value={`${avg}%`}/>
      <Stat icon={<Zap/>} label="Conversions" value={conversions}/>
      <Stat icon={<Target/>} label="Campaigns" value={campaigns.length}/>
    </div>
    <Panel title="Campaign performance" action={<button className="text-btn" onClick={()=>setShow(true)}><Plus size={16}/> New campaign</button>}>
      <div className="campaign-list">{campaigns.map(c=><div className="campaign" key={c.id}>
        <div><strong>{c.name}</strong><small>{c.channel} · {c.status}</small></div>
        <div className="campaign-metric"><small>Reach</small><strong>{Number(c.reach).toLocaleString()}</strong></div>
        <div className="campaign-metric"><small>Engagement</small><strong>{c.engagement}%</strong></div>
        <div className="campaign-metric"><small>Conversions</small><strong>{c.conversions}</strong></div>
        <button className="icon-btn" onClick={()=>{setCampaigns(all=>all.filter(x=>x.id!==c.id));toast("Campaign deleted")}}><Trash2 size={15}/></button>
      </div>)}</div>
    </Panel>
    <Panel title="Reach overview">
      <div className="bar-chart">{campaigns.map(c=><div className="bar-wrap" key={c.id}><div className="bar" style={{height:`${Math.max(8,Math.min(100,Number(c.reach)/25))}%`}}/><span>{c.channel}</span></div>)}</div>
    </Panel>
    {show&&<Modal title="New campaign" onClose={()=>setShow(false)}><label>Campaign name<input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="Launch announcement"/></label><label>Channel<select value={channel} onChange={e=>setChannel(e.target.value)}><option>Instagram</option><option>Facebook</option><option>TikTok</option><option>Email</option><option>LinkedIn</option></select></label><button className="primary full" onClick={add}><Plus size={17}/> Create campaign</button></Modal>}
  </div>;
}

function Settings({settings,setSettings,toast}) {
  const [form,setForm]=useState(settings);
  const save=()=>{setSettings(form);toast("Settings saved")};
  return <div className="page">
    <PageTitle eyebrow="WORKSPACE" title="Settings" text="Keep your business information and LaunchFlow preferences up to date."/>
    <div className="settings-layout"><Panel title="Business profile">
      <div className="form-grid"><label>Business name<input value={form.businessName} onChange={e=>setForm({...form,businessName:e.target.value})}/></label><label>Owner name<input value={form.owner} onChange={e=>setForm({...form,owner:e.target.value})}/></label><label>Website<input value={form.website} onChange={e=>setForm({...form,website:e.target.value})} placeholder="https://"/></label><label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label></div>
      <label>Timezone<select value={form.timezone} onChange={e=>setForm({...form,timezone:e.target.value})}><option>America/Chicago</option><option>America/New_York</option><option>America/Denver</option><option>America/Los_Angeles</option></select></label>
      <div className="toggle-row"><div><strong>Notifications</strong><small>Show reminders for launch tasks and milestones.</small></div><button className={`toggle ${form.notifications?"on":""}`} onClick={()=>setForm({...form,notifications:!form.notifications})}><i/></button></div>
      <button className="primary" onClick={save}><Save size={17}/> Save changes</button>
    </Panel><div className="settings-card"><div className="settings-icon"><Bell/></div><h3>LaunchFlow is ready</h3><p>Your workspace data is stored locally on this device in this version. You can use the app without an account.</p><div className="tip"><Sparkles size={16}/><span>Tip: complete your launch checklist to raise your readiness score.</span></div></div></div>
  </div>;
}

function PageTitle({eyebrow,title,text}) { return <div className="page-title"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{text}</p></div> }

export default function App() {
  const [active,setActive]=useState("Dashboard");
  const [drawer,setDrawer]=useState(false);
  const [toastText,setToastText]=useState("");
  const [tasks,setTasks]=useState(()=>load("tasks",defaults.tasks));
  const [milestones,setMilestones]=useState(()=>load("milestones",defaults.milestones));
  const [audiences,setAudiences]=useState(()=>load("audiences",defaults.audiences));
  const [campaigns,setCampaigns]=useState(()=>load("campaigns",defaults.campaigns));
  const [settings,setSettings]=useState(()=>load("settings",defaults.settings));

  useEffect(()=>localStorage.setItem("launchflow_tasks",JSON.stringify(tasks)),[tasks]);
  useEffect(()=>localStorage.setItem("launchflow_milestones",JSON.stringify(milestones)),[milestones]);
  useEffect(()=>localStorage.setItem("launchflow_audiences",JSON.stringify(audiences)),[audiences]);
  useEffect(()=>localStorage.setItem("launchflow_campaigns",JSON.stringify(campaigns)),[campaigns]);
  useEffect(()=>localStorage.setItem("launchflow_settings",JSON.stringify(settings)),[settings]);

  const nav = [
    ["Dashboard",LayoutDashboard],["Launch Plan",Rocket],["Audience",Users],["Analytics",BarChart3],["Settings",SettingsIcon]
  ];
  const go = page => { setActive(page); setDrawer(false); };
  const toast = msg => { setToastText(msg); window.clearTimeout(window.__lfToast); window.__lfToast=window.setTimeout(()=>setToastText(""),2200); };

  return <div className="app-shell">
    <aside className={`side ${drawer?"open":""}`}>
      <div className="brand"><LogoMark/><div><strong>LaunchFlow</strong><span>Launch smarter.</span></div><button className="close-mobile" onClick={()=>setDrawer(false)}><X/></button></div>
      <nav>{nav.map(([label,Icon])=><button key={label} className={active===label?"active":""} onClick={()=>go(label)}><Icon size={19}/><span>{label}</span></button>)}</nav>
      <div className="side-bottom"><div className="upgrade"><Sparkles size={17}/><strong>Launch mode</strong><span>Everything in one place.</span></div><div className="profile"><div className="avatar">{(settings.owner||"L").slice(0,1).toUpperCase()}</div><div><strong>{settings.owner||"Launch Founder"}</strong><small>{settings.businessName||"My Business"}</small></div></div></div>
    </aside>
    {drawer&&<div className="scrim" onClick={()=>setDrawer(false)}/>}
    <main className="workspace">
      <header className="topbar"><button className="mobile-menu" onClick={()=>setDrawer(true)}><Menu/></button><div><span className="crumb">Workspace</span><strong>{active}</strong></div><button className="new-project" onClick={()=>{go("Launch Plan");toast("Ready to plan your next launch")}}><Plus size={17}/> New project</button></header>
      {active==="Dashboard"&&<Dashboard tasks={tasks} setTasks={setTasks} go={go} toast={toast}/>}
      {active==="Launch Plan"&&<LaunchPlan milestones={milestones} setMilestones={setMilestones} tasks={tasks} setTasks={setTasks} toast={toast}/>}
      {active==="Audience"&&<Audience audiences={audiences} setAudiences={setAudiences} toast={toast}/>}
      {active==="Analytics"&&<Analytics campaigns={campaigns} setCampaigns={setCampaigns} toast={toast}/>}
      {active==="Settings"&&<Settings settings={settings} setSettings={setSettings} toast={toast}/>}
    </main>
    <div className={`toast ${toastText?"show":""}`}><Check size={16}/>{toastText}</div>
  </div>;
}
