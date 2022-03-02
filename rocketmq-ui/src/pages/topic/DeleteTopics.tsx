import { Button, message } from 'antd';
import Popconfirm from 'antd/es/popconfirm';
import HttpRequest from '@/utils/HttpRequest';
import { defaultDomain } from '@/config/domain';

export interface UpdateTopic {

  group: string;
  time: string;
}



export function DeleteTopics(props: { record: { sv: boolean; topic: string; }; action:any }) {

 async function  deleteTopic() {
   const res = await HttpRequest({
     baseURL: defaultDomain,
     url: 'topic/deleteTopic.do?topic=' + props.record.topic,
     method: 'POST',
     params: {},
   });
   // @ts-ignore
   const status = res.status;
   if (status === 0) {
     props.action?.reload();
   }else{
     message.error("删除topic失败！");
   }
 }

  return (
    <Popconfirm
      title='是否删除主题?'
      onConfirm={() => {
        deleteTopic();
        return true;
      }}
      okText='Yes'
      cancelText='No'
    >
      <Button type="link" danger>删除主题</Button>
    </Popconfirm>
  );

}
