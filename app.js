"use strict";

var listElement = document.querySelector('.list');
var itemElementList = listElement.children;

var templateElement = document.getElementById('todoTemplate');
var templateContainer = 'content' in templateElement ? templateElement.content : templateElement;

var filtersList = document.getElementById('filters');
filtersList.addEventListener('click', showThis);
var filters = filtersList.children;
var showNow = 'all';
function showThis(event){
	var applyFilter;
	if (typeof event != 'string'){
		if(event.target == filtersList) return;
		applyFilter = event.target.dataset.filter;
		showNow = applyFilter;
	}
	else applyFilter = event;
	[].forEach.call(filters, function(elem) {
			if (elem.dataset.filter==applyFilter) elem.className = 'filters__item filters__item_selected';
			else elem.className = 'filters__item';
	});
	if (applyFilter == 'all'){
		[].forEach.call(itemElementList, function(elem) {
			elem.style.display = 'block';
		});
	}
	else {
		var task = 'task_' + applyFilter;
		[].forEach.call(itemElementList, function(elem) {
			if (elem.classList.contains(task)) elem.style.display = 'block';
			else elem.style.display = 'none';
		});
	}
}

// статистика
var statsElement = document.querySelector('.statistic');
var statsTotalElement = statsElement.querySelector('.statistic__total');
var statsLeftElement = statsElement.querySelector('.statistic__left');
var statsDoneElement = statsElement.querySelector('.statistic__done');

let tasks = 0, done = 0, todo = 0;

function updateTasks() {
	showThis(showNow);
	tasks = itemElementList.length;
	done = 0;
	[].forEach.call(itemElementList, function(elem) {
		if (elem.classList.contains('task_done')) done++;
	});
	todo = tasks - done;
	statsTotalElement.textContent = tasks;
	statsDoneElement.textContent = done;
	statsLeftElement.textContent = todo;
}


// сформируем задачки
var todoList = [
	{
		name: 'Позвонить в сервис',
		status: 'todo'
	},
	{
		name: 'Купить хлеб',
		status: 'done'
	},
	{
		name: 'Захватить мир',
		status: 'todo'
	},
	{
		name: 'Добавить тудушку в список',
		status: 'todo'
	}
];

// функция по генерации элементов
function addTodoFromTemplate(todo) {
	var newElement = templateContainer.querySelector('.task').cloneNode(true);
	newElement.querySelector('.task__name').textContent = todo.name;
	setTodoStatusClassName(newElement, todo.status === 'todo');
	updateTasks();
	//showAll();
	return newElement;
}

function setTodoStatusClassName(todo, flag) {
	todo.classList.toggle('task_todo', flag);
	todo.classList.toggle('task_done', !flag);
}

function onListClick(event) {
	var target = event.target;
	var element;

	if (isStatusBtn(target)) {
		element = target.parentNode;
		changeTodoStatus(element);
	}

	if (isDeleteBtn(target)) {
		element = target.parentNode;
		deleteTodo(element);
	}
	updateTasks();
}

function isStatusBtn(target) {
	return target.classList.contains('task__status');
}

function isDeleteBtn(target) {
	return target.classList.contains('task__delete-button');
}

function changeTodoStatus(element) {
	var isTodo = element.classList.contains('task_todo');
	setTodoStatusClassName(element, !isTodo);
	updateTasks();
}

function deleteTodo(element) {
	listElement.removeChild(element);
	updateTasks();
}

function onInputKeydown(event) {
	if (event.keyCode !== 13) {
		return;
	}

	var ENTER_KEYCODE = 13;
	if (event.keyCode !== ENTER_KEYCODE) {
		return;
	}

	var todoName = inputElement.value.trim();

	if (todoName.length === 0 || checkIfTodoAlreadyExists(todoName)) {
		return;
	}

	var todo = createNewTodo(todoName);
	insertTodoElement(addTodoFromTemplate(todo));
	inputElement.value = '';
	updateTasks();
}

function checkIfTodoAlreadyExists(todoName) {
	var todoElements = listElement.querySelectorAll('.task__name');
	var namesList = Array.prototype.map.call(todoElements, function(element) {
		return element.textContent;
	});
	return namesList.indexOf(todoName) > -1;
}

function createNewTodo(name) {
	return {
		name: name,
		status: 'todo'
	}
}

todoList
	.map(addTodoFromTemplate)
	.forEach(insertTodoElement);

listElement.addEventListener('click', onListClick);

var inputElement = document.querySelector('.add-task__input');
inputElement.addEventListener('keydown', onInputKeydown);

// Задача:
// исправьте багу с добавлением insertBefore в пустой массив
// создайте статистику
//
function insertTodoElement(elem) {
	if (listElement.children) {
		listElement.insertBefore(elem, listElement.firstElementChild);
	} else {
		listElement.appendChild(elem);
	}
}
