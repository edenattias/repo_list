const env = 'local'

interface IConfigEnvironment {
    apiBaseHost: string;
}

export interface IClientConfig extends IConfigEnvironment {
}

const LOCAL_SERVER = 'localhost:3000';


const local: IConfigEnvironment = {
    apiBaseHost: `http://${LOCAL_SERVER}`,
};

const envConfigs = {
    local,
};

const ClientConfig: IClientConfig = {
    // Get all environment configurations
    ...envConfigs[env],
};

export default ClientConfig;