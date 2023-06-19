export async function handleResponse(response) {
    if (response.status === 200) return response.data;
    if (response.status !== 200) {
        const error = await response.data;

        throw new Error(error);
    }

    throw new Error("Network response was not ok.");
}
  
export function handleErrorMessage(error) {
    const response = error;

    if (response.status === 400) {
        return response.data;
    }
    if (response.status === 401) {
        return response.data;
    }

    throw error;
}
  
export function handleError(error) {
    console.error("API call failed. " + error);
    throw error;
}
  
export function handle400(title, data) {
    const message = [];
    
    data.map((row) => {               
        const index = message.findIndex((msg) => msg.field === row.field); 

        if (index === -1) {
            message.push({
                field: row.field,
                message: row.errors
            });
        } else {
            message[index].message = message[index].message + ", " + row.errors;
        }

        return row;
    });

    if (message) return {
        status: 400,
        title: title,
        message: message,
    };

    throw new Error("Network response was not ok.");
}