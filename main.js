/************************************************************
 * INITIALIZATION OF WEBPAGE
 ************************************************************/
// The list displayed by default when loading the page is "Tasks"
let selectedOption = "Tasks";
// Highlight the default list
let options = document.querySelectorAll(".selectable p");
options.forEach((option) => {
  if (option.innerText == selectedOption) {
    option.parentElement.classList.add("selected");
    option.parentElement.lastElementChild.style.visibility = "visible";
  }
});
// Print all tasks in the selected list
printList(selectedOption);
// Load Custom List names from local storage
let customNames = JSON.parse(localStorage.getItem("listsArray"));
if (customNames) {
  customNames.forEach((name) => {
    loadExistingList(name);
  });
}

/************************************************************
 * EVENT LISTENERS
 ************************************************************/
/* Create new task through main button */
const newTask = document.getElementById("create-task");
newTask.addEventListener("click", newForm);

const btnNewTask = document.getElementById("modal1-accept");
btnNewTask.addEventListener("click", addTask);

/* Close form modal by different means */
const mod1Close = document.getElementById("modal1-close");
mod1Close.addEventListener("click", () => {
  closeModal("one");
});
const mod1Cancel = document.getElementById("modal1-cancel");
mod1Cancel.addEventListener("click", () => {
  closeModal("one");
});
const mod1ClickOutside = document.getElementById("modal1-container");
mod1ClickOutside.addEventListener("click", (e) => {
  if (e.target.id == "modal1-container") {
    closeModal("one");
  }
});

/* Highlight icon of the selected list on hover */
const RegListElements = document.querySelectorAll(".reg-lists");
RegListElements.forEach((element) => {
  element.addEventListener("mouseenter", showIcons);
});
RegListElements.forEach((element) => {
  element.addEventListener("mouseleave", hideIcons);
});
const CustomListElements = document.querySelectorAll(".custom-lists");
CustomListElements.forEach((element) => {
  element.addEventListener("mouseenter", showIcons);
});
CustomListElements.forEach((element) => {
  element.addEventListener("mouseleave", hideIcons);
});

/* Remark clicked list and show its corresponding tasks */
const pListElements = document.querySelectorAll(".selectable p");
pListElements.forEach((element) => {
  element.addEventListener("click", selectList);
});

/* Create New Custom List through custom lists button */
const newCustomList = document.getElementById("add-list-btn");
newCustomList.addEventListener("click", newList);

const btnNewCustomList = document.getElementById("modal2-accept");
btnNewCustomList.addEventListener("click", addCustomList);

/* Close New Custom List modal by different means */
const mod2Close = document.getElementById("modal2-close");
mod2Close.addEventListener("click", () => {
  closeModal("two");
});
const mod2Cancel = document.getElementById("modal2-cancel");
mod2Cancel.addEventListener("click", () => {
  closeModal("two");
});
const mod2ClickOutside = document.getElementById("modal2-container");
mod2ClickOutside.addEventListener("click", (e) => {
  if (e.target.id == "modal2-container") {
    closeModal("two");
  }
});

/* Detele Custom List */
const CustomListIcons = document.querySelectorAll(".custom-lists i");
CustomListIcons.forEach((icon) => {
  icon.addEventListener("click", deleteCustomListModal);
});

const CustomListDeleteBtn = document.getElementById("modal3-delete");
CustomListDeleteBtn.addEventListener("click", deleteCustomList);

/* Close Delete Custom List modal by different means */
const mod3Close = document.getElementById("modal3-close");
mod3Close.addEventListener("click", () => {
  closeModal("three");
});
const mod3Cancel = document.getElementById("modal3-cancel");
mod3Cancel.addEventListener("click", () => {
  closeModal("three");
});
const mod3ClickOutside = document.getElementById("modal3-container");
mod3ClickOutside.addEventListener("click", (e) => {
  if (e.target.id == "modal3-container") {
    closeModal("three");
  }
});

