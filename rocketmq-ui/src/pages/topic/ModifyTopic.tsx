import { Button, Form, message } from 'antd';
import { BetaSchemaForm } from '@ant-design/pro-form';
import HttpRequest from '@/utils/HttpRequest';
import { defaultDomain } from '@/config/domain';
import { useRef } from 'react';

export interface UpdateTopic {

  brokerName: string;
  readQueueNums: number;
  search: boolean;
  writeQueueNums: number;
  topicSynFlag: number;

}

export  function ModifyTopic(props: { record: { mv: boolean; topic: string; }; }) {

  const formRef=useRef();
  const [form] = Form.useForm();
  return (

      <BetaSchemaForm<UpdateTopic>
        form={form}
        formRef={formRef}
        key='updateTopic'
        title='修改主题'
        trigger={
          <Button type="link">Topic管理</Button>
        }
        layoutType='ModalForm'
        width={800}
        onFinish={async (values) => {
          console.log(">>update >> ",values);
          //{"clusterNameList":null,"brokerNameList":["broker-v"],
          // "topicName":"BMW_test1_dts_goods_topic_a",
          // "writeQueueNums":4,"readQueueNums":4,"perm":6,"order":false}
          //topic/createOrUpdate.do

          const res = await HttpRequest({
            baseURL: defaultDomain,
            url: '/topic/createOrUpdate.do',
            method: 'POST',
            params: values,
          });
          // @ts-ignore
          const status = res.status;
          if(status===0){
            message.success("更新成功");
          }else{
            message.error("更新失败"+res.errMsg)
          }

          return true;
        }}
        onVisibleChange={(async (v) => {
          props.record.mv = v;
          console.log("rv=", v)
          if (props.record.mv) {
            const res = await HttpRequest({
              baseURL: defaultDomain,
              url: '/topic/examineTopicConfig.query?topic=' + props.record.topic,
              method: 'GET',
              params: {},
            });
            // @ts-ignore
            const data = res.data;
            console.log(">>>>>>>>>>", data)
            let queueData = {
              brokerNameList: [],
            };
            if (data) {
              const i = 0;
              const brokerList=[];
              queueData={
                // @ts-ignore
                writeQueueNums: data[i].writeQueueNums,
                perm: data[i].perm,
                readQueueNums: data[i].readQueueNums,
                topicName: data[i].topicName,
              };
              for(const n in  data[i].brokerNameList) {
                const d=data[i].brokerNameList[n];
                brokerList.push({ label:d,value:d});
              }
              // @ts-ignore
              queueData.brokerNameList=brokerList;
            }
            // @ts-ignore
            form.setFieldsValue(
                {
                ... queueData
               }
            );
            console.log("current",formRef.current,queueData);
          }
        })}

        columns={[
          { title: 'BROKER_NAME', dataIndex: 'brokerNameList', readonly: true,valueType:'select' ,
            fieldProps: {
              mode: 'multiple',
              placeholder: '订阅组',
            }},
          { title: '主题名', dataIndex: 'topicName', editable: false },
          { title: '读队列数量', dataIndex: 'readQueueNums' },
          { title: '写队列数量', dataIndex: 'writeQueueNums' },
          { title: 'perm', dataIndex: 'perm' }
        ]} />
  )

}
