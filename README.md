# demo-lab-baggage 

The multi-tier application has been the most used architecture pattern for decades. The multi-tier pattern provides good guidelines for you to follow to ensure decoupled and scalable application components that can be separately managed and maintained. 

For detailed information about this demo, [read the following blog](https://blogs.oracle.com/nosql)

## The Serverless Logic Tier
The logic tier of the three-tier architecture represents the brains of the application. Integrating API Gateway, Streams and functions to form your logic tier can be so revolutionary.
The features of those services allow you to build a serverless production application that is highly available, scalable, and secure. Your application could use thousands of servers, however by leveraging this pattern you do not have to manage even a single one. 

In addition, by using these managed services together you gain the following benefits: 
*	No operating systems to choose, secure, patch, or manage.
*	No servers to right size, monitor, or scale out. 
*	No risk to your cost by over-provisioning. 
*	No risk to your performance by under-provisioning.

🎓 **Learn and Discover why NoSQL Cloud Services and OCI native services are compelling**

## DEMO API Gateway

A common requirement is to build an API with serverless functions as a back end, and an API gateway providing front-end access to those functions. This is the scenario that we want to illustrate. We created a [demo-api function](./functions-fn/api/demo-api/func.js) which read the data from NoSQL table and implementing the logic tier.

The API Gateway service enables you to publish APIs with private endpoints that are accessible from within your network, and which you can expose with public IP addresses if you want them to accept internet traffic. The endpoints support API validation, request and response transformation, CORS, authentication and authorization, and request limiting. 

You can add serverless function back ends to an API deployment specification by using the Console. You can also do this by using Terraform or calling directly the OCI API.

Then **USE** the endpoint to access the Data from your favorite API Browser:

![Working](APIGW_Endpoints.png)

- https://ibjktcfgy3nuktwxv73doau3ae.apigateway.eu-frankfurt-1.oci.customer-oci.com/BaggageDemo/getBagInfoByTicketNumber
- https://ibjktcfgy3nuktwxv73doau3ae.apigateway.eu-frankfurt-1.oci.customer-oci.com/BaggageDemo/getBagInfoByTicketNumber?ticketNo=1762386738153

Or simulate traffic using API calls from a linux system

````
IFS=$'\n'
unset ticketNo
URL="https://ibjktcfgy3nuktwxv73doau3ae.apigateway.eu-frankfurt-1.oci.customer-oci.com/BaggageDemo/getBagInfoByTicketNumber"
ticketNo=($(curl ${URL} | jq -r '[.[].ticketNo] | .[]?'	))
for (( i=0; i<${#ticketNo[@]}; i++ )); do
   curl -X GET -k -d '{"name":"${ticketNo[i]}"}' "${URL}?ticketNo=${ticketNo[i]}" 2>/dev/null | jq
   sleep 3
done
````

Instead of using the generated EndPoint, you can specify a particular custom domain name for an API gateway. The API gateways you create with the API Gateway service are TLS-enabled, and therefore require TLS certificates (formerly SSL certificates) issued by a Certificate Authority to secure them. To specify a particular custom domain name for an API gateway, you must obtain a custom TLS certificate from a Certificate Authority yourself, rather than have the API Gateway service obtain a TLS certificate for you.

Finally, [Apiary](https://apiary.io/) provides you with the ability to design APIs using either API Blueprint or Swagger. From these description files, Oracle Apiary generates interactive documentation and a console for making calls to the APIs from the UI. Apiary interactive documentation is an interactive representation of your API Description for you to not only read and write, but to be a place where you can interact with your API—even before you’ve built it. 

Apiary was used in our project as a very powerful tool for **Collaboration and Interactions**. 

https://foo179.docs.apiary.io/#


## DEMO Service Connector (Streaming-Function)

Service Connector Hub is a cloud message bus platform that offers a single pane of glass for describing, executing, and monitoring movement of data between services in Oracle Cloud Infrastructure. 

Service Connector Hub orchestrates data movement between services in Oracle Cloud Infrastructure. 

This scenario involves creating the [load-target](./functions-fn/streaming/load-target/func.py ) function and then referencing that function in a service connector (Service Connector Hub)  to process and move Baggage data from Streaming to a NoSQL table.

![Working](ServiceConnector.PNG)

To test, you just need to Publishing Messages to the Stream instance from OCI Console (copy/paste the json Baggage document in Data text box.). 

![Working](PublishMessage.png)

Or using OCI cli commands in order to simulate a real-time traffic

````
for file in `ls -1 ~/BaggageData/baggage_data* | tail -20`; do
  echo $file
  filename=`basename $file` 
  var1=`base64 -w 0 $file`
  cp stream_oci_cli_templ.json stream_oci_cli_$filename
  sed -i "s/<here>/$var1/g"  stream_oci_cli_$filename
  oci streaming stream message put --stream-id  $STREAM_OCID \
  --messages file://stream_oci_cli_$filename --endpoint $STREAM_ENDPOINT
  sleep 5
done
````
  

## DEMO NoSQL and Functions 👷 ⏰ 🛠️

Oracle NoSQL Database Cloud Service is a fully managed database cloud service that is designed for database operations that require predictable, single digit millisecond latency responses to simple queries. NoSQL Database Cloud Service allows developers to focus on application development rather than setting up cluster servers, or performing system monitoring, tuning, diagnosing, and scaling. 

Once you are authenticated against your Oracle Cloud account, you can create a NoSQL table, and specify throughput and storage requirements for the table. Oracle reserves and manages the resources to meet your requirements, and provisions capacity for you. Capacity is specified using read and write units for throughput and GB for storage units

As a developer, you can connect to the Oracle NoSQL Database Cloud Service and work with NoSQL tables using the NoSQL SDKs available in multiple languages

**In this demo, we will use NoSQL Database Python SDK and NoSQL Database Node.js SDK in conjunction with Oracle Functions.**

Oracle Functions is a fully managed, multi-tenant, highly scalable, on-demand, Functions-as-a-Service platform. It is built on enterprise-grade Oracle Cloud Infrastructure and powered by the Fn Project open source engine. Use Oracle Functions (sometimes abbreviated to just Functions) when you want to focus on writing code to meet business needs. 

To enable a function to access another Oracle Cloud Infrastructure resource, you have to include the function in a dynamic group, and then create a policy to grant the dynamic group access to that resource. 

Having set up the policy and the dynamic group, you can then include a call to a 'resource principal provider' in your function code. The resource principal provider uses a resource provider session token (RPST) that enables the function to authenticate itself with other Oracle Cloud Infrastructure services. The token is only valid for the resources to which the dynamic group has been granted access. 

**Dynamic groups** allow you to group Oracle Cloud Infrastructure compute instances as "principal" actors (similar to user groups). You can then create policies to permit instances to make API calls against Oracle Cloud Infrastructure services. When you create a dynamic group, rather than adding members explicitly to the group, you instead define a set of matching rules to define the group members

```
ALL {resource.type = 'ApiGateway', resource.compartment.id = 'ocid1.compartment.oc1..aaaaaaaamgvdxnuap56pu2qqxrcg7qnvb4wxenqguylymndvey3hsyi57paa'}
ALL {resource.type = 'fnfunc', resource.compartment.id = 'ocid1.compartment.oc1..aaaaaaaamgvdxnuap56pu2qqxrcg7qnvb4wxenqguylymndvey3hsyi57paa'}
```
NB "_ocid1.compartment.oc1..aaaaaaaamgvdxnuap56pu2qqxrcg7qnvb4wxenqguylymndvey3hsyi57paa_" is the OCID for my test compartment DARIO.

![Working](DynamicGroup.png)

**Oracle NoSQL Database Cloud Service uses Oracle Cloud Infrastructure Identity and Access Management to provide secure access to Oracle Cloud.** Oracle Cloud Infrastructure Identity and Access Management enables you to create user accounts and give users permission to inspect, read, use, or manage tables. 

For demo purpose, I am providing all rights to the Dynamic Group created in my compartment.
```
allow dynamic-group DV_APIGATEWAY to manage all-resources in compartment DARIO
```
![Working](Policies.png)

You can find more information about NoSQL Privileges in the documentation- [Policy Reference](https://docs.oracle.com/en/cloud/paas/nosql-cloud/csnsd/policy-reference.html#GUID-C194529F-2B38-4BDE-9777-2D3C0CF248D3)


After doing the setup, you just need use **Resource Principals to do the connection to NoSQL Cloud Service** as shown below.

⚠️In this snippet, there are harcoded references (eg REGION). This is not the case in the final code (read takeaways in this section)

**NoSQL Database Node.js SDK**
```
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
```
**NoSQL Database Python SDK**
```
def get_handle():
     provider = borneo.iam.SignatureProvider.create_with_resource_principal()
     config = borneo.NoSQLHandleConfig('eu-frankfurt-1', provider).set_logger(None)
     return borneo.NoSQLHandle(config)
```

**Takeaway**: Read those ["best practice"](./functions-fn/README.md) when calling Oracle NoSQL Database Cloud Service from Functions

In this project, you hace the functions interacting with NoSQL tables that we used to implement 
- the API demo
- the Service Connector demo (Streaming-Function)

### Deployment Documentation V0

#### IaC - NoSQL Tables Deployment

Creating NoSQL tables using oci-cli - DDL for create tables in this [directory](./objects)
```
cd demo-lab-baggage/objects
COMP_ID="ocid1.compartment.oc1..aaaaaaaamgvdxnuap56pu2qqxrcg7qnvb4wxenqguylymndvey3hsyi57paa"
DDL_TABLE=$(cat demo.nosql)
oci nosql table create --compartment-id "$COMP_ID"   \
--name demo --ddl-statement "$DDL_TABLE" \
--table-limits="{\"maxReadUnits\": 15,  \"maxStorageInGBs\": 1,  \"maxWriteUnits\": 15 }"

DDL_TABLE=$(cat demoKeyVal.nosql)
oci nosql table create --compartment-id "$COMP_ID"   \
--name demoKeyVal  --ddl-statement "$DDL_TABLE" \
--table-limits="{\"maxReadUnits\": 15,  \"maxStorageInGBs\": 1,  \"maxWriteUnits\": 15 }"

```

Creating NoSQL tables Using Terraform - use the [demo-lab-baggage-terraform.zip](./demo-lab-baggage-terraform.zip) provided

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


#### Data for test

https://github.com/dario-vega/ndcs_baggage_tracking_demo

#### CI/CD - Functions Manual Deployment

Creating, testing and Deploying Functions provided in this demo


```
export APP_NAME="helloworld-app"
fn config app $APP_NAME NOSQL_COMPARTMENT_ID 'ocid1.compartment.oc1..aaaaaaaamgvdxnuap56pu2qqxrcg7qnvb4wxenqguylymndvey3hsyi57paa'
fn config app $APP_NAME NOSQL_REGION 'eu-frankfurt-1'

git clone https://github.com/dario-vega/demo-lab-baggage

cd ~/demo-lab-baggage/functions-fn
cd load/demo-keyval-load
fn -v deploy --app $APP_NAME
cat ~/BaggageData/baggage_data_file99.json | fn invoke $APP_NAME demo-keyval-load
#fn delete function $APP_NAME demo-keyval-load

cd ~/demo-lab-baggage/functions-fn
cd load/demo-load
fn -v deploy --app $APP_NAME
cat ~/BaggageData/baggage_data_file99.json | fn invoke  $APP_NAME demo-load
cat ~/BaggageData/baggage_data_file103.json  | fn invoke  $APP_NAME demo-load
#fn delete function $APP_NAME demo-load

cd ~/demo-lab-baggage/functions-fn
cd api/demo-api

fn -v deploy --app $APP_NAME
echo '{"ticketNo":"1762386738153", "endPoint":"getBagInfoByTicketNumber"}' | fn invoke $APP_NAME demo-api | jq
echo '{"endPoint":"getBagInfoByTicketNumber"}' | fn invoke $APP_NAME demo-api | jq
echo '{"endPoint":"getBagInfoByTicketNumber"}' | fn invoke $APP_NAME demo-api | jq '. | length'
echo '{"endPoint":"getPassengersForBagRoute"}' | fn invoke $APP_NAME demo-api | jq
echo '{"endPoint":"demo-api"}' | fn invoke $APP_NAME demo-api | jq
fn invoke $APP_NAME demo-api | jq
#fn delete function $APP_NAME demo-api

cd ~/demo-lab-baggage/functions-fn
cd streaming/load-target

fn -v deploy --app $APP_NAME

var1=`base64 -w 0 ~/BaggageData/baggage_data_file99.json`
cp test_templ.json stream_baggage_data_file99.json
sed -i "s/<here>/$var1/g"  stream_baggage_data_file99.json

fn invoke $APP_NAME load-target < stream_baggage_data_file99.json
#fn delete function $APP_NAME load-target

```

In order to configure your LOCAL test system, you need to follow the Instructions in the OCI Console - Getting Started 

![Working](FunctionsSetup.png)

NB : do not forget to add a section [davega] in your .oci/config file. In my case, davega is the fn context configured

```
fn create context davega --provider oraclefn 
fn use context davega
...
```

```
cat .fn/contexts/davega.yaml
api-url: https://functions.eu-frankfurt-1.oraclecloud.com
oracle.compartment-id:ocid1.compartment.oc1..aaaaaaaamgvdxnuap56pu2qqxrcg7qnvb4wxenqguylymndvey3hsyi57paa
provider: oracle
registry: fra.ocir.io/<tenadncyname>/nosql_demos

cat .oci/config
[DEFAULT]
user=ocid1.user.....
fingerprint=5b:2b:.....
tenancy=ocid1.tenancy.oc1......
region=eu-frankfurt-1
key_file=<pem file>
[davega]
user=ocid1.user.....
fingerprint=5b:2b:.....
tenancy=ocid1.tenancy.oc1......
region=eu-frankfurt-1
key_file=<pem file>

```


Installing docker in Oracle linux 7
``` 
yum install docker-engine docker-cli
systemctl enable --now docker
systemctl status docker
sudo groupadd docker
sudo usermod -aG docker opc
``` 

