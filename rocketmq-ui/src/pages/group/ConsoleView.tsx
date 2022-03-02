import { Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import { ModalForm } from '@ant-design/pro-form';
import HttpRequest from '@/utils/HttpRequest';
import { defaultDomain } from '@/config/domain';

export  function ConsoleView(prop: { record: { cv: boolean; group: string; }; }) {

  // @ts-ignore

  return (
    <ModalForm
      key="consoleView"
      title={`[${prop.record.group}]终端`}
      onVisibleChange={(v => {
        prop.record.cv = v;
      })}
      trigger={
        <Button  type="link">
          终端
        </Button>
      }
      width="80%"
      onFinish={async () => true}
    >

      <ProTable
        rowKey="clientId"
        search={false}
        toolbar={[]}
        toolBarRender={false}
        scroll={{ x: 800 }}
        pagination={{ pageSize: 200 }}
        // @ts-ignore
        request={async (params) => {
          if (prop.record.cv) {
            const res = await HttpRequest({
              baseURL: defaultDomain,
              url: '/consumer/consumerConnection.query?consumerGroup='+ prop.record.group,
              method: 'GET',
              params: params,
            });

            // @ts-ignore
            const data = res.data;
            console.log("res=",data);
            return { data: data.connectionSet };
          }
        }}
        columns={[
          { title: 'ClientId', dataIndex: 'clientId', search: false },
          { title: 'ClientAddr', dataIndex: 'clientAddr', search: false },
          { title: 'Language', dataIndex: 'language', search: false },
          {title: 'Version', dataIndex: 'versionDesc', search: false }
        ]} />
    </ModalForm>
  )

}
