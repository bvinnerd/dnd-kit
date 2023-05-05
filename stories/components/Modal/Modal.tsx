import React from 'react';
import useStyles, {ThemeProvider} from 'freyja';

import {
  createTheme,
  ThemeProvider as MaterialThemeProvider,
} from '@material-ui/core/styles';

import {Button, IconButton} from '@material-ui/core';
// import ErrorBoundary from './ErrorBoundary.jsx';
import Box from './Box';
import Icon from './Icon';
// import {compose} from '../../../../lib/utils.js';
import theme from './theme';

const styles = () => ({
  wrapper: {
    backgroundColor: '#2D2D2D',
    borderRadius: 4,
    boxShadow: `0 4px 16px '#191919'`,
    maxHeight: '98vh',
    overflowY: 'auto',
    overflowStyle: 'none',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      width: 0,
      background: 'transparent',
    },
  },
  title: {
    color: '#CED0CE',
    fontSize: 18,
  },
});

export const Modal = (props: any) => {
  const style = useStyles(styles);

  const {
    title,
    space = 'xs',
    children,
    disableSave,
    onClose,
    onSave,
    onDelete,
  } = props;

  return (
    <ThemeProvider theme={theme}>
      <MaterialThemeProvider theme={muiTheme}>
        {/* //  <ErrorBoundary boundary={title}> */}
        <Box separator="darker" className={style.wrapper}>
          <Box row split space="xxs" selfV="xs" selfH="s">
            <Box className={style.title}>{title}</Box>
            <IconButton
              size="small"
              color="inherit"
              onClick={onClose}
              data-test={'modal:close'}
            >
              <Icon icon="close" />
            </IconButton>
          </Box>
          <Box space={space} selfV="xs" selfH="s">
            {children}
          </Box>
          {(onSave || onDelete) && (
            <Box row space="xxs" selfV="xs" selfH="s" justify="flex-end">
              {onDelete && (
                <Button
                  startIcon={<Icon icon="remove" />}
                  onClick={() => alert('Delete pressed')}
                  data-test={'modal:delete'}
                >
                  Remove
                </Button>
              )}
              {onSave && (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<Icon icon="done" />}
                  disabled={disableSave}
                  onClick={() => alert('Save pressed')}
                  data-test={'modal:save'}
                >
                  Apply
                </Button>
              )}
            </Box>
          )}
        </Box>
      </MaterialThemeProvider>
    </ThemeProvider>
    //  </ErrorBoundary>
  );
};

const muiTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: theme.color.primary,
    },
    secondary: {
      main: theme.color.secondary,
    },
    error: {
      main: theme.color.bad,
    },
    warning: {
      main: theme.color.warn,
    },
    info: {
      main: theme.color.info,
    },
    success: {
      main: theme.color.good,
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});