/* Show Task details */
const ResultsListTitle = document.querySelectorAll(".tasks-item .col2");
ResultsListTitle.forEach((result) => {
  result.addEventListener("click", showDetails);
});

/* Close Task Details modal by different means */
const mod4Close = document.getElementById("modal4-close");
mod4Close.addEventListener("click", () => {
  closeModal("four");
});
const mod4ClickOutside = document.getElementById("modal4-container");
mod4ClickOutside.addEventListener("click", (e) => {
  if (e.target.id == "modal4-container") {
    closeModal("four");
  }
});

/* Delete the task for which we are displaying the details */
const deleteTaskBtn = document.getElementById('modal4-delete');
deleteTaskBtn.addEventListener('click', deleteTask);

/* Toggle completed task */
const ResultsListCompleted = document.querySelectorAll(
  ".tasks-item.col1 input"
);
ResultsListCompleted.forEach((result) => {
  result.addEventListener("click", toggleCompletedTask);
});

/* Toggle important task */
const ResultsListImportant = document.querySelectorAll(
  ".tasks-item.col3 input"
);
ResultsListImportant.forEach((result) => {
  result.addEventListener("click", toggleImportantTask);
});

/* Search functionality */
const searchInput = document.getElementById('search');
searchInput.addEventListener('focus', activateSearch);
searchInput.addEventListener('keyup', search);
searchInput.addEventListener('blur', deactivateSearch);

/************************************************************
 * FUNCTIONS RELATED TO EVENT LISTENERS
 ************************************************************/
function newForm() {
  clearFormOne();
  document.getElementById("error-title").style.visibility = "hidden";
  document.getElementById("error-description").style.visibility = "hidden";
  openModal("one");
}

function addTask() {
  let validation = validateFormOne();
  // If form is valid, create new object
  if (validation == true) {
    let myTask = new Object();
    myTask.title = document.getElementById("title").value.trim();
    myTask.description = document.getElementById("description").value.trim();
    if (document.getElementById("completed").checked == true) {
      myTask.completed = true;
    } else {
      myTask.completed = false;
    }
    if (document.getElementById("important").checked == true) {
      myTask.important = true;
    } else {
      myTask.important = false;
    }
    if (document.getElementById("custom-list").value == "") {
      myTask.list = "Tasks";
    } else {
      myTask.list = document.getElementById("custom-list").value;
    }
    myTask.color = document.getElementById("task-color").value;
    // Then save the object into localStorage
    // Load array of tasks from local storage if previously existing, or else create a new array.
    let tasksList = JSON.parse(localStorage.getItem("tasksArray"));
    if (!tasksList) {
      tasksList = [];
    }
    // Push object into the tasks array
    tasksList.push(myTask);
    // Save tasks array in local storage
    localStorage.setItem("tasksArray", JSON.stringify(tasksList));
    // Close modal window
    closeModal("one");
    // Print results
    if (selectedOption == myTask.list) {
      printList(selectedOption);
    }
  }
}

function newList() {
  clearFormTwo();
  document.getElementById("error-list-name").style.visibility = "hidden";
  openModal("two");
}

