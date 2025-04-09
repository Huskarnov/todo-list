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

    let title = document.createElement('h2');
    let description = document.createElement('p');
    let dueDate = document.createElement('p');
    let crossDelete = document.createElement('div');

    title.textContent = project.title;
    description.textContent = project.description;
    dueDate.textContent = project.dueDate;

    crossDelete.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
    crossDelete.style.display ='none';
    crossDelete.addEventListener('click', (event)=>{
        event.stopPropagation();

        const index = generalMethods().getIndexInParent(crossDelete.parentElement);

        dataManagement().deleteProject(index);
        dataManagement().updateStorage();
        cardGrid.removeChild(crossDelete.parentElement);
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

    generalMethods().clearElementChildren(cardGrid);

    for(let i = 0; i < projects.length; i++){
        cardGrid.appendChild(createCard(projects[i]));
    }
}

return {createCard, renderCards}
};
//--------------------------------------------------------------------------------
//New project 

const newProjectButton = document.querySelector('header button:nth-child(1)');
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
            dueDate: (data.get('dueDate')),
            // dueDate: (data.get('dueDate')).replaceAll('-','/'),
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
//All tasks
const allTasksAllProjectsButton = document.querySelector('header button:nth-child(2)');
// const allTasksButton = document.querySelector('.all-tasks');
const allTasksList = document.querySelector('.all-taskList');
allTasksList.classList.add('taskList');

allTasksAllProjectsButton.addEventListener('click', ()=>{

    generalMethods().clearElementChildren(allTasksList);

    appendItemsInElement(regroupTasks(), allTasksList);
    //currentTask index needed

        if((cardGrid.style.display !== 'none')){
            allTasksAllProjectsButton.innerHTML = 'All <br>Projects';
            allTasksList.style.display = 'flex';
            cardGrid.style.display = 'none';
        }else{
            allTasksAllProjectsButton.innerHTML = 'All <br>Tasks';
            allTasksList.style.display = 'none';
            cardGrid.style.display = 'grid';
        }
    }
);

function renderCumulatedTasks(){
    generalMethods().clearElementChildren(allTasksList);
    appendItemsInElement(regroupTasks(), allTasksList);
};

function regroupTasks(){
    const allTasksArray = projects.reduce((accumulator, project) => 
        
        accumulator.concat(project.checkList)
    
    ,[]);
    
    allTasksArray.sort((a,b) => a[3] - b[3]);

    // console.log(allTasksArray);

    return allTasksArray;
};
//---------------------------------------------------------------------------------------
//Project details

    const projectDialog = document.querySelector('#projectDialog');
    const projectTitle = document.querySelector('.projectContent h3');

    projectDialog.addEventListener('click', (e)=>{
        if(e.target == e.currentTarget){e.currentTarget.close();};
    });

const showProjectDetails = function(event){

    currentIndex = generalMethods().getIndexInParent(event);

    projectTitle.textContent = projects[currentIndex].title;

    generalMethods().clearElementChildren(taskList);
    renderTasks();
    taskList.style.display = 'flex';
    
    // console.log(projects[cardIndex].checkList[0][0]);

    projectDialog.showModal();

    // cardGrid.style.display = 'grid';
};



function renderTasks(){

    generalMethods().clearElementChildren(taskList);

    appendItemsInElement(projects[currentIndex].checkList, taskList);

};

function appendItemsInElement(array, element){

    array.forEach((task) => {
        
        element.appendChild(renderOneTask(task));

    });

};

