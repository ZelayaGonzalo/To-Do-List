var allTasks=JSON.parse(localStorage.getItem("allTasks")||"[]");
var allProjects=JSON.parse(localStorage.getItem("projects")||"[]");
var currentTab="main";

function createTask(title,description,dueDate,status,project){
        return{
            title,
            description,
            dueDate,
            status,
            project
        }
}
function createProject(name,description){
    return{
        name,
        description
    }
}

navEventListeners();

const taskContainer=document.getElementById("tasksContainer");
const formContainer=document.getElementById("formContainer");
const form=formContainer.querySelector("form");
const projectContainer=document.getElementById("navProjects");
const projectFormContainer=document.getElementById("formProjectContainer");
const projectForm=projectFormContainer.querySelector(".formProject");

function eraseChilds(container){
    while (container.childNodes.length > 2) {
        container.removeChild(container.lastChild);
    }
}
function showProjectsDom(){
    eraseChilds(projectContainer);
    allProjects.forEach(project=>{

        projectContainer.appendChild(createProjectDom(project));
    });
}
function showAllTasksDom(array){
    eraseChilds(taskContainer);
    array.forEach(task =>{
        let delImage=document.createElement("img");
        delImage.src="xButton.png";
        delImage.classList.add("deleteTask");
        delImage.alt="delete this task";
        delImage.addEventListener("click",()=>deleteTask(task))
        taskContainer.appendChild(createTaskDom(task));
        taskContainer.appendChild(delImage);
        });
}

function showSelectedTasks(name){
    const title=taskContainer.querySelector(".taskContainerTitle");
    title.innerHTML=name;
    let arrayToShow= allTasks.filter(task=>task.project==name);
    showAllTasksDom(arrayToShow);
}
function deleteTask(task){
    if (confirm("Delete this task?")){
        for(let i=0;i<allTasks.length;i++){
            if(allTasks[i].title==task.title){
                allTasks.splice(i,1);
                i--;
            }
        }
        updateLocalStorage();
        if(task.project!="noProject" && currentTab=="main"){
            showSelectedTasks(task.project);
        }
        else if(currentTab!="main"){
            ShowSelectedbyDate(currentTab);
        }
        else{
            showAllTasksDom(allTasks);
        }
        
    }
}


function createTaskDom(task){
    let taskLabel=document.createElement("label");
    let taskContent=document.createElement("div");
    let checkbox=document.createElement("input");
    let span=document.createElement("span");
    let date=document.createElement("div");
    taskLabel.classList.add("task");
    taskLabel.for=task.title;
    taskContent.classList.add("taskContent");
    taskContent.innerHTML=task.title;
    checkbox.type="checkbox";
    checkbox.id=task.title;
    if(task.status){
        checkbox.checked=true;
        taskContent.classList.remove("taskContent");
        taskContent.classList.add("taskContentMarked");
    }
    else{
        checkbox.checked=false;
        taskContent.classList.remove("taskContentMarked");
        taskContent.classList.add("taskContent");
    }
    checkbox.addEventListener("change",()=>{
        task.status=!task.status;
        if(task.status){
            taskContent.classList.remove("taskContent");
            taskContent.classList.add("taskContentMarked");
        }
        else{
            taskContent.classList.remove("taskContentMarked");
            taskContent.classList.add("taskContent");
        }
        updateLocalStorage(task);
    });
    span.classList.add("checkmark");
    date.classList.add("date");
    date.innerHTML=task.dueDate;
    taskLabel.appendChild(taskContent);
    taskLabel.appendChild(date);
    taskLabel.appendChild(checkbox);
    taskLabel.appendChild(span);
    return taskLabel;
}

function createProjectDom(projectName){
    let newProject=document.createElement("div");
    newProject.classList.add("project");
    newProject.addEventListener("click",()=>{
        showSelectedTasks(projectName.name);
        currentTab="main";
    });
    newProject.innerHTML=projectName.name;
    newProject.id=projectName.name;
    return newProject;
}



