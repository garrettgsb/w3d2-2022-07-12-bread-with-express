/*
  Resources are the nouns of your app
  You can think of resources as Collections and Entities
  e.g. "The Todos collection" vs. "A Todo entity"

  CRUD - Create Read Update Delete
  BREAD - Browse Read Edit Add Delete

  In BREAD:
  Reading a collection is Browse
  Reading an entity is Read
*/

const todos = [
  "Get milk", //  In the view, this turns into "<li>Get milk [0]</li>" (Before we added in the forms)
  "Wash car",
  "Walk dog",
];

function addTodo(todo) {
  todos.push(todo);
}

function removeTodo(idx) {
  if (!todos[idx]) throw new Error(`No todo at index ${idx}!`);
  todos.splice(idx, 1);
}

function updateTodo(idx, newText) {
  if (!todos[idx]) throw new Error(`No todo at index ${idx}!`);
  todos[idx] = newText;
}

function viewTodos() {
  return `<h1>Todos:</h1>
  <ul>
  ${todos.map((todo, idx) => `
    <li>
      ${todo} [${idx}]
      <form method='POST' action='/todos/${idx}'>
        <input name='newTodoText'>
        <button>✏️</button>
      </form>
      <form method='POST' action='/todos/${idx}/delete'>
        <button>🚮</button>
      </form>
    </li>
  `).join('\n')}
  </ul>
  <form method='POST' action='/todos'>
    <input name='newTodoText'>
    <button>Add</button>
  </form>
  `;
}

const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => response.redirect('/todos'));
app.get('/todos', (request, response) => { response.send(viewTodos()) }); // Browse
// We skip Read-- Looking at an individual Todo is not that interesting
app.post('/todos', (request, response) => {
  const text = request.body.newTodoText;
  console.log(text);
  addTodo(text);
  response.redirect('/todos');
}); // Add
app.post('/todos/:id', (request, response) => {
  const id = Number(request.params.id);
  const text = request.body.newTodoText;
  updateTodo(id, text);
  response.redirect('/todos');
}); // Update
app.post('/todos/:id/delete', (request, response) => {
  const id = Number(request.params.id);
  removeTodo(id);
  response.redirect('/todos');
}); // Delete

/*

REST stands for REpresentational State Transfer
(That's not a super helpful term in this context... Also a much broader concept than just routing)

"RESTful routing" is about doing BREAD stuff to Resources in a predictable way.
So if I know what my resources are, then I already know what the routes should be.
Not a strict rule-- People deviate from RESTful routing practices all the time, and that's okay.
But if you follow it when you can, your code will be easier to work with, for you and others,
by being predictable and consistent. Boring, in a good way :)

Browse - GET '/resources'
Read - GET '/resources/:id'
Edit - POST '/resources/:id'
Add - POST '/resources'
Delete - POST '/resources/:id/delete' (or DELETE '/resources/:id')

Browse - GET '/chefs'
Read - GET '/chefs/:id'
Edit - POST '/chefs/:id'
Add - POST '/chefs'
Delete - POST '/chefs/:id/delete' (or DELETE '/chefs/:id')

Browse - GET '/recipes'
Read - GET '/recipes/:id'
Edit - POST '/recipes/:id'
Add - POST '/recipes'
Delete - POST '/recipes/:id/delete' (or DELETE '/recipes/:id')

Browse - GET '/comments'
Read - GET '/comments/:id'
Edit - POST '/comments/:id'
Add - POST '/comments'
Delete - POST '/comments/:id/delete' (or DELETE '/comments/:id')

*/
app.listen(8080, () => console.log('Todo list app is listening on port 8080'));
