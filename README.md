# demo-lab-baggage 

## TEST API ⏰:construction_worker:  :wrench:

https://ibjktcfgy3nuktwxv73doau3ae.apigateway.eu-frankfurt-1.oci.customer-oci.com/BaggageDemo/demo-api
https://ibjktcfgy3nuktwxv73doau3ae.apigateway.eu-frankfurt-1.oci.customer-oci.com/BaggageDemo/demo-api?ticketNo=1762386738153

## TEST Streaming :construction_worker: :wrench: ⚠️



##  Documentation V0 :construction_worker: :wrench: :construction: 🔨 🛠️ ⚒️
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

```
