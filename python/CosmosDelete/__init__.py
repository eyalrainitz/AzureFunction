import json
import logging

import azure.functions as func


def main(req: func.HttpRequest,outputDocument :func.Out[func.Document],inputDocument: func.DocumentList) ->  func.HttpResponse:
    logging.info(inputDocument)
    inputuser =  str(len(inputDocument.data)+1)
    logging.info(str(inputuser))
    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')
    if name:
        newdoc = func.DocumentList()
        newuser = {"id":inputuser,"name":name}
        newdoc.append(func.Document.from_dict(newuser))
        outputDocument.set(newdoc)
        return  func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    else:
        return  func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response."
        )
