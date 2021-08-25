## Copyright (c) 2020, Oracle and/or its affiliates.
## All rights reserved. The Universal Permissive License (UPL), Version 1.0 as shown at http://oss.oracle.com/licenses/upl

data "oci_identity_regions" "oci_regions" {
  
  filter {
    name = "name" 
    values = [var.region]
  }

}

data "oci_identity_tenancy" "oci_tenancy" {
    tenancy_id = var.tenancy_ocid
}

data "oci_apigateway_deployment" "apigateway_deployment" {
    deployment_id = oci_apigateway_deployment.apigateway_deployment.id
}

