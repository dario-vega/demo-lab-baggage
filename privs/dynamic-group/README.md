## Examples - OCI commands to create dynamic-group and policies

````
cd ~/demo-lab-baggage/privs/dynamic-group
export DYN_GROUP_NAME=nosql_demos
RULES=$(cat example_dyn_group_rules.txt)
oci iam dynamic-group create --description "$DYN_GROUP_NAME" --name "$DYN_GROUP_NAME" --matching-rule "$RULES" 

export POLICY_NAME=nosql_demos_faas
oci iam policy create  --compartment-id 'ocid1.compartment.oc1..aaaaaaaafml3tca3zcxyifmdff3aadp5uojimgx3cdnirgup6rhptxwnandq' \
--name $POLICY_NAME --statements file://example_policy_demo.json 
````

## Examples - OCI commands to get the dynamic-group and policies resources

````
oci iam dynamic-group get --dynamic-group-id "ocid1.dynamicgroup.oc1..aaaaaaaam5pmum7yojr6pmm26f4zfeq32awhvaiemfqwfgrxctl2y4uvvuaq" | jq -r '."data"."matching-rule"'

oci iam policy list --compartment-id 'ocid1.compartment.oc1..aaaaaaaa4mlehopmvdluv2wjcdp4tnh2ypjz3nhhpahb4ss7yvxaa3be3diq'  | jq -r '."data"[].statements' 
````
