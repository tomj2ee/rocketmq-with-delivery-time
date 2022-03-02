import { Button, Table } from 'antd';
import HttpRequest from '@/utils/HttpRequest';
import { defaultDomain } from '@/config/domain';
import { ModalForm } from '@ant-design/pro-form';
import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { FormatDateTime } from '@/utils/DateTime';

export  function ConsumerView(props: { record: { cv: boolean; topic: string; }; }) {

  const [brokerData, setBrokerData] = useState([]);
  const [loadings,setLoadings]=useState(false);

  const expandedRowRender = (record: readonly Record<string, any>[] | undefined) => {
    const columns = [
      { title: 'Broker', dataIndex: 'brokerName', search: false, key: 'serverName', },
      { title: '队列', dataIndex: 'queueId', search: false, key: 'queueId', },
      { title: '消费者终端', dataIndex: 'clientInfo', search: false, key: 'clientInfo', },
      { title: '代理者位点', dataIndex: 'brokerOffset', search: false, key: 'brokerOffset', },
      { title: '消费者位点', dataIndex: 'consumerOffset', search: false, key: 'consumerOffset', },
      {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        title: '差值\t', search: false, key: 'offset', render: (dom: any, record: { brokerOffset: number; consumerOffset: number; }) => <div>{record.brokerOffset-record.consumerOffset}</div>
      },
      { title: '上次时间', dataIndex: 'lastTimestamp', search: false, key: 'lastTimestamp',
        // eslint-disable-next-line @typescript-eslint/no-shadow
        render: (dom: any, record: { lastTimestamp: number; }) => <div>{FormatDateTime(record.lastTimestamp/1000)}</div>


      },
    ];
    // @ts-ignore
    return <Table columns={columns} dataSource={record.dataList} pagination={false} />;
  }

  // @ts-ignore
  return (
    <ModalForm
      key="consumerView"
      title={`[${props.record.topic}]订阅组`}
      onVisibleChange={(async (v) => {
        props.record.cv = v;
        if (props.record.cv) {
          setLoadings(true);
          const res = await HttpRequest({
            baseURL: defaultDomain,
            url: '/topic/queryConsumerByTopic.query?topic=' + props.record.topic,
            method: 'GET',
            params: {},
          });
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const data = res.data;
          const queueItemList = [];
          if (data) {
            for (const i in data) {
              queueItemList.push({
                key: i,
                group: i,
                topic: data[i].topic,
                diffTotal: data[i].diffTotal,
                lastTimestamp: data[i].lastTimestamp,
                dataList: data[i].queueStatInfoList
              });
            }
          }
          // @ts-ignore
          setBrokerData(queueItemList);
          setLoadings(false);
          console.log("queueItemList>>", queueItemList)
        }
      })}
      trigger={
        <Button type="link">
          Consumer订阅
        </Button>
      }
      width="80%"
      onFinish={async () => true}
    >
      <PageContainer key={'mainContainer'}>
        <Table
          loading={loadings}
          rowKey="key"
          search={false}
          toolbar={[]}
          toolBarRender={false}
          scroll={{ x: 800 }}
          dataSource={brokerData}
          columns={[
            { title: '订阅组', dataIndex: 'group', key: 'group' },
            { title: '延迟', dataIndex: 'diffTotal', key: 'diffTotal' },
            { title: '最后消费时间', dataIndex: 'lastTimestamp', key: 'lastTimestamp',
              render: (dom: any, record: { lastTimestamp: number; }) => <div>{FormatDateTime(record.lastTimestamp/1000)}</div>
            },
          ]}
          pagination={{ pageSize: 5 }}
          // @ts-ignore
          expandable={{ expandedRowRender }}

        />
      </PageContainer>


    </ModalForm>
  )

}
