import React from 'react';
import {
  Divider,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Grid,
} from '@material-ui/core';

export default ({ proposalInfo, handleOpen }) => {
  return (
    <>
      <Divider variant="inset" component="li" />
      <Grid alignItems="flex-start">
        <ListItem>
          <ListItemText
            primary={
              <React.Fragment>
                <a
                  href={`https://ipfs.infura.io/ipfs/${proposalInfo.document_hash}`}
                >
                  {proposalInfo.name}
                </a>
              </React.Fragment>
            }
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  Reputación : {proposalInfo.reputation}
                </Typography>
                {'   -   ' +
                  proposalInfo.description +
                  ' Perteneciente al periodo ' +
                  proposalInfo.period +
                  '. Han participado  ' +
                  proposalInfo.votes +
                  ' ciudadanos.'}
              </React.Fragment>
            }
          />
        </ListItem>
        <ListItem>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Votar
          </Button>
        </ListItem>
      </Grid>
    </>
  );
};
