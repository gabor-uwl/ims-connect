const express = require("express");
const fsystem = require("fs");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(express.json());
app.use(cors());

const ims_db = new sqlite3.Database('./ims_db/ims-connect.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to IMS-Connect database.');
});

app.post("/api/login", async (req, res) => {
  const {email, password} = req.body;
  const sql = 'SELECT * FROM employees WHERE email = ?';

  ims_db.all(sql, email, (err, rows) => {
    if (err) throw err;

    const len = rows.length;
    if (len == 1) {
      if(rows[0].password === password)
        res.status(200).send({employee: rows[0]});
      else
        res.status(401).send({message: "Invalid credential! Please check your password."});

    }
    else if (len == 0)
      res.status(401).send({message: "No employee found! Please check your email address."});
    else
      res.status(401).send({message: "Database error! Please contact the administrator."});
  });
});

app.post("/api/register", async (req, res) => {
  const {title, firstName, lastName, email, jobTitle, qualification, departmentCode, password} = req.body;
  const sql = 'INSERT INTO employees \
                (title, firstName, lastName, email, jobTitle, qualification, departmentCode, password) \
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  ims_db.run(sql, [title, firstName, lastName, email, jobTitle, qualification, departmentCode, password], (err) => {
    if (err) throw err;

    res.status(200).send({state: "registered"});
  });
});

app.post("/api/employee", async (req, res) => {
  const sql = 'SELECT * FROM employees WHERE id = ?';

  ims_db.all(sql, req.body.employeeId, (err, rows) => {
    if (err) throw err;

    res.status(200).send({employee: rows[0]});
  });
});

app.post("/api/employee/update", async (req, res) => {
  const {title, firstName, lastName, qualification, employeeId} = req.body;
  const sql = 'UPDATE employees \
               SET title = ?, firstName = ?, lastName = ?, qualification = ? \
               WHERE id = ?';

  ims_db.run(sql, [title, firstName, lastName, qualification, employeeId], (err) => {
    if (err) throw err;

    res.status(200).send({state: "updated"});
  });
});

app.get("/api/ideaboard", async (req, res) => {
  const sql = 'SELECT newideas.id, newideas.ideaId, title, state, \
               COUNT(votedBy) AS voteCount \
               FROM newideas \
               LEFT JOIN votes ON newideas.ideaId = votes.ideaId \
               WHERE submissionDate is NOT NULL \
               GROUP BY newideas.ideaId \
               ORDER BY voteCount DESC';

  ims_db.all(sql, (err, rows) => {
    if (err) throw err;

    res.status(200).send({ideas: rows});
  });
});

app.post("/api/idea", async (req, res) => {
  const {ideaId, employeeId} = req.body;
  const sql = 'SELECT * FROM newideas WHERE ideaId = ?';

  ims_db.all(sql, ideaId, (err, rows) => {
    if (err) throw err;

    const idea = rows[0];
    const sql = 'SELECT title, firstName, lastName FROM employees WHERE id = ?';

    ims_db.all(sql, idea.employeeId, (err, rows) => {
      if (err) throw err;

      const employee = rows[0];
      const sql = 'SELECT id FROM votes WHERE ideaId = ? AND votedBy = ?';

      ims_db.all(sql, [ideaId, employeeId], (err, rows) => {
        if (err) throw err;

        let hasVoted = true;
        if (rows.length == 0)
          hasVoted = false;

        res.status(200).send({idea: idea, employee: employee, hasVoted: hasVoted});
      });
    });
  });
});

app.post("/api/myideas", async (req, res) => {
  const sql = 'SELECT * FROM newideas WHERE employeeId = ?';

  ims_db.all(sql, req.body.employeeId, (err, rows) => {
    if (err) throw err;

    res.status(200).send({ideas: rows});
  });
});

app.post("/api/myidea", async (req, res) => {
  const {ideaId, employeeId} = req.body;

  const sql = 'SELECT * FROM newideas WHERE employeeId = ? AND ideaId = ?';

  ims_db.all(sql, [employeeId, ideaId], (err, rows) => {
    if (err) throw err;

    if (rows.length == 1)
      res.status(200).send({idea: rows[0]});
    else
      res.status(401).send({message: "No idea found! Please check idea id."})
  });
});

app.post("/api/saveidea", async (req, res) => {
  const {idea, title, description, employeeId} = req.body;

  if (idea == null) {
    const sql = 'SELECT * FROM newideas ORDER BY id DESC LIMIT 1';

    ims_db.all(sql, (err, row) => {
      if (err) throw err;

      let ideaId = 'INNO-1';
      if (row.length != 0)
        ideaId = 'INNO-' + String(row[0].id + 1);

      const sql = 'INSERT INTO newideas \
                   (ideaId, title, description, employeeId) \
                   VALUES (?, ?, ?, ?)';

      ims_db.run(sql, [ideaId, title, description, employeeId], (err) => {
        if (err) throw err;

        res.status(200).send({state: "saved"});
      });
    });
  }
  else {
    const sql = 'UPDATE newideas SET title = ?, description = ? WHERE ideaId = ?';

    ims_db.run(sql, [title, description, idea.ideaId], (err) => {
      if (err) throw err;

      res.status(200).send({state: "saved"});
    });
  }
});

