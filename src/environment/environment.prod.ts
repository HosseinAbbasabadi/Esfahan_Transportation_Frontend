

const ssoAuthenticationFlow: 'code' | 'password' = 'code'
let serviceEndpoint = "https://localhost:5001";
let userManagementEndpoint = "https://localhost:6001";
let identityEndpoint = "https://localhost:7001";

// let serviceEndpoint = "http://172.30.12.172:8881";
// let userManagementEndpoint = "http://172.30.12.172:8883";
// let identityEndpoint = "http://172.30.12.172:8882";


// let serviceEndpoint = "http://192.168.50.58:8881";
// let userManagementEndpoint = "http://192.168.50.58:8883";
// let identityEndpoint = "http://192.168.50.58:8882";

export function getServiceUrl() {
    return `${serviceEndpoint}/api/`
}
export function getUserManagementUrl() {
    return `${userManagementEndpoint}/api/`;
}
export function getIdentityUrl() {
    return `${identityEndpoint}/api/`
}





export function getLoginUrl() {
    return `${identityEndpoint}/connect/token`
}

export const environment = {
    appVersion: '1.0.0',
    production: true,
    ssoAuthenticationFlow
}