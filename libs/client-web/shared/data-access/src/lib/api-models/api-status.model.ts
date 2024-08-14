export type ApiStatus = 'idle' | 'loading' | 'ok' | { error: string };

export const isErrorStatus = (status: ApiStatus) => {
  return typeof status !== 'string' && 'error' in status;
};

export const getErrorMessage = (status: ApiStatus) => {
  return typeof status !== 'string' && 'error' in status ? status.error : null;
};