app.post("/api/submitidea", async (req, res) => {
  const sql = 'UPDATE newideas \
               SET submissionDate = ?, state="submitted" \
               WHERE ideaId = ?';
  const date = new Date().toLocaleDateString();

  ims_db.run(sql, [date, req.body.ideaId], (err) => {
    if (err) throw err;

    res.status(200).send({state: "submitted"});
  });
});

app.post("/api/voteidea", async (req, res) => {
  const {ideaId, comment, employeeId} = req.body;
  const sql = 'INSERT INTO votes \
               (ideaId, votedBy, comment) \
               VALUES (?, ?, ?)';

  ims_db.run(sql, [ideaId, employeeId, comment], (err) => {
    if (err) throw err;

    res.status(200).send({state: "voted"});
  });
});

app.get("/api/projects", async (req, res) => {
  const sql = 'SELECT projects.projectId, name, \
               title || " " || firstName || " " || lastName AS teamLeader \
               FROM projects \
               INNER JOIN teams ON projects.teamId = teams.id \
               INNER JOIN employees ON teams.teamLeaderId = employees.id';

  ims_db.all(sql, (err, rows) => {
    if (err) throw err;

    res.status(200).send({projects: rows});
  });
});

app.post("/api/project", async (req, res) => {
  const sql = 'SELECT tasks.id, taskId, tasks.title, state, firstName, lastName \
               FROM tasks \
               INNER JOIN projects ON tasks.projectId = projects.id \
               INNER JOIN employees ON tasks.assigneeId = employees.id \
               WHERE projects.projectId = ?';

  ims_db.all(sql, req.body.projectId, (err, rows) => {
    if (err) throw err;

    const sql = 'SELECT teamLeaderId FROM teams WHERE projectId = ?';

    ims_db.all(sql, req.body.projectId, (err, row) => {
      if (err) throw err;
  
      res.status(200).send({tasks: rows, teamLeaderId: row[0].teamLeaderId});
    });
  });
});

app.post("/api/task", async (req, res) => {
  const {taskId, projectId} = req.body;
  const sql = 'SELECT id \
               FROM projects \
               WHERE projectId = ?';

  ims_db.all(sql, projectId, (err, row) => {
    if (err) throw err;
    
    const sql = 'SELECT tasks.title, description, state, assigneeId, \
                 firstName || " " || lastName AS assignee \
                 FROM tasks \
                 INNER JOIN employees ON tasks.assigneeId = employees.id \
                 WHERE tasks.taskId = ? AND projectId = ?';

    ims_db.all(sql, [taskId, row[0].id], (err, rows) => {
      if (err) throw err;

      res.status(200).send({task: rows[0]});
    });
  });
});

app.post("/api/task/create", async (req, res) => {
  const {title, description, assigneeId, projectId} = req.body;
  const sql = 'SELECT projects.id AS projId, COUNT(tasks.id) AS number \
               FROM tasks \
               INNER JOIN projects ON tasks.projectId = projects.id \
               WHERE projects.projectId = ? \
               GROUP BY projects.id';

  ims_db.all(sql, projectId, (err, row) => {
    if (err) throw err;
    
    let taskId = 'TASK-1';
    if (row[0].number != 0)
      taskId = 'TASK-' + String(row[0].number + 1);
    
    const sql = 'INSERT INTO tasks \
                 (taskId, title, description, state, assigneeId, projectId) \
                 VALUES (?, ?, ?, "todo", ?, ?)';
    
    ims_db.run(sql, [taskId, title, description, assigneeId, row[0].projId], (err) => {
      if (err) throw err;
    
      res.status(200).send({state: "created"});
    });
  });
});

app.post("/api/task/update", async (req, res) => {
  const {taskId, projectId, state} = req.body;
  const sql = 'SELECT id \
               FROM projects \
               WHERE projectId = ?';

  ims_db.all(sql, projectId, (err, row) => {
    if (err) throw err;
    
    const sql = 'UPDATE tasks SET state = ? \
                 WHERE taskId = ? AND projectId = ?';

    ims_db.run(sql, [state, taskId, row[0].id], (err) => {
      if (err) throw err;
  
      res.status(200).send({state: "updated"});
    });
  });
});

app.post("/api/teammembers", async (req, res) => {
  const sql = 'SELECT employees.id AS value, \
               firstName || " " || lastName AS label \
               FROM employees \
               INNER JOIN teammembers ON employees.id = teammembers.teamMemberId \
               WHERE projectId = ?';

  ims_db.all(sql, req.body.projectId, (err, rows) => {
    if (err) throw err;

    res.status(200).send({teamMembers: rows});
  });
});

app.post("/api/newteammembers", async (req, res) => {
  const sql = 'SELECT employees.id AS value, \
               firstName || " " || lastName || " - " || departmentCode AS label \
               FROM employees \
               LEFT JOIN teammembers ON employees.id = teammembers.teamMemberId \
               WHERE employees.id NOT IN (SELECT teamMemberId FROM teammembers \
               INNER JOIN employees ON employees.id = teammembers.teamMemberId \
               WHERE projectId = ?) AND employees.id > 2';

  ims_db.all(sql, req.body.projectId, (err, rows) => {
    if (err) throw err;

    res.status(200).send({newTeamMembers: rows});
  });
});

app.listen(3100, () => {
  console.log("Server listening on http://localhost:3100");
});
