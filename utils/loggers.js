import debug from 'debug';
export const dev_logger = message => (debug('dev')(message));
export const test_logger = message => (debug('test')(message));
