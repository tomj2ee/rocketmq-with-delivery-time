import { Button, Divider, List, message } from 'antd';
import { BetaSchemaForm } from '@ant-design/pro-form';
import { useRef } from 'react';
import HttpRequest from '@/utils/HttpRequest';
import { defaultDomain } from '@/config/domain';

export interface UpdateTopic {
  brokerName: string;
  readQueueNums: number;
  search: boolean;
  writeQueueNums: number;
  topicSynFlag: number;

}
export  interface  MsgDataType {
  msgId: string;
  sendStatus: string;
  queueOffset: string;
  messageQueue: string;
  offsetMsgId: string;
  regionId: string;
  traceOn: string
}



export  function SendMessage(props: { record: { sv: boolean; topic: string; }; }) {

  const formRef = useRef();



  async function doSendMsg(p: any) {
    const res = await HttpRequest({
      baseURL: defaultDomain,
      url: '/topic/sendTopicMessage.do',
      method: 'POST',
      params: p,
    });
    // @ts-ignore
    const status = res.status;
    if (status === 0) {
      const curData = res.data;
      const data = curData as MsgDataType;
      const dataList = [];
      dataList.push('sendStatus:\t' + data.sendStatus);
      dataList.push('msgId:\t' + data.msgId);
      dataList.push('queueOffset:\t' + data.queueOffset);
      dataList.push('offsetMsgId:\t' + data.offsetMsgId);
      dataList.push('regionId:\t' + data.regionId);
      dataList.push('traceOn:\t' + data.traceOn);
      message.info({
          content:
            <List
              header={<Divider orientation="right">
                <Button type="link" onClick={() => {
                  message.destroy();
                }}>关闭</Button></Divider>
              }
              size="small"
              bordered
              dataSource={dataList}
              renderItem={item => <List.Item>{item}</List.Item>}
            />,
        duration:0,
        icon:<></>,
        })
      return true;
    } else {
      message.error("发送消息失败！" + res.errMsg);
      return false;
    }
  }

  const sendMsgColumns = [
    { title: 'topic', dataIndex: 'topic', readonly: true,initialValue: props.record.topic },
    { title: 'tag', dataIndex: 'tag',initialValue:"*" },
    { title: 'key', dataIndex: 'key',initialValue:"*" },
    { title: 'messageBody', dataIndex: 'messageBody',valueType:'textarea',
      formItemProps: {
        rules: [{ required: true, message: '请输入发送的消息' }],
      }
    },
  ];


  return (
    <BetaSchemaForm<UpdateTopic>
      formRef={formRef}
      key='sendMessage'
      title={'[' + props.record.topic + ']发送消息'}
      trigger={
        <Button type="link">发送消息</Button>
      }
      layoutType='ModalForm'
      width={800}
      onFinish={async (values) => {
        return await doSendMsg(values);
      }}
      onVisibleChange={(async (v) => {
        props.record.sv = v;
      })}
      // @ts-ignore
      columns={sendMsgColumns} />
  )

}
