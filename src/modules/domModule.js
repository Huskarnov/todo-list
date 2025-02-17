import { projects, dataManagement} from './dataModule';

export {cardManagement};

const cardGrid = document.querySelector('.card-grid');
const taskList = document.querySelector('.taskList');
let currentIndex;
//--------------------------------------------------------------------------------
//Card management

function cardManagement(){
const createCard = function(project){
    let card = document.createElement('div');
    card.classList.add('card');

    let title = document.createElement('h3');
    let description = document.createElement('p');
    let dueDate = document.createElement('p');
    let crossDelete = document.createElement('div');

    title.textContent = project.title;
    description.textContent = project.description;
    dueDate.textContent = project.dueDate;

    crossDelete.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
    crossDelete.style.display ='none';
    crossDelete.addEventListener('click', (event)=>{
        event.stopPropagation();

        const index = generalMethods().getIndexInParent(crossDelete.parentElement);

        dataManagement().deleteProject(index);
        dataManagement().updateStorage();
        cardManagement().renderCards();
    });

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(dueDate);
    card.appendChild(crossDelete);

    card.addEventListener('click', (event)=>{
        showProjectDetails(event.currentTarget);
    });
    card.addEventListener('mouseenter', ()=>{
        crossDelete.style.display = 'block';
    });
    card.addEventListener('mouseleave', ()=>{
        crossDelete.style.display = 'none';
    });

    return card;
};


const renderCards = function(){

    clearElementChildren(cardGrid);

    for(let i = 0; i < projects.length; i++){
        cardGrid.appendChild(createCard(projects[i]));
    }
}

return {createCard, renderCards}
};
//--------------------------------------------------------------------------------
//New project 

const newProjectButton = document.querySelector('header svg');
const newProjectDialog = document.querySelector('#dialog-form');
const projectForm = document.querySelector('.new-project');
const cancelProjectButton = document.querySelector('#new-project-cancel');

    newProjectButton.addEventListener('click', ()=>{
        newProjectDialog.showModal();
    });

    newProjectDialog.addEventListener('click', (e)=>{
        
            if(e.target == e.currentTarget){e.currentTarget.close();};
            
    });

    projectForm.addEventListener('submit', (e)=>{
        e.preventDefault();

        const data = new FormData(projectForm);
        const projectObj = {
            title: generalMethods().capitalizeFirst(data.get('title')),
            description: generalMethods().capitalizeFirst(data.get('description')),
            dueDate: (data.get('dueDate')).replaceAll('-','/'),
            checkList: [],
        };

        dataManagement().addProject(projectObj);
        dataManagement().updateStorage();

        newProjectDialog.close();
        projectForm.reset();

        cardManagement().renderCards();

    });



    //close new project form
    cancelProjectButton.addEventListener('click', (e)=>{
        e.preventDefault();
        newProjectDialog.close();
        projectForm.reset();
    });

//--------------------------------------------------------------------------------
//Project details

    const projectDialog = document.querySelector('#projectDialog');
    const projectTitle = document.querySelector('.projectContent h1');

    projectDialog.addEventListener('click', (e)=>{
        if(e.target == e.currentTarget){e.currentTarget.close();};
    });

const showProjectDetails = function(event){

    currentIndex = generalMethods().getIndexInParent(event);

    projectTitle.textContent = projects[currentIndex].title;

    clearElementChildren(taskList);
    renderTasks(taskList);
    
    // console.log(projects[cardIndex].checkList[0][0]);

    projectDialog.showModal();
};

const clearElementChildren = function(element){
    if(element.children.length > 0){
        for (let i = element.children.length; i > 0; i--){
            element.removeChild(element.lastChild);
        };
    };
};

