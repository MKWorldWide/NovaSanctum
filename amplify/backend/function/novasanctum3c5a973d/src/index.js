exports.handler = async (event) => {
    console.log('EVENT:', JSON.stringify(event, null, 2));
    
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({
            message: 'Hello from NovaSanctum Lambda!',
            input: event
        })
    };
}; 