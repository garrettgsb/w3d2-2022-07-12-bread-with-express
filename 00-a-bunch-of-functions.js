const fs = require('fs');

function readCounter() { return Number(fs.readFileSync('./counter')); }
function writeCounter(value) { return fs.writeFileSync('./counter', value);  }

function increment() { writeCounter(readCounter() + 1); }
function decrement() { writeCounter(readCounter() - 1); }
function setTo(value) { writeCounter(Number(value)); }
function reset() { setTo(0); }


// Mapping between Javascript functions and command line interface
{
  // The interface for this application (i.e. Commands that a user can run to interact with it):
  // node 00-a-bunch-of-functions.js increment
  // node 00-a-bunch-of-functions.js decrement
  // node 00-a-bunch-of-functions.js set 50
  // node 00-a-bunch-of-functions.js reset
  // node 00-a-bunch-of-functions.js
  const [_interpreter, _file, operation, value] = process.argv;
  if (operation === 'increment') { increment(); console.log(`After ${operation}: ${readCounter()}`)}
  else if (operation === 'decrement') { decrement(); console.log(`After ${operation}: ${readCounter()}`)}
  else if (operation === 'set') { setTo(value); console.log(`After ${operation}: ${readCounter()}`)}
  else if (operation === 'reset') { reset(); console.log(`After ${operation}: ${readCounter()}`)}
  else { console.log(`Count is: ${readCounter()}`) }
}

//Mapping between Javascript functions and HTTP interface
{
  const express = require('express');
  const app = express();
  const PORT = 3000;

  app.get('/', (request, response) => { response.send(`
    <h1>Count is: ${readCounter()}</h1>
    <a href='/increment'>Increment</a>
    <a href='/decrement'>Decrement</a>
    <form method='GET' action='/reset'>
      <button>Reset</button>
    </form>
    <form method='GET' action='/set'>
      <input name='newCounterValue'>
      <button>Set</button>
    </form>
  `)});

  // You _could_ just send a response, like below, instead of redirecting...
  // But we prefer to separate "requests to do something" from "requests to see something"
  // So the plan in this app is just to always redirect to home ('/') after taking an action.
  // app.get('/increment', (request, response) => { increment(); response.send("Request to increment was successful! Current count is: " + readCounter() + "<a href='/'>Back</a>") });
  app.get('/increment', (request, response) => { increment(); response.redirect('/') });
  app.get('/decrement', (request, response) => { decrement(); response.redirect('/') });
  app.get('/reset', (request, response) => { reset(); response.redirect('/') });
  app.get('/set', (request, response) => {
    const { newCounterValue } = request.query;
    if (newCounterValue) setTo(newCounterValue);
    response.redirect('/')
  });

  app.listen(8080, () => { console.log(`Listening on ${PORT}!`)});
}
