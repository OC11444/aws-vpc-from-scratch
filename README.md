# AWS VPC Manual Setup — Command Output Log


# AWS VPC From Scratch (Manual CLI Setup)

## Overview
This project documents the manual creation of an AWS Virtual Private Cloud (VPC)
using the AWS CLI. The goal was to understand how core networking components
(VPCs, subnets, and Internet Gateways) are created and connected at a low level.

The architecture diagram in this repository is derived directly from the
command outputs shown below and reflects the state of the infrastructure
at the time of execution.


## Step 1 — Create VPC

Command used to create the VPC:

```bash
aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --region us-east-1 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=my-learning-vpc}]' \
  --output json
```


```json
{
  "Vpc": {
    "OwnerId": "<account-id>",
    "InstanceTenancy": "default",
    "Ipv6CidrBlockAssociationSet": [],
    "CidrBlockAssociationSet": [
      {
        "AssociationId": "vpc-cidr-assoc-xxxxxxx",
        "CidrBlock": "10.0.0.0/16",
        "CidrBlockState": { "State": "associated" }
      }
    ],
    "IsDefault": false,
    "Tags": [ { "Key": "Name", "Value": "my-learning-vpc" } ],
    "VpcId": "<vpc-id>",
    "State": "pending",
    "CidrBlock": "10.0.0.0/16",
    "DhcpOptionsId": "<dhcp-options-id>"
  }
}
```



Notes
-----

- Sensitive account identifiers have been redacted in this log. If you want the raw output captured for auditing, consider storing it in a private, access-controlled location.
- The VPC `Name` tag is preserved to keep the resource identifiable in examples.


## Step 2 — Create subnets (public and private)

Command used to create the public subnet:

```bash
aws ec2 create-subnet \
  --vpc-id <vpc-id> \
  --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=my-public-subnet}]' \
  --output json
```

Snippet of the returned JSON for the public subnet (truncated):

```json
{
  "Subnet": {
    "AvailabilityZoneId": "use1-az1",
    "MapCustomerOwnedIpOnLaunch": false,
    "OwnerId": "<account-id>",
    "AssignIpv6AddressOnCreation": false,
    "Ipv6CidrBlockAssociationSet": [],
    "Tags": [
      {
        "Key": "Name",
        "Value": "my-public-subnet"
      }
    ],
    "SubnetArn": "arn:aws:ec2:us-east-1:<account-id>:subnet/<subnet-id>",
    "SubnetId": "<subnet-id>",
    "State": "available",
    "VpcId": "<vpc-id>",
    "CidrBlock": "10.0.1.0/24",
    "AvailableIpAddressCount": 251,
    "AvailabilityZone": "us-east-1a",
    "DefaultForAz": false,
    "MapPublicIpOnLaunch": false
  }
}
```

Command used to create the private subnet:

```bash
aws ec2 create-subnet \
  --vpc-id <vpc-id> \
  --cidr-block 10.0.2.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=my-private-subnet}]' \
  --output json
```

Snippet of the returned JSON for the private subnet (truncated):

```json
{
  "Subnet": {
    "AvailabilityZoneId": "use1-az1",
    "MapCustomerOwnedIpOnLaunch": false,
    "OwnerId": "<account-id>",
    "AssignIpv6AddressOnCreation": false,
    "Ipv6CidrBlockAssociationSet": [],
    "Tags": [ { "Key": "Name", "Value": "my-private-subnet" } ],
    "SubnetArn": "arn:aws:ec2:us-east-1:<account-id>:subnet/<subnet-id>",
    "SubnetId": "<subnet-id>",
    "State": "available",
    "VpcId": "<vpc-id>",
    "CidrBlock": "10.0.2.0/24",
    "AvailableIpAddressCount": 251,
    "AvailabilityZone": "us-east-1a",
    "DefaultForAz": false,
    "MapPublicIpOnLaunch": false
  }
}
```

Make this subnet a "public" subnet
----------------------------------

## Step 3 — Create and attach Internet Gateway

```bash
aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=my-igw}]' \
  --output json
```

```json
{
  "InternetGateway": {
    "Attachments": [],
    "InternetGatewayId": "<internet-gateway-id>",
    "OwnerId": "<account-id>",
    "Tags": [
      {
        "Key": "Name",
        "Value": "my-igw"
      }
    ]
  }
}
```

```bash
aws ec2 attach-internet-gateway \
  --internet-gateway-id <internet-gateway-id> \
  --vpc-id <vpc-id>
```

(This command attaches the IGW created earlier to your VPC so the VPC can route traffic to/from the internet.)


Example steps (replace placeholders with your IDs):

Private subnet guidance
-----------------------

- A private subnet should not have a direct route to an Internet Gateway (IGW). Instances in this subnet will not be directly reachable from the internet.
- For outbound internet access from instances in a private subnet (e.g., to download updates), create a NAT Gateway (in a public subnet) or a NAT instance, then add a route from the private subnet's route table to the NAT.


## Architecture Diagram

The following diagram represents the infrastructure created using the AWS CLI.
It includes:
- One custom VPC (10.0.0.0/16)
- One public subnet (10.0.1.0/24)
- One private subnet (10.0.2.0/24)
- An Internet Gateway attached to the VPC

Route tables and NAT Gateway configuration are discussed but were not yet
implemented at this stage.



NB//:Example steps (replace placeholders with your IDs):




