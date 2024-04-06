export interface ResponseError extends Error {
  error: {
    error: string;
    message: string;
    statusCode: number;
  };
}
