import { Application } from "https://deno.land/x/abc@v1.3.1/mod.ts";

/*
!!!!!!!

THIS IS BAD CODE. DO NOT CREATE AN API LIKE THIS.

This example should only be used for teaching purposes. 
Do not mimic any of techniques found in this example. 

!!!!!!!
*/

//
// The class below is used to "fake" a database for the purposes of this exercise
//
class Database {
  number = 0;

  plus(num) {
    this.number += num;
  }

  minus(num) {
    this.number -= num;
  }
}

const app = new Application();
const PORT = 8080;
const database = new Database();
// Stateful

const loggedInUsers = [];
// Stateful

app
  .post("/server", async (server) => {
    const { method, number, id } = await server.body;

    if (method === "login") {
      // Pleniform interface
      login(id);
      server.json(
        {
          success: `User with id (${id}) has been logged in`,
          next: "show logged in screen",
          id: id,
        },
        200
      );
      return;
    }

    // Pleniform interface
    // Client-server interdependence
    if (loggedInUsers.includes(id)) {
      if (method === "plus") {
        window[method](number);
        success(server, id);
      } else if (method === "logout") {
        window[method](id);
        success(server, id);
      } else if (method === "minus") {
        window[method](number);
        success(server, id);
      } else if (method === "retrieve") {
        window[method](id);
      } else {
        server.json(
          {
            error: "Unknown method",
            id: id,
            next: "show error screen",
          },
          404
        );
      }
    } else {
      server.json(
        { error: "You are not logged in", id: id, next: "show error screen" },
        401
      );
    }
  })
  .start({ port: PORT });

console.log(`Server running on http://localhost:${PORT}`);

function success(server, id) {
  server.json(
    {
      success: "Action completed",
      id: id,
      next: "show success screen",
    },
    200
  );
}

function plus(number) {
  database.plus(number);
}

function minus(number) {
  database.minus(number);
}

function login(id) {
  loggedInUsers.push(id);
}

function logout(id) {
  loggedInUsers = loggedInUsers.filter((userId) => userId !== id);
}

function retrieve(id) {
  server.json({ number: database.number, id: id, next: "show number" }, 200);
}
