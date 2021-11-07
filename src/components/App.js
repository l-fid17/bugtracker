import React, { useState } from "react";
import { Alert, Container, Table } from "react-bootstrap";
import AddLogItem from "./AddLogItem";
import LogItem from "./LogItem";

const App = () => {
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    variant: "success",
  });
  const [logs, setLogs] = useState([
    {
      id: 1,
      text: "test1",
      priority: "low",
      user: "user",
      createdAt: new Date().toUTCString(),
    },
    {
      id: 2,
      text: "test2",
      priority: "high",
      user: "user",
      createdAt: new Date().toUTCString(),
    },
    {
      id: 3,
      text: "test3",
      priority: "moderate",
      user: "user",
      createdAt: new Date().toUTCString(),
    },
  ]);

  const addItem = (item) => {
    console.log("addItem:ITEM::: ", item);

    if (item.text === "" || item.user === "") {
      showAlert("Please enter all fields", "danger", 6000);
      return;
    }

    item.id = Math.floor(Math.random() * 40000) + 10000;
    item.createdAt = new Date().toUTCString();
    setLogs([...logs, item]);
    showAlert("Log Added!");
  };

  const removeLog = (id) => {
    setLogs(logs.filter((log) => log.id !== id));
    showAlert(`Removed: ${id}`);
  };

  const showAlert = (msg, variant = "success", seconds = 3000) => {
    setAlert({
      show: true,
      msg,
      variant,
    });

    setTimeout(() => {
      setAlert({ show: false, msg: "", variant: "success" });
    }, seconds);
  };

  return (
    <Container>
      <AddLogItem addItem={addItem} />
      {alert.show && <Alert variant={alert.variant}>{alert.msg}</Alert>}
      <Table>
        <thead>
          <tr>
            <th>Priority</th>
            <th>Log Text</th>
            <th>User</th>
            <th>Created At</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <LogItem
              key={log.id}
              id={log.id}
              text={log.text}
              priority={log.priority}
              user={log.user}
              createdAt={log.createdAt}
              removeLog={removeLog}
            />
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default App;
