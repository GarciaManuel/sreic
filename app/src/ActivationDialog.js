import * as React from 'react';
import { AppStateContext } from './AppStateProvider';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import politicalParties from './PoliticalParties';

export default ({
  drizzle,
  drizzleState,
  open,
  currentCandidate,
  handleClose,
}) => {
  const { SetNotification, SetMessage } = React.useContext(AppStateContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      drizzle.contracts.ProposalContract.methods
        .changeActivenessCandidate(currentCandidate.index)
        .send()
        .then(() => {
          SetNotification('success');
          SetMessage('El cambio de estado del candidato ha sido realizado.');
          handleClose();
        })
        .catch(function (error) {
          if (error.code === -32603) {
            SetNotification('error');
            SetMessage(
              'El cambio de estado del candidato no pudo ser completado.'
            );
          } else {
            SetNotification('warning');
            SetMessage('Has cancelado el cambio de estado del candidato.');
          }
          handleClose();
        });
    } catch (error) {
      SetNotification('error');
      SetMessage(
        'Hubo un error durante la ejecución del cambio de estado del candidato, intenta más tarde.'
      );
      handleClose();

      console.log('error');
    }
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {currentCandidate.active
            ? 'Desactivación de candidato'
            : 'Activación de candidato'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Estás por modificar el estado del candidato {currentCandidate.name}{' '}
            del partido {politicalParties[currentCandidate.party]}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
