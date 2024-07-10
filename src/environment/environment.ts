const ssoAuthenticationFlow: 'code' | 'password' = 'code'
let serviceEndpoint = "https://localhost:8001";
let userManagementEndpoint = "https://localhost:6001";
let identityEndpoint = "https://localhost:7001";

export function getServiceUrl() {
    return `${serviceEndpoint}/api/`;
}

export function getUserManagementUrl() {
    return `${userManagementEndpoint}/api/`;
}

export function getIdentityUrl() {
    return `${identityEndpoint}/api/`;
}

export function getLoginUrl() {
    return `${identityEndpoint}/connect/token`;
}

export const environment = {
    appVersion: '1.0.0',
    production: false,
    ssoAuthenticationFlow
};