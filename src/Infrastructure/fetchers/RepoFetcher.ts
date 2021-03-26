import {BaseHttpFetcher} from "./BaseHttpFetcher";
import ClientConfig from "../../common/config";

class RepoFetcher extends BaseHttpFetcher {

    async getRepositories() {
        try {
            return await this.get('/prs', {}, {})
        } catch (err) {
            throw err
        }
    }

}

export default new RepoFetcher('api/vcs', ClientConfig.apiBaseHost);