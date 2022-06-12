import json
import logging

import azure.functions as func


def main(req: func.HttpRequest,outputBlob: func.Out[func.InputStream] ) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    objectFunction = {'name': name, 'job':'fullstack'}
    objectFunction = json.dumps(objectFunction)
    outputBlob.set(objectFunction)
    
    if name:
        return func.HttpResponse(f"Hello, {name}. {objectFunction} and last for least")
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )
