import {Status} from "../consts/enums";
import moment from 'moment';

export default class RepoModel {

    key!: number

    title!: string

    number!: string

    description!: string

    author!: any

    status!: Status

    labels!: string []

    creationDate!: any

    constructor(repoDto: any) {
        if (repoDto) {
            this.key = Number(repoDto.number)
            this.author = {name: repoDto.user.login, image: repoDto.user.avatar_url}
            this.creationDate = moment(new Date(repoDto.created_at)).format('DD/MM/YYYY')
            this.title = repoDto.title
            this.labels = repoDto.labels.map(label => (label.name))
            this.status = Status[repoDto.state]
            this.description = repoDto.base.repo.description
            this.number = repoDto.number
        }
    }

}