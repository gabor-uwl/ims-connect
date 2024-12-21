CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    jobTitle TEXT NOT NULL,
    qualification TEXT NOT NULL,
    departmentCode TEXT NOT NULL,
    password TEXT NOT NULL
);

DROP TABLE newideas;

CREATE TABLE newideas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ideaId TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    employeeId INTEGER NOT NULL,
    submissionDate TEXT,
    state TEXT,
    FOREIGN KEY (employeeId) REFERENCES employees(id)
);

DROP TABLE votes;

CREATE TABLE votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ideaId TEXT NOT NULL,
    votedBy INTEGER NOT NULL,
    comment TEXT,
    FOREIGN KEY (votedBy) REFERENCES employees(id)
);

DROP TABLE projects;

CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectId TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    teamId INTEGER NOT NULL,
    FOREIGN KEY (teamId) REFERENCES teams(id)
);

DROP TABLE tasks;

CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    taskId TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    state TEXT NOT NULL,
    assigneeId INTEGER NOT NULL,
    projectId INTEGER NOT NULL,
    FOREIGN KEY (assigneeId) REFERENCES employees(id),
    FOREIGN KEY (projectId) REFERENCES projects(id)
);

DROP TABLE teams;

CREATE TABLE teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectId TEXT UNIQUE NOT NULL,
    teamLeaderId INTEGER NOT NULL,
    teamMembers TEXT,
    FOREIGN KEY (teamLeaderId) REFERENCES employees(id)
);