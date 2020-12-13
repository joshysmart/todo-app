/* ====================
Todo App Switch Theme 
======== =========== */
const toggleButton = document.querySelector('#mode');
const todoHeader = document.querySelector('.todo-header');
const todoSection = document.querySelector('.todo-section');

function toggleTheme(e) {
 todoHeader.classList.toggle('todo-header-light')
 todoSection.classList.toggle('todo-section-light')
}

toggleButton.addEventListener('click', toggleTheme);

/* ===============
Todo App Add Item
======= ======== */
const todoTextBox = document.querySelector('#create-todo');
const todoWrapper = document.querySelector('.todo-wrapper');
let todoItemsStorage = JSON.parse(localStorage.getItem('item')) || [ ["Complete online Javascript course", true], ["Jog around the park 3x", false], ["10 minute meditation", false], ["Read for 1 hour", false], ["Pick up groceries", false], ["Complete Todo app on Frontend Mentor", false]
];

function updateList(todoItems) {
 todoItems.forEach(todoItem => {
  const todoElement = document.createElement('div');
  todoElement.classList.add('todo-item');
  todoElement.innerHTML = `
   <label for="">
    <input type="checkbox" name="item" id="" class="item" ${todoItem[1] && "checked"}>  <span class="text">${todoItem[0]}</span> 
    <span class="checked"><img src="./images/icon-check.svg" alt=""></span>
   </label>
   <div class="close"><img src="./images/icon-cross.svg" alt=""></div>
  `;
  todoWrapper.appendChild(todoElement);
 }); 
}
updateList(todoItemsStorage);

function addItem(e) {
 const todoItemValue = e.target.value;
 todoItemsStorage = [];
 todoItemsStorage.push([todoItemValue, false]);
 localStorage.setItem('item', JSON.stringify(todoItemsStorage));
 updateList(todoItemsStorage);
 e.target.value = '';
 showAllButton.click();
 initItems();
}

todoTextBox.addEventListener('change', addItem);

/* =================
Todo App Remove Item
======= ========== */

function removeItem(e) {
 const itemToRemove = e.currentTarget.offsetParent;
 itemToRemove.classList.add('translate');
 itemToRemove.addEventListener('transitionend', () => {
  todoWrapper.removeChild(itemToRemove);
  initItems();
 });
}

/* =================
Todo App Clear Items
======= ========== */

const clearItemsButton = document.querySelector('.clear-items');

function clearItems() {
 const checkedInputs = initItems().checkedInputs;
 checkedInputs.forEach((checkedInput, i) => {
  setTimeout(() => {
   const itemToRemove = checkedInput.offsetParent.offsetParent;
   itemToRemove.classList.add('translate');
   itemToRemove.addEventListener('transitionend', () => {
    todoWrapper.removeChild(itemToRemove);
    initItems();
   });  
  }, i * 400); 
 });
}

clearItemsButton.addEventListener('click', clearItems);

/* ===================
Todo Show All Items
========= ========== */

const showAllButton = document.querySelector('.show-all');

function showAll(e) {
 button.forEach(btn => btn.classList.remove('active')); 
 e.target.classList.add('active');
 const todoItems = initItems().todoItems;
  
 todoItems.forEach(todoItem => {
  todoItem.classList.remove('display');
 });
}

showAllButton.addEventListener('click', showAll);

/* ======================
Todo Show Completed Items
=========== =========== */

const showCompletedButton = document.querySelector('.show-completed');

function showCompleted(e) {
 button.forEach(btn => btn.classList.remove('active')); 
 e.target.classList.add('active');
 const todoItemInputs = initItems().todoItemInputs;
 const todoItems = initItems().todoItems;
 
 todoItemInputs.forEach((todoItemInput, i) => {
  todoItems[i].classList.remove('display');

  if (!todoItemInput.checked) {
   todoItems[i].classList.add('display');
  }
 });  
}

showCompletedButton.addEventListener('click', showCompleted);

/* ===================
Todo Show Active Items
========= ========== */

const showActiveButton = document.querySelector('.show-active');
const button = document.querySelectorAll('.btn');

function showActive(e) {
 button.forEach(btn => btn.classList.remove('active')); 
 e.target.classList.add('active');
 const todoItemInputs = initItems().todoItemInputs;
 const todoItems = initItems().todoItems;

 
 todoItemInputs.forEach((todoItemInput, i) => {
   todoItems[i].classList.remove('display');
   
   if (todoItemInput.checked) {
     todoItems[i].classList.add('display');
    }
  });
}

showActiveButton.addEventListener('click', showActive);

/* =================
Todo App Init Items
======= ========== */

function initItems() {
 todoItemsStorage = [];
 localStorage.setItem('item', JSON.stringify(todoItemsStorage));
  
 const todoItems = todoWrapper.querySelectorAll('.todo-item');
 const itemsCount = document.querySelector('.items-count');
 const closeButtons = todoWrapper.querySelectorAll('.close');
 
 closeButtons.forEach(closeButton => closeButton.addEventListener('click', removeItem));
 
 todoItems.forEach((todoItem, i) => {
   todoItem.setAttribute('draggable', true);
  todoItem.addEventListener('dragstart', (e) => {
    e.target.classList.add('dragging'); 
  }); 
  todoItem.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging'); 
  }); 
  
  const todoItemLabel = todoItem.querySelector('label');
  const todoItemInput = todoItem.querySelector('input');
  const todoItemText = todoItem.querySelector('.text');
  
  todoItemsStorage.push([todoItemText.innerText, todoItemInput.checked]);
  localStorage.setItem('item', JSON.stringify(todoItemsStorage));

  todoItemLabel.setAttribute("for", `item${i}`)
  todoItemInput.setAttribute("id", `item${i}`)
 })

 const todoItemInputs = todoWrapper.querySelectorAll('.item');
 const checkedInputs = todoWrapper.querySelectorAll('.item:checked');

 const noOfUncheckedItems = todoItemInputs.length - checkedInputs.length;

 itemsCount.textContent = `${noOfUncheckedItems} item${noOfUncheckedItems > 1 ? 's' : ''} left`
 
 todoItemInputs.forEach(todoItemInput => todoItemInput.addEventListener('change', initItems))

 return {checkedInputs,todoItemInputs, todoItems};
};
initItems();

/* =================
Todo App Reoder Items
======= ========== */

function reoderElement(e) {
 const afterElement = getAfterElement(e.clientY);
 const draggedElement = todoWrapper.querySelector('.dragging'); 

 if(!afterElement) {
  todoWrapper.appendChild(draggedElement) 
 } else {
  todoWrapper.insertBefore(draggedElement, afterElement); 
 }
}

function getAfterElement(y) {
 const elementsUndragged = todoWrapper.querySelectorAll('.todo-item:not(.dragging'); 
 const dragableElements = [...elementsUndragged];

 return dragableElements.reduce((closest, child) => {
  const box = child.getBoundingClientRect();
  const offset = y - box.top - box.height / 2;

  if (offset < 0 && offset > closest.offset) {
   return {offset: offset, element: child}; 
  } else {
   return closest; 
  }
}, {offset: Number.NEGATIVE_INFINITY}).element;
}

todoWrapper.addEventListener('dragover', reoderElement);