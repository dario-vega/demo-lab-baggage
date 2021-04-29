# Best Practice Using Functions and NoSQLCS

**Authorizing with Resource Principal**

*Resource Principal* is an IAM service feature that enables the resources to
be authorized actors (or principals) to perform actions on service resources.
You may use Resource Principal when calling Oracle NoSQL Database Cloud
Service from other Oracle Cloud service resource such as Functions

e.g follow the [NoSQL Database Node.js SDK](https://github.com/oracle/nosql-node-sdk/blob/master/doc/guides/connect-cloud.md) recommnedations


# Best Practice Using Functions and NoSQL Database Node.js SDK

The fnproject/node docker images are currently using node v11.15.0. Because the Prerequisites for [Node.js SDK](https://github.com/oracle/nosql-node-sdk/blob/master/README.md) is 12.0.0 or higher, We are provining in this demo a Dockerfile. In fact, we want to be sure to use a Node.js version supported by NoSQL.

Currently, We are using node:12-slim in order to reduce the size of the docker image. In a near future, we will test using [GraalVM](https://www.graalvm.org/)

If you want to test what is the node.js version used, use the following  func.js

```` 
const fdk=require('@fnproject/fdk')
const process = require('process');
fdk.handle(async function(input){
 return process.version;
})
````

**Best practices for package.json.** Use "oracle-nosqldb": ">=5.2.0" instead of fixing a version "oracle-nosqldb": "^5.2.0" 

DO not install packages using npm in your local environnement. The local node_modules directory is being copied to the docker image and can generate incompatibilities. 
It is mixing modules from different versions

Under revision 🚧 👷

question about best practice package-lock.json (currently I am deleting this file) 



