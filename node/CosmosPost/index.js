module.exports = async function (context, req) {
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered."
        : "This HTTP triggered function executed successfully";
    const max = ( Math.max(...context.bindings.inputDocument.map(x => x.id))+1).toString()
    if (name) {
        context.bindings.outputDocument = JSON.stringify({
            // create a random ID
            id: max,
            name: name
        });
    }
    const dataname = context.bindings.inputDocument.map(x => x.name)
    const data = JSON.stringify(dataname)
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: data
    };
}


