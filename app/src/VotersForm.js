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
  Alert,
} from '@material-ui/core';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import VotersTable from './VotersTable';
var WAValidator = require('wallet-address-validator');

export default ({ drizzle, drizzleState }) => {
  const { SetNotification, SetMessage } = React.useContext(AppStateContext);
  const [votersDict, setVotersDict] = useState({});
  const [votersDictKeys, setVotersDictKeys] = useState({});
  const [rows, setRows] = useState([]);
  const [voterAddress, setVoterAddress] = useState('');
  const [voterKey, setVoterKey] = useState('');
  const [voterDistrict, setVoterDistrict] = useState(-1);
  const [touched, setTouched] = useState({
    voterAddress: false,
    voterDistrict: false,
    voterKey: false,
  });
  const { handleSubmit } = useForm();
  const contractMethods = drizzle.contracts.ProposalContract.methods;

  const addVoterAddress = (voterAddr, voterDist) => {
    if (
      voterAddr !== '' &&
      voterDist !== -1 &&
      voterKey.length === 18 &&
      WAValidator.validate(voterAddr, 'ETH')
    ) {
      votersDict[`${voterAddr}`] = voterDist;
      votersDictKeys[`${voterAddr}`] = voterKey;
      setTouched({
        voterAddress: false,
        voterDistrict: false,
        voterKey: false,
      });
      setRows(createDataFromDict(votersDict, votersDictKeys));
    } else {
      SetNotification('error');
      SetMessage(
        'Favor de rellenar los campos correctamente para agregar el votante y asegurarse que el número de wallet es correcto y pertenece a la divisa de ETH'
      );
      setTouched({
        voterAddress: true,
        voterDistrict: true,
        voterKey: true,
      });
    }
  };

  const onSubmit = async () => {
    try {
      contractMethods
        .defineVoters(
          Object.keys(votersDict),
          Object.values(votersDict),
          Object.values(votersDictKeys)
        )
        .send()
        .then(() => {
          SetNotification('success');
          SetMessage('Los votantes se ha registrado correctamente.');
          setVotersDict({});
          setVotersDictKeys({});

          setVoterAddress('');
          setVoterDistrict(-1);
          setVoterKey('');
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
      setVotersDictKeys({});
    } else {
      voters.forEach((address) => {
        delete votersDict[address];
        delete votersDictKeys[address];
      });
    }
    setRows(createDataFromDict(votersDict, votersDictKeys));
  };

  const createDataFromDict = (dict, dictKeys) => {
    var rows = [];
    for (var key in dict) {
      rows.push({
        walletNumber: key,
        electionKey: dictKeys[key],
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
            <h2>Agregar y editar votantes </h2>

            <FormLabel sx={{ mb: 3 }}>
              Agrega o edita los votantes necesarios y al termianr registra la
              acción.
            </FormLabel>
            <Alert severity="info" sx={{ mb: 3 }}>
              Cualquier votante que se agregué y que ya haya sido dado de alta
              previamente será actualizado a la información proporcionada.
            </Alert>
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
                (voterAddress.length === 0 ||
                  voterAddress === '' ||
                  !WAValidator.validate(voterAddress, 'ETH')) &&
                touched['voterAddress']
                  ? true
                  : false
              }
              helperText={
                (voterAddress.length === 0 ||
                  voterAddress === '' ||
                  !WAValidator.validate(voterAddress, 'ETH')) &&
                touched['voterAddress']
                  ? 'Agrega una direccion de wallet'
                  : ''
              }
            />
            <TextField
              sx={{ mb: 2 }}
              label="Clave de elector"
              id="voterKey"
              name="voterKey"
              type="text"
              value={voterKey}
              onChange={(event) => {
                setTouched((touched) => ({
                  ...touched,
                  voterKey: true,
                }));
                setVoterKey(event.target.value.toUpperCase());
              }}
              error={
                (voterKey.length === 0 ||
                  voterKey === '' ||
                  voterKey.length !== 18) &&
                touched['voterKey']
                  ? true
                  : false
              }
              helperText={
                (voterKey.length === 0 ||
                  voterKey === '' ||
                  voterKey.length !== 18) &&
                touched['voterKey']
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
                setVoterKey('');
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