function renderOneTask(task){
    
    let projectIndex;

    for(let i = 0; i <= (projects.length -1); i ++){
        if(projects[i].checkList.includes(task)){
            projectIndex = i;
        }
    };

    let index = projects[projectIndex].checkList.indexOf(task);
    console.log(index);


    const taskWrapper = document.createElement('div');
    const statusDescriptionWrapper = renderTaskContent(task, projectIndex, index).statusDescriptionWrapper;
    const editDeleteWrapper = renderTaskContent(task, projectIndex, index).editDeleteWrapper;

    taskWrapper.appendChild(statusDescriptionWrapper);
    taskWrapper.appendChild(editDeleteWrapper);
    taskWrapper.addEventListener('click', (e)=>{
        // e.stopPropagation(); !(e.target.nodeName === "svg") && !(e.target.nodeName === "path") && !(e.target.nodeName === "BUTTON") && !(e.target.nodeName === "INPUT")
            // e.stopPropagation();
            if(e.currentTarget.children.length === 2){
            // const tIndex = generalMethods().getIndexInParent(e.currentTarget);

            generalMethods().toggleTaskwrapper(taskWrapper, projectIndex, index, task);
        };
        
    }
);

    // taskWrapper.style.opacity = '1';

    if((( task[3] - ((new Date()).getTime()) ) < 1000)){
        projects[projectIndex].checkList[index][0] = true;
        dataManagement().updateStorage();
    };

    if(task[0] === true ){
        taskWrapper.style.opacity = '0.3';
    };

    return taskWrapper;
};

function renderTaskContent(task, projectIndex, index){

    // const taskRTC = task;
    const statusDescriptionWrapper = document.createElement('div');
    const taskStatus = document.createElement('div');
    const taskDescription = document.createElement('p');
    const taskRemainingTime = document.createElement('p');

    const editDeleteWrapper = document.createElement('div');
    const taskEdit = document.createElement('div');
    const taskDelete = document.createElement('div');

    taskStatus.innerHTML= '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/></svg>';
    taskStatus.style.color = (task[2] == 1)? "yellow": (task[2] == 2)? "orange" : "red";
    taskStatus.addEventListener('click', (e)=>{
        
        e.stopPropagation();
        // const index = generalMethods().getIndexInParent(taskStatus.parentElement.parentElement);
        if(projects[projectIndex].checkList[index][0] === false){

        switch(task[2]){
            case 1:
                // taskRTC[2] = 2;
                projects[projectIndex].checkList[index][2] = 2;
                taskStatus.style.color = "orange";
                console.log('1');
            break;

            case 2:
                // taskRTC[2] = 3;
                projects[projectIndex].checkList[index][2] = 3;
                taskStatus.style.color = "red";
                console.log('2');
            break;

            case 3:
                // taskRTC[2] = 1;
                projects[projectIndex].checkList[index][2] = 1;
                taskStatus.style.color = "yellow";
                console.log('3');
            break;
        };
            dataManagement().updateStorage();

                };

            }
        );
    
    taskDescription.textContent = generalMethods().capitalizeFirst(task[1]);

    taskRemainingTime.textContent = generalMethods().getRemainingTime(task[3]);

    // const timeSubstraction = (task[3] - ((new Date()).getTime()));

    // if (timeSubstraction <= 0){
    //     taskRemainingTime.textContent = 'Expired';
    // } else if(((timeSubstraction)/(1000*3600)) >= 24){
    //     taskRemainingTime.textContent = `${Math.round((timeSubstraction)/(1000*3600*24))} D`;
    // }else if(((timeSubstraction)/(1000*3600)) >= 1){
    //     taskRemainingTime.textContent = `${Math.round((timeSubstraction)/(1000*3600))} H`;
    // }else if(((timeSubstraction)/(1000)) < 3600){
    //     taskRemainingTime.textContent = `${Math.round((timeSubstraction)/(1000 * 60))} Min`;
    // };

    // console.log(task[4]);
    // console.log((new Date()).getTime());  
    // console.log((new Date(taskData.get('taskDate'))).getTime());  
    // console.log(new Date(taskData.get('taskDate')) - new Date());  
    

    taskEdit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-2.3 6.35c.22-.21.22-.56 0-.77L15.42 7.3a.53.53 0 0 0-.77 0l-1 1l2.05 2.05zM7 14.94V17h2.06l6.06-6.06l-2.06-2.06z"/></svg>';
    taskEdit.addEventListener('click', (e)=>{
        
        e.stopPropagation();
        const currentTask = e.currentTarget.parentElement.parentElement;
        // const index = generalMethods().getIndexInParent(currentTask);
        
        if(projects[projectIndex].checkList[index][0] === false){   

        const taskEditForm = document.createElement('form'); taskEditForm.classList.add('editTask');
        const taskEditInput = document.createElement('input');
        const taskEditButtonSubmit = document.createElement('button');
        const taskEditButtonCancel = document.createElement('button');

        taskEditInput.value = projects[projectIndex].checkList[index][1];
        taskEditButtonSubmit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 24 24"><path fill="currentColor" d="m10 17l-5-5l1.41-1.42L10 14.17l7.59-7.59L19 8m-7-6A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/></svg>';
        taskEditButtonCancel.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="33" height="33 " viewBox="0 0 24 24"><path fill="currentColor" d="M12 2c5.53 0 10 4.47 10 10s-4.47 10-10 10S2 17.53 2 12S6.47 2 12 2m3.59 5L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41z"/></svg>';    
        
        taskEditButtonSubmit.addEventListener('click', (e)=>{
            // const parent = e.currentTarget.parentElement.parentElement;
            e.preventDefault();
            e.stopPropagation();
            projects[projectIndex].checkList[index][1] = taskEditInput.value;

            // generalMethods().clearElementChildren(parent);
            // parent.appendChild(renderTaskContent(task).statusDescriptionWrapper);
            // parent.appendChild(renderTaskContent(task).editDeleteWrapper);

            


            dataManagement().updateStorage();

            if (cardGrid.style.display !== 'none'){
                renderTasks();
            }else{
                renderCumulatedTasks();
            };
            

            
        });

        taskEditButtonCancel.addEventListener('click', (e)=>{
            e.preventDefault();
            e.stopPropagation();
            
            // const parent = e.currentTarget.parentElement.parentElement;
            // generalMethods().clearElementChildren(parent);
            // parent.appendChild(renderTaskContent(task).statusDescriptionWrapper);
            // parent.appendChild(renderTaskContent(task).editDeleteWrapper);

            if (cardGrid.style.display !== 'none'){
                renderTasks();
            }else{
                renderCumulatedTasks();
            };
            
        });


        taskEditForm.appendChild(taskEditInput);
        taskEditForm.appendChild(taskEditButtonSubmit);
        taskEditForm.appendChild(taskEditButtonCancel);

        generalMethods().clearElementChildren(currentTask);
        currentTask.appendChild(taskEditForm);


                };
            }
        ); 


    taskDelete.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 24 24"><path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
    taskDelete.addEventListener('click', (e)=>{
        e.stopPropagation();
        // const index = generalMethods().getIndexInParent(e.currentTarget.parentElement.parentElement);

        // if(projects[projectIndex].checkList[index][0] === false){   
        dataManagement().deleteTask(projectIndex, index);
        dataManagement().updateStorage();
        // taskList.removeChild(taskDelete.parentElement.parentElement);
        
        if (cardGrid.style.display !== 'none'){
            renderTasks();
        }else{
            renderCumulatedTasks();
        };
        // };

    });
    
    statusDescriptionWrapper.append(taskStatus, taskDescription, taskRemainingTime);


    editDeleteWrapper.appendChild(taskEdit);
    editDeleteWrapper.appendChild(taskDelete)

    return {statusDescriptionWrapper, editDeleteWrapper};
};


