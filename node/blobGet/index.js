module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const getBlob = JSON.stringify(context.bindings.inputBlob)

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: getBlob
    };
}


