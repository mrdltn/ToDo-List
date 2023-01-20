(function() {
    
//globals//
const todoList = document.querySelector('#todo-list');
const userSelect = document.querySelector('#user-todo');
const form = document.querySelector('form');
let todos = [];
let users = [];

//attach event//
document.addEventListener('DOMContentLoaded', initApp);

form.addEventListener('submit', handleSubmit);

//basic logic//
function getUserName(userId) {
    const user = users.find(u => u.id ===userId);
    return user.name;
}
function printTodo({id, userId, title, completed}) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = id;
    li.innerHTML = `<span><b>${id} <i>: </i></b>${title} <i>by</i> <b>${getUserName(userId)}</b>  ${completed}</span>`

    const status = document.createElement('input');
    status.type = 'checkbox';
    status.checked = completed;
    status.addEventListener('change' , handleTodoChange);

    const close = document.createElement('span');
    close.innerHTML = '&times;';
    close.className = 'close'; 
    close.addEventListener('click', handleClose);

    li.prepend(status);
    li.append(close);

    todoList.prepend(li);
}

function createUserOption(user) {
    const option = document.createElement('option');
    option.value = user.id;
    option.innerText = user.name;
    userSelect.append(option);
}

function removeTodo(todoId) {
    todos = todos.filter(todo => todo.id !== todoId);

    const todo = todoList.querySelector(`[data-id ="${todoId}"]`);
    todo.querySelector('input').removeEventListener('change', handleTodoChange);
    todo.querySelector('.close').removeEventListener('click', handleClose);

    todo.remove();
}

function alertError(error) {
    alert(error.message);
}
//event logic//
function initApp() {
    Promise.all([getAllTodos(), getAllusers()])    
        .then(values => {
            [todos, users] = values;
            //console.log(todos, users);
            todos.forEach((todo) => printTodo(todo));
            users.forEach((user) => createUserOption(user));
        })
}

function handleSubmit(event) {
    event.preventDefault();
    // console.log(form.todo.value);
    // console.log(form.user.value);

    createTodo({
        userId: Number(form.user.value),
        title: form.todo.value,
        completed: false,
    })
}

function handleTodoChange() {
    const todoId = this.parentElement.dataset.id;
    const completed = this.cheked;
    toggleTodoComplete(todoId, completed);
}

function handleClose() {
    const todoId = this.parentElement.dataset.id;
    deleteTodo(todoId);
}
//async logic//
async function getAllTodos() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=16');
        const data = await response.json();
 
        return data;
    } catch (error) {
        alertError(error);
    } 
}

async function getAllusers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=8');
        const data = await response.json();

        return data;
    } catch (error) {
        alertError(error);
    }
}
 
async function createTodo(todo) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const newTodo = await response.json();
    //console.log(todoId); 
    printTodo(newTodo);
    } catch (error) {
        alertError(error);
    }
}


// моя недоработка! не работает галка и статус. Стутас должен менять на true || false
async function toggleTodoComplete(todoId, completed) {
    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/todos/${todoId}`, 
            {
                method: 'PATCH',
                body: JSON.stringify({completed}), 
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    const data = await response.json();  
    console.log(data);
    if (!response.ok) {
        throw new Error('Falied to connect with the server! Please try later.');
    }
    } catch (error) {
        alertError(error);
    }
}

async function deleteTodo(todoId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    );
    // const data = await response.json();
    // console.log(data);
    if (response.ok) {
        removeTodo(todoId);
    } else {
        throw new Error('Falied to connect with the server! Please try later.');
    }
    } catch (error) {
        alertError(error);
    } 
}
})()