function addCustomList() {
  let validation = validateFormTwo();
  // If form is valid, create a new Custom List
  if (validation == true) {
    // Select custom lists container
    let customListsCont = document.querySelector(".custom-lists-cont");
    // Create new element to append to the container
    let myDiv = document.createElement("div");
    myDiv.classList.add("custom-lists");
    myDiv.classList.add("selectable");
    let myParagraph = document.createElement("p");
    myParagraph.innerText = document.getElementById("list-name").value.trim();
    let myIcon = document.createElement("i");
    myIcon.classList.add("far");
    myIcon.classList.add("fa-times-circle");
    myDiv.appendChild(myParagraph);
    myDiv.appendChild(myIcon);
    customListsCont.appendChild(myDiv);
    // Add event listeners to the new custom list
    myDiv.addEventListener("mouseenter", showIcons);
    myDiv.addEventListener("mouseleave", hideIcons);
    myParagraph.addEventListener("click", selectList);
    myIcon.addEventListener("click", deleteCustomListModal);
    // Save the custom lists names into local storage
    // Load array of custom lists names from local storage if previously existing, or else create a new array.
    let customNames = JSON.parse(localStorage.getItem("listsArray"));
    if (!customNames) {
      customNames = [];
    }
    // Push object into the names array
    customNames.push(document.getElementById("list-name").value.trim());
    // Save names array in local storage
    localStorage.setItem("listsArray", JSON.stringify(customNames));
    // Add a new option in the form modal
    let newOption = document.createElement("option");
    newOption.innerText = document.getElementById("list-name").value.trim();
    newOption.value = document.getElementById("list-name").value.trim();
    document.getElementById("custom-list").appendChild(newOption);
    // Finally close the modal
    closeModal("two");
  }
}

function deleteCustomListModal(e) {
  // We will need this global variable to store the name of the list to delete
  customListName = e.target.parentElement.firstChild.innerText;
  // Check if the selected custom list has tasks within
  let listHasTasks = false;
  let tasksList = JSON.parse(localStorage.getItem("tasksArray"));
  if (tasksList) {
    tasksList.forEach((task) => {
      if (task.list == customListName) {
        listHasTasks = true;
      }
    });
  }
  if (listHasTasks) {
    // If it has tasks, show the modal
    openModal("three");
  } else {
    // If not, delete directly
    let customNames = JSON.parse(localStorage.getItem("listsArray"));
    for (let i = 0; i < customNames.length; i++) {
      if (customNames[i] == customListName) {
        // Delete from local storage
        customNames.splice(i, 1);
        localStorage.setItem("listsArray", JSON.stringify(customNames));
        // Delete from displayed custom lists
        let displayedListNames = document.querySelectorAll(
          ".custom-lists.selectable p"
        );
        displayedListNames.forEach((name) => {
          if (name.innerText == customListName) {
            name.parentElement.remove();
          }
        });
        // Delete from selectable options in the "new task" modal
        let options = document.querySelectorAll("#custom-list option");
        options.forEach((option) => {
          if (option.value == customListName) {
            option.remove();
          }
        });
        // Remove Custom List name from the header of the displayed tasks section
        if (customListName === selectedOption) {
          document.querySelector('.tasks-header h2').innerText = "";
        }
      }
    }
  }
}

function deleteCustomList() {
  // First, delete the name from the custom lists
  let displayedListNames = document.querySelectorAll(
    ".custom-lists.selectable p"
  );
  displayedListNames.forEach((name) => {
    if (name.innerText == customListName) {
      name.parentElement.remove();
    }
  });
  // Second, delete from selectable options in the "new task" modal
  let options = document.querySelectorAll("#custom-list option");
  options.forEach((option) => {
    if (option.value == customListName) {
      option.remove();
    }
  });
  // Third, delete the name from the local storage
  let customNames = JSON.parse(localStorage.getItem("listsArray"));
  for (let i = 0; i < customNames.length; i++) {
    if (customNames[i] == customListName) {
      customNames.splice(i, 1);
      localStorage.setItem("listsArray", JSON.stringify(customNames));
    }
  }
  // Forth, delete all tasks included in that custom list from the local storage
  let tasksList = JSON.parse(localStorage.getItem("tasksArray"));
  if (tasksList) {
    for (let i = tasksList.length - 1; i >= 0; i--) {
      if (tasksList[i].list == customListName) {
        tasksList.splice(i, 1);
      }
    }
    localStorage.setItem("tasksArray", JSON.stringify(tasksList));
  }
  // Fifth, remove Custom List name from the header of the displayed tasks section
  if (customListName === selectedOption) {
    document.querySelector('.tasks-header h2').innerText = "";
  }
  // Sixth, re-print selected list
  printList(selectedOption);
  // Finally, close corresponding modal
  closeModal("three");
}