const addTaskButton = document.querySelector('.projectContent > button:last-child');
addTaskButton.addEventListener('click', ()=>{
    renderTasks();

    if((taskList.children.length == 0) || (taskList.lastChild.nodeName === 'DIV')){

    const newTaskForm = document.createElement('form');
    const newTaskInputsWrapper = document.createElement('div');
    const newTaskInput = document.createElement('input');
    const newTaskInputDate = document.createElement('input');

    const newTaskRadioWrapper = document.createElement('div');
    const newTaskRadioTitle = document.createElement('h4');
    const divLow = document.createElement('div');
    const newTaskInputRadioLow = document.createElement('input');
    const divMed = document.createElement('div');
    const newTaskInputRadioMedium = document.createElement('input');
    const divHigh = document.createElement('div');
    const newTaskInputRadioHeigh = document.createElement('input');

    const newTaskButtonsWrapper = document.createElement('div');
    const newTaskSubmitButton = document.createElement('button');
    const newTaskCancelButton = document.createElement('button');

    newTaskInput.type = 'text';
    newTaskInput.name = 'todo';
    newTaskInput.required = 'true';
    newTaskInput.placeholder = 'Description';

    newTaskInputDate.type = 'datetime-local';
    newTaskInputDate.name = 'taskDate';
    // newTaskInputDate.min = JSON.stringify(new Date());
    newTaskInputDate.required = 'true';
    

    newTaskRadioTitle.textContent = "Priority";
    Object.assign(newTaskInputRadioLow, {type:"radio", id:"low", name:"priority", value: 1});
    Object.assign(newTaskInputRadioMedium, {type:"radio", id:"medium", name:"priority", value: 2, checked: "checked"});
    Object.assign(newTaskInputRadioHeigh, {type:"radio", id:"heigh", name:"priority", value: 3});

    newTaskRadioWrapper.classList.add('priorityRadio');
    divLow.appendChild(newTaskInputRadioLow);
    divMed.appendChild(newTaskInputRadioMedium);
    divHigh.appendChild(newTaskInputRadioHeigh);
    newTaskRadioWrapper.append(newTaskRadioTitle, divLow , divMed, divHigh)

    newTaskInputsWrapper.append(newTaskInput, newTaskInputDate, newTaskRadioWrapper);


    newTaskSubmitButton.type = 'submit';
    newTaskSubmitButton.innerHTML ='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m10 17l-5-5l1.41-1.42L10 14.17l7.59-7.59L19 8m-7-6A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/></svg>';

    newTaskCancelButton.type = 'button';
    newTaskCancelButton.innerHTML ='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2c5.53 0 10 4.47 10 10s-4.47 10-10 10S2 17.53 2 12S6.47 2 12 2m3.59 5L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41z"/></svg>';
    
    
    newTaskButtonsWrapper.append(newTaskSubmitButton, newTaskCancelButton);

    newTaskForm.addEventListener('submit', (e)=>{
        // renderTasks(taskList);
        e.preventDefault();

        const taskData = new FormData(newTaskForm);
        projects[currentIndex].checkList.push([false, taskData.get('todo'), Number(taskData.get('priority')), (new Date(taskData.get('taskDate'))).getTime()]);

        projects[currentIndex].checkList = projects[currentIndex].checkList.sort((a, b) => a[3]-b[3]);
        


        dataManagement().updateStorage();
        renderTasks();

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
        if((String(string).charAt(0)).match(/[a-z]/i)){
        return String(string).charAt(0).toUpperCase() + String(string).slice(1);
        }else{
            return String(string);
        };
    };

    const clearElementChildren = function(element){
        if(element.children.length > 0){
            for (let i = element.children.length; i > 0; i--){
                element.removeChild(element.lastChild);
            };
        };
    };

    const toggleTaskwrapper= function(taskWrapper, projectIndex, index, task){


        dataManagement().toggleTask(projectIndex, index);
        dataManagement().updateStorage();
        // clearElementChildren(taskWrapper);
        if(task[0] === true){
            taskWrapper.style.opacity = '0.3';
        }else{taskWrapper.style.opacity = '1';};
    };

    const getRemainingTime = function(date){

        const timeSubstraction = (date - ((new Date()).getTime()));

    if (((timeSubstraction)/(1000)) < 1){
        return 'Expired';
    } else if(((timeSubstraction)/(1000*3600)) >= 24){
        return `${Math.round((timeSubstraction)/(1000*3600*24))} Days`;
    }else if(((timeSubstraction)/(1000*3600)) >= 1){
        return `${Math.round((timeSubstraction)/(1000*3600))} Hrs`;
    }else if(((timeSubstraction)/(1000)) > 60){
        return `${Math.round((timeSubstraction)/(1000 * 60))} Min`;
    }else if(((timeSubstraction)/(1000)) > 1){
        return `${Math.round((timeSubstraction)/(1000))} Sec`;
    };
        
    };

    return {capitalizeFirst, getIndexInParent, clearElementChildren, toggleTaskwrapper, getRemainingTime};
}