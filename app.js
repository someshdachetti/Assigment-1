const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const path = require("path");

const dataBasePath = path.join(__dirname, "todoApplication.db");

var addDays = require("date-fns/addDays");

let DATABASE = null;

let start = async () => {
  try {
    DATABASE = await open({
      filename: dataBasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("SEVER running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`Database ERRROR ${e.message}`);
  }
};
start();
const snake_to_camel_case = (databaseobject) => {
  return {
    id: databaseobject.id,
    todo: databaseobject.todo,
    priority: databaseobject.priority,
    status: databaseobject.status,
    category: databaseobject.category,
    dueDate: databaseobject.due_date,
  };
};
//API 1
app.get("/todos/", async (request, response) => {
  const { status } = request.query;
  const get_TODO = `
    SELECT
    *
    FROM
    todo
    where
    status like '%${status}%';`;

  const output = await DATABASE.all(get_TODO);
 const camelCase = output.map(snake_to_camel_case)
 response.send(camelCase)
});

//

app.get("/todos/", async (request, response) => {
  const { priority = "" } = request.query;
  const get_HIGH = `
    SELECT * FROM todo
     WHERE priority LIKE '%${priority}%';`;

  const output = await DATABASE.all(get_HIGH);
  response.send(output);
});

////

app.get("/todos", async (request, response) => {
  const { priority, status } = request.query;

  const get_HIGH_IN_progress = `
    SELECT * from todo
    WHERE priority like '%${priority}%' AND 
    status like '%${status}%';`;

  const output = await DATABASE.all(get_HIGH_IN_progress);
  response.send(output);
});

///

app.get("/todos/", async (request, response) => {
  const { search_q = "" } = request.query;

  const get_book = `
    SELECT * FROM todo
     WHERE Buy LIKE '%${search_q}%'`;

  const output = await DATABASE.get(get_book);
  response.send(output);
});

////

app.get("/todos/", async (request, response) => {
  const { category, status } = request.quest;

  const getIt = `
    SELECT * FROM todo 
    WHERE category LIKE '%${category}%' 
    AND status LIKE '%${status}%'; `;

  const output = await DATABASE.all(getIt);
  response.send(output);
});

//
app.get("/todos", async (request, response) => {
  const { category } = request.query;

  const getCategory = `
    SELECT * FROM todo 
    WHERE category like '%${category}%'`;

  const result = await DATABASE.all(getCategory);
  response.send(result);
});

///

app.get("/todos", async (request, response) => {
  const { category, priority } = request.query;

  const xx = `
    SELECT * FROM todo WHERE
     category LIKE '%${category}%' AND
      priority LIKE '%${priority}%'`;

  const output = await DATABASE.all(xx);
  response.send(output);
});

//api 2

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const get_by_id = `
    SELECT * FROM todo where id = '${todoId}';`;

  const result = await DATABASE.get(get_by_id);
  const x = result.map(snake_to_camel_case)
  response.send(x)
});

//API 3

app.get("/agenda/", async (request, response) => {
  const { date } = request.query;

  const getDate = `
    SELECT * FROM todo 
    WHERE due_date like '%${date}'`;

  const xx = await DATABASE.all(getDate);
  response.send(xx);
});

// api 4

app.post("/todos", async (request, response) => {
  const { id, todo, priority, status, category, due_date } = request.body;

  const post = `
    INSERT INTO todo(id,todo,priority,status,category,due_date)
    
    VALUES(
        '${id}',

        '${todo}',

         '${priority}',

          '${status}',

           '${category}',

            '${due_date}'


        );`;

  await DATABASE.run(post);
  response.send("Todo Successfully Added");
});

// api 5

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { status } = request.body;

  const update = `
    UPDATE todo
    SET 
    status = '${status}'
   
    WHERE  id = '${todoId}';`;

  await DATABASE.run(update);
  response.send("Status Updated");
});

//

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { priority } = request.body;

  const update = `
    UPDATE todo
    SET 
    priority = '${priority}'
    where id = '${todoId}';`;
  await DATABASE.run(update);
  response.send("Priority Updated");
});
///
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { todo } = request.body;

  const update = `
    UPDATE todo
    SET todo = '${todo}'
     where id = '${todoId}';`;

  await DATABASE.run(update);
  response.send("Todo Updated");
});

///
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { category } = request.body;

  const update = `
    UPDATE todo
    SET category = '${category}'
    where id = '${todoId}';`;

  await DATABASE.run(update);
  response.send("Category Updated");
});

//

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { due_date } = request.body;

  const update = `
    UPDATE todo
    SET 
    due_date = '${due_date}'
   
    WHERE  id = '${todoId}';`;

  await DATABASE.run(update);
  response.send("Due Date Updated");
});
//API 6
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;

  const deleted = `
    DELETE 
    from todo
    where id ='${todoId}';`;

  await DATABASE.run(deleted);
  response.send("Todo Deleted");
});
