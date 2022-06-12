#!/bin/bash

location=westus
rgname=DanielGridin
planname=pocselaplan2
sku=P1V3
storagename=selastoragepoc2
storagesku=Standard_LRS
functionapp=selafunctionpocdeploy2
name=$(tr -dc a-z </dev/urandom | head -c 10) #generate random 10 lower case latters for db name
account="msdocs-account-cosmos-$name" #needs to be lower case
database=msdocs-db-mongo-cosmos
gitrepo=https://github.com/eyalrainitz/AzureFunction

# az login
# subscription="<subscriptionId>" # add subscription here
# az account set -s $subscription # ...or use 'az login'
# az login --service-principal -u <app-id> -p <password-or-cert> --tenant <tenant>
echo "Creating resourceGroup"
az group create --name $rgname --location $location
echo "Creating plan"
az appservice plan create --resource-group $rgname --name $planname --is-linux --sku $sku
echo "Creating storage"
az storage account create --name $storagename --location $location --resource-group $rgname --sku $storagesku
echo "Creating functionapp Node"
az functionapp create --name "selafunctionpocnode2" --storage-account $storagename --plan $planname --os-type "Linux" --resource-group $rgname --functions-version "4" --runtime "node"  --deployment-source-url $gitrepo --deployment-source-branch nodeFunction
echo "Creating functionapp python"
az functionapp create --name "selafunctionpython2" --storage-account $storagename --plan $planname --os-type "Linux" --resource-group $rgname --functions-version "4" --runtime "python"  --deployment-source-url $gitrepo --deployment-source-branch pythonFunctions
# Create an Azure Cosmos DB database account using the same function app name.
echo "Creating account"
az cosmosdb create --name $account --resource-group $rgname --default-consistency-level Eventual --locations regionName=$location failoverPriority=0 isZoneRedundant=False --capabilities EnableServerless
echo "Creating database"
az cosmosdb sql database create --account-name $account --resource-group $rgname --name $database
# Get the Azure Cosmos DB connection string.
endpoint=$(az cosmosdb show --name $account --resource-group $rgname --query documentEndpoint --output tsv)
key=$(az cosmosdb keys list --name $account --resource-group $rgname --query primaryMasterKey --output tsv)
# Configure function app settings to use the Azure Cosmos DB connection string.
az functionapp config appsettings set --name "selafunctionpocnode2" --resource-group $rgname --setting cosmospocselapoc_DOCUMENTDB="AccountEndpoint=$endpoint;AccountKey=$key;"
az functionapp config appsettings set --name "selafunctionpython2" --resource-group $rgname --setting cosmospocselapoc_DOCUMENTDB="AccountEndpoint=$endpoint;AccountKey=$key;"