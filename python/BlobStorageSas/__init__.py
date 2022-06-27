import logging
from datetime import datetime, timedelta
import azure.functions as func
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient, __version__, generate_account_sas, ResourceTypes, AccountSasPermissions
import os

# blob connection
connect_str = os.getenv('AzureWebJobsStorage')
conn = "DefaultEndpointsProtocol=https;AccountName=<accountName>;AccountKey=<accountKey>;EndpointSuffix=core.windows.net"
blob_service_client = BlobServiceClient.from_connection_string(conn)
container_client = blob_service_client.get_container_client("functionstorage")

# generate sas token for using SAS
sas_token = generate_account_sas(
    account_name= "<accountName>",
    account_key= "<accountKey>",
    resource_types=ResourceTypes(service=True),
    permission=AccountSasPermissions(read=True, write=True, delete=True),
    expiry=datetime.utcnow() + timedelta(hours=5)
)
blob_service_client_SAS = BlobServiceClient(account_url="https://<accountName>.blob.core.windows.net", credential=sas_token)


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')
    try:
        blob_client = container_client.get_blob_client(f"{name}.json")
        item = blob_client.delete_blob()
    except ValueError:
        return func.HttpResponse("need to enter file name" )

    if name:
        if item is None:
            return func.HttpResponse(f"item deleted")
