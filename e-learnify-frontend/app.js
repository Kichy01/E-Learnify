
/*
E-Learnify Vanilla Full - SPA
Features added:
- Profile page
- Lesson viewer page (lesson content placeholder, can call backend)
- Settings page
- Notifications area
- Improved routing and components
- Clear integration points for Render backend (RENDER_BACKEND_URL)
- Uses localStorage for auth, enrolled, progress
*/
const RENDER_BACKEND_URL = window.RENDER_BACKEND_URL || ""; // update when deploying

// Utilities
function fetchCourses(){
  return fetch('data-courses.json').then(r=>r.json());
}
function el(tag, cls, html){
  const d = document.createElement(tag);
  if(cls) d.className = cls;
  if(html!==undefined) d.innerHTML = html;
  return d;
}
function navTo(hash){ location.hash = hash; }

// Header
function header(){
  const div = el('div','header');
  div.innerHTML = `
    <div class="logo">E-Learnify</div>
    <div class="right topbar">
      <input class="search" placeholder="Search courses..." id="searchInput" />
      <div class="kv">
        <button class="btn ghost" id="notifBtn">Notifications</button>
        <button class="btn" id="loginBtn">Login</button>
        <button class="btn" id="dashBtn">Dashboard</button>
      </div>
    </div>
  `;
  div.querySelector('#loginBtn').addEventListener('click', openLogin);
  div.querySelector('#dashBtn').addEventListener('click', ()=>navTo('#/dashboard'));
  div.querySelector('#searchInput').addEventListener('input', (e)=>{
    const ev = new CustomEvent('search', {detail: e.target.value});
    window.dispatchEvent(ev);
  });
  div.querySelector('#notifBtn').addEventListener('click', ()=>toggleNotifications());
  return div;
}

// Notifications (simple)
function toggleNotifications(){
  const n = document.getElementById('notificationsBox');
  if(n){
    n.remove();
    return;
  }
  const box = el('div','card'); box.id='notificationsBox';
  box.style.position='fixed'; box.style.right='18px'; box.style.top='70px'; box.style.width='320px'; box.style.zIndex='2000';
  box.innerHTML = `<strong>Notifications</strong><div class="small">No new notifications</div>`;
  document.body.appendChild(box);
  setTimeout(()=>{ if(document.getElementById('notificationsBox')) document.getElementById('notificationsBox').remove(); }, 7000);
}

// Auth (simulated; swap with backend calls for production)
function openLogin(){
  const token = localStorage.getItem('token');
  if(token){
    if(confirm('Logout?')){ localStorage.removeItem('token'); localStorage.removeItem('userProfile'); location.reload(); }
    return;
  }
  const name = prompt('Enter your name to login (simulated):','Student');
  if(name){
    const fakeToken = btoa(JSON.stringify({name,ts:Date.now()}));
    localStorage.setItem('token', fakeToken);
    localStorage.setItem('userProfile', JSON.stringify({name,joined: new Date().toISOString()}));
    alert('Logged in as '+name);
    location.reload();
  }
}
function requireAuth(){
  return !!localStorage.getItem('token');
}

// Sidebar
function sidebar(){
  const s = el('div','sidebar');
  const profile = JSON.parse(localStorage.getItem('userProfile')||'{}');
  s.innerHTML = `
    <div class="card">
      <div class="kv"><strong>${profile.name || 'Guest'}</strong><span class="small"> ${profile.name ? 'Member' : ''}</span></div>
      <div class="small">${profile.name ? 'Joined: '+new Date(profile.joined).toLocaleDateString() : 'Login to access personalized features'}</div>
      <div style="margin-top:8px">
        <button class="btn" id="myCoursesBtn">My Courses</button>
        <button class="btn ghost" id="profileBtn" style="margin-left:8px">Profile</button>
      </div>
    </div>
    <div class="card">
      <strong>Progress</strong>
      <div id="xpChart" class="chart"></div>
    </div>
    <div class="card">
      <strong>Quick Links</strong>
      <ul>
        <li><a href="#/">Home</a></li>
        <li><a href="#/courses">Courses</a></li>
        <li><a href="#/dashboard">Dashboard</a></li>
        <li><a href="#/settings">Settings</a></li>
      </ul>
    </div>
  `;
  s.querySelector('#myCoursesBtn').addEventListener('click', ()=>navTo('#/dashboard'));
  s.querySelector('#profileBtn').addEventListener('click', ()=>navTo('#/profile'));
  return s;
}

