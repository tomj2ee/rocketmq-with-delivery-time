import { Button, Form, message, Select } from 'antd';
import { ModalForm } from '@ant-design/pro-form';
import HttpRequest from '@/utils/HttpRequest';
import { defaultDomain } from '@/config/domain';
import { useState } from 'react';

export  function DeleteGroupView(prop: { record: { dv: boolean; group: string; }; action: any  }) {
  const [form] = Form.useForm();

  const [brokerData, setBrokerData] = useState([]);

  // @ts-ignore

  return (
    <ModalForm
      form={form} name="control-hooks"
      key="deleteGroupView"
      title={`[${prop.record.group}]Delete`}
      onVisibleChange={(async v => {
        prop.record.dv = v;
        const res = await HttpRequest({
          baseURL: defaultDomain,
          url: '/consumer/fetchBrokerNameList.query?consumerGroup=' + prop.record.group,
          method: 'GET',
          params: {},
        });

        if (res.status == 0) {
          // @ts-ignore
          const data = res.data;
          console.log("res=", data);
          setBrokerData(data);
        } else {
          setBrokerData([])
        }
      })}
      trigger={
        <Button type="link" danger>
          删除
        </Button>
      }

      width="80%"
      onFinish={async (v) => {
        console.log("v=", v)
        ///consumer/deleteSubGroup.do
        //{"groupName":"BMW_test1_GID_dts_goods_topic_a","brokerNameList":["broker-v"]}
        const p = {
          groupName: prop.record.group,
          "brokerNameList": v.group
        }
        const res = await HttpRequest({
          baseURL: defaultDomain,
          url: '/consumer/deleteSubGroup.do' + prop.record.group,
          method: 'POST',
          params: p,
        });

        if (res.status == 0) {
          // @ts-ignore
          message.success("删除成功！")
          prop.action?.reload();
        } else {
          message.error("删除失败！")
        }
        return true;
      }}
    >


      <Form.Item name="group" label="broker" rules={[{ required: true }]}>
        <Select
          mode="multiple"
          placeholder="Select a broker"
          allowClear
        >
          {
            brokerData.map((k) => <option label={k} value={k} />)
          }

        </Select>
      </Form.Item>

    </ModalForm>
  )
}
