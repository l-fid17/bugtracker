import { ipcRenderer } from "electron";
import React, { useEffect, useState } from "react";
import { Alert, Container, Table } from "react-bootstrap";
import { v4 as uuid } from "uuid";

import AddLogItem from "./AddLogItem";
import LogItem from "./LogItem";

const App = () => {
  const [logs, setLogs] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    variant: "success",
  });

  useEffect(() => {
    ipcRenderer.send("logs:load");
    ipcRenderer.on("logs:get", (e, logs) => {
      console.log("LOGS::: ", logs);
      setLogs(JSON.parse(logs));
    });
    ipcRenderer.on("logs:clear", () => {
      setLogs([]);
      showAlert("Logs Cleared!");
    });
  }, []);

  const addItem = (item) => {
    console.log("addItem:ITEM::: ", { id: uuid(), ...item });

    if (item.text === "" || item.user === "") {
      showAlert("Please enter all fields", "danger", 6000);
      return;
    }

    ipcRenderer.send("logs:add", { id: uuid(), ...item });

    showAlert("Log Added!");
  };

  const removeLog = (id) => {
    console.log("removeItem:ID::: ", id);

    ipcRenderer.send("logs:remove", id);

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
