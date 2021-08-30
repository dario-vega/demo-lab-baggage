## Copyright (c) 2020, Oracle and/or its affiliates.
## All rights reserved. The Universal Permissive License (UPL), Version 1.0 as shown at http://oss.oracle.com/licenses/upl

# Functions Policies

resource "oci_identity_policy" "NOSQLDEMOFunctionsServiceReposAccessPolicy" {
  provider = oci.homeregion
  name = "NOSQLDEMOFunctionsServiceReposAccessPolicy"
  description = "NOSQLDEMOFunctionsServiceReposAccessPolicy"
  compartment_id = var.tenancy_ocid
  statements = ["Allow service FaaS to read repos in tenancy"]

  provisioner "local-exec" {
       command = "sleep 5"
  }
}
