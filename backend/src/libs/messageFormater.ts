export const messageFormater = (
    success: boolean,
    message?: string,
    data?: any,
    statusCode?: number,
    schema?: any
) =>{
    return {
        success,
        message,
        data,
        statusCode,
        schema
    }
}