# Best Practice Using Functions and NoSQL

**Authorizing with Resource Principal**

*Resource Principal* is an IAM service feature that enables the resources to
be authorized actors (or principals) to perform actions on service resources.
You may use Resource Principal when calling Oracle NoSQL Database Cloud
Service from other Oracle Cloud service resource such as Functions

e.g follow the [NoSQL Database Node.js SDK](https://github.com/oracle/nosql-node-sdk/blob/master/doc/guides/connect-cloud.md) recommnedations

# Best Practice Using Functions and NoSQL Database Python SDK

It is recommanded to set the main logger level to something lower than debug 
````
logger = logging.getLogger()
logger.setLevel(logging.INFO)
````

# Best Practice Using Functions and NoSQL Database Node.js SDK

The fnproject/node docker images are currently using node v11.15.0. Because the Prerequisites for [Node.js for Oracle NoSQL Database](https://github.com/oracle/nosql-node-sdk/blob/master/README.md) is 12.0.0 or higher, We are provining in this demo a Dockerfile. In fact, we want to be sure to use a Node.js version supported by NoSQL.

Currently, We are using node:12-slim in order to reduce the size of the docker image. In a near future, we will test using [GraalVM](https://www.graalvm.org/)

If you want to know which is the node.js version used, use the following func.js script

```` 
const fdk=require('@fnproject/fdk')
const process = require('process');
fdk.handle(async function(input){
 return process.version;
})
````

**Best practices for package.json.** Use "oracle-nosqldb": ">=5.2.0" instead of fixing a version "oracle-nosqldb": "^5.2.0" 

Be sure that you are not copying local node_modules directory to the docker image. It can generate incompatibilities if you are not using the same version in both side (local machine & docker image). 

Delete the package-lock.json files before build your docker image.


# Reading the claimTenancyId and claimCompartmentId (Node.js)

  const sessionTokenFilePath = process.env.OCI_RESOURCE_PRINCIPAL_RPST
  const rpst = fs.readFileSync(sessionTokenFilePath, {encoding: 'utf8'})
  const payload = rpst.split('.')[1]
  const buff = Buffer.from(payload, 'base64')
  const payloadDecoded = buff.toString('ascii')
  const claims = JSON.parse(payloadDecoded)
  const claimTenancyId = claims.res_tenant
  const claimCompartmentId = claims.res_compartment;

# Reading the claimTenancyId and claimCompartmentId (python)

compartment_id = provider.get_resource_principal_claim(borneo.ResourcePrincipalClaimKeys.COMPARTMENT_ID_CLAIM_KEY)
tenant_id = provider.get_resource_principal_claim(borneo.ResourcePrincipalClaimKeys.TENANT_ID_CLAIM_KEY)
