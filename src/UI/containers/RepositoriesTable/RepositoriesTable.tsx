import React, {useContext, useEffect, useState} from 'react';
import {Table} from 'antd';
import {Responsive, Status, StatusLabels} from "../../../common/consts/enums";
import CustomTag from "../../components/CustomTag/CustomTag";
import RepoFetcher from "../../../Infrastructure/fetchers/RepoFetcher";
import RepoModel from "../../../common/models/Repo.model";
import LoadingContext from "../../react-contexts/LoadingContext";
import AuthorCell from "../../components/AuthorCell/AuthorCell";
import Description from "../../components/Description/Description";
import Translation from "../../../common/locales/en-US/translation"

const RepositoriesTable = () => {

    const [filters, setFilters] = useState<any>({})
    const [sort, setSort] = useState<any>({})
    const [repositories, setRepositories] = useState<RepoModel []>([])
    const [labels, setLabels] = useState<string []>([])
    const {setLoading} = useContext(LoadingContext);


    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        getLabels()
    }, [repositories])

    const fetchData = async () => {
        setLoading(true)
        const {data} = await RepoFetcher.getRepositories()
        setRepositories(convertToRepoModel(data))
        setLoading(false)
    }

    const convertToRepoModel = (data: any) => {
        return data.map((val) => {
            return new RepoModel(val)
        })
    }

    const getLabels = () => {
        const labelsDict = {}
        repositories.forEach(repo => {
            repo.labels.forEach(label => {
                if (!labelsDict.hasOwnProperty(label)) {
                    labelsDict[label] = true
                }
            })
        })

        const labelArray = Object.keys(labelsDict).map(key => (key))
        setLabels(labelArray)
    }

    const handleChange = (pagination, filters, sorter) => {
        setSort(sorter)
        setFilters(filters)
    }


    const columns = [
        {
            title: Translation.columns.number.title,
            dataIndex: Translation.columns.number.key,
            key: Translation.columns.number.key,
            sorter: (a, b) => Number(a.number) - Number(b.number),
            sortOrder: sort.columnKey === Translation.columns.number.key && sort.order,
            width: 80,
            responsive: [Responsive.EXTRA_SMALL, Responsive.SMALL_MEDIUM, Responsive.MEDIUM,Responsive.LARGE],
        },
        {
            title: Translation.columns.title.title,
            dataIndex: Translation.columns.title.key,
            key: Translation.columns.title.key,
            sorter: (a, b) => a.title.localeCompare(b.title),
            sortOrder: sort.columnKey === Translation.columns.title.key && sort.order,
            width: 370,
            responsive: [Responsive.EXTRA_SMALL, Responsive.SMALL_MEDIUM, Responsive.MEDIUM,Responsive.LARGE],
        },
        {
            title: Translation.columns.author.title,
            dataIndex: Translation.columns.author.key,
            key: Translation.columns.author.key,
            width: 120,
            render: author => <AuthorCell imagePath={author.image} authorName={author.name}/>,
            responsive: [Responsive.MEDIUM,Responsive.LARGE],
        },
        {
            title: Translation.columns.status.title,
            dataIndex: Translation.columns.status.key,
            key: Translation.columns.status.key,
            filters: Object.keys(Status).map(key => ({text: StatusLabels[key], value: Status[key]})),
            width: 100,
            render: tag => <CustomTag tagType={tag}/>,
            filteredValue: filters.status || null,
            onFilter: (value, record) => record.status.includes(value),
            responsive: [Responsive.EXTRA_SMALL, Responsive.SMALL_MEDIUM, Responsive.MEDIUM,Responsive.LARGE],
        },
        {
            title: Translation.columns.labels.title,
            dataIndex: Translation.columns.labels.key,
            key: Translation.columns.labels.key,
            filters: labels.map(label => ({text: label, value: label})),
            filteredValue: filters.labels || null,
            width: 350,
            onFilter: (value, record) => record.labels.includes(value),
            render: labels => (
                <>
                    {
                        labels.map(label => (
                            <CustomTag tagType={label} color={'geekblue'}/>
                        ))
                    }
                </>
            ),
            responsive: [Responsive.MEDIUM,Responsive.LARGE],
        },
        {
            title: Translation.columns.date.title,
            dataIndex: Translation.columns.date.key,
            key: Translation.columns.date.key,
            responsive: [Responsive.EXTRA_SMALL, Responsive.SMALL_MEDIUM, Responsive.MEDIUM,Responsive.LARGE],
        },
    ];

    return (
        <Table columns={columns} dataSource={repositories} onChange={handleChange}
               expandable={{
                   expandedRowRender: record => <Description authorImage={record.author.image}
                                                             authorName={record.author.name} date={record.creationDate}
                                                             description={record.description}/>,

                   rowExpandable: record => record.description !== '' || record.description !== null,
               }}
               pagination={{position: ['bottomCenter']}}
        />
    );
};

export default RepositoriesTable;