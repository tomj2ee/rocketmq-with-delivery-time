export default [
  {
    path: '/topic',
    name: 'Topic 管理',
    icon: 'SecurityScanOutlined',
    component: './topic/Topic',
  },
  {
    path: '/group',
    name: 'Group 管理',
    icon: 'ExceptionOutlined',
    component: './group/Group',
  },
  {
    path: '/message',
    name: '消息查询',
    icon: 'UsergroupAddOutlined',
    component: './message/Message',
  },
  /**
  {
    path: '/trace',
    name: '消息轨迹',
    icon: 'PieChartOutlined',
    component: './Trace',
  },
  {
    path: '/dieQueue',
    name: '死信队列',
    icon: 'SendOutlined',
    component: './DieQueue',
  },
*/

  {
    path: '/',
    redirect: '/topic',
  },
  {
    component: './404',
  },
];
