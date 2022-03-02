import { Button, Tabs } from 'antd';
import ProTable from '@ant-design/pro-table';
import HttpRequest from '@/utils/HttpRequest';
import { defaultDomain } from '@/config/domain';
import { ModalForm } from '@ant-design/pro-form';
import { useState } from 'react';

const { TabPane } = Tabs;
export  function RouteView(props: { record: { rv: boolean; topic: string; }; }) {

  const [brokerData,setBrokerData] =useState([]);
  const [queueData,setQueueData] =useState([]);
  const [loading,setLoading]=useState(false);


  return (
    <ModalForm
      key="routeView"
      title={`[${props.record.topic}]路由`}
      onVisibleChange={(async (v) => {
        props.record.rv = v;
        if (props.record.rv) {
          setLoading(true);
          const res = await HttpRequest({
            baseURL: defaultDomain,
            url: '/topic/route.query?topic=' + props.record.topic,
            method: 'GET',
            params: {},
          });
          // @ts-ignore
          const data = res.data;

          const itemList = data?.queueDatas;
          const queueItemList = [];
          if (itemList) {
            for (const i in itemList) {
              queueItemList.push({
                writeQueueNums: itemList[i].writeQueueNums,
                brokerName: itemList[i].brokerName,
                perm: itemList[i].perm,
                readQueueNums: itemList[i].readQueueNums,
                topicSynFlag: itemList[i].topicSynFlag,
              });
            }
          }
          const brokerDataList = data?.brokerDatas;
          const brokerItemList = [];
          if (brokerDataList) {
            for (const i in brokerDataList) {
              const addrList=brokerDataList[i].brokerAddrs;
              const adds=[];
              if(addrList){
              for(const index in addrList){
                    const adder=addrList[index];
                    if(adder){
                      adds.push(adder);
                    }
                  }
              }
              brokerItemList.push({
                cluster: brokerDataList[i].cluster,
                brokerName: brokerDataList[i].brokerName,
                brokerAddrs: adds.join(",")
              });
            }
          }
          // @ts-ignore
          setQueueData(queueItemList);
          // @ts-ignore
          setBrokerData(brokerItemList);
          setLoading(false);

        }
      })}
      trigger={
        <Button type="link">
          路由
        </Button>
      }
      width="80%"
      onFinish={async () => true}

    >

      <Tabs defaultActiveKey="1"   >

        <TabPane tab="broker信息" key="1">
          <ProTable
            loading={loading}
            rowKey="bro_tab"
            search={false}
            toolbar={[]}
            toolBarRender={false}
            scroll={{ x: 800 }}
            pagination={false}
            dataSource={brokerData}
            request={() => {
              // 表单搜索项会从 params 传入，传递给后端接口。
              return Promise.resolve({
                data: brokerData,
                success: true,
              });
            }}
            columns={[
              { title: 'cluster', dataIndex: 'cluster', search: false },
              { title: 'brokerName', dataIndex: 'brokerName', search: false },
              { title: 'brokerAddrs', dataIndex: 'brokerAddrs', search: false },
            ]} />
        </TabPane>

        <TabPane tab="队列信息" key="2">
          <ProTable
            loading={loading}
            rowKey="que_tab"
            search={false}
            toolbar={[]}
            toolBarRender={false}
            scroll={{ x: 800 }}
            pagination={false}
            dataSource={queueData}
            request={() => {
              // 表单搜索项会从 params 传入，传递给后端接口。
              return Promise.resolve({
                data: queueData,
                success: true,
              });
            }}
            columns={[
              { title: 'brokerName', dataIndex: 'brokerName', search: false },
              { title: 'perm', dataIndex: 'perm', search: false },
              { title: 'readQueueNums', dataIndex: 'readQueueNums', search: false },
              { title: 'writeQueueNums', dataIndex: 'writeQueueNums', search: false },
              { title: 'topicSynFlag', dataIndex: 'topicSynFlag', search: false }
            ]} />

        </TabPane>

      </Tabs>

    </ModalForm>
  )

}
