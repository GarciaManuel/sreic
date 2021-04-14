import * as React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import { AppStateContext } from './AppStateProvider';
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
} from '@material-ui/core';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default ({ drizzle, drizzleState }) => {
  const { SetNotification, SetMessage } = React.useContext(AppStateContext);
  const [canAddress, setCanAddress] = useState('');
  const [district, setDistrict] = useState(undefined);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [party, setParty] = useState(undefined);
  const [period, setPeriod] = useState(undefined);
  const { handleSubmit } = useForm();
  const contractMethods = drizzle.contracts.ProposalContract.methods;

  const onSubmit = async () => {
    try {
      contractMethods
        .createCandidate(
          canAddress,
          name,
          party,
          String(period),
          email,
          district
        )
        .send()
        .then(() => {
          SetNotification('success');
          SetMessage('El candidato se ha registrado correctamente.');

          setCanAddress('');
          setDistrict(undefined);
          setEmail('');
          setName('');
          setParty(undefined);
          setPeriod(undefined);
        })
        .catch(function (error) {
          if (error.code === -32603) {
            SetNotification('error');
            SetMessage('Ocurrio un error inesperado' + String(error));
          } else {
            SetNotification('warning');
            SetMessage('Has cancelado tu registro de candidato.');
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

  const politicalParties = {
    0: 'PRI',
    1: 'PAN',
    2: 'PRD',
    3: 'PT',
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl component="fieldset">
          <h2>Crear candidato </h2>

          <FormLabel sx={{ mb: 3 }}>
            Da de alta al representate publico en la siguiente forma.
          </FormLabel>
          <TextField
            sx={{ mb: 2 }}
            label="Direccion del wallet"
            id="canAddress"
            name="canAddress"
            type="text"
            value={canAddress}
            onChange={(event) => {
              setCanAddress(event.target.value);
            }}
            error={
              canAddress.length === 0 || canAddress === undefined ? true : false
            }
            helperText={
              canAddress.length === 0 || canAddress === undefined
                ? 'Agrega una direccion de wallet'
                : ''
            }
          />
          <TextField
            sx={{ mb: 2 }}
            label="Nombre completo"
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            error={name.length === 0 || name === undefined ? true : false}
            helperText={
              name.length === 0 || name === undefined ? 'Agrega un nombre' : ''
            }
          />

          <TextField
            sx={{ mb: 2 }}
            label="Email"
            id="email"
            name="email"
            type="text"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            error={email.length === 0 || email === undefined ? true : false}
            helperText={
              email.length === 0 || email === undefined ? 'Agrega un email' : ''
            }
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl variant="outlined" fullWidth={true}>
                <InputLabel id="periodlabel">Año de registro</InputLabel>
                <Select
                  labelId="periodlabel"
                  id="period"
                  value={period}
                  onChange={(event) => {
                    setPeriod(event.target.value);
                  }}
                  label="Periodo"
                  error={
                    period < 2000 || period > 2022 || period === undefined
                      ? true
                      : false
                  }
                >
                  {[...Array(12)].map((val, i) => (
                    <MenuItem value={2000 + 2 * i} key={i}>
                      {2000 + 2 * i}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="outlined" fullWidth={true}>
                <InputLabel id="districtlabel">Distrito</InputLabel>
                <Select
                  labelId="districtlabel"
                  id="district"
                  value={district}
                  onChange={(event) => {
                    setDistrict(event.target.value);
                  }}
                  label="Distrito"
                  error={
                    district < 0 || district > 20 || district === undefined
                      ? true
                      : false
                  }
                >
                  {[...Array(20)].map((val, i) => (
                    <MenuItem value={i} key={i}>
                      {i}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <FormControl variant="outlined" sx={{ mt: 2, mb: 2 }}>
            <InputLabel id="partylabel">
              Partido al que pertenece {party}
            </InputLabel>
            <Select
              labelId="partylabel"
              id="party"
              value={politicalParties[party]}
              onChange={(event) => {
                setParty(event.target.value);
              }}
              label="Partido"
              error={
                politicalParties[party] === undefined || party === undefined
                  ? true
                  : false
              }
            >
              {Object.entries(politicalParties).map(([key, value]) => (
                <MenuItem value={key} key={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
            Registrar
          </Button>
        </FormControl>
      </form>
    </>
  );
};
