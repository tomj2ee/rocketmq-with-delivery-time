
import Footer from '@/components/Footer';
import { RunTimeLayoutConfig } from '@@/plugin-layout/layoutExports';


// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({  }) => {
  return {
    rightContentRender: () => <div />,
    disableContentMargin: false,
    waterMarkProps: {
      content: '',
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
     // const { location } = history;
      // 如果没有登录，重定向到 login
     // if (!initialState?.currentUser && location.pathname !== loginPath) {
        //history.push(loginPath);
     // }
    },
    links: [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children: any) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
        </>
      );
    },
  };
};
