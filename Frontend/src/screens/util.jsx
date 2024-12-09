export const getError = (error) => {
    // Check if the error has a response and a message in the response data, otherwise return the general error message
    return error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : error.message;
  };
  