function showDetails(e) {
  // Clear previous info
  let details = document.querySelector(".task-details");
  while (details.firstChild) {
    details.removeChild(details.lastChild);
  }
  // Obtain object corresponding to selected title
  let taskName = e.target.innerText;
  // Store in a global variable for "myObj" to use it later on when deleting a task
  myObj = {};
  let tasksList = JSON.parse(localStorage.getItem("tasksArray"));
  if (tasksList) {
    tasksList.forEach((task) => {
      if (task.title === taskName) {
        myObj = task;
      }
    });
  }
  // Insert all elements within the task-details div
  let paragraph1 = document.createElement("p");
  paragraph1.innerHTML = "<b>Title: </b>" + myObj.title;
  let paragraph2 = document.createElement("p");
  paragraph2.innerHTML = "<b>Description: </b>" + myObj.description;
  let paragraph3 = document.createElement("p");
  paragraph3.innerHTML =
    "<b>Completed: </b>" + (myObj.completed ? "Yes" : "No");
  let paragraph4 = document.createElement("p");
  paragraph4.innerHTML =
    "<b>Important: </b>" + (myObj.important ? "Yes" : "No");
  let paragraph5 = document.createElement("p");
  if (myObj.list !== "Tasks") {
    paragraph5.innerHTML = "<b>Custom list: </b>" + myObj.list;
  }
  let paragraph6 = document.createElement("p");
  if (!myObj.color == "") {
    myObj.color = myObj.color[0].toUpperCase() + myObj.color.slice(1);
    paragraph6.innerHTML = "<b>Task color: </b>" + myObj.color;
  }
  details.appendChild(paragraph1);
  details.appendChild(paragraph2);
  details.appendChild(paragraph3);
  details.appendChild(paragraph4);
  if (myObj.list !== "Tasks") {
    details.appendChild(paragraph5);
  }
  if (!myObj.color == "") {
    details.appendChild(paragraph6);
  }
  // Show modal
  openModal("four");
}

function deleteTask() {
  // Get array of tasks from local storage
  let tasksList = JSON.parse(localStorage.getItem("tasksArray"));
  if (tasksList) {
    // When finding a match with the currently selected task, delete it from the tasks array
    for (let i = 0; i < tasksList.length; i++) {
      if (tasksList[i].title == myObj.title) {
        tasksList.splice(i, 1);
      }
    }
  }
  // Save in local storage the updated array of tasks
  localStorage.setItem("tasksArray", JSON.stringify(tasksList));
  // Re-print current list to update the tasks shown and close the modal
  printList(selectedOption);
  closeModal("four");
}

function showIcons(e) {
  if (
    e.target.classList.contains("reg-lists") ||
    e.target.classList.contains("custom-lists")
  ) {
    let element = e.target.lastElementChild;
    element.style.visibility = "visible";
    if (element.children[0]) {
      element.children[0].style.visibility = "visible";
    }
  }
}

function hideIcons(e) {
  if (
    (e.target.classList.contains("reg-lists") ||
      e.target.classList.contains("custom-lists")) &&
    !e.target.classList.contains("selected")
  ) {
    let element = e.target.lastElementChild;
    element.style.visibility = "hidden";
    if (element.children[0]) {
      element.children[0].style.visibility = "hidden";
    }
  }
}

function selectList(e) {
  searchInput.value = "";
  const pListElements = document.querySelectorAll(".selectable p");
  pListElements.forEach((element) => {
    if (element.parentElement.classList.contains("selected")) {
      element.parentElement.classList.remove("selected");
    }
    let iconElement = element.parentElement.lastElementChild;
    iconElement.style.visibility = "hidden";
  });
  e.target.parentElement.classList.add("selected");
  e.target.parentElement.lastElementChild.style.visibility = "visible";
  selectedOption = e.target.innerText;
  document.querySelector(
    ".tasks-cont .tasks-header h2"
  ).innerText = selectedOption;
  printList(selectedOption);
}

