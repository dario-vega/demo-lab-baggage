const fdk=require('@fnproject/fdk');
const process = require('process');
const NoSQLClient = require('oracle-nosqldb').NoSQLClient;
const Region = require('oracle-nosqldb').Region;
const ServiceType = require('oracle-nosqldb').ServiceType;
const url = require('url');

let client;
let lim = 15;

process.on('exit', function(code) {
  if (client) {
     console.log("\close client  on exit");
     client.close();
  }
  return code;
});

fdk.handle(async function(input){


  if ( !client ) {
    client = createClientResource();
  }

  res = await client.put(
                'demokeyval',
                { value: input }
             );

  return res;

})

function createClientResource() {
  return  new NoSQLClient({
    region: Region.EU_FRANKFURT_1,
    compartment:'ocid1.compartment.oc1..aaaaaaaamgvdxnuap56pu2qqxrcg7qnvb4wxenqguylymndvey3hsyi57paa',
    auth: {
        iam: {
            useResourcePrincipal: true
        }
    }
  });
}
