import { projects, deleteProject} from './dataModule';

export {renderCards};


const cardGrid = document.querySelector('.card-grid');

//CONTENT:
//createCard, renderCards, clearCards

//--------------------------------------------------------------------------------

//Card management

const createCard = function(project){
    let card = document.createElement('div');
    card.classList.add('card');

    let title = document.createElement('h3');
    let description = document.createElement('p');
    let dueDate = document.createElement('p');
    let crossDelete = document.createElement('div');
    let editProject = document.createElement('div');

    title.textContent = project.title;
    description.textContent = project.description;
    dueDate.textContent = project.dueDate;
    crossDelete.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
    crossDelete.style.display ='none';
    editProject.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 19V5H5v14zm0-16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-2.3 6.35l-1 1l-2.05-2.05l1-1c.21-.22.56-.22.77 0l1.28 1.28c.22.21.22.56 0 .77M7 14.94l6.06-6.06l2.06 2.06L9.06 17H7z"/></svg>';
    editProject.style.display = 'none';


    card.addEventListener('mouseenter', ()=>{
        crossDelete.style.display = 'block';
        editProject.style.display = 'block';
    });
    card.addEventListener('mouseleave', ()=>{
        crossDelete.style.display = 'none';
        editProject.style.display = 'none';
    });
    
    crossDelete.addEventListener('click', (event)=>{
        const gridChildren = Array.from(crossDelete.parentElement.parentElement.children);
        const index = gridChildren.indexOf(crossDelete.parentElement);

        deleteProject(index);
        console.log(projects);
        renderCards();
    });

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(dueDate);
    card.appendChild(crossDelete);
    card.appendChild(editProject);

    return card;
};


//uses createCard for every project data to generate a card then append it to grid
const renderCards = function(){
    clearCards();

    for(let i = 0; i < projects.length; i++){
        cardGrid.appendChild(createCard(projects[i]));
    }
    // console.log(cardGrid.children);
}

//remove card elements from the grid to then re-render them
const clearCards = function(){
    for(let i = cardGrid.children.length - 1 ;i >=0 ; i--){
        cardGrid.removeChild(cardGrid.children[i]);
    };
};
//--------------------------------------------------------------------------------
//New project form events

const newProjectButton = document.querySelector('header svg');
const dialog = document.querySelector('dialog');
const projectForm = document.querySelector('.new-project');
const cancelProjectButton = document.querySelector('#new-project-cancel');

    //open new project form
    newProjectButton.addEventListener('click', ()=>{
        dialog.showModal();
        projectForm.style.display = 'block';
    });


    //submit new project from event

    projectForm.addEventListener('submit', (e)=>{
        e.preventDefault();

        const data = new FormData(projectForm);
        const projectObj = {
            title: data.get('title'),
            description: data.get('description'),
            dueDate: (data.get('dueDate')).replaceAll('-','/'),
            checkList: [],
        };

        projects.push(projectObj);
        
        dialog.close();
        projectForm.style.display = 'none';
        projectForm.reset();

        renderCards();

    });

    //close new project form
    cancelProjectButton.addEventListener('click', (e)=>{
        e.preventDefault();
        dialog.close();
        projectForm.reset();
    });

//--------------------------------------------------------------------------------
