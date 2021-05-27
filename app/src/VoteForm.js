import * as React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/core/Alert';
import { AppStateContext } from './AppStateProvider';

export default ({ drizzle, drizzleState, proposalIndex, handleClose }) => {
  const { SetNotification, SetMessage } = React.useContext(AppStateContext);
  const [value, setValue] = React.useState('0');
  const [error, setError] = React.useState(false);

  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let submitValue = parseInt(value);
    try {
      drizzle.contracts.ProposalContract.methods
        .voteProposal(proposalIndex, submitValue)
        .send()
        .then(() => {
          SetNotification('success');
          SetMessage(
            'La votación fue realizada con éxito, se ha registrado tu participación.'
          );
          handleClose();
        })
        .catch(function (error) {
          if (error.code === -32603) {
            SetNotification('error');
            SetMessage(
              'La votación no pudo ser completada ya que o has participado previamente, o no eres parte del distrito de la propuesta.'
            );
          } else {
            SetNotification('warning');
            SetMessage('Has cancelado tu participación en la votación.');
          }
          handleClose();
        });
    } catch (error) {
      SetNotification('error');
      SetMessage(
        'Hubo un error durante la ejecución del contrato en la red, intenta más tarde.'
      );
      handleClose();

      console.log('error');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" error={error}>
          <h4>Votación para la propuesta: </h4>
          <Alert severity="info">
            Solo podrás votar las propuesta de candidaturas referentes a todo el
            estado y las de tu distrito.
          </Alert>
          <RadioGroup
            aria-label="voting"
            name="voting"
            value={value}
            onChange={handleRadioChange}
          >
            <FormControlLabel value="1" control={<Radio />} label="A favor" />
            <FormControlLabel value="0" control={<Radio />} label="Neutral" />
            <FormControlLabel
              value="-1"
              control={<Radio />}
              label="En contra"
            />
          </RadioGroup>
          <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
            Enviar voto
          </Button>
        </FormControl>
      </form>
    </>
  );
};
