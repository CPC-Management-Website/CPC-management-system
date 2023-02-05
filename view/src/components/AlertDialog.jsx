import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ProgressList from "./ProgressList";

export default function AlertDialog(email) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <ReceiptLongIcon onClick={handleClickOpen}>
        Open alert dialog
      </ReceiptLongIcon>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <p className="text-3xl font-semibold mb-4">Trascript</p>
          <div className="flex flex-col space-y-4 rounded-xl">
            <ProgressList email={email["email"]} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
