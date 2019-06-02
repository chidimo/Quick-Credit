// source: https://github.com/davesag/mock-req-res

import { stub, spy } from 'sinon';

export const mockRequest = (options = {}) => ({
    body: {},
    cookies: {},
    query: {},
    params: {},
    headers: {},
    get: stub(),
    ...options
});

export const mockResponse = (options = {}) => {
    const res = {
        cookie: spy(),
        clearCookie: spy(),
        download: spy(),
        format: spy(),
        getHeader: spy(),
        json: spy(),
        jsonp: spy(),
        send: spy(),
        sendFile: spy(),
        sendStatus: spy(),
        setHeader: spy(),
        redirect: spy(),
        render: spy(),
        end: spy(),
        set: spy(),
        type: spy(),
        get: stub(),
        ...options
    };
    res.status = stub().returns(res);
    res.vary = stub().returns(res);
    return res;
};
