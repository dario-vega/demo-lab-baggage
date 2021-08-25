variable region {  }
variable compartment_ocid {  }
variable "application_id" {
  default = "ocid1.fnapp.oc1.eu-frankfurt-1.aaaaaaaaywrjowh6eevboplpkysl6efwjftb22xaj4gycx3km35tkizj7arq"
}

variable "ocir_repo_name" {
  default = "nosql_demos"
}

variable "ocir_user_name" {
  default = ""
}

variable "ocir_user_password" {
  default = ""
}

# OCIR repo name & namespace

locals {
  ocir_docker_repository = join("", [lower(lookup(data.oci_identity_regions.oci_regions.regions[0], "key" )), ".ocir.io"])
  ocir_namespace = lookup(data.oci_identity_tenancy.oci_tenancy, "name" )
}
