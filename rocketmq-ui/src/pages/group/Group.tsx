import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import HttpRequest from '@/utils/HttpRequest';
import {defaultDomain} from '@/config/domain';
import {ConsoleView} from '@/pages/group/ConsoleView';
import {DeleteGroupView} from '@/pages/group/DeleteGroupView';
import UpdateConsumer from "@/pages/group/UpdateConsumer";


import {ProFormInstance} from "@ant-design/pro-form";

const Group: React.FC = () => {
  const actionRef = useRef<ProFormInstance>()
  const [dataSource, setDataSource] = useState([])
  const [oldDataSource, setOldDataSource] = useState([])
  const [searchTxt, setSearchTxt] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // @ts-ignore
    filterAllData()
  }, [searchTxt, oldDataSource])

  function doChange(v: { currentTarget: { value: any; }; }) {
    let txt = v.currentTarget.value
    if (txt && txt.trim().length > 0) {
      setSearchTxt(txt)
    }
  }
  function filterAllData() {
    setLoading(true)
    let groupList = []
    groupList = filterSearchGroup(oldDataSource)
    setDataSource(groupList)
    setLoading(false)
  }

  function filterSearchGroup(groupDataList: never[]) {
    const groupList: never[] = []
    if (searchTxt && searchTxt.trim().length > 0) {
      let s = searchTxt.trim().toLowerCase()
      for (let i in groupDataList) {
        // @ts-ignore
        if (groupDataList[i].group.toLowerCase().indexOf(s) != -1) {
          groupList.push(groupDataList[i])
        }
      }
      return groupList
    } else {
      return groupDataList
    }
  }

  const queryParams = [
    {
      title: '订阅组',
      align: 'center',
      width: 200,
      dataIndex: 'group',
      search: true,
      fieldProps: {
        onChange: doChange,
      },
      render: (_dom: any, record: { group: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
        let tp = record.group
        if (searchTxt && searchTxt.trim().length > 0) {
          if (typeof tp === "string") {
            tp = tp.replace(
              searchTxt,
              "<font color='red'>" + searchTxt + '</font>'
            )
          }

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
              {record.group}
            </div>
          )
        }
      },
    },
    { title: '数量', align: 'center', dataIndex: 'count', search: false },
    { title: '版本', align: 'center', dataIndex: 'version', search: false },
    {
      title: '类型',
      align: 'center',
      dataIndex: 'messageModel',
      search: false,
    },
    { title: '模式', align: 'center', dataIndex: 'consumeType', search: false },
    { title: 'TPS', align: 'center', dataIndex: 'consumeTps', search: false },
    { title: '延迟', align: 'center', dataIndex: 'diffTotal', search: false },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'action',
      search: false,
      render: (dom: any, record: any) => {
        return [
          <ConsoleView key={'consoleView-' + record.group} record={record} />,
          '  ',
          <UpdateConsumer
            key={'updateConsumer-' + record.group}
            record={record}
          />,
          '  ',
          <DeleteGroupView
            key={'groupDeleteView'}
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
    <PageContainer key="gc">
      <ProTable
        rowKey="group"
        formRef={actionRef}
        search={{ labelWidth: 'auto' }}
        scroll={{ x: 800 }}
        pagination={{ pageSize: 20 }}
        toolBarRender={false}
        dataSource={dataSource}
        loading={loading}
        request={async (params) => {
          setLoading(true)
          const res = await HttpRequest({
            baseURL: defaultDomain,
            url: '/consumer/groupList.query',
            method: 'GET',
            params: params,
          })
          console.log('res=', res)
          // @ts-ignore
          const data = res.data
          setDataSource(data)
          setOldDataSource(data)
          setLoading(false)
          return { data: data }
        }}
        // @ts-ignore
        columns={queryParams}
      />
    </PageContainer>
  )
}

export default Group
