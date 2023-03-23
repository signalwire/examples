import React from "react";
import Button from "@mui/material/Button";

export default function LeaveButton({ roomSession }) {
  return (
    <Button
      color="error"
      variant="outlined"
      onClick={() => roomSession?.leave()}
    >
      Leave
    </Button>
  );
}
