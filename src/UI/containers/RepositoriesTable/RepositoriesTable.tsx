import React, {useContext, useEffect, useState} from 'react';
import {Table} from 'antd';
import {Status} from "../../../common/consts/enums";
import CustomTag from "../../components/CustomTag/CustomTag";
import RepoFetcher from "../../../Infrastructure/fetchers/RepoFetcher";
import RepoModel from "../../../common/models/Repo.model";
import LoadingContext from "../../react-contexts/LoadingContext";
import AuthorCell from "../../components/AuthorCell/AuthorCell";


const RepoTable = () => {

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
            title: 'Repo-Number',
            dataIndex: 'number',
            key: 'number',
            sorter: (a, b) => Number(a.number) - Number(b.number),
            sortOrder: sort.columnKey === 'number' && sort.order,
            width: 150
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.length - b.title.length,
            sortOrder: sort.columnKey === 'title' && sort.order,
            width: 250
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
            render: author => <AuthorCell imagePath={author.image} authorName={author.name}/>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                {text: 'Draft', value: Status.draft},
                {text: 'Open', value: Status.open},
                {text: 'Closed', value: Status.closed}
            ],
            render: tag => <CustomTag tagType={tag}/>,
            filteredValue: filters.status || null,
            onFilter: (value, record) => record.status.includes(value),
        },
        {
            title: 'Labels',
            dataIndex: 'labels',
            key: 'labels',
            filters: labels.map(label => ({text: label, value: label})),
            filteredValue: filters.labels || null,
            width: 250,
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
        },
        {
            title: 'Creation Date',
            dataIndex: 'creationDate',
            key: 'creationDate',
        },
    ];

    return (
        <Table columns={columns} dataSource={repositories} onChange={handleChange}
               expandable={{
                   expandedRowRender: record => <p style={{margin: 0}}>{record.description}</p>,
                   rowExpandable: record => record.description !== '' || record.description !== null,
               }}/>
    );
};

export default RepoTable;