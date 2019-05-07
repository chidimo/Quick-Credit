export default class utils {

    static get_random_id () {
        return Math.random().toString(36).substr(-10);
    }
}
