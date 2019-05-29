/* eslint-disable no-undef */

import { BASE_URL, common_headers, token_name } from './constants.js';

// step 1: get a signed URL
export const retrieve_signed_url = async (id, filetype) => {
    const url = `${BASE_URL}/users/${id}/photo/upload`;
    const headers = {
        filetype,
        'x-access-token': localStorage[token_name()]
    };
    try {
        const { data, status } = await axios.get(url, { headers } );
        if (status === 200) return data.signed_url;
    }
    catch (e) {
        const { response } = e;
        const { data, status } = response;
        console.log(`${JSON.stringify(data)}, \n ${status}`);
    }
};

// step 2. Upload to AWS S3 bucket   
export const upload_to_aws = async (id, file, signed_url) => {
    const config = {
        headers: { ...common_headers,
            'Content-Type': file.type, 
        },
        onUploadProgress: progressEvent => {
            const { loaded, total } = progressEvent;
            console.log(`loaded: ${loaded}, total: ${total}`);
        }
    };

    try {
        const resp = await axios.put(signed_url, file, config);
        if (resp.status === 200) {
            const bucket = 'quick-credit';
            const folder = 'profile_photos';
            const endpoint = 's3.eu-west-2.amazonaws.com';
            const aws_url = `https://${endpoint}/${bucket}/${folder}/${id}`;
            return aws_url;
        }
    }
    catch (e) {
        const { response } = e;
        const { data, status } = response;
        console.log(`${JSON.stringify(data)}, \n ${status}`);
    }
};

// step 3. Update photo in db
export const update_photo_in_db = async (id, photo_url) => {
    const url = `${BASE_URL}/users/${id}/photo/update`;
    const body = { photo_url };
    const config = {
        headers: { ...common_headers, },
    };
    const { data } = await axios.patch(url, body, config);
    const user = data.data;
    return user;
};
