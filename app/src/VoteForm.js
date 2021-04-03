import * as React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import { AppStateContext } from './AppStateProvider';
import { newContextComponents } from '@drizzle/react-components';

export default ({ drizzle, drizzleState }) => {
  const { ContractData } = newContextComponents;
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
        .vote(submitValue)
        .send()
        .then(() => {
          SetNotification('success');
          SetMessage(
            'La votación fue realizada con éxito, se ha registrado tu participación.'
          );
        })
        .catch(function (error) {
          if (error.code === -32603) {
            SetNotification('error');
            SetMessage(
              'La votación no pudo ser completada ya que has participado previamente.'
            );
          } else {
            SetNotification('warning');
            SetMessage('Has cancelado tu participación en la votación.');
          }
        });
    } catch (error) {
      SetNotification('error');
      SetMessage(
        'Hubo un error durante la ejecución del contrato en la red, intenta más tarde.'
      );
      console.log('error');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" error={error}>
          <h2>Votación para la propuesta: </h2>

          <FormLabel>
            <ContractData
              drizzle={drizzle}
              drizzleState={drizzleState}
              contract="ProposalContract"
              method="proposal_description"
            />
          </FormLabel>
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
