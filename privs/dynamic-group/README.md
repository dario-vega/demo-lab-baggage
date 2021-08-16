## Examples - OCI commands to create dynamic-group and policies

````
cd ~/demo-lab-baggage/privs/dynamic-group
export DYN_GROUP_NAME=nosql_demos
RULES=$(cat example_dyn_group_rules.txt)
oci iam dynamic-group create --description "$DYN_GROUP_NAME" --name "$DYN_GROUP_NAME" --matching-rule "$RULES" 

export POLICY_NAME=nosql_demos_faas
oci iam policy create  --compartment-id 'ocid1.compartment.oc1..aaaaaaaafml3tca3zcxyifmdff3aadp5uojimgx3cdnirgup6rhptxwnandq' \
--name $POLICY_NAME --description $POLICY_NAME  --statements file://example_policy_demo.json 
````
You need to create the dynamic groups and privileges from your HOME region
````
{
    "code": "NotAllowed",
    "message": "Please go to your home region IAD to execute CREATE, UPDATE and DELETE operations.",
    "opc-request-id": "351C608A5CFA4C9CA7F03CC1BA6A49E3/F9E31D486B9C9BB5EA973E0EFEB23C9B/F2EB27857DD51C9AEDA24A1453792066",
    "status": 403
}
````


## Examples - OCI commands to get the dynamic-group and policies resources

````
oci iam dynamic-group get --dynamic-group-id "ocid1.dynamicgroup.oc1..aaaaaaaam5pmum7yojr6pmm26f4zfeq32awhvaiemfqwfgrxctl2y4uvvuaq" | jq -r '."data"."matching-rule"'

oci iam policy list --compartment-id 'ocid1.compartment.oc1..aaaaaaaa4mlehopmvdluv2wjcdp4tnh2ypjz3nhhpahb4ss7yvxaa3be3diq'  | jq -r '."data"[].statements' 
````
