import logging
import azure.functions as func
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient, __version__
import os
from azure.identity import DefaultAzureCredential


# blob connection
connect_str = os.getenv('AzureWebJobsStorage')
conn = "DefaultEndpointsProtocol=https;AccountName=<accountName>;AccountKey=<accountKey>;EndpointSuffix=core.windows.net"
blob_service_client = BlobServiceClient.from_connection_string(conn)
container_client = blob_service_client.get_container_client("functionstorage")
default_credential = DefaultAzureCredential()



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
