const get_random_id = () => {
    return Math.random().toString(36).substr(-10);
};

const generate_token = (email, password) => {
    // todo -> use email and password to generate JWT
    return Math.random().toString(36).substr(-8) + email + password;
};

module.exports = {
    get_random_id,
    generate_token,
};
