import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Dialog, Typography } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import VoteForm from './VoteForm';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default ({
  drizzle,
  drizzleState,
  open,
  handleClose,
  currentProposal,
}) => {
  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {currentProposal.name}
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>{currentProposal.description}</Typography>
          <Typography gutterBottom>
            Actualmente: {currentProposal.positive}✓ {currentProposal.neutral}⊝{' '}
            {currentProposal.negative}ｘ
          </Typography>
          <VoteForm
            drizzle={drizzle}
            drizzleState={drizzleState}
            proposalIndex={currentProposal.index}
            handleClose={handleClose}
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Salir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
