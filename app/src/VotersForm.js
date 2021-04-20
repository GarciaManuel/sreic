import * as React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import { AppStateContext } from './AppStateProvider';
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@material-ui/core';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import VotersTable from './VotersTable';
var WAValidator = require('wallet-address-validator');

export default ({ drizzle, drizzleState }) => {
  const { SetNotification, SetMessage } = React.useContext(AppStateContext);
  const [votersDict, setVotersDict] = useState({});
  const [rows, setRows] = useState([]);
  const [voterAddress, setVoterAddress] = useState('');
  const [voterDistrict, setVoterDistrict] = useState(-1);
  const [touched, setTouched] = useState({
    voterAddress: false,
    voterDistrict: false,
  });
  const { handleSubmit } = useForm();
  const contractMethods = drizzle.contracts.ProposalContract.methods;

  const addVoterAddress = (voterAddr, voterDist) => {
    if (
      voterAddr !== '' &&
      voterDist !== -1 &&
      WAValidator.validate(voterAddr, 'ETH')
    ) {
      votersDict[`${voterAddr}`] = voterDist;
      setTouched({
        voterAddress: false,
        voterDistrict: false,
      });
      setRows(createDataFromDict(votersDict));
    } else {
      SetNotification('error');
      SetMessage(
        'Favor de rellenar los campos correctamente para agregar el votante y asegurarse que el número de wallet es correcto y pertenece a la divisa de ETH'
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
        .defineVoters(Object.keys(votersDict), Object.values(votersDict))
        .send()
        .then(() => {
          SetNotification('success');
          SetMessage('Los votantes se ha registrado correctamente.');
          setVotersDict({});
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

  const deleteVoters = (voters) => {
    if (voters.length === Object.keys(votersDict).length) {
      setVotersDict({});
    } else {
      voters.forEach((address) => {
        delete votersDict[address];
      });
    }
    setRows(createDataFromDict(votersDict));
  };

  const createDataFromDict = (dict) => {
    var rows = [];
    for (var key in dict) {
      rows.push({
        walletNumber: key,
        district: dict[key],
      });
    }
    return rows;
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
          {Object.keys(votersDict).length !== 0 ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl component="fieldset">
                <VotersTable rows={rows} deleteFunction={deleteVoters} />
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
