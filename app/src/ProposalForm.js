import * as React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { AppStateContext } from './AppStateProvider';
import { Button, TextField } from '@material-ui/core';
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
  const [description, setDescription] = useState('');
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
    if ((await contractMethods.document_hash().call()) === '') {
      try {
        const submission = await ipfs.add(storageFile);
        contractMethods
          .store(description, submission.path)
          .send()
          .then(() => {
            SetNotification('success');
            SetMessage(
              'La propuesta fue compartida con éxito, se ha registrado correctamente.'
            );
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
    } else {
      SetNotification('error');
      SetMessage('Esta acción no puede continuarse.');
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
            label="Descripción / Nombre de la propuesta"
            id="name"
            name="name"
            type="text"
            value={description}
            onChange={changeDescription}
            error={description.length === 0 ? true : false}
            helperText={
              description.length === 0 ? 'Agrega una descripción' : ''
            }
          />
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
