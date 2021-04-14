import * as React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import { AppStateContext } from './AppStateProvider';
import {
  Button,
  TextField,
  FormControl,
  List,
  Divider,
  ListItemText,
  Grid,
} from '@material-ui/core';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default ({ drizzle, drizzleState }) => {
  const { SetNotification, SetMessage } = React.useContext(AppStateContext);
  const [votersAddresses, setVotersAddresses] = useState([]);
  const [voterAddress, setVoterAddress] = useState('');

  const { handleSubmit } = useForm();
  const contractMethods = drizzle.contracts.ProposalContract.methods;

  const addVoterAddress = (voterAddr) => {
    if (voterAddr !== '') setVotersAddresses([...votersAddresses, voterAddr]);
  };

  const onSubmit = async () => {
    try {
      contractMethods
        .defineVoters(votersAddresses)
        .send()
        .then(() => {
          SetNotification('success');
          SetMessage('Los votantes se ha registrado correctamente.');

          setVotersAddresses([]);
          setVoterAddress('');
        })
        .catch(function (error) {
          if (error.code === -32603) {
            SetNotification('error');
            SetMessage('Ocurrio un error inesperado' + String(error));
          } else {
            SetNotification('warning');
            SetMessage('Has cancelado tu registro de votantes.');
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
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl component="fieldset">
            <h2>Agregar votantes </h2>

            <FormLabel sx={{ mb: 3 }}>
              Agrega los votantes necesarios y al estar listo confirmalo.
            </FormLabel>
            <TextField
              sx={{ mb: 2 }}
              label="Direccion del wallet del votante"
              id="voterAddress"
              name="voterAddress"
              type="text"
              value={voterAddress}
              onChange={(event) => {
                setVoterAddress(event.target.value);
              }}
              error={
                voterAddress.length === 0 || voterAddress === '' ? true : false
              }
              helperText={
                voterAddress.length === 0 || voterAddress === ''
                  ? 'Agrega una direccion de wallet'
                  : ''
              }
            />
            <Button
              sx={{ mt: 1, mr: 1 }}
              variant="outlined"
              onClick={() => {
                addVoterAddress(voterAddress);
                setVoterAddress('');
              }}
            >
              Agregar
            </Button>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={6}
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
        >
          {votersAddresses.length > 0 ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl component="fieldset">
                <h2>Votantes agregados</h2>

                <FormLabel sx={{ mb: 3 }}>
                  Lista de votantes deseados a registrar.
                </FormLabel>
                <List style={{ maxHeight: 500, overflow: 'auto' }}>
                  {votersAddresses.map((voterAddr, i) => (
                    <div key={i}>
                      <Divider variant="inset" component="li" />
                      <ListItemText primary={voterAddr}></ListItemText>
                    </div>
                  ))}
                </List>
                <Button
                  sx={{ mt: 1, mr: 1 }}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Registrar los votantes
                </Button>
              </FormControl>
            </form>
          ) : (
            ''
          )}
        </Grid>
      </Grid>
    </>
  );
};
