// Todo List Item needs a:
// - project belongs to
// - title
// - description
// - due date
// - completed check box
// - red, orange or green for different priorities

// Factory function for a todo list item

// Project needs a:
// - list of zero or more todo items

// Factory function for a project

// Views:
// - sidebar view
// - project view
// - all task view
// - today's tasks view
// - this week's tasks view
// - project's tasks view

// Modals:
// - edit todo item
// - create new todo item
// - create new project

// Todo Controller:
// - delete todo
// - show edit modal
// - expand details

// Project Controller:
// - delete project

//
//
//
//
// changing active button on the menu
// adding project modal when new project is pressed
// adding new todo task modal when add a new project is pressed
// decide on how data for tasks is stored
// submitting project modal adds a new project - how is it stored?
// submitting todo task modal adds a new task - how is it stored?
// add event listeners to tasks
// show details slider when down arrow is pressed
// change arrow icon when details are showing and when they are not
// show edit slider when edit is pressed
// showing task priority colour as the left border colour of the task
// completing task - how does it interact with data
// strike through the title when the task is complete
// deleteing task - how does it interact with data
// populate the today and this week views with the correct tasks
// populate each project with the correct tasks
//
//
//

const menuController = (function () {
  const menuButtons = Array.from(document.querySelectorAll(".menu-button"));

  menuButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      removeActive(menuButtons);
      if (button === event.target || button.contains(event.target)) {
        button.classList.add("active");
      }
    });
  });
})();

function removeActive(buttons) {
  buttons.forEach((button) => button.classList.remove("active"));
}

const projectModal = (function () {
  const modal = document.querySelector(".project-modal");
  const openModal = document.querySelector(".new-project-button");
  const closeModal = document.querySelector(".project-modal-close");

  openModal.addEventListener("click", () => {
    modal.classList.remove("hide");
    modal.classList.add("show");
  });

  closeModal.addEventListener("click", () => {
    modal.classList.remove("show");
    modal.classList.add("hide");
  });
})();

const todoModal = (function () {
  const modal = document.querySelector(".task-modal");
  const openModal = document.querySelector(".todo-new-task");
  const closeModal = document.querySelector(".todo-modal-close");

  openModal.addEventListener("click", () => {
    modal.classList.remove("hide");
    modal.classList.add("show");
  });

  closeModal.addEventListener("click", () => {
    modal.classList.remove("show");
    modal.classList.add("hide");
  });
})();
