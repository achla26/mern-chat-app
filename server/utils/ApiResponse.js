class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        if (data && typeof data === 'object' && !Array.isArray(data)) {
            Object.assign(this, data);
        } else {
            this.data = data;
        }
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }