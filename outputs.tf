## Copyright (c) 2020, Oracle and/or its affiliates.
## All rights reserved. The Universal Permissive License (UPL), Version 1.0 as shown at http://oss.oracle.com/licenses/upl

output "oci_apigateway_deployment_URL" {
  value = [join("", [data.oci_apigateway_deployment.apigateway_deployment.endpoint, "/upload2stream"])]
}
