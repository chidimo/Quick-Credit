import bcrypt from 'bcrypt';

const hashPassword = password => (bcrypt.hashSync(password, 8));

export default hashPassword;
