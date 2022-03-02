import {Button, Form, message, Select, Table} from 'antd';
import {ModalForm, ProFormDateTimePicker} from '@ant-design/pro-form';
import HttpRequest from '@/utils/HttpRequest';
import {defaultDomain} from '@/config/domain';
import {useState} from "react";


export function ResetPoint(props: { record: { doRv: boolean; topic: string; }; }) {

  const [groupList, setGroupList] = useState([]);

  async function doGetGroup() {
    const res = await HttpRequest({
      baseURL: defaultDomain,
      url: '/topic/queryTopicConsumerInfo.query?topic=' + props.record.topic,
      method: 'GET',
      params: {},
    });
    // @ts-ignore
    const data = res.data;
    const itemList = data?.groupList;
    const dataList = [];
    if (itemList) {
      for (const i in itemList) {
        dataList.push(itemList[i]);
      }
    }
    // @ts-ignore
    setGroupList(dataList);
    return dataList;
  }

  async function resetPoint(values: any) {
    const g = [];
    if (values.group) {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-for-in-array
      for (const i in values.group) {
        // @ts-ignore
        g.push(values.group[i]);
      }
    }else{
      message.error("请选择订阅组！");
      return ;
    }

    if(values.resetTime.trim().length<=0){
      message.error("请选择时间！");
      return;
    }
    const p = {
      force: true,
      resetTime: new Date(values.resetTime).getTime(),
      topic: props.record.topic,
      consumerGroupList: g
    }
    const res = await HttpRequest({
      baseURL: defaultDomain,
      url: 'consumer/resetOffset.do',
      method: 'POST',
      params: p,
    });
    // @ts-ignore
    const status = res.status;
    if (status === 0) {
      const curData = res.data;
      const dataList = [];
      for (const i in curData) {
        const d = curData[i];
        dataList.push({key: i + " \t" + d.status});
        const rollbackStatsList = d.rollbackStatsList;
        if (rollbackStatsList) {
          for (const r in rollbackStatsList) {
            dataList.push({key: JSON.stringify(rollbackStatsList[r])})
          }
        }
      }

      // @ts-ignore
      message.info({
        content:
          <Form style={{width: '800px'}}
                     title={"重设消息"}

                     key={props.record.topic}
                     onFinish={async () => {
                       return true;
                     }}
          >
            <Table key={"k" + Math.random().toString()}
                   rowKey={"r" + Math.random().toString()}
                   columns={[
                     {title: '重设消费点', align: 'center', dataIndex: 'key', key: 'key'}
                   ]}
                   bordered={true}
                   style={{
                     border: 'solid 1px #E3E3E3',
                     paddingBottom:'20px'
                   }}
                   pagination={false}
                   dataSource={dataList || []}/>
            <Form.Item >
              <Button  style={{marginTop:"15px"} } onClick={()=> message.destroy()} >关闭</Button>
            </Form.Item>
          </Form>
        ,
        duration: 0,
        icon: <></>,
      })
      return true;
    } else {
      message.error("重设消息失败！" + res.errMsg);
      return false;
    }
  }


  return (

    <ModalForm
      key={props.record.topic}
      title='重置位点'
      trigger={
        <Button type="link"
                danger>重置消费点</Button>
      }

      onVisibleChange={(async (v) => {
        props.record.doRv = v;
        if (props.record.doRv) {
          await doGetGroup();
        }
      })}

      onFinish={resetPoint}
    >


      <Form.Item label="订阅组" name="group"  rules={[{required: true}]}>
        <Select mode="multiple" >
          {
            groupList.map((item) => <Select.Option value={item} key={item}>{item}</Select.Option>)
          }
        </Select>
      </Form.Item>

      <Form.Item label="时间点" name="resetTime"   rules={[{required: true}]}>
        <ProFormDateTimePicker/>
      </Form.Item>

    </ModalForm>


  );

}