// Views

function homeView(){
  const container = el('div','container');
  container.appendChild(header());
  const main = el('div','main');
  const content = el('div','content');
  content.innerHTML = `
    <div class="card">
      <h1>Welcome to E-Learnify</h1>
      <p class="small">AI-designed learning paths — converted to a full-featured vanilla app.</p>
      <div style="margin-top:12px"><button class="btn" id="exploreBtn">Explore Courses</button></div>
    </div>
    <div id="featured" class="card"><strong>Featured Courses</strong><div id="featuredGrid" class="course-grid"></div></div>
  `;
  main.appendChild(sidebar());
  main.appendChild(content);
  container.appendChild(main);

  container.querySelector('#exploreBtn').addEventListener('click', ()=>navTo('#/courses'));

  fetchCourses().then(list=>{
    const grid = container.querySelector('#featuredGrid');
    list.slice(0,4).forEach(c=>{
      const elc = el('div','course');
      elc.innerHTML = `<h3>${c.title}</h3><p class="small">${c.description}</p><div style="margin-top:8px"><button data-id="${c.id}" class="btn viewBtn">View</button></div>`;
      grid.appendChild(elc);
    });
    container.querySelectorAll('.viewBtn').forEach(b=>b.addEventListener('click', (e)=>navTo('#/course/'+e.target.dataset.id)));
  });
  return container;
}

function coursesView(query=''){
  const container = el('div','container');
  container.appendChild(header());
  const main = el('div','main');
  const content = el('div','content');
  content.innerHTML = `<div class="card"><h2>Courses</h2><div id="coursesGrid" class="course-grid"></div></div>`;
  main.appendChild(sidebar());
  main.appendChild(content);
  container.appendChild(main);

  fetchCourses().then(list=>{
    const grid = container.querySelector('#coursesGrid');
    const filtered = list.filter(c=>c.title.toLowerCase().includes(query.toLowerCase())||c.description.toLowerCase().includes(query.toLowerCase()));
    filtered.forEach(c=>{
      const elc = el('div','course');
      elc.innerHTML = `<h3>${c.title}</h3><p class="small">${c.description}</p><div style="margin-top:8px"><span class="pill">${c.level}</span> <span class="pill">${c.duration}</span> <div style="margin-top:8px"><button class="btn" data-id="${c.id}">Open</button></div></div>`;
      grid.appendChild(elc);
    });
    grid.querySelectorAll('.btn[data-id]').forEach(b=>b.addEventListener('click',e=>navTo('#/course/'+e.target.dataset.id)));
  });
  return container;
}

