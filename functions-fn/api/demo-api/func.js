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

fdk.handle(async function(input, ctx){
  let ticketNo;

  if (input && input.ticketNo)
    ticketNo = input.ticketNo;

  let hctx = ctx.httpGateway
  if (hctx  && hctx.requestURL) {
        var adr = hctx.requestURL;
        var q = url.parse(adr, true);
        ticketNo = q.query.ticketNo
  }

  if ( !client ) {
    client = createClientResource();
  }

  const statementQry1 = `SELECT * FROM demo LIMIT ${lim}`;
  const statementQry2 = `SELECT * FROM demo WHERE ticketNo =  "${ticketNo}"`;

  const rows = [];
  let cnt ;
  let res;
  try {
    do {
       if (ticketNo)
         res = await client.query(statementQry2, { continuationKey:cnt});
       else
         res = await client.query(statementQry1, { continuationKey:cnt});
       rows.push.apply(rows, res.rows);
       cnt = res.continuationKey;
    } while(res.continuationKey != null);
  }
  catch(err) {
        return err;
  }
  //if (client) {
  //         client.close();
  //}

  return rows;
  return process.version;

}, {});

function createClientResource() {
  return  new NoSQLClient({
    region: Region.EU_FRANKFURT_1,
    compartment:process.env.NOSQL_COMPARTMENT_ID,
    auth: {
        iam: {
            useResourcePrincipal: true
        }
    }
  });
}

