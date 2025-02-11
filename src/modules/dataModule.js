export {projects, initializeLocalStorage,deleteProject};

let projects = [];



function initializeLocalStorage(){

    const initialData = JSON.stringify([{   title: "Omelette chopping",
        description: "buy all ingredients to make an omelette",
        dueDate: "2025/03/25",
        checkList: [[false, "buy eggs"],
                    [false, "buy oil"],
                    [false, "buy salt"]]
    },
    {   title: "Vegas trip",
        description: "buy all ingredients to make an omelette",
        dueDate: "2025/03/25",
        checkList: [[false, "buy eggs"],
                    [false, "buy oil"],
                    [false, "buy salt"]]
    },
    {   title: "Virus upgrade",
        description: "buy all ingredients to make an omelette",
        dueDate: "2025/03/25",
        checkList: [[false, "buy eggs"],
                    [false, "buy oil"],
                    [false, "buy salt"]]
    }
    ]);
    localStorage.setItem("projects", initialData)

    projects = JSON.parse(localStorage.getItem("projects"));
};




const deleteProject = function(index){
                projects.splice(index, 1);
            }