form.addEventListener('submit', event => {
    event.preventDefault();
    let task=createTask(form.elements["title"].value,form.elements["description"].value,new Date(form.elements["date"].value).toDateString(),false);
    if( allTasks.some(task1=> task1.title==task.title)){
        alert("Task already exists");
    }
    else{
        if(form.elements["project"].value!="none"){
            task.project=form.elements["project"].value;
            console.log(task.project);
            allTasks.push(task);
            showSelectedTasks(task.project);
        }
        else{
            allTasks.push(task);
            showAllTasksDom(allTasks);
        }
        updateLocalStorage(task);
        form.reset();
        formContainer.style.display="none"
    }
   
})
projectForm.addEventListener('submit',event =>{
    let exists=false;
    event.preventDefault();
    let project=createProject(projectForm.elements["title"].value,projectForm.elements["description"].value);
    for(let i=0;i<allProjects.length;i++){
        if(allProjects[i].name==projectForm.elements["title"].value){
            exists=true;
        }
    }
    if(exists){
        alert("Project already exists!");
    }
    else{
        console.log(project);
        allProjects.push(project);
        updateLocalStorage();
        showProjectsDom();
        addProjectScrollableForm();
        projectForm.reset();
        projectFormContainer.style.display="none";
    }
    
})



function closePopUp(event){
    event.target.parentNode.parentNode.style.display="none";
}
function showPopUp(name){
    if(name.target.id=="addProject"){
        projectFormContainer.style.display="grid";
    }
    else{
        formContainer.style.display="grid";
    }
}

function addProjectScrollableForm(){
    const parent=form.querySelector("select");
    eraseChilds(parent);
    allProjects.forEach(project=>{
        let option=document.createElement("option");
        option.value=project.name;
        option.innerHTML=project.name;
        parent.appendChild(option);
    })
}

function navEventListeners(){
    document.getElementById("taskList").addEventListener("click",()=>{
    showAllTasksDom(allTasks);
    currentTab="allTask";
    ShowSelectedbyDate("All Tasks");
 });
    document.getElementById("today").addEventListener("click",()=>{
        ShowSelectedbyDate("Today");
        currentTab="Today";
    });

    document.getElementById("thisWeek").addEventListener("click",()=>{
        ShowSelectedbyDate("Week");
        currentTab="Week";
    })

}
function ShowSelectedbyDate(id){
    taskContainer.querySelector(".taskContainerTitle").innerHTML=id;
    if(id=="Today"){
        let show;
        let today=new Date();
        show=allTasks.filter(task=>new Date(task.dueDate).getMonth()==today.getMonth());
        console.log(allTasks);
        console.log(show);
        showAllTasksDom(show);
    }
    /*if(id=="Week"){
        let show;
        let today=new Date();
        show=allTasks.filter(task=>new Date(task.dueDate).getDate());
    }*/
}

function updateLocalStorage(){
    localStorage.setItem("allTasks",JSON.stringify(allTasks));
    localStorage.setItem("projects",JSON.stringify(allProjects));

}


showAllTasksDom(allTasks);
showProjectsDom();
addProjectScrollableForm();
/*let task2=createTask("affff","zzzz",new Date().getDate(),false,"none");
let task=createTask("asd","asdasf",new Date().getDate(),false,"none");
let project1= createProject("project1");
let project2= createProject("project2");
let task2=createTask("affff zxczxcz zxcadasdasd","zzzz",new Date().getDate(),false,"none");
let task=createTask("asd","asdasf",new Date().getDate(),false,"none");
let task3=createTask("asddddd","asdazxczxcsf",new Date().getDate(),false,"none");
allTasks.push(task);
allTasks.push(task2);
allTasks.push(task3);

project1.addTask(task);
project1.addTask(task2);

project2.addTask(task);
project2.addTask(task2);

task.description="aaaaaaaaaaaaaaaaaa";

console.log(project1);
console.log(project2);*/

