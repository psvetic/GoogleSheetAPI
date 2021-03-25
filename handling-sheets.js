const { google } = require('googleapis');
const keys = require('./keys.json');
const fetch = require('node-fetch');

const companyData = require('./public/companyData.json');
const getText = require('./public/num-to-text');

const router = require('./routes/routes');

// https://console.developers.google.com/

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key, ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize(function(err, tokens) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log('Connected!');
    }
});

async function gsrun(date, amount, co) {

    // ovdje zalijepi ID Sheet-a
    let userID = 'IDGoogleSheetDoc';

    // READING

    const gsapi = google.sheets({ version: 'v4', auth: client });

    const options = {
        spreadsheetId: userID,
        range: 'Baza faktura!A3:A30'
    };

    let data = await gsapi.spreadsheets.values.get(options);

    // pročitaj zadni broj računa i generiraj idući
    let billNumber = data.data.values[data.data.values.length - 1][0];
    billNumber = billNumber.substr(0, billNumber.length - 1) + (parseInt(billNumber.substr(billNumber.length - 1, 1)) + 1);

    // zapis racuna pocinje na A3, iduci treba zapisati na zadnji + 3
    let nextRow = data.data.values.length + 3;

    const selectedCompany = companyData.companies.find(company => company.key === co);

    // WRITING

    let inputRange = 'Baza faktura!A' + nextRow + ':P' + nextRow;

    const updateOptions = {
        spreadsheetId: userID,
        range: inputRange,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [
                [
                    billNumber,
                    selectedCompany["2"],
                    selectedCompany["3"],
                    selectedCompany["4"],
                    selectedCompany["5"],
                    selectedCompany["6"],
                    date,
                    selectedCompany["8"],
                    selectedCompany["9"],
                    amount,
                    '',
                    amount,
                    getText(amount),
                    selectedCompany["13"],
                    date,
                    '/',
                ]
            ]
        }
    };

    let res = await gsapi.spreadsheets.values.update(updateOptions);

}

function getTodayDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

function getRateOnDate(date, curr) {
    return new Promise((resolve, reject) => {
        fetch("http://api.hnb.hr/tecajn/v1?datum=" + date)
            .then(resp => resp.json())
            .then(data => {
                data.forEach(rate => {
                    if (rate.Valuta == curr) {
                        resolve(rate['Srednji za devize']);
                    }
                });
            })
    })
}

module.exports = { getRateOnDate, gsrun };