function toggleCompletedTask(e) {
  // Obtain reference to search in the tasks array
  let taskTitle = "";
  if (e.target.parentElement.nextSibling !== null) {
    taskTitle = e.target.parentElement.nextSibling.children[0].innerText;
  }
  // Get the corresponding element in the tasks array
  let tasksList = JSON.parse(localStorage.getItem("tasksArray"));
  if (tasksList) {
    tasksList.forEach((task) => {
      if (task.title == taskTitle) {
        // Toggle the "completed" property
        if (task.completed == false) {
          task.completed = true;
        } else {
          task.completed = false;
        }
      }
    });
    // Store changes in the tasks array into the local storage
    localStorage.setItem("tasksArray", JSON.stringify(tasksList));
  }
  printList(selectedOption);
}

function toggleImportantTask(e) {
  // Obtain reference to search in the tasks array
  let taskTitle = "";
  if (e.target.parentElement.previousSibling.children !== undefined) {
    taskTitle = e.target.parentElement.previousSibling.children[0].innerText;
  }
  // Get the corresponding element in the tasks array
  let tasksList = JSON.parse(localStorage.getItem("tasksArray"));
  if (tasksList) {
    tasksList.forEach((task) => {
      if (task.title == taskTitle) {
        // Toggle the "important" property
        if (task.important == false) {
          task.important = true;
        } else {
          task.important = false;
        }
      }
    });
    // Store changes in the tasks array into the local storage
    localStorage.setItem("tasksArray", JSON.stringify(tasksList));
  }
  printList(selectedOption);
}

function activateSearch() {
  selectedOption = "Search";
  const pListElements = document.querySelectorAll(".selectable p");
  pListElements.forEach((element) => {
    if (element.parentElement.classList.contains("selected")) {
      element.parentElement.classList.remove("selected");
    }
    let iconElement = element.parentElement.lastElementChild;
    iconElement.style.visibility = "hidden";
  });
  searchInput.value = "";
  document.querySelector(".tasks-cont .tasks-header h2").innerText = "Search results for all tasks";
  document.getElementById('search').style.border = "solid 1px #e74c3c";
  document.getElementById('search').style.boxShadow = "0 2px 8px #e74c3c";
  document.querySelector('.search-bar i').style.color = "#e74c3c";
  document.querySelector('.search-bar i').style.opacity = "1";
  clearList();
}

function deactivateSearch() {
  document.getElementById('search').style.border = "solid 1px rgba(0, 0, 0, 0.7)";
  document.getElementById('search').style.boxShadow = "none";
  document.querySelector('.search-bar i').style.color = "rgba(0, 0, 0, 0.7)";
}

function search() {
  clearList();
  let results = [];
  let searchString = searchInput.value;
  searchString = searchString.trim();
  searchString = searchString.toLowerCase();
  searchString = removeAccents(searchString);
  if (searchString.length > 0) {
    let tasksList = JSON.parse(localStorage.getItem("tasksArray"));
    tasksList.forEach(task => {
      let taskTitleCleaned = task.title.toLowerCase();
      taskTitleCleaned = removeAccents(taskTitleCleaned);
      if (taskTitleCleaned.includes(searchString)) {
        results.push(task);
      }
    });
    results.forEach(result => {
      printTask(result);
    })
  }
}

/************************************************************
 * AUXILIAR FUNCTIONS
 ************************************************************/
function clearFormOne() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("completed").checked = false;
  document.getElementById("important").checked = false;
  document.getElementById("custom-list").value = "";
  document.getElementById("task-color").value = "";
}

