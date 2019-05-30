import sgMail from '@sendgrid/mail';
import Settings from '../settings';

sgMail.setApiKey(Settings.sendgridKey);

const templates = {
    new_password          : 'd-af4dcbb73450412480a3ed50ea04b344',
    new_loan_application  : 'd-a16e6d41d94c409aa99d36fa10222b25',
    loan_status           : 'd-e3eff2cb80e0435eaef5652dbbc58338',
    password_reset        : 'd-2364cc4d56294b8588358075b71d3061',
    confirm_account       : 'd-bcac2e75ba5f46bf8e3b18265e9c84ef'
};

const Messenger = {
    sendEmail: (data, template_data) => {
        const msg = {
            to: data.email,
            from: 'qcredit@herokuapp.com',
            templateId: templates[data.template_name],
            dynamic_template_data : { 
                ...template_data
            }
        };
        
        sgMail.send(msg, (err, result) => {
            if (err) return err;
            return result;
        });
    },
};
export default Messenger;
