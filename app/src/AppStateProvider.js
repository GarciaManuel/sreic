import React from 'react';
import Alert from '@material-ui/core/Alert';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export const AppStateContext = React.createContext(null);

export default function AppStateProvider({ children }) {
  const [notification, SetNotification] = React.useState(null);
  const [message, SetMessage] = React.useState('');

  const state = {
    SetNotification: SetNotification,
    SetMessage: SetMessage,
  };

  //   useEffect(() => {
  //     if (message !== undefined) alert(message);
  //   }, [message]);
  const clearNotification = () => {
    SetNotification(null);
    SetMessage('');
  };

  const renderAlert = () => {
    if (notification !== null)
      return (
        <Alert
          severity={notification}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={clearNotification}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      );
  };
  return (
    <AppStateContext.Provider value={state}>
      {renderAlert()}
      {children}
    </AppStateContext.Provider>
  );
}
