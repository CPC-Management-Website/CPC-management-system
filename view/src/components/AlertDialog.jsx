import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ProgressList from "./ProgressList";

export default function AlertDialog(props) {
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
          <p className="text-3xl font-semibold mb-4">Progress</p>
          <div className="flex flex-col space-y-4 rounded-xl">
            <ProgressList
              user_id={props["user_id"]}
              level_id={props["level_id"]}
              season={props["season"]}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
