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
  Alert,
  TextareaAutosize,
} from '@material-ui/core';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

export default ({ drizzle, drizzleState, candidateDistrict }) => {
  const { SetNotification, SetMessage } = React.useContext(AppStateContext);
  const [storageFile, setStorageFile] = useState(null);
  const [name, setName] = useState('');
  const [district, setDistrict] = useState(candidateDistrict);
  const [description, setDescription] = useState('');
  const [period, setPeriod] = useState('');
  const [touched, setTouched] = useState({
    name: false,
    description: false,
    period: false,
    district: false,
  });
  const { handleSubmit } = useForm();
  const contractMethods = drizzle.contracts.ProposalContract.methods;

  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setStorageFile(Buffer(reader.result));
    };
  };

  const onSubmit = async () => {
    try {
      const submission = await ipfs.add(storageFile);
      contractMethods
        .createProposal(
          name,
          description,
          String(period),
          submission.path,
          district
        )
        .send()
        .then(() => {
          SetNotification('success');
          SetMessage(
            'La propuesta fue compartida con éxito, se ha registrado correctamente.'
          );
          setStorageFile(null);
          setName('');
          setDescription('');
          setPeriod('');
          setTouched({
            name: false,
            description: false,
            period: false,
            district: false,
          });
        })
        .catch(function (error) {
          if (error.code === -32603) {
            SetNotification('error');
            SetMessage('Ocurrio un error inesperado' + String(error));
          } else {
            SetNotification('warning');
            SetMessage('Has cancelado tu registro de propuesta.');
          }
        });
    } catch (error) {
      SetNotification('error');
      SetMessage('Favor de llenar correctamente todos los campos.');
      setTouched({
        name: true,
        description: true,
        period: true,
        district: false,
      });
      console.log('error');
    }
  };

  const changeDescription = (event) => {
    setTouched((touched) => ({
      ...touched,
      description: true,
    }));
    setDescription(event.target.value);
  };

  var districtSelect = [];
  districtSelect.push(
    <MenuItem value={-1} key={-1}>
      Selecciona un distrito
    </MenuItem>
  );
  districtSelect.push(
    <MenuItem value={0} key={0}>
      Todos los distritos
    </MenuItem>
  );
  [...Array(19)].map((val, i) =>
    districtSelect.push(
      <MenuItem value={i + 1} key={i + 1}>
        {i + 1}
      </MenuItem>
    )
  );
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl component="fieldset">
          <h2>Compartir propuesta </h2>

          <FormLabel sx={{ mb: 3 }}>
            Presenta tu idea para que la ciudadanía comparta su opinión.
          </FormLabel>
          <Alert severity="info" sx={{ mb: 3 }}>
            El documento de respaldo de la propuesta debe cumplir con el formato
            indicado.
          </Alert>
          <TextField
            sx={{ mb: 2 }}
            label="Nombre de la propuesta"
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
              console.log(touched, name);
            }}
            error={name === '' && touched['name'] ? true : false}
            helperText={name.length === 0 ? 'Agrega un nombre' : ''}
          />
          <TextareaAutosize
            sx={{ mb: 2 }}
            style={{ height: 150 }}
            aria-label="Breve descripción"
            placeholder="Breve descripción"
            id="description"
            name="description"
            type="text"
            value={description}
            onChange={changeDescription}
          />
          <FormControl variant="outlined" sx={{ mt: 2, mb: 2 }}>
            <InputLabel id="periodlabel">Periodo</InputLabel>
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
                (period < 2000 || period > 2022) && touched['period']
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
          <FormControl variant="outlined" fullWidth={true}>
            <InputLabel id="districtlabel">
              Distrito(s) al que corresponde
            </InputLabel>
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
              label="Distrito al que corresponde"
              error={
                (district < 0 || district > 20 || district === undefined) &&
                touched['district']
                  ? true
                  : false
              }
            >
              {candidateDistrict === 0 ? (
                districtSelect
              ) : (
                <MenuItem value={candidateDistrict} key={candidateDistrict}>
                  {candidateDistrict}
                </MenuItem>
              )}
            </Select>
          </FormControl>
          <Button variant="contained" component="label" sx={{ mt: 1 }}>
            {storageFile === null
              ? 'Cargar documento de respaldo de propuesta'
              : 'Archivo cargado'}
            <input type="file" onChange={captureFile} hidden />
          </Button>

          <Button sx={{ mt: 1 }} type="submit" variant="outlined">
            Enviar propuesta
          </Button>
        </FormControl>
      </form>
    </>
  );
};
