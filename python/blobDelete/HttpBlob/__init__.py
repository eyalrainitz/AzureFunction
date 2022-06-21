import logging

import azure.functions as func
from azure.storage.blob import ContainerClient
import os

def removeBlob(name):
    connection_string = os.getenv("AzureWebJobsStorage")
    blob_service_client = BlobServiceClient.from_connection_string(conn_str = connection_string)
    container_client = blob_service_client.get_container_client("functionstorage")

    try:
        container_client.delete_blobs(name)
        return True
    except:
        logging.info("could not remove")
        return False


def main(req: func.HttpRequest, inputBlob: str) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    
    name = req.params.get('name')
    obj = inputBlob.encode()
    logging.info(obj)
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')
        
    if name:
        item =  removeBlob(name)
        return func.HttpResponse(f"{item}")
    else:
        return func.HttpResponse(
             "pass name to remove item from blob",
             status_code=200
        )
