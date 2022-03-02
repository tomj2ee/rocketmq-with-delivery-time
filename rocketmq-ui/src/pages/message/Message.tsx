import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Button, DatePicker, Form, Input, message, Select, Table} from 'antd';
import ProTable from '@ant-design/pro-table';
import HttpRequest from "@/utils/HttpRequest";
import {defaultDomain} from "@/config/domain";
import moment from "moment";
import {FormatDateTime} from "@/utils/DateTime";

const {RangePicker} = DatePicker;

const Message: React.FC = () => {

  const [hideMe, setHideMe] = useState("none");
  const [msgHide, setMsgHide] = useState("");
  const [msgLabel, setMsgLabel] = useState("Message Key");
  const [groupList, setGroupList] = useState([]);
  const [keyRequire, setKeyRequire] = useState(false);
  const [timeRequire, setTimeRequire] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  // @ts-ignore
  useEffect(async () => {

    const res = await HttpRequest({
      baseURL: defaultDomain,
      url: '/topic/list.query',
      method: 'GET',
      params: {},
    });
    console.log("res=", res);
    // @ts-ignore
    const data = res.data;
    const itemList = data?.topicList;
    // @ts-ignore
    const dList = [];
    if (itemList) {
      for (const i in itemList) {
        let d = itemList[i];
        if (!(d.startsWith("%SYS%") || d.startsWith("%RETRY%")
          || d.startsWith("RMQ_SYS_TRANS_HALF_TOPIC")
          || d.startsWith("DefaultCluster_REPLY_TOPIC")
          || d.startsWith("SCHEDULE_TOPIC_XXXX")
        )

        ) {
          dList.push(itemList[i]);
        }
      }
    }
    // @ts-ignore
    setGroupList(dList);
  }, [])

  function doSelect(v: any) {
    console.log("vvv=", v);
    if (v == 3) {
      setHideMe("");
      setMsgHide("none");
      setTimeRequire(true);
      setKeyRequire(false);
    } else {
      setMsgHide("");
      setHideMe("none");
      setTimeRequire(false);
      setKeyRequire(true);
      if (v == 1) {
        setMsgLabel("Message Key");
      } else if (v == 2) {
        setMsgLabel("Message ID");
      }
    }
  }

  function bindProp(record: { properties: any; proList: any; }) {
    let p = record.properties;
    const dataList = []
    if (p) {
      for (const i in p) {
        console.log(i, p[i])
        dataList.push({key: i, value: p[i]});
      }
    }
    record.proList = dataList;
  }

  async function doSearch(v: any) {
    console.log("search=", v);
    ///message/queryMessageByTopicAndKey.query?key=gggg&topic=user_event
    ///message/queryMessageByTopic.query?begin=1642405320000&end=1642412520000&topic=user_event
    ///message/viewMessage.query?msgId=gg&topic=user_event

    let searchType = v.searchType;
    let topic = v.topic;
    let messageKey = v.messageKey;
    let timeRange = v.timeRange;
    let url = "";
    if (searchType == 1) {
      url = "/message/queryMessageByTopicAndKey.query?key=" + messageKey + "&topic=" + topic;
    } else if (searchType == 2) {
      url = "/message/viewMessage.query?msgId=" + messageKey + "&topic=" + topic;
    } else if (searchType == 3) {
      let begin = timeRange[0].valueOf();
      let end = timeRange[1].valueOf();
      url = "/message/queryMessageByTopic.query?begin=" + begin + "&end=" + end + "&topic=" + topic;
    }

    const res = await HttpRequest({
      baseURL: defaultDomain,
      url: url,
      method: 'GET',
      params: {},
    });
    console.log("res=", res);
    // @ts-ignore
    const status = res.status;
    let dataList = [];
    if (status === 0) {
      if (searchType == 1 || searchType == 2) {
        const messageView = res.data.messageView;
        if (messageView) {
          messageView.strProp = JSON.stringify(messageView.properties)
          bindProp(messageView);
          dataList.push(messageView);
        }
      } else {
        const resData = res.data;
        if (resData) {
          for (const i in resData) {
            const messageView = resData[i];
            bindProp(messageView);
            messageView.strProp = JSON.stringify(messageView.properties)
            dataList.push(messageView);
          }
        }
      }
      // @ts-ignore
      setDataSource(dataList);
      console.log(">>>", dataList);
    } else {
      message.error("查询不到数据");
      setDataSource([]);
    }
  }

  return (
    <PageContainer>
      <Form
        name="wrap"
        labelCol={{flex: '110px'}}
        labelAlign="left"
        wrapperCol={{flex: 1}}
        colon={false}
        onFinish={doSearch}
      >

        <Input.Group compact>
          <Form.Item label="查询方式：" name="searchType" rules={[{required: true}]}
                     style={{display: 'inline-block', width: 'calc(20% - 8px)'}}
          >
            <Select onChange={doSelect}>
              <Select.Option value="1" selected>按照Message Key查询</Select.Option>
              <Select.Option value="2">按照Message Id查询</Select.Option>
              <Select.Option value="3">按照Topic查询</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Topic" name="topic" rules={[{required: true}]}
                     style={{display: 'inline-block', width: 'calc(20% - 8px)', marginLeft: '10px'}}>
            <Select>
              {
                groupList.map((item) => <Select.Option value={item} key={item}>{item}</Select.Option>)
              }
            </Select>
          </Form.Item>


          <Form.Item label={msgLabel} name="messageKey" rules={[{required: keyRequire}]}
                     style={{display: msgHide, width: 'calc(20% - 8px)', marginLeft: '10px'}}
          >
            <Input/>
          </Form.Item>

          <Form.Item label="时间范围" name="timeRange" rules={[{required: timeRequire}]}
                     style={{display: hideMe, width: 'calc(30% - 8px)', marginLeft: '10px'}}
          >
            <RangePicker
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [
                  moment('00:00:00', 'HH:mm:ss'),
                  moment('11:59:59', 'HH:mm:ss')
                ],
              }}
              format="YYYY-MM-DD HH:mm:ss"/>
          </Form.Item>

          <Form.Item label="  " style={{marginLeft: '10px'}}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Input.Group>
        <Form.Item>
          <ProTable
            rowKey='msgId'
            key={"msgId"}
            dataSource={dataSource}
            search={false}
            scroll={{x: 800}}
            pagination={{pageSize: 20}}
            toolBarRender={false}
            // @ts-ignore
            columns={[
              {title: '消息ID',align:'center',  width: 180,dataIndex: 'msgId', key: 'messageId',
                render: (text, record) => (
                  <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
                    {text}
                  </div>
                )
              },
              {title: '发送主机',align:'center', dataIndex: 'bornHost', width: 100, key: 'bornHost'},
              {title: 'commitLog\r\n偏移',align:'center', dataIndex: 'commitLogOffset', width: 150, key: 'commitLogOffset'},
              {title: '生成时间',align:'center', dataIndex: 'bornTimestamp',  width: 150,key: 'bornTimestamp',
                render: (dom: any, record: { bornTimestamp: number; }) =>
                  <div>{FormatDateTime(record.bornTimestamp / 1000)}</div>
              },
              {
                title: '消息属性',align:'center', width: 200, dataIndex: 'strProp', key: 'properties',
                render: (text, record) => {
                  // @ts-ignore
                  return (<Table key={"k" + Math.random().toString()}
                                 rowKey={"r" + Math.random().toString()}
                                 columns={[
                                   {title: 'key',align:'center', dataIndex: 'key', key: 'key'},
                                   {title: 'value',align:'center', dataIndex: 'value', key: 'value'}
                                 ]}
                                 bordered={true}
                                 style={{
                                   border: 'solid 1px #E3E3E3'
                                 }}
                                 pagination={false}
                      // @ts-ignore
                                 dataSource={record.proList || []}/>
                  )
                }
              },
              {title: '消息内容',align:'center', dataIndex: 'messageBody', key: 'messageBody',
                render: (text, record) => (
                  <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
                    {text}
                  </div>
                )

              },
            ]}
          />
        </Form.Item>
      </Form>
    </PageContainer>
  );
};

export default Message;
