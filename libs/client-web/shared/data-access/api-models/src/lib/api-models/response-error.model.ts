export interface ResponseError {
  error: {
    error: string;
    message: string;
    statusCode: number;
  };
}
