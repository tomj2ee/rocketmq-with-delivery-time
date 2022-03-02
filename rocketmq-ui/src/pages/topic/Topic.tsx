import React, {useEffect, useRef, useState} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { defaultDomain } from '@/config/domain';
import HttpRequest from '@/utils/HttpRequest';
import ProTable from '@ant-design/pro-table';
import { StatusView } from '@/pages/topic/StatusView';
import { RouteView } from '@/pages/topic/RouteView';
import { ModifyTopic } from '@/pages/topic/ModifyTopic';
import { ConsumerView } from '@/pages/topic/ConsumerView';
import { SendMessage } from '@/pages/topic/SendMessage';
import { ResetPoint } from '@/pages/topic/ResetPoint';
import { DeleteTopics } from '@/pages/topic/DeleteTopics';


const Topic: React.FC = () => {
  const actionRef = useRef()
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [oldDataSource, setOldDataSource] = useState([])
  const [checkValueList, setCheckValueList] = useState(['0'])
  const [searchValue, setSearchValue] = useState('')
  const typeFilter = {
    '0': '%',
    '1': '%R',
    '2': '%D',
    '3': '%S',
  }
  const lst = ['0', '1', '2', '3']

  function onChange(checkedValues: React.SetStateAction<string[]>) {
    console.log('checked = ', checkedValues)
    setCheckValueList(checkedValues)
  }

  useEffect(() => {
    console.log('change event')
    filterAllData()
  }, [checkValueList, oldDataSource, searchValue])

  function filterAllData() {
    setLoading(true)
    let topicList: any[] | ((prevState: never[]) => never[]) = []
    if (checkValueList && checkValueList.length > 0) {
      for (let i in lst) {
        if (checkValueList.indexOf(lst[i]) != -1) {
          topicList = topicList.concat(filterData(oldDataSource, lst[i]))
        }
      }
    } else {
      topicList = filterData(oldDataSource, '-1')
    }
    topicList = filterSearchTopics(topicList)
    // @ts-ignore
    setDataSource(topicList)
    setLoading(false)
  }
  function filterSearchTopics(topicList: any[]) {
    let dataList = []
    if (searchValue && searchValue.trim().length > 0) {
      let s = searchValue.trim().toLowerCase()
      for (let i in topicList) {
        if (topicList[i].topic.toLowerCase().indexOf(s) != -1) {
          dataList.push(topicList[i])
        }
      }
      return dataList
    } else {
      return topicList
    }
  }

  function filterData(source: never[], type: string) {
    let lst = []
    for (let i in source) {
      if (type === '-1' || filterByType(source[i], type)) {
        lst.push({
          topic: source[i],
          index: i + '-' + Math.random(),
        })
      }
    }
    return lst
  }

  function filterByType(str: string, type: string) {
    if (type == '0') {
      if (!str.startsWith('%')) {
        return true
      }
    } else {
      if (str.startsWith(typeFilter[type])) {
        return true
      }
    }
    return false
  }

  function doChange(t: { currentTarget: { value: React.SetStateAction<string>; }; }) {
    console.log(' text change v=', t.currentTarget.value)
    setSearchValue(t.currentTarget.value)
  }

  const valueEnum = {
    '0': { text: '普通', status: 'Default' },
    '1': { text: '重试', status: 'Processing' },
    '2': { text: '死信', status: 'Success' },
    '3': { text: '系统', status: 'Error' },
  }
  const queryParams = [
    {
      title: '主题',
      align: 'center',
      width: 260,
      dataIndex: 'topic',
      fieldProps: {
        onChange: doChange,
      },
      render: (dom: any, record: { topic: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
        let tp = record.topic
        if (searchValue && searchValue.trim().length > 0) {
          if (typeof tp === "string") {
            tp = tp.replace(
              searchValue,
              "<font color='red'>" + searchValue + '</font>'
            )
          }
          // @ts-ignore
          return (
            <div
              style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
              // eslint-disable-next-line react/no-danger
              // @ts-ignore
              dangerouslySetInnerHTML={{ __html: tp }}
            />
          )
        } else {
          return (
            <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
              {record.topic}
            </div>
          )
        }
      },
      search: true,
    },
    {
      title: 'topic类型',
      align: 'center',
      width: 80,
      dataIndex: 'topic',
      hideInTable: false,
      search: false,
      render: (dom: any, record: { topic: any; }) => {
        let tp = record.topic
        if (!tp.startsWith('%')) {
          return '普通'
        } else if (tp.startsWith('%R')) {
          return '重试'
        } else if (tp.startsWith('%D')) {
          return '死信'
        } else if (tp.startsWith('%S')) {
          return '系统'
        }
        return '-'
      },
    },

    {
      title: '',
      align: 'center',
      dataIndex: 'mapType',
      hideInTable: true,
      search: true,
      initialValue: ['0'],
      valueEnum,
      valueType: 'checkbox',
      fieldProps: {
        onChange: onChange,
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      search: false,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // @ts-ignore
      render: (dom, record) => {
        return [
          <StatusView key={'statusView'} record={record} />,
          '  ',

          <RouteView key={'routeView'} record={record} />,
          '  ',

          <ConsumerView key={'consumerView'} record={record} />,
          '  ',

          <ModifyTopic key={'modifyView'} record={record} />,
          '  ',

          <SendMessage key={'sendMsgView'} record={record} />,
          '  ',

          <ResetPoint key={'resetPoint'} record={record} />,
          '  ',

          <DeleteTopics
            key={'deleteTopics'}
            record={record}
            action={actionRef.current}
          />,
          '  ',
        ]
      },
    },
  ]

  // @ts-ignore
  return (
    <PageContainer key="pc">
      <ProTable
        rowKey="topic"
        search={{ labelWidth: 'auto' }}
        scroll={{ x: 800 }}
        pagination={{ pageSize: 20 }}
        toolBarRender={false}
        actionRef={actionRef}
        loading={loading}
        // @ts-ignore
        columns={queryParams}
        dataSource={dataSource}
        request={async (params) => {
          setLoading(true)
          // @ts-ignore
          const res = await HttpRequest({
            baseURL: defaultDomain,
            url: '/topic/list.query',
            method: 'GET',
            params: params,
          })
          console.log('res=', res)
          // @ts-ignore
          const data = res.data
          const itemList = data?.topicList
          const dataList = []
          // @ts-ignore
          const dList = []
          if (itemList) {
            for (const i in itemList) {
              dataList.push({
                index: i + '-' + Math.random(),
                topic: itemList[i],
              })
              dList.push(itemList[i])
            }
          }
          // @ts-ignore
          setOldDataSource(dList)
          // @ts-ignore
          setDataSource(dataList)
          setLoading(false)
          return { data: dataList }
        }}
      />
    </PageContainer>
  )
}

export default Topic
