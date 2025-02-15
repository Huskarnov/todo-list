import { projects,updateStorage, deleteProject} from './dataModule';

export {renderCards};


const cardGrid = document.querySelector('.card-grid');
const taskList = document.querySelector('.taskList');
let currentIndex;
//--------------------------------------------------------------------------------
//Card management

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
        const gridChildren = Array.from(crossDelete.parentElement.parentElement.children);
        const index = gridChildren.indexOf(crossDelete.parentElement);
        deleteProject(index);
        updateStorage();
        renderCards();
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


//uses createCard for every project data to generate a card then append it to grid
const renderCards = function(){

    clearElementChildren(cardGrid);

    for(let i = 0; i < projects.length; i++){
        cardGrid.appendChild(createCard(projects[i]));
    }
}

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
            title: capitalizeFirst(data.get('title')),
            description: capitalizeFirst(data.get('description')),
            dueDate: (data.get('dueDate')).replaceAll('-','/'),
            checkList: [],
        };

        projects.push(projectObj);
        updateStorage();

        newProjectDialog.close();
        projectForm.reset();

        renderCards();

    });

function capitalizeFirst(string){
    return String(string).charAt(0).toUpperCase() + (string).slice(1);
};

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

    

    const parentChildren = Array.from(event.parentElement.children);
    const cardIndex = parentChildren.indexOf(event);
    currentIndex = cardIndex;

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
    projects[currentIndex].checkList.forEach(element => {
        const taskWrapper = document.createElement('div');
        const taskStatus = document.createElement('div');
        const taskDescription = document.createElement('p');

        taskStatus.innerHTML= '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"/></svg>';
        
        if(element[0] === true){
            taskStatus.style.color = "green";
        }  else{ taskStatus.style.color = "grey";};
        
        taskDescription.textContent = capitalizeFirst(element[1]);

        taskWrapper.appendChild(taskStatus);
        taskWrapper.appendChild(taskDescription);

        taskList.appendChild(taskWrapper);
    });
};


const addTaskButton = document.querySelector('.projectContent > svg:last-child');
addTaskButton.addEventListener('click', ()=>{

});

const closeDetailsCross = document.querySelector('.projectContent > svg:nth-child(2)');
    closeDetailsCross.addEventListener('click', (e)=>{
        e.currentTarget.parentElement.parentElement.close();
});


//--------------------------------------------------------------------------------

