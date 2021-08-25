## This configuration was generated by terraform-provider-oci


resource oci_functions_function export_rp-demo-fn {
  depends_on     = [null_resource.p-demo-fnPush2OCIR]
  application_id = var.application_id
  config = {
  }
  defined_tags = {
  }
  display_name = "rp-demo-fn"
  freeform_tags = {
  }
  image              = "${local.ocir_docker_repository}/${local.ocir_namespace}/${var.ocir_repo_name}/rp-demo-fn:0.0.1"
  memory_in_mbs      = "256"
  timeout_in_seconds = "120"
  trace_config {
    is_enabled = "false"
  }
}