function dashboardView(){
  if(!requireAuth()){
    alert('Please login first.');
    navTo('#/');
    return homeView();
  }
  const container = el('div','container');
  container.appendChild(header());
  const main = el('div','main');
  const content = el('div','content');
  content.innerHTML = `<div class="card"><h2>Your Dashboard</h2><div id="myCourses"></div></div>`;
  main.appendChild(sidebar());
  main.appendChild(content);
  container.appendChild(main);

  const enrolled = JSON.parse(localStorage.getItem('enrolled')||'[]');
  fetchCourses().then(list=>{
    const mine = list.filter(c=>enrolled.includes(c.id));
    const myCoursesDiv = container.querySelector('#myCourses');
    if(mine.length===0){
      myCoursesDiv.innerHTML = `<p class="small">You are not enrolled in any courses yet. <button class="btn" id="enrollNow">Explore Courses</button></p>`;
      myCoursesDiv.querySelector('#enrollNow').addEventListener('click', ()=>navTo('#/courses'));
    } else {
      mine.forEach(c=>{
        const elc = el('div','card');
        elc.innerHTML = `<h3>${c.title}</h3><p class="small">${c.description}</p><div class="progress-bar"><div class="progress-fill" style="width:${Math.floor(Math.random()*70)+10}%"></div></div><div style="margin-top:8px"><button class="btn" data-id="${c.id}">Resume</button></div>`;
        myCoursesDiv.appendChild(elc);
      });
      myCoursesDiv.querySelectorAll('.btn[data-id]').forEach(b=>b.addEventListener('click', e=>navTo('#/course/'+e.target.dataset.id)));
    }
    drawXP(container.querySelector('#xpChart'));
  });
  return container;
}

function profileView(){
  if(!requireAuth()){
    alert('Please login first.');
    navTo('#/');
    return homeView();
  }
  const profile = JSON.parse(localStorage.getItem('userProfile')||'{}');
  const container = el('div','container');
  container.appendChild(header());
  const main = el('div','main');
  const content = el('div','content');
  content.innerHTML = `<div class="card"><h2>Profile</h2><div class="small">Name: ${profile.name}</div><div class="small">Joined: ${new Date(profile.joined).toLocaleDateString()}</div></div>`;
  main.appendChild(sidebar());
  main.appendChild(content);
  container.appendChild(main);
  return container;
}

function settingsView(){
  const container = el('div','container');
  container.appendChild(header());
  const main = el('div','main');
  const content = el('div','content');
  content.innerHTML = `<div class="card"><h2>Settings</h2><div class="small">Settings are client-side for this demo. Customize in future to persist server-side.</div></div>`;
  main.appendChild(sidebar());
  main.appendChild(content);
  container.appendChild(main);
  return container;
}

function courseView(id){
  const container = el('div','container');
  container.appendChild(header());
  const main = el('div','main');
  const content = el('div','content');
  content.innerHTML = `<div id="courseCard" class="card"></div>`;
  main.appendChild(sidebar());
  main.appendChild(content);
  container.appendChild(main);

  fetchCourses().then(list=>{
    const c = list.find(x=>x.id===id);
    if(!c){ container.querySelector('#courseCard').innerHTML='<p>Course not found</p>'; return; }
    const enrolled = JSON.parse(localStorage.getItem('enrolled')||'[]');
    const isEnrolled = enrolled.includes(c.id);
    container.querySelector('#courseCard').innerHTML = `
      <h2>${c.title}</h2>
      <p class="small">${c.description}</p>
      <div style="margin-top:8px">
        <button id="enrollBtn" class="btn">${isEnrolled? 'Enrolled' : 'Enroll Now'}</button>
        <button id="startBtn" class="btn ghost" style="margin-left:8px">Start</button>
      </div>
      <div id="modules" style="margin-top:12px"></div>
    `;
    container.querySelector('#enrollBtn').addEventListener('click', ()=>{
      const arr = JSON.parse(localStorage.getItem('enrolled')||'[]');
      if(!arr.includes(c.id)){ arr.push(c.id); localStorage.setItem('enrolled', JSON.stringify(arr)); alert('Enrolled!'); container.querySelector('#enrollBtn').innerText='Enrolled'; }
    });
    container.querySelector('#startBtn').addEventListener('click', ()=>{
      if(!isEnrolled){ alert('Please enroll first.'); return; }
      navTo('#/course/'+c.id+'/lesson/0');
    });
    const modulesDiv = container.querySelector('#modules');
    c.modules.forEach((m, idx)=>{
      const elm = el('div','module-item');
      elm.innerHTML = `<div><strong>${m}</strong><div class="small">Module ${idx+1}</div></div><div><button class="btn ghost" data-lesson="${idx}" data-course="${c.id}">Open</button></div>`;
      modulesDiv.appendChild(elm);
    });
    modulesDiv.querySelectorAll('button[data-lesson]').forEach(b=>{
      b.addEventListener('click', e=>{
        const lesson = e.target.dataset.lesson;
        const course = e.target.dataset.course;
        navTo('#/course/'+course+'/lesson/'+lesson);
      });
    });
  });
  return container;
}

