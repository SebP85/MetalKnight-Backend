//Pour parser xml => JSON
/*
const fs = require('fs');
const xml2js = require('xml2js');
const util = require('util');

const parser = new xml2js.Parser();

fs.readFile('example.xml', (err, data) => {
	parser.parseString(data, (err, result) => {
		console.log(util.inspect(result, false, null, true));
	});
});
*/

//Pour Parser xml => object
/*
const xml2js = require('xml2js');
const fs = require('fs');

fs.readFile(__dirname + '/test.xml', function(err, data) {
    if(err) throw new Error(err);

    const parser = new xml2js.Parser();

    parser.parseStringPromise(data)
        .then(function (res){
            console.log(res);
            console.log(res.demo.name);
            console.log(res.demo.content);
        })
        .catch(function (err){
            console.log(err);
        });
});
*/

//Pour parser object => xml
/*
const xml2js = require('xml2js');

const xmlObject = {
    demo: {
        name: {
            _: 'test.xml',
            $: {
                desc: 'name',
            }
        },
        content: {
            items: [
                'lorem ipsum',
                'Hello World',
            ]
        }
    }
};

const builder = new xml2js.Builder();
const xml = builder.buildObject(xmlObject);

console.log(xml);
*/

//si erreur
//res.status(400).json({ MSG_ERROR_PRODUCTION });