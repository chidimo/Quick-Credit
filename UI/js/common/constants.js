export const BASE_URL = 'https://qcredit.herokuapp.com/api/v1';
// export const BASE_URL = 'http://localhost:3000/api/v1';

export const token_name = () => {
    if (BASE_URL.includes('local')) {
        return 'localQCtoken';
    }
    return 'webQCtoken';
};

export const common_headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PUT, GET, PATCH, POST',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3000',
    'x-access-token': localStorage[token_name()]
};