function lessonView(courseId, lessonIndex){
  const container = el('div','container');
  container.appendChild(header());
  const main = el('div','main');
  const content = el('div','content');
  content.innerHTML = `<div id="lessonCard" class="card"></div>`;
  main.appendChild(sidebar());
  main.appendChild(content);
  container.appendChild(main);

  fetchCourses().then(list=>{
    const c = list.find(x=>x.id===courseId);
    if(!c){ container.querySelector('#lessonCard').innerHTML='<p>Course not found</p>'; return; }
    const moduleName = c.modules[parseInt(lessonIndex,10)] || 'Lesson';
    // Attempt to fetch generated lesson from backend if available
    const lessonPlaceholder = `<h2>${moduleName}</h2><div class="lesson-content"><p class="small">This lesson content is a placeholder. If your Render backend is configured, the frontend will call it to fetch AI-generated content.</p><p class="small">To integrate: implement POST ${RENDER_BACKEND_URL || '<RENDER_BACKEND_URL>'}/api/generate-lesson with { courseId, moduleIndex } and return HTML or JSON content.</p></div>`;
    container.querySelector('#lessonCard').innerHTML = lessonPlaceholder + `<div style="margin-top:8px"><button class="btn" id="completeBtn">Mark Complete</button></div>`;
    container.querySelector('#completeBtn').addEventListener('click', ()=>{
      // mark progress locally
      const prog = JSON.parse(localStorage.getItem('progress')||'{}');
      prog[courseId] = prog[courseId] || [];
      if(!prog[courseId].includes(lessonIndex)) prog[courseId].push(lessonIndex);
      localStorage.setItem('progress', JSON.stringify(prog));
      alert('Marked complete');
    });
  });
  return container;
}

// XP chart
function drawXP(el){
  el.innerHTML = '';
  const w = el.clientWidth || 300;
  const h = 120;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  el.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const data = [400,300,500,280,450,320,600];
  const max = Math.max(...data);
  const gap = 8;
  const barW = (w - (data.length-1)*gap)/data.length;
  data.forEach((v,i)=>{
    const x = i*(barW+gap);
    const barH = (v/max)*(h-20);
    ctx.fillStyle = 'rgba(6,182,212,0.9)';
    ctx.fillRect(x, h-barH, barW, barH);
  });
}

// Router
function router(){
  const hash = location.hash || '#/';
  const app = document.getElementById('app');
  if(hash.startsWith('#/course/') && hash.includes('/lesson/')){
    const parts = hash.replace('#/course/','').split('/lesson/');
    const courseId = parts[0];
    const lessonIndex = parts[1];
    mount(lessonView(courseId, lessonIndex));
    return;
  }
  if(hash.startsWith('#/course/')){
    const id = hash.replace('#/course/','');
    mount(courseView(id));
    return;
  }
  if(hash.startsWith('#/courses')){
    const q = new URLSearchParams(hash.split('?')[1]).get('q')||'';
    mount(coursesView(q));
    return;
  }
  if(hash.startsWith('#/dashboard')){
    mount(dashboardView());
    return;
  }
  if(hash.startsWith('#/profile')){
    mount(profileView());
    return;
  }
  if(hash.startsWith('#/settings')){
    mount(settingsView());
    return;
  }
  mount(homeView());
}

function mount(node){
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild(node);
}

window.addEventListener('hashchange', router);
window.addEventListener('load', ()=>{ router(); window.addEventListener('search', (e)=>{ navTo('#/courses?q='+encodeURIComponent(e.detail)); }); });
