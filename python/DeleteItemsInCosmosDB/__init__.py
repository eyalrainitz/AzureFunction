import logging
import azure.functions as func
import os
from azure.cosmos import CosmosClient
# cosmos connection
key = "<cosmosKEY"
endpoint = "https://<CosmosEndPoint>.documents.azure.com:443/"
client = CosmosClient(endpoint, credential=key, consistency_level='Session')
DATABASE_NAME = 'SampleDB'
CONTAINER_NAME = 'leases'
database = client.get_database_client(DATABASE_NAME)
container = database.get_container_client(CONTAINER_NAME)

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

    obj = False
    lis = []
    queryItems = f'SELECT * FROM c'
    try:
        for item in container.query_items(query=f'SELECT * FROM c', enable_cross_partition_query=True):
            lis.append(item)
            print(f'item {item}')
            container.delete_item(item, partition_key=item["id"])
            return func.HttpResponse("deleted item")
    except:
        print("item dont work")
        return func.HttpResponse("item not deleted")

