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

export default ({ drizzle, drizzleState }) => {
  const { SetNotification, SetMessage } = React.useContext(AppStateContext);
  const [storageFile, setStorageFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [period, setPeriod] = useState('');
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
        .createProposal(name, description, String(period), submission.path)
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
      SetMessage(
        'Hubo un error durante la ejecución del contrato en la red, intenta más tarde.'
      );
      console.log('error');
    }
  };

  const changeDescription = (event) => {
    setDescription(event.target.value);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl component="fieldset">
          <h2>Compartir propuesta </h2>

          <FormLabel sx={{ mb: 3 }}>
            Presenta tu idea para que la ciudadanía comparta su opinión.
          </FormLabel>

          <TextField
            sx={{ mb: 2 }}
            label="Nombre de la propuesta"
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            error={name.length === 0 ? true : false}
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
                setPeriod(event.target.value);
              }}
              label="Periodo"
              error={period < 2000 || period > 2022 ? true : false}
            >
              {[...Array(12)].map((val, i) => (
                <MenuItem value={2000 + 2 * i} key={i}>
                  {2000 + 2 * i}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" component="label">
            {storageFile === null
              ? 'Cargar documento de respaldo de propuesta'
              : 'Archivo cargado'}
            <input type="file" onChange={captureFile} hidden />
          </Button>

          <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
            Enviar propuesta
          </Button>
        </FormControl>
      </form>
    </>
  );
};
