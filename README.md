<span style='color: purple; font-weight: bold; font-size: 3.5rem'>Babbel Project</span>

---

<span id='description' style='color: #A460ED; font-weight: bold; font-size: 2.5rem' >Document Sections</span>

|                 Links                  | Description                                                                                               |
| :------------------------------------: | --------------------------------------------------------------------------------------------------------- |
|      [Description](#description)       | This is all about the `features` and `extensions` that whether could've been afforded or already provided |
| [Project Managment](#ProjectManagment) | All the necessary files to `start`, `stop` and `debug` the code                                           |
|      [Project APIs](#ProjectAPIs)      | All the project APIs for `user`, `language`, `lesson` and `course`                                        |

---

<span id='description' style='color: #A460ED; font-weight: bold; font-size: 2.5rem' >Description</span>

> <span style='color: #EC7272; font-weight: bold;'>MVC Pattern</span> was implemented during the project completion

> It could be developed by <span style='color: #EC7272; font-weight: bold;'>Typescript</span> to be more **strictly-typed**
>
> > I used <span style='color: #EC7272; font-weight: bold;'><a href='https://jsdoc.app/'>JSDoc</a></span> to be more precise and also **well-documented**

> <span style='color: #EC7272; font-weight: bold;'>Error-handling</span> could be more improved using <span style='color: #EC7272; font-weight: bold;'>OOP</span> in case of _microservices_
>
> > A <span style='color: #EC7272; font-weight: bold;'>CustomError abstraction</span> class to wrap all the other **user-defined errors**
>
> > <span style='color: #EC7272; font-weight: bold;'><a href='https://www.npmjs.com/package/http-errors'>Http-errors</a></span> can be used for a better http errors

> We could use <span style='color: #EC7272; font-weight: bold;'><a href='https://www.npmjs.com/package/express-async-errors' >express-async-errors</a></span> module to get rid of <span style='color: #EC7272; font-weight: bold;'>Try/Catch</span> block every time to handle the exceptions

> **Update** and **insert** could be merged through the implementation of <span style='color: #EC7272; font-weight: bold;'>UPSERT</span> by means of **ON CONFLICT**

> **Routes** in the **controllers** folder could be alongside the service in case of a large-scaled project

> I also added the <span style='color: #A62349; font-weight: bold;'>Dockerfile</span> and <span style='color: #A62349; font-weight: bold;'>Docker-compose.yaml</span> file to be more precise in case of **`IaaC`**

> I also added the <span style='color: #F675A8; font-weight: bold;'>Diagram</span> of the **cardinality** among the tables

> I also added the <span style='color: #F675A8; font-weight: bold;'>Postman Collection JSON</span> file to import the all the **routes** and **collection-wide variables**

> For _testing purposes_, It could've been imporved using <span style='color: #5800FF; font-weight: bold;'>Unit Tesing</span>, <span style='color: #5800FF; font-weight: bold;'>Schema Testing</span>
>
> > I added **user schema json** test as a sample for API <span style='color: #A6D1E6; font-weight: bold;'>[user/info/:userId](#ProjectAPIs)</span>

> I used <span style='color: #3CCF4E; font-weight: bold;'><a href='https://joi.dev/api/?v=17.6.0'>Joi</a></span> for **User Input Validation**

> I made an attempt to follow some **principles** like

> API could be more clarified using **OpenAPI** | **Swagger**

---

<span id='ProjectManagment' style='color: #A460ED; font-weight: bold; font-size: 2.5rem'>Project Managment</span>

<span style='font-weight: bold; font-size: 1.5rem'><span style='color: #FFC54D'>1. </span>_Script_</span>

```json
{
  "start:prod": "node src/index.js",
  "start:dev": " nodemon src/index.js",
  "pg:init": "pg_ctl init -D data",
  "pg:start": "pg_ctl -D data start",
  "pg:createdb": "createdb -h 127.0.0.1 app",
  "pg:stop": "pg_ctl -D data stop"
}
```

<span style='color: #EB1D36; font-weight: bold; font-size: 1.5rem'>Hint: </span>

> You should add the postgres **bin** folder to the system path _if you're using windows_

<span style='font-weight: bold; font-size: 1.5rem'><span style='color: #FFC54D'>2. </span> _Debug Mode_</span>

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "babbel",
      "skipFiles": ["<node_internals>/**", "node_modules/**/*"],
      "program": "${workspaceFolder}/src/index.js",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/nodemon",
      "restart": true,
      "env": {
        "NODE_ENV": "development"
      },
      "envFile": "${workspaceFolder}/.env.development"
    }
  ]
}
```

<span style='font-weight: bold; font-size: 1.5rem'><span style='color: #FFC54D'>3. </span> _VSCode Plugins_</span>

|             Plugin              | Description                                                                                   |
| :-----------------------------: | --------------------------------------------------------------------------------------------- |
|      **`Better Comments`**      | The Better Comments extension will help you create more human-friendly comments in your code. |
|    **`VSCode Great Icons`**     | better icons for the folders and files                                                        |
|    **`Markdown All in One`**    | Markdown All in One                                                                           |
| **`Markdown Preview Enhanced`** | Markdown Preview Enhanced for more readability - All the styles                               |

<span style='font-weight: bold; font-size: 1.5rem'><span style='color: #FFC54D'>4. </span> _Folder Structure_</span>

- <span style='color: #3AB0FF;font-weight: bold; font-size: 1.3rem'>src</span>
  > This is a place where all the files are stored
  - <span style='color: #774360;font-weight: bold; font-size: 1rem'>_controllers_</span>
  - <span style='color: #774360;font-weight: bold; font-size: 1rem'>_db_</span>
  - <span style='color: #774360;font-weight: bold; font-size: 1rem'>_middlewares_</span>
  - <span style='color: #774360;font-weight: bold; font-size: 1rem'>_services_</span>
  - <span style='color: #774360;font-weight: bold; font-size: 1rem'>_utils_</span>
- <span style='color: #3AB0FF;font-weight: bold; font-size: 1.3rem'>public</span>
  > All the static files are stored here

---

<span id='ProjectAPIs' style='color: #A460ED; font-weight: bold; font-size: 2.5rem'>Project APIs</span>

| User                      | Description                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------- |
| **`user/signup`**         | adds a user                                                                            |
| **`user/info/:userId`**   | gets all the user information using user Id                                            |
| **`user/update/:userId`** | updates one or more user fields. _I also merged the profile picture inside this route_ |
| **`user/delete/:userId`** | deletes a user using userId                                                            |

| language                      | Description                                          |
| ----------------------------- | ---------------------------------------------------- |
| **`language/add`**            | adds a language                                      |
| **`language/list`**           | gets all the languages' information                  |
| **`language/update/:langId`** | updates one or more language fields.                 |
| **`language/update/:langId`** | updates all language fields.                         |
| **`language/delete/:langId`** | deletes a language using language id                 |
| **`language/delete`**         | deletes all languages' information using language id |

| lessons                     | Description                        |
| --------------------------- | ---------------------------------- |
| **`lesson/add`**            | adds a lesson                      |
| **`lesson/list`**           | gets all the lessons' information  |
| **`lesson/update/:langId`** | updates one or more lesson fields. |
| **`lesson/delete/:langId`** | deletes a lesson using lesson id   |

| course                        | Description                                   |
| ----------------------------- | --------------------------------------------- |
| **`course/add`**              | adds a course                                 |
| **`course/list`**             | gets all the courses' information             |
| **`course/:userId`**          | gets all the course information using user id |
| **`course/update/:courseId`** | updates one or more course fields.            |
| **`course/delete/:courseId`** | deletes a course using user id                |
