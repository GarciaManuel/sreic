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
import politicalParties from './PoliticalParties';

export default ({ drizzle, drizzleState }) => {
  const { SetNotification, SetMessage } = React.useContext(AppStateContext);
  const [canAddress, setCanAddress] = useState('');
  const [district, setDistrict] = useState(-1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [party, setParty] = useState(undefined);
  const [period, setPeriod] = useState(undefined);
  const [touched, setTouched] = useState({
    name: false,
    canAddress: false,
    district: false,
    email: false,
    party: false,
    period: false,
  });
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
          setDistrict(-1);
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
      SetMessage('Favor de llenar correctamente todos los campos.');
      console.log('error');
      setTouched({
        name: true,
        canAddress: true,
        district: true,
        email: true,
        party: true,
        period: true,
      });
    }
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
              setTouched((touched) => ({
                ...touched,
                canAddress: true,
              }));
              setCanAddress(event.target.value);
            }}
            error={
              (canAddress.length === 0 || canAddress === undefined) &&
              touched['canAddress']
                ? true
                : false
            }
            helperText={
              (canAddress.length === 0 || canAddress === undefined) &&
              touched['canAddress']
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
              setTouched((touched) => ({
                ...touched,
                name: true,
              }));
              setName(event.target.value);
            }}
            error={
              (name.length === 0 || name === undefined) && touched['name']
                ? true
                : false
            }
            helperText={
              (name.length === 0 || name === undefined) && touched['name']
                ? 'Agrega un nombre'
                : ''
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
              setTouched((touched) => ({
                ...touched,
                email: true,
              }));
              setEmail(event.target.value);
            }}
            error={
              (email.length === 0 || email === undefined) && touched['email']
                ? true
                : false
            }
            helperText={
              (email.length === 0 || email === undefined) && touched['email']
                ? 'Agrega un email'
                : ''
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
                    setTouched((touched) => ({
                      ...touched,
                      period: true,
                    }));
                    setPeriod(event.target.value);
                  }}
                  label="Periodo"
                  error={
                    (period < 2000 || period > 2022 || period === undefined) &&
                    touched['period']
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
                    setTouched((touched) => ({
                      ...touched,
                      district: true,
                    }));
                    setDistrict(event.target.value);
                  }}
                  label="Distrito"
                  error={
                    (district < 0 || district > 20 || district === undefined) &&
                    touched['district']
                      ? true
                      : false
                  }
                >
                  <MenuItem value={-1} key={-1}>
                    Selecciona un distrito
                  </MenuItem>
                  <MenuItem value={0} key={0}>
                    Todos los distritos
                  </MenuItem>
                  {[...Array(19)].map((val, i) => (
                    <MenuItem value={i + 1} key={i + 1}>
                      {i + 1}
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
                setTouched((touched) => ({
                  ...touched,
                  party: true,
                }));
                setParty(event.target.value);
              }}
              label="Partido"
              error={
                (politicalParties[party] === undefined ||
                  party === undefined) &&
                touched['party']
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
