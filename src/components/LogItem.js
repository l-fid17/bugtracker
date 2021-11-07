import React from "react";
import { Badge, Button } from "react-bootstrap";

const LogItem = ({ id, text, priority, user, createdAt, removeLog }) => {
  const setBg = () => {
    switch (priority) {
      case "high":
        return "danger";
      case "moderate":
        return "warning";
      default:
        return "success";
    }
  };

  return (
    <tr>
      <td>
        <Badge pill bg={setBg()} className="p-2">
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>
      </td>
      <td>{text}</td>
      <td>{user}</td>
      <td>{createdAt}</td>
      <td>
        <Button variant="danger" size="sm" onClick={() => removeLog(id)}>
          x
        </Button>
      </td>
    </tr>
  );
};

export default LogItem;
