import {useRef, useState} from 'react';
import {Button, Form, Input, message, Select, Switch} from 'antd';
import HttpRequest from "@/utils/HttpRequest";
import {defaultDomain} from "@/config/domain";
import {ModalForm, ProFormInstance} from '@ant-design/pro-form';

interface ConsumerInfoType {
  groupName: string,
  retryQueueNums: number,
  consumeEnable: boolean,
  consumeBroadcastEnable: boolean,
  brokerId: number,
  whichBrokerWhenConsumeSlowly: number,
}

interface RecordType {
  group: string,
  uv: boolean
}

interface IProps {
  record: RecordType
}

export function UpdateConsumer(props: IProps) {


  const [groupConf, setGroupConf] = useState<ConsumerInfoType>({} as ConsumerInfoType);
  const [brokerNameList, setBrokerNameList] = useState([]);


  const ref = useRef<ProFormInstance>();

  async function getConsumerInfo() {
    const res = await HttpRequest({
      baseURL: defaultDomain,
      url: '/consumer/examineSubscriptionGroupConfig.query?consumerGroup=' + props.record.group,
      method: 'GET',
      params: {},
    });
    console.log("subscriptionGroupConfig res=", res);
    // @ts-ignore
    const data = res.data[0];
    const subscriptionGroupConfig = data?.subscriptionGroupConfig;
    const brokerList = data?.brokerNameList;
    setGroupConf({...subscriptionGroupConfig});
    setBrokerNameList(brokerList);
    const brList = [];
    for (const i in brokerList) {
      brList.push({
        key: brokerList[i],
        label: brokerList[i],
        value: brokerList[i]})
    }
    ref.current?.setFieldsValue(
      {...subscriptionGroupConfig}
    )
    ref.current?.setFieldsValue(
      {
        brokerName: brList,
      }
    )
    setGroupConf({
      ...subscriptionGroupConfig
    });

    console.log(">Config=", subscriptionGroupConfig, "groupConf=", groupConf)
  }

  function doSelect(v: any) {
    console.log("change=", v);

  }

  async function doUpdateConsumer(v: any) {
    // console.log("search=", v)
    let p = {
      subscriptionGroupConfig: v,
      brokerNameList: v.brokerName
    }

    const res = await HttpRequest({
      baseURL: defaultDomain,
      url: "/consumer/createOrUpdate.do",
      method: 'POST',
      params: p,
    });
    // console.log("res=", res);
    const status = res.status;
    if (status === 0) {
      message.error("更新成功");
    } else {
      message.error("更新失败:" + res.errMsg);
    }
  }


  return (
    <ModalForm
      layout="horizontal"
      labelAlign="right"
      labelCol={{span: 12}}
      formRef={ref}
      formKey={"UpdateConsumerView"}
      key="UpdateConsumerView"
      title={`[${props.record.group}]修改订阅`}
      onVisibleChange={(v => {
          props.record.uv = v;
          if (props.record.uv) {
            getConsumerInfo();
          }
        }
      )}

      trigger={
        <Button type="link">
          修改订阅
        </Button>
      }
      width="600px"
      onFinish={async (v) => {
        await doUpdateConsumer(v);
        return true;
      }}
    >
      <Form.Item label="brokerName" name="brokerName" rules={[{required: true}]}
      >
        <Select disabled={true} onChange={doSelect} mode="multiple">
          {brokerNameList.map((item) => <Select.Option value={item} key={item} selected>{item}</Select.Option>)}
        </Select>
      </Form.Item>


      <Form.Item label={"groupName"} name="groupName" rules={[{required: true}]}
      >
        <Input readOnly={true}/>
      </Form.Item>
      <Form.Item label={"consumeEnable"} name="consumeEnable" valuePropName="checked">
        <Switch/>
      </Form.Item>
      <Form.Item label={"consumeBroadcastEnable"} valuePropName="checked" name="consumeBroadcastEnable"
      >
        <Switch/>
      </Form.Item>

      <Form.Item label={"retryQueueNums"} name="retryQueueNums" rules={[{required: true}]}
      >
        <Input/>
      </Form.Item>

      <Form.Item label={"brokerId"} name="brokerId" rules={[{required: true}]}
      >
        <Input/>
      </Form.Item>

      <Form.Item label={"whichBrokerWhenConsumeSlowly"} name="whichBrokerWhenConsumeSlowly"
                 rules={[{required: true}]}
      >
        <Input/>
      </Form.Item>
    </ModalForm>
  );
};

export default UpdateConsumer;
