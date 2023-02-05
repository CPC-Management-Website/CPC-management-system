import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";

export default function CustomTable({ headers, items }) {
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  }));

  return (
    <div className="flex flex-col p-4 min-h-screen">
      <TableContainer className="hidden md:flex" component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <StyledTableCell align="center">{header}</StyledTableCell>
              ))}
              <StyledTableCell align="center">ACTIONS</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.map((item) => (
              <StyledTableRow>
                {item.name ? (
                  <StyledTableCell align="center">{item.name}</StyledTableCell>
                ) : null}
                {item.vjudge_handle ? (
                  <StyledTableCell align="center">
                    {item.vjudge_handle}
                  </StyledTableCell>
                ) : null}
                {item.email ? (
                  <StyledTableCell align="center">{item.email}</StyledTableCell>
                ) : null}
                {item.level ? (
                  <StyledTableCell align="center">{item.level}</StyledTableCell>
                ) : null}
                {item.mentor_name ? (
                  <StyledTableCell align="center">
                    {item.mentor_name}
                  </StyledTableCell>
                ) : null}
                {item.enrolled ? (
                  <StyledTableCell align="center">
                    {item.enrolled ? <p> Yes </p> : <p> No </p>}
                  </StyledTableCell>
                ) : null}
                <StyledTableCell className="space-x-4" align="center">
                  <button>
                    <CreateIcon />
                  </button>
                  <button>
                    <DeleteIcon />
                  </button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <div className="flex flex-col md:hidden">
              {users.map((user) => (
                <div className="flex flex-col border-b-2 py-2">
                  <strong>{user.createdAt.substring(0, 10)}</strong>
                  <strong>ID: {user._id}</strong>
                  <div>TOTAL: {user.firstName}</div>
                  <div>PAID: {user.lastName}</div>
                  <div>DELIVERED: {user.email}</div>
                  <div>
                    <button
                      className="px-6 py-2 text-white bg-teal-500 rounded my-2"
                      onClick={() => {
                        navigate(`/user/${user._id}`);
                      }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div> */}
    </div>
  );
}
