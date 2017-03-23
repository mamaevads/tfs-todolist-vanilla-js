"use strict";

var listElement = document.querySelector('.list');
var itemElementList = listElement.children;

document.getElementById('all').addEventListener('click', showAll);
function showAll(){
	[].forEach.call(itemElementList, function(elem) {
			elem.style.display = 'block';
	});
	document.getElementById('all').style.borderColor = 'inherit';
	document.getElementById('todo').style.borderColor = 'transparent';
	document.getElementById('done').style.borderColor = 'transparent';
}

document.getElementById('todo').addEventListener('click', showTodo);
function showTodo(){
    [].forEach.call(itemElementList, function(elem) {
		if (elem.classList.contains('task_todo')) elem.style.display = 'block';
		else elem.style.display = 'none';
	});
	document.getElementById('all').style.borderColor = 'transparent';
	document.getElementById('todo').style.borderColor = 'inherit';
	document.getElementById('done').style.borderColor = 'transparent';
}

document.getElementById('done').addEventListener('click', showDone);
function showDone(){
    [].forEach.call(itemElementList, function(elem) {
		if (elem.classList.contains('task_done')) elem.style.display = 'block';
		else elem.style.display = 'none';
	});
	document.getElementById('all').style.borderColor = 'transparent';
	document.getElementById('todo').style.borderColor = 'transparent';
	document.getElementById('done').style.borderColor = 'inherit';
}
var templateElement = document.getElementById('todoTemplate');
var templateContainer = 'content' in templateElement ? templateElement.content : templateElement;
let tasks = 0, done = 0, todo = 0;

function updateTasks() {
	tasks = itemElementList.length;
	done = 0;
	[].forEach.call(itemElementList, function(elem) {
		if (elem.classList.contains('task_done')) done++;
	});
	todo = tasks - done;
	document.querySelector('.statistic__total').innerHTML = tasks;
	document.querySelector('.statistic__done').innerHTML = done;
	document.querySelector('.statistic__left').innerHTML = todo;
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
	showAll();
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
	showAll();
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
