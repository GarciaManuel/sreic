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
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@material-ui/core';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default ({ drizzle, drizzleState }) => {
  const { SetNotification, SetMessage } = React.useContext(AppStateContext);
  const [votersAddresses, setVotersAddresses] = useState([]);
  const [votersDistricts, setVotersDistricts] = useState([]);
  const [voterAddress, setVoterAddress] = useState('');
  const [voterDistrict, setVoterDistrict] = useState(-1);
  const [touched, setTouched] = useState({
    voterAddress: false,
    voterDistrict: false,
  });
  const { handleSubmit } = useForm();
  const contractMethods = drizzle.contracts.ProposalContract.methods;

  const addVoterAddress = (voterAddr, voterDist) => {
    if (voterAddr !== '' && voterDist !== -1) {
      setVotersAddresses([...votersAddresses, voterAddr]);
      setVotersDistricts([...votersDistricts, voterDist]);
      setTouched((touched) => ({
        voterAddress: false,
        voterDistrict: false,
      }));
    } else {
      SetNotification('error');
      SetMessage(
        'Favor de rellenar los campos correctamente para agregar el votante'
      );
      setTouched({
        voterAddress: true,
        voterDistrict: true,
      });
    }
  };

  const onSubmit = async () => {
    try {
      contractMethods
        .defineVoters(votersAddresses, votersDistricts)
        .send()
        .then(() => {
          SetNotification('success');
          SetMessage('Los votantes se ha registrado correctamente.');
          setVotersAddresses([]);
          setVotersDistricts([]);
          setVoterAddress('');
          setVoterDistrict(-1);
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
                setTouched((touched) => ({
                  ...touched,
                  voterAddress: true,
                }));
                setVoterAddress(event.target.value);
              }}
              error={
                (voterAddress.length === 0 || voterAddress === '') &&
                touched['voterAddress']
                  ? true
                  : false
              }
              helperText={
                (voterAddress.length === 0 || voterAddress === '') &&
                touched['voterAddress']
                  ? 'Agrega una direccion de wallet'
                  : ''
              }
            />

            <FormControl variant="outlined" fullWidth={true}>
              <InputLabel id="districtlabel">Distrito</InputLabel>
              <Select
                labelId="districtlabel"
                id="district"
                value={voterDistrict}
                onChange={(event) => {
                  setTouched((touched) => ({
                    ...touched,
                    voterDistrict: true,
                  }));
                  setVoterDistrict(event.target.value);
                }}
                label="Distrito"
                error={
                  (voterDistrict < 1 ||
                    voterDistrict > 20 ||
                    voterDistrict === undefined) &&
                  touched['voterDistrict']
                    ? true
                    : false
                }
              >
                <MenuItem value={-1} key={-1}>
                  Selecciona un distrito
                </MenuItem>
                {[...Array(19)].map((val, i) => (
                  <MenuItem value={i + 1} key={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              sx={{ mt: 1, mr: 1 }}
              variant="outlined"
              onClick={() => {
                addVoterAddress(voterAddress, voterDistrict);
                setVoterAddress('');
                setVoterDistrict(-1);
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
                      <ListItemText
                        primary={
                          <React.Fragment>
                            {voterAddr} - {votersDistricts[i]}
                          </React.Fragment>
                        }
                      ></ListItemText>
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