function clearFormTwo() {
  document.getElementById("list-name").value = "";
}

function openModal(modalNumberString) {
  let string = ".modal-container." + modalNumberString;
  document.querySelector(string).classList.add("show");
  document.getElementsByTagName("body")[0].style.overflow = "hidden";
}

function closeModal(modalNumberString) {
  let string = ".modal-container." + modalNumberString;
  document.querySelector(string).classList.remove("show");
  document.getElementsByTagName("body")[0].style.overflow = "auto";
}

function validateFormOne() {
  let titleOK = true;
  let descriptionOK = true;
  let titleInput = document.getElementById("title");
  let descriptionInput = document.getElementById("description");
  let alreadyExisting = false;
  let tasksList = JSON.parse(localStorage.getItem("tasksArray"));
  if (tasksList) {
    tasksList.forEach((task) => {
      if (task.title == titleInput.value.trim()) {
        alreadyExisting = true;
      }
    });
  }
  if (alreadyExisting) {
    document.getElementById("error-title").innerHTML =
      "<b>Error: </b>Title for a task already exists";
    document.getElementById("error-title").style.visibility = "visible";
    titleOK = false;
  }
  if (titleInput.value.trim().length < 3) {
    document.getElementById("error-title").innerHTML =
      "<b>Error: </b>Minimum of 3 characters";
    document.getElementById("error-title").style.visibility = "visible";
    titleOK = false;
  } else if (titleInput.value.trim().length > 50) {
    document.getElementById("error-title").innerHTML =
      "<b>Error: </b>Maximum of 50 characters";
    document.getElementById("error-title").style.visibility = "visible";
    titleOK = false;
  }
  if (descriptionInput.value.trim().length == 0) {
    document.getElementById("error-description").innerHTML =
      "<b>Error: </b>Description field cannot be blank";
    document.getElementById("error-description").style.visibility = "visible";
    descriptionOK = false;
  } else if (descriptionInput.value.trim().length > 500) {
    document.getElementById("error-description").innerHTML =
      "<b>Error: </b>Maximum of 500 characters";
    document.getElementById("error-description").style.visibility = "visible";
    descriptionOK = false;
  }
  if (titleOK) {
    document.getElementById("error-title").style.visibility = "hidden";
  }
  if (descriptionOK) {
    document.getElementById("error-description").style.visibility = "hidden";
  }
  if (titleOK && descriptionOK) {
    return true;
  } else {
    return false;
  }
}

function validateFormTwo() {
  let listNameOK = true;
  let listNameInput = document.getElementById("list-name");
  let alreadyExisting = false;
  let customListNames = document.querySelectorAll(".custom-lists.selectable p");
  if (customListNames) {
    customListNames.forEach((name) => {
      if (name.innerText == listNameInput.value.trim()) {
        alreadyExisting = true;
      }
    });
  }
  if (alreadyExisting) {
    document.getElementById("error-list-name").innerHTML =
      "<b>Error: </b>Custom List Name already exists";
    document.getElementById("error-list-name").style.visibility = "visible";
    listNameOK = false;
  }
  if (listNameInput.value.trim().length == 0) {
    document.getElementById("error-list-name").innerHTML =
      "<b>Error: </b>List Name field cannot be blank";
    document.getElementById("error-list-name").style.visibility = "visible";
    listNameOK = false;
  } else if (listNameInput.value.trim().length > 25) {
    document.getElementById("error-list-name").innerHTML =
      "<b>Error: </b>Maximum of 25 characters";
    document.getElementById("error-list-name").style.visibility = "visible";
    listNameOK = false;
  }
  if (listNameOK) {
    document.getElementById("error-list-name").style.visibility = "hidden";
  }
  return listNameOK;
}

