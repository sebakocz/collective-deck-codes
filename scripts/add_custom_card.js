const axios = require('axios').default;
const fs = require('fs');
require('dotenv').config()

let cards = []
fs.readFile('scripts/import_list.txt', 'utf8', (err, data) => {
    if (err) throw err
    console.log('OK')

    data.split(/\r?\n/).forEach(line =>  {
        cards.push({
            id: line.slice(2)
        })
    });

    axios({
        method: 'POST',
        url: 'http://localhost:3000/api/admin/cards/add',
        headers: {
            authorization: 'Bearer ' + process.env.ACTION_KEY_ADD_CARD
        },
        data: {
            cards: cards,
            state: 8
        }
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
})
