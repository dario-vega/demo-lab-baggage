# demo-lab-baggage 

The multi-tier application has been the most used architecture pattern for decades. The multi-tier pattern provides good guidelines for you to follow to ensure decoupled and scalable application components that can be separately managed and maintained.

## The Serverless Logic Tier
The logic tier of the three-tier architecture represents the brains of the application. Integrating API Gateway and functions to form your logic tier can be so revolutionary.
The features of the two services allow you to build a serverless production application that is highly available, scalable, and secure. Your application could use thousands of servers, however by leveraging this pattern you do not have to manage even a single one. 

In addition, by using these managed services together you gain the following benefits: 
*	No operating systems to choose, secure, patch, or manage.
*	No servers to right size, monitor, or scale out. 
*	No risk to your cost by over-provisioning. 
*	No risk to your performance by under-provisioning.


## TEST API ⏰:construction_worker:  :wrench:

https://ibjktcfgy3nuktwxv73doau3ae.apigateway.eu-frankfurt-1.oci.customer-oci.com/BaggageDemo/demo-api
https://ibjktcfgy3nuktwxv73doau3ae.apigateway.eu-frankfurt-1.oci.customer-oci.com/BaggageDemo/demo-api?ticketNo=1762386738153

https://foo179.docs.apiary.io/#


## TEST Service Connector (Streaming-Function) :construction_worker: :wrench: ⚠️

![Working](ServiceConnector.PNG)

## CI/CD - Manual Deployment Documentation V0 :construction_worker: :wrench: :construction: 🔨 🛠️ ⚒️

Creating NoSQL tables
```
cd objects 
DDL_TABLE=$(cat demo.nosql)
oci nosql table create --compartment-id ocid1.compartment.oc1..aaaaaaaamgvdxnuap56pu2qqxrcg7qnvb4wxenqguylymndvey3hsyi57paa   \
--name demo --ddl-statement "$DDL_TABLE" \
--table-limits="{\"maxReadUnits\": 15,  \"maxStorageInGBs\": 1,  \"maxWriteUnits\": 15 }"

DDL_TABLE=$(cat demoKeyVal.nosql)
oci nosql table create --compartment-id ocid1.compartment.oc1..aaaaaaaamgvdxnuap56pu2qqxrcg7qnvb4wxenqguylymndvey3hsyi57paa   \
--name demoKeyVal  --ddl-statement "$DDL_TABLE" \
--table-limits="{\"maxReadUnits\": 15,  \"maxStorageInGBs\": 1,  \"maxWriteUnits\": 15 }"
```
Creating, testing and Deploying Functions
```

cd functions-fn/load/

cd demo-keyval-load
fn -v deploy --app helloworld-app
cat ../../BaggageData/baggage_data_file99.json | fn invoke helloworld-app demo-keyval-load
fn delete function helloworld-app demo-keyval-load

cd demo-load
fn -v deploy --app helloworld-app
cat ../../BaggageData/baggage_data_file99.json | fn invoke helloworld-app demo-load
fn delete function helloworld-app demo-load

cd functions-fn/api/demo-api


cd demo-api
fn -v deploy --app helloworld-app
echo '{"ticketNo":"1762386738153"}' | fn invoke helloworld-app demo-api | jq
fn invoke helloworld-app demo-api | jq
fn invoke helloworld-app demo-api | jq '. | length'
fn delete function helloworld-app nosql-blogs

cd functions-fn/streaming/load-target

cd load-target
fn -v deploy --app helloworld-app
var1=`base64 -w 0 ../../BaggageData/baggage_data_file99.json`
cp test_templ.json stream_baggage_data_file99.json
sed -i "s/<here>/$var1/g"  stream_baggage_data_file99.json

fn invoke helloworld-app load-target < stream_baggage_data_file99.json
fn delete function helloworld-app load-target

```