function renderTasks(taskList){

    clearElementChildren(taskList);

    projects[currentIndex].checkList.forEach(element => {
        const taskWrapper = document.createElement('div');

        const statusDescriptionWrapper = document.createElement('div');
        const taskStatus = document.createElement('div');
        const taskDescription = document.createElement('p');

        const editDeleteWrapper = document.createElement('div');
        const taskEdit = document.createElement('div');
        const taskDelete = document.createElement('div');

        taskStatus.innerHTML= '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"/></svg>';
        
        if(element[0] === true){
            taskStatus.style.color = "green";
            taskWrapper.style.opacity = '0.3';
        }  else{ taskStatus.style.color = "grey";};
        
        taskDescription.textContent = generalMethods().capitalizeFirst(element[1]);

        taskEdit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-2.3 6.35c.22-.21.22-.56 0-.77L15.42 7.3a.53.53 0 0 0-.77 0l-1 1l2.05 2.05zM7 14.94V17h2.06l6.06-6.06l-2.06-2.06z"/></svg>';

        taskDelete.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
        taskDelete.addEventListener('click', (e)=>{
            const index = generalMethods().getIndexInParent(e.currentTarget.parentElement.parentElement);
            console.log(currentIndex);
            console.log(index);
            dataManagement().deleteTask(currentIndex, index);
            dataManagement().updateStorage();
            renderTasks(taskList);
        });
        
        statusDescriptionWrapper.appendChild(taskStatus);
        statusDescriptionWrapper.appendChild(taskDescription);
        taskWrapper.appendChild(statusDescriptionWrapper);

        editDeleteWrapper.appendChild(taskEdit);
        editDeleteWrapper.appendChild(taskDelete)
        taskWrapper.appendChild(editDeleteWrapper);

        statusDescriptionWrapper.addEventListener('click', (e)=>{
            const tIndex = generalMethods().getIndexInParent(e.currentTarget.parentElement);
            dataManagement().toggleTask(currentIndex, tIndex);
            dataManagement().updateStorage();
            renderTasks(taskList);

        });

        taskList.appendChild(taskWrapper);
    });
};


const addTaskButton = document.querySelector('.projectContent > svg:last-child');
addTaskButton.addEventListener('click', ()=>{

    if((taskList.lastChild.nodeName === 'DIV')){

    const newTaskForm = document.createElement('form');
    const newTaskInputsWrapper = document.createElement('div');
    const newTaskInput = document.createElement('input');
    const newTaskInputDate = document.createElement('input');
    const newTaskButtonsWrapper = document.createElement('div');
    const newTaskSubmitButton = document.createElement('button');
    const newTaskCancelButton = document.createElement('button');

    newTaskInput.type = 'text';
    newTaskInput.name = 'todo';
    newTaskInput.required = 'true';
    newTaskInput.placeholder = 'New Task';

    newTaskInputDate.type = 'date';
    newTaskInputDate.name = 'taskDate';
    newTaskInputDate.required = 'true';

    newTaskInputsWrapper.append(newTaskInput, newTaskInputDate);


    newTaskSubmitButton.type = 'submit';
    newTaskSubmitButton.innerHTML ='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m10 17l-5-5l1.41-1.42L10 14.17l7.59-7.59L19 8m-7-6A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/></svg>';

    newTaskCancelButton.type = 'button';
    newTaskCancelButton.innerHTML ='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2c5.53 0 10 4.47 10 10s-4.47 10-10 10S2 17.53 2 12S6.47 2 12 2m3.59 5L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41z"/></svg>';
    newTaskButtonsWrapper.append(newTaskSubmitButton, newTaskCancelButton);

    newTaskForm.addEventListener('submit', (e)=>{
        e.preventDefault();

        const taskData = new FormData(newTaskForm);
        projects[currentIndex].checkList.push([false, taskData.get('todo')]);

        dataManagement().updateStorage();
        renderTasks(taskList);

    });    

    newTaskCancelButton.addEventListener('click', ()=>{
            taskList.removeChild(taskList.lastChild);
    });

    newTaskForm.append(newTaskInputsWrapper, newTaskButtonsWrapper);
    
    taskList.appendChild(newTaskForm);

        };
    }
);

const closeDetailsCross = document.querySelector('.projectContent > svg:nth-child(2)');
    closeDetailsCross.addEventListener('click', (e)=>{
        e.currentTarget.parentElement.parentElement.close();
    }
);


//--------------------------------------------------------------------------------

function generalMethods(){

    const getIndexInParent= function(element){
        const parentChildren = Array.from(element.parentElement.children);
        const index = parentChildren.indexOf(element);

        return index;
    };

    const  capitalizeFirst = function(string){
        return String(string).charAt(0).toUpperCase() + (string).slice(1);
    };

    return {getIndexInParent, capitalizeFirst};
}