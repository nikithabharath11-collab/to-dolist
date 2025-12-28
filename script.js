// Clear board for fresh start
function resetBoard(){
    localStorage.clear();
    document.querySelectorAll(".task-list").forEach(c => c.innerHTML = "");
    alert("All tasks cleared. Start fresh!");
   }
   
   // Add task
   function addTask(){
    let title = taskTitle.value.trim();
    let desc = taskDescription.value;
    let deadline = taskDeadline.value;
    let pr = priority.value;
   
    if(!title){alert("Enter a title");return;}
   
    let id = "task-"+Date.now();
    let card = document.createElement("div");
    card.className = "task-card "+pr;
    card.draggable = true;
    card.id = id;
    card.ondragstart = drag;
   
    card.innerHTML = `
      <b>${title}</b><br>${desc}<br>
      <small>⏳ ${deadline}</small>
    `;
   
    if(deadline) placeInTimeline(card, deadline);
    document.querySelector("#todo .task-list").append(card);
   
    scheduleAlert(title, deadline);
    playSound();
    save();
   }
   
   // Drag-Drop
   function drag(e){ e.dataTransfer.setData("id", e.target.id); }
   function allowDrop(e){ e.preventDefault(); }
   function drop(e){
    e.preventDefault();
    const id = e.dataTransfer.getData("id");
    const card = document.getElementById(id);
    const zone = e.target.closest(".task-list");
    if(zone){ zone.appendChild(card); save(); playSound(); }
   }
   
   // Timeline / Deadline column
   function placeInTimeline(card, time){
    let list = document.querySelector("#deadlines .task-list");
    list.appendChild(card);
    sortTimeline();
   }
   
   function sortTimeline(){
    let list = document.querySelector("#deadlines .task-list");
    let cards = [...list.children];
    cards.sort((a,b)=>{
      let da = new Date(a.innerText.split("⏳")[1]);
      let db = new Date(b.innerText.split("⏳")[1]);
      return da - db;
    });
    list.innerHTML="";
    cards.forEach(c=>list.appendChild(c));
   }
   
   // Notifications (before 24 hrs)
   function scheduleAlert(title, deadline){
    if(!deadline) return;
    Notification.requestPermission();
    let due = new Date(deadline).getTime();
    let alertBefore = due - 86400000;
    let now = Date.now();
    if(alertBefore > now){
      setTimeout(()=>new Notification("⚠ Reminder",{body:`${title} due tomorrow!`}), alertBefore-now);
    }
   }
   
   // Export Tasks
   function exportTasks(){
    let content = "";
    document.querySelectorAll(".column").forEach(col=>{
      content += "\n== "+col.id.toUpperCase()+" ==\n";
      content += col.innerText+"\n";
    });
    let file = new Blob([content],{type:"text/plain"});
    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "TaskBoard.txt";
    a.click();
   }
   
   // Save + Load
   function save(){
    ["todo","progress","completed","deadlines"].forEach(id=>{
      localStorage.setItem(id, document.querySelector(`#${id} .task-list`).innerHTML);
    });
   }
   
   window.onload = ()=>{
    ["todo","progress","completed","deadlines"].forEach(id=>{
      document.querySelector(`#${id} .task-list`).innerHTML = localStorage.getItem(id)||"";
    });
   };
   
   // Sound + Theme
   function playSound(){moveSound.play();}
   function toggleTheme(){document.body.classList.toggle("light-mode");}
   