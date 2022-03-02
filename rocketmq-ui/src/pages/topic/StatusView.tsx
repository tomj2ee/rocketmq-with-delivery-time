import { Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import HttpRequest from '@/utils/HttpRequest';
import { defaultDomain } from '@/config/domain';
import { ModalForm } from '@ant-design/pro-form';
import { FormatDateTime } from '@/utils/DateTime';

export  function StatusView(prop: { record: { vv: boolean; topic: string; }; }) {

  return (
    <ModalForm
      key="status"
      title={`[${prop.record.topic}]状态`}
      onVisibleChange={(v => {
        prop.record.vv = v;
      })}
      trigger={
        <Button  type="link">
          状态
        </Button>
      }
      width="80%"
      onFinish={async () => true}
    >

      <ProTable
        rowKey="status_tab"
        search={false}
        toolbar={[]}
        toolBarRender={false}
        scroll={{ x: 800 }}
        pagination={{ pageSize: 200 }}
        request={async (params) => {
          if (prop.record.vv === true) {
            const res = await HttpRequest({
              baseURL: defaultDomain,
              url: '/topic/stats.query?topic=' + prop.record.topic,
              method: 'GET',
              params: params,
            });
            // @ts-ignore
            const data = res.data;
            console.log(">>>>>>>>>>", data)
            const itemList = data?.offsetTable;
            const dataList = [];
            if (itemList) {
              for (const i in itemList) {
                dataList.push({
                  topic: i,
                  lastUpdateTimestamp: itemList[i].lastUpdateTimestamp,
                  maxOffset: itemList[i].maxOffset,
                  minOffset: itemList[i].minOffset,
                });
              }
            }
            return { ...data, data: dataList };
          }
        }}
        columns={[
          { title: '队列', dataIndex: 'topic', search: false },
          { title: '最小位点', dataIndex: 'minOffset', search: false },
          { title: '最大位点', dataIndex: 'maxOffset', search: false },
          {
            title: '上次更新时间', dataIndex: 'lastUpdateTimestamp', search: false,
            render: (dom: any, record: { lastUpdateTimestamp: number; }) =>
              <div>{FormatDateTime(record.lastUpdateTimestamp / 1000)}</div>
          }
        ]} />
    </ModalForm>
  )

}
