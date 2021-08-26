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
  let endPoint;

  // Reading parameters from standard input for TEST purposes
  if (input && input.endPoint)
    endPoint = input.endPoint;
  if (input && input.ticketNo)
    ticketNo = input.ticketNo;

  // Reading parameters sent by the httpGateway
  let hctx = ctx.httpGateway
  if (hctx  && hctx.requestURL) {
        var adr = hctx.requestURL;
        var q = url.parse(adr, true);
        endPoint = q.pathname.split('/')[2]
        ticketNo = q.query.ticketNo
  }


  if ( !client ) {
    client = createClientResource();
  }

  let rows;
  if (endPoint == "getBagInfoByTicketNumber") {
     rows = getBagInfoByTicketNumber(ticketNo);
  }
  else if (endPoint == "getPassengersAffectedByFlight") {
     const statementQry1 = `SELECT d.ticketNum as ticketNo, d.name as fullName, d.contactPhone as contactInfo, size(d.content.bagInfo) as numBags FROM demo d WHERE d.bagInfo.flightLegs.flightNo =ANY 'flightNo'`
     rows = {'message': endPoint + " under construction." , "sql" : statementQry1, "index" : "bagInfo.flightLegs.flightNo"}
  }
  else {
     rows = {'message': endPoint + " not managed"}
     hctx.statusCode=500;
  }

  //if (client) {
  //         client.close();
  //}

  return rows;
  return process.version;


}, {});

async function getBagInfoByTicketNumber (ticketNo) {
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
  return rows;
}


function createClientResource() {
  return  new NoSQLClient({
    region: process.env.NOSQL_REGION,
    compartment:process.env.NOSQL_COMPARTMENT_ID,
    auth: {
        iam: {
            useResourcePrincipal: true
        }
    }
  });
}

