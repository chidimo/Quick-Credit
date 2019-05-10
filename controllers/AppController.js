const AppController = {

    index: (req, res) => {
        res.render('index', { title: 'Welcome' });
    },

    about: (req, res) => {
        res.render('about', { title: 'About' });
    },
};

export default AppController;