function printTask(taskObject) {
  // Main div
  let mainDiv = document.createElement("div");
  mainDiv.className = "tasks-item";
  // Col 1
  let subDiv1 = document.createElement("div");
  subDiv1.className = "col1";
  let chBox1 = document.createElement("input");
  chBox1.type = "checkbox";
  if (taskObject.completed == true) {
    chBox1.checked = true;
  }
  subDiv1.appendChild(chBox1);
  // Col 3
  let subDiv3 = document.createElement("div");
  subDiv3.className = "col3";
  let chBox2 = document.createElement("input");
  chBox2.type = "checkbox";
  if (taskObject.important == true) {
    chBox2.checked = true;
  }
  subDiv3.appendChild(chBox2);
  let paragraph = document.createElement("p");
  paragraph.innerText = "Important";
  subDiv3.appendChild(paragraph);
  // Col 2
  let subDiv2 = document.createElement("div");
  subDiv2.className = "col2";
  let paragraph2 = document.createElement("p");
  paragraph2.innerText = taskObject.title;
  if (chBox1.checked == true) {
    paragraph2.style.textDecoration = "line-through";
  }
  if (chBox2.checked == true) {
    paragraph2.style.fontWeight = "bold";
  }
  subDiv2.appendChild(paragraph2);
  if (taskObject.color !== "") {
    subDiv1.style.backgroundColor = taskObject.color;
    subDiv2.style.backgroundColor = taskObject.color;
    subDiv3.style.backgroundColor = taskObject.color;
    if (taskObject.color === "blue" || taskObject.color === "purple") {
      mainDiv.style.color = "white";
    }
  }
  // Three cols to main div and append main div
  mainDiv.appendChild(subDiv1);
  mainDiv.appendChild(subDiv2);
  mainDiv.appendChild(subDiv3);
  document.querySelector(".tasks-cont").appendChild(mainDiv);
  // Add event listeners
  subDiv2.addEventListener("click", showDetails);
  subDiv1.addEventListener("click", toggleCompletedTask);
  subDiv3.addEventListener("click", toggleImportantTask);
}

function printList(option) {
  clearList();
  let tasksList = JSON.parse(localStorage.getItem("tasksArray"));
  if (tasksList) {
    switch (option) {
      case "Important":
        tasksList.forEach((task) => {
          if (task.important == true && task.completed == false) {
            printTask(task);
          }
        });
        break;
      case "Completed":
        tasksList.forEach((task) => {
          if (task.completed == true) {
            printTask(task);
          }
        });
        break;
      case "Search":
        search();
        break;
      default:
        tasksList.forEach((task) => {
          if (task.list === option && task.completed == false) {
            printTask(task);
          }
        });
    }
  }
}

function clearList() {
  let tasks = document.querySelectorAll(".tasks-item");
  for (let i = 0; i < tasks.length; i++) {
    tasks[i].remove();
  }
}

function loadExistingList(listName) {
  // Select custom lists container to Append the new element to
  let customListsCont = document.querySelector(".custom-lists-cont");
  // Create new element to append to the container
  let myDiv = document.createElement("div");
  myDiv.classList.add("custom-lists");
  myDiv.classList.add("selectable");
  let myParagraph = document.createElement("p");
  myParagraph.innerText = listName;
  let myIcon = document.createElement("i");
  myIcon.classList.add("far");
  myIcon.classList.add("fa-times-circle");
  myDiv.appendChild(myParagraph);
  myDiv.appendChild(myIcon);
  customListsCont.appendChild(myDiv);
  // Add event listeners to the new custom list
  myDiv.addEventListener("mouseenter", showIcons);
  myDiv.addEventListener("mouseleave", hideIcons);
  myParagraph.addEventListener("click", selectList);
  myIcon.addEventListener("click", deleteCustomListModal);
  // Add a new option in the form modal
  let newOption = document.createElement("option");
  newOption.innerText = listName;
  newOption.value = listName;
  document.getElementById("custom-list").appendChild(newOption);
}

// Auxiliar function to remove special characters in a string
const removeAccents = function (str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};