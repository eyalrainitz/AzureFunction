import json
import logging

import azure.functions as func


def main(req: func.HttpRequest, inputDocument:func.DocumentList) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    logging.info(type(inputDocument.data))
    logging.info(type(inputDocument))
    name = req.params.get('name')
    number = req.params.get('number')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')
            number = int(req_body.get('number'))
    if name or number:
        data = inputDocument.data[(number)]['name']
        logging.info(data)
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully." + data)
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )
    