# demo-lab-baggage 

The multi-tier application has been the most used architecture pattern for decades. The multi-tier pattern provides good guidelines for you to follow to ensure decoupled and scalable application components that can be separately managed and maintained.

## The Serverless Logic Tier
The logic tier of the three-tier architecture represents the brains of the application. Integrating API Gateway, Streams and functions to form your logic tier can be so revolutionary.
The features of the two services allow you to build a serverless production application that is highly available, scalable, and secure. Your application could use thousands of servers, however by leveraging this pattern you do not have to manage even a single one. 

In addition, by using these managed services together you gain the following benefits: 
*	No operating systems to choose, secure, patch, or manage.
*	No servers to right size, monitor, or scale out. 
*	No risk to your cost by over-provisioning. 
*	No risk to your performance by under-provisioning.

🎓 **Learn and Discover why NoSQL Cloud Services and OCI native services are compelling**

## TEST API

A common requirement is to build an API with serverless functions as a back end, and an API gateway providing front-end access to those functions. This is the scenario that we want to illustrate. Create a [function](./functions-fn/api/demo-api/func.js) which read the data from NoSQL table and implementing the logic tier.

The API Gateway service enables you to publish APIs with private endpoints that are accessible from within your network, and which you can expose with public IP addresses if you want them to accept internet traffic. The endpoints support API validation, request and response transformation, CORS, authentication and authorization, and request limiting. 

You can add serverless function back ends to an API deployment specification by using the Console. You can also do this by using Terraform.

Then **USE** the endpoint to access the Data from your favorite API Browser:

![Working](APIGW_Endpoints.png)

- https://ibjktcfgy3nuktwxv73doau3ae.apigateway.eu-frankfurt-1.oci.customer-oci.com/BaggageDemo/demo-api
- https://ibjktcfgy3nuktwxv73doau3ae.apigateway.eu-frankfurt-1.oci.customer-oci.com/BaggageDemo/demo-api?ticketNo=1762386738153

The API gateways you create with the API Gateway service are TLS-enabled, and therefore require TLS certificates (formerly SSL certificates) issued by a Certificate Authority to secure them. To specify a particular custom domain name for an API gateway, you must obtain a custom TLS certificate from a Certificate Authority yourself, rather than have the API Gateway service obtain a TLS certificate for you.

Apiary provides you with the ability to design APIs using either API Blueprint or Swagger. From these description files, Oracle Apiary generates interactive documentation and a console for making calls to the APIs from the UI. Apiary interactive documentation is an interactive representation of your API Description for you to not only read and write, but to be a place where you can interact with your API—even before you’ve built it
Apiary was used in our project as a very powerful tool for **Collaboration and Interactions**. 

https://foo179.docs.apiary.io/#


## TEST Service Connector (Streaming-Function)

Service Connector Hub is a cloud message bus platform that offers a single pane of glass for describing, executing, and monitoring movement of data between services in Oracle Cloud Infrastructure. 

Service Connector Hub orchestrates data movement between services in Oracle Cloud Infrastructure. 

This scenario involves creating the [load-target](./functions-fn/streaming/load-target/func.py ) function and then referencing that function in a service connector (Service Connector Hub)  to process and move log data from Streaming to a NoSQL table.

To test, you just need to Publishing Messages to the Stream instance from OCI Console (copy/paste the json document in Data text box.). 

**NB** Be aware that we are not Handling large messages (larger than the 1 MB limit)

![Working](ServiceConnector.PNG)

## IaC - NoSQL Tables Deployment Documentation V0

Creating NoSQL tables using oci-cli - [tables](./objects)
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

Creating NoSQL tables Using Terraform (use the demo-lab-baggage-terraform.zip provided)

```
## This configuration was generated by terraform-provider-oci

resource oci_nosql_table export_demoKeyVal {
  compartment_id = var.compartment_ocid
  ddl_statement  = "CREATE TABLE IF NOT EXISTS demoKeyVal ( key INTEGER GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1 NO CYCLE ), value JSON, PRIMARY KEY (key))"
  defined_tags = {
  }
  freeform_tags = {
  }
  is_auto_reclaimable = "false"
  name                = "demoKeyVal"
  table_limits {
    max_read_units     = "10"
    max_storage_in_gbs = "1"
    max_write_units    = "10"
  }
}


resource oci_nosql_table export_demo {
  compartment_id = var.compartment_ocid
  ddl_statement  = "CREATE TABLE if not exists demo(\n  fullName     STRING,\n  contactPhone STRING,\n  ticketNo     STRING,\n  confNo       STRING,\n  gender       STRING,\n  bagInfo      JSON,\n PRIMARY KEY ( ticketNo )\n )"
  defined_tags = {
  }
  freeform_tags = {
  }
  is_auto_reclaimable = "false"
  name                = "demo"
  table_limits {
    max_read_units     = "10"
    max_storage_in_gbs = "1"
    max_write_units    = "10"
  }
}

```

## CI/CD - Manual Deployment Documentation V0

Creating, testing and Deploying Functions provided in this demo
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
## Data for test

https://github.com/dario-vega/ndcs_baggage_tracking_